import { Customer, PrismaClient, User } from "@prisma/client";
import { Context } from "apollo-server-core";

export default {
  Customer: {
    user: async (parent: Customer, _: void, context: Context<{ prisma: PrismaClient }>): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      });
    },
  },
  Query: {
    customer: async (_: void, args: { id: string }, context: Context<{prisma: PrismaClient, res: any}>) => {
      return await context.prisma.customer.findFirst({
        where: {
          id: args.id
        }
      });
    }
  }
};
