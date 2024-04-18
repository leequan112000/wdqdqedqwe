import currency from "currency.js";
import { getStripeInstance } from "../../helper/stripe";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";
import { app_env } from "../../environment";

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
          id: "sourcerer-matching-plan",
          name: "Sourcerer™ Matching",
          prices: [
            {
              id: sourcererMonthlyPriceId,
              amount_per_month: currency(sourcererMonthlyPrice.unit_amount, {
                fromCents: true,
              }).dollars(),
              interval: "month",
            },
            {
              id: "sourcerer-matching:yearly",
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
                { description: "Unlimited outsourcing requests" },
                { description: "Analyzes RFPs for vendor match" },
                { description: "Comprehensive vendor discovery platform" },
              ],
            },
            {
              name: "Sourcerer Lite",
              items: [{ description: "Search with single service" }],
            },
          ],
        },
      ];
    },
    subscriptionCheckoutSessionURL: async (_, args, context) => {
      const userId = context.req.user_id;
      const { price_id, ga_client_id } = args;

      const user = await context.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          customer: true,
        },
      });

      const customerId = user?.customer?.id;

      invariant(customerId, 'Missing customer ID.')

      const stripe = await getStripeInstance();
      const price = await stripe.prices.retrieve(price_id);
      const product = await stripe.products.retrieve(price.product.toString());
      const { plan_name } = product.metadata;

      const session = await stripe.checkout.sessions.create({
        client_reference_id: customerId,
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${app_env.APP_URL}/onboarding?success=true`,
        cancel_url: `${app_env.APP_URL}/onboarding?cancel=true`,
        metadata: {
          plan_name,
          ...(ga_client_id ? { client_id: ga_client_id } : {}),
        },
      });

      return session.url;
    },
  },
};

export default resolvers;
