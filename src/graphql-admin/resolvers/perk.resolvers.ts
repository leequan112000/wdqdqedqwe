import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";
import storeUpload, { getFileExtFromBuffer } from "../../helper/storeUpload";
import { deleteObject } from "../../helper/awsS3";

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
      const buffer = Buffer.from(data, 'base64');
      const ext = await getFileExtFromBuffer(buffer);
      const { bucket, key } = await storeUpload({
        filename: `perks.${ext}`,
        createReadStream: () => {
          return buffer;
        }
      }, 'perks', true);

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
      const currentPerk = await context.prisma.perk.findFirst({
        where: { id }
      });

      invariant(currentPerk, 'Perk not found.');

      let image_url = currentPerk?.image_url;
      if (image) {
        const data = await image;
        const buffer = Buffer.from(data, 'base64');
        const ext = await getFileExtFromBuffer(buffer);
        const { bucket, key } = await storeUpload({
          filename: `perks.${ext}`,
          createReadStream: () => {
            return buffer;
          }
        }, 'perks', true);

        // Delete outdated image
        await deleteObject(new URL(image_url).pathname.slice(1), true);

        image_url = `https://${bucket}.s3.amazonaws.com/${key}`;
      }

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
      const perk = await context.prisma.perk.findFirst({
        where: { id }
      });
      invariant(perk, 'Perk not found.');
      
      let image_url = perk.image_url;
      const deletedPerk = await context.prisma.perk.delete({
        where: {
          id,
        }
      });
      // Delete perk image from S3
      await deleteObject(new URL(image_url).pathname.slice(1), true);
      return deletedPerk;
    },
  }
};

export default resolvers;
