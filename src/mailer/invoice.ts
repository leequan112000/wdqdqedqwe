import { createMailData, sendMail } from "./config";
import { BillingNoticeData, InvoicePaymentNoticeData, InvoicePaymentOverdueNoticeData, InvoicePaymentReminderData } from "./types";
import { billingNoticeTemplate, invoicePaymentNoticeTemplate, invoicePaymentOverdueNoticeTemplate, invoicePaymentReminderTemplate } from "./templates";

export const sendBillingNoticeEmail = async (emailData: BillingNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: billingNoticeTemplate,
    dynamicTemplateData: emailData,
  });

  return await sendMail(mailData);
}

export const sendInvoicePaymentNoticeEmail = async (emailData: InvoicePaymentNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: invoicePaymentNoticeTemplate,
    dynamicTemplateData: emailData,
  });

  return await sendMail(mailData);
}

export const sendInvoicePaymentReminderEmail = async (emailData: InvoicePaymentReminderData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: invoicePaymentReminderTemplate,
    dynamicTemplateData: emailData,
  });

  return await sendMail(mailData);
}

export const sendInvoicePaymentOverdueNoticeEmail = async (emailData: InvoicePaymentOverdueNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: invoicePaymentOverdueNoticeTemplate,
    dynamicTemplateData: emailData,
  });

  return await sendMail(mailData);
}
