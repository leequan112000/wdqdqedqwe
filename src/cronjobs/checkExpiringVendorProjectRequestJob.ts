import moment from 'moment';
import { prisma } from '../connectDB';
import { ProjectConnectionVendorStatus } from '../helper/constant';
import { Biotech, ProjectConnection, ProjectRequest, User } from '@prisma/client';
import { CreateVendorProjectRequestExpiringNoticeEmailJobParam } from '../queues/types';
import { createVendorProjectRequestExpiringNoticeEmailJob } from '../queues/email.queues';
import { NotificationJob, createNotificationQueueJob } from '../queues/notification.queues';
import { createVendorProjectRequestExpiringNotificationJob } from '../notification/projectRequestNotification';

const EXPIRING_DAYS = 3;

async function main() {
  const today = moment();
  const expiringDate = today.clone().add(EXPIRING_DAYS, 'd');

  const expiringProjectConnections = await prisma.projectConnection.findMany({
    where: {
      vendor_status: {
        equals: ProjectConnectionVendorStatus.PENDING,
      },
      expired_at: {
        gte: expiringDate.startOf('d').toDate(),
        lte: expiringDate.endOf('d').toDate(),
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

  const expiringProjectConnectionsGroupByUserId: { [userId: string]: { projectConnections: (ProjectConnection & { project_request: ProjectRequest & { biotech: Biotech } })[]; userData: User } } = {};

  expiringProjectConnections.forEach((pc) => {
    pc.vendor_member_connections.forEach((vmc) => {
      const userId = vmc.vendor_member.user_id;
      if (!expiringProjectConnectionsGroupByUserId[userId]) {
        expiringProjectConnectionsGroupByUserId[userId] = { projectConnections: [], userData: vmc.vendor_member.user };
      }
      expiringProjectConnectionsGroupByUserId[userId].projectConnections.unshift(pc);
    });
  });

  const toSendExpiringNoticeEmail: CreateVendorProjectRequestExpiringNoticeEmailJobParam[] = Object.entries(expiringProjectConnectionsGroupByUserId).map(([_, data]) => {
    const { projectConnections, userData } = data;
    return {
      receiverEmail: userData.email,
      receiverName: `${userData.first_name} ${userData.last_name}`,
      expiringIn: `${EXPIRING_DAYS} days`,
      requests: projectConnections.map((pc) => ({
        project_request_title: pc.project_request.title,
        biotech_full_name: pc.project_request.biotech.name,
      }))
    }
  });

  const sendEmailTasks = toSendExpiringNoticeEmail.map((d) => {
    return createVendorProjectRequestExpiringNoticeEmailJob(d);
  });

  const vendorRequestExpiringNotificationJobData = Object.entries(expiringProjectConnectionsGroupByUserId).reduce<NotificationJob['data']>((acc, [_, data]) => {
    const { projectConnections, userData } = data;
    const jobs: NotificationJob['data'] = projectConnections.map((pc) => {
      return createVendorProjectRequestExpiringNotificationJob({
        biotech_name: pc.project_request.biotech.name,
        project_connection_id: pc.id,
        project_title: pc.project_request.title,
        recipient_id: userData.id,
        expiring_in: `${EXPIRING_DAYS} days`,
      });
    })
    return [...acc, ...jobs]
  }, []);
  const notificationTask = createNotificationQueueJob({ data: vendorRequestExpiringNotificationJobData });

  await Promise.all([...sendEmailTasks, notificationTask]);

  process.exit(0);
}

main();
