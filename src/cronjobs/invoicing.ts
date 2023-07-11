import moment from 'moment';
import { customAlphabet } from 'nanoid';
import { prisma } from '../connectDB';
import { InvoicePaymentStatus, MilestoneStatus, VendorType } from '../helper/constant';
import * as _ from 'lodash';
import { Prisma } from '@prisma/client';
import currency from 'currency.js';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 18);
function generateInvoiceNumber() {
  return `in_${nanoid()}`
}

async function main() {
  const today = moment();
  const fromDate = today.clone().subtract(1, 'month').startOf('month');
  const toDate = fromDate.clone().endOf('month')
  const dueDate = today.clone().add(2, 'w');

  const vendorCompanies = await prisma.vendorCompany.findMany({
    where: {
      OR: [
        {
          vendor_type: VendorType.ACADEMIC_LAB,
        },
        {
          vendor_type: VendorType.CRO,
          cda_signed_at: {
            not: null
          },
        }
      ]
    },
  });

  await prisma.$transaction(async (trx) => {
    const loopingVendorCompanyTasks = vendorCompanies.map(async (vendorCompany) => {
      const vendorCompanyId = vendorCompany.id;
      const commissionRate = vendorCompany.commission_rate;
      const quotes = await trx.quote.findMany({
        where: {
          milestones: {
            every: {
              status: MilestoneStatus.COMPLETED,
            },
            some: {
              invoice_items: {
                none: {}
              }
            }
          },
          project_connection: {
            vendor_company_id: vendorCompanyId,
          },
        },
        include: {
          milestones: true,
          project_connection: {
            include: {
              vendor_company: true
            },
          },
        },
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
          payment_status: InvoicePaymentStatus.UNPAID,
          from_date: fromDate.toDate(),
          to_date: toDate.toDate(),
          commission_rate: commissionRate,
          invoice_items: invoiceItemInputs.length > 0
            ? {
              create: invoiceItemInputs,
            }
            : undefined,
        },
      });

      return newInvoice;
    });


    return await Promise.all(loopingVendorCompanyTasks);
  });

  process.exit(0);
}

main();
