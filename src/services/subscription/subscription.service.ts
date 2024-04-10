import { getStripeInstance } from "../../helper/stripe";

type DecreaseSubscriptionQuantityArgs = {
  stripe_sub_id: string;
};

const decreaseSubscriptionQuantity = async (
  args: DecreaseSubscriptionQuantityArgs,
) => {
  const { stripe_sub_id } = args;
  const stripe = await getStripeInstance();
  const stripeSubscription = await stripe.subscriptions.retrieve(stripe_sub_id);

  const updatedSubscriptionItemParams = stripeSubscription.items.data.map(
    (item) => ({
      id: item.id,
      quantity: item.quantity && item.quantity > 1 ? item.quantity - 1 : 1,
    })
  );

  await stripe.subscriptions.update(stripe_sub_id, {
    items: updatedSubscriptionItemParams,
    proration_behavior: "none",
  });
};

type IncreaseSubscriptionQuantityArgs = {
  stripe_sub_id: string;
};

const increaseSubscriptionQuantity = async (
  args: IncreaseSubscriptionQuantityArgs,
) => {
  const { stripe_sub_id } = args;
  const stripe = await getStripeInstance();
  const stripeSubscription = await stripe.subscriptions.retrieve(stripe_sub_id);

  const updatedSubscriptionItemParams = stripeSubscription.items.data.map(
    (item) => ({
      id: item.id,
      quantity: item.quantity ? item.quantity + 1 : 1,
    })
  );

  await stripe.subscriptions.update(stripe_sub_id, {
    items: updatedSubscriptionItemParams,
  });
};

const subscriptionService = {
  decreaseSubscriptionQuantity,
  increaseSubscriptionQuantity,
};

export default subscriptionService;
