import { createSendMailJob } from '../queues/sendMail.queues';
import { blogNewSubscriptionTemplate } from './templates';

export const sendNewSubscriptionEmail = async (receiverEmail: string) => {
  return await createSendMailJob({
    emailData: {},
    receiverEmail,
    templateId: blogNewSubscriptionTemplate,
  });
};
