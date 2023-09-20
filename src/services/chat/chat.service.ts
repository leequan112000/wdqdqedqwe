import { MessageEdge } from "../../graphql/generated";
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
};

export default chatService;
