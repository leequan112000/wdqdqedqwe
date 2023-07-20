import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../../generated";
import { NotificationType } from "../../helper/constant";
import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../../helper/pubsub";

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
      const project_connection = await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.params.project_connection_id
        }
      });

      switch (parent.notification_type) {
        case NotificationType.ACCEPT_REQUEST_NOTIFICATION:
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case NotificationType.ADMIN_INVITE_NOTIFICATION:
          return `/app/project-connection/${parent.params.project_connection_id}/project-request`;
        case NotificationType.COLLABORATED_NOTIFICATION:
          if (project_connection?.vendor_status !== 'accepted') {
            return `/app/project-connection/${parent.params.project_connection_id}/project-request`;
          }
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case NotificationType.FILE_UPLOAD_NOTIFICATION:
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case NotificationType.FINAL_CONTRACT_UPLOAD_NOTIFICATION:
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case NotificationType.MESSAGE_NOTIFICATION:
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case NotificationType.QUOTE_NOTIFICATION:
        case NotificationType.MILESTONE_NOTIFICATION:
        case NotificationType.MILESTONE_PAYMENT_FAILED_NOTIFICATION:
          return `/app/project-connection/${parent.params.project_connection_id}/quote/${parent.params.quote_id}`;
        case NotificationType.QUOTE_EXPIRED_NOTIFICATION:
        case NotificationType.QUOTE_EXPIRING_NOTIFICATION:
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case NotificationType.NEW_INVOICE_NOTIFICATION:
        case NotificationType.INVOICE_PAYMENT_NOTIFICATION:
        case NotificationType.INVOICE_PAYMENT_REMINDER_NOTIFICATION:
        case NotificationType.INVOICE_PAYMENT_OVERDUE_NOTIFICATION:
          return `/app/invoices/${parent.params.invoice_id}`;
        case NotificationType.NEW_MEETING_NOTIFICATION:
        case NotificationType.UPDATE_MEETING_NOTIFICATION:
        case NotificationType.REMOVE_MEETING_NOTIFICATION:
          return `/app/meeting-events`;
        default:
          return `/app`;
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
          created_at: 'desc'
        }
      });
    },
  },
  Mutation: {
    markNotificationAsRead: async (_, args, context) => {
      const { id } = args;

      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }
      const notification = await context.prisma.notification.findFirst({
        where: {
          id,
          read_at: null,
          recipient_id: context.req.user_id,
        }
      });

      if (notification) {
        await context.prisma.notification.update({
          where: {
            id
          },
          data: {
            read_at: new Date(),
          },
        });
      }

      return notification;
    },
    markNotificationsInProjectAsRead: async (_, args, context) => {
      const { project_connection_id } = args;

      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }

      const notifications = await context.prisma.notification.findMany({
        where: {
          recipient_id: context.req.user_id,
          read_at: null,
          params: {
            path: ['project_connection_id'],
            equals: project_connection_id,
          },
        },
      });

      await Promise.all(
        notifications.map(async (notification) => {
          await context.prisma.notification.update({
            where: {
              id: notification.id,
            },
            data: {
              read_at: new Date(),
            },
          });
        })
      );

      return notifications;
    },
  },
  Subscription: {
    newNotification: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator(['NEW_NOTIFICATION']),
        (payload, _, context: Context) => {
          return payload.newNotification.recipient_id === context.req.user_id;
        },
      ),
    },
  },
};

export default resolvers;
