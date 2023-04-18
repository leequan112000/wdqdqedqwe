import { app_env } from "../../environment";
import createCollaboratedNotification from '../../notification/collaboratedNotification';
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { NotFoundError } from "../errors/NotFoundError";
import { ProjectAttachmentDocumentType, ProjectConnectionVendorStatus, ProjectRequestStatus, PROJECT_ATTACHMENT_DOCUMENT_TYPE } from "../../helper/constant";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../../generated";
import { sendProjectCollaboratorInvitationEmail } from '../../mailer/projectConnection';
import { sendAcceptProjectRequestNotificationQueue } from "../../queues/notification.queues";

const resolvers: Resolvers<Context> = {
  ProjectConnection: {
    vendor_company: async (parent, _, context) => {
      if (!parent?.vendor_company_id) {
        throw new InternalError('Vendor company id not found');
      }
      const vendorCompany = await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id,
        },
      });
      if (!vendorCompany) {
        throw new InternalError('Vendor company not found');
      }
      return vendorCompany;
    },
    project_request: async (parent, _, context) => {
      if (!parent?.project_request_id) {
        throw new InternalError('Project request id not found');
      }
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: parent.project_request_id,
        },
      });
      if (!projectRequest) {
        throw new InternalError('Project request not found');
      }
      return {
        ...projectRequest,
        max_budget: projectRequest.max_budget?.toNumber() || 0,
      };
    },
    vendor_member_connections: async (parent, _, context) => {
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
      const vendorMemberConnections = await context.prisma.vendorMemberConnection.findMany({
        where: {
          project_connection_id: parent.id,
        },
      });

      return vendorMemberConnections;
    },
    customer_connections: async (parent, _, context) => {
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
      return await context.prisma.customerConnection.findMany({
        where: {
          project_connection_id: parent.id
        },
      });
    },
    project_attachments: async (parent, _, context) => {
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
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
    chat: async (parent, _, context) => {
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
      return await context.prisma.chat.findFirst({
        where: {
          project_connection_id: parent.id
        }
      });
    },
    messages: async (parent, args, context) => {
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
      const chat = await context.prisma.chat.findFirst({
        where: {
          project_connection_id: parent.id,
        },
        include: {
          messages: true,
        },
      });

      return chat?.messages || [];
    },
    documents: async (parent, _, context) => {
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
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
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
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
      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }
      if (!parent.id) {
        throw new InternalError('Project connection id not found');
      }
      if (!parent.project_request_id) {
        throw new InternalError('Project request id not found');
      }

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        }
      });

      if (!currentUser) {
        throw new InternalError('Current user not found');
      }

      if (currentUser.customer) {
        const customers = await context.prisma.customer.findMany({
          where: {
            customer_connections: {
              none: {
                project_connection_id: parent.id,
              },
            },
            has_setup_profile: true,
            project_requests: {
              every: {
                id: parent.project_request_id,
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
            title: {
              not: null,
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
      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }
      if (!parent.id) {
        throw new InternalError('Project connection id not found')
      }

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

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

      if (!users) {
        throw new InternalError('Current user is not customer nor vendor member');
      }

      return users.map((u) => ({
        ...u,
        can_be_removed: u.id !== context.req.user_id, // cannot delete current user
      }))
    },
    external_collaborators: async (parent, args, context) => {
      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }
      if (!parent.id) {
        throw new InternalError('Project connection id not found')
      }
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      if (currentUser?.customer) {
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
        return vendorConnections.map((vs) => vs.vendor_member.user);
      }

      if (currentUser?.vendor_member) {
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
        return customerConnections.map((cc) => cc.customer.user);
      }

      throw new InternalError('Current user is not customer nor vendor member');
    },
    vendor_status: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Project connection id not found')
      }
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          project_connections: {
            every: {
              id: parent.id,
            }
          }
        }
      });

      return parent.vendor_status || ProjectConnectionVendorStatus.PENDING;
    }
  },
  Query: {
    projectConnection: async (parent, args, context) => {
      let projectConnection
      try {
        projectConnection = await context.prisma.projectConnection.findFirstOrThrow({
          where: {
            id: args.id,
          },
        });
      } catch (error) {
        throw new NotFoundError();
      }

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id
        },
        include: {
          customer: true,
        },
      });

      if (!projectConnection || currentUser?.customer && projectConnection?.vendor_status === ProjectConnectionVendorStatus.DECLINED) {
        throw new NotFoundError();
      }

      return projectConnection;
    },
    projectConnections: async (parent, args, context) => {
      // find vendor member id
      const vendorMember = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });
      if (vendorMember === null) {
        throw new InternalError('Vendor member not found!')
      }
      // find vendor member connections
      const vendorMemberConnections = await context.prisma.vendorMemberConnection.findMany({
        where: {
          vendor_member_id: vendorMember.id,
        },
        include: {
          project_connection: true,
        }
      });
      // find project connections, return project connections
      return vendorMemberConnections.map((vmc) => vmc.project_connection);
    }
  },
  Mutation: {
    acceptProjectConnection: async (_, args, context) => {
      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }

      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: args.id,
        },
        include: {
          customer_connections: true,
          project_request: true,
        },
      });
      if (!projectConnection) {
        throw new InternalError('Project connection not found');
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

        return await trx.projectConnection.update({
          where: {
            id: args.id,
          },
          data: {
            vendor_status: ProjectConnectionVendorStatus.ACCEPTED,
          },
        });
      });

      sendAcceptProjectRequestNotificationQueue.add({
        projectConnectionId: projectConnection.id,
        senderUserId: context.req.user_id,
      });

      return updatedProjectConnection;
    },
    declinedProjectConnection: async (_, args, context) => {
      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: args.id,
        },
      });
      if (!projectConnection) {
        throw new InternalError('Project connection not found');
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

      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
      });

      if (!currentUser) {
        throw new InternalError('Current user not found');
      }

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

      if (!user) {
        throw new InternalError('User not found');
      }

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
          sendProjectCollaboratorInvitationEmail({
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

      const user = await context.prisma.user.findFirst({
        where: {
          id: user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      if (!user) {
        throw new InternalError('User not found');
      }

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
  },
};

export default resolvers;
