import { User } from '@prisma/client';
import {
  acceptProjectRequestNoticeTemplate,
  adminNewProjectRequestCommentNoticeTemplate,
  adminNewProjectRequestTemplate,
  privateProjectRequestSubmissionTemplate,
  projectRequestSubmissionTemplate,
  vendorRequestExpiredNoticeTemplate,
  vendorRequestExpiringNoticeTemplate,
} from './templates';
import {
  VendorProjectRequestExpiredNoticeData,
  VendorProjectRequestExpiringNoticeData,
} from './types';
import { app_env } from '../environment';
import { createMailData, sendMail } from './config';
import {
  BulkEmailJobData,
  createBulkEmailJobData,
  createBulkSendMailJobs,
  createSendMailJob,
} from '../queues/sendMail.queues';

export const sendProjectRequestSubmissionEmail = (receiver: User) => {
  const mailData = createMailData({
    to: receiver.email,
    templateId: projectRequestSubmissionTemplate,
    dynamicTemplateData: {
      manage_request_url: `${app_env.APP_URL}/app`,
    },
  });

  sendMail(mailData);
};

export const sendPrivateProjectRequestSubmissionEmail = (receiver: User) => {
  const mailData = createMailData({
    to: receiver.email,
    templateId: privateProjectRequestSubmissionTemplate,
    dynamicTemplateData: {
      manage_request_url: `${app_env.APP_URL}/app`,
    },
  });

  sendMail(mailData);
};

type AcceptProjectRequestNoticeData = {
  login_url: string;
  vendor_company_name: string;
  project_title: string;
  receiver_full_name: string;
};

export const sendVendorAcceptProjectNoticeEmail = async (
  emailData: AcceptProjectRequestNoticeData,
  receiverEmail: string,
) => {
  return await createSendMailJob({
    emailData,
    receiverEmail,
    templateId: acceptProjectRequestNoticeTemplate,
  });
};

export const sendVendorProjectRequestExpiringEmail = async (
  emailData: VendorProjectRequestExpiringNoticeData,
  receiverEmail: string,
) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: vendorRequestExpiringNoticeTemplate,
    dynamicTemplateData: emailData,
  });

  return await sendMail(mailData);
};

export const sendVendorProjectRequestExpiredEmail = async (
  emailData: VendorProjectRequestExpiredNoticeData,
  receiverEmail: string,
) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: vendorRequestExpiredNoticeTemplate,
    dynamicTemplateData: emailData,
  });

  return await sendMail(mailData);
};

type bulkNewProjectRequestAdminNoticeEmailData = BulkEmailJobData<{
  retool_url?: string;
  biotech_name?: string;
  admin_name: string;
}>;

export const bulkNewProjectRequestAdminNoticeEmail = async (
  data: bulkNewProjectRequestAdminNoticeEmailData,
) => {
  const bulks = createBulkEmailJobData(data, adminNewProjectRequestTemplate);
  return await createBulkSendMailJobs(bulks);
};

type bulkNewProjectRequestCommentAdminNoticeEmailData = BulkEmailJobData<{
  retool_url?: string;
  biotech_name?: string;
  admin_name: string;
  project_request_name: string;
}>;

export const bulkNewProjectRequestCommentAdminNoticeEmail = async (
  data: bulkNewProjectRequestCommentAdminNoticeEmailData,
) => {
  const bulks = createBulkEmailJobData(
    data,
    adminNewProjectRequestCommentNoticeTemplate,
  );
  return await createBulkSendMailJobs(bulks);
};
