import { createMailData, sendMail } from "./config";
import type { QuoteNoticeData } from "./types";
import { quoteNoticeTemplate } from "./templates";

export const sendQuoteNoticeEmail = async (emailData: QuoteNoticeData, receiverEmail: string) => {
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
}