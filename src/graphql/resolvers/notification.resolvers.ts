import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../../generated";

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
        case 'AcceptRequestNotification':
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case 'AdminInviteNotification':
          return `/app/project-connection/${parent.params.project_connection_id}/project-request`;
        case 'CollaboratedNotification':
          if (project_connection?.vendor_status !== 'accepted') {
            return `/app/project-connection/${parent.params.project_connection_id}/project-request`;
          }
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case 'FileUploadNotification':
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case 'FinalContractUploadNotification':
          return `/app/project-connection/${parent.params.project_connection_id}`;
        case 'MessageNotification':
          return `/app/project-connection/${parent.params.project_connection_id}`;
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
          updated_at: 'desc'
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
};

export default resolvers;
