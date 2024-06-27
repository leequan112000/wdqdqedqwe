import { prisma } from '../prisma';
import { AdminTeam } from '../helper/constant';
import { bulkZeroAcceptedProjectAdminNoticeEmail } from '../mailer/admin';

async function adminZeroAcceptedProjectNoticeJob() {
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
          vendor_status: 'accepted',
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

  const zeroAcceptedList = zeroAcceptedProjectRequests
    .map((pc) => ` •  [${pc.biotech.name}] ${pc.title}`)
    .join('<br/>');
  // less than 5 accepted projects
  const projectRequests = await prisma.projectRequest.findMany({
    where: {
      project_connections: {
        some: {
          vendor_status: 'accepted',
        },
      },
    },
    include: {
      project_connections: {
        where: {
          vendor_status: 'accepted',
        },
      },
      biotech: {
        select: {
          name: true,
        },
      },
    },
  });

  const filteredProjectRequests = projectRequests.filter(
    (pc) => pc.project_connections.length < 5,
  );
  const lowAcceptanceList = filteredProjectRequests
    .map((pc) => ` •  [${pc.biotech.name}] ${pc.title}`)
    .join('<br/>');

  const receivers = await prisma.admin.findMany({
    where: {
      team: AdminTeam.SCIENCE,
    },
  });

  const date = new Date().toDateString();
  const emailData = receivers.map((r) => ({
    emailData: {
      date,
      zeroAcceptedList,
      lowAcceptanceList,
      retool_url: process.env.RETOOL_PROJECT_URL,
      admin_name: r.username,
    },
    receiverEmail: r.email,
  }));
  bulkZeroAcceptedProjectAdminNoticeEmail(emailData);
  process.exit(0);
}

adminZeroAcceptedProjectNoticeJob();
