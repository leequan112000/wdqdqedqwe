import { Biotech, Chat, Customer } from "@prisma/client";
import { Request } from "express";
import { createBiotechCda, createBiotechViewCdaSession } from "../../helper/pandadoc";
import { Context } from "../../context";
import { PublicError } from "../errors/PublicError";
import { MutationOnboardBiotechArgs, MutationUpdateBiotechArgs } from "../generated";
import { SubscriptionStatus } from "../../helper/constant";

export default {
  Biotech: {
    has_active_subscription: async (parent: Biotech, _: void, context: Context): Promise<Boolean | null> => {
      const subscriptions = await context.prisma.subscription.findMany({
        where: {
          biotech_id: parent.id,
          status: SubscriptionStatus.ACTIVE
        }
      });
      
      return subscriptions.length > 0 ? true : false;
    },
    customers: async (parent: Biotech, _: void, context: Context): Promise<Customer[] | null> => {
      return await context.prisma.customer.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
    chats: async (parent: Biotech, _: void, context: Context): Promise<Chat[] | null> => {
      return await context.prisma.chat.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
  },
  Query: {
    biotech: async (_: void, __: void, context: Context & { req: Request }) => {
      return await context.prisma.$transaction(async (trx) => {
        const customer = await trx.customer.findFirstOrThrow({
          where: {
            user_id: context.req.user_id,
          },
        });

        return await trx.biotech.findFirst({
          where: {
            id: customer.biotech_id
          }
        });
      });
    },
    cdaUrl: async (_: void, __: void, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id,
            },
            include: {
              customer: {
                include: {
                  biotech: true
                }
              }
            }
          });

          const file_id = user.customer?.biotech.cda_pandadoc_file_id;
          if (file_id) {
            const viewDocSessionResponse = await createBiotechViewCdaSession(user.email, file_id);
            return `https://app.pandadoc.com/s/${viewDocSessionResponse.id}`;
          }

          return null;
        });
      } catch (error) {
        return null
      }
    }
  },
  Mutation: {
    onboardBiotech: async (_: void, args: MutationOnboardBiotechArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id,
            },
            include: {
              customer: {
                include: {
                  biotech: true
                }
              }
            }
          });

          if (!user.customer) {
            throw new PublicError('Customer not found.');
          }
          
          let cda_pandadoc_file_id = user?.customer?.biotech?.cda_pandadoc_file_id;

          if (cda_pandadoc_file_id === null) {
            const docResponse = await createBiotechCda(user);
            cda_pandadoc_file_id = docResponse.id as string;
          }

          return await context.prisma.biotech.update({
            where: {
              id: user.customer.biotech_id
            },
            data: {
              about: args.about,
              website: args.website,
              address: args.address,
              cda_pandadoc_file_id,
              has_setup_profile: true,
              ...(args.name !== null ? { name: args.name } : {}),
            }
          })
        }); 
      } catch (error) {
        return error;
      }
    },
    updateBiotech: async (_: void, args: MutationUpdateBiotechArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const customer = await trx.customer.findFirst({
            where: {
              user_id: context.req.user_id,
            },
          });

          if (!customer) {
            throw new PublicError('Customer not found.');
          }

          return await context.prisma.biotech.update({
            where: {
              id: customer.biotech_id
            },
            data: {
              about: args.about,
              website: args.website,
              address: args.address,
              ...(args.name !== null ? { name: args.name } : {}),
            }
          })
        }); 
      } catch (error) {
        return error;
      }
    },
  }
};
