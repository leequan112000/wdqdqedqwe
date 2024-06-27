import { createMailData, sendMail } from './config';
import type { QuoteNoticeData } from './types';
import {
  quoteExpiredNoticeTemplate,
  quoteExpiringNoticeTemplate,
  quoteNoticeTemplate,
} from './templates';
import {
  BulkEmailJobData,
  createBulkEmailJobData,
  createBulkSendMailJobs,
} from '../queues/sendMail.queues';

export const sendQuoteNoticeEmail = async (
  emailData: QuoteNoticeData,
  receiverEmail: string,
) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: quoteNoticeTemplate,
    dynamicTemplateData: {
      sender_name: emailData.sender_name,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
      action: emailData.action,
      quotation_url: emailData.quotation_url,
    },
  });

  await sendMail(mailData);
};

type BulkQuoteExpiringNoticeEmailData = BulkEmailJobData<{
  receiver_full_name: string;
  button_url: string;
  expiring_in: string;
  list_data: Array<{
    project_request_title: string;
    quotes: Array<{
      short_id: string;
      vendor_full_name: string;
    }>;
  }>;
  more_count?: number;
  view_more_url?: string;
}>;

export const bulkQuoteExpiringNoticeEmail = async (
  data: BulkQuoteExpiringNoticeEmailData,
) => {
  const bulks = createBulkEmailJobData(data, quoteExpiringNoticeTemplate);
  return await createBulkSendMailJobs(bulks);
};

type BulkQuoteExpiredNoticeEmailData = BulkEmailJobData<{
  receiver_full_name: string;
  button_url: string;
  list_data: Array<{
    project_request_title: string;
    quotes: Array<{
      short_id: string;
      vendor_full_name: string;
    }>;
  }>;
  more_count?: number;
  view_more_url?: string;
}>;

export const bulkQuoteExpiredNoticeEmail = async (
  data: BulkQuoteExpiredNoticeEmailData,
) => {
  const bulks = createBulkEmailJobData(data, quoteExpiredNoticeTemplate);
  return await createBulkSendMailJobs(bulks);
};
