import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';
import { Prisma as PrismaCRODb } from '../../../prisma-cro/generated/client';
import croDbSubspecialtyService from '../../services/croDbSubspecialty/croDbSubspecialty.service';

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
      const filter: PrismaCRODb.SubspecialtyWhereInput = {};
      if (args.filter?.search) {
        filter.name = {
          contains: args.filter.search,
          mode: 'insensitive',
        };
      }

      return (
        await context.prismaCRODb.subspecialty.findMany({
          where: filter,
        })
      ).slice(0, 5);
    },
    croDbSubspecialtiesBySemanticSearch: async (_, args, context) => {
      const { search } = args;
      const subspecialties =
        (await croDbSubspecialtyService.searchSubspecialtiesSemantically({
          search_term: search,
        })) as { id: string; name: string }[];

      const subspecialty_ids = subspecialties.map((s) => s.id);

      return (
        await context.prismaCRODb.subspecialty.findMany({
          where: {
            id: {
              in: subspecialty_ids,
            },
          },
        })
      ).slice(0, 3);
    },
  },
};

export default resolvers;
