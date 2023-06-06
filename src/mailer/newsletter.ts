import { createMailData, sendMail } from "./config"
import { blogNewSubscriptionTemplate } from './templates'

export const sendNewSubscriptionEmail = (receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: blogNewSubscriptionTemplate,
  });

  return sendMail(mailData);
}
