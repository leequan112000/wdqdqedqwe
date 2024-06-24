import { NotificationType } from '../helper/constant';

type CreateAdminInviteNotificationData = {
  project_connection_id: string;
  project_title: string;
  recipient_id: string;
};

const createAdminInviteNotificationJob = (
  data: CreateAdminInviteNotificationData,
) => {
  const { project_connection_id, project_title, recipient_id } = data;
  return {
    notification_type: NotificationType.ADMIN_INVITE_NOTIFICATION,
    message: `You have a new client request to review: **${project_title}**`,
    params: {
      project_connection_id: project_connection_id,
    },
    recipient_id: recipient_id,
  };
};

export default createAdminInviteNotificationJob;
