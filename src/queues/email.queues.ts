import { AdminTeam, EmailType, NotificationType } from "../helper/constant";
import { createQueue } from "../helper/queue";
import { prisma } from "../connectDB";
import { sendAdminNewCroInterestNoticeEmail, sendAdminNewProjectRequestCommentEmail, sendAdminNewProjectRequestEmail, sendAdminZeroAcceptedProjectNoticeEmail } from "../mailer/admin";
import { User } from "@prisma/client";
import { app_env } from "../environment";
import { sendContractUploadNoticeEmail, sendDocumentUploadNoticeEmail } from "../mailer/projectAttachment";
import { sendNewMessageNoticeEmail } from "../mailer/message";
import { sendAcceptProjectRequestEmail } from "../mailer/projectRequest";
import { sendVendorMemberProjectRequestInvitationByAdminEmail } from "../mailer/vendorMember";
import createFinalContractUploadNotification from "../notification/finalContractUploadNotification";
import createFileUploadNotification from "../notification/fileUploadNotification";
import createMessageNotification from "../notification/messageNotification";
import createAcceptRequestNotification from "../notification/acceptRequestNotification";
import createAdminInviteNotification from "../notification/adminInviteNotification";

type EmailJob = {
  type: EmailType;
  data: any;
}

const emailQueue = createQueue<EmailJob>('email');

emailQueue.process(async (job, done) => {
  const { data, type } = job.data;

  try {
    switch (type) {
      case EmailType.ADMIN_NEW_PROJECT_REQUEST: {
        const { biotechName } = data;
        const admins = await prisma.admin.findMany({
          where: {
            team: AdminTeam.SCIENCE,
          },
        });

        const result = await Promise.all(
          admins.map(admin => sendAdminNewProjectRequestEmail(admin, biotechName))
        );

        done(null, result);
        break;
      }
      case EmailType.ADMIN_PROJECT_INVITATION: {
        const { receiverEmail, projectRequestName, projectRequestId, vendorCompanyId, primaryMemberUserId, projectConnectionId } = data;
        await sendVendorMemberProjectRequestInvitationByAdminEmail({
          login_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}/project-request`,
          project_request_name: projectRequestName,
        }, receiverEmail);

        const projectConnection = await prisma.projectConnection.findFirst({
          where: {
            project_request_id: projectRequestId,
            vendor_company_id: vendorCompanyId,
          }
        })

        await createAdminInviteNotification(primaryMemberUserId, projectConnection!.id);

        done();
        break;
      }
      case EmailType.ADMIN_NEW_PROJECT_REQUEST_COMMENT: {
        const { biotechName } = data;

        const admins = await prisma.admin.findMany({
          where: {
            team: AdminTeam.SCIENCE
          }
        });

        await Promise.all(
          admins.map(admin => {
            sendAdminNewProjectRequestCommentEmail({
              admin_name: admin.username,
              biotech_name: biotechName,
            }, admin.email);
          })
        );

        done();
        break;
      }
      case EmailType.ADMIN_CRO_INTEREST_NOTICE: {
        const { companyName } = data;

        const admins = await prisma.admin.findMany({
          where: {
            team: AdminTeam.SCIENCE
          }
        });

        const results = await Promise.all(
          admins.map((admin) => sendAdminNewCroInterestNoticeEmail({
            admin_name: admin.username,
            company_name: companyName,
          }, admin.email))
        );

        done(null, results);
        break;
      }
      case EmailType.ADMIN_ZERO_ACCEPTED_PROJECT_NOTICE: {
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

        const data = project_connections.map((pc) => 
          `${pc.project_request.biotech.name}: ${pc.project_request.title}`,
        ).join('; ');

        const admins = await prisma.admin.findMany({
          where: {
            team: AdminTeam.SCIENCE
          }
        });

        await Promise.all(
          admins.map((admin) => sendAdminZeroAcceptedProjectNoticeEmail(admin, data))
        );

        done();
        break;
      }
      case EmailType.USER_FILE_UPLOAD_NOTICE: {
        const {
          projectConnectionId,
          uploaderUserId,
          isFinalContract,
          action,
        } = data;

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
        done();
        break;
      }
      case EmailType.USER_NEW_MESSAGE_NOTICE: {
        const { projectConnectionId, senderUserId } = data;

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

        done();
        break;
      }
      case EmailType.USER_ACCEPT_PROJECT_REQUEST_NOTICE: {
        const { projectConnectionId, senderUserId } = data;

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

              await createAcceptRequestNotification(senderUserId, receiver.id, projectConnection.id);
            })
          );
        }

        done();
        break;
      }
      default:
        done(new Error('No type match.'))
        break;
    }
  } catch (error) {
    if (error instanceof Error) {
      done(error);
    }
  }
});

export const createSendAdminNewProjectRequestEmailJob = (data: {
  biotechName: string;
}) => {
  emailQueue.add({ type: EmailType.ADMIN_NEW_PROJECT_REQUEST, data });
}

export const createSendUserFileUploadNotice = (data: {
  projectConnectionId: string;
  uploaderUserId: string;
  isFinalContract: boolean;
  action?: string;
}) => {
  emailQueue.add({ type: EmailType.USER_FILE_UPLOAD_NOTICE, data })
}

export const createSendUserNewMessageNoticeJob = (data: { projectConnectionId: string, senderUserId: string }) => {
  emailQueue.add({ type: EmailType.USER_NEW_MESSAGE_NOTICE, data })
}

export const createSendAdminProjectInvitationJob = (data: {
  receiverEmail: string;
  projectRequestName: string;
  projectRequestId: string;
  vendorCompanyId: string;
  primaryMemberUserId: string;
  projectConnectionId: string
}) => {
  emailQueue.add({ type: EmailType.ADMIN_PROJECT_INVITATION, data })
}

export const createSendAdminNewProjectRequestCommentJob = (data: { biotechName: string }) => {
  emailQueue.add({ type: EmailType.ADMIN_NEW_PROJECT_REQUEST_COMMENT, data })
}

export const createSendAdminCroInterestNoticeJob = (data: { companyName: string }) => {
  emailQueue.add({ type: EmailType.ADMIN_CRO_INTEREST_NOTICE, data })
}

export const createSendUserAcceptProjectRequestNoticeJob = (data: { projectConnectionId: string; senderUserId: string; }) => {
  emailQueue.add({ type: EmailType.USER_ACCEPT_PROJECT_REQUEST_NOTICE, data })
}

export const createSendAdminZeroAcceptedProjectNoticeJob = (data: { list: string }) => {
  emailQueue.add({ type: EmailType.ADMIN_ZERO_ACCEPTED_PROJECT_NOTICE, data }, { repeat: { cron: '0 10 * * *' }})
}
