import { NotificationType } from '../helper/constant';
import { createQueue } from '../helper/queue';
import { prisma } from '../prisma';
import { publishNewNotification } from '../helper/pubsub';

export type NotificationJob = {
  data: Array<{
    notification_type: NotificationType;
    message: string;
    params: { [key: string]: any };
    recipient_id: string;
  }>;
};

const notificationQueue = createQueue<NotificationJob>('notification');

notificationQueue.process(async (job, done) => {
  const { data } = job.data;

  try {
    const tasks = data.map(async (d) => {
      const newNotification = await prisma.notification.create({
        data: d,
      });
      await publishNewNotification(newNotification);
      return newNotification;
    });
    const result = await Promise.all(tasks);
    done(null, result);
  } catch (error) {
    if (error instanceof Error) {
      done(error);
    }
  }
});

export const createNotificationQueueJob = (job: NotificationJob) => {
  return notificationQueue.add(job);
};
