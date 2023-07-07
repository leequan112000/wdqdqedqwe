import { Context } from "../../types/context";
import { nonNullable } from '../../helper/filter'
import { PublicError } from "../errors/PublicError";
import { PermissionDeniedError } from "../errors/PermissionDeniedError";
import { ProjectConnectionCollaborationStatus, ProjectRequestStatus } from "../../helper/constant";
import { Prisma } from "@prisma/client";
import { Resolvers, ProjectRequestComment, ProjectRequest } from "../../generated";
import { sendProjectRequestSubmissionEmail } from "../../mailer/projectRequest";
import { createSendAdminNewProjectRequestEmailJob } from "../../queues/email.queues";
import { filterByCollaborationStatus } from "../../helper/projectConnection";

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

      const { filter } = args;

      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      const projectConnections = await context.prisma.projectConnection.findMany({
        where: {
          project_request_id: parent.id,
          customer_connections: {
            some: {
              customer_id: customer?.id
            },
          },
          vendor_status: filter?.vendor_status
            ? {
              equals: filter.vendor_status,
            }
            : {},
        },
        orderBy: [
          { final_contract_uploaded_at: { sort: 'desc', nulls: 'last' } },
          { updated_at: 'desc' }
        ],
        include: {
          quotes: {
            include: {
              milestones: true,
            },
          },
        },
      });

      if (filter?.collaboration_status) {
        return filterByCollaborationStatus(projectConnections, filter.collaboration_status as ProjectConnectionCollaborationStatus);
      }

      return projectConnections.map(({ quotes, ...pc }) => pc);
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
          ...(args.status && args.status.length > 0 ? {
            status: {
              in: args.status.filter(nonNullable),
            }
          } : {}),
          OR: [
            // by project request collaborator
            {
              project_connections: {
                some: {
                  customer_connections: {
                    some: {
                      customer_id: customer.id,
                    },
                  },
                },
              },
            },
            // by project request creator
            {
              customer_id: customer.id,
            },
          ],
        },
        orderBy: [
          // Sort by status to grouped matched experiments first
          { status: 'asc' },
          { updated_at: 'desc' },
        ]
      });

      const processed: ProjectRequest[] = data.map((d) => ({
        ...d,
        max_budget: d.max_budget?.toNumber() || 0,
      }))

      return processed;
    },
    projectRequest: async (_, args, context) => {
      const vendor = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id
        }
      });

      try {
        const projectRequest = await context.prisma.projectRequest.findFirst({
          where: {
            id: args.id!
          }
        });

        if (!projectRequest) {
          throw new PermissionDeniedError();
        }

        if (vendor) {
          // Check if vendor is in the project connection
          const projectConnection = await context.prisma.projectConnection.findFirst({
            where: {
              project_request_id: projectRequest.id,
              vendor_member_connections: {
                some: {
                  vendor_member_id: vendor.id
                }
              }
            }
          });
          if (!projectConnection) {
            throw new PermissionDeniedError();
          }
        } else {
          // Check if customer is the project request owner / collaborator
          const customer = await context.prisma.customer.findFirst({
            where: {
              user_id: context.req.user_id
            }
          });
          if (!customer) {
            throw new PermissionDeniedError();
          }

          if (projectRequest.customer_id !== customer.id) {
            const projectConnection = await context.prisma.projectConnection.findFirst({
              where: {
                project_request_id: projectRequest.id,
                customer_connections: {
                  some: {
                    customer_id: customer.id
                  }
                }
              }
            });
            if (!projectConnection) {
              throw new PermissionDeniedError();
            }
          }
        }

        return {
          ...projectRequest,
          max_budget: projectRequest.max_budget?.toNumber() || 0,
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2023') {
          throw new PermissionDeniedError();
        }
        throw error;
      }
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

        sendProjectRequestSubmissionEmail(user);
        createSendAdminNewProjectRequestEmailJob({ biotechName: user.customer.biotech.name });

        return {
          ...projectRequest,
          max_budget: projectRequest.max_budget?.toNumber() || 0,
        };
      });
    },
    withdrawProjectRequest: async (_, args, context) => {
      const user = await context.prisma.user.findFirstOrThrow({
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

      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: args.project_request_id
        },
      });
      if (projectRequest) {
        if (projectRequest.biotech_id !== user.customer?.biotech_id) {
          throw new PermissionDeniedError();
        }

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
