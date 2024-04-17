import type { Stripe } from 'stripe';
import moment from 'moment';
import { prisma } from '../../../prisma';
import biotechInvoiceService from '../../../services/biotechInvoice/biotechInvoice.service';
import milestoneService from '../../../services/milestone/milestone.service';
import { InvoicePaymentStatus, MilestonePaymentStatus, StripeWebhookPaymentType, SubscriptionStatus } from '../../../helper/constant';
import invariant from '../../../helper/invariant';
import { ga } from '../../../helper/googleAnalytics';
import { getStripeInstance } from '../../../helper/stripe';
import Sentry from '../../../sentry';
import { createInvoicePaymentNoticeEmailJob, createSendUserMilestonePaymentFailedNoticeJob } from '../../../queues/email.queues';

export const processStripeEvent = async (event: Stripe.Event): Promise<{ status: number; message: string }> => {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
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
              return { status: 200, message: `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}` }
            }
            if (checkoutSession.subscription) {
              await prisma.subscription.create({
                data: {
                  stripe_subscription_id: checkoutSession.subscription as string,
                  stripe_customer_id: checkoutSession.customer as string,
                  status: SubscriptionStatus.ACTIVE,
                  biotech_id: customer.biotech_id
                }
              });

              ga.gtag('event', 'purchase', {
                transaction_id: checkoutSession.subscription,
                value: (checkoutSession.amount_total ?? 0) / 100,
                currency: checkoutSession.currency?.toUpperCase(),
              });
            }
            console.info(`Processed webhook: type=${event.type} customer=${customer.id}`);
            return { status: 200, message: 'OK' };
          }
          case 'payment': {
            invariant(checkoutSession.metadata?.payment_type, '[Stripe Webhook] Missing metadata: payment_type.');

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                invariant(checkoutSession.metadata?.invoice_id, '[Stripe Webhook] Missing metadata: invoice_id.');

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
                invariant(checkoutSession?.metadata?.milestone_id, '[Stripe Webhook] Missing metadata: milestone_id.');

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(`Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`);
                  return { status: 200, message: `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}` };
                }

                const { quote_id, milestone_id } = checkoutSession.metadata;
                const milestone = await prisma.milestone.update({
                  where: {
                    id: milestone_id,
                  },
                  data: {
                    payment_status: MilestonePaymentStatus.PROCESSING,
                  }
                });

                await biotechInvoiceService.createBiotechInvoice({
                  milestone,
                  biotech_id: customer?.biotech_id as string,
                  payViaStripe: true,
                }, { prisma });

                console.info(`Processed webhook: type=${event.type} customer=${customer.id} quote=${quote_id} milestone=${milestone_id}`);
                break;
              }
              default: {
                return { status: 400, message: 'Unhandled payment type' };
              }
            }
            return { status: 200, message: 'OK' };
          }
          case 'setup': {
            return { status: 200, message: 'Payment method setup complete' };
          }
          default: {
            return { status: 400, message: 'Unhandled checkout mode.' };
          }
        }
      }

      case 'checkout.session.async_payment_succeeded': {
        // https://stripe.com/docs/api/checkout/sessions/object
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        switch (checkoutSession.mode) {
          case 'setup':
          case 'subscription': {
            return { status: 200, message: 'OK' };
          }
          case 'payment': {
            invariant(checkoutSession?.metadata?.payment_type, '[Stripe Webhook] Missing metadata: payment_type.');

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                invariant(checkoutSession?.metadata?.invoice_id, '[Stripe Webhook] Missing metadata: invoice_id.');

                const { invoice_id, invoice_number, user_id } = checkoutSession.metadata;
                const invoice = await prisma.invoice.update({
                  where: {
                    id: invoice_id,
                  },
                  data: {
                    payment_status: InvoicePaymentStatus.PAID,
                    paid_at: new Date(),
                  }
                });

                createInvoicePaymentNoticeEmailJob({
                  invoiceId: invoice.id,
                  invoiceMonth: moment(invoice.from_date).format('MMM YYYY'),
                  paymentStatus: 'successful',
                  vendorCompanyId: invoice.vendor_company_id,
                });

                console.info(`Processed webhook: type=${event.type} user_id=${user_id} invoice_id=${invoice_id} invoice_number=${invoice_number}`);
                break;
              }
              case StripeWebhookPaymentType.MILESTONE: {
                invariant(checkoutSession?.metadata?.milestone_id, '[Stripe Webhook] Missing metadata: milestone_id.');

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(`Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`);
                  return { status: 200, message: `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}` }
                }

                const { quote_id, milestone_id } = checkoutSession.metadata;

                await milestoneService.updateMilestoneAsPaid({
                  milestone_id,
                  user_id: customer.user_id,
                }, { prisma });

                console.info(`Processed webhook: type=${event.type} customer=${customer.id} quote=${quote_id} milestone=${milestone_id}`);
                break;
              }
              default: {
                return { status: 400, message: 'Unhandled payment type' };
              }
            }
            return { status: 200, message: 'OK' };
          }
          default: {
            return { status: 400, message: 'Unhandled checkout mode' };
          }
        }
      }

      case 'checkout.session.async_payment_failed': {
        // https://stripe.com/docs/api/checkout/sessions/object
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        switch (checkoutSession.mode) {
          case 'setup':
          case 'subscription': {
            // Subscription will auto canceled by Stripe
            return { status: 200, message: 'OK' };
          }
          case 'payment': {
            invariant(checkoutSession?.metadata?.payment_type, '[Stripe Webhook] Missing metadata: payment_type.');

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                invariant(checkoutSession?.metadata?.invoice_id, '[Stripe Webhook] Missing metadata: invoice_id.');

                const { invoice_id, invoice_number, user_id } = checkoutSession.metadata;
                const invoice = await prisma.invoice.update({
                  where: {
                    id: invoice_id,
                  },
                  data: {
                    payment_status: InvoicePaymentStatus.FAILED,
                  }
                });

                createInvoicePaymentNoticeEmailJob({
                  invoiceId: invoice.id,
                  invoiceMonth: moment(invoice.from_date).format('MMM YYYY'),
                  paymentStatus: 'failed',
                  vendorCompanyId: invoice.vendor_company_id,
                });

                console.info(`Processed webhook: type=${event.type} user_id=${user_id} invoice_id=${invoice_id} invoice_number=${invoice_number}`);
                break;
              }
              case StripeWebhookPaymentType.MILESTONE: {
                invariant(checkoutSession?.metadata?.milestone_id, '[Stripe Webhook] Missing metadata: milestone_id.');

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(`Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`);
                  return { status: 200, message: `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}` }
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
                return { status: 400, message: 'Unhandled payment type' };
              }
            }
            return { status: 200, message: 'OK' };
          }
          default: {
            return { status: 400, message: 'Unhandled checkout mode' };
          }
        }
      }

      case 'customer.subscription.updated': {
        const { items, customer } = event.data.object as Stripe.Subscription;
        const stripeCustomerId = customer as string;

        const subItem = items.data.find((i) => !!i.plan);
        invariant(subItem, '[Stripe Webhook] Missing subscription item.');
        const { plan } = subItem;
        const stripe = await getStripeInstance();
        const product = await stripe.products.retrieve(plan.product as string);

        const { account_type } = product.metadata;
        const subcription = await prisma.subscription.findFirst({
          where: {
            stripe_customer_id: stripeCustomerId,
          },
        });

        invariant(subcription, '[Stripe Webhook] Missing biotech subscription data.');

        invariant(account_type, '[Stripe Webhook] Missing metadata: account_type.');

        await prisma.biotech.update({
          where: {
            id: subcription.biotech_id,
          },
          data: {
            account_type,
          },
        });

        return { status: 200, message: 'OK' };
      }

      case 'customer.subscription.deleted': {
        const { status, customer, cancel_at } = event.data.object as Stripe.Subscription;
        const stripeCustomerId = customer as string;

        const subscription = await prisma.subscription.findFirst({
          where: {
            stripe_customer_id: stripeCustomerId,
          },
        });

        invariant(subscription, '[Stripe Webhook] Missing biotech subscription data.');

        await prisma.subscription.update({
          where: {
            id: subscription.id,
          },
          data: {
            status,
            ...(cancel_at ? { ended_at: new Date(cancel_at) } : undefined)
          },
        });

        return { status: 200, message: 'OK' };
      }

      case 'payout.paid':
      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout;
        invariant(payout?.metadata?.milestone_id, '[Stripe Webhook] Missing metadata: milestone_id.');

        const { milestone_id } = payout.metadata;
        const milestone = await prisma.milestone.findFirst({
          where: {
            id: milestone_id,
          },
        });

        invariant(milestone, '[Stripe Webhook] Milestone not found.');

        await prisma.milestone.update({
          where: {
            id: milestone.id,
          },
          data: {
            vendor_payment_status: payout.status === 'paid' ? MilestonePaymentStatus.PAID : MilestonePaymentStatus.UNPAID,
          },
        });

        // TODO notify admin payout if failed

        return { status: 200, message: 'OK' };
      }

      default: {
        console.warn(`Unhandled webhook: event type=${event.type}`);
        return { status: 400, message: 'Unhandled Event Type' };
      }
    }
  } catch (error) {
    Sentry.captureException(error);
    return { status: 400, message: `Webhook Signed Error: ${error}` };
  }
}
