import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import { InvoicePaymentDisplayStatus, InvoicePaymentStatus } from "../../helper/constant";
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
        }
      });

      invariant(biotechInvoice, new PublicError('Biotech invoice not found.'));
      invariant(biotechInvoice.purchase_order || biotechInvoice.blanket_purchase_order_transaction, new PublicError('This invoice is paid via ACH'));
      invariant(biotechInvoice.payment_status !== InvoicePaymentStatus.PAID, new PublicError('Invoice has already paid'));
      invariant(biotechInvoice.payment_status === InvoicePaymentStatus.PROCESSING, new PublicError('Invoice payment status invalid to perform this action'));

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
