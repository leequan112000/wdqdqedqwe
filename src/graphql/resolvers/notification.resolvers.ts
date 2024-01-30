import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { NotificationType } from "../../helper/constant";
import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../../helper/pubsub";
import invariant from "../../helper/invariant";
import notificationService from "../../services/notification/notification.service";

const resolvers: Resolvers<Context> = {
  Notification: {
    recipient: async (parent, _, context) => {
      invariant(parent.recipient_id, 'Recipient id not found.');
      return await context.prisma.user.findFirst({
        where: {
          id: parent.recipient_id
        }
      })
    },
    sender: async (parent, _, context) => {
      invariant(parent.sender_id, 'Sender id not found.');
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
        case NotificationType.QUOTE_EXPIRED_NOTIFICATION:
        case NotificationType.QUOTE_EXPIRING_NOTIFICATION:
        case NotificationType.QUOTE_ACCEPTED_NOTIFICATION:
        case NotificationType.QUOTE_DECLINED_NOTIFICATION:
        case NotificationType.QUOTE_SUBMITTED_NOTIFICATION:
          return `/app/project-connection/${parent.params.project_connection_id}/quote/${parent.params.quote_id}`;
        case NotificationType.NEW_INVOICE_NOTIFICATION:
        case NotificationType.NEW_BIOTECH_INVOICE_NOTIFICATION:
        case NotificationType.INVOICE_PAYMENT_NOTIFICATION:
        case NotificationType.INVOICE_PAYMENT_REMINDER_NOTIFICATION:
        case NotificationType.INVOICE_PAYMENT_OVERDUE_NOTIFICATION:
        case NotificationType.BIOTECH_INVOICE_PAYMENT_VERIFIED_NOTIFICATION:
        case NotificationType.BIOTECH_INVOICE_PAYMENT_REMINDER_NOTIFICATION:
        case NotificationType.BIOTECH_INVOICE_PAYMENT_OVERDUE_NOTIFICATION:
          return `/app/invoices/${parent.params.invoice_id}`;
        case NotificationType.NEW_MEETING_NOTIFICATION:
        case NotificationType.UPDATE_MEETING_NOTIFICATION:
        case NotificationType.REMOVE_MEETING_NOTIFICATION:
        case NotificationType.ACCEPTED_MEETING_INVITATION_NOTIFICATION:
        case NotificationType.DECLINED_MEETING_INVITATION_NOTIFICATION:
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
    notificationsConnection: async (parent, args, context) => {
      const { first, after } = args;
      const notifications = await context.prisma.notification.findMany({
        take: first,
        skip: after ? 1 : undefined,
        cursor: after
          ? { id: after }
          : undefined,
        orderBy: {
          created_at: 'desc',
        },
        where: {
          recipient_id: context.req.user_id,
        },
      });
      const edges = notifications.map((n) => ({
        cursor: n.id,
        node: n,
      }));

      const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
      let hasNextPage = false;

      if (endCursor) {
        const nextMessages = await context.prisma.notification.findMany({
          take: first,
          skip: endCursor ? 1 : undefined, // Skip the cursor
          cursor: endCursor
            ? { id: endCursor }
            : undefined,
          orderBy: {
            created_at: 'desc',
          },
          where: {
            recipient_id: context.req.user_id,
          },
        });

        hasNextPage = nextMessages.length > 0;
      }

      return {
        edges,
        pageInfo: {
          endCursor: endCursor || '',
          hasNextPage,
          hasPreviousPage: false,
        },
      };
    },
  },
  Mutation: {
    markNotificationAsRead: async (_, args, context) => {
      const { id } = args;

      invariant(context.req.user_id, 'Current user id not found.');
      const notification = await context.prisma.notification.findFirst({
        where: {
          id,
          recipient_id: context.req.user_id,
        }
      });

      invariant(notification, 'Notification not found.');

      /**
       * Update when read_at is null to keep the first recorded date.
       */
      if (notification.read_at === null) {
        const updatedNotification = await context.prisma.notification.update({
          where: {
            id
          },
          data: {
            read_at: new Date(),
          },
        });

        return updatedNotification;
      }

      return notification;
    },
    markNotificationsInProjectAsRead: async (_, args, context) => {
      const { project_connection_id } = args;

      invariant(context.req.user_id, 'Current user id not found.');
      const notifications = await context.prisma.notification.findMany({
        where: {
          recipient_id: context.req.user_id,
          read_at: null,
          params: {
            path: ['project_connection_id'],
            equals: project_connection_id,
          },
          notification_type: {
            in: [
              NotificationType.ACCEPT_REQUEST_NOTIFICATION,
              NotificationType.ADMIN_INVITE_NOTIFICATION,
              NotificationType.COLLABORATED_NOTIFICATION,
              NotificationType.FILE_UPLOAD_NOTIFICATION,
              NotificationType.FINAL_CONTRACT_UPLOAD_NOTIFICATION,
              NotificationType.MESSAGE_NOTIFICATION,
            ],
          },
        },
      });

      const updatedNotifications = await notificationService
        .markNotificationsAsRead({ notifications }, context);

      return updatedNotifications;
    },
    markQuoteNotificationsAsRead: async (_, args, context) => {
      const { quote_id } = args;

      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');

      const notifications = await context.prisma.notification.findMany({
        where: {
          recipient_id: currentUserId,
          read_at: null,
          params: {
            path: ['quote_id'],
            equals: quote_id,
          },
          notification_type: {
            in: [
              NotificationType.QUOTE_ACCEPTED_NOTIFICATION,
              NotificationType.QUOTE_DECLINED_NOTIFICATION,
              NotificationType.QUOTE_EXPIRED_NOTIFICATION,
              NotificationType.QUOTE_EXPIRING_NOTIFICATION,
              NotificationType.QUOTE_SUBMITTED_NOTIFICATION,
              NotificationType.QUOTE_NOTIFICATION,
            ],
          },
        },
      });

      const updatedNotifications = await notificationService
        .markNotificationsAsRead({ notifications }, context);

      return updatedNotifications;
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
