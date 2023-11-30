import { app_env } from "../../environment";
import createCollaboratedNotification from '../../notification/collaboratedNotification';
import { Context } from "../../types/context";
import { Prisma } from "@prisma/client";
import { Resolvers } from "../generated";

import { InternalError } from "../errors/InternalError";
import { PublicError } from "../errors/PublicError";
import { PermissionDeniedError } from "../errors/PermissionDeniedError";

import { createSendUserAcceptProjectRequestNoticeJob } from "../../queues/email.queues";
import { customerInvitationEmail } from "../../mailer/customer";
import { projectCollaboratorInvitationEmail, vendorMemberInvitationByUserEmail } from '../../mailer'

import { createResetPasswordToken } from "../../helper/auth";
import { checkAllowAddProjectCollaborator, checkAllowRemoveProjectCollaborator, checkProjectConnectionPermission } from "../../helper/accessControl";
import { ProjectAttachmentDocumentType, ProjectConnectionVendorStatus, ProjectRequestStatus, PROJECT_ATTACHMENT_DOCUMENT_TYPE, QuoteStatus, ProjectConnectionCollaborationStatus, ProjectConnectionVendorExperimentStatus, NotificationType, ProjectConnectionVendorDisplayStatus, CasbinRole, CasbinObj, CasbinAct, CompanyCollaboratorRoleType } from "../../helper/constant";
import { toDollar } from "../../helper/money";
import { filterByCollaborationStatus } from "../../helper/projectConnection";
import invariant from "../../helper/invariant";
import chatService from "../../services/chat/chat.service";
import collaboratorService from "../../services/collaborator/collaborator.service";
import { createResetPasswordUrl, getUserFullName } from "../../helper/email";
import { hasPermission } from "../../helper/casbin";

