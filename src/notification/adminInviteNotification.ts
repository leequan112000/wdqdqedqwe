import { NotificationType } from '../helper/constant';
import prisma from '../prisma';
import { publishNewNotification } from '../helper/pubsub';
import invariant from '../helper/invariant';

const createAdminInviteNotification = async (recipient_id: string, project_connection_id: string) => {
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
      notification_type: NotificationType.ADMIN_INVITE_NOTIFICATION,
      message: `You have a new client request to review: **${project_connection?.project_request.title}**`,
      params: {
        project_connection_id: project_connection_id,
      },
      recipient_id: recipient_id,
    },
  });

  invariant(notification, 'Notification not created.');

  publishNewNotification(notification)
};

export default createAdminInviteNotification;
