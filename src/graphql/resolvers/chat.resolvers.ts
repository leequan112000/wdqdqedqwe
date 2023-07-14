import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../../generated";

const resolvers: Resolvers<Context> = {
  Chat: {
    messages: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Chat id not found.')
      }
      return await context.prisma.message.findMany({
        where: {
          chat_id: parent.id,
        },
      });
    },
    messagesConnection: async (parent, args, context) => {
      if (!parent.id) {
        throw new InternalError('Chat id not found.')
      }

      const { first, after } = args;

      const messages = await context.prisma.message.findMany({
        take: first,
        skip: 1, // Skip the cursor
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
          skip: 1, // Skip the cursor
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
  }
};

export default resolvers;
