import { getReceiversByProjectConnection } from './utils';
import { app_env } from '../environment';
import { prisma } from '../prisma';
import { NotificationType } from '../helper/constant';
import { createQueue } from '../helper/queue';
import { bulkNewMessageNoticeEmail } from '../mailer/message';
import createMessageNotification from '../notification/messageNotification';

export type chatJob = {
  project_connection_id: string;
  sender_id: string;
  message: string;
};

const chatQueue = createQueue<chatJob>('chat');

chatQueue.process(async (job, done) => {
  const { project_connection_id, sender_id, message } = job.data;
  try {
    const { receivers, projectConnection, senderCompanyName } =
      await getReceiversByProjectConnection(project_connection_id, sender_id);

    const emailData = await Promise.all(
      receivers.map(async (r) => {
        const notification = await prisma.notification.findFirst({
          where: {
            recipient_id: r.id,
            notification_type: NotificationType.MESSAGE_NOTIFICATION,
            read_at: null,
            params: {
              path: ['project_connection_id'],
              equals: projectConnection.id,
            },
          },
        });

        if (!notification) {
          await createMessageNotification(
            sender_id,
            r.id,
            projectConnection.id,
          );
          return {
            emailData: {
              button_url: `${app_env.APP_URL}/app/project-connection/${project_connection_id}`,
              receiver_full_name: `${r.first_name} ${r.last_name}`,
              project_title: projectConnection.project_request.title,
              company_name: senderCompanyName,
              message_text: message,
            },
            receiverEmail: r.email,
          };
        }
        return undefined;
      }),
    );
    const validatedEmailData = emailData.filter(
      (
        e,
      ): e is {
        emailData: {
          button_url: string;
          receiver_full_name: string;
          project_title: string;
          company_name: string;
          message_text: string;
        };
        receiverEmail: string;
      } => e !== undefined,
    );
    bulkNewMessageNoticeEmail(validatedEmailData);
    done();
  } catch (error) {
    if (error instanceof Error) {
      done(error);
    }
  }
});

export const createChatQueueJob = (job: chatJob) => {
  return chatQueue.add(job);
};
