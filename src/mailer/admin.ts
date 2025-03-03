import { Admin } from '@prisma/client';
import { createMailData, sendMail } from './config';
import {
  adminNewCROInterestNoticeTemplate,
  adminZeroAcceptedProjectNoticeTemplate,
  adminGeneralNoticeTemplate,
  adminBiotechInviteVendorNoticeTemplate,
  adminBiotechInvoicePaymentNoticeTemplate,
} from './templates';
import {
  AdminGeneralNoticeData,
  AdminBiotechInviteVendorNoticeData,
} from './types';
import {
  createBulkSendMailJobs,
  createSendMailJob,
  createBulkEmailJobData,
  type BulkEmailJobData,
} from '../queues/sendMail.queues';

type bulkCroInterestAdminNoticeEmailData = BulkEmailJobData<{
  retool_url?: string;
  company_name: string;
  admin_name: string;
}>;

export const bulkCroInterestAdminNoticeEmail = async (
  data: bulkCroInterestAdminNoticeEmailData,
) => {
  const bulks = createBulkEmailJobData(data, adminNewCROInterestNoticeTemplate);
  await createBulkSendMailJobs(bulks);
};

type bulkZeroAcceptedProjectAdminNoticeEmailData = BulkEmailJobData<{
  retool_url?: string;
  date: string;
  admin_name: string;
  zeroAcceptedList?: string;
  lowAcceptanceList?: string;
}>;

export const bulkZeroAcceptedProjectAdminNoticeEmail = async (
  data: bulkZeroAcceptedProjectAdminNoticeEmailData,
) => {
  const bulks = createBulkEmailJobData(
    data,
    adminZeroAcceptedProjectNoticeTemplate,
  );
  await createBulkSendMailJobs(bulks);
};

export const sendAdminGeneralNoticeEmail = async (
  admin: Admin,
  data: AdminGeneralNoticeData,
) => {
  const mailData = createMailData({
    to: admin.email,
    templateId: adminGeneralNoticeTemplate,
    dynamicTemplateData: {
      admin_name: admin.username,
      button_label: data.button_label,
      button_url: data.button_url ?? process.env.RETOOL_PROJECT_URL,
      content_title: data.content_title,
      content_body: data.content_body,
      content_footer: data.content_footer,
      subject: data.subject,
      preheader: data.preheader,
    },
  });

  return sendMail(mailData);
};

export const sendAdminBiotechInviteVendorNoticeEmail = async (
  admin: Admin,
  data: AdminBiotechInviteVendorNoticeData,
) => {
  const mailData = createMailData({
    to: admin.email,
    templateId: adminBiotechInviteVendorNoticeTemplate,
    dynamicTemplateData: {
      admin_name: admin.username,
      retool_url: process.env.RETOOL_PROJECT_URL,
      biotech_name: data.biotech_name,
      inviter_full_name: data.inviter_full_name,
      vendor_company_name: data.vendor_company_name,
      website: data.website,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      project_request_name: data.project_request_name,
    },
  });

  return sendMail(mailData);
};

type AdminBiotechInvoicePaymentNoticeData = {
  invoice_date: string;
  invoice_number: string;
  invoice_total_amount: string;
  project_title: string;
  biotech_company_name: string;
  vendor_company_name: string;
  button_url: string;
};

export const adminBiotechInvoicePaymentNoticeEmail = (
  emailData: AdminBiotechInvoicePaymentNoticeData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: adminBiotechInvoicePaymentNoticeTemplate,
  });
};

type BulkAdminBiotechInvoicePaymentNoticeData =
  BulkEmailJobData<AdminBiotechInvoicePaymentNoticeData>;

export const bulkAdminBiotechInvoicePaymentNoticeEmail = async (
  data: BulkAdminBiotechInvoicePaymentNoticeData,
) => {
  const bulks = createBulkEmailJobData(
    data,
    adminBiotechInvoicePaymentNoticeTemplate,
  );
  createBulkSendMailJobs(bulks);
};

type AdminShortlistSubmissionNotificationData = {
  admin_name: string;
  sourcing_session_id: string;
  project_title: string;
  shortlisted_vendors: Array<{ id: string; company_name: string }>;
  button_url: string;
};
