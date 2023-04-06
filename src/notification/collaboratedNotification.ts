import { InternalError } from '../graphql/errors/InternalError';
import { prisma } from '../connectDB';

const createCollaboratedNotification = async (sender_id: string, recipient_id: string, reference_id: string, reference_type: string) => {
  const notification = await prisma.notification.create({
    data: {
      notification_type: 'CollaboratedNotification',
      message: ' invited you to collaborate on ',
      sender_id: sender_id,
      recipient_id: recipient_id,
      reference_id: reference_id,
      reference_type: reference_type,
    },
  });

  if (!notification) {
    throw new InternalError('Notification not created');
  }
};

export default createCollaboratedNotification;