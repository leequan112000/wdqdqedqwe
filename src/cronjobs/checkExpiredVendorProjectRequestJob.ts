import moment from 'moment';
import {
  Biotech,
  ProjectConnection,
  ProjectRequest,
  User,
} from '@prisma/client';
import { prisma } from '../prisma';
import { ProjectConnectionVendorStatus } from '../helper/constant';
import { app_env } from '../environment';
import { bulkVendorProjectRequestExpiredNoticeEmail } from '../mailer/projectRequest';
import { createVendorProjectRequestExpiredNotificationJob } from '../notification/projectRequestNotification';
import {
  NotificationJob,
  createNotificationQueueJob,
} from '../queues/notification.queues';

async function main() {
  const today = moment();
  const expiredProjectConnections = await prisma.projectConnection.findMany({
    where: {
      vendor_status: {
        equals: ProjectConnectionVendorStatus.PENDING,
      },
      expired_at: {
        gte: today.startOf('d').toDate(),
        lte: today.endOf('d').toDate(),
      },
    },
    include: {
      project_request: {
        include: {
          biotech: true,
        },
      },
      vendor_member_connections: {
        include: {
          vendor_member: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const expiredProjectConnectionsGroupByUserId: {
    [userId: string]: {
      projectConnections: (ProjectConnection & {
        project_request: ProjectRequest & { biotech: Biotech };
      })[];
      userData: User;
    };
  } = {};

  expiredProjectConnections.forEach((pc) => {
    pc.vendor_member_connections.forEach((vmc) => {
      const userId = vmc.vendor_member.user_id;
      if (
        vmc.vendor_member.user.deactivated_at === null ||
        vmc.vendor_member.user.deactivated_at < new Date()
      ) {
        if (!expiredProjectConnectionsGroupByUserId[userId]) {
          expiredProjectConnectionsGroupByUserId[userId] = {
            projectConnections: [],
            userData: vmc.vendor_member.user,
          };
        }
        expiredProjectConnectionsGroupByUserId[
          userId
        ].projectConnections.unshift(pc);
      }
    });
  });

  const buttonUrl = `${app_env.APP_URL}/app/projects/expired`;
  const emailData = Object.entries(expiredProjectConnectionsGroupByUserId).map(
    ([_, data]) => {
      const { projectConnections, userData } = data;
      return {
        emailData: {
          button_url: buttonUrl,
          receiver_full_name: `${userData.first_name} ${userData.last_name}`,
          requests: projectConnections.map((pc) => ({
            project_request_title: pc.project_request.title,
            biotech_full_name: pc.project_request.biotech.name,
          })),
        },
        receiverEmail: userData.email,
      };
    },
  );
  bulkVendorProjectRequestExpiredNoticeEmail(emailData);

  const vendorRequestExpiredNotificationJobData = Object.entries(
    expiredProjectConnectionsGroupByUserId,
  ).reduce<NotificationJob['data']>((acc, [_, data]) => {
    const { projectConnections, userData } = data;
    const jobs: NotificationJob['data'] = projectConnections.map((pc) => {
      return createVendorProjectRequestExpiredNotificationJob({
        biotech_name: pc.project_request.biotech.name,
        project_connection_id: pc.id,
        project_title: pc.project_request.title,
        recipient_id: userData.id,
      });
    });
    return [...acc, ...jobs];
  }, []);
  const notificationTask = createNotificationQueueJob({
    data: vendorRequestExpiredNotificationJobData,
  });

  await Promise.all([notificationTask]);

  process.exit(0);
}

main();
