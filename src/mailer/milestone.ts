import { createMailData, sendMail } from './config';
import type { MilestoneNoticeData } from './types';
import { milestoneNoticeTemplate } from './templates';
import { createSendMailJob } from '../queues/sendMail.queues';

export const sendMilestoneNoticeEmail = async (
  emailData: MilestoneNoticeData,
  receiverEmail: string,
) => {
  return await createSendMailJob({
    emailData,
    receiverEmail,
    templateId: milestoneNoticeTemplate,
  });
};
