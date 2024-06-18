import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';

const resolvers: Resolvers<Context> = {
  Mutation: {
    createProjectDeclineFeedback: async (_, args, context) => {
      const existingProjectConnection =
        await context.prisma.projectConnection.findFirst({
          where: {
            id: args.project_connection_id,
          },
        });

      invariant(existingProjectConnection, 'Project connection not found');

      return await context.prisma.$transaction(async (trx) => {
        const projectDeclineFeedback = await trx.projectDeclineFeedback.create({
          data: {
            project_connection_id: args.project_connection_id,
            reason: args.reason,
          },
        });

        await trx.projectDeclineTagConnection.createMany({
          data: args.project_decline_tag_ids.map((project_decline_tag_id) => ({
            project_decline_feedback_id: projectDeclineFeedback.id,
            project_decline_tag_id: project_decline_tag_id as string,
          })),
        });
        return projectDeclineFeedback;
      });
    },
  },
};

export default resolvers;
