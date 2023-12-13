import { createSendMailJob } from "../queues/sendMail.queues";
import {
  meetingInvitationTemplate,
  meetingRSVPUpdateNotificationTemplate,
  meetingResponseConfirmationNotificationTemplate,
} from "./templates";

type MeetingResponseSubmittedEmailData = {
  button_url: string;
  meeting_title: string;
  guest_name: string;
};

export const meetingResponseSubmittedEmail = (
  emailData: MeetingResponseSubmittedEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: meetingResponseConfirmationNotificationTemplate,
  });
};

type MeetingRSVPUpdateNotificationEmailData = {
  button_url: string;
  meeting_title: string;
  host_name: string;
  guest_name: string;
};

export const meetingRSVPUpdateNotificationEmail = (
  emailData: MeetingRSVPUpdateNotificationEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: meetingRSVPUpdateNotificationTemplate,
  });
};

type MeetingInvitationEmailData = {
  guest_name: string;
  meeting_title: string;
  company_name: string;
  button_url: string;
};

export const meetingInvitationEmail = (
  emailData: MeetingInvitationEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: meetingInvitationTemplate,
  });
};
