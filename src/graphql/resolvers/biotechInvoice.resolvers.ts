import { Context } from "../../types/context";
import { Resolvers } from "../generated";

import { toDollar } from "../../helper/money";
import { checkAllowCustomerOnlyPermission, checkBiotechInvoicePermission } from "../../helper/accessControl";
import { InvoicePaymentDisplayStatus, InvoicePaymentStatus } from "../../helper/constant";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  BiotechInvoice: {
    biotech_invoice_items: async (parent, _, context) => {
      invariant(parent.id, 'Invoice ID not found.');
      const invoiceItems = await context.prisma.biotechInvoiceItem.findMany({
        where: {
          biotech_invoice_id: parent.id,
        },
      });

      return invoiceItems.map((invoiceItem) => {
        return {
          ...invoiceItem,
          amount: toDollar(invoiceItem.amount.toNumber()),
        }
      });
    },
    payment_status: async (parent, _, context) => {
      if (parent.payment_status === InvoicePaymentStatus.UNPAID && new Date() > parent.due_at) {
        return InvoicePaymentDisplayStatus.PAYMENT_DUE;
      }
      return parent.payment_status as string;
    },
    purchase_order: async (parent, _, context) => {
      invariant(parent.id, 'Invoice ID not found.');
      return await context.prisma.purchaseOrder.findFirst({
        where: {
          biotech_invoice_id: parent.id,
        },
      });
    },
    blanket_purchase_order_transaction: async (parent, _, context) => {
      invariant(parent.id, 'Invoice ID not found.');
      const blanketPurchaseOrderTransaction = await context.prisma.blanketPurchaseOrderTransaction.findFirst({
        where: {
          biotech_invoice_id: parent.id,
        },
      });
      return blanketPurchaseOrderTransaction ? { ...blanketPurchaseOrderTransaction, amount: toDollar(blanketPurchaseOrderTransaction.amount.toNumber()) } : null;
    },
    biotech: async (parent, _, context) => {
      invariant(parent.biotech_id, 'Biotech ID not found.');

      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id,
        },
      });
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
    biotechInvoices: async (_, __, context) => {
      await checkAllowCustomerOnlyPermission(context);

      const currentCustomer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id
        },
      });

      return await context.prisma.biotechInvoice.findMany({
        where: {
          biotech_id: currentCustomer?.biotech_id,
        }
      });
    },
    biotechInvoice: async (_, args, context) => {
      const { id } = args;
      await checkBiotechInvoicePermission(context, id);

      return await context.prisma.biotechInvoice.findFirst({
        where: {
          id
        }
      });
    },
  },
};

export default resolvers;
