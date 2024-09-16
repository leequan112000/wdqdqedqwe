import { User } from '@prisma/client';
import { createMailData, sendMail } from './config';
import {
  acceptProjectRequestNoticeTemplate,
  adminNewProjectRequestCommentNoticeTemplate,
  adminNewProjectRequestTemplate,
  privateProjectRequestSubmissionTemplate,
  projectRequestSubmissionTemplate,
  vendorRequestExpiredNoticeTemplate,
  vendorRequestExpiringNoticeTemplate,
} from './templates';
import { app_env } from '../environment';
import {
  BulkEmailJobData,
  createBulkEmailJobData,
  createBulkSendMailJobs,
  createSendMailJob,
} from '../queues/sendMail.queues';
import { getUserEmail } from '../helper/email';

export const sendProjectRequestSubmissionEmail = (receiver: any) => {
  const mailData = createMailData({
    to: getUserEmail(receiver),
    templateId: projectRequestSubmissionTemplate,
    dynamicTemplateData: {
      manage_request_url: `${app_env.APP_URL}/app`,
    },
  });

  sendMail(mailData);
};

export const sendPrivateProjectRequestSubmissionEmail = (receiver: any) => {
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

type BulkVendorProjectRequestExpiredNoticeEmailData = BulkEmailJobData<{
  receiver_full_name: string;
  button_url: string;
  requests: Array<{
    project_request_title: string;
    biotech_full_name: string;
  }>;
}>;

export const bulkVendorProjectRequestExpiredNoticeEmail = async (
  data: BulkVendorProjectRequestExpiredNoticeEmailData,
) => {
  const bulks = createBulkEmailJobData(
    data,
    vendorRequestExpiredNoticeTemplate,
  );
  return await createBulkSendMailJobs(bulks);
};
type BulkVendorProjectRequestExpiringNoticeEmailData = BulkEmailJobData<{
  receiver_full_name: string;
  button_url: string;
  requests: Array<{
    project_request_title: string;
    biotech_full_name: string;
  }>;
}>;

export const bulkVendorProjectRequestExpiringNoticeEmail = async (
  data: BulkVendorProjectRequestExpiringNoticeEmailData,
) => {
  const bulks = createBulkEmailJobData(
    data,
    vendorRequestExpiringNoticeTemplate,
  );
  return await createBulkSendMailJobs(bulks);
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
