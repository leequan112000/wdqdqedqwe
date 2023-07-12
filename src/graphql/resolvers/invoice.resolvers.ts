import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { InternalError } from "../errors/InternalError";
import { toDollar } from "../../helper/money";
import { checkAllowVendorOnlyPermission, checkInvoicePermission } from "../../helper/accessControl";
import { InvoicePaymentDisplayStatus, InvoicePaymentStatus } from "../../helper/constant";

const resolvers: Resolvers<Context> = {
  Invoice: {
    invoice_items: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Invoice ID not found.');
      }
      const invoiceItems = await context.prisma.invoiceItem.findMany({
        where: {
          invoice_id: parent.id,
        },
      });

      return invoiceItems.map((invoiceItem) => {
        return {
          ...invoiceItem,
          amount: toDollar(invoiceItem.amount.toNumber()),
          milestone_amount: toDollar(invoiceItem.milestone_amount?.toNumber() || 0),
        }
      });
    },
    payment_status: async (parent, _, context) => {
      if (parent.payment_status === InvoicePaymentStatus.UNPAID && new Date() > parent.due_at) {
        return InvoicePaymentDisplayStatus.PAYMENT_DUE;
      }
      return parent.payment_status as string;
    },
    vendor_company: async (parent, _, context) => {
      if (!parent.vendor_company_id) {
        throw new InternalError('Vendor company id not found.');
      }

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id,
        },
      });
    },
    total_amount: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Invoice ID not found.');
      }
      const invoiceItems = await context.prisma.invoiceItem.findMany({
        where: {
          invoice_id: parent.id,
        },
      });
      const totalAmount = invoiceItems.reduce((acc, item) => acc + item.amount.toNumber(), 0);
      return toDollar(totalAmount);
    },
  },
  Query: {
    invoices: async (_, __, context) => {
      await checkAllowVendorOnlyPermission(context);

      const currentVendor = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id
        },
      });

      return await context.prisma.invoice.findMany({
        where: {
          vendor_company_id: currentVendor?.vendor_company_id,
        }
      });
    },
    invoice: async (_, args, context) => {
      const { id } = args;
      await checkInvoicePermission(context, id);

      return await context.prisma.invoice.findFirst({
        where: {
          id
        }
      })
    },
  },
};

export default resolvers;
