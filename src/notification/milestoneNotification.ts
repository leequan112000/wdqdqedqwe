import { NotificationType } from '../helper/constant';
import { prisma } from '../prisma';
import { publishNewNotification } from '../helper/pubsub';
import invariant from '../helper/invariant';

export const createMilestoneNotification = async (sender_id: string, quote_id: string, milestone_update_content: string, recipient_id: string, project_connection_id: string) => {
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

  invariant(notification, 'Notification not created.');

  publishNewNotification(notification);
};

export const createMilestonePaymentFailedNotification = async (quote_id: string, milestone_update_content: string, recipient_id: string, project_connection_id: string) => {
  const recipient = await prisma.user.findFirst({
    where: {
      id: recipient_id,
    },
  });
  invariant(recipient, 'Recipient not found.');

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

  invariant(notification, 'Notification not created.');

  publishNewNotification(notification);
};
