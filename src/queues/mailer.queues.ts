import { AdminTeam } from "../helper/constant";
import { app_env } from "../environment";
import { prisma } from '../connectDB';
import Queue from 'bull';
import { sendAdminNewProjectRequestEmail } from "../mailer/admin";
import { sendDocumentUploadNoticeEmail } from "../mailer/projectAttachment";
import { User } from "@prisma/client";

export const sendAdminNewProjectRequestEmailQueue = new Queue(
  `send_admin_new_project_request_email_${Date.now()}`,
  process.env.REDIS_URL!
);

sendAdminNewProjectRequestEmailQueue.process(async (job: Queue.Job<{ biotechName: string }>) => {
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


export const sendDocumentUploadNoticeEmailQueue = new Queue(
  `send_file_upload_notice_email_${Date.now()}`,
  process.env.REDIS_URL!
);

sendDocumentUploadNoticeEmailQueue.process(async (job: Queue.Job<{ projectConnectionId: string, uploaderUserId: string }>) => {
  const { projectConnectionId, uploaderUserId } = job.data;
  const projectConnection = await prisma.projectConnection.findFirstOrThrow({
    where: {
      id: projectConnectionId,
    },
    include: {
      customer_connections: true,
      vendor_member_connections: true,
      project_request: true,
    }
  });

  const vendor = await prisma.vendorMember.findFirst({
    where: {
      user_id: uploaderUserId,
    },
    include: {
      vendor_company: true,
    }
  });

  let senderCompanyName = "";
  let receivers: User[] = [];

  if (vendor) {
    // if uploader is vendor, notify biotech members
    senderCompanyName = vendor.vendor_company?.name as string;
    receivers = await prisma.user.findMany({
      where: {
        customer: {
          id: {
            in: projectConnection.customer_connections.map(cc => cc.customer_id),
          }
        }
      }
    });
  } else {
    // if uploader is customer, notify vendor members
    const customer = await prisma.customer.findFirstOrThrow({
      where: {
        user_id: uploaderUserId,
      },
      include: {
        biotech: true,
      }
    });
    senderCompanyName = customer.biotech.name;
    receivers = await prisma.user.findMany({
      where: {
        vendor_member: {
          id: {
            in: projectConnection.vendor_member_connections.map(vmc => vmc.vendor_member_id),
          }
        }
      }
    });
  }

  await Promise.all(
    receivers.map(receiver => {
      sendDocumentUploadNoticeEmail({
        login_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}`,
        receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
        project_title: projectConnection.project_request.title,
        company_name: senderCompanyName,
      }, receiver.email);
    })
  );
});
