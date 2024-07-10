import moment from 'moment';
import currency from 'currency.js';
import { app_env } from '../environment';
import { prisma } from '../prisma';
import {
  CompanyCollaboratorRoleType,
  InvoicePaymentStatus,
} from '../helper/constant';
import {
  bulkBiotechInvoicePaymentOverdueNoticeEmail,
  bulkBiotechInvoicePaymentReminderEmail,
} from '../mailer/biotechInvoice';
import {
  sendInvoicePaymentOverdueNoticeEmail,
  sendInvoicePaymentReminderEmail,
} from '../mailer/invoice';
import {
  createBiotechInvoicePaymentOverdueNotificationJob,
  createBiotechInvoicePaymentReminderNotificationJob,
} from '../notification/biotechInvoiceNotification';
import { createNotificationQueueJob } from '../queues/notification.queues';
import {
  createInvoicePaymentOverdueNotification,
  createInvoicePaymentReminderNotification,
} from '../notification/invoiceNotification';

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
      const vendorCompanyId = invoice.vendor_company_id;
      const totalAmount = invoice.invoice_items.reduce(
        (acc, cur) => acc + cur.amount.toNumber(),
        0,
      );
      const buttonUrl = `${app_env.APP_URL}/app/invoices/${invoice.id}`;
      const invoiceDate = moment(invoice.created_at).format('ll');
      const invoiceTotalAmount = currency(totalAmount, {
        fromCents: true,
      }).format();
      const receivers = await prisma.vendorMember.findMany({
        where: {
          vendor_company_id: vendorCompanyId,
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
          vendor_company: true,
        },
      });
      if (overdue) {
        await Promise.all(
          receivers.map(async (receiver) => {
            await sendInvoicePaymentOverdueNoticeEmail(
              {
                button_url: buttonUrl,
                invoice_date: invoiceDate,
                overdue_period: duePeriod,
                invoice_total_amount: invoiceTotalAmount,
                vendor_company_name: receiver.vendor_company!.name,
              },
              receiver.user.email,
            );

            await createInvoicePaymentOverdueNotification({
              invoice_id: invoice.id,
              invoice_date: invoiceDate,
              recipient_id: receiver.user_id,
              overdue_period: duePeriod,
            });
          }),
        );
      } else {
        const invoiceDueAt = moment(invoice.due_at).format('ll');
        await Promise.all(
          receivers.map(async (receiver) => {
            await sendInvoicePaymentReminderEmail(
              {
                button_url: buttonUrl,
                invoice_date: invoiceDate,
                due_at: invoiceDueAt,
                due_period: duePeriod,
                invoice_total_amount: invoiceTotalAmount,
                vendor_company_name: receiver.vendor_company!.name,
              },
              receiver.user.email,
            );

            await createInvoicePaymentReminderNotification({
              invoice_id: invoice.id,
              invoice_date: invoiceDate,
              recipient_id: receiver.user_id,
              due_at: invoiceDueAt,
            });
          }),
        );
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
