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
        byte_size: Number(a.byte_size) * 1.0 / 1024
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
    customer_users: async (parent, args, context) => {
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
      const customerConnections = await context.prisma.customerConnection.findMany({
        where: {
          project_connection_id: parent.id
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
    },
    vendor_users: async (parent, args, context) => {
      if (!parent?.id) {
        throw new InternalError('Project connection id not found');
      }
      const customerConnections = await context.prisma.vendorMemberConnection.findMany({
        where: {
          project_connection_id: parent.id
        },
        include: {
          vendor_member: {
            include: {
              user: true,
            },
          },
        },
      });

      return customerConnections.map((cc) => cc.vendor_member.user);
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
    projectConnections: async (_: void, args: void, context: Context & { req: Request }) => {
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
      return vendorMemberConnections.map(vmc => vmc.project_connection);
    }
  },
};

export default resolvers;
