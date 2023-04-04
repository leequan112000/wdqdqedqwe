import { Notification, User } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../types/context";
import { QueryNotificationsArgs } from "../generated";

export default {
  Notification: {
    recipient: async (parent: Notification, _: void, context: Context): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.recipient_id
        }
      })
    },
    sender: async (parent: Notification, _: void, context: Context): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.sender_id
        }
      })
    },
  },
  Query: {
    notifications: async (_: void, args: QueryNotificationsArgs, context: Context & { req: Request }) => {
      return await context.prisma.notification.findMany({
        where: {
          recipient_id: context.req.user_id,
          ...(!!args.unread_only ? { read_at: null } : {}),
        },
        orderBy: {
          updated_at: 'desc'
        }
      });
    }
  },
};
