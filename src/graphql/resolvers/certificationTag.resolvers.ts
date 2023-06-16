import { Request } from "express";
import { Context } from "../../types/context";

export default {
  Query: {
    suggestedCertificationTags: async (_: void, args: void, context: Context & { req: Request }) => {
      return await context.prisma.certificationTag.findMany({
        where: {
          NOT: [
            { priority: null }
          ]
        }
      })
    },
    searchCertificationTags: async (_: void, args: { search_content: string }, context: Context & { req: Request }) => {
      const { search_content } = args;

      return await context.prisma.certificationTag.findMany({
        where: {
          OR: [
            { full_name: { contains: search_content } },
            { short_name: { contains: search_content } },
          ]
        }
      })
    },
  },
  Mutation: {
    createCertificationTag: async (_: void, args: { full_name: string }, context: Context & { req: Request }) => {
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
