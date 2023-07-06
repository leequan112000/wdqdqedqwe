import { InternalError } from '../graphql/errors/InternalError';
import { NotificationType } from '../helper/constant';
import { prisma } from '../connectDB';
import { publishNewNotification } from '../helper/pubsub';

const createAdminInviteNotification = async (recipient_id: string, project_connection_id: string) => {
  const recipient = await prisma.user.findFirst({
    where: {
      id: recipient_id,
    },
  });
  if (!recipient) {
    throw new InternalError('Recipient not found');
  }

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

  if (!notification) {
    throw new InternalError('Notification not created');
  }

  publishNewNotification(notification)
};

export default createAdminInviteNotification;
