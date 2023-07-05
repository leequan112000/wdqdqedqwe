import { InternalError } from "../../graphql/errors/InternalError";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { PublicError } from "../../graphql/errors/PublicError";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createLabSpecialization: async (parent, args, context) => {
      const { full_name, short_name, priority } = args;
      const existingLabSpecialization = await context.prisma.labSpecialization.findFirst({
        where: {
          OR: [
            { full_name: full_name },
            { short_name: short_name },
          ],
        },
      });

      if (existingLabSpecialization) {
        throw new InternalError('Lab Specialization already exist.');
      }

      return await context.prisma.labSpecialization.create({
        data: {
          full_name: full_name,
          short_name: short_name,
          priority: priority,
        },
      });
    },
    updateLabSpecialization: async (parent, args, context) => {
      const { id, full_name, short_name, priority } = args;
      const existingLabSpecialization = await context.prisma.labSpecialization.findFirst({
        where: {
          id: id,
        },
      });

      if (!existingLabSpecialization) {
        throw new InternalError('Lab Specialization not found.');
      }

      return await context.prisma.labSpecialization.update({
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
    deleteLabSpecialization: async (parent, args, context) => {
      const { id } = args;
      const existingLabSpecialization = await context.prisma.labSpecialization.findFirst({
        where: {
          id: id,
        },
      });

      if (!existingLabSpecialization) {
        throw new InternalError('Lab Specialization not found.');
      }

      await context.prisma.labSpecialization.delete({
        where: {
          id: id,
        },
      });

      return true;
    }
  }
}

export default resolvers;
