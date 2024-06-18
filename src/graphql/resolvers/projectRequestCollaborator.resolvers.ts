import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';
import { PublicError } from '../errors/PublicError';

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
          id: parent.customer_id,
        },
      });
    },
  },
  Mutation: {
    updateProjectRequestCollaborators: async (_, args, context) => {
      const { project_request_id, customer_ids } = args;
      return await context.prisma.$transaction(async (trx) => {
        const existingCollaborators =
          await trx.projectRequestCollaborator.findMany({
            where: {
              project_request_id,
            },
          });

        // Find removed collaborators
        const removedCollaborators = existingCollaborators.filter(
          (collaborator) => !customer_ids.includes(collaborator.customer_id),
        );

        // Find newly added collaborators
        const newCollaboratorCustomerIds = customer_ids.filter(
          (customer_id) =>
            !existingCollaborators
              .map((c) => c.customer_id)
              .includes(customer_id!),
        );

        if (removedCollaborators.length > 0) {
          await trx.projectRequestCollaborator.deleteMany({
            where: {
              project_request_id,
              customer_id: {
                in: removedCollaborators.map(
                  (collaborator) => collaborator.customer_id,
                ),
              },
            },
          });
        }

        if (newCollaboratorCustomerIds.length > 0) {
          await trx.projectRequestCollaborator.createMany({
            data: newCollaboratorCustomerIds.map((customer_id) => {
              return {
                customer_id: customer_id as string,
                project_request_id,
              };
            }),
          });
        }

        const projectConnections = await trx.projectConnection.findMany({
          where: {
            project_request_id,
          },
        });

        if (projectConnections && projectConnections.length > 0) {
          // Add collaborator to all existing connections
          await Promise.all(
            projectConnections.map(async (pc) => {
              await trx.customerConnection.deleteMany({
                where: {
                  project_connection_id: pc.id,
                  customer_id: {
                    in: removedCollaborators.map(
                      (collaborator) => collaborator.customer_id,
                    ),
                  },
                },
              });

              await Promise.all(
                newCollaboratorCustomerIds.map(async (cust_id) => {
                  await trx.customerConnection.upsert({
                    create: {
                      customer_id: cust_id!,
                      project_connection_id: pc.id,
                    },
                    update: {
                      customer_id: cust_id!,
                      project_connection_id: pc.id,
                    },
                    where: {
                      project_connection_id_customer_id: {
                        customer_id: cust_id!,
                        project_connection_id: pc.id,
                      },
                    },
                  });
                }),
              );
            }),
          );
        }

        return await trx.projectRequestCollaborator.findMany({
          where: {
            project_request_id,
          },
        });
      });
    },
    removeProjectRequestCollaborator: async (_, args, context) => {
      const { project_request_id, customer_id } = args;
      const existingProjectRequestCollaborator =
        await context.prisma.projectRequestCollaborator.findFirst({
          where: {
            project_request_id,
            customer_id,
          },
        });

      invariant(
        existingProjectRequestCollaborator,
        new PublicError('Collaborator not found.'),
      );

      return await context.prisma.$transaction(async (trx) => {
        const projectConnections = await trx.projectConnection.findMany({
          where: {
            project_request_id,
          },
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
            }),
          );
        }

        return await trx.projectRequestCollaborator.delete({
          where: {
            id: existingProjectRequestCollaborator.id,
          },
        });
      });
    },
  },
};

export default resolvers;
