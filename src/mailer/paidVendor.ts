import { createSendMailJob } from '../queues/sendMail.queues';
import { paidVendorSignUpTemplate } from './templates';

type sendPaidVendorSignUpLinkData = {
  company_name: string;
  sign_up_link: string;
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
