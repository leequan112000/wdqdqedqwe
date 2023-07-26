import { NotificationType } from "../helper/constant"

type VendorProjectRequestExpiringNotificationData = {
  project_title: string;
  project_connection_id: string;
  recipient_id: string;
  biotech_name: string;
  expiring_in: string;
}


export const createVendorProjectRequestExpiringNotificationJob = (data: VendorProjectRequestExpiringNotificationData) => {
  const { project_connection_id, project_title, recipient_id, biotech_name, expiring_in } = data;
  return {
    notification_type: NotificationType.VENDOR_PROJECT_REQUEST_EXPIRING_NOTIFICATION,
    message: `Request for **${project_title}** from **${biotech_name}** is expiring in ${expiring_in}`,
    params: {
      project_connection_id,
    },
    recipient_id,
  }
}

type VendorProjectRequestExpiredNotificationData = {
  project_title: string;
  project_connection_id: string;
  recipient_id: string;
  biotech_name: string;
}


export const createVendorProjectRequestExpiredNotificationJob = (data: VendorProjectRequestExpiredNotificationData) => {
  const { project_connection_id, project_title, recipient_id, biotech_name } = data;
  return {
    notification_type: NotificationType.VENDOR_PROJECT_REQUEST_EXPIRED_NOTIFICATION,
    message: `Request for **${project_title}** from **${biotech_name}** has expired`,
    params: {
      project_connection_id,
    },
    recipient_id,
  }
}
