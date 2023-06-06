import cron from 'cron';
import { prisma } from "../connectDB";
import { createSendAdminZeroAcceptedProjectNoticeJob } from '../queues/email.queues';

const adminZeroAcceptedProjectNoticeJob = new cron.CronJob('30 9 * * *', async () => {
  // Get the timestamp for 24 hours ago
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  // zero accepted project for 24 hours
  const zeroAcceptedProjectRequests = await prisma.projectRequest.findMany({
    where: {
      initial_assigned_at: {
        lte: twentyFourHoursAgo,
      },
      project_connections: {
        none: {
          vendor_status: "accepted",
        },
      },
    },
    select: {
      title: true,
      biotech: {
        select: {
          name: true,
        },
      },
    },
  });

  const zeroAcceptedList = zeroAcceptedProjectRequests.map((pc) => `${pc.biotech.name}: ${pc.title}`).join('; ');
  // less than 5 accepted project for 24 hours
  const projectRequests =  await prisma.projectRequest.findMany({
    where: {
      project_connections: {
        some: {
          vendor_status: "accepted",
        },
      },
    },
    include: {
      project_connections: {
        where: {
          vendor_status: "accepted",
        },
      },
      biotech: {
        select: {
          name: true,
        },
      },
    },
  });

  const filteredProjectRequests = projectRequests.filter((pc) => pc.project_connections.length < 5);
  const lessAcceptedList = filteredProjectRequests.map((pc) => `${pc.biotech.name}: ${pc.title}`).join('; ');
  
  
  createSendAdminZeroAcceptedProjectNoticeJob({ zeroAcceptedList: zeroAcceptedList, lessAcceptedList: zeroAcceptedList });
});

adminZeroAcceptedProjectNoticeJob.start();
