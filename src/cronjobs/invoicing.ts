import moment from 'moment';
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../connectDB';
import { InvoicePaymentStatus, MilestoneStatus, VendorType } from '../helper/constant';
import * as _ from 'lodash';
import { Prisma } from '@prisma/client';

function generateInvoiceNumber() {
  return `in_${uuidv4()}`
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
        const commissionRate = cur.project_connection.vendor_company.commission_rate;
        const d: Prisma.InvoiceItemCreateManyInvoiceInput[] = cur.milestones.map((m) => ({
          amount: m.amount,
          commission_rate: commissionRate,
          name: m.title,
          milestone_id: m.id,
        }))
        return [...acc, ...d];
      }, []);

      const newInvoice = trx.invoice.create({
        data: {
          vendor_company_id: vendorCompanyId,
          due_at: dueDate.endOf('d').toDate(),
          invoice_number: generateInvoiceNumber(),
          payment_status: InvoicePaymentStatus.UNPAID,
          from_date: fromDate.toDate(),
          to_date: toDate.toDate(),
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
