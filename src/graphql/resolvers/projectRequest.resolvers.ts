import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers, ProjectRequestComment, ProjectRequest } from "../generated";
import { ProjectRequestStatus } from "../../helper/constant";
import { sendProjectRequestSubmissionEmail } from "../../mailer/projectRequest";
import { sendAdminNewProjectRequestEmail } from "../../mailer/admin";
import { nonNullable } from '../../helper/filter'

const resolvers: Resolvers<Context> = {
  ProjectRequest: {
    biotech: async (parent, _, context) => {
      if (!parent.biotech_id) {
        return {};
      }
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id
        }
      });
    },
    customer: async (parent, _, context) => {
      if (!parent.customer_id) {
        return {};
      }
      return await context.prisma.customer.findFirst({
        where: {
          id: parent.customer_id
        }
      })
    },
    project_connections: async (parent, args, context) => {
      if (!parent.id) {
        throw new Error('Missing id.');
      }

      return await context.prisma.projectConnection.findMany({
        where: {
          project_request_id: parent.id
        },
        orderBy: [
          { final_contract_uploaded_at: { sort: 'desc', nulls: 'last' } },
          { updated_at: 'desc' }
        ]
      })
    },
    project_request_comments: async (parent, _, context) => {
      if (!parent.id) {
        throw new Error('Missing id.');
      }

      const data = await context.prisma.projectRequestComment.findMany({
        where: {
          project_request_id: parent.id
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const processed: ProjectRequestComment[] = data.map((d) => ({
        content: d.content,
        created_at: d.created_at.toISOString(),
        id: d.id,
        project_request_id: d.project_request_id,
        updated_at: d.updated_at.toISOString()
      }))
      return processed;
    },
  },
  Query: {
    projectRequests: async (_, args, context) => {
      const customer = await context.prisma.customer.findFirstOrThrow({
        where: {
          user_id: context.req.user_id
        }
      });

      const data = await context.prisma.projectRequest.findMany({
        where: {
          customer_id: customer.id,
          ...(args.status && args.status.length > 0 ? {
            status: {
              in: args.status.filter(nonNullable),
            }
          } : {}),
        },
        orderBy: {
          updated_at: 'desc'
        }
      });

      const processed: ProjectRequest[] = data.map((d) => ({
        ...d,
        max_budget: d.max_budget?.toNumber() || 0,
      }))

      return processed;
    },
    projectRequest: async (_, args, context) => {
      const data = await context.prisma.projectRequest.findFirst({
        where: {
          id: args.id!
        }
      });
      if (data === null) {
        throw new Error('')
      }
      return {
        ...data,
        max_budget: data.max_budget?.toNumber() || 0,
      };
    }
  },
  Mutation: {
    createProjectRequest: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirstOrThrow({
          where: {
            id: context.req.user_id
          },
          include: {
            customer: {
              include: {
                biotech: true
              }
            }
          }
        });

        if (!user.customer) {
          throw new PublicError('User is not a customer.');
        }
        const projectRequest = await trx.projectRequest.create({
          data: {
            status: ProjectRequestStatus.PROCESSING,
            customer_id: user.customer.id,
            biotech_id: user.customer.biotech_id,
            ...args,
          }
        });


        // TODO implement queue
        sendProjectRequestSubmissionEmail(user);
        await sendAdminNewProjectRequestEmail(user.customer.biotech.name);

        return {
          ...projectRequest,
          max_budget: projectRequest.max_budget?.toNumber() || 0,
        };
      });
    },
    withdrawProjectRequest: async (_, args, context) => {
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: args.project_request_id
        },
      });
      if (projectRequest) {
        const updatedRequest = await context.prisma.projectRequest.update({
          data: {
            status: ProjectRequestStatus.WITHDRAWN,
          },
          where: {
            id: args.project_request_id,
          },
        });

        return {
          ...updatedRequest,
          max_budget: updatedRequest.max_budget?.toNumber() || 0,
        };
      }
      throw new PublicError('Project request not found.')
    },
  },
};

export default resolvers;
