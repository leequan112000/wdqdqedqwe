import fuzzysort from 'fuzzysort';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';

const resolvers: Resolvers<Context> = {
  CroDbSubspecialty: {
    specialty: async (parent, _, context) => {
      invariant(parent.specialty_id, 'Missing specialty id.');
      return await context.prismaCRODb.specialty.findUnique({
        where: {
          id: parent.specialty_id,
        },
      });
    },
  },
  Query: {
    croDbSubspecialties: async (_, args, context) => {
      const allSubspecialties =
        await context.prismaCRODb.subspecialty.findMany();

      let filteredSubspecialties = allSubspecialties;

      if (args.filter?.search) {
        const results = fuzzysort.go(args.filter.search, allSubspecialties, {
          key: 'name',
        });
        filteredSubspecialties = results.map((result) => result.obj);
      }

      return filteredSubspecialties.slice(0, 5);
    },
  },
};

export default resolvers;
