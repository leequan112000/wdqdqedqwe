import { Resolvers, UploadResult } from '../generated';
import { app_env } from '../../environment';
import { Context } from '../../types/context';
import { PublicError } from '../errors/PublicError';
import { checkPassword } from '../../helper/auth';
import {
  checkAllowCustomerOnlyPermission,
  checkAllowVendorOnlyPermission,
  checkMilestonePermission,
} from '../../helper/accessControl';
import {
  MilestonePaymentStatus,
  MilestoneStatus,
  ProjectAttachmentDocumentType,
  PROJECT_ATTACHMENT_DOCUMENT_TYPE,
  QuoteStatus,
  StripeWebhookPaymentType,
  CasbinObj,
  CasbinAct,
  BlanketPurchaseOrderTransactionType,
} from '../../helper/constant';
import { toCent, toDollar } from '../../helper/money';
import { getStripeInstance } from '../../helper/stripe';
import storeUpload from '../../helper/storeUpload';
import invariant from '../../helper/invariant';
import { hasPermission } from '../../helper/casbin';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { sendMilestoneNoticeEmail } from '../../mailer/milestone';
import { createMilestoneNotification } from '../../notification/milestoneNotification';
import { payVendorJob } from '../../queues/payout.queues';
import { getReceiversByProjectConnection } from '../../queues/utils';
import biotechInvoiceService from '../../services/biotechInvoice/biotechInvoice.service';
import blanketPurchaseOrderService from '../../services/blanketPurchaseOrder/blanketPurchaseOrder.service';
import {
  getEmailFromPseudonyms,
  getUserFullNameFromPseudonyms,
} from '../../helper/email';

