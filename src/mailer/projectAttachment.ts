import { createMailData, sendMail } from "./config";
import { contractUploadNotice, contractUpdateNotice, documentUploadNotice } from "./templates";
import type { UploadNoticeData } from "./types";

export const sendDocumentUploadNoticeEmail = async (emailData: UploadNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: documentUploadNotice,
    dynamicTemplateData: {
      login_url: emailData.login_url,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
      company_name: emailData.company_name,
    },
  });

  await sendMail(mailData);
}

export const sendContractUploadNoticeEmail = async (emailData: UploadNoticeData, receiverEmail: string, action: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: action === 'upload' ? contractUploadNotice : contractUpdateNotice,
    dynamicTemplateData: {
      login_url: emailData.login_url,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
      company_name: emailData.company_name,
    },
  });

  await sendMail(mailData);
}
