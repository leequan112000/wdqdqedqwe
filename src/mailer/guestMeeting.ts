import { createSendMailJob } from "../queues/sendMail.queues";
import {
  meetingInvitationTemplate,
  acceptedMeetingRSVPNotificationForHostTemplate,
  meetingResponseConfirmationNotificationTemplate,
  declinedMeetingRSVPNotificationForHostTemplate,
} from "./templates";

type MeetingResponseConfirmationEmailData = {
  button_url: string;
  meeting_title: string;
  guest_name: string;
  project_title: string;
};

export const meetingResponseConfirmationEmail = (
  emailData: MeetingResponseConfirmationEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: meetingResponseConfirmationNotificationTemplate,
  });
};

type AcceptedMeetingRSVPUpdateNotificationEmailData = {
  button_url: string;
  meeting_title: string;
  host_name: string;
  guest_name: string;
  project_title: string;
};

export const acceptedMeetingRSVPUpdateNotificationEmail = (
  emailData: AcceptedMeetingRSVPUpdateNotificationEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: acceptedMeetingRSVPNotificationForHostTemplate,
  });
};

type DeclinedMeetingRSVPUpdateNotificationEmailData = {
  button_url: string;
  meeting_title: string;
  host_name: string;
  guest_name: string;
  project_title: string;
};

export const declinedMeetingRSVPUpdateNotificationEmail = (
  emailData: DeclinedMeetingRSVPUpdateNotificationEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: declinedMeetingRSVPNotificationForHostTemplate,
  });
};

type MeetingInvitationForGuestEmailData = {
  guest_name: string;
  meeting_title: string;
  company_name: string;
  button_url: string;
  project_title: string;
};

export const meetingInvitationForGuestEmail = (
  emailData: MeetingInvitationForGuestEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: meetingInvitationTemplate,
  });
};
