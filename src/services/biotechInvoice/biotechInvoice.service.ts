import { Milestone, Prisma } from '@prisma/client';
import moment from 'moment';
import currency from 'currency.js';

import { app_env } from '../../environment';
import { bulkNewBiotechInvoiceNoticeEmail } from '../../mailer/biotechInvoice';
import { createNewBiotechInvoiceNotificationJob } from '../../notification/biotechInvoiceNotification';
import { createNotificationQueueJob } from '../../queues/notification.queues';
import { ServiceContext } from '../../types/context';

import { CompanyCollaboratorRoleType, InvoicePaymentStatus } from '../../helper/constant';
import { generateInvoiceNumber, generateInvoiceReferenceId } from '../../helper/invoice';

export type CreateBiotechInvoiceArgs = {
  milestone: Milestone
  biotech_id: string
  payViaStripe: boolean
}

export const createBiotechInvoice = async (args: CreateBiotechInvoiceArgs, context: ServiceContext) => {
  const { milestone, biotech_id, payViaStripe } = args;
  const today = moment();
  const dueDate = today.clone().add(30, 'd');

  const biotechInvoiceItemInputs: Prisma.BiotechInvoiceItemUncheckedCreateWithoutBiotech_invoiceInput = {
    amount: currency(milestone.amount.toNumber(), { fromCents: true }).intValue,
    name: milestone.title,
    milestone_id: milestone.id,
  };

  const biotechInvoice = await context.prisma.biotechInvoice.create({
    data: {
      invoice_number: generateInvoiceNumber(true),
      payment_status: payViaStripe ? InvoicePaymentStatus.PROCESSING : InvoicePaymentStatus.UNPAID,
      due_at: dueDate.endOf('d').toDate(),
      biotech_invoice_items: {
        create: biotechInvoiceItemInputs,
      },
      biotech_id,
      reference_id: generateInvoiceReferenceId(),
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
      project_title: biotechInvoice.biotech_invoice_items[0].milestone?.quote.project_connection.project_request.title as string,
      invoice_number: biotechInvoice.invoice_number,
      invoice_total_amount: currency(totalAmount, { fromCents: true }).format(),
      biotech_company_name: biotechInvoice.biotech.name,
      due_at: moment(biotechInvoice.due_at).format('ll'),
      button_url: `${app_env.APP_URL}/app/invoices/${biotechInvoice.id}`
    },
    receiverEmail: r.user.email,
  }));
  const notificationData = receivers.map((r) => {
    return createNewBiotechInvoiceNotificationJob({
      recipient_id: r.user_id,
      invoice_id: biotechInvoice.id,
      invoice_number: biotechInvoice.invoice_number,
      project_title: biotechInvoice.biotech_invoice_items[0].milestone?.quote.project_connection.project_request.title as string,
    })
  })
  bulkNewBiotechInvoiceNoticeEmail(emailData);
  createNotificationQueueJob({ data: notificationData });

  return biotechInvoice;
}

const biotechInvoiceService = {
  createBiotechInvoice,
};

export default biotechInvoiceService;
