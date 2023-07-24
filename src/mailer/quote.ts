import { createMailData, sendMail } from "./config";
import type { QuoteExpiredNoticeData, QuoteExpiringNoticeData, QuoteNoticeData } from "./types";
import { quoteExpiredNoticeTemplate, quoteExpiringNoticeTemplate, quoteNoticeTemplate } from "./templates";

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

export const sendQuoteExpiringNoticeEmail = async (emailData: QuoteExpiringNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: quoteExpiringNoticeTemplate,
    dynamicTemplateData: {
      receiver_full_name: emailData.receiver_full_name,
      button_url: emailData.button_url,
      expiring_in: emailData.expiring_in,
      quotes: emailData.quotes,
    },
  });

  return await sendMail(mailData);
}

export const sendQuoteExpiredNoticeEmail = async (emailData: QuoteExpiredNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: quoteExpiredNoticeTemplate,
    dynamicTemplateData: {
      receiver_full_name: emailData.receiver_full_name,
      button_url: emailData.button_url,
      quotes: emailData.quotes,
    },
  });

  return await sendMail(mailData);
}
