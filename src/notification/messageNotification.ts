import { NotificationType } from '../helper/constant';
import { prisma } from '../prisma';
import { publishNewNotification } from '../helper/pubsub';
import invariant from '../helper/invariant';
import { getUserFullName } from '../helper/email';

const createMessageNotification = async (
  sender_id: string,
  recipient_id: string,
  project_connection_id: string,
) => {
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

  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.MESSAGE_NOTIFICATION,
      message: `**${getUserFullName(sender)}** has sent you messages on **${project_connection?.project_request.title}**`,
      sender_id: sender_id,
      params: {
        project_connection_id: project_connection_id,
      },
      recipient_id: recipient_id,
    },
  });

  invariant(notification, 'Notification not created.');

  publishNewNotification(notification);
};

export default createMessageNotification;
