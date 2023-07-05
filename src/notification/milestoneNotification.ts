import { InternalError } from '../graphql/errors/InternalError';
import { NotificationType } from '../helper/constant';
import { prisma } from '../connectDB';
import { publishNewNotification } from '../helper/pubsub';

export const createMilestoneNotification = async (sender_id: string, quote_id: string, milestone_update_content: string, recipient_id: string, project_connection_id: string) => {
  const sender = await prisma.user.findFirst({
    where: {
      id: sender_id,
    },
  });
  if (!sender) {
    throw new InternalError('Sender not found');
  }

  const recipient = await prisma.user.findFirst({
    where: {
      id: recipient_id,
    },
  });
  if (!recipient) {
    throw new InternalError('Recipient not found');
  }

  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.MILESTONE_NOTIFICATION,
      message: milestone_update_content,
      sender_id,
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
};

export const createMilestonePaymentFailedNotification = async (quote_id: string, milestone_update_content: string, recipient_id: string, project_connection_id: string) => {
  const recipient = await prisma.user.findFirst({
    where: {
      id: recipient_id,
    },
  });
  if (!recipient) {
    throw new InternalError('Recipient not found');
  }

  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.MILESTONE_PAYMENT_FAILED_NOTIFICATION,
      message: milestone_update_content,
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
};
