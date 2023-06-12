import { toDollar } from "../../helper/money";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";

import { checkAllowCustomerOnlyPermission, checkAllowVendorOnlyPermission, checkMilestonePermission } from "../../helper/accessControl";
import { MilestonePaymentStatus, MilestoneStatus, QuoteStatus, SubscriptionStatus } from "../../helper/constant";
import { getStripeInstance } from "../../helper/stripe";

const resolvers: Resolvers<Context> = {
  Query: {
    milestone: async (_, args, context) => {
      const { id } = args;
      await checkMilestonePermission(context, id);
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id
        }
      });

      return milestone
        ? {
          ...milestone,
          amount: toDollar(milestone.amount.toNumber())
        }
        : null;
    },
    milestoneCheckoutUrl: async (_, args, context) => {
      const { id, success_url, cancel_url } = args
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id,
        },
        include: {
          quote: true,
        }
      });
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
        include: {
          biotech: {
            include: {
              subscriptions: {
                where: {
                  status: SubscriptionStatus.ACTIVE
                }
              }
            }
          }
        }
      });

      if (!milestone) {
        throw new PublicError('Milestone not found.');
      }

      if (!customer) {
        throw new PublicError('Customer not found.');
      }

      if (milestone.quote.status !== QuoteStatus.ACCEPTED) {
        throw new PublicError('The quotation must be accepted before proceeding with the payment.');
      }

      if (milestone.payment_status === MilestonePaymentStatus.PAID) {
        throw new PublicError('The milestone has already been paid.');
      }

      const stripe = await getStripeInstance();
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: milestone.title,
                description: milestone.description as string,
              },
              unit_amount: Number(milestone.amount),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer: customer.biotech.subscriptions[0].stripe_customer_id,
        client_reference_id: customer.id,
        metadata: {
          quote_id: milestone.quote_id,
          milestone_id: milestone.id,
        },
        payment_method_types: ['us_bank_account'],
        success_url,
        cancel_url,
      });

      return session.url;
    },
  },
  Mutation: {
    markMilestoneAsCompleted: async (_, args, context) => {
      const { id } = args
      await checkAllowVendorOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        data: {
          status: MilestoneStatus.PENDING_COMPLETION_APPROVAL,
        },
      });

      // TODO Send notification to biotech

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
    verifyMilestoneAsCompleted: async (_, args, context) => {
      const { id } = args
      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        data: {
          status: MilestoneStatus.COMPLETED,
        },
      });

      // TODO Send notification to vendor

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
  }
}

export default resolvers;
