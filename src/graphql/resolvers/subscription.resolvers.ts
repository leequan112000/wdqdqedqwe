import { Biotech, Subscription } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../context";

export default {
  Subscription: {
    biotech: async (parent: Subscription, _: void, context: Context): Promise<Biotech | null> => {
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id
        }
      });
    },
  },
  Query: {
    subscription: async (_: void, args: void, context: Context & { req: Request }) => {
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
