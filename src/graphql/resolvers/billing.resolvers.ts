import moment from "moment";
import currency from "currency.js";
import Stripe from "stripe";
import { BiotechAccountType } from "../../helper/constant";
import invariant from "../../helper/invariant";
import { getStripeInstance } from "../../helper/stripe";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";

const getPlanName = (accType: string | null) => {
  switch (accType) {
    case BiotechAccountType.PROJECT_MANAGEMENT_PLAN:
      return "Project Management Plan";
    case BiotechAccountType.SOURCING_PLAN:
      return "Sourcing Pro Plan";
    case BiotechAccountType.WHITE_GLOVE_PLAN:
      return "White Glove Plan";
    case BiotechAccountType.STARDARD:
    case null:
    default:
      return "Standard Plan";
  }
};

const getBillCycleName = (interval: string) => {
  switch (interval) {
    case "month":
      return "Monthly";
    case "year":
      return "Yearly";
    default:
      return interval;
  }
};

const getPaymentMethodName = (paymentMethod: Stripe.PaymentMethod.Type) => {
  switch (paymentMethod) {
    case 'card':
      return "Credit Card";
    default:
      return paymentMethod;
  }
}

const isStripeCus = (cus: Stripe.Customer | Stripe.DeletedCustomer): cus is Stripe.Customer => {
  return cus.deleted !== true;
}

const resolvers: Resolvers<Context> = {
  Query: {
    billingInfo: async (_, __, context) => {
      const user = await context.prisma.user.findUnique({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true,
                  customers: {
                    where: {
                      user: {
                        OR: [
                          { deactivated_at: null },
                          { deactivated_at: { gt: new Date() } },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      invariant(
        user?.customer?.biotech.subscriptions,
        "No subscription data found."
      );

      const stripe = await getStripeInstance();
      const stripeSub = await stripe.subscriptions.retrieve(
        user.customer.biotech.subscriptions[0].stripe_subscription_id
      );

      const activeUserCounts = user.customer.biotech.customers.length;
      const subItem = stripeSub.items.data[0];

      const stripeCus = await stripe.customers.retrieve(
        user.customer.biotech.subscriptions[0].stripe_customer_id
      );

      const defaultPaymentMethodId = isStripeCus(stripeCus)
        ? stripeCus.invoice_settings.default_payment_method
        : null;

      let paymentMethod: string | null = null;
      if (defaultPaymentMethodId) {
        const stripePaymentMethod = await stripe.paymentMethods.retrieve(
          defaultPaymentMethodId as string
        );
        paymentMethod = getPaymentMethodName(stripePaymentMethod.type);
      }

      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        subscription: stripeSub.id,
      });

      const upcomingBillDate = moment.unix(upcomingInvoice.period_end);

      return {
        plan: getPlanName(user.customer.biotech.account_type),
        active_user_counts: activeUserCounts,
        bill_cycle: getBillCycleName(subItem.plan.interval),
        payment_method: paymentMethod,
        upcoming_bill_amount: currency(upcomingInvoice.amount_due, {
          fromCents: true,
        }).dollars(),
        upcoming_bill_date: upcomingBillDate,
      };
    },
    billingInvoices: async (_, __, context) => {
      const user = await context.prisma.user.findUnique({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true,
                  customers: {
                    where: {
                      user: {
                        OR: [
                          { deactivated_at: null },
                          { deactivated_at: { gt: new Date() } },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      invariant(
        user?.customer?.biotech.subscriptions,
        "No subscription data found."
      );
      const stripeSubId =
        user.customer.biotech.subscriptions[0].stripe_subscription_id;

      const stripe = await getStripeInstance();
      const resp = await stripe.invoices.list({
        subscription: stripeSubId,
      });

      return resp.data.map((d) => ({
        number: d.number,
        amount: currency(d.amount_due, { fromCents: true }).dollars(),
        date: moment.unix(d.period_end),
        description: getPlanName(user.customer!.biotech.account_type),
        status: d.status,
        invoice_url: d.hosted_invoice_url,
      }));
    },
    billingPortalUrl: async (_, args, context) => {
      const { return_url } = args;
      const userId = context.req.user_id;

      const user = await context.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true,
                },
              },
            },
          },
        },
      });

      invariant(
        user?.customer?.biotech?.subscriptions,
        "Subscription not found."
      );

      const stripe = await getStripeInstance();

      const session = await stripe.billingPortal.sessions.create({
        customer: user.customer.biotech.subscriptions[0].stripe_customer_id,
        return_url,
      });

      return session.url;
    },
  },
};

export default resolvers;
