import moment from 'moment';
import { customAlphabet } from 'nanoid';
import prisma from '../prisma';
import { InvoicePaymentStatus, MilestoneStatus } from '../helper/constant';
import * as _ from 'lodash';
import { Prisma } from '@prisma/client';
import currency from 'currency.js';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { createBillingNoticeEmailJob } from '../queues/email.queues';

const argv = yargs(hideBin(process.argv))
  .option('debug', {
    describe: '(Optional) Debug mode. Allow running the script anytime.',
    type: 'boolean',
    default: false, // Default value if the argument is not provided
  })
  .parseSync();

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 18);
function generateInvoiceNumber() {
  return `in_${nanoid()}`
}

const today = moment();
const isFirstDayOfMonth = today.date() === 1;

async function main() {
  const fromDate = today.clone().subtract(1, 'month').startOf('month');
  const toDate = fromDate.clone().endOf('month')
  const dueDate = today.clone().add(2, 'w');

  /**
   * Find vendor companies.
   * Vendor company will start receiving invoice when first payment is made for
   * a milestone.
  */
  const vendorCompanies = await prisma.vendorCompany.findMany({
    where: {
      project_connections: {
        some: {
          quotes: {
            some: {
              milestones: {
                some: {
                  status: MilestoneStatus.COMPLETED,
                },
              },
            },
          },
        },
      },
    },
  });

  const newInvoices = await prisma.$transaction(async (trx) => {
    const loopingVendorCompanyTasks = vendorCompanies.map(async (vendorCompany) => {
      const vendorCompanyId = vendorCompany.id;
      const commissionRate = vendorCompany.commission_rate;

      const milestones = await trx.milestone.findMany({
        where: {
          quote: {
            project_connection: {
              vendor_company_id: vendorCompanyId,
            },
          },
          updated_at: {
            gte: fromDate.toDate(),
            lte: toDate.toDate(),
          },
          status: MilestoneStatus.COMPLETED,
          invoice_item: null,
        },
        include: {
          quote: true,
        },
      });

      const quoteHash = _.groupBy(milestones, 'quote.id');
      const quotes = Object.entries(quoteHash).map(([quoteId, milestones]) => {
        const quoteData = milestones[0].quote;
        return {
          ...quoteData,
          milestones,
        }
      });

      const invoiceItemInputs: Prisma.InvoiceItemCreateManyInvoiceInput[] = quotes.reduce<Prisma.InvoiceItemCreateManyInvoiceInput[]>((acc, cur) => {
        const d: Prisma.InvoiceItemCreateManyInvoiceInput[] = cur.milestones.map((m) => {
          const amount = currency(m.amount.toNumber(), { fromCents: true }).multiply(commissionRate).divide(100);
          return ({
            amount: amount.intValue,
            name: m.title,
            milestone_id: m.id,
            milestone_amount: m.amount,
          })
        })
        return [...acc, ...d];
      }, []);

      // To make the script idempotent. We will not recreate invoice with same from and to date.
      const existingInvoice = await trx.invoice.findFirst({
        where: {
          vendor_company_id: vendorCompanyId,
          from_date: fromDate.toDate(),
          to_date: toDate.toDate(),
        },
        include: {
          invoice_items: true,
        }
      });

      if (existingInvoice) {
        return existingInvoice;
      }

      const newInvoice = await trx.invoice.create({
        data: {
          vendor_company_id: vendorCompanyId,
          due_at: dueDate.endOf('d').toDate(),
          invoice_number: generateInvoiceNumber(),
          payment_status: invoiceItemInputs.length === 0 ? InvoicePaymentStatus.PAID : InvoicePaymentStatus.UNPAID,
          from_date: fromDate.toDate(),
          to_date: toDate.toDate(),
          commission_rate: commissionRate,
          invoice_items: invoiceItemInputs.length > 0
            ? {
              create: invoiceItemInputs,
            }
            : undefined,
        },
        include: {
          invoice_items: true,
        },
      });

      return newInvoice;
    });


    return await Promise.all(loopingVendorCompanyTasks);
  });

  const sendNoticeTasks = newInvoices.map(async (invoice) => {
    const totalAmount = invoice.invoice_items.reduce((acc, cur) => acc + cur.amount.toNumber(), 0);
    const vendorCompany = await prisma.vendorCompany.findFirst({
      where: {
        id: invoice.vendor_company_id,
      },
    });
    const primaryMembers = await prisma.vendorMember.findMany({
      where: {
        vendor_company_id: invoice.vendor_company_id,
        is_primary_member: true,
      },
      include: {
        user: true,
      },
    });

    primaryMembers.map((member) => {
      return createBillingNoticeEmailJob({
        invoiceId: invoice.id,
        invoiceMonth: moment(invoice.from_date).format('MMM YYYY'),
        invoicePeriod: `${moment(invoice.from_date).format('MMM YYYY')} - ${moment(invoice.to_date).format('MMM YYYY')}`,
        invoiceTotalAmount: currency(totalAmount, { fromCents: true }).format(),
        receiverCompanyName: vendorCompany!.name,
        receiverEmail: member.user.email,
        receiverId: member.user.id,
      });
    });
  });

  await Promise.all(sendNoticeTasks);

  process.exit(0);
}

if (argv.debug || isFirstDayOfMonth) {
  main();
} else {
  console.log('Skipping invoicing. Not first day of month');
  process.exit(0);
}
