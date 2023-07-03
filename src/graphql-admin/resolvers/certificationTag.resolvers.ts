import { InternalError } from "../../graphql/errors/InternalError";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createCertificationTag: async (parent, args, context) => {
      const { full_name, short_name, priority } = args;
      const existingCertificationTag = await context.prisma.certificationTag.findFirst({
        where: {
          OR: [
            { full_name: full_name },
            { short_name: short_name },
          ],
        },
      });

      if (existingCertificationTag) {
        throw new InternalError('Certification Tag already exist.');
      }

      return await context.prisma.certificationTag.create({
        data: {
          full_name: full_name,
          short_name: short_name,
          priority: priority,
        },
      });
    },
    updateCertificationTag: async (parent, args, context) => {
      const { id, full_name, short_name, priority } = args;
      const existingCertificationTag = await context.prisma.certificationTag.findFirst({
        where: {
          id: id,
        },
      });

      if (!existingCertificationTag) {
        throw new InternalError('Certification Tag not found.');
      }

      return await context.prisma.certificationTag.update({
        where: {
          id: id,
        },
        data: {
          full_name: full_name,
          short_name: short_name,
          priority: priority,
        },
      });
    },
    deleteCertificationTag: async (parent, args, context) => {
      const { id } = args;
      const existingCertificationTag = await context.prisma.certificationTag.findFirst({
        where: {
          id: id,
        },
      });

      if (!existingCertificationTag) {
        throw new InternalError('Certification Tag not found.');
      }

      await context.prisma.certificationTag.delete({
        where: {
          id: id,
        },
      });

      return true;
    },
  }
}

export default resolvers;
