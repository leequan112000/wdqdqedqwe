import moment from 'moment';
import { app_env } from '../environment';
import { prisma } from '../prisma';
import currency from 'currency.js';
import {
  bulkBiotechInvoicePaymentOverdueNoticeEmail,
  bulkBiotechInvoicePaymentReminderEmail,
} from '../mailer/biotechInvoice';
import {
  createBiotechInvoicePaymentOverdueNotificationJob,
  createBiotechInvoicePaymentReminderNotificationJob,
} from '../notification/biotechInvoiceNotification';
import { createNotificationQueueJob } from '../queues/notification.queues';
import {
  createInvoicePaymentOverdueNoticeEmailJob,
  createInvoicePaymentReminderEmailJob,
} from '../queues/email.queues';
import {
  CompanyCollaboratorRoleType,
  InvoicePaymentStatus,
} from '../helper/constant';

const today = moment();

async function sendInvoicePaymentReminder(
  dueDate: moment.Moment,
  duePeriod: string,
  overdue: boolean,
) {
  const invoices = await prisma.invoice.findMany({
    where: {
      due_at: {
        gte: dueDate.startOf('day').toDate(),
        lt: dueDate.endOf('day').toDate(),
      },
      payment_status: {
        in: [InvoicePaymentStatus.UNPAID, InvoicePaymentStatus.FAILED],
      },
    },
    include: {
      invoice_items: true,
    },
  });

  await Promise.all(
    invoices.map(async (invoice) => {
      const totalAmount = invoice.invoice_items.reduce(
        (acc, cur) => acc + cur.amount.toNumber(),
        0,
      );
      if (overdue) {
        createInvoicePaymentOverdueNoticeEmailJob({
          invoiceId: invoice.id,
          vendorCompanyId: invoice.vendor_company_id,
          overduePeriod: duePeriod,
          invoiceDate: moment(invoice.created_at).format('ll'),
          invoiceTotalAmount: currency(totalAmount, {
            fromCents: true,
          }).format(),
        });
      } else {
        createInvoicePaymentReminderEmailJob({
          invoiceId: invoice.id,
          vendorCompanyId: invoice.vendor_company_id,
          invoiceDueAt: moment(invoice.due_at).format('ll'),
          invoiceDate: moment(invoice.created_at).format('ll'),
          duePeriod,
          invoiceTotalAmount: currency(totalAmount, {
            fromCents: true,
          }).format(),
        });
      }
    }),
  );
}

async function sendBiotechInvoicePaymentReminder(
  dueDate: moment.Moment,
  duePeriod: string,
  overdue: boolean,
) {
  const biotechInvoices = await prisma.biotechInvoice.findMany({
    where: {
      due_at: {
        gte: dueDate.startOf('day').toDate(),
        lt: dueDate.endOf('day').toDate(),
      },
      payment_status: {
        in: [InvoicePaymentStatus.UNPAID, InvoicePaymentStatus.FAILED],
      },
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
                    },
                  },
                },
              },
            },
          },
        },
      },
      biotech: true,
    },
  });

  await Promise.all(
    biotechInvoices.map(async (biotechInvoice) => {
      const totalAmount = biotechInvoice.biotech_invoice_items.reduce(
        (acc, item) => acc + item.amount.toNumber(),
        0,
      );
      const receivers = await prisma.customer.findMany({
        where: {
          biotech_id: biotechInvoice.biotech_id,
          role: {
            in: [
              CompanyCollaboratorRoleType.OWNER,
              CompanyCollaboratorRoleType.ADMIN,
            ],
          },
          user: {
            OR: [
              { deactivated_at: null },
              {
                deactivated_at: {
                  gt: new Date(),
                },
              },
            ],
          },
        },
        include: {
          user: true,
        },
      });

      if (overdue) {
        const emailData = receivers.map((r) => ({
          emailData: {
            invoice_date: moment(biotechInvoice.created_at).format('ll'),
            invoice_number: biotechInvoice.invoice_number,
            invoice_total_amount: currency(totalAmount, {
              fromCents: true,
            }).format(),
            biotech_company_name: biotechInvoice.biotech.name,
            overdue_period: duePeriod,
            button_url: `${app_env.APP_URL}/app/invoices/${biotechInvoice.id}`,
          },
          receiverEmail: r.user.email,
        }));
        const notificationData = receivers.map((r) => {
          return createBiotechInvoicePaymentReminderNotificationJob({
            recipient_id: r.user_id,
            invoice_id: biotechInvoice.id,
            invoice_number: biotechInvoice.invoice_number,
            project_title: biotechInvoice.biotech_invoice_items[0].milestone
              ?.quote.project_connection.project_request.title as string,
            due_at: moment(biotechInvoice.due_at).format('ll'),
          });
        });
        bulkBiotechInvoicePaymentOverdueNoticeEmail(emailData);
        createNotificationQueueJob({ data: notificationData });
      } else {
        const emailData = receivers.map((r) => ({
          emailData: {
            invoice_date: moment(biotechInvoice.created_at).format('ll'),
            invoice_number: biotechInvoice.invoice_number,
            invoice_total_amount: currency(totalAmount, {
              fromCents: true,
            }).format(),
            biotech_company_name: biotechInvoice.biotech.name,
            due_at: moment(biotechInvoice.due_at).format('ll'),
            due_period: duePeriod,
            button_url: `${app_env.APP_URL}/app/invoices/${biotechInvoice.id}`,
          },
          receiverEmail: r.user.email,
        }));
        const notificationData = receivers.map((r) => {
          return createBiotechInvoicePaymentOverdueNotificationJob({
            recipient_id: r.user_id,
            invoice_id: biotechInvoice.id,
            invoice_number: biotechInvoice.invoice_number,
            project_title: biotechInvoice.biotech_invoice_items[0].milestone
              ?.quote.project_connection.project_request.title as string,
            overdue_period: duePeriod,
          });
        });
        bulkBiotechInvoicePaymentReminderEmail(emailData);
        createNotificationQueueJob({ data: notificationData });
      }
    }),
  );
}

async function main() {
  const dueDateIn3W = today.clone().add(3, 'w');
  const dueDateIn2W = today.clone().add(2, 'w');
  const dueDateIn1W = today.clone().add(1, 'w');
  const dueDateIn3D = today.clone().add(3, 'd');
  const overDue3D = today.clone().subtract(3, 'd');
  const overDue1W = today.clone().subtract(1, 'w');

  await sendInvoicePaymentReminder(dueDateIn1W, '1 week', false);
  await sendInvoicePaymentReminder(dueDateIn3D, '3 days', false);
  await sendInvoicePaymentReminder(overDue3D, '3 days', true);
  await sendInvoicePaymentReminder(overDue1W, '1 week', true);

  await sendBiotechInvoicePaymentReminder(dueDateIn3W, '3 weeks', false);
  await sendBiotechInvoicePaymentReminder(dueDateIn2W, '2 weeks', false);
  await sendBiotechInvoicePaymentReminder(dueDateIn1W, '1 week', false);
  await sendBiotechInvoicePaymentReminder(dueDateIn3D, '3 days', false);
  await sendBiotechInvoicePaymentReminder(overDue3D, '3 days', true);
  await sendBiotechInvoicePaymentReminder(overDue1W, '1 week', true);

  process.exit(0);
}

main();
