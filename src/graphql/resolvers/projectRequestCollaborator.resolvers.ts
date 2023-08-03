import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";
import { PublicError } from "../errors/PublicError";

const resolvers: Resolvers<Context> = {
  ProjectRequestCollaborator: {
    project_request: async (parent, _, context) => {
      invariant(parent?.project_request_id, 'Missing project request id');
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: parent.project_request_id,
        },
      });
      invariant(projectRequest, 'Project request not found');
      return {
        ...projectRequest,
        max_budget: projectRequest.max_budget?.toNumber() || 0,
      };
    },
    customer: async (parent, _, context) => {
      invariant(parent.customer_id, 'Missing customer id.');
      return await context.prisma.customer.findFirst({
        where: {
          id: parent.customer_id
        }
      })
    },
  },
  Mutation: {
    addProjectRequestCollaborator: async (_, args, context) => {
      const { project_request_id, customer_id } = args;
      return await context.prisma.$transaction(async (trx) => {
        const projectConnections = await trx.projectConnection.findMany({
          where: {
            project_request_id,
          }
        });

        if (projectConnections && projectConnections.length > 0) {
          // Add collaborator to all existing connections
          await Promise.all(
            projectConnections.map(async (pc) => {
              return await trx.customerConnection.create({
                data: {
                  project_connection_id: pc.id,
                  customer_id,
                },
              });
            })
          );
        }

        return await trx.projectRequestCollaborator.create({
          data: {
            project_request_id,
            customer_id,
          }
        });
      });
    },
    removeProjectRequestCollaborator: async (_, args, context) => {
      const { project_request_id, customer_id } = args;
      const existingProjectRequestCollaborator = await context.prisma.projectRequestCollaborator.findFirst({
        where: {
          project_request_id,
          customer_id,
        }
      });

      invariant(existingProjectRequestCollaborator, new PublicError('Collaborator not found.'));
      
      return await context.prisma.$transaction(async (trx) => {
        const projectConnections = await trx.projectConnection.findMany({
          where: {
            project_request_id,
          }
        });

        if (projectConnections && projectConnections.length > 0) {
          // Remove collaborator from all connections
          await Promise.all(
            projectConnections.map(async (pc) => {
              return await trx.customerConnection.deleteMany({
                where: {
                  project_connection_id: pc.id,
                  customer_id,
                },
              });
            })
          );
        }

        return await trx.projectRequestCollaborator.delete({
          where: {
            id: existingProjectRequestCollaborator.id
          }
        });
      });
    },
  }
};

export default resolvers;
