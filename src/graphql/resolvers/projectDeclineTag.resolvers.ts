import { Context } from "../../types/context";
import { Resolvers } from "../../generated";

const resolvers: Resolvers<Context> = {
  Query: {
    projectDeclineTags: async (_, args, context) => {
      const projectDeclineTags = await context.prisma.projectDeclineTag.findMany();

      return projectDeclineTags;
    },
  },
};

export default resolvers;
