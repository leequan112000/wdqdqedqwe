import {
  customerInvitationByAdminTemplate,
  customerInvitationTemplate,
} from "./templates";
import { createSendMailJob } from "../queues/sendMail.queues";

type CustomerInvitationEmailData = {
  login_url: string;
  inviter_full_name: string;
  inviter_message: string;
  receiver_full_name: string;
};

export const customerInvitationEmail = (
  emailData: CustomerInvitationEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: customerInvitationTemplate,
  });
};

type CustomerInvitationByAdminEmailData = {
  login_url: string;
  receiver_full_name: string;
};

export const customerInvitationByAdminEmail = (
  emailData: CustomerInvitationByAdminEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: customerInvitationByAdminTemplate,
  });
};
