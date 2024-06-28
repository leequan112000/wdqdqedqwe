import { createMailData, sendMail } from './config';
import type { NewMessageNoticeData } from './types';
import { newMessageNoticeTemplate } from './templates';
import {
  BulkEmailJobData,
  createBulkEmailJobData,
  createBulkSendMailJobs,
} from '../queues/sendMail.queues';

export const sendNewMessageNoticeEmail = async (
  emailData: NewMessageNoticeData,
  receiverEmail: string,
) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: newMessageNoticeTemplate,
    dynamicTemplateData: {
      button_url: emailData.button_url,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
      company_name: emailData.company_name,
      message_text: emailData.message_text,
    },
  });

  await sendMail(mailData);
};

export type BulkNewMessageNoticeData = BulkEmailJobData<{
  button_url: string;
  receiver_full_name: string;
  project_title: string;
  company_name: string;
  message_text: string;
}>;

export const bulkNewMessageNoticeEmail = async (
  data: BulkNewMessageNoticeData,
) => {
  const bulks = createBulkEmailJobData(data, newMessageNoticeTemplate);
  await createBulkSendMailJobs(bulks);
};
