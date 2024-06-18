import moment from 'moment';
import currency from 'currency.js';
import Stripe from 'stripe';
import { getStripeInstance } from '../../helper/stripe';
import invariant from '../../helper/invariant';
import {
  CustomerSubscriptionPlanName,
  SubscriptionStatus,
  BillingInfoStatus,
  BillingInvoiceStatus,
  CompanyCollaboratorRoleType,
} from '../../helper/constant';
import { Context } from '../../types/context';
import { BillingInfo, Resolvers } from '../generated';
import Sentry from '../../sentry';

const HARDCODED_BILLING_INFO_ID = 'billing-info-id';
const HARDCODED_PAYMENT_METHOD_ID = 'payment-method-id';

const NO_BILLING_INFO: BillingInfo = {
  id: HARDCODED_BILLING_INFO_ID,
  bill_cycle: null,
  plan: null,
  plan_id: null,
  upcoming_bill_amount: null,
  upcoming_bill_date: null,
  payment_method: null,
};

const getPlanName = (accType: string | null) => {
  switch (accType) {
    case CustomerSubscriptionPlanName.PROJECT_MANAGEMENT_PLAN:
      return 'Project Management Plan';
    case CustomerSubscriptionPlanName.SOURCING_PLAN:
      return 'Sourcerer™ Search';
    case CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN:
      return 'White Glove Service';
    case CustomerSubscriptionPlanName.CROMATIC_CONSULTANT:
      return 'Cromatic Consultant';
    default:
      return 'Standard Plan';
  }
};

const getPaymentMethodName = (paymentMethod: Stripe.PaymentMethod.Type) => {
  switch (paymentMethod) {
    case 'card':
      return 'Credit Card';
    default:
      return paymentMethod;
  }
};

const isStripeCus = (
  cus: Stripe.Customer | Stripe.DeletedCustomer,
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
      if (error.code === 'invoice_upcoming_none') {
        return null;
      }
    }
    Sentry.captureException(new Error('Failed to retreive upcoming invoice.'));
    return null;
  }
};

const safeGetStripeSub = async (stripeSubId: string, stripe: Stripe) => {
  try {
    return await stripe.subscriptions.retrieve(stripeSubId, {
      expand: ['schedule'],
    });
  } catch (error) {
    /**
     * Handle if subscription not found.
     */
    if (error instanceof Stripe.errors.StripeError) {
      if (error.code === 'resource_missing') {
        Sentry.captureMessage(error.message, 'warning');
        return null;
      }
    }
    Sentry.captureException(new Error('Failed to retreive subscription.'));
    return null;
  }
};

const isPaymentIntentObj = (
  paymentIntent: string | Stripe.PaymentIntent | null,
): paymentIntent is Stripe.PaymentIntent => {
  return paymentIntent !== null && typeof paymentIntent !== 'string';
};

const isProductId = (
  product: string | Stripe.Product | Stripe.DeletedProduct | null | undefined,
): product is string => {
  return typeof product === 'string';
};

const mapReadableStripeBillingReason = (
  billingReason: Stripe.Invoice.BillingReason | null,
): string => {
  switch (billingReason) {
    case 'subscription_create':
      return 'New subscription created';
    case 'subscription_cycle':
      return 'Subscription renewal';
    case 'subscription_update':
      return 'Subscription update';
    default:
      return 'invoice';
  }
};

const processStripeInvoice = async (
  invoices: Stripe.Invoice[],
  stripe: Stripe,
) => {
  const asyncTasks = invoices.map(async (d) => {
    const paymentIntentObj = isPaymentIntentObj(d.payment_intent)
      ? d.payment_intent
      : null;
    const hasLastPaymentError = !!paymentIntentObj?.last_payment_error;
    const status = (() => {
      if (paymentIntentObj === null) return d.status;
      else if (hasLastPaymentError) return BillingInvoiceStatus.FAILED;
      else if (d.status === 'paid') return BillingInvoiceStatus.PAID;
      return BillingInvoiceStatus.OPEN;
    })();

    /**
     * Display the product name as the invoice description.
     * Use stripe billing reason for
     */
    const description = await (async () => {
      const productId = isProductId(d.lines.data[0]?.plan?.product)
        ? d.lines.data[0]?.plan?.product
        : null;
      const product = productId
        ? await stripe.products.retrieve(productId)
        : null;
      if (product) {
        return product.name;
      }

      return mapReadableStripeBillingReason(d.billing_reason);
    })();
    return {
      number: d.number,
      amount: currency(d.amount_due, { fromCents: true }).dollars(),
      date: moment.unix(d.period_end),
      description,
      status,
      invoice_url: d.hosted_invoice_url,
    };
  });
  return (
    (await Promise.all(asyncTasks))
      // Remove draft invoice
      .filter((d) => d.status !== 'draft')
  );
};

const isStripePaymentMethod = (
  pm: string | Stripe.PaymentMethod | null,
): pm is Stripe.PaymentMethod => {
  return typeof pm !== 'string';
};

const resolvers: Resolvers<Context> = {
  BillingInfo: {
    id: () => 'billing-info-id',
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
    has_active_white_glove_plan: async (_, __, context) => {
      const user = await context.prisma.user.findUnique({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            include: {
              customer_subscriptions: {
                where: {
                  plan_name: CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN,
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

      return user?.customer?.customer_subscriptions === undefined
        ? null
        : user?.customer?.customer_subscriptions.length > 0;
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
      const endedAt = customerSubscription
        ? customerSubscription.ended_at
        : biotechSubscription?.ended_at ?? null;
      const subscriptionStatus = customerSubscription
        ? customerSubscription.status
        : biotechSubscription?.status ?? null;
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
      } else if (subscriptionStatus === SubscriptionStatus.PAST_DUE) {
        status = BillingInfoStatus.PAST_DUE;
      }

      return status;
    },
    payment_method: async (_, __, context) => {
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
      const stripe_customer_id = (customerSubscription?.stripe_customer_id ||
        biotechSubscription?.stripe_customer_id) as string;
      const stripe = await getStripeInstance();
      const stripeCus = await stripe.customers.retrieve(stripe_customer_id, {
        expand: ['invoice_settings.default_payment_method'],
      });

      const defaultPaymentMethod =
        isStripeCus(stripeCus) &&
        isStripePaymentMethod(stripeCus.invoice_settings.default_payment_method)
          ? stripeCus.invoice_settings.default_payment_method
          : null;

      if (defaultPaymentMethod === null) {
        return null;
      }

      return {
        id: HARDCODED_PAYMENT_METHOD_ID,
        display_brand: defaultPaymentMethod?.card?.brand, // display_brand is not available in current stripe-node version
        last_4: defaultPaymentMethod?.card?.last4,
        type: defaultPaymentMethod?.type,
      };
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
        return NO_BILLING_INFO;
      }

      const stripe_subscription_id =
        (customerSubscription?.stripe_subscription_id ||
          biotechSubscription?.stripe_subscription_id) as string;
      const plan_name = (customerSubscription?.plan_name ||
        user?.customer?.biotech?.account_type) as string;

      const stripe = await getStripeInstance();
      const stripeSub = await safeGetStripeSub(stripe_subscription_id, stripe);
      if (stripeSub === null) {
        return {
          ...NO_BILLING_INFO,
          plan_id: plan_name,
          plan: getPlanName(plan_name),
        };
      }
      const subItem = stripeSub.items.data[0];

      const upcomingInvoice = await getUpcomingInvoice(stripeSub.id, stripe);

      const upcomingBillAmount = upcomingInvoice
        ? currency(upcomingInvoice.amount_due, {
            fromCents: true,
          }).dollars()
        : null;
      const upcomingBillDate = upcomingInvoice
        ? moment.unix(upcomingInvoice.period_end)
        : null;

      const schedule = stripeSub.schedule as Stripe.SubscriptionSchedule | null;
      const metadataTrigger = schedule?.metadata?.trigger;

      return {
        id: HARDCODED_BILLING_INFO_ID, // Dummy ID for client to cache the result.
        plan_id: plan_name,
        plan: getPlanName(plan_name),
        bill_cycle: subItem.plan.interval,
        upcoming_bill_amount: upcomingBillAmount,
        upcoming_bill_date: upcomingBillDate,
        has_scheduled_for_interval_change: metadataTrigger === 'user',
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

      const isOwner =
        user?.customer?.role === CompanyCollaboratorRoleType.OWNER;

      const biotechStripeCusId =
        user?.customer?.biotech?.subscriptions?.[0]?.stripe_customer_id;
      const customerStripeCusId =
        user?.customer?.customer_subscriptions?.[0]?.stripe_customer_id;

      if (!biotechStripeCusId && !customerStripeCusId) {
        return null;
      }

      const stripe = await getStripeInstance();
      const biotechStripeInvoices =
        isOwner && biotechStripeCusId
          ? (
              await stripe.invoices.list({
                customer: biotechStripeCusId,
                expand: ['data.payment_intent'],
              })
            ).data.filter((d) => d.status !== 'draft')
          : [];
      const customerStripeInvoices = customerStripeCusId
        ? (
            await stripe.invoices.list({
              customer: customerStripeCusId,
              expand: ['data.payment_intent'],
            })
          ).data.filter((d) => d.status !== 'draft')
        : [];

      const processedCustomerInvoices = await processStripeInvoice(
        customerStripeInvoices,
        stripe,
      );
      const processedBiotechInvoices = await processStripeInvoice(
        biotechStripeInvoices,
        stripe,
      );

      return [...processedCustomerInvoices, ...processedBiotechInvoices];
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
    stripeSetupIntent: async (_, __, context) => {
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
        user?.customer?.customer_subscriptions?.[0]?.stripe_customer_id ||
        user?.customer?.biotech?.subscriptions?.[0]?.stripe_customer_id;
      const stripe = await getStripeInstance();
      const setupIntent = await stripe.setupIntents.create({
        payment_method_types: ['card'],
        customer: stripe_customer_id,
      });

      return setupIntent.client_secret;
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
          status: SubscriptionStatus.ACTIVE,
        },
      });

      const customerSubscription =
        await context.prisma.customerSubscription.findFirst({
          where: {
            customer: {
              user_id: userId,
            },
            status: SubscriptionStatus.ACTIVE,
          },
        });

      // Get Stripe subscription end date.
      invariant(
        biotechSubscription !== null || customerSubscription !== null,
        'No active Stripe subscription found.',
      );

      /**
       * Update subscription end date to current Stripe subscription period end.
       * Then, set Stripe subscription to cancel at period end.
       */
      await context.prisma.$transaction(async (trx) => {
        if (biotechSubscription) {
          const stripeSub = await stripe.subscriptions.retrieve(
            biotechSubscription.stripe_subscription_id,
          );
          const stripeSubPeriodEnd = stripeSub.current_period_end;
          const subscriptionEndDate = moment.unix(stripeSubPeriodEnd).toDate();
          await trx.subscription.update({
            where: {
              id: biotechSubscription.id,
            },
            data: {
              ended_at: subscriptionEndDate,
            },
          });
          // Release any schedule
          if (stripeSub.schedule) {
            const scheduleId = stripeSub.schedule as string;
            await stripe.subscriptionSchedules.release(scheduleId);
          }
          await stripe.subscriptions.update(
            biotechSubscription.stripe_subscription_id,
            {
              cancel_at_period_end: true,
            },
          );
        }

        if (customerSubscription) {
          const stripeSub = await stripe.subscriptions.retrieve(
            customerSubscription.stripe_subscription_id,
          );
          const stripeSubPeriodEnd = stripeSub.current_period_end;
          const subscriptionEndDate = moment.unix(stripeSubPeriodEnd).toDate();
          await trx.customerSubscription.update({
            where: {
              id: customerSubscription.id,
            },
            data: {
              ended_at: subscriptionEndDate,
            },
          });
          // Release any schedule
          if (stripeSub.schedule) {
            const scheduleId = stripeSub.schedule as string;
            await stripe.subscriptionSchedules.release(scheduleId);
          }
          await stripe.subscriptions.update(
            customerSubscription.stripe_subscription_id,
            {
              cancel_at_period_end: true,
            },
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
            },
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
            },
          );
        }
      });

      return true;
    },
  },
};

export default resolvers;
