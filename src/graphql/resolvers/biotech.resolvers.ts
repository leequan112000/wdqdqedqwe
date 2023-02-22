import { Biotech, Customer, PrismaClient } from "@prisma/client";
import { Context } from "apollo-server-core";
import { PublicError } from "../errors/PublicError";
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
  Query: {
    biotech: async (_: void, args: void, context: Context<{prisma: PrismaClient, req: any}>) => {
      return await context.prisma.$transaction(async (trx) => {
        const customer = await trx.customer.findFirstOrThrow({
          where: {
            user_id: context.req.user_id,
          },
        });

        return await trx.biotech.findFirst({
          where: {
            id: customer.biotech_id
          }
        });
      });
    }
  },
  Mutation: {
    updateBiotech: async (_: void, args: MutationUpdateBiotechArgs, context: Context<{prisma: PrismaClient, req: any, res: any}>) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const customer = await trx.customer.findFirst({
            where: {
              user_id: context.req.user_id,
            },
          });

          if (!customer) {
            throw new PublicError('Customer not found.');
          }

          return await context.prisma.biotech.update({
            where: {
              id: customer.biotech_id
            },
            data: {
              about: args.about,
              website: args.website,
              address: args.address,
              ...(args.has_setup_profile !== null ? { has_setup_profile: args.has_setup_profile } : {})
            }
          })
        }); 
      } catch (error) {
        return error;
      }
    }
  }
};
