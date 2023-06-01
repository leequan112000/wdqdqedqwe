import { prisma } from "../connectDB";
import { createSendAdminZeroAcceptedProjectNoticeJob } from '../queues/email.queues';

const adminZeroAcceptedProjectNoticeJob = async () => {
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

  const data = {
    list: list,
  };
  
  createSendAdminZeroAcceptedProjectNoticeJob(data);
};

adminZeroAcceptedProjectNoticeJob();
