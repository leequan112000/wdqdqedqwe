import { vendorSurveyReminderTemplate } from './templates';
import { createSendMailJob } from '../queues/sendMail.queues';

type VendorSurveyReminderEmailData = {
  button_url: string;
};

export const vendorSurveyReminderEmail = (
  emailData: VendorSurveyReminderEmailData,
  receiverEmail: string,
) => {
  return createSendMailJob({
    emailData,
    receiverEmail,
    templateId: vendorSurveyReminderTemplate,
  });
};
