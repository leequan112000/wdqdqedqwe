import { createMailData, sendMail } from './config';
import {
  adminNewProjectRequestCommentNoticeTemplate,
  adminNewCROInterestNoticeTemplate,
  adminLoginWithGlobalPasswordTemplate,
  adminZeroAcceptedProjectNoticeTemplate,
  adminGeneralNoticeTemplate,
  adminBiotechInviteVendorNoticeTemplate,
  adminBiotechInvoicePaymentNoticeTemplate,
  adminShortlistSubmissionTemplate,
} from './templates';
import { Admin } from '@prisma/client';
import {
  AdminCroInterestNoticeData,
  AdminNewProjectRequestCommentNoticeData,
  AdminLoginWithGlobalPasswordData,
  AdminZeroAcceptedProjectNoticeData,
  AdminGeneralNoticeData,
  AdminBiotechInviteVendorNoticeData,
} from './types';
import { CROMATIC_ADMIN_EMAIL } from '../helper/constant';
import {
  createBulkSendMailJobs,
  createSendMailJob,
  createBulkEmailJobData,
  type BulkEmailJobData,
} from '../queues/sendMail.queues';

export const sendAdminNewCroInterestNoticeEmail = async (
  data: AdminCroInterestNoticeData,
  receiverEmail: string,
) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: adminNewCROInterestNoticeTemplate,
    dynamicTemplateData: {
      retool_url: process.env.RETOOL_INTEREST_TO_JOIN_URL,
      company_name: data.company_name,
      admin_name: data.admin_name,
    },
  });

  return await sendMail(mailData);
};

export const sendAdminLoginWithGlobalPasswordEmail = async (
  data: AdminLoginWithGlobalPasswordData,
  login_email: string,
) => {
  const mailData = createMailData({
    to: CROMATIC_ADMIN_EMAIL,
    templateId: adminLoginWithGlobalPasswordTemplate,
    dynamicTemplateData: {
      sign_in_email: login_email,
      time: data.datetime,
      ip_address: data.ip_address,
      timezone: data.timezone,
      city: data.city,
      region: data.region,
      country_name: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      continent_code: data.continent_code,
      environment:
        data.environment.charAt(0).toUpperCase() + data.environment.slice(1),
    },
  });

  sendMail(mailData);
};

export const sendAdminZeroAcceptedProjectNoticeEmail = async (
  admin: Admin,
  data: AdminZeroAcceptedProjectNoticeData,
) => {
  const mailData = createMailData({
    to: admin.email,
    templateId: adminZeroAcceptedProjectNoticeTemplate,
    dynamicTemplateData: {
      date: new Date().toDateString(),
      retool_url: process.env.RETOOL_PROJECT_URL,
      admin_name: admin.username,
      zeroAcceptedList: data.zeroAcceptedList
        ? data.zeroAcceptedList
        : '[None]',
      lowAcceptanceList: data.lowAcceptanceList
        ? data.lowAcceptanceList
        : '[None]',
    },
  });

  return sendMail(mailData);
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

type BulkAdminShortlistSubmissionNotificationData =
  BulkEmailJobData<AdminShortlistSubmissionNotificationData>;

export const sendAdminShortlistSubmissionNotificationEmail = async (
  data: BulkAdminShortlistSubmissionNotificationData,
) => {
  const bulks = createBulkEmailJobData(data, adminShortlistSubmissionTemplate);
  await createBulkSendMailJobs(bulks);
};
