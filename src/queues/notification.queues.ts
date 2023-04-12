import { AdminTeam } from "../helper/constant";
import { app_env } from "../environment";
import createAcceptRequestNotification from "../notification/acceptRequestNotification";
import createMessageNotification from '../notification/messageNotification';
import createFileUploadNotification from "../notification/fileUploadNotification";
import createFinalContractUploadNotification from "../notification/finalContractUploadNotification";
import { NotificationType } from '../helper/constant';
import { prisma } from '../connectDB';
import Queue from 'bull';
import { sendAdminNewProjectRequestEmail } from "../mailer/admin";
import { sendAcceptProjectRequestEmail } from "../mailer/projectRequest";
import { sendNewMessageNoticeEmail } from "../mailer/message";
import { sendContractUploadNoticeEmail, sendDocumentUploadNoticeEmail } from "../mailer/projectAttachment";
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


export const sendFileUploadNotificationQueue = new Queue(
  `send_file_upload_notice_email_${Date.now()}`,
  process.env.REDIS_URL!
);

sendFileUploadNotificationQueue.process(async (job: Queue.Job<{
  projectConnectionId: string,
  uploaderUserId: string,
  isFinalContract: boolean,
  action?: string,
}>) => {
  const { projectConnectionId, uploaderUserId, isFinalContract, action } = job.data;
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

  if (isFinalContract) {
    await Promise.all(
      receivers.map(async (receiver) => {
        await sendContractUploadNoticeEmail(
          {
            login_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}`,
            receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
            project_title: projectConnection.project_request.title,
            company_name: senderCompanyName,
          },
          receiver.email,
          action!,
        );
        await createFinalContractUploadNotification(uploaderUserId, receiver.id, projectConnection.id);
      })
    );
  } else {
    await Promise.all(
      receivers.map(async (receiver) => {
        await sendDocumentUploadNoticeEmail({
          login_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}`,
          receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
          project_title: projectConnection.project_request.title,
          company_name: senderCompanyName,
        }, receiver.email);

        await createFileUploadNotification(uploaderUserId, receiver.id, projectConnection.id);
      })
    );
  }
});

export const sendNewMessageNotificationQueue = new Queue(
  `send_new_message_notice_email_${Date.now()}`,
  process.env.REDIS_URL!
);

sendNewMessageNotificationQueue.process(async (job: Queue.Job<{ projectConnectionId: string, senderUserId: string }>) => {
  const { projectConnectionId, senderUserId } = job.data;

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
      user_id: senderUserId,
    },
    include: {
      vendor_company: true,
    }
  });

  let senderCompanyName = "";
  let receivers: User[] = [];

  if (vendor) {
    // if sender is vendor, notify biotech members
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
    // if sender is customer, notify vendor members
    const customer = await prisma.customer.findFirstOrThrow({
      where: {
        user_id: senderUserId,
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
    receivers.map(async (receiver) => {
      const notification = await prisma.notification.findFirst({
        where: {
          recipient_id: receiver.id,
          notification_type: NotificationType.MESSAGE_NOTIFICATION,
          read_at: null,
          params: {
            path: ['project_connection_id'],
            equals: projectConnection.id,
          },
        }
      });

      if (!notification) {
        await sendNewMessageNoticeEmail(
          {
            login_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}`,
            receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
            project_title: projectConnection.project_request.title,
            company_name: senderCompanyName,
          },
          receiver.email,
        );
        await createMessageNotification(senderUserId, receiver.id, projectConnection.id);
      }
    })
  );
});

export const sendAcceptProjectRequestNotificationQueue = new Queue(
  `send_accept_project_request_notice_email_${Date.now()}`,
  process.env.REDIS_URL!
);

sendAcceptProjectRequestNotificationQueue.process(async (job: Queue.Job<{ projectConnectionId: string, senderUserId: string }>) => {
  const { projectConnectionId, senderUserId } = job.data;

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
      user_id: senderUserId,
    },
    include: {
      vendor_company: true,
    }
  });

  if (vendor) {
    // notify biotech members
    const receivers = await prisma.user.findMany({
      where: {
        customer: {
          id: {
            in: projectConnection.customer_connections.map(cc => cc.customer_id),
          }
        }
      }
    });

    await Promise.all(
      receivers.map(async (receiver) => {
        await sendAcceptProjectRequestEmail(
          {
            login_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}`,
            receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
            project_title: projectConnection.project_request.title,
            vendor_company_name: vendor.vendor_company?.name as string,
          },
          receiver.email,
        );

        await createAcceptRequestNotification(senderUserId ,receiver.id, projectConnection.id);
      })
    );
  }
});
