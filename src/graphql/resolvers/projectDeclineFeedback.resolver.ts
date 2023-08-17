import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createProjectDeclineFeedback: async (_, args, context) => {
      const { project_connection_id, reason } = args;

      const existingProjectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: project_connection_id,
        },
      });

      invariant(existingProjectConnection, "Project connection not found");

      const projectDeclineFeedback = await context.prisma.projectDeclineFeedback.create({
        data: {
          project_connection_id: project_connection_id,
          reason: reason,
        },
      });

      return projectDeclineFeedback;
    }
  }
};

export default resolvers;
