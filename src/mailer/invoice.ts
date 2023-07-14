import { createMailData, sendMail } from "./config";
import { BillingNoticeData } from "./types";
import { billingNoticeTemplate } from "./templates";

export const sendBillingNoticeEmail = async (emailData: BillingNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: billingNoticeTemplate,
    dynamicTemplateData: emailData,
  });

  return await sendMail(mailData);
}
