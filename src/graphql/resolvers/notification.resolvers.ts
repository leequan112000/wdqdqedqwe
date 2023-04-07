import { Notification, User } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../types/context";
import { QueryNotificationsArgs, Resolvers } from "../generated";

const resolvers: Resolvers<Context> = {
  Notification: {
    recipient: async (parent, _, context) => {
      if (!parent.recipient_id) {
        return {};
      }
      return await context.prisma.user.findFirst({
        where: {
          id: parent.recipient_id
        }
      })
    },
    sender: async (parent, _, context) => {
      if (!parent.sender_id) {
        return {};
      }
      return await context.prisma.user.findFirst({
        where: {
          id: parent.sender_id
        }
      })
    },
    url: async (parent, _, context) => {
      switch (parent.notification_type) {
        case 'CollaborationRequestNotification':
          return `/app/project-connection/${parent.params.project_connection_id}`;
        default:
          return '/app';
      }
    },
  },
  Query: {
    notifications: async (_, args, context) => {
      return await context.prisma.notification.findMany({
        where: {
          recipient_id: context.req.user_id,
          ...(!!args.unread_only ? { read_at: null } : {}),
        },
        orderBy: {
          updated_at: 'desc'
        }
      });
    },
  },
  Mutation: {
    // TODO: mark notification as read
  },
};

export default resolvers;
