import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../../generated";
import { pubsub } from "../../helper/pubsub";
import { withFilter } from "graphql-subscriptions";
import { SubscriptionStatus } from "../../helper/constant";

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

      const currectUserId = context.req.user_id;

      if (!currectUserId) {
        throw new InternalError('Current user not found')
      }

      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: currectUserId,
        },
        orderBy: {
          updated_at: 'desc',
        },
      });

      // This only applies to biotech.
      // Because only biotech has subscriptions.
      let maxMessageDate: Date | undefined = undefined;
      if (customer) {
        const subscriptions = await context.prisma.subscription.findMany({
          where: {
            biotech_id: customer.biotech_id,
          },
        });
        const noActiveSubscription = subscriptions?.filter((s) => s.status === SubscriptionStatus.ACTIVE)?.length === 0;
        if (noActiveSubscription && subscriptions?.[0]?.ended_at) {
          maxMessageDate = subscriptions[0].ended_at;
        }
      }


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
          created_at: maxMessageDate
            ? { lte: maxMessageDate }
            : {},
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
            created_at: maxMessageDate
              ? { lte: maxMessageDate }
              : {},
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
