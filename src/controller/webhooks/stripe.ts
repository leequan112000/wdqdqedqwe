import Stripe from 'stripe';
import { Request, Response } from 'express';
import { prisma } from '../../connectDB';
import { Biotech, Customer, Subscription } from '@prisma/client';
import Sentry from '../../sentry';

import { InvoicePaymentStatus, MilestoneEventType, MilestonePaymentStatus, MilestoneStatus, StripeWebhookPaymentType, SubscriptionStatus } from '../../helper/constant';
import { getStripeInstance } from '../../helper/stripe';

import { createSendUserMilestoneNoticeJob, createSendUserMilestonePaymentFailedNoticeJob } from '../../queues/email.queues';

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

        switch (checkoutSession.mode) {
          case 'subscription': {
            const customer = await prisma.customer.findFirst({
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
            if (!customer) {
              // This can happen in because stripe sends webhooks for both staging and production traffic.
              console.info(`Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`);
              break;
            }
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
            res.status(200).json({ status: 200, message: 'OK' });
            break;
          }
          case 'payment': {
            if (!checkoutSession?.metadata?.payment_type) {
              throw new Error('[Stripe Webhook] Missing metadata: payment_type.');
            }

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                if (!checkoutSession?.metadata?.invoice_id) {
                  throw new Error('[Stripe Webhook] Missing metadata: invoice_id.');
                }

                const { invoice_id, invoice_number, user_id } = checkoutSession.metadata;
                await prisma.invoice.update({
                  where: {
                    id: invoice_id,
                  },
                  data: {
                    payment_status: InvoicePaymentStatus.PROCESSING,
                  }
                });
                console.info(`Processed webhook: type=${event.type} user_id=${user_id} invoice_id=${invoice_id} invoice_number=${invoice_number}`);
                break;
              }
              case StripeWebhookPaymentType.MILESTONE: {
                if (!checkoutSession?.metadata?.milestone_id) {
                  throw new Error('[Stripe Webhook] Missing metadata: milestone_id.');
                }

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(`Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`);
                  break;
                }

                const { quote_id, milestone_id } = checkoutSession.metadata;
                await prisma.milestone.update({
                  where: {
                    id: milestone_id,
                  },
                  data: {
                    status: MilestoneStatus.IN_PROGRESS,
                    payment_status: MilestonePaymentStatus.PROCESSING,
                  }
                });
                console.info(`Processed webhook: type=${event.type} customer=${customer.id} quote=${quote_id} milestone=${milestone_id}`);
                break;
              }
              default: {
                res.status(400).json({ status: 400, message: 'Unhandled payment type' });
                break;
              }
            }
            res.status(200).json({ status: 200, message: 'OK' });
            break;
          }
          case 'setup': {
            res.status(200).json({ status: 200, message: 'Payment method setup complete' });
            break;
          }
          default: {
            res.status(400).json({ status: 400, message: 'Unhandled checkout mode' });
            break;
          }
        }
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ status: 400, message: `Webhook Signed Error: ${error}` });
      }
      break;
    }
    case 'checkout.session.async_payment_succeeded': {
      try {
        // https://stripe.com/docs/api/checkout/sessions/object
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        switch (checkoutSession.mode) {
          case 'setup':
          case 'subscription': {
            res.status(200).json({ status: 200, message: 'OK' });
            break;
          }
          case 'payment': {
            if (!checkoutSession?.metadata?.payment_type) {
              throw new Error('[Stripe Webhook] Missing metadata: payment_type.');
            }

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                if (!checkoutSession?.metadata?.invoice_id) {
                  throw new Error('[Stripe Webhook] Missing metadata: invoice_id.');
                }

                const { invoice_id, invoice_number, user_id } = checkoutSession.metadata;
                await prisma.invoice.update({
                  where: {
                    id: invoice_id,
                  },
                  data: {
                    payment_status: InvoicePaymentStatus.PAID,
                  }
                });
                console.info(`Processed webhook: type=${event.type} user_id=${user_id} invoice_id=${invoice_id} invoice_number=${invoice_number}`);
                break;
              }
              case StripeWebhookPaymentType.MILESTONE: {
                if (!checkoutSession?.metadata?.milestone_id) {
                  throw new Error('[Stripe Webhook] Missing metadata: milestone_id.');
                }

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(`Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`);
                  break;
                }

                const { quote_id, milestone_id } = checkoutSession.metadata;
                const updatedMilestone = await prisma.milestone.update({
                  where: {
                    id: milestone_id,
                  },
                  include: {
                    quote: {
                      include: {
                        project_connection: true,
                      }
                    }
                  },
                  data: {
                    payment_status: MilestonePaymentStatus.PAID,
                  }
                });

                createSendUserMilestoneNoticeJob({
                  projectConnectionId: updatedMilestone.quote.project_connection_id,
                  milestoneTitle: updatedMilestone.title,
                  quoteId: updatedMilestone.quote.id,
                  senderUserId: customer.user_id!,
                  milestoneEventType: MilestoneEventType.BIOTECH_PAID,
                });

                console.info(`Processed webhook: type=${event.type} customer=${customer.id} quote=${quote_id} milestone=${milestone_id}`);
                break;
              }
              default: {
                res.status(400).json({ status: 400, message: 'Unhandled payment type' });
                break;
              }
            }
            res.status(200).json({ status: 200, message: 'OK' });
            break;
          }
          default: {
            res.status(400).json({ status: 400, message: 'Unhandled checkout mode' });
            break;
          }
        }
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ status: 400, message: `Webhook Signed Error: ${error}` });
      }
      break;
    }
    case 'checkout.session.async_payment_failed': {
      try {
        // https://stripe.com/docs/api/checkout/sessions/object
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        switch (checkoutSession.mode) {
          case 'setup':
          case 'subscription': {
            // Subscription will auto canceled by Stripe
            res.status(200).json({ status: 200, message: 'OK' });
            break;
          }
          case 'payment': {
            if (!checkoutSession?.metadata?.payment_type) {
              throw new Error('[Stripe Webhook] Missing metadata: payment_type.');
            }

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                if (!checkoutSession?.metadata?.invoice_id) {
                  throw new Error('[Stripe Webhook] Missing metadata: invoice_id.');
                }

                const { invoice_id, invoice_number, user_id } = checkoutSession.metadata;
                await prisma.invoice.update({
                  where: {
                    id: invoice_id,
                  },
                  data: {
                    payment_status: InvoicePaymentStatus.FAILED,
                  }
                });
                console.info(`Processed webhook: type=${event.type} user_id=${user_id} invoice_id=${invoice_id} invoice_number=${invoice_number}`);
                break;
              }
              case StripeWebhookPaymentType.MILESTONE: {
                if (!checkoutSession?.metadata?.milestone_id) {
                  throw new Error('[Stripe Webhook] Missing metadata: milestone_id.');
                }

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(`Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`);
                  break;
                }

                const { quote_id, milestone_id } = checkoutSession.metadata;
                await prisma.milestone.update({
                  where: {
                    id: milestone_id,
                  },
                  data: {
                    payment_status: MilestonePaymentStatus.UNPAID,
                  }
                });

                createSendUserMilestonePaymentFailedNoticeJob({ milestoneId: milestone_id });
                console.info(`Processed webhook: type=${event.type} customer=${customer.id} quote=${quote_id} milestone=${milestone_id}`);
                break;
              }
              default: {
                res.status(400).json({ status: 400, message: 'Unhandled payment type' });
                break;
              }
            }
            res.status(200).json({ status: 200, message: 'OK' });
            break;
          }
          default: {
            res.status(400).json({ status: 400, message: 'Unhandled checkout mode' });
            break;
          }
        }
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ status: 400, message: `Webhook Signed Error: ${error}` });
      }
      break;
    }
    case 'customer.subscription.updated': {
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
        const { status, customer, cancel_at } = event.data.object as Stripe.Subscription;
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
            ...(cancel_at ? { ended_at: new Date(cancel_at) } : undefined)
          },
        });

        res.status(200).json({ status: 200, message: 'OK' });
      } catch (error) {
        Sentry.captureException(error);
        res.status(400).json({ status: 400, message: `Webhook Signed Error: ${error}` });
      }
      break;
    }
    case 'payout.paid':
    case 'payout.failed': {
      try {
        const payout = event.data.object as Stripe.Payout;
        if (!payout?.metadata?.milestone_id) {
          throw new Error('[Stripe Webhook] Missing metadata: milestone_id.');
        }

        const { milestone_id } = payout.metadata;
        const milestone = await prisma.milestone.findFirst({
          where: {
            id: milestone_id,
          },
        });

        if (!milestone) {
          throw new Error('[Stripe Webhook] Milestone not found.');
        }

        await prisma.milestone.update({
          where: {
            id: milestone.id,
          },
          data: {
            vendor_payment_status: payout.status === 'paid' ? MilestonePaymentStatus.PAID : MilestonePaymentStatus.UNPAID,
          },
        });

        // TODO notify admin payout if failed

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
