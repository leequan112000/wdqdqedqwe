import { Biotech, Customer, PrismaClient } from "@prisma/client";
import { Context } from "apollo-server-core";
import { MutationUpdateBiotechArgs } from "../generated";

export default {
  Biotech: {
    customers: async (parent: Biotech, _: void, context: Context<{ prisma: PrismaClient }>): Promise<Customer[] | null> => {
      return await context.prisma.customer.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
  },
  Mutation: {
    updateBiotech: async (_: void, args: MutationUpdateBiotechArgs, context: Context<{prisma: PrismaClient, res: any}>) => {
      try {
        return await context.prisma.biotech.update({
          where: {
            id: args.id
          },
          data: {
            about: args.about,
            website: args.website,
            address: args.address,
            ...(args.has_setup_profile !== null ? { has_setup_profile: args.has_setup_profile } : {})
          }
        }); 
      } catch (error) {
        return error;
      }
    }
  }
};
