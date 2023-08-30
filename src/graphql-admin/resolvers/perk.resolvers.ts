import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";
import storeUpload from "../../helper/storeUpload";

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
  Mutation: {
    createPerk: async (_, args, context) => {
      const { image, ...perkData } = args;

      const data = await image;
      const { bucket, key } = await storeUpload(data, 'perks', true);
      const image_url = `https://${bucket}.s3.amazonaws.com/${key}`;

      return await context.prisma.perk.create({
        data: {
          image_url,
          ...perkData,
        }
      });
    },
    updatePerk: async (_, args, context) => {
      const { id, image, ...perkData } = args;

      const data = await image;
      const { bucket, key } = await storeUpload(data, 'perks', true);
      const image_url = `https://${bucket}.s3.amazonaws.com/${key}`;

      return await context.prisma.perk.update({
        where: {
          id,
        },
        data: {
          image_url,
          ...perkData,
        }
      });
    },
    deactivatePerk: async (_, args, context) => {
      const { id } = args;
      return await context.prisma.perk.update({
        where: {
          id,
        },
        data: {
          is_active: false,
        }
      });
    },
    activatePerk: async (_, args, context) => {
      const { id } = args;
      return await context.prisma.perk.update({
        where: {
          id,
        },
        data: {
          is_active: true,
        }
      });
    },
    deletePerk: async (_, args, context) => {
      const { id } = args;
      return await context.prisma.perk.delete({
        where: {
          id,
        }
      });
    },
  }
};

export default resolvers;
