import { NotificationType } from '../helper/constant';

type NewMeetingNotificationData = {
  project_title: string;
  organizer_full_name: string;
  meeting_event_id: string;
  recipient_id: string;
}

export const createNewMeetingNotificationJob = (data: NewMeetingNotificationData) => {
  const { project_title, organizer_full_name, meeting_event_id, recipient_id } = data;

  return {
    notification_type: NotificationType.NEW_MEETING_NOTIFICATION,
    message: `**${organizer_full_name}** invited you to a meeting for project **${project_title}**`,
    params: {
      meeting_event_id,
    },
    recipient_id,
  };
}

type UpdateMeetingNotificationData = {
  project_title: string;
  organizer_full_name: string;
  meeting_event_id: string;
  recipient_id: string;
}

export const createUpdateMeetingNotificationJob = (data: UpdateMeetingNotificationData) => {
  const { meeting_event_id, organizer_full_name, project_title, recipient_id } = data;

  return {
    notification_type: NotificationType.UPDATE_MEETING_NOTIFICATION,
    message: `**${organizer_full_name}** updated a meeting for project **${project_title}**`,
    params: {
      meeting_event_id,
    },
    recipient_id,
  };
}

type RemoveMeetingNotificationData = {
  project_title: string;
  organizer_full_name: string;
  meeting_event_id: string;
  recipient_id: string;
}

export const createRemoveMeetingNotificationJob = (data: RemoveMeetingNotificationData) => {
  const { meeting_event_id, organizer_full_name, project_title, recipient_id } = data;

  return {
    notification_type: NotificationType.REMOVE_MEETING_NOTIFICATION,
    message: `**${organizer_full_name}** canceled a meeting for project **${project_title}**`,
    params: {
      meeting_event_id,
    },
    recipient_id,
  };
}
