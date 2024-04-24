import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { CompanyCollaboratorRoleType, SubscriptionStatus } from "../../helper/constant";
import { Resolvers } from "../generated";
import UploadLimitTracker from "../../helper/uploadLimitTracker";
import invariant from "../../helper/invariant";
import { toDollar } from "../../helper/money";

const resolver: Resolvers<Context> = {
  Biotech: {
    has_active_subscription: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');

      const subscriptions = await context.prisma.subscription.findMany({
        where: {
          biotech_id: parent.id,
          status: SubscriptionStatus.ACTIVE
        }
      });

      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id
        }
      });

      const customerSubscriptions = await context.prisma.customerSubscription.findMany({
        where: {
          customer_id: customer?.id,
          status: SubscriptionStatus.ACTIVE
        }
      });

      return subscriptions.length > 0 || customerSubscriptions.length > 0;
    },
    stripe_customer_id: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');
      const subscription = await context.prisma.subscription.findFirst({
        where: {
          biotech_id: parent.id,
          status: SubscriptionStatus.ACTIVE
        }
      });

      return subscription?.stripe_customer_id ?? '';
    },
    customers: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');
      return await context.prisma.customer.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
    owner: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');
      const customer = await context.prisma.customer.findFirst({
        where: {
          biotech_id: parent.id,
          role: CompanyCollaboratorRoleType.OWNER,
          user: {
            OR: [
              { deactivated_at: null },
              {
                deactivated_at: {
                  gt: new Date(),
                },
              },
            ],
          }
        },
        include: {
          user: true,
        },
      });
      invariant(customer, 'Owner not found.');
      return customer.user;
    },
    admins: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');
      const customers = await context.prisma.customer.findMany({
        where: {
          biotech_id: parent.id,
          role: CompanyCollaboratorRoleType.ADMIN,
          user: {
            OR: [
              { deactivated_at: null },
              {
                deactivated_at: {
                  gt: new Date(),
                },
              },
            ],
          },
        },
        include: {
          user: true,
        },
      });
      return customers.map((c) => c.user);
    },
    chats: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');
      return await context.prisma.chat.findMany({
        where: {
          biotech_id: parent.id
        }
      });
    },
    upload_used: async (parent) => {
      invariant(parent.id, 'Missing biotech id.');
      const { id } = parent;
      const uploadLimitTracker = new UploadLimitTracker();

      await uploadLimitTracker.init(id)

      return uploadLimitTracker.stats().used;
    },
    biotech_invoices: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');
      return await context.prisma.biotechInvoice.findMany({
        where: {
          biotech_id: parent.id
        },
      });
    },
    purchase_orders: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');
      return await context.prisma.purchaseOrder.findMany({
        where: {
          biotech_id: parent.id
        },
      });
    },
    blanket_purchase_orders: async (parent, _, context) => {
      invariant(parent.id, 'Missing biotech id.');
      const blanketPurchaseOrders = await context.prisma.blanketPurchaseOrder.findMany({
        where: {
          biotech_id: parent.id
        },
      });

      return blanketPurchaseOrders.map((blanketPurchaseOrder) => {
        return {
          ...blanketPurchaseOrder,
          amount: toDollar(blanketPurchaseOrder.amount.toNumber()),
          balance_amount: toDollar(blanketPurchaseOrder.balance_amount.toNumber()),
        }
      });
    },
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
    updateBiotech: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const customer = await trx.customer.findFirst({
          where: {
            user_id: context.req.user_id,
          },
        });

        invariant(customer, new PublicError('Customer not found.'));

        return await context.prisma.biotech.update({
          where: {
            id: customer.biotech_id
          },
          data: {
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
