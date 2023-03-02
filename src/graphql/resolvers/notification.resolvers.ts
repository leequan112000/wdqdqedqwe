import { Notification, User } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../context";

export default {
  Notification: {
    user: async (parent: Notification, _: void, context: Context): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      })
    },
  },
  Query: {
    notifications: async (_: void, __: void, context: Context & { req: Request }) => {
      return await context.prisma.notification.findMany({
        where: {
          user_id: context.req.user_id
        },
        orderBy: {
          updated_at: 'desc'
        }
      });
    }
  },
};
