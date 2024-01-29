import type { Attachment } from '@sendgrid/helpers/classes'
import { createSendMailJob } from "../queues/sendMail.queues";
import { newMeetingNotificationTemplate, updatedMeetingNotificationTemplate } from "./templates";

type NewMeetingNotificationEmailData = {
  meeting_title: string;
  company_name: string; // Use organizer's name if send to organizer company participants.
  user_name: string;
  project_title: string;
  button_url: string;
};

export const newMeetingNotificationEmail = (
  emailData: NewMeetingNotificationEmailData,
  receiverEmail: string,
  attachments?: Attachment[],
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: newMeetingNotificationTemplate,
    attachments,
  });
};

type UpdatedMeetingNotificationEmailData = {
  meeting_title: string;
  company_name: string; // Use organizer's name if send to organizer company participants.
  user_name: string;
  project_title: string;
  button_url: string;
}

export const updatedMeetingNotificationEmail = (
  emailData: UpdatedMeetingNotificationEmailData,
  receiverEmail: string,
  attachments?: Attachment[],
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: updatedMeetingNotificationTemplate,
    attachments,
  });
};
