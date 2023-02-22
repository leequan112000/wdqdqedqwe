import { Biotech, PrismaClient, Subscription } from "@prisma/client";
import { Context } from "apollo-server-core";

export default {
  Subscription: {
    biotech: async (parent: Subscription, _: void, context: Context<{prisma: PrismaClient}>): Promise<Biotech | null> => {
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id
        }
      });
    },
  },
  Query: {
    subscription: async (_: void, args: void, context: Context<{prisma: PrismaClient, req: any}>) => {
      return await context.prisma.$transaction(async (trx) => {
        const customer = await trx.customer.findFirstOrThrow({
          where: {
            user_id: context.req.user_id,
          },
        });

        return await trx.subscription.findFirst({
          where: {
            biotech_id: customer.biotech_id
          }
        })
      });
    },
    stripePricingTableId: async () => process.env.STRIPE_PRICING_TABLE_ID
  },
};
