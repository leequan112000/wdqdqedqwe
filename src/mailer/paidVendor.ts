import { createSendMailJob } from '../queues/sendMail.queues';
import { paidVendorSignUpTemplate } from './templates';

type sendPaidVendorSignUpLinkData = {
  button_url: string;
  company_name: string;
};
export const sendPaidVendorSignUpLink = async (
  emailData: sendPaidVendorSignUpLinkData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: paidVendorSignUpTemplate,
  });
};
