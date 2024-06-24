import {
  vendorMemberInvitationByAdminTemplate,
  vendorMemberInvitationByExistingMemberTemplate,
  vendorMemberInvitationToProjectRequestByAdminTemplate,
  vendorMemberInvitationByBiotechTemplate,
} from './templates';
import { createSendMailJob } from '../queues/sendMail.queues';

type VendorMemberInvitationByUserEmailData = {
  login_url: string;
  inviter_full_name: string;
  inviter_message: string;
  receiver_full_name: string;
};

export const vendorMemberInvitationByUserEmail = (
  emailData: VendorMemberInvitationByUserEmailData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: vendorMemberInvitationByExistingMemberTemplate,
  });
};

type VendorMemberInvitationByAdminEmailData = {
  login_url: string;
  receiver_full_name: string;
};

export const vendorMemberInvitationByAdminEmail = (
  emailData: VendorMemberInvitationByAdminEmailData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: vendorMemberInvitationByAdminTemplate,
  });
};

type VendorMemberProjectRequestInvitationByAdminEmailData = {
  login_url: string;
  project_request_title: string;
  receiver_full_name: string;
};

export const vendorMemberProjectRequestInvitationByAdminEmail = (
  emailData: VendorMemberProjectRequestInvitationByAdminEmailData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: vendorMemberInvitationToProjectRequestByAdminTemplate,
  });
};

type VendorMemberInvitationByBiotechEmailData = {
  login_url: string;
  receiver_full_name: string;
  biotech_name: string;
  inviter_full_name: string;
  project_request_name: string;
};

export const vendorMemberInvitationByBiotechEmail = (
  emailData: VendorMemberInvitationByBiotechEmailData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: vendorMemberInvitationByBiotechTemplate,
  });
};