const resolvers: Resolvers<Context> = {
  ProjectConnection: {
    vendor_company: async (parent, _, context) => {
      invariant(parent.vendor_company_id, 'Vendor company id not found.');
      const vendorCompany = await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id,
        },
      });
      invariant(vendorCompany, 'Vendor company not found.');
      return vendorCompany;
    },
    project_request: async (parent, _, context) => {
      invariant(parent.project_request_id, 'Project request id not found.');
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: parent.project_request_id,
        },
      });
      invariant(projectRequest, 'Project request not found.');
      return {
        ...projectRequest,
        max_budget: projectRequest.max_budget?.toNumber() || 0,
      };
    },
    vendor_member_connections: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const vendorMemberConnections = await context.prisma.vendorMemberConnection.findMany({
        where: {
          project_connection_id: parent.id,
        },
      });

      return vendorMemberConnections;
    },
    customer_connections: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      return await context.prisma.customerConnection.findMany({
        where: {
          project_connection_id: parent.id
        },
      });
    },
    project_attachments: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const projectAttachments = await context.prisma.projectAttachment.findMany({
        where: {
          project_connection_id: parent.id
        },
      });

      return projectAttachments.map((a) => ({
        ...a,
        byte_size: Number(a.byte_size),
        document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[a.document_type],
      }));
    },
    quotes: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const currentUserId = context.req.user_id;

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
        include: {
          customer: true,
          vendor_member: true,
        }
      });

      invariant(currentUser, 'Current user not found.')

      const filter: Prisma.QuoteWhereInput = {
        project_connection_id: parent.id,
      };

      if (currentUser.customer) {
        filter.status = {
          not: QuoteStatus.DRAFT,
        };
      }

      const quotes = await context.prisma.quote.findMany({
        where: filter,
        orderBy: {
          created_at: 'asc',
        }
      });

      return quotes.map((quote) => {
        return {
          ...quote,
          amount: toDollar(quote.amount.toNumber())
        }
      });
    },
    chat: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      return await context.prisma.chat.findFirst({
        where: {
          project_connection_id: parent.id
        }
      });
    },
    messages: async (parent, args, context) => {
      invariant(parent.id, 'Project connection id not found.');
      invariant(context.req.user_id, 'Current user not found.');

      const messages = await context.prisma.message.findMany({
        where: {
          chat: {
            project_connection_id: parent.id,
          },
        },
      })

      return messages || [];
    },
    documents: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const projectAttachments = await context.prisma.projectAttachment.findMany({
        where: {
          project_connection_id: parent.id,
          document_type: ProjectAttachmentDocumentType.FILE,
        },
      });
      return projectAttachments.map((a) => ({
        ...a,
        byte_size: Number(a.byte_size),
        document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[a.document_type],
      }));
    },
    final_contract: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const projectAttachment = await context.prisma.projectAttachment.findFirst({
        where: {
          project_connection_id: parent.id,
          document_type: ProjectAttachmentDocumentType.REDLINE_FILE,
        },
      });
      return projectAttachment
        ? {
          ...projectAttachment,
          byte_size: Number(projectAttachment.byte_size),
          document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[projectAttachment.document_type],
        }
        : null;
    },
    collaborators_not_invited: async (parent, args, context) => {
      invariant(parent.id, 'Project connection id not found.');
      invariant(parent.project_request_id, 'Project request id not found.');

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        }
      });

      invariant(currentUser, 'Current user not found.');

      if (currentUser.customer) {
        const customers = await context.prisma.customer.findMany({
          where: {
            customer_connections: {
              none: {
                project_connection_id: parent.id,
              },
            },
            biotech_id: currentUser.customer.biotech_id,
          },
          include: {
            user: true,
          },
        });

        return customers.map((c) => c.user);
      }

      if (currentUser.vendor_member) {
        const vendorMembers = await context.prisma.vendorMember.findMany({
          where: {
            vendor_member_connections: {
              none: {
                project_connection_id: parent.id,
              },
            },
            vendor_company_id: currentUser.vendor_member.vendor_company_id,
          },
          include: {
            user: true,
          },
        });
        return vendorMembers.map((v) => v.user);
      }

      throw new InternalError('User is not customer nor vendor member');
    },
    internal_collaborators: async (parent, args, context) => {
      invariant(parent.id, 'Project connection id not found.');

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      invariant(currentUser, 'Current user not found.');

      let users;

      if (currentUser?.customer) {
        const customerConnections = await context.prisma.customerConnection.findMany({
          where: {
            project_connection_id: parent.id,
          },
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        });
        users = customerConnections.map((cc) => cc.customer.user);
      }

      if (currentUser?.vendor_member) {
        const vendorConnections = await context.prisma.vendorMemberConnection.findMany({
          where: {
            project_connection_id: parent.id,
          },
          include: {
            vendor_member: {
              include: {
                user: true,
              },
            },
          },
        });
        users = vendorConnections.map((vs) => vs.vendor_member.user);
      }

      invariant(users, 'Current user is not customer nor vendor member');

      return users;
    },
    external_collaborators: async (parent, args, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      invariant(currentUser, 'Current user not found.');

      if (currentUser?.customer) {
        const vendorConnections = await context.prisma.vendorMemberConnection.findMany({
          where: {
            project_connection_id: parent.id,
            vendor_member: {
              title: {
                not: null,
              },
            },
          },
          include: {
            vendor_member: {
              include: {
                user: true,
              },
            },
          },
        });
        return vendorConnections.map((vs) => vs.vendor_member.user);
      }

      if (currentUser?.vendor_member) {
        const customerConnections = await context.prisma.customerConnection.findMany({
          where: {
            project_connection_id: parent.id,
            customer: {
              has_setup_profile: true,
              job_title: {
                not: null,
              }
            },
          },
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        });
        return customerConnections.map((cc) => cc.customer.user);
      }

      throw new InternalError('Current user is not customer nor vendor member');
    },
    vendor_display_status: async (parent, args, context) => {
      const { vendor_status, project_request: parentProjectRequest, project_request_id } = parent;
      const now = new Date();

      invariant(parent.id, 'Project connection id not found.');

      if (parent.vendor_display_status) {
        return parent.vendor_display_status;
      }

      invariant(project_request_id, 'Project request id not found.');
      const projectRequest = parentProjectRequest
        || await context.prisma.projectRequest.findFirst({
          where: {
            id: project_request_id,
          },
        });

      invariant(projectRequest, 'Project request not found.');

      if (projectRequest.status === ProjectRequestStatus.WITHDRAWN) {
        return ProjectConnectionVendorDisplayStatus.WITHDRAWN;
      }

      if (
        vendor_status === ProjectConnectionVendorStatus.DECLINED
      ) {
        return ProjectConnectionVendorDisplayStatus.DECLINED;
      }

      if (vendor_status === ProjectConnectionVendorStatus.PENDING) {
        if (parent.expired_at && now >= parent.expired_at) {
          return ProjectConnectionVendorDisplayStatus.EXPIRED;
        }

        return ProjectConnectionVendorDisplayStatus.PENDING_DECISION;
      }

      if (vendor_status === ProjectConnectionVendorStatus.ACCEPTED) {
        return ProjectConnectionVendorDisplayStatus.ACCEPTED;
      }

      return null
    }
  },
  Query: {
    projectConnection: async (parent, args, context) => {
      await checkProjectConnectionPermission(context, args.id);
      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: args.id,
        },
      });
      return projectConnection;
    },
    projectConnections: async (parent, args, context) => {
      const { filter } = args;
      // find vendor member id
      const vendorMember = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });
      invariant(vendorMember, 'Vendor member not found.');
      // find vendor member connections
      const vendorMemberConnections = await context.prisma.vendorMemberConnection.findMany({
        where: {
          vendor_member_id: vendorMember.id,
        },
        include: {
          project_connection: {
            include: {
              quotes: {
                include: {
                  milestones: true,
                },
              },
              project_request: true,
            },
          },
        },
        orderBy: {
          project_connection: { created_at: 'desc' }
        }
      });

      const now = new Date();
      const projectConnections = vendorMemberConnections.map((vmc) => vmc.project_connection);
      let result = [...projectConnections];

      if (filter?.status) {
        // not expired project connections
        const validProjectConnections = projectConnections.filter((pc) => (pc?.expired_at && now < pc.expired_at) || pc.expired_at === null);

        if (filter.status === ProjectConnectionVendorExperimentStatus.UNOPEN) {
          const notiQueryTasks = validProjectConnections.map(async (pc) => {
            const notifications = await context.prisma.notification.findMany({
              where: {
                params: {
                  path: ["project_connection_id"],
                  equals: pc.id,
                },
                read_at: null,
                notification_type: NotificationType.ADMIN_INVITE_NOTIFICATION,
              },
            });
            return {
              ...pc,
              notifications,
            };
          });
          const projectConnectionWithNotifications = await Promise.all(notiQueryTasks);

          result = projectConnectionWithNotifications.filter((pc) => pc.notifications.length > 0)
        }

        if (filter.status === ProjectConnectionVendorExperimentStatus.PENDING) {
          result = validProjectConnections.filter((pc) =>
            pc.vendor_status === ProjectConnectionVendorStatus.PENDING &&
            pc.project_request.status !== ProjectRequestStatus.WITHDRAWN
          );
        }

        if (filter.status === ProjectConnectionVendorExperimentStatus.ONGOING) {
          result = filterByCollaborationStatus(projectConnections, ProjectConnectionCollaborationStatus.ONGOING)
            .filter((pc) => pc.vendor_status === ProjectConnectionVendorStatus.ACCEPTED && pc.project_request.status !== ProjectRequestStatus.WITHDRAWN);
        }

        if (filter.status === ProjectConnectionVendorExperimentStatus.COMPLETED) {
          result = filterByCollaborationStatus(projectConnections, ProjectConnectionCollaborationStatus.COMPLETED)
        }

        if (filter.status === ProjectConnectionVendorExperimentStatus.DECLINED) {
          result = projectConnections.filter((pc) => pc.vendor_status === ProjectConnectionVendorStatus.DECLINED)
        }

        if (filter.status === ProjectConnectionVendorExperimentStatus.EXPIRED) {
          result = projectConnections.filter((pc) =>
            pc.project_request.status === ProjectRequestStatus.WITHDRAWN ||
            (pc.vendor_status === ProjectConnectionVendorStatus.PENDING && (pc?.expired_at && now >= pc.expired_at))
          );
        }
      }

      // Sort & group result
      result = [
        // Accepted
        ...result.filter(pc => pc.vendor_status === ProjectConnectionVendorStatus.ACCEPTED && pc.project_request.status !== ProjectRequestStatus.WITHDRAWN),
        // Pending decision (Non expired)
        ...result.filter(pc =>
          pc.vendor_status === ProjectConnectionVendorStatus.PENDING &&
          pc.project_request.status !== ProjectRequestStatus.WITHDRAWN &&
          (pc.expired_at === null || (pc.expired_at && now < pc.expired_at))
        ),
        // Expired
        ...result.filter(pc =>
          pc.vendor_status === ProjectConnectionVendorStatus.PENDING &&
          pc.project_request.status !== ProjectRequestStatus.WITHDRAWN &&
          (pc.expired_at && now >= pc.expired_at)
        ),
        // Withdrawn
        ...result.filter(pc => pc.vendor_status === ProjectConnectionVendorStatus.DECLINED && pc.project_request.status !== ProjectRequestStatus.WITHDRAWN),
        ...result.filter(pc => pc.project_request.status === ProjectRequestStatus.WITHDRAWN),
      ]

      return result.map((pc) => ({
        ...pc,
        project_request: {
          ...pc.project_request,
          max_budget: pc.project_request.max_budget?.toNumber() || 0,
        },
        quotes: pc.quotes.map((q) => ({
          ...q,
          amount: q.amount.toNumber(),
          milestones: q.milestones.map((m) => ({
            ...m,
            amount: m.amount.toNumber(),
          }))
        })),
      }));
    },
    bioInvitedProjectConnections: async (parent, args, context) => {
      if (process.env.ENABLE_BIOTECH_INVITE_CRO === 'true') {
        const { project_request_id } = args;
        invariant(project_request_id, 'Project request id is required.');

        const projectConnections = await context.prisma.projectConnection.findMany({
          where: {
            project_request_id,
            AND: {
              biotech_invite_vendor_id: {
                not: null,
              }
            }
          },
          include: {
            vendor_company: true,
            biotech_invite_vendor: true,
          },
        });

        invariant(projectConnections, 'Project connections not found.');

        return projectConnections.map((pc) => ({
          ...pc,
          vendor_company: {
            ...pc.vendor_company,
          },
          biotech_invite_vendor: {
            ...pc.biotech_invite_vendor,
          },
        }));
      }
      return [];
    },
  },
  Mutation: {
    acceptProjectConnection: async (_, args, context) => {
      const currentDate = new Date();
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const allowAcceptProjectConnection = await hasPermission(currentUserId, CasbinObj.PROJECT_CONNECTION, CasbinAct.WRITE);
      invariant(allowAcceptProjectConnection, new PermissionDeniedError());

      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: args.id,
        },
        include: {
          customer_connections: true,
          project_request: true,
        },
      });
      invariant(projectConnection, 'Project connection not found.');

      if (projectConnection.expired_at && currentDate >= projectConnection.expired_at) {
        throw new PublicError('You can no longer accept this request');
      }

      const updatedProjectConnection = await context.prisma.$transaction(async (trx) => {
        if (projectConnection.project_request.status === ProjectRequestStatus.WITHDRAWN) {
          throw new PublicError('Project request has been withdrawn')
        }

        if (projectConnection.project_request.status === ProjectRequestStatus.PROCESSING) {
          await trx.projectRequest.update({
            where: {
              id: projectConnection.project_request_id,
            },
            data: {
              status: ProjectRequestStatus.MATCHED,
            },
          });
        }

        let chat = await trx.chat.findFirst({
          where: {
            project_connection_id: projectConnection.id,
          },
        });

        if (!chat) {
          chat = await trx.chat.create({
            data: {
              biotech_id: projectConnection.project_request.biotech_id,
              vendor_company_id: projectConnection.vendor_company_id,
              project_connection_id: projectConnection.id,
            },
          });
        }

        await chatService.createSystemMessage(
          {
            chat_id: chat.id,
            content: "You've matched! Start your conversation by typing in the chat box for quick start!"
          },
          { prisma: trx }
        )

        return await trx.projectConnection.update({
          where: {
            id: args.id,
          },
          data: {
            vendor_status: ProjectConnectionVendorStatus.ACCEPTED,
          },
        });
      });

      createSendUserAcceptProjectRequestNoticeJob({
        projectConnectionId: projectConnection.id,
        senderUserId: currentUserId,
      });

      return updatedProjectConnection;
    },
    declinedProjectConnection: async (_, args, context) => {
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const allowDeclineProjectConnection = await hasPermission(currentUserId, CasbinObj.PROJECT_CONNECTION, CasbinAct.WRITE);
      invariant(allowDeclineProjectConnection, new PermissionDeniedError());

      const currentDate = new Date();
      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: args.id,
        },
      });
      invariant(projectConnection, 'Project connection not found.');
      // Check for expiry if project connection has never responsed.
      if (projectConnection.vendor_status === ProjectConnectionVendorStatus.PENDING
        && projectConnection.expired_at && currentDate >= projectConnection.expired_at) {
        throw new PublicError('You can no longer decline this request');
      }
      const updatedProjectConnection = await context.prisma.projectConnection.update({
        where: {
          id: args.id,
        },
        data: {
          vendor_status: ProjectConnectionVendorStatus.DECLINED,
        },
      });
      return updatedProjectConnection;
    },
    addProjectCollaborator: async (parent, args, context) => {
      const { project_connection_id, user_id } = args;

      await checkAllowAddProjectCollaborator(context);

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
      });

      invariant(currentUser, 'Current user not found.');

      const user = await context.prisma.user.findFirst({
        where: {
          id: user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
          notifications: true,
        },
      });

      invariant(user, 'User not found.');

      if (user.customer || user.vendor_member) {
        if (user?.customer) {
          await context.prisma.customerConnection.upsert({
            where: {
              project_connection_id_customer_id: {
                customer_id: user.customer.id,
                project_connection_id,
              },
            },
            create: {
              customer_id: user.customer.id,
              project_connection_id,
            },
            update: {
              customer_id: user.customer.id,
              project_connection_id,
            },
          });
        } else if (user?.vendor_member) {
          await context.prisma.vendorMemberConnection.upsert({
            where: {
              project_connection_id_vendor_member_id: {
                vendor_member_id: user.vendor_member.id,
                project_connection_id,
              },
            },
            create: {
              vendor_member_id: user.vendor_member.id,
              project_connection_id,
            },
            update: {
              vendor_member_id: user.vendor_member.id,
              project_connection_id,
            },
          });
        }

        const projectConnection = await context.prisma.projectConnection.findFirst({
          where: {
            id: project_connection_id,
          },
          include: {
            project_request: {
              select: {
                title: true,
              },
            },
          },
        });

        if (projectConnection) {
          projectCollaboratorInvitationEmail({
            login_url: `${app_env.APP_URL}/app/project-connection/${project_connection_id}`,
            inviter_full_name: `${currentUser.first_name} ${currentUser.last_name}`,
            project_title: projectConnection.project_request.title,
            receiver_full_name: `${user.first_name} ${user.last_name}`,
          }, user.email)

          try {
            createCollaboratedNotification(currentUser.id, user.id, projectConnection.id)
          } catch (error) {
            console.log(error)
          }
        } else {
          // no-op
          // TODO: report to bug channel
        }

        return user;
      }

      throw new InternalError('User is not customer nor vendor member');
    },
    removeProjectCollaborator: async (parent, args, context) => {
      const { project_connection_id, user_id } = args;

      await checkAllowRemoveProjectCollaborator(context);

      const user = await context.prisma.user.findFirst({
        where: {
          id: user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      invariant(user, 'User not found.');

      if (user.customer) {
        await context.prisma.customerConnection.delete({
          where: {
            project_connection_id_customer_id: {
              customer_id: user.customer.id,
              project_connection_id,
            },
          },
        });
        return user;
      }

      if (user.vendor_member) {
        await context.prisma.vendorMemberConnection.delete({
          where: {
            project_connection_id_vendor_member_id: {
              vendor_member_id: user.vendor_member.id,
              project_connection_id,
            },
          },
        });
        return user;
      }

      throw new InternalError('User is not customer nor vendor member');
    },
    inviteProjectCollaboratorViaEmail: async (parent, args, context) => {
      const currentUserId = context.req.user_id;
      const { project_connection_id, email, first_name, last_name, custom_message, role } = args;
      const castedRole = (role as CompanyCollaboratorRoleType) || CompanyCollaboratorRoleType.USER;

      invariant(currentUserId, 'Current user id not found.');

      // Check if current user has the permission to set the role.
      if (castedRole) {
        const roleEnum = Object.values(CompanyCollaboratorRoleType);
        invariant(roleEnum.includes(castedRole as CompanyCollaboratorRoleType), 'Invalid company collaborator role.');
        await collaboratorService.checkPermissionToEditRole({
          role: castedRole,
          user_id: currentUserId,
        });
      }

      await checkAllowAddProjectCollaborator(context);

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      invariant(currentUser, 'Current user not found.');

      const existingUser = await context.prisma.user.findFirst({
        where: {
          email: email,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      if (existingUser) {
        // If user exists and same company as the current user.
        if ((existingUser.customer && existingUser.customer?.biotech_id === currentUser.customer?.biotech_id)
          || (existingUser.vendor_member && existingUser.vendor_member.vendor_company_id === currentUser.vendor_member?.vendor_company_id)) {
          throw new PublicError('User already exists.');
        } else {
          // If user exists but not the same company as the current user.
          throw new PublicError('Please make sure the user is belong to your company.')
        }
      }

      const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const resetToken = createResetPasswordToken();

      const isBiotech = !!currentUser.customer;
      const isVendor = !!currentUser.vendor_member;

      // If user doesn't exists
      // 1. Create new user
      // 2. Create customer/vendor member connection
      // 3. Send invitation email
      return await context.prisma.$transaction(async (trx) => {

        const newUser = await trx.user.create({
          data: {
            first_name,
            last_name,
            email,
            reset_password_token: resetToken,
            reset_password_expiration: new Date(resetTokenExpiration),
            customer: isBiotech
              ? {
                create: {
                  biotech_id: currentUser.customer!.biotech_id,
                  customer_connections: {
                    create: {
                      project_connection_id,
                    },
                  },
                },
              }
              : undefined,
            vendor_member: isVendor
              ? {
                create: {
                  vendor_company_id: currentUser.vendor_member!.vendor_company_id,
                  vendor_member_connections: {
                    create: {
                      project_connection_id,
                    },
                  },
                },
              }
              : undefined,
          },
          include: {
            customer: true,
            vendor_member: true,
          },
        });
        const emailMessage = custom_message || '';

        const newUserFullName = getUserFullName(newUser)
        const resetPasswordUrl = createResetPasswordUrl(resetToken)
        const currentUserFullName = getUserFullName(currentUser)

        // Send email
        if (isBiotech) {
          customerInvitationEmail(
            {
              inviter_full_name: currentUserFullName,
              inviter_message: emailMessage,
              login_url: resetPasswordUrl,
              receiver_full_name: newUserFullName,
            },
            newUser.email,
          );
        }
        if (isVendor) {
          vendorMemberInvitationByUserEmail(
            {
              inviter_full_name: currentUserFullName,
              inviter_message: emailMessage,
              login_url: resetPasswordUrl,
              receiver_full_name: newUserFullName,
            },
            newUser.email,
          );
        }

        // Update company role and casbin role
        await collaboratorService.updateUserRole({
          role: castedRole,
          user_id: newUser.id,
        }, { prisma: trx });

        // Create notification
        createCollaboratedNotification(currentUser.id, newUser.id, project_connection_id)

        return newUser;
      });
    },
  },
};

export default resolvers;