const resolvers: Resolvers<Context> = {
  Milestone: {
    project_attachments: async (parent, _, context) => {
      invariant(parent.id, 'Missing milestone id.');
      const projectAttachments =
        await context.prisma.projectAttachment.findMany({
          where: {
            milestone_id: parent.id,
          },
        });

      return projectAttachments.map((a) => ({
        ...a,
        byte_size: Number(a.byte_size),
        document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[a.document_type],
      }));
    },
    quote: async (parent, _, context) => {
      invariant(parent.quote_id, 'Missing quote id.');
      const quote = await context.prisma.quote.findFirst({
        where: {
          id: parent.quote_id,
        },
      });

      return quote
        ? { ...quote, amount: toDollar(quote.amount.toNumber()) }
        : {};
    },
    biotech_invoice_item: async (parent, _, context) => {
      invariant(parent.id, 'Missing milestone id.');
      const biotechInvoiceItem =
        await context.prisma.biotechInvoiceItem.findFirst({
          where: {
            milestone_id: parent.id,
          },
        });

      return biotechInvoiceItem
        ? {
            ...biotechInvoiceItem,
            amount: toDollar(biotechInvoiceItem.amount.toNumber()),
          }
        : null;
    },
  },
  Query: {
    milestone: async (_, args, context) => {
      const { id } = args;
      await checkMilestonePermission(context, id);
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id,
        },
      });

      return milestone
        ? {
            ...milestone,
            amount: toDollar(milestone.amount.toNumber()),
          }
        : null;
    },
    milestoneCheckoutUrl: async (_, args, context) => {
      const { id, success_url, cancel_url } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const allowMakePayment = await hasPermission(
        currentUserId,
        CasbinObj.MILESTONE_PAYMENT,
        CasbinAct.WRITE,
      );
      invariant(allowMakePayment, new PermissionDeniedError());
      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id,
        },
        include: {
          quote: true,
        },
      });
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
        include: {
          biotech: {
            include: {
              subscriptions: true,
            },
          },
        },
      });

      invariant(milestone, new PublicError('Milestone not found.'));
      invariant(customer, new PublicError('Customer not found.'));
      invariant(
        milestone.quote.status === QuoteStatus.ACCEPTED,
        new PublicError(
          'The quote must be accepted before proceeding with the payment.',
        ),
      );
      invariant(
        milestone.payment_status !== MilestonePaymentStatus.PAID,
        new PublicError('The milestone has already been paid.'),
      );

      const stripe = await getStripeInstance();
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: milestone.title,
                description: milestone.description || '-',
              },
              unit_amount: Number(milestone.amount),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer: customer.biotech.subscriptions[0].stripe_customer_id,
        client_reference_id: customer.id,
        metadata: {
          payment_type: StripeWebhookPaymentType.MILESTONE,
          quote_id: milestone.quote_id,
          milestone_id: milestone.id,
        },
        payment_method_types: ['us_bank_account'],
        payment_intent_data: {
          setup_future_usage: 'on_session',
        },
        success_url,
        cancel_url,
      });

      return session.url;
    },
  },
  Mutation: {
    markMilestoneAsCompleted: async (_, args, context) => {
      const { id, files } = args;
      await checkAllowVendorOnlyPermission(context);
      await checkMilestonePermission(context, id);

      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id,
        },
        include: {
          quote: {
            include: {
              project_connection: true,
            },
          },
        },
      });

      invariant(milestone, new PublicError('Milestone not found.'));

      let upload_results: UploadResult[] = [];
      let uploadedFiles: Array<{
        key: string;
        filename: string;
        filesize: number;
        contentType: string | undefined;
      }> = [];

      if (files && files.length > 0) {
        const result = await Promise.allSettled(
          files.map(async (f) => {
            try {
              const uploadData = await f;
              const uploadedFile = await storeUpload(
                uploadData,
                PROJECT_ATTACHMENT_DOCUMENT_TYPE[
                  ProjectAttachmentDocumentType.MILESTONE_FILE
                ],
              );

              uploadedFiles.push(uploadedFile);
            } catch (error) {
              throw error;
            }
          }),
        );

        invariant(
          result.every((r) => r.status === 'fulfilled'),
          new PublicError('Some files failed to upload please try again.'),
        );
      }

      return await context.prisma.$transaction(async (trx) => {
        if (uploadedFiles.length > 0) {
          const attachments = await Promise.allSettled(
            uploadedFiles.map(
              async ({ filesize, filename, key, contentType }) => {
                const attachment = await trx.projectAttachment.create({
                  data: {
                    byte_size: filesize,
                    document_type: ProjectAttachmentDocumentType.MILESTONE_FILE,
                    filename,
                    key,
                    project_connection_id:
                      milestone.quote.project_connection_id,
                    milestone_id: milestone.id,
                    content_type: contentType,
                    uploader_id: context.req.user_id,
                  },
                });

                return attachment;
              },
            ),
          );

          upload_results = attachments.map((f) => {
            if (f.status === 'fulfilled') {
              return {
                success: true,
                data: {
                  ...f.value,
                  byte_size: Number(f.value.byte_size),
                  document_type:
                    PROJECT_ATTACHMENT_DOCUMENT_TYPE[f.value.document_type],
                },
              };
            }

            return {
              success: false,
              error_message: f.reason.message,
            };
          });
        }
        const updatedMilestone = await trx.milestone.update({
          where: {
            id,
          },
          data: {
            status: MilestoneStatus.PENDING_COMPLETION_APPROVAL,
          },
        });
        const projectConnectionId = milestone.quote.project_connection_id;
        const quoteId = milestone.quote.id;
        const currentUserId = context.req.user_id!;
        const { receivers, projectConnection, senderCompanyName } =
          await getReceiversByProjectConnection(
            projectConnectionId,
            context.req.user_id!,
          );
        let milestoneUpdateContent =
          'New milestone completed! Please review and approve for release of payment.';

        await Promise.all(
          receivers.map(async (receiver) => {
            await sendMilestoneNoticeEmail(
              {
                sender_name: senderCompanyName,
                project_title: projectConnection.project_request.title,
                receiver_full_name: getUserFullNameFromPseudonyms(
                  receiver.pseudonyms,
                ),
                milestone_update_content: milestoneUpdateContent,
                milestone_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}/quote/${quoteId}`,
              },
              getEmailFromPseudonyms(receiver.pseudonyms),
            );

            await createMilestoneNotification(
              currentUserId,
              quoteId,
              milestoneUpdateContent,
              receiver.id,
              projectConnection.id,
            );
          }),
        );
        return {
          milestone: {
            ...updatedMilestone,
            amount: toDollar(updatedMilestone.amount.toNumber()),
          },
          upload_results,
        };
      });
    },
    verifyMilestoneAsCompleted: async (_, args, context) => {
      const { id, password } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const allowMakePayment = await hasPermission(
        currentUserId,
        CasbinObj.MILESTONE_PAYMENT,
        CasbinAct.WRITE,
      );
      invariant(allowMakePayment, new PermissionDeniedError());

      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);

      const user = await context.prisma.user.findFirstOrThrow({
        where: {
          id: context.req.user_id,
        },
      });

      const isPasswordMatched = await checkPassword(password, user);

      invariant(
        isPasswordMatched === true,
        new PublicError('Invalid password.'),
      );

      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        include: {
          quote: {
            include: {
              project_connection: true,
            },
          },
        },
        data: {
          status: MilestoneStatus.COMPLETED,
        },
      });

      payVendorJob({ milestoneId: id });
      const projectConnectionId = updatedMilestone.quote.project_connection_id;
      const quoteId = updatedMilestone.quote.id;
      const { receivers, projectConnection, senderCompanyName } =
        await getReceiversByProjectConnection(
          projectConnectionId,
          context.req.user_id!,
        );
      let milestoneUpdateContent =
        'Milestone completion approved! Your payout is now in progress.';

      await Promise.all(
        receivers.map(async (receiver) => {
          await sendMilestoneNoticeEmail(
            {
              sender_name: senderCompanyName,
              project_title: projectConnection.project_request.title,
              receiver_full_name: getUserFullNameFromPseudonyms(
                receiver.pseudonyms,
              ),
              milestone_update_content: milestoneUpdateContent,
              milestone_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}/quote/${quoteId}`,
            },
            getEmailFromPseudonyms(receiver.pseudonyms),
          );

          await createMilestoneNotification(
            currentUserId,
            quoteId,
            milestoneUpdateContent,
            receiver.id,
            projectConnection.id,
          );
        }),
      );

      return {
        ...updatedMilestone,
        amount: toDollar(updatedMilestone.amount.toNumber()),
        quote: {
          ...updatedMilestone.quote,
          amount: toDollar(updatedMilestone.quote.amount.toNumber()),
        },
      };
    },
    payByPurchaseOrder: async (_, args, context) => {
      const { id, po_number } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const allowMakePayment = await hasPermission(
        currentUserId,
        CasbinObj.MILESTONE_PAYMENT,
        CasbinAct.WRITE,
      );
      invariant(allowMakePayment, new PermissionDeniedError());

      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);

      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: currentUserId,
        },
        include: {
          biotech: true,
        },
      });

      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id,
        },
        include: {
          quote: {
            include: {
              project_connection: true,
            },
          },
        },
      });

      invariant(milestone, new PublicError('Milestone not found.'));

      const existingPO = await context.prisma.purchaseOrder.findFirst({
        where: {
          po_number,
          biotech_id: customer?.biotech_id,
        },
      });

      invariant(
        !existingPO,
        new PublicError(
          'Purchase order number already used for another payment. Please verify or contact support.',
        ),
      );

      const existingBPO = await context.prisma.blanketPurchaseOrder.findFirst({
        where: {
          po_number,
          biotech_id: customer?.biotech_id,
        },
      });

      invariant(
        !existingBPO,
        new PublicError(
          "Your purchase order number matches a blanket PO. Please select 'Pay with Blanket PO' instead.",
        ),
      );

      return await context.prisma.$transaction(async (trx) => {
        const invoice = await biotechInvoiceService.createBiotechInvoice(
          {
            milestone,
            biotech_id: customer?.biotech_id as string,
            payViaStripe: false,
          },
          {
            prisma: trx,
          },
        );

        await trx.purchaseOrder.create({
          data: {
            po_number,
            biotech_invoice_id: invoice.id,
            biotech_id: customer?.biotech_id!,
          },
        });

        const updatedMilestone = await trx.milestone.update({
          where: {
            id,
          },
          include: {
            quote: true,
          },
          data: {
            payment_status: MilestonePaymentStatus.PENDING,
          },
        });

        return {
          ...updatedMilestone,
          amount: toDollar(updatedMilestone.amount.toNumber()),
          quote: {
            ...updatedMilestone.quote,
            amount: toDollar(updatedMilestone.quote.amount.toNumber()),
          },
        };
      });
    },
    payByBlanketPurchaseOrder: async (_, args, context) => {
      const { id, blanket_purchase_order_id } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const allowMakePayment = await hasPermission(
        currentUserId,
        CasbinObj.MILESTONE_PAYMENT,
        CasbinAct.WRITE,
      );
      invariant(allowMakePayment, new PermissionDeniedError());

      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);

      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: currentUserId,
        },
        include: {
          biotech: true,
        },
      });

      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id,
        },
        include: {
          quote: {
            include: {
              project_connection: true,
            },
          },
        },
      });

      invariant(milestone, new PublicError('Milestone not found.'));

      const blanketPurchaseOrder =
        await context.prisma.blanketPurchaseOrder.findFirst({
          where: {
            id: blanket_purchase_order_id,
            biotech_id: customer?.biotech_id,
          },
          include: {
            blanket_purchase_order_transactions: true,
          },
        });

      invariant(
        blanketPurchaseOrder,
        new PublicError('Blanket Purchase Order not found.'),
      );
      invariant(
        blanketPurchaseOrder.balance_amount.toNumber() >=
          milestone.amount.toNumber(),
        new PublicError(
          'Insufficient Blanket PO balance. The remaining balance on this Blanket PO is not enough to cover the milestone amount. Please review and adjust the Blanket PO amount',
        ),
      );

      return await context.prisma.$transaction(async (trx) => {
        const invoice = await biotechInvoiceService.createBiotechInvoice(
          {
            milestone,
            biotech_id: customer?.biotech_id as string,
            payViaStripe: false,
          },
          {
            prisma: trx,
          },
        );

        await trx.blanketPurchaseOrderTransaction.create({
          data: {
            amount: milestone.amount,
            transaction_type: BlanketPurchaseOrderTransactionType.DEBIT,
            blanket_purchase_order_id,
            biotech_invoice_id: invoice.id,
            user_id: currentUserId,
          },
        });

        const balanceAmount =
          await blanketPurchaseOrderService.calculateBlanketPurchaseOrderBalanceAmount(
            { id: blanket_purchase_order_id },
            { prisma: trx },
          );
        await trx.blanketPurchaseOrder.update({
          where: {
            id: blanket_purchase_order_id,
          },
          data: {
            balance_amount: toCent(balanceAmount),
          },
        });

        const updatedMilestone = await trx.milestone.update({
          where: {
            id,
          },
          include: {
            quote: true,
          },
          data: {
            payment_status: MilestonePaymentStatus.PENDING,
          },
        });

        return {
          ...updatedMilestone,
          amount: toDollar(updatedMilestone.amount.toNumber()),
          quote: {
            ...updatedMilestone.quote,
            amount: toDollar(updatedMilestone.quote.amount.toNumber()),
          },
        };
      });
    },
  },
};

export default resolvers;
