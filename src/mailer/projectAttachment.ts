import { createMailData, sendMail } from "./config";
import { contractUploadNoticeTemplate, contractUpdateNoticeTemplate, documentUploadNoticeTemplate } from "./templates";
import type { UploadNoticeData } from "./types";

export const sendDocumentUploadNoticeEmail = async (emailData: UploadNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: documentUploadNoticeTemplate,
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
    templateId: action === 'upload' ? contractUploadNoticeTemplate : contractUpdateNoticeTemplate,
    dynamicTemplateData: {
      login_url: emailData.login_url,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
      company_name: emailData.company_name,
    },
  });

  await sendMail(mailData);
}
