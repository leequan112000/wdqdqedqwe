import { createSendMailJob } from '../queues/sendMail.queues';
import { vendorSignUpTemplate } from './templates';

type sendVendorSignUpLinkData = {
  button_url: string;
  company_name: string;
};
export const sendVendorSignUpLink = async (
  emailData: sendVendorSignUpLinkData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: vendorSignUpTemplate,
  });
};
