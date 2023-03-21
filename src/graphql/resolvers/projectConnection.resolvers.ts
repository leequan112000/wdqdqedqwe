import { ProjectAttachmentDocumentType, ProjectConnectionVendorStatus, PROJECT_ATTACHMENT_DOCUMENT_TYPE } from "../../../src/helper/constant";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../generated";

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
    }
  },
  Query: {
    projectConnection: async (parent, args, context) => {
      if (args.id) {

      }
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: args.id,
        },
      });
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
      return vendorMemberConnections;
    }
  },
  Mutation: {
    acceptProjectConnection: async (_, args, context) => {
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
          vendor_status: ProjectConnectionVendorStatus.ACCEPTED,
        },
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
        return user;
      }

      if (user?.vendor_member) {
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
