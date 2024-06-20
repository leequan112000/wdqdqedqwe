import { Resolvers } from '../generated';
import { Context } from '../../types/context';
import { PublicError } from '../../graphql/errors/PublicError';
import invariant from '../../helper/invariant';

const resolvers: Resolvers<Context> = {
  Mutation: {
    createLabSpecialization: async (parent, args, context) => {
      const { full_name, short_name, priority } = args;
      const existingLabSpecialization =
        await context.prisma.labSpecialization.findFirst({
          where: {
            OR: [{ full_name: full_name }, { short_name: short_name }],
          },
        });

      invariant(
        !existingLabSpecialization,
        new PublicError('Lab Specialization already exist.'),
      );

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
      const existingLabSpecialization =
        await context.prisma.labSpecialization.findFirst({
          where: {
            id: id,
          },
        });

      invariant(
        existingLabSpecialization,
        new PublicError('Lab Specialization not found.'),
      );

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
      const existingLabSpecialization =
        await context.prisma.labSpecialization.findFirst({
          where: {
            id: id,
          },
        });

      invariant(
        existingLabSpecialization,
        new PublicError('Lab Specialization not found.'),
      );

      const existingLabSpecializationConnections =
        await context.prisma.labSpecializationConnection.findMany({
          where: {
            lab_specialization_id: id,
          },
        });

      invariant(
        existingLabSpecializationConnections.length === 0,
        new PublicError(
          'Lab Specialization is still connected to a Vendor Company, please remove the connection first.',
        ),
      );

      await context.prisma.labSpecialization.delete({
        where: {
          id: id,
        },
      });

      return true;
    },
  },
};

export default resolvers;
