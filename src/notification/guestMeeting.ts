import { NotificationType } from "../helper/constant";
import { createNotificationQueueJob } from "../queues/notification.queues";

type AcceptedMeetingRSVPNotificationData = {
  guest_name: string;
  project_title: string;

  meeting_event_id: string;
  recipient_id: string;
};

export const createAcceptedMeetingRSVPNotification = (
  data: AcceptedMeetingRSVPNotificationData
) => {
  const { guest_name, project_title, meeting_event_id, recipient_id } = data;
  createNotificationQueueJob({
    data: [
      {
        message: `**${guest_name}** has accepted meeting invitation for ${project_title}`,
        params: {
          meeting_event_id,
        },
        notification_type:
          NotificationType.ACCEPTED_MEETING_INVITATION_NOTIFICATION,
        recipient_id,
      },
    ],
  });
};

type DeclinedMeetingRSVPNotificationData = {
  guest_name: string;
  project_title: string;

  meeting_event_id: string;
  recipient_id: string;
}

export const createDeclinedMeetingRSVPNotification = (
  data: DeclinedMeetingRSVPNotificationData
) => {
  const { guest_name, project_title, meeting_event_id, recipient_id } = data;
  createNotificationQueueJob({
    data: [
      {
        message: `**${guest_name}** has declined meeting invitation for ${project_title}`,
        params: {
          meeting_event_id,
        },
        notification_type:
          NotificationType.DECLINED_MEETING_INVITATION_NOTIFICATION,
        recipient_id,
      },
    ],
  });
};
