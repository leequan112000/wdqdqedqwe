import currency from "currency.js";
import moment from "moment";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";

import { toDollar } from "../../helper/money";
import { checkAllowCustomerOnlyPermission, checkBiotechInvoicePermission } from "../../helper/accessControl";
import { AdminTeam, BIOTECH_INVOICE_ATTACHMENT_DOCUMENT_TYPE, BiotechInvoiceAttachmentDocumentType, InvoicePaymentDisplayStatus, InvoicePaymentStatus } from "../../helper/constant";
import invariant from "../../helper/invariant";
import storeUpload from "../../helper/storeUpload";
import { deleteObject } from "../../helper/awsS3";

import { PublicError } from "../errors/PublicError";

import { bulkAdminBiotechInvoicePaymentNoticeEmail } from "../../mailer/admin";

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
    biotechInvoices: async (_, args, context) => {
      const { has_paid } = args;
      await checkAllowCustomerOnlyPermission(context);

      const currentCustomer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id
        },
      });

      const baseFilter: any = {
        biotech_id: currentCustomer?.biotech_id,
      };

      if (has_paid !== undefined) {
        baseFilter.payment_status = has_paid ? InvoicePaymentStatus.PAID : { not: InvoicePaymentStatus.PAID };
      }

      return await context.prisma.biotechInvoice.findMany({
        where: baseFilter
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
  Mutation: {
    uploadBiotechInvoicePaymentReceipt: async (_, args, context) => {
      const { file, id } = args;
      await checkBiotechInvoicePermission(context, id);

      const biotechInvoice = await context.prisma.biotechInvoice.findFirst({
        where: {
          id
        },
        include: {
          biotech_invoice_items: {
            include: {
              milestone: {
                include: {
                  quote: {
                    include: {
                      project_connection: {
                        include: {
                          vendor_company: true,
                          project_request: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          biotech: true,
        }
      });

      invariant(biotechInvoice, 'Invoice not found.');

      const data = await file;
      const { filename, key, filesize, contentType } = await storeUpload(
        data,
        BIOTECH_INVOICE_ATTACHMENT_DOCUMENT_TYPE[BiotechInvoiceAttachmentDocumentType.PAYMENT_RECEIPT],
      );

      const existingAttachment = await context.prisma.biotechInvoiceAttachment.findFirst({
        where: {
          biotech_invoice_id: id,
          document_type: BiotechInvoiceAttachmentDocumentType.PAYMENT_RECEIPT,
        },
      });

      invariant(filesize <= 10000000, new PublicError('File size must be less than 10MB.'));

      let attachment;
      if (existingAttachment) {
        attachment = await context.prisma.biotechInvoiceAttachment.update({
          data: {
            byte_size: filesize,
            filename,
            key,
            uploader_id: context.req.user_id,
            content_type: contentType,
          },
          where: {
            id: existingAttachment.id,
          },
        });

        await deleteObject(existingAttachment.key);
      } else {
        attachment = await context.prisma.biotechInvoiceAttachment.create({
          data: {
            byte_size: filesize,
            document_type: BiotechInvoiceAttachmentDocumentType.PAYMENT_RECEIPT,
            filename,
            key,
            biotech_invoice_id: id,
            uploader_id: context.req.user_id,
            content_type: contentType,
          },
        });
      }

      const totalAmount = biotechInvoice.biotech_invoice_items.reduce((acc, item) => acc + item.amount.toNumber(), 0);
      const admins = await context.prisma.admin.findMany({
        where: {
          team: AdminTeam.SCIENCE,
        },
      });

      const emailData = admins.map((admin) => ({
        emailData: {
          invoice_date: moment(biotechInvoice.created_at).format('ll'),
          invoice_number: biotechInvoice.invoice_number,
          invoice_total_amount: currency(totalAmount, { fromCents: true }).format(),
          project_title: biotechInvoice.biotech_invoice_items[0].milestone?.quote.project_connection.project_request.title as string,
          biotech_company_name: biotechInvoice.biotech.name,
          vendor_company_name: biotechInvoice.biotech_invoice_items[0].milestone?.quote.project_connection.vendor_company.name as string,
          button_url: process.env.RETOOL_PROJECT_URL as string,
        },
        receiverEmail: admin.email,
      }));

      bulkAdminBiotechInvoicePaymentNoticeEmail(emailData);

      return await context.prisma.biotechInvoice.update({
        where: {
          id,
        },
        data: {
          payment_status: InvoicePaymentStatus.PROCESSING
        }
      });
    },
  },
};

export default resolvers;
