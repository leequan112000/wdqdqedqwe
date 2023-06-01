import cron from 'cron';
import { prisma } from "../connectDB";
import { createSendAdminZeroAcceptedProjectNoticeJob } from '../queues/email.queues';

const adminZeroAcceptedProjectNoticeJob = new cron.CronJob('0 10 * * *', async () => {
  const project_connections = await prisma.projectConnection.findMany({
    where: {
      AND: [
        { expired_at: { gt: new Date() }, }
      ],
      NOT: [
        { vendor_status: "ACCEPTED", }
      ],
    },
    include: {
      project_request: {
        include: {
          biotech: true,
        }
      },
    }
  });

  const list = project_connections.map((pc) => 
    `${pc.project_request.biotech.name}: ${pc.project_request.title}`,
  ).join('; ');
  
  createSendAdminZeroAcceptedProjectNoticeJob({ list: list });
});

adminZeroAcceptedProjectNoticeJob.start();
