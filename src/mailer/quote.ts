import { createMailData, sendMail } from "./config";
import type { QuotationNoticeData } from "./types";
import { quotationNoticeTemplate } from "./templates";

export const sendQuotationNoticeEmail = async (emailData: QuotationNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: quotationNoticeTemplate,
    dynamicTemplateData: {
      sender_name: emailData.sender_name,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
      action: emailData.action,
      quotation_url: emailData.quotation_url,
    },
  });

  await sendMail(mailData);
}