import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { SubscriptionStatus } from "../../helper/constant";
import { Resolvers } from "../../generated";
import { InternalError } from "../errors/InternalError";
import UploadLimitTracker from "../../helper/uploadLimitTracker";

const resolver: Resolvers<Context> = {
  Biotech: {
    has_active_subscription: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Id not found');
      }

      const subscriptions = await context.prisma.subscription.findMany({
        where: {
          biotech_id: parent.id,
          status: SubscriptionStatus.ACTIVE
        }
      });

      return subscriptions.length > 0 ? true : false;
    },
    stripe_customer_id: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Id not found');
      }
      const subscription = await context.prisma.subscription.findFirst({
        where: {
          biotech_id: parent.id,
          status: SubscriptionStatus.ACTIVE
        }
      });

      return subscription?.stripe_customer_id ?? '';
    },
    customers: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Id not found');
      }
      return await context.prisma.customer.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
    chats: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Id not found');
      }
      return await context.prisma.chat.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
    upload_used: async (parent) => {
      if (!parent.id) {
        throw new InternalError('Id not found');
      }
      const { id } = parent;
      const uploadLimitTracker = new UploadLimitTracker();

      await uploadLimitTracker.init(id)

      return uploadLimitTracker.stats().used;
    }
  },
  Query: {
    biotech: async (_, __, context) => {
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
  },
  Mutation: {
    onboardBiotech: async (_, args, context) => {
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

        if (args.name && args.name !== user?.customer?.biotech?.name) {
          const existingBiotech = await trx.biotech.findFirst({
            where: {
              name: args.name
            }
          });

          if (existingBiotech) {
            throw new PublicError('Biotech name already exists.');
          }
        }

        return await context.prisma.biotech.update({
          where: {
            id: user.customer.biotech_id
          },
          data: {
            legal_name: args.legal_name,
            about: args.about,
            website: args.website,
            address: args.address,
            address1: args.address1,
            address2: args.address2,
            city: args.city,
            state: args.state,
            country: args.country,
            zipcode: args.zipcode,
            founded_year: args.founded_year,
            team_size: args.team_size,
            linkedin_url: args.linkedin_url,
            twitter_url: args.twitter_url,
            facebook_url: args.facebook_url,
            biotech_extra_info: args.biotech_extra_info,
            has_setup_profile: true,
            ...(args.name !== null ? { name: args.name } : {}),
          }
        })
      });
    },
    updateBiotech: async (_, args, context) => {
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
            legal_name: args.legal_name,
            about: args.about,
            website: args.website,
            address: args.address,
            address1: args.address1,
            address2: args.address2,
            city: args.city,
            state: args.state,
            country: args.country,
            zipcode: args.zipcode,
            founded_year: args.founded_year,
            team_size: args.team_size,
            linkedin_url: args.linkedin_url,
            twitter_url: args.twitter_url,
            facebook_url: args.facebook_url,
            biotech_extra_info: args.biotech_extra_info,
            ...(args.name !== null ? { name: args.name } : {}),
          }
        })
      });
    },
  }
}

export default resolver;
