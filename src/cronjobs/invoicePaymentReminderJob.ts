import moment from 'moment';
import { prisma } from '../connectDB';
import currency from 'currency.js';
import { InvoicePaymentStatus } from '../helper/constant';
import { createInvoicePaymentOverdueNoticeEmailJob, createInvoicePaymentReminderEmailJob } from '../queues/email.queues';

const today = moment();

async function sendInvoicePaymentReminder(dueDate: moment.Moment, duePeriod: string, overdue: boolean) {
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
      const totalAmount = invoice.invoice_items.reduce((acc, cur) => acc + cur.amount.toNumber(), 0);
      if (overdue) {
        createInvoicePaymentOverdueNoticeEmailJob({
          invoiceId: invoice.id,
          vendorCompanyId: invoice.vendor_company_id,
          overduePeriod: duePeriod,
          invoiceDate: moment(invoice.created_at).format('ll'),
          invoiceTotalAmount: currency(totalAmount, { fromCents: true }).format(),
        });
      } else {
        createInvoicePaymentReminderEmailJob({
          invoiceId: invoice.id,
          vendorCompanyId: invoice.vendor_company_id,
          invoiceDueAt: moment(invoice.due_at).format('ll'),
          invoiceDate: moment(invoice.created_at).format('ll'),
          duePeriod,
          invoiceTotalAmount: currency(totalAmount, { fromCents: true }).format(),
        });
      }
    })
  );
}

async function main() {
  const dueDateIn1W = today.clone().add(1, 'w');
  const dueDateIn3D = today.clone().add(3, 'd');
  const overDue3D = today.clone().subtract(3, 'd');
  const overDue1W = today.clone().subtract(1, 'w');

  await sendInvoicePaymentReminder(dueDateIn1W, '1 week', false);
  await sendInvoicePaymentReminder(dueDateIn3D, '3 days', false);
  await sendInvoicePaymentReminder(overDue3D, '3 days', true);
  await sendInvoicePaymentReminder(overDue1W, '1 week', true);

  process.exit(0);
}

main();
