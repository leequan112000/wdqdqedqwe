import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';

const resolvers: Resolvers<Context> = {
  Perk: {
    perk_category: async (parent, _, context) => {
      invariant(parent.perk_category_id, 'Perk category id not found.');
      return await context.prisma.perkCategory.findFirst({
        where: {
          id: parent.perk_category_id,
        },
      });
    },
  },
};

export default resolvers;
