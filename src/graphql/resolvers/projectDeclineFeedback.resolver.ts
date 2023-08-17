import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createProjectDeclineFeedback: async (_, args, context) => {
      const existingProjectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: args.project_connection_id,
        },
      });

      invariant(existingProjectConnection, "Project connection not found");

      const projectDeclineFeedback = await context.prisma.projectDeclineFeedback.create({
        data: {
          project_connection_id: args.project_connection_id,
          reason: args.reason,
        },
      });

      await Promise.all(
        args.project_decline_tag_ids.map(async (project_decline_tag_id) => {
          try {
            await context.prisma.projectDeclineTagConnection.create({
              data: {
                project_decline_feedback_id: projectDeclineFeedback.id,
                project_decline_tag_id: project_decline_tag_id as string,
              },
            });
          } catch (error) {
            // no-op
          }
        })
      );

      return projectDeclineFeedback;
    }
  }
};

export default resolvers;
