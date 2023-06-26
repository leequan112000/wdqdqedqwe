import { toDollar } from "../../helper/money";
import { Resolvers, UploadResult } from "../../generated";
import { Context } from "../../types/context";

import { PublicError } from "../errors/PublicError";
import { InternalError } from "../errors/InternalError";

import { createSendUserMilestoneNoticeJob } from "../../queues/email.queues";

import { checkAllowCustomerOnlyPermission, checkAllowVendorOnlyPermission, checkMilestonePermission } from "../../helper/accessControl";
import { MilestoneEventType, MilestonePaymentStatus, MilestoneStatus, ProjectAttachmentDocumentType, PROJECT_ATTACHMENT_DOCUMENT_TYPE, QuoteStatus, SubscriptionStatus } from "../../helper/constant";
import { getStripeInstance } from "../../helper/stripe";
import storeUpload from "../../helper/storeUpload";

const resolvers: Resolvers<Context> = {
  Milestone: {
    project_attachments: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Missing milestone id.')
      }
      const projectAttachments = await context.prisma.projectAttachment.findMany({
        where: {
          milestone_id: parent.id
        },
      });

      return projectAttachments.map((a) => ({
        ...a,
        byte_size: Number(a.byte_size),
        document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[a.document_type],
      }));
    },
  },
  Query: {
    milestone: async (_, args, context) => {
      const { id } = args;
      await checkMilestonePermission(context, id);
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id
        }
      });

      return milestone
        ? {
          ...milestone,
          amount: toDollar(milestone.amount.toNumber())
        }
        : null;
    },
    milestoneCheckoutUrl: async (_, args, context) => {
      const { id, success_url, cancel_url } = args
      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id,
        },
        include: {
          quote: true,
        }
      });
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
        include: {
          biotech: {
            include: {
              subscriptions: {
                where: {
                  status: SubscriptionStatus.ACTIVE
                }
              }
            }
          }
        }
      });

      if (!milestone) {
        throw new PublicError('Milestone not found.');
      }

      if (!customer) {
        throw new PublicError('Customer not found.');
      }

      if (milestone.quote.status !== QuoteStatus.ACCEPTED) {
        throw new PublicError('The quotation must be accepted before proceeding with the payment.');
      }

      if (milestone.payment_status === MilestonePaymentStatus.PAID) {
        throw new PublicError('The milestone has already been paid.');
      }

      const stripe = await getStripeInstance();
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: milestone.title,
                description: milestone.description as string,
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
      const { id, files } = args
      await checkAllowVendorOnlyPermission(context);
      await checkMilestonePermission(context, id);

      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id,
        },
        include: {
          quote: {
            include: {
              project_connection: true
            }
          }
        }
      });

      if (!milestone) {
        throw new PublicError('Milestone not found.');
      }

      let upload_results: UploadResult[] = [];
      let uploadedFiles: Array<{
        key: string;
        filename: string;
        filesize: number;
        contextType: string | undefined;
      }> = [];


      if (files && files.length > 0) {
        const result = await Promise.allSettled(files.map(async (f) => {
          try {
            const uploadData = await f;
            const uploadedFile = await storeUpload(
              uploadData,
              PROJECT_ATTACHMENT_DOCUMENT_TYPE[ProjectAttachmentDocumentType.MILESTONE_FILE],
            );
  
            uploadedFiles.push(uploadedFile);
          } catch (error) {
            throw error;
          }
        }));
  
        if (!result.every(r => r.status === 'fulfilled')) {
          throw new PublicError('Some files failed to upload please try again.');
        }
      }

      return await context.prisma.$transaction(async (trx) => {
        if (uploadedFiles.length > 0) {
          const attachments = await Promise.allSettled(
            uploadedFiles.map(async ({ filesize, filename, key, contextType }) => {
              const attachment = await trx.projectAttachment.create({
                data: {
                  byte_size: filesize,
                  document_type: ProjectAttachmentDocumentType.MILESTONE_FILE,
                  filename,
                  key,
                  project_connection_id: milestone.quote.project_connection_id,
                  milestone_id: milestone.id,
                  content_type: contextType,
                  uploader_id: context.req.user_id,
                }
              });

              return attachment;
            })
          );

          upload_results = attachments.map((f) => {
            if (f.status === 'fulfilled') {
              return {
                success: true,
                data: {
                  ...f.value,
                  byte_size: Number(f.value.byte_size),
                  document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[f.value.document_type],
                },
              };
            }

            return {
              success: false,
              error_message: f.reason.message,
            }
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

        createSendUserMilestoneNoticeJob({
          projectConnectionId: milestone.quote.project_connection_id,
          milestoneTitle: milestone.title,
          quoteId: milestone.quote.id,
          senderUserId: context.req.user_id!,
          milestoneEventType: MilestoneEventType.VENDOR_MARKED_AS_COMPLETE,
        });

        return {
          milestone: {
            ...updatedMilestone,
            amount: updatedMilestone.amount.toNumber(),
          },
          upload_results,
        }
      })
    },
    verifyMilestoneAsCompleted: async (_, args, context) => {
      const { id } = args
      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        include: {
          quote: {
            include: {
              project_connection: true,
            }
          }
        },
        data: {
          status: MilestoneStatus.COMPLETED,
        },
      });

      createSendUserMilestoneNoticeJob({
        projectConnectionId: updatedMilestone.quote.project_connection_id,
        milestoneTitle: updatedMilestone.title,
        quoteId: updatedMilestone.quote.id,
        senderUserId: context.req.user_id!,
        milestoneEventType: MilestoneEventType.BIOTECH_VERIFIED_AS_COMPLETED,
      });

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
  }
}

export default resolvers;
