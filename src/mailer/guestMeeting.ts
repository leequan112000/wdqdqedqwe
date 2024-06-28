import { createSendMailJob } from '../queues/sendMail.queues';
import {
  meetingInvitationTemplate,
  acceptedMeetingRSVPNotificationForHostTemplate,
  acceptedMeetingRSVPNotificationForGuestTemplate,
  declinedMeetingRSVPNotificationForHostTemplate,
  meetingInvitationForCromaticUserWithinProjectTemplate,
  declinedMeetingRSVPNotificationForGuestTemplate,
} from './templates';

type AcceptedMeetingRSVPNotificationForGuestData = {
  button_url: string;
  meeting_title: string;
  guest_name: string;
  project_title: string;
  host_name: string;
};

export const acceptedMeetingRSVPNotificationForGuestEmail = (
  emailData: AcceptedMeetingRSVPNotificationForGuestData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: acceptedMeetingRSVPNotificationForGuestTemplate,
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
  receiverEmail: string,
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
  receiverEmail: string,
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
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: meetingInvitationTemplate,
  });
};

type MeetingInvitationForCromaticUserWithinProjectEmailData = {
  guest_name: string;
  meeting_title: string;
  company_name: string;
  button_url: string;
  project_title: string;
};

export const meetingInvitationForCromaticUserWithinProjectEmail = (
  emailData: MeetingInvitationForCromaticUserWithinProjectEmailData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: meetingInvitationForCromaticUserWithinProjectTemplate,
  });
};

type DeclinedMeetingRSVPNotificationForGuestEmailData = {
  meeting_title: string;
  host_name: string;
  guest_name: string;
  project_title: string;
};

export const declinedMeetingRSVPNotificationForGuestEmail = (
  emailData: DeclinedMeetingRSVPNotificationForGuestEmailData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: declinedMeetingRSVPNotificationForGuestTemplate,
  });
};
