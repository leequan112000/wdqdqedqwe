import currency from 'currency.js';
import Stripe from 'stripe';
import { getStripeInstance } from '../../helper/stripe';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';
import { CustomerSubscriptionPlanName } from '../../helper/constant';
import { env } from '../../env';
import { parseCompanySize } from '../../helper/vendorCompany';

const resolvers: Resolvers<Context> = {
  Query: {
    stripePricingTableId: async () =>
      process.env.STRIPE_PRICING_TABLE_ID || null,
    subscriptionPlans: async () => {
      const stripe = await getStripeInstance();

      const sourcererMonthlyPrice = await stripe.prices.retrieve(
        env.STRIPE_SOURCERER_MONTHLY_PLAN.price_id,
      );

      invariant(
        sourcererMonthlyPrice.unit_amount,
        'Missing sourcerer plan monthly pricing',
      );

      const sourcererYearlyPrice = await stripe.prices.retrieve(
        env.STRIPE_SOURCERER_YEARLY_PLAN.price_id,
      );

      invariant(
        sourcererYearlyPrice.unit_amount,
        'Missing sourcerer plan yearly pricing',
      );

      return [
        {
          id: CustomerSubscriptionPlanName.SOURCING_PLAN,
          name: 'Sourcerer Search',
          description:
            'Empowers you to independently conduct vendor searches and establish connections.',
          prices: [
            {
              id: env.STRIPE_SOURCERER_MONTHLY_PLAN.price_id,
              amount_per_month: currency(sourcererMonthlyPrice.unit_amount, {
                fromCents: true,
              }).dollars(),
              interval: 'month',
              discount_percentage:
                env.STRIPE_SOURCERER_MONTHLY_PLAN.discount_percentage,
            },
            {
              id: env.STRIPE_SOURCERER_YEARLY_PLAN.price_id,
              amount_per_month: currency(sourcererYearlyPrice.unit_amount, {
                fromCents: true,
              })
                .divide(12)
                .dollars(),
              interval: 'year',
              discount_percentage:
                env.STRIPE_SOURCERER_YEARLY_PLAN.discount_percentage,
            },
          ],
          features: [
            {
              name: 'Sourcerer life sciences outsourcing tool',
              items: [
                { description: 'RFP analysis for vendor matching' },
                { description: 'Unlimited search requests' },
                { description: 'Comprehensive vendor discovery platform' },
              ],
            },
            {
              name: 'Sourcerer lite search',
              items: [
                {
                  description: 'Unlimited search requests for a single service',
                },
              ],
            },
          ],
        },
        {
          id: CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN,
          name: 'White Glove Service',
          description:
            'Provides a dedicated Cromatic team to manage vendor negotiations on your behalf.',
          prices: [],
          features: [
            {
              name: 'Everything in Sourcerer Search Plan plus...',
              items: [],
            },
            {
              name: 'Custom vendor management services',
              items: [
                { description: 'RFP review' },
                { description: 'Streamlined quoting process' },
                { description: 'Price negotiations' },
                { description: 'Vendor team selection' },
              ],
            },
          ],
        },
      ];
    },
    subscriptionCheckoutSessionUrl: async (_, args, context) => {
      const userId = context.req.user_id;
      const { price_id, ga_client_id, cancel_url, success_url } = args;

      const user = await context.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          customer: {
            include: {
              customer_subscriptions: true,
            },
          },
        },
      });

      const customer = user?.customer;

      invariant(customer, 'Missing customer.');

      const customerId = customer.id;
      const stripe = await getStripeInstance();
      const price = await stripe.prices.retrieve(price_id);
      const product = await stripe.products.retrieve(price.product.toString());
      const { plan_name } = product.metadata;

      let stripeCusId: string | null = null;
      if (customer.customer_subscriptions.length > 0) {
        stripeCusId = customer.customer_subscriptions[0].stripe_customer_id;
      }

      const session = await stripe.checkout.sessions.create({
        client_reference_id: customerId,
        /**
         * Reuse Stripe customer ID to create new subscription
         * within the same Stripe customer object.
         */
        ...(stripeCusId
          ? { customer: stripeCusId }
          : { customer_email: user.email }),
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url,
        cancel_url,
        metadata: {
          plan_name,
          ...(ga_client_id ? { client_id: ga_client_id } : {}),
        },
        payment_method_types: ['card'],
      });

      return session.url;
    },
    subscriptionCheckoutLink: async (_, args, context) => {
      const { ga_client_id } = args;
      const userId = context.req.user_id;
      const paidVendor = await context.prisma.paidVendor.findFirst({
        where: {
          user_id: userId,
        },
        include: {
          user: {
            include: {
              customer: {
                include: {
                  customer_subscriptions: true,
                },
              },
            },
          },
        },
      });

      invariant(paidVendor, 'Missing paid vendor.');

      invariant(paidVendor.company_size, 'Missing company size.');

      const customer = paidVendor?.user?.customer;

      invariant(customer, 'Missing customer.');

      const size = parseCompanySize(paidVendor.company_size);

      let price_id: string | null | undefined;
      if (size.max <= 50) {
        price_id = process.env.STRIPE_STARTER_CROMATIC_VENDOR_LISTING_PRICE_ID;
      } else {
        price_id = process.env.STRIPE_CROMATIC_VENDOR_LISTING_PRICE_ID;
      }

      invariant(price_id, 'Missing price id.');

      const customerId = customer.id;
      const stripe = await getStripeInstance();
      const price = await stripe.prices.retrieve(price_id);
      const product = await stripe.products.retrieve(price.product.toString());
      const { plan_name } = product.metadata;

      let stripeCusId: string | null = null;
      if (customer.customer_subscriptions.length > 0) {
        stripeCusId = customer.customer_subscriptions[0].stripe_customer_id;
      }

      const session = await stripe.checkout.sessions.create({
        client_reference_id: customerId,
        ...(stripeCusId
          ? { customer: stripeCusId }
          : { customer_email: paidVendor.email! }),
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: '',
        cancel_url: '',
        metadata: {
          plan_name,
          ...(ga_client_id ? { client_id: ga_client_id } : {}),
        },
        payment_method_types: ['card'],
      });

      return session.url;
    },
  },
  Mutation: {
    scheduleSubscriptionChange: async (_, args, context) => {
      const userId = context.req.user_id;

      const subscriptions =
        (await context.prisma.user
          .findUnique({
            where: {
              id: userId,
            },
          })
          .customer()
          .customer_subscriptions()) || [];

      const stripeSubId: string | undefined =
        subscriptions?.[0]?.stripe_subscription_id;
      const stripeCusId: string | undefined =
        subscriptions?.[0]?.stripe_customer_id;

      invariant(stripeSubId, 'No Stripe subscription ID');
      invariant(stripeCusId, 'No Stripe customer ID');

      const stripe = await getStripeInstance();
      const stripeSub = await stripe.subscriptions.retrieve(stripeSubId, {
        expand: ['schedule'],
      });
      // Get Stripe subscription with schedule data
      let schedule = stripeSub.schedule as Stripe.SubscriptionSchedule;
      if (schedule === null) {
        // Create subscription schedule if no schedule exist.
        schedule = await stripe.subscriptionSchedules.create({
          from_subscription: stripeSubId,
        });
      }

      await stripe.subscriptionSchedules.update(schedule.id, {
        // Set to release the schedule after all the phases has completed.
        end_behavior: 'release',
        phases: [
          // Phase 0 consists of the current subscription items, start and end dates.
          {
            items: [
              {
                price: schedule.phases[0].items[0].price as string,
                quantity: schedule.phases[0].items[0].quantity,
              },
            ],
            start_date: schedule.phases[0].start_date,
            end_date: schedule.phases[0].end_date,
          },
          // Phase 1 will be the new subscription with new product (price id select from args).
          {
            items: [
              {
                price: args.price_id,
                quantity: 1,
              },
            ],
            iterations: 1,
          },
        ],
        metadata: {
          // For billingInfo.has_scheduled_for_interval_change to track user trigger.
          trigger: 'user',
        },
      });

      return true;
    },
  },
};

export default resolvers;
