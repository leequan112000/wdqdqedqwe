import { Resolvers, MessageEdge } from '../generated';
import { Context } from '../../types/context';
import { PublicError } from '../errors/PublicError';
import invariant from '../../helper/invariant';
import { pubsub } from '../../helper/pubsub';
import { UserStatus, UserType } from '../../helper/constant';
import { createChatQueueJob } from '../../queues/chat.queues';
const resolvers: Resolvers<Context> = {
  Message: {
    user: async (parent, _, context) => {
      const userId = parent.user_id;
      if (userId) {
        const user = await context.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (user) return user;
        return null;
      }
      return {
        id: 'cromatic-admin',
        first_name: 'Cromatic',
        last_name: 'Admin',
        is_active: true,
        user_type: UserType.CROMATIC_ADMIN,
        company_name: 'Cromatic',
        status: UserStatus.JOINED,
      };
    },
  },
  Mutation: {
    sendMessage: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        invariant(context.req.user_id, new PublicError('User not logged in.'));

        const projectConnection =
          await context.prisma.projectConnection.findFirst({
            where: {
              id: args.project_connection_id,
            },
            include: {
              project_request: true,
            },
          });
        invariant(projectConnection, 'Project connection not found.');

        let chat = await trx.chat.findFirst({
          where: {
            project_connection_id: args.project_connection_id,
          },
        });

        // Create chat if not exist.
        if (!chat) {
          const projectConnection = await trx.projectConnection.findFirst({
            where: {
              id: args.project_connection_id,
            },
            include: {
              vendor_company: true,
              project_request: {
                select: {
                  biotech_id: true,
                },
              },
            },
          });
          invariant(projectConnection, 'Project connection not found.');
          chat = await trx.chat.create({
            data: {
              biotech_id: projectConnection.project_request.biotech_id,
              vendor_company_id: projectConnection.vendor_company_id,
              project_connection_id: projectConnection.id,
            },
          });
        }

        const newMessage = await trx.message.create({
          data: {
            content: args.content,
            chat_id: chat.id,
            user_id: context.req.user_id,
          },
        });

        const edge: MessageEdge = {
          cursor: newMessage.id,
          node: newMessage,
        };

        pubsub.publish('NEW_MESSAGE', { newMessage: edge, chat_id: chat.id });
        createChatQueueJob({
          project_connection_id: args.project_connection_id,
          sender_id: context.req.user_id,
          message: args.content,
        });
        return newMessage;
      });
    },
  },
};

export default resolvers;
