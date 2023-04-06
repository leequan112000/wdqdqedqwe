import { createMailData, sendMail } from "./config";
import type { FileUploadNoticeData } from "./types";
import { fileUploadNotice } from "./templates";

export const sendFileUploadNoticeEmail = async (emailData: FileUploadNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: fileUploadNotice,
    dynamicTemplateData: {
      login_url: emailData.login_url,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
      company_name: emailData.company_name,
    },
  });

  await sendMail(mailData);
}
