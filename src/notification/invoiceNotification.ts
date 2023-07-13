import { NotificationType } from "../helper/constant";
import { prisma } from "../connectDB";
import { InternalError } from "../graphql/errors/InternalError";
import { publishNewNotification } from "../helper/pubsub";

type CreateBillingNotificationData = {
  invoice_month: string;
  recipient_id: string;
  invoice_id: string;
}

export const createBillingNotification = async (data: CreateBillingNotificationData) => {
  const { invoice_month, invoice_id, recipient_id } = data;

  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.NEW_INVOICE_NOTIFICATION,
      message: `Invoice for **${invoice_month}** is ready.`,
      params: {
        invoice_id,
      },
      recipient_id,
    },
  });

  if (!notification) {
    throw new InternalError('Notification not created');
  }

  await publishNewNotification(notification);
}
