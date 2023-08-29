import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";
import moment from "moment";

const resolvers: Resolvers<Context> = {
  PerkCategory: {
    perks: async (parent, _, context) => {
      invariant(parent.id, 'Perk category id not found.');
      const today = moment();

      return await context.prisma.perk.findMany({
        where: {
          perk_category_id: parent.id,
          is_active: true,
          OR: [
            { expired_at: null },
            {
              expired_at: {
                gt: today.startOf('d').toDate(),
              },
            }
          ]
        },
      });
    },
  },
  Query: {
    perkCategories: async (_, __, context) => {
      return await context.prisma.perkCategory.findMany();
    },
  }
};

export default resolvers;
