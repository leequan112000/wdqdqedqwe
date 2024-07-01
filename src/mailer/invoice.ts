import { createMailData, sendMail } from './config';
import {
  BillingNoticeData,
  InvoicePaymentNoticeData,
  InvoicePaymentOverdueNoticeData,
  InvoicePaymentReminderData,
} from './types';
import {
  billingNoticeTemplate,
  invoicePaymentNoticeTemplate,
  invoicePaymentOverdueNoticeTemplate,
  invoicePaymentReminderTemplate,
} from './templates';
import { createSendMailJob } from '../queues/sendMail.queues';

export const sendBillingNoticeEmail = async (
  emailData: BillingNoticeData,
  receiverEmail: string,
) => {
  return await createSendMailJob({
    emailData,
    receiverEmail,
    templateId: billingNoticeTemplate,
  });
};

export const sendInvoicePaymentNoticeEmail = async (
  emailData: InvoicePaymentNoticeData,
  receiverEmail: string,
) => {
  await createSendMailJob({
    emailData,
    receiverEmail,
    templateId: invoicePaymentNoticeTemplate,
  });
};

export const sendInvoicePaymentReminderEmail = async (
  emailData: InvoicePaymentReminderData,
  receiverEmail: string,
) => {
  return await createSendMailJob({
    emailData,
    receiverEmail,
    templateId: invoicePaymentReminderTemplate,
  });
};

export const sendInvoicePaymentOverdueNoticeEmail = async (
  emailData: InvoicePaymentOverdueNoticeData,
  receiverEmail: string,
) => {
  return await createSendMailJob({
    emailData,
    receiverEmail,
    templateId: invoicePaymentOverdueNoticeTemplate,
  });
};
