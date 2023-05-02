import Stripe from 'stripe';
import { Request, Response } from 'express';
import { prisma } from '../../connectDB';
import { Biotech, Customer, Subscription } from '@prisma/client';
import { SubscriptionStatus } from '../../helper/constant';
import Sentry from '../../sentry';
import { getStripeInstance } from '../../helper/stripe';

/*
 *   Stripe webhook endpoint
 *   Docs: https://stripe.com/docs/webhooks, https://stripe.com/docs/webhooks/signatures
 *   Description :
 *   Listen for events on from Stripe account to automatically trigger reactions.
 */

const isUnitTest = process.env.NODE_ENV === 'test';

const createActiveSubscriptionIfNoneExists = async (
  customer: Customer & { biotech: Biotech & { subscriptions: Subscription[] } },
  stripe_subscription_id: string,
  stripe_customer_id: string
) => {
  if (customer.biotech.subscriptions.length > 0) {
    return;
  }

  await prisma.subscription.create({
    data: {
      stripe_subscription_id,
      stripe_customer_id,
      status: SubscriptionStatus.ACTIVE,
      biotech_id: customer.biotech_id
    }
  });
}

export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const stripe = await getStripeInstance();
  // Only verify the event if endpoint secret defined.
  let sig = "";
  let endpointSecret = "";
  if (isUnitTest) {
    endpointSecret = 'whsec_test_secret';

    sig = stripe.webhooks.generateTestHeaderString({
      payload: String(req),
      secret: endpointSecret,
    });
  } else {
    sig = req.headers['stripe-signature'] as string;
    endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(isUnitTest ? req : req.body, sig, endpointSecret);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ status: 400, message: `Webhook Error: ${error.message}` });
    } else {
      res.status(400).json({ status: 400, message: 'Webhook Error' });
    }
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      try {
        // https://stripe.com/docs/api/checkout/sessions/object
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const customer = await prisma.customer.findFirstOrThrow({
          where: {
            id: checkoutSession.client_reference_id!
          },
          include: {
            biotech: {
              include: {
                subscriptions: true
              }
            }
          }
        });
        if (customer) {
          if (checkoutSession.subscription) {
            await createActiveSubscriptionIfNoneExists(customer, checkoutSession.subscription as string, checkoutSession.customer as string);
          } else {
            // Increment number_of_reqs_allowed_without_subscription by 1
            const incremented_number_of_request = customer.biotech.number_of_reqs_allowed_without_subscription + 1;
            await prisma.biotech.update({
              where: {
                id: customer.biotech_id
              },
              data: {
                number_of_reqs_allowed_without_subscription: incremented_number_of_request
              }
            })
          }
          console.info(`Processed webhook: type=${event.type} customer=${customer.id}`);
        } else {
          // This can happen in because stripe sends webhooks for both staging and production traffic.
          console.info(`Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`);
        }
        res.status(200).json({ status: 200, message: 'OK' });
      } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: `Webhook Signed Error: ${error}` });
      }
      break;
    }
    case 'customer.subscription.updated': {
      // TODO: handle complete cancellation
      try {
        const { items, customer } = event.data.object as Stripe.Subscription;
        const stripeCustomerId = customer as string;

        const subItem = items.data.find((i) => !!i.plan);
        if (!subItem) {
          throw new Error('[Stripe Webhook] Missing subscription item.');
        }
        const { plan } = subItem;
        const product = await stripe.products.retrieve(plan.product as string);
        const { account_type } = product.metadata;
        const subcription = await prisma.subscription.findFirst({
          where: {
            stripe_customer_id: stripeCustomerId,
          },
        });

        if (!subcription) {
          throw new Error('[Stripe Webhook] Missing biotech subscription data.');
        }

        if (!account_type) {
          throw new Error('[Stripe Webhook] Missing metadata: account_type.');
        }

        await prisma.biotech.update({
          where: {
            id: subcription.biotech_id,
          },
          data: {
            account_type,
          },
        });

        res.status(200).json({ status: 200, message: 'OK' });
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ status: 400, message: `Webhook Signed Error: ${error}` });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      try {
        const { status, customer } = event.data.object as Stripe.Subscription;
        const stripeCustomerId = customer as string;

        const subscription = await prisma.subscription.findFirst({
          where: {
            stripe_customer_id: stripeCustomerId,
          },
        });

        if (!subscription) {
          throw new Error('[Stripe Webhook] Missing biotech subscription data.');
        }

        await prisma.subscription.update({
          where: {
            id: subscription.id,
          },
          data: {
            status,
          },
        });

        res.status(200).json({ status: 200, message: 'OK' });
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ status: 400, message: `Webhook Signed Error: ${error}` });
      }
      break;
    }
    default: {
      console.warn(`Unhandled webhook: event type=${event.type}`);
      res.status(400).json({ status: 400, message: 'Unhandled Event Type' });
    }
  }
};
