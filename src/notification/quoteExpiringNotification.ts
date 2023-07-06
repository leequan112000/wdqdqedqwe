import { InternalError } from "../graphql/errors/InternalError";
import { NotificationType } from "../helper/constant";
import { prisma } from '../connectDB';
import { publishNewNotification } from "../helper/pubsub";

type CreateQuoteExpiringNotificationData = {
  quote_id: string;
  recipient_id: string;
  project_connection_id: string;
  project_name: string;
  vendor_full_name: string;
  expiring_in: string;
}

const createQuoteExpiringNotification = async (data: CreateQuoteExpiringNotificationData) => {
  const { expiring_in, project_connection_id, project_name, quote_id, recipient_id, vendor_full_name } = data;
  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.QUOTE_EXPIRING_NOTIFICATION,
      message: `Quote for **${project_name}** from **${vendor_full_name}** is expiring in **${expiring_in}**.`,
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

export default createQuoteExpiringNotification;
