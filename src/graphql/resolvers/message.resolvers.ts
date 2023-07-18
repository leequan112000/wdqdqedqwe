import { pubsub } from "../../helper/pubsub";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { PublicError } from "../errors/PublicError";
import { Resolvers, MessageEdge } from "../../generated";
import { createSendUserNewMessageNoticeJob } from "../../queues/email.queues";

const resolvers: Resolvers<Context> = {
  Message: {
    user: async (parent, _, context) => {
      if (!parent.user_id) {
        throw new InternalError('User id not found')
      }
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      })
    },
  },
  Mutation: {
    sendMessage: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        if (!context.req.user_id) {
          throw new PublicError('User not logged in.');
        }

        const projectConnection = await context.prisma.projectConnection.findFirst({
          where: {
            id: args.project_connection_id,
          }
        });
        if (!projectConnection) {
          throw new InternalError('Project connection not found');
        }

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
          if (!projectConnection) {
            throw new InternalError('Project connection not found.')
          }
          chat = await trx.chat.create({
            data: {
              biotech_id: projectConnection.project_request.biotech_id,
              vendor_company_id: projectConnection.vendor_company_id,
              project_connection_id: projectConnection.id,
            },
          })
        }

        const newMessage = await trx.message.create({
          data: {
            content: args.content,
            chat_id: chat.id,
            user_id: context.req.user_id
          }
        });

        const edge: MessageEdge = {
          cursor: newMessage.id,
          node: newMessage,
        }

        pubsub.publish('NEW_MESSAGE', { newMessage: edge, chat_id: chat.id });

        createSendUserNewMessageNoticeJob({
          projectConnectionId: chat.project_connection_id,
          senderUserId: context.req.user_id,
        });

        return newMessage;
      });
    },
  },
};

export default resolvers;
