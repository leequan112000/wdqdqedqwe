import { NotificationType, QuoteNotificationActionContent } from '../helper/constant';
import prisma from '../prisma';
import { publishNewNotification } from '../helper/pubsub';
import invariant from '../helper/invariant';

const createQuoteNotification = async (sender_id: string, sender_company_name: string, quote_id: string, action: QuoteNotificationActionContent, recipient_id: string, project_connection_id: string) => {
  const sender = await prisma.user.findFirst({
    where: {
      id: sender_id,
    },
  });
  invariant(sender, 'Sender not found.');

  const recipient = await prisma.user.findFirst({
    where: {
      id: recipient_id,
    },
  });
  invariant(recipient, 'Recipient not found.');

  const project_connection = await prisma.projectConnection.findFirst({
    where: {
      id: project_connection_id,
    },
    include: {
      project_request: true,
    },
  });

  let notificationType: NotificationType;

  switch (action) {
    case QuoteNotificationActionContent.ACCEPTED:
      notificationType = NotificationType.QUOTE_ACCEPTED_NOTIFICATION;
      break;
    case QuoteNotificationActionContent.DECLINED:
      notificationType = NotificationType.QUOTE_DECLINED_NOTIFICATION;
      break;
    case QuoteNotificationActionContent.SUBMITTED:
      notificationType = NotificationType.QUOTE_SUBMITTED_NOTIFICATION;
      break;
    default:
      notificationType = NotificationType.QUOTE_NOTIFICATION;
      break;
  }

  const notification = await prisma.notification.create({
    data: {
      notification_type: notificationType,
      message: `**${sender_company_name}** has ${action} quote for **${project_connection?.project_request.title}**`,
      sender_id,
      params: {
        project_connection_id,
        quote_id,
      },
      recipient_id,
    },
  });

  invariant(notification, 'Notification not created.');

  publishNewNotification(notification);
};

export default createQuoteNotification;

type CreateExpiredQuoteNotificationJobData = {
  project_name: string;
  vendor_full_name: string;
  project_connection_id: string;
  quote_id: string;
  recipient_id: string;
}

export const createExpiredQuoteNotificationJob = (data: CreateExpiredQuoteNotificationJobData) => {
  const { project_connection_id, project_name, quote_id, recipient_id, vendor_full_name } = data;

  return {
    notification_type: NotificationType.QUOTE_EXPIRED_NOTIFICATION,
    message: `Quote for **${project_name}** from **${vendor_full_name}** has expired.`,
    params: {
      project_connection_id,
      quote_id,
    },
    recipient_id,
  }
}

type CreateExpiringQuoteNotificationJobData = {
  project_name: string;
  vendor_full_name: string;
  project_connection_id: string;
  quote_id: string;
  recipient_id: string;
  expiring_in: string;
}

export const createExpiringQuoteNotificationJob = (data: CreateExpiringQuoteNotificationJobData) => {
  const { project_connection_id, project_name, quote_id, recipient_id, vendor_full_name, expiring_in } = data;

  return {
    notification_type: NotificationType.QUOTE_EXPIRING_NOTIFICATION,
    message: `Quote for **${project_name}** from **${vendor_full_name}** is expiring in **${expiring_in}**.`,
    params: {
      project_connection_id,
      quote_id,
    },
    recipient_id,
  }
}
