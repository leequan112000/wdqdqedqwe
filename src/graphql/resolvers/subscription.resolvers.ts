import currency from "currency.js";
import { getStripeInstance } from "../../helper/stripe";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";
import { CustomerSubscriptionPlanName } from "../../helper/constant";

const resolvers: Resolvers<Context> = {
  Query: {
    stripePricingTableId: async () =>
      process.env.STRIPE_PRICING_TABLE_ID || null,
    subscriptionPlans: async () => {
      const stripe = await getStripeInstance();

      const sourcererMonthlyPriceId =
        process.env.STRIPE_SOURCERER_MONTHLY_PRICE_ID;
      const sourcererYearlyPriceId =
        process.env.STRIPE_SOURCERER_YEARLY_PRICE_ID;

      invariant(
        sourcererMonthlyPriceId && sourcererYearlyPriceId,
        "Price IDs not set."
      );

      const sourcererMonthlyPrice = await stripe.prices.retrieve(
        sourcererMonthlyPriceId
      );

      invariant(
        sourcererMonthlyPrice.unit_amount,
        "Missing sourcerer plan monthly pricing"
      );

      const sourcererYearlyPrice = await stripe.prices.retrieve(
        sourcererYearlyPriceId
      );

      invariant(
        sourcererYearlyPrice.unit_amount,
        "Missing sourcerer plan yearly pricing"
      );

      return [
        {
          id: CustomerSubscriptionPlanName.SOURCING_PLAN,
          name: "Sourcerer™ Search",
          prices: [
            {
              id: sourcererMonthlyPriceId,
              amount_per_month: currency(sourcererMonthlyPrice.unit_amount, {
                fromCents: true,
              }).dollars(),
              interval: "month",
            },
            {
              id: sourcererYearlyPriceId,
              amount_per_month: currency(sourcererYearlyPrice.unit_amount, {
                fromCents: true,
              })
                .divide(12)
                .dollars(),
              interval: "year",
            },
          ],
          features: [
            {
              name: "Sourcerer™ Matchmaker",
              items: [
                { description: "RFP analysis for vendor matching" },
                { description: "Unlimited search requests" },
                { description: "Comprehensive vendor discovery platform" },
              ],
            },
            {
              name: "Sourcerer™ Lite Search",
              items: [{ description: "Unlimited search requests for a single service" }],
            },
          ],
        },
        {
          id: CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN,
          name: "White Glove Service",
          prices: [],
          features: [
            {
              name: "Sourcerer™ Search plan",
              items: [],
            },
            {
              name: "Custom vendor management services",
              items: [
                { description: "RFP review" },
                { description: "Streamlined quoting process" },
                { description: "Price negotiations" },
                { description: "Vendor team selection" },
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

      invariant(customer, "Missing customer.");

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
        mode: "subscription",
        success_url,
        cancel_url,
        metadata: {
          plan_name,
          ...(ga_client_id ? { client_id: ga_client_id } : {}),
        },
        payment_method_types: ["card"],
      });

      return session.url;
    },
  },
};

export default resolvers;
