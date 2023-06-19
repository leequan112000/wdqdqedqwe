import { Context } from "../../types/context";
import { Resolvers } from "../../generated";

const resolvers: Resolvers<Context> = {
  Query: {
    suggestedCertificationTags: async (_, __, context) => {
      return await context.prisma.certificationTag.findMany({
        where: {
          NOT: [
            { priority: null }
          ]
        }
      })
    },
    searchCertificationTags: async (_, args, context) => {
      const { search_content } = args;
      if (search_content) {
        return await context.prisma.certificationTag.findMany({
          where: {
            OR: [
              { full_name: { contains: search_content } },
              { short_name: { contains: search_content } },
            ]
          }
        });
      }
      return [];
    },
  },
  Mutation: {
    createCertificationTag: async (_, args, context) => {
      const { full_name } = args;

      const existingCertificationTag = await context.prisma.certificationTag.findFirst({
        where: {
          full_name: full_name,
        }
      });

      if (existingCertificationTag) {
        throw new Error("Certification tag already exists");
      }

      return await context.prisma.certificationTag.create({
        data: {
          full_name: full_name,
        }
      })
    }
  }
};

export default resolvers;