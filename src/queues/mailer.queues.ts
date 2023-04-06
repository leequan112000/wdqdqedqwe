import { AdminTeam } from "../helper/constant";
import { prisma } from '../connectDB';
import { sendAdminNewProjectRequestEmail } from "../mailer/admin";
import Queue from 'bull';

export const sendAdminNewProjectRequestEmailQueue = new Queue(
  `notify_admin_new_project_request_email_${Date.now()}`,
  process.env.REDIS_URL!
);

sendAdminNewProjectRequestEmailQueue.process(async (job: Queue.Job<{biotechName: string}>) => {
  const { biotechName } = job.data;
  const admins = await prisma.admin.findMany({
    where: {
      team: AdminTeam.SCIENCE
    }
  });

  await Promise.all(
    admins.map(admin => {
      sendAdminNewProjectRequestEmail(admin, biotechName);
    })
  );
});
