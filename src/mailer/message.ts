import { createMailData, sendMail } from './config';
import type { NewMessageNoticeData } from './types';
import { newMessageNoticeTemplate } from './templates';

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
