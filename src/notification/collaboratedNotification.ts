import { NotificationType } from '../helper/constant';
import { prisma } from '../prisma';
import { publishNewNotification } from '../helper/pubsub';
import invariant from '../helper/invariant';
import { decrypt } from '../helper/gdprHelper';

const createCollaboratedNotification = async (
  sender_id: string,
  recipient_id: string,
  project_connection_id: string,
) => {
  const sender = await prisma.user.findFirst({
    where: {
      id: sender_id,
    },
    include: {
      pseudonyms: true,
    },
  });
  invariant(sender, 'Sender not found.');

  const recipient = await prisma.user.findFirst({
    where: {
      id: recipient_id,
    },
    include: {
      pseudonyms: true,
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

  const senderFullName = `${decrypt(sender?.pseudonyms?.first_name)} ${decrypt(sender?.pseudonyms?.last_name)}`;
  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.COLLABORATED_NOTIFICATION,
      message: `**${senderFullName}** invited you to collaborate on **${project_connection?.project_request.title}**`,
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

export default createCollaboratedNotification;
