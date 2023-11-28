import milestoneService from "../../services/milestone/milestone.service";
import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import { CompanyCollaboratorRoleType, InvoicePaymentDisplayStatus, InvoicePaymentStatus } from "../../helper/constant";
import invariant from "../../helper/invariant";
import { toDollar } from "../../helper/money";
import { PublicError } from "../../graphql/errors/PublicError";

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

      const biotechOwner = await context.prisma.customer.findFirst({
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

      invariant(biotechOwner, new PublicError('Biotech owner not found.'));

      return await context.prisma.$transaction(async (trx) => {
        const { updatedBiotechInvoice } = await milestoneService.updateMilestoneAsPaid({
          milestone_id: biotechInvoice.biotech_invoice_items[0].milestone_id as string,
          user_id: biotechOwner.user_id,
        }, { prisma: trx })

        return updatedBiotechInvoice;
      });
    },
  }
};

export default resolvers;
