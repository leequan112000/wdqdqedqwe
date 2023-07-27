import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Query: {
    suggestedLabSpecializations: async (_, __, context) => {
      return await context.prisma.labSpecialization.findMany({
        where: {
          NOT: [
            { priority: null }
          ]
        }
      })
    },
    searchLabSpecializations: async (_, args, context) => {
      const { search_content } = args;
      if (search_content) {
        return await context.prisma.labSpecialization.findMany({
          where: {
            OR: [
              { full_name: { contains: search_content, mode: 'insensitive' } },
              { short_name: { contains: search_content, mode: 'insensitive' } },
            ]
          }
        });
      }
      return [];
    },
  },
  Mutation: {
    createLabSpecialization: async (_, args, context) => {
      const { full_name } = args;

      const existingLabSpecialization = await context.prisma.labSpecialization.findFirst({
        where: {
          full_name: full_name,
        }
      });

      invariant(!existingLabSpecialization, "Lab specialization already exists");

      return await context.prisma.labSpecialization.create({
        data: {
          full_name: full_name,
        }
      })
    }
  }
};

export default resolvers;
