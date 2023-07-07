import { InternalError } from '../graphql/errors/InternalError';
import { NotificationType } from '../helper/constant';
import { prisma } from '../connectDB';
import { publishNewNotification } from '../helper/pubsub';

type CreateQuoteExpiredNotificationData = {
  quote_id: string;
  recipient_id: string;
  project_connection_id: string;
  project_name: string;
  vendor_full_name: string;
}

const createQuoteExpiredNotification = async (data: CreateQuoteExpiredNotificationData) => {
  const { project_connection_id, project_name, quote_id, recipient_id, vendor_full_name } = data;
  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.QUOTE_EXPIRED_NOTIFICATION,
      message: `Quote for **${project_name}** from **${vendor_full_name}** has expired.`,
      params: {
        project_connection_id,
        quote_id,
      },
      recipient_id,
    },
  });

  if (!notification) {
    throw new InternalError('Notification not created');
  }

  publishNewNotification(notification);
}

export default createQuoteExpiredNotification;
