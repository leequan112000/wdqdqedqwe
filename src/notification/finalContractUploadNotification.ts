import { NotificationType } from "../helper/constant";

type FinalContractUploadNotificationData = {
  sender_fullname: string;
  project_title: string;
  project_connection_id: string;
  recipient_id: string;
  sender_id: string;
};

const createFinalContractUploadNotificationJob = (
  data: FinalContractUploadNotificationData
) => {
  const {
    project_connection_id,
    project_title,
    recipient_id,
    sender_id,
    sender_fullname,
  } = data;

  return {
    notification_type: NotificationType.FINAL_CONTRACT_UPLOAD_NOTIFICATION,
    message: `**${sender_fullname}** updated final contract for **${project_title}**`,
    sender_id,
    params: {
      project_connection_id,
    },
    recipient_id,
  };
};

export default createFinalContractUploadNotificationJob;
