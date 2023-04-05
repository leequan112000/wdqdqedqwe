import { prisma } from '../connectDB';

const createCollaboratedNotification = async (sender_id: string, recipient_id: string, reference_id: string, reference_type: string) => {
  const sender = await prisma.user.findFirst({
    where: {
      id: sender_id,
    },
  });
  if (sender) {
    throw new Error('Sender not found');
  }
  const recipient = await prisma.user.findFirst({
    where: {
      id: recipient_id,
    },
  });
  if (recipient) {
    throw new Error('Recipient not found');
  }

  await prisma.notification.create({
    data: {
      notification_type: 'CollaboratedNotification',
      message: ' invited you to collaborate on ',
      sender_id: sender_id,
      recipient_id: recipient_id,
      reference_id: reference_id,
      reference_type: reference_type,
    },
  });
};

export default createCollaboratedNotification;