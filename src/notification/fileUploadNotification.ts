import { NotificationType } from '../helper/constant';

type FileUploadNotificationData = {
  sender_fullname: string;
  project_title: string;
  project_connection_id: string;
  recipient_id: string;
  sender_id: string;
};

const createFileUploadNotificationJob = (data: FileUploadNotificationData) => {
  const {
    project_connection_id,
    project_title,
    recipient_id,
    sender_fullname,
    sender_id,
  } = data;

  return {
    notification_type: NotificationType.FILE_UPLOAD_NOTIFICATION,
    message: `**${sender_fullname}** uploaded files to **${project_title}**`,
    sender_id: sender_id,
    params: {
      project_connection_id: project_connection_id,
    },
    recipient_id: recipient_id,
  };
};

export default createFileUploadNotificationJob;
