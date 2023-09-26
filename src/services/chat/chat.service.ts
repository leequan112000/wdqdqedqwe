import { MessageEdge } from "../../graphql/generated";
import { MessageType } from "../../helper/constant";
import { pubsub } from "../../helper/pubsub";
import { ServiceContext } from "../../types/context";

type CreateSystemMessageArgs = {
  chat_id: string;
  content: string;
}

const createSystemMessage = async (args: CreateSystemMessageArgs, ctx: ServiceContext) => {
  const { chat_id, content } = args;
  const message = await ctx.prisma.message.create({
    data: {
      chat_id,
      content,
      type: MessageType.SYSTEM,
    },
  });

  if (message) {
    const edge: MessageEdge = {
      node: message,
      cursor: message.id,
    }
    pubsub.publish('NEW_MESSAGE', { newMessage: edge, chat_id });
  }

  return message;
}

const createAdminMessage = async (args: CreateSystemMessageArgs, ctx: ServiceContext) => {
  const { chat_id, content } = args;
  const message = await ctx.prisma.message.create({
    data: {
      chat_id,
      content,
      type: MessageType.ADMIN,
    },
  });

  if (message) {
    const edge: MessageEdge = {
      node: message,
      cursor: message.id,
    }
    pubsub.publish('NEW_MESSAGE', { newMessage: edge, chat_id });
  }

  return message;
}

const chatService = {
  createSystemMessage,
  createAdminMessage,
};

export default chatService;
