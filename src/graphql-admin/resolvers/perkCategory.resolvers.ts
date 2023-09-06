import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { PublicError } from "../../graphql/errors/PublicError";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  PerkCategory: {
    perks: async (parent, _, context) => {
      invariant(parent.id, 'Perk category id not found.');
      return await context.prisma.perk.findMany({
        where: {
          perk_category_id: parent.id,
        },
        orderBy: {
          title: 'asc',
        },
      });
    },
  },
  Mutation: {
    createPerkCategory: async (_, args, context) => {
      const { name, description } = args;
      return await context.prisma.perkCategory.create({
        data: {
          name,
          description,
        }
      });
    },
    updatePerkCategory: async (_, args, context) => {
      const { id, name, description } = args;
      return await context.prisma.perkCategory.update({
        where: {
          id,
        },
        data: {
          name,
          description,
        }
      });
    },
    deletePerkCategory: async (_, args, context) => {
      const { id } = args;
      const perkCategory = await context.prisma.perkCategory.findFirst({
        where: {
          id,
        },
      });

      invariant(perkCategory, new PublicError('Perk category not found.'));

      const perks = await context.prisma.perk.findMany({
        where: {
          perk_category_id: id,
        },
      });

      invariant(perks.length === 0, new PublicError('This category contains perks. Please remove the existing perks from this category before attempting to delete it.'));      

      await context.prisma.perkCategory.delete({
        where: {
          id,
        }
      });

      return true;
    }
  }
}

export default resolvers;
