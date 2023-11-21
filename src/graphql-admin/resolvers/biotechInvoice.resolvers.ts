import currency from "currency.js";
import moment from "moment";
import { app_env } from "../../environment";
import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import { CompanyCollaboratorRoleType, InvoicePaymentDisplayStatus, InvoicePaymentStatus } from "../../helper/constant";
import invariant from "../../helper/invariant";
import { toDollar } from "../../helper/money";
import { PublicError } from "../../graphql/errors/PublicError";

import { bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail } from "../../mailer/biotechInvoice";
import { createNotificationQueueJob } from "../../queues/notification.queues";
import { createBiotechInvoicePaymentVerifiedNotificationJob } from "../../notification/biotechInvoiceNotification";

const resolvers: Resolvers<Context> = {
  BiotechInvoice: {
    payment_status: async (parent, _, context) => {
      if (parent.payment_status === InvoicePaymentStatus.UNPAID && new Date() > parent.due_at) {
        return InvoicePaymentDisplayStatus.PAYMENT_DUE;
      }
      return parent.payment_status as string;
    },
    total_amount: async (parent, _, context) => {
      invariant(parent.id, 'Invoice ID not found.');
      const invoiceItems = await context.prisma.biotechInvoiceItem.findMany({
        where: {
          biotech_invoice_id: parent.id,
        },
      });
      const totalAmount = invoiceItems.reduce((acc, item) => acc + item.amount.toNumber(), 0);
      return toDollar(totalAmount);
    },
    biotech_invoice_attachment: async (parent, _, context) => {
      invariant(parent.id, 'Invoice ID not found.');
      const attachment = await context.prisma.biotechInvoiceAttachment.findFirst({
        where: {
          biotech_invoice_id: parent.id,
        },
      });

      return attachment ? { ...attachment, byte_size: Number(attachment.byte_size) } : {};
    },
  },
  Query: {
    verificationPendingBiotechInvoices: async (_, __, context) => {
      return await context.prisma.biotechInvoice.findMany({
        where: {
          payment_status: InvoicePaymentStatus.PROCESSING,
          OR: [
            { purchase_order: { isNot: null } },
            { blanket_purchase_order_transaction: { isNot: null } },
          ],
        }
      });
    },
    paidBiotechInvoices: async (_, __, context) => {
      return await context.prisma.biotechInvoice.findMany({
        where: {
          payment_status: InvoicePaymentStatus.PAID,
        }
      });
    },
    biotechInvoice: async (_, args, context) => {
      const { id } = args;
      return await context.prisma.biotechInvoice.findFirst({
        where: {
          id
        }
      });
    },
  },
  Mutation: {
    verifyBiotechInvoicePayment: async (_, args, context) => {
      const { invoice_id } = args;

      const biotechInvoice = await context.prisma.biotechInvoice.findFirst({
        where: {
          id: invoice_id,
        },
        include: {
          purchase_order: true,
          blanket_purchase_order_transaction: true,
          biotech_invoice_items: true,
          biotech: true,
        }
      });

      invariant(biotechInvoice, new PublicError('Biotech invoice not found.'));
      invariant(biotechInvoice.purchase_order || biotechInvoice.blanket_purchase_order_transaction, new PublicError('This invoice is paid via ACH'));
      invariant(biotechInvoice.payment_status !== InvoicePaymentStatus.PAID, new PublicError('Invoice has already paid'));
      invariant(biotechInvoice.payment_status === InvoicePaymentStatus.PROCESSING, new PublicError('Invoice payment status invalid to perform this action'));

      const receivers = await context.prisma.customer.findMany({
        where: {
          biotech_id: biotechInvoice.biotech_id,
          role: CompanyCollaboratorRoleType.OWNER,
          user: {
            is_active: true,
          },
        },
        include: {
          user: true,
        }
      });

      const totalAmount = biotechInvoice.biotech_invoice_items.reduce((acc, item) => acc + item.amount.toNumber(), 0);
      const emailData = receivers.map((r) => ({
        emailData: {
          invoice_date: moment(biotechInvoice.created_at).format('ll'),
          invoice_number: biotechInvoice.invoice_number,
          invoice_total_amount: currency(totalAmount, { fromCents: true }).format(),
          biotech_company_name: biotechInvoice.biotech.name,
          button_url: `${app_env.APP_URL}/app/invoices/${biotechInvoice.id}`
        },
        receiverEmail: r.user.email,
      }));
      const notificationData = receivers.map((r) => {
        return createBiotechInvoicePaymentVerifiedNotificationJob({
          recipient_id: r.user_id,
          invoice_id: biotechInvoice.id,
          invoice_number: biotechInvoice.invoice_number,
          invoice_total_amount: currency(totalAmount, { fromCents: true }).format(),
        })
      })
      bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail(emailData);
      createNotificationQueueJob({ data: notificationData });

      return await context.prisma.biotechInvoice.update({
        where: {
          id: invoice_id,
        },
        data: {
          payment_status: InvoicePaymentStatus.PAID,
        }
      });
    },
  }
};

export default resolvers;
