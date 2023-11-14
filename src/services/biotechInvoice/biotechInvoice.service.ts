import { Milestone, Prisma } from '@prisma/client';
import moment from 'moment';
import currency from 'currency.js';
import { ServiceContext } from '../../types/context';
import { InvoicePaymentStatus } from '../../helper/constant';
import { generateInvoiceNumber, generateInvoiceReferenceId } from '../../helper/invoice';

export type CreateBiotechInvoiceArgs = {
  milestone: Milestone
  biotech_id: string
  paid: boolean
}

export const createBiotechInvoice = async (args: CreateBiotechInvoiceArgs, context: ServiceContext) => {
  const { milestone, biotech_id, paid } = args;
  const today = moment();
  const dueDate = today.clone().add(30, 'd');

  const biotechInvoiceItemInputs: Prisma.BiotechInvoiceItemUncheckedCreateWithoutBiotech_invoiceInput = {
    amount: currency(milestone.amount.toNumber(), { fromCents: true }).intValue,
    name: milestone.title,
    milestone_id: milestone.id,
  };

  const invoice = await context.prisma.biotechInvoice.create({
    data: {
      invoice_number: generateInvoiceNumber(true),
      payment_status: paid ? InvoicePaymentStatus.PAID : InvoicePaymentStatus.UNPAID,
      due_at: dueDate.endOf('d').toDate(),
      biotech_invoice_items: {
        create: biotechInvoiceItemInputs,
      },
      biotech_id,
      reference_id: generateInvoiceReferenceId(),
    },
  });
  
  return invoice;
}

const biotechInvoiceService = {
  createBiotechInvoice,
};

export default biotechInvoiceService;
