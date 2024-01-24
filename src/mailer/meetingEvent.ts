import { createSendMailJob } from "../queues/sendMail.queues";
import { newMeetingNotificationTemplate } from "./templates";

type NewMeetingNotificationEmailData = {
  meeting_title: string;
  company_name: string;
  user_name: string;
  project_title: string;
  button_url: string;
};

export const newMeetingNotificationEmail = (
  emailData: NewMeetingNotificationEmailData,
  receiverEmail: string
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: newMeetingNotificationTemplate,
  });
};
