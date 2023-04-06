import { createMailData, sendMail } from "./config";
import type { DocumentUploadNoticeData } from "./types";
import { documentUploadNotice } from "./templates";

export const sendDocumentUploadNoticeEmail = async (emailData: DocumentUploadNoticeData, receiverEmail: string) => {
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
