import { Biotech, Chat, Customer } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { MutationOnboardBiotechArgs, MutationUpdateBiotechArgs } from "../../generated";
import { SubscriptionStatus } from "../../helper/constant";

export default {
  Biotech: {
    has_active_subscription: async (parent: Biotech, _: void, context: Context): Promise<Boolean | null> => {
      const subscriptions = await context.prisma.subscription.findMany({
        where: {
          biotech_id: parent.id,
          status: SubscriptionStatus.ACTIVE
        }
      });

      return subscriptions.length > 0 ? true : false;
    },
    stripe_customer_id: async (parent: Biotech, _: void, context: Context): Promise<String> => {
      try {
        const subscription = await context.prisma.subscription.findFirstOrThrow({
          where: {
            biotech_id: parent.id,
            status: SubscriptionStatus.ACTIVE
          }
        });

        return subscription?.stripe_customer_id ?? '';
      } catch (error) {
        return '';
      }
    },
    customers: async (parent: Biotech, _: void, context: Context): Promise<Customer[] | null> => {
      return await context.prisma.customer.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
    chats: async (parent: Biotech, _: void, context: Context): Promise<Chat[] | null> => {
      return await context.prisma.chat.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
  },
  Query: {
    biotech: async (_: void, __: void, context: Context & { req: Request }) => {
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
    },
  },
  Mutation: {
    onboardBiotech: async (_: void, args: MutationOnboardBiotechArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id,
            },
            include: {
              customer: {
                include: {
                  biotech: true
                }
              }
            }
          });

          if (!user.customer) {
            throw new PublicError('Customer not found.');
          }

          if (args.name && args.name !== user?.customer?.biotech?.name) {
            const existingBiotech = await trx.biotech.findFirst({
              where: {
                name: args.name
              }
            });

            if (existingBiotech) {
              throw new PublicError('Biotech name already exists.');
            }
          }

          return await context.prisma.biotech.update({
            where: {
              id: user.customer.biotech_id
            },
            data: {
              about: args.about,
              website: args.website,
              address: args.address,
              has_setup_profile: true,
              ...(args.name !== null ? { name: args.name } : {}),
            }
          })
        });
      } catch (error) {
        return error;
      }
    },
    updateBiotech: async (_: void, args: MutationUpdateBiotechArgs, context: Context & { req: Request }) => {
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
              ...(args.name !== null ? { name: args.name } : {}),
            }
          })
        });
      } catch (error) {
        return error;
      }
    },
  }
};
