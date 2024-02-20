import { Resolvers } from "../generated";
import { Context } from '../../types/context';

const resolvers: Resolvers<Context> = {
  Mutation: {
    createCroDbSpecialty: async (_, args, context) => {
      const specialty = await context.prismaCRODb.specialty.create({
        data: {
          name: args.name,
          definition: args.definition || null,
        },
      });
      return specialty;
    },
    updateCroDbSpecialty: async (_, args, context) => {
      const { id } = args;

      const updated = await context.prismaCRODb.specialty.update({
        where: {
          id,
        },
        data: {
          name: args.name,
          definition: args.definition || null,
        },
      });

      return updated;
    }
  }
};

export default resolvers;
