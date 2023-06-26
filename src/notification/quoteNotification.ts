import { InternalError } from '../graphql/errors/InternalError';
import { NotificationType } from '../helper/constant';
import { prisma } from '../connectDB';

const createQuotationNotification = async (sender_id: string, sender_company_name: string, action: string, recipient_id: string, project_connection_id: string) => {
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
      notification_type: NotificationType.QUOTATION_NOTIFICATION,
      message: `**${sender_company_name}** has ${action} quotation for **${project_connection?.project_request.title}**`,
      sender_id: sender_id,
      params: {
        project_connection_id: project_connection_id,
      },
      recipient_id: recipient_id,
    },
  });

  if (!notification) {
    throw new InternalError('Notification not created');
  }
};

export default createQuotationNotification;