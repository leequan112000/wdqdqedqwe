import moment from "moment";
import currency from "currency.js";
import Stripe  from "stripe";
import { getStripeInstance } from "../../helper/stripe";
import invariant from "../../helper/invariant";
import { CustomerSubscriptionPlanName, SubscriptionStatus, BillingInfoStatus, BiotechAccountType } from "../../helper/constant";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import Sentry from "../../sentry";

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

const getUpcomingInvoice = async (stripeSubId: string, stripe: Stripe) => {
  try {
    return await stripe.invoices.retrieveUpcoming({
      subscription: stripeSubId,
    });
  } catch (error) {
    /**
     * Handle if user has no upcoming invoice.
     */
    if (error instanceof Stripe.errors.StripeError) {
      if (error.code === "invoice_upcoming_none") {
        return null;
      }
    }
    Sentry.captureException(new Error("Failed to retreive upcoming invoice."));
    return null;
  }
};

const resolvers: Resolvers<Context> = {
  BillingInfo: {
    id: () => "billing-info-id",
    has_active_sourcerer_plan: async (_, __, context) => {
      const user = await context.prisma.user.findUnique({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            include: {
              customer_subscriptions: {
                where: {
                  plan_name: CustomerSubscriptionPlanName.SOURCING_PLAN,
                  status: SubscriptionStatus.ACTIVE,
                  OR: [
                    { ended_at: null },
                    {
                      ended_at: {
                        gt: new Date(),
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      });

      return user?.customer?.customer_subscriptions
        ? user?.customer?.customer_subscriptions.length > 0
        : null;
    },
    has_active_legacy_plan: async (_, __, context) => {
      const user = await context.prisma.user.findUnique({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: {
                    where: {
                      status: SubscriptionStatus.ACTIVE,
                      OR: [
                        { ended_at: null },
                        {
                          ended_at: {
                            gt: new Date(),
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      });

      return user?.customer?.biotech?.subscriptions
        ? user?.customer?.biotech?.subscriptions.length > 0
        : null;
    },
    status: async (_, __, context) => {
      const user = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true,
                },
              },
              customer_subscriptions: true,
            },
          },
        },
      });

      const biotechSubscription = user?.customer?.biotech?.subscriptions?.[0];
      const customerSubscription = user?.customer?.customer_subscriptions?.[0];

      const endedAt =
        (customerSubscription?.ended_at || biotechSubscription?.ended_at) ??
        null;
      const subscriptionStatus =
        customerSubscription?.status || biotechSubscription?.status;
      const now = new Date();
      let status: string | null = null;

      if (subscriptionStatus === SubscriptionStatus.ACTIVE) {
        if (endedAt === null) {
          status = BillingInfoStatus.ACTIVE;
        } else if (endedAt && endedAt > now) {
          status = BillingInfoStatus.PENDING_CANCEL;
        } else if (endedAt && endedAt <= now) {
          status = BillingInfoStatus.CANCELED;
        }
      } else if (subscriptionStatus === SubscriptionStatus.CANCELED) {
        status = BillingInfoStatus.CANCELED;
      }

      return status;
    },
  },
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
                },
              },
              customer_subscriptions: true,
            },
          },
        },
      });

      const biotechSubscription = user?.customer?.biotech?.subscriptions?.[0];
      const customerSubscription = user?.customer?.customer_subscriptions?.[0];

      if (!biotechSubscription && !customerSubscription) {
        return null;
      }

      const stripe_subscription_id =
        (customerSubscription?.stripe_subscription_id ||
          biotechSubscription?.stripe_subscription_id) as string;
      const stripe_customer_id = (customerSubscription?.stripe_customer_id ||
        biotechSubscription?.stripe_customer_id) as string;
      const plan_name = (customerSubscription?.plan_name ||
        user?.customer?.biotech?.account_type) as string;

      const stripe = await getStripeInstance();
      const stripeSub = await stripe.subscriptions.retrieve(
        stripe_subscription_id
      );
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

      const upcomingInvoice = await getUpcomingInvoice(stripeSub.id, stripe);

      const upcomingBillAmount = upcomingInvoice
        ? currency(upcomingInvoice.amount_due, {
            fromCents: true,
          }).dollars()
        : null;
      const upcomingBillDate = upcomingInvoice
        ? moment.unix(upcomingInvoice.period_end)
        : null;

      return {
        id: "billing-info-id", // Dummy ID for client to cache the result.
        plan_id: plan_name,
        plan: getPlanName(plan_name),
        bill_cycle: subItem.plan.interval,
        payment_method: paymentMethod,
        upcoming_bill_amount: upcomingBillAmount,
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
                },
              },
              customer_subscriptions: true,
            },
          },
        },
      });

      const biotechStripeCusId =
        user?.customer?.biotech?.subscriptions?.[0]?.stripe_customer_id;
      const biotechSubPlanName = user?.customer?.biotech?.account_type;
      const customerStripeCusId =
        user?.customer?.customer_subscriptions?.[0]?.stripe_customer_id;
      const customerSubPlanName = user?.customer?.customer_subscriptions?.[0]
        ?.plan_name as string;

      if (!biotechStripeCusId && !customerStripeCusId) {
        return null;
      }

      const stripe = await getStripeInstance();
      const biotechStripeInvoices = biotechStripeCusId
        ? (await stripe.invoices.list({ customer: biotechStripeCusId }))
            .data
        : [];
      const customerStripeInvoices = customerStripeCusId
        ? (await stripe.invoices.list({ customer: customerStripeCusId }))
            .data
        : [];

      return [
        ...customerStripeInvoices.map((d) => ({
          number: d.number,
          amount: currency(d.amount_due, { fromCents: true }).dollars(),
          date: moment.unix(d.period_end),
          description: getPlanName(customerSubPlanName || ""),
          status: d.status,
          invoice_url: d.hosted_invoice_url,
        })),
        ...biotechStripeInvoices.map((d) => ({
          number: d.number,
          amount: currency(d.amount_due, { fromCents: true }).dollars(),
          date: moment.unix(d.period_end),
          description: getPlanName(biotechSubPlanName || ""),
          status: d.status,
          invoice_url: d.hosted_invoice_url,
        })),
      ];
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
                  subscriptions: true,
                },
              },
              customer_subscriptions: true,
            },
          },
        },
      });

      const stripe_customer_id =
        user?.customer?.biotech?.subscriptions?.[0]?.stripe_customer_id ||
        user?.customer?.customer_subscriptions?.[0]?.stripe_customer_id;

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
  Mutation: {
    cancelSubscription: async (_, __, context) => {
      const userId = context.req.user_id;

      const stripe = await getStripeInstance();

      const biotechSubscription = await context.prisma.subscription.findFirst({
        where: {
          biotech: {
            customers: {
              some: {
                user_id: userId,
              },
            },
          },
        },
      });

      const customerSubscription =
        await context.prisma.customerSubscription.findFirst({
          where: {
            customer: {
              user_id: userId,
            },
          },
        });

      // Get Stripe subscription end date.
      const stripeSubId =
        biotechSubscription?.stripe_subscription_id ||
        customerSubscription?.stripe_subscription_id;
      invariant(stripeSubId, "No Stripe subscription ID found.");
      const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
      const stripeSubPeriodEnd = stripeSub.current_period_end;
      const subscriptionEndDate = moment.unix(stripeSubPeriodEnd).toDate();

      /**
       * Update subscription end date to current Stripe subscription period end.
       * Then, set Stripe subscription to cancel at period end.
       */
      await context.prisma.$transaction(async (trx) => {
        if (biotechSubscription) {
          await trx.subscription.update({
            where: {
              id: biotechSubscription.id,
            },
            data: {
              ended_at: subscriptionEndDate,
            },
          });
          await stripe.subscriptions.update(
            biotechSubscription.stripe_subscription_id,
            {
              cancel_at_period_end: true,
            }
          );
        }

        if (customerSubscription) {
          await trx.customerSubscription.update({
            where: {
              id: customerSubscription.id,
            },
            data: {
              ended_at: subscriptionEndDate,
            },
          });
          await stripe.subscriptions.update(
            customerSubscription.stripe_subscription_id,
            {
              cancel_at_period_end: true,
            }
          );
        }
      });

      return true;
    },
    resumeSubscription: async (_, __, context) => {
      const userId = context.req.user_id;

      const stripe = await getStripeInstance();

      const biotechSubscription = await context.prisma.subscription.findFirst({
        where: {
          biotech: {
            customers: {
              some: {
                user_id: userId,
              },
            },
          },
        },
      });

      const customerSubscription =
        await context.prisma.customerSubscription.findFirst({
          where: {
            customer: {
              user_id: userId,
            },
          },
        });

      /**
       * Update subscription end date to current Stripe subscription period end.
       * Then, set Stripe subscription to cancel at period end.
       */
      await context.prisma.$transaction(async (trx) => {
        if (biotechSubscription) {
          await trx.subscription.update({
            where: {
              id: biotechSubscription.id,
            },
            data: {
              ended_at: null,
            },
          });
          await stripe.subscriptions.update(
            biotechSubscription.stripe_subscription_id,
            {
              cancel_at_period_end: false,
            }
          );
        }

        if (customerSubscription) {
          await trx.customerSubscription.update({
            where: {
              id: customerSubscription.id,
            },
            data: {
              ended_at: null,
            },
          });
          await stripe.subscriptions.update(
            customerSubscription.stripe_subscription_id,
            {
              cancel_at_period_end: false,
            }
          );
        }
      });

      return true;
    },
  },
};

export default resolvers;
