import { Resolvers } from '../generated';
import { Context } from '../../types/context';
import invariant from '../../helper/invariant';
import { PublicError } from '../../graphql/errors/PublicError';

const resolvers: Resolvers<Context> = {
  Mutation: {
    createCroDbSubspecialty: async (_, args, context) => {
      const specialty = await context.prismaCRODb.specialty.findUnique({
        where: {
          id: args.specialty_id,
        },
      });
      invariant(specialty, new PublicError('Invalid parent specialty.'));

      const subspecialty = await context.prismaCRODb.subspecialty.create({
        data: {
          specialty_id: args.specialty_id,
          name: args.name,
          definition: args.definition || null,
        },
      });

      return subspecialty;
    },
    updateCroDbSubspecialty: async (_, args, context) => {
      const { id } = args;

      const updated = await context.prismaCRODb.subspecialty.update({
        where: {
          id,
        },
        data: {
          name: args.name,
          definition: args.definition || null,
        },
      });

      return updated;
    },
  },
};

export default resolvers;
