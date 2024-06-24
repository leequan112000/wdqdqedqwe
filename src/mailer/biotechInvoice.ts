import {
  biotechInvoicePaymentOverdueNoticeTemplate,
  biotechInvoicePaymentReminderTemplate,
  biotechInvoicePaymentVerifiedByCromaticAdminTemplate,
  newBiotechInvoiceNoticeTemplate,
} from './templates';
import {
  createBulkSendMailJobs,
  createSendMailJob,
  createBulkEmailJobData,
} from '../queues/sendMail.queues';

type NewBiotechInvoiceNoticeData = {
  project_title: string;
  invoice_number: string;
  invoice_total_amount: string;
  biotech_company_name: string;
  due_at: string;
  button_url: string;
};

export const newBiotechInvoiceNoticeEmail = (
  emailData: NewBiotechInvoiceNoticeData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: newBiotechInvoiceNoticeTemplate,
  });
};

type BulkNewBiotechInvoiceNoticeData = {
  emailData: NewBiotechInvoiceNoticeData;
  receiverEmail: string;
};

export const bulkNewBiotechInvoiceNoticeEmail = async (
  data: BulkNewBiotechInvoiceNoticeData[],
) => {
  const bulks = createBulkEmailJobData(data, newBiotechInvoiceNoticeTemplate);
  createBulkSendMailJobs(bulks);
};

type BiotechInvoicePaymentReminderData = {
  invoice_date: string;
  invoice_number: string;
  invoice_total_amount: string;
  biotech_company_name: string;
  due_at: string;
  due_period: string;
  button_url: string;
};

export const biotechInvoicePaymentReminderEmail = (
  emailData: BiotechInvoicePaymentReminderData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: biotechInvoicePaymentReminderTemplate,
  });
};

type BulkBiotechInvoicePaymentReminderData = {
  emailData: BiotechInvoicePaymentReminderData;
  receiverEmail: string;
};

export const bulkBiotechInvoicePaymentReminderEmail = async (
  data: BulkBiotechInvoicePaymentReminderData[],
) => {
  const bulks = createBulkEmailJobData(
    data,
    biotechInvoicePaymentReminderTemplate,
  );
  createBulkSendMailJobs(bulks);
};

type BiotechInvoicePaymentOverdueNoticeData = {
  invoice_date: string;
  invoice_number: string;
  invoice_total_amount: string;
  biotech_company_name: string;
  overdue_period: string;
  button_url: string;
};

export const biotechInvoicePaymentOverdueNoticeEmail = (
  emailData: BiotechInvoicePaymentOverdueNoticeData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: biotechInvoicePaymentOverdueNoticeTemplate,
  });
};

type BulkBiotechInvoicePaymentOverdueNoticeDataData = {
  emailData: BiotechInvoicePaymentOverdueNoticeData;
  receiverEmail: string;
};

export const bulkBiotechInvoicePaymentOverdueNoticeEmail = async (
  data: BulkBiotechInvoicePaymentOverdueNoticeDataData[],
) => {
  const bulks = createBulkEmailJobData(
    data,
    biotechInvoicePaymentOverdueNoticeTemplate,
  );
  createBulkSendMailJobs(bulks);
};

type BiotechInvoicePaymentVerifiedByCromaticAdminData = {
  invoice_date: string;
  invoice_number: string;
  invoice_total_amount: string;
  biotech_company_name: string;
  button_url: string;
};

export const biotechInvoicePaymentVerifiedByCromaticAdminEmail = (
  emailData: BiotechInvoicePaymentVerifiedByCromaticAdminData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: biotechInvoicePaymentVerifiedByCromaticAdminTemplate,
  });
};

type BulkBiotechInvoicePaymentVerifiedByCromaticAdminData = {
  emailData: BiotechInvoicePaymentVerifiedByCromaticAdminData;
  receiverEmail: string;
};

export const bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail = async (
  data: BulkBiotechInvoicePaymentVerifiedByCromaticAdminData[],
) => {
  const bulks = createBulkEmailJobData(
    data,
    biotechInvoicePaymentVerifiedByCromaticAdminTemplate,
  );
  createBulkSendMailJobs(bulks);
};
