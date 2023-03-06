import { Biotech, Chat, Message, ProjectConnection, VendorCompany } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../types/context";
import { MutationCreateChatArgs } from "../generated";

export default {
  Chat: {
    biotech: async (parent: Chat, _: void, context: Context): Promise<Biotech | null> => {
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id
        }
      })
    },
    vendor_company: async (parent: Chat, _: void, context: Context): Promise<VendorCompany | null> => {
      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      })
    },
    project_connection: async (parent: Chat, _: void, context: Context): Promise<ProjectConnection | null> => {
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id
        }
      })
    },
    messages: async (parent: Chat, _: void, context: Context): Promise<Message[] | null> => {
      return await context.prisma.message.findMany({
        where: {
          chat_id: parent.id
        }
      })
    },
  },
  Mutation: {
    createChat: async (_: void, args: MutationCreateChatArgs, context: Context & { req: Request }) => {
      try {
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
      } catch (error) {
        return error;
      }
    },
  }
};
