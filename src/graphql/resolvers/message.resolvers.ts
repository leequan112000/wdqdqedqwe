import { Chat, Message, User } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../context";
import { PublicError } from "../errors/PublicError";
import { MutationSendMessageArgs } from "../generated";

export default {
  Message: {
    chat: async (parent: Message, _: void, context: Context): Promise<Chat | null> => {
      return await context.prisma.chat.findFirst({
        where: {
          id: parent.chat_id
        }
      })
    },
    user: async (parent: Message, _: void, context: Context): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      })
    },
  },
  Mutation: {
    sendMessage: async (_: void, args: MutationSendMessageArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          if (!context.req.user_id) {
            throw new PublicError('User not logged in.');
          }

          return await trx.message.create({
            data: {
              content: args.content,
              chat_id: args.chat_id,
              user_id: context.req.user_id
            }
          });
        });        
      } catch (error) {
        return error;
      }
    },
  }
};
