import moment from "moment";
import currency from "currency.js";
import Stripe from "stripe";
import { getStripeInstance } from "../../helper/stripe";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { CustomerSubscriptionPlanName } from "../../helper/constant";

const getPlanName = (accType: string | null) => {
  switch (accType) {
    case CustomerSubscriptionPlanName.PROJECT_MANAGEMENT_PLAN:
      return 'Project Management Plan';
    case CustomerSubscriptionPlanName.SOURCING_PLAN:
      return 'Sourcing Pro Plan';
    case CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN:
      return 'White Glove Plan';
    default:
      return 'Standard Plan';
  }
};

const getPaymentMethodName = (paymentMethod: Stripe.PaymentMethod.Type) => {
  switch (paymentMethod) {
    case "card":
      return "Credit Card";
    default:
      return paymentMethod;
  }
};

const isStripeCus = (
  cus: Stripe.Customer | Stripe.DeletedCustomer
): cus is Stripe.Customer => {
  return cus.deleted !== true;
};

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
                  subscriptions: true
                }
              },
              customer_subscriptions: true
            },
          },
        },
      });

      const stripe_subscription_id = user?.customer?.biotech?.subscriptions?.[0]?.stripe_subscription_id || user?.customer?.customer_subscriptions?.[0]?.stripe_subscription_id;
      const stripe_customer_id = user?.customer?.biotech?.subscriptions?.[0]?.stripe_customer_id || user?.customer?.customer_subscriptions?.[0]?.stripe_customer_id;
      const plan_name = user?.customer?.biotech?.account_type || user?.customer?.customer_subscriptions?.[0]?.plan_name as string;

      if (!stripe_subscription_id || !stripe_customer_id) {
        return null;
      }

      const stripe = await getStripeInstance();
      const stripeSub = await stripe.subscriptions.retrieve(stripe_subscription_id);
      const subItem = stripeSub.items.data[0];
      const stripeCus = await stripe.customers.retrieve(stripe_customer_id);

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
        plan_id: plan_name,
        plan: getPlanName(plan_name),
        bill_cycle: subItem.plan.interval,
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
                  subscriptions: true
                }
              },
              customer_subscriptions: true
            },
          },
        },
      });

      const stripe_subscription_id = user?.customer?.biotech?.subscriptions?.[0]?.stripe_subscription_id || user?.customer?.customer_subscriptions?.[0]?.stripe_subscription_id;
      const plan_name = user?.customer?.biotech?.account_type || user?.customer?.customer_subscriptions?.[0]?.plan_name as string;

      if (!stripe_subscription_id) {
        return null;
      }

      const stripe = await getStripeInstance();
      const resp = await stripe.invoices.list({
        subscription: stripe_subscription_id,
      });

      return resp.data.map((d) => ({
        number: d.number,
        amount: currency(d.amount_due, { fromCents: true }).dollars(),
        date: moment.unix(d.period_end),
        description: getPlanName(plan_name),
        status: d.status,
        invoice_url: d.hosted_invoice_url,
      }));
    },
    billingPortalUrl: async (_, args, context) => {
      const { return_url } = args;
      const userId = context.req.user_id;
      const user = await context.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true
                }
              },
              customer_subscriptions: true
            },
          },
        },
      });

      const stripe_customer_id = user?.customer?.biotech?.subscriptions?.[0]?.stripe_customer_id || user?.customer?.customer_subscriptions?.[0]?.stripe_customer_id;

      if (!stripe_customer_id) {
        return null;
      }

      const stripe = await getStripeInstance();

      const session = await stripe.billingPortal.sessions.create({
        customer: stripe_customer_id,
        return_url,
      });

      return session.url;
    },
  },
};

export default resolvers;
