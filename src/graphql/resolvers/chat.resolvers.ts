import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { pubsub } from "../../helper/pubsub";
import { withFilter } from "graphql-subscriptions";
import invariant from "../../helper/invariant";
import chatService from "../../services/chat/chat.service";
import { MessageType } from "../../helper/constant";

const resolvers: Resolvers<Context> = {
  Chat: {
    messages: async (parent, _, context) => {
      invariant(parent.id, 'Chat id not found.');
      return await context.prisma.message.findMany({
        where: {
          chat_id: parent.id,
        },
      });
    },
    messagesConnection: async (parent, args, context) => {
      invariant(parent.id, 'Chat id not found.');

      const { first, after } = args;

      const currectUserId = context.req.user_id;

      invariant(currectUserId, 'Current user not found.');

      const messages = await context.prisma.message.findMany({
        take: first,
        skip: after ? 1 : undefined, // Skip the cursor
        cursor: after
          ? { id: after }
          : undefined,
        orderBy: {
          created_at: 'desc'
        },
        where: {
          chat_id: parent.id,
        },
      });

      const edges = messages.map((m) => ({
        cursor: m.id,
        node: m,
      }));

      const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
      let hasNextPage = false;

      if (endCursor) {
        const nextMessages = await context.prisma.message.findMany({
          take: first,
          skip: endCursor ? 1 : undefined, // Skip the cursor
          cursor: endCursor
            ? { id: endCursor }
            : undefined,
          orderBy: {
            created_at: 'desc',
          },
          where: {
            chat_id: parent.id,
          },
        });

        hasNextPage = nextMessages.length > 0;
      }

      return {
        edges,
        pageInfo: {
          endCursor: endCursor || '',
          hasNextPage,
        },
      };
    },
  },
  Mutation: {
    createChat: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const customer = await trx.customer.findFirstOrThrow({
          where: {
            id: context.req.user_id
          }
        });

        const project_connection = await trx.projectConnection.findFirstOrThrow({
          where: {
            id: args.project_connection_id
          }
        });

        return await trx.chat.create({
          data: {
            vendor_company_id: project_connection.vendor_company_id,
            project_connection_id: args.project_connection_id,
            biotech_id: customer.biotech_id,
          }
        });
      });
    },
    startChat: async (_, args, context) => {
      const { project_connection_id } = args;

      const chat = await context.prisma.chat.findFirst({
        where: {
          project_connection_id,
        },
        include: {
          messages: {
            take: 1,
            where: {
              type: null
            }
          },
          vendor_company: true,
          biotech: true,
        },
      });

      if (chat && chat.messages.length === 0) {
        const biotechName = chat.biotech.name;
        const vendorCompanyName = chat.vendor_company.name;

        chatService.createAdminMessage({
          chat_id: chat.id,
          content: `Hello ${biotechName} & ${vendorCompanyName}!\nYou are now connected on Cromatic. Introduce yourselves and start collaborating!`,
        }, { prisma: context.prisma })

        return true;
      }

      return false;
    }
  },
  Subscription: {
    newMessage: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator<any>(['NEW_MESSAGE']),
        (payload, variables, context) => {
          return (
            payload.chat_id === variables.chat_id
            && payload.newMessage.node.user_id !== context.req.user_id
          );
        },
      ),
    },
  }
};

export default resolvers;
