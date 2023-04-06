import { InternalError } from '../graphql/errors/InternalError';
import { prisma } from '../connectDB';

const finalContractUploadNotification = async (sender_id: string, recipient_id: string, reference_id: string, reference_type: string) => {

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
      notification_type: 'FinalContractUploadNotification',
      message: ' updated final contract for ',
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

export default finalContractUploadNotification;
