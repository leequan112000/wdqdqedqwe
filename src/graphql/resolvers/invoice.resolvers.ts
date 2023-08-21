import { Context } from "../../types/context";
import { Resolvers } from "../../generated";

import { PublicError } from "../errors/PublicError";

import { toDollar } from "../../helper/money";
import { checkAllowVendorOnlyPermission, checkInvoicePermission } from "../../helper/accessControl";
import { InvoicePaymentDisplayStatus, InvoicePaymentStatus, StripeWebhookPaymentType } from "../../helper/constant";
import { getStripeInstance } from "../../helper/stripe";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Invoice: {
    invoice_items: async (parent, _, context) => {
      invariant(parent.id, 'Invoice ID not found.');
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
      invariant(parent.vendor_company_id, 'Vendor company id not found.');

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id,
        },
      });
    },
    total_amount: async (parent, _, context) => {
      invariant(parent.id, 'Invoice ID not found.');
      const invoiceItems = await context.prisma.invoiceItem.findMany({
        where: {
          invoice_id: parent.id,
        },
      });
      const totalAmount = invoiceItems.reduce((acc, item) => acc + item.amount.toNumber(), 0);
      return toDollar(totalAmount);
    },
    total_milestone_amount: async (parent, _, context) => {
      invariant(parent.id, 'Invoice ID not found.');
      const invoiceItems = await context.prisma.invoiceItem.findMany({
        where: {
          invoice_id: parent.id,
        },
      });
      const totalAmount = invoiceItems.reduce((acc, item) => acc + (item.milestone_amount?.toNumber() || 0), 0);
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
      });
    },
    invoiceCheckoutUrl: async (_, args, context) => {
      const { id, success_url, cancel_url } = args
      await checkInvoicePermission(context, id);
      const invoice = await context.prisma.invoice.findFirst({
        where: {
          id
        },
        include: {
          vendor_company: true,
          invoice_items: true,
        }
      });

      invariant(invoice, 'Invoice not found.');

      invariant(
        invoice.payment_status !== InvoicePaymentStatus.PROCESSING,
        new PublicError('The invoice is currently being processed.'),
      );
      invariant(
        invoice.payment_status !== InvoicePaymentStatus.PAID,
        new PublicError('The invoice has already been paid.'),
      );
      invariant(
        invoice.invoice_items && invoice.invoice_items.length > 0,
        new PublicError('The invoice is currently being processed.'),
      );

      const totalPayableAmount = invoice.invoice_items.reduce((acc, item) => acc + item.amount.toNumber(), 0);

      const stripe = await getStripeInstance();
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: invoice!.invoice_number,
                description: `Invoice payment by ${invoice?.vendor_company.legal_name}`,
              },
              unit_amount: totalPayableAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          payment_type: StripeWebhookPaymentType.INVOICE,
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          user_id: context.req.user_id!,
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
};

export default resolvers;
