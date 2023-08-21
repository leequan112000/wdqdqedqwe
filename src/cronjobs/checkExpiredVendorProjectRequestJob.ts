import moment from 'moment';
import prisma from '../prisma';
import { createVendorProjectRequestExpiredNoticeEmailJob } from '../queues/email.queues';
import { CreateVendorProjectRequestExpiredNoticeEmailJobParam } from '../queues/types';
import { ProjectConnectionVendorStatus } from '../helper/constant';
import { Biotech, ProjectConnection, ProjectRequest, User } from '@prisma/client';
import { createVendorProjectRequestExpiredNotificationJob } from '../notification/projectRequestNotification';
import { NotificationJob, createNotificationQueueJob } from '../queues/notification.queues';



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

  const expiredProjectConnectionsGroupByUserId: { [userId: string]: { projectConnections: (ProjectConnection & { project_request: ProjectRequest & { biotech: Biotech } })[]; userData: User } } = {};

  expiredProjectConnections.forEach((pc) => {
    pc.vendor_member_connections.forEach((vmc) => {
      const userId = vmc.vendor_member.user_id;
      if (!expiredProjectConnectionsGroupByUserId[userId]) {
        expiredProjectConnectionsGroupByUserId[userId] = { projectConnections: [], userData: vmc.vendor_member.user };
      }
      expiredProjectConnectionsGroupByUserId[userId].projectConnections.unshift(pc);
    });
  });

  const toSendExpiredNoticeEmail: CreateVendorProjectRequestExpiredNoticeEmailJobParam[] = Object.entries(expiredProjectConnectionsGroupByUserId).map(([_, data]) => {
    const { projectConnections, userData } = data;
    return {
      receiverEmail: userData.email,
      receiverName: `${userData.first_name} ${userData.last_name}`,
      requests: projectConnections.map((pc) => ({
        project_request_title: pc.project_request.title,
        biotech_full_name: pc.project_request.biotech.name,
      }))
    }
  });

  const sendEmailTasks = toSendExpiredNoticeEmail.map((d) => {
    return createVendorProjectRequestExpiredNoticeEmailJob(d);
  });

  const vendorRequestExpiredNotificationJobData = Object.entries(expiredProjectConnectionsGroupByUserId).reduce<NotificationJob['data']>((acc, [_, data]) => {
    const { projectConnections, userData } = data;
    const jobs: NotificationJob['data'] = projectConnections.map((pc) => {
      return createVendorProjectRequestExpiredNotificationJob({
        biotech_name: pc.project_request.biotech.name,
        project_connection_id: pc.id,
        project_title: pc.project_request.title,
        recipient_id: userData.id,
      });
    })
    return [...acc, ...jobs]
  }, []);
  const notificationTask = createNotificationQueueJob({ data: vendorRequestExpiredNotificationJobData });

  await Promise.all([...sendEmailTasks, notificationTask]);

  process.exit(0);
}

main();
