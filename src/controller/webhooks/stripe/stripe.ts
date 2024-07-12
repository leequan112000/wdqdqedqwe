import type { Stripe } from 'stripe';
import moment from 'moment';
import { prisma } from '../../../prisma';
import biotechInvoiceService from '../../../services/biotechInvoice/biotechInvoice.service';
import milestoneService from '../../../services/milestone/milestone.service';
import {
  CompanyCollaboratorRoleType,
  CustomerSubscriptionPlanName,
  InvoicePaymentStatus,
  MilestonePaymentStatus,
  StripeWebhookPaymentType,
  SubscriptionStatus,
} from '../../../helper/constant';
import { ga } from '../../../helper/googleAnalytics';
import invariant from '../../../helper/invariant';
import { getStripeInstance } from '../../../helper/stripe';
import Sentry from '../../../sentry';
import { app_env } from '../../../environment';
import { sendInvoicePaymentNoticeEmail } from '../../../mailer/invoice';
import { sendMilestoneNoticeEmail } from '../../../mailer/milestone';
import { createInvoicePaymentNotification } from '../../../notification/invoiceNotification';
import { createMilestonePaymentFailedNotification } from '../../../notification/milestoneNotification';

export const processStripeEvent = async (
  event: Stripe.Event,
): Promise<{ status: number; message: string }> => {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // https://stripe.com/docs/api/checkout/sessions/object
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        switch (checkoutSession.mode) {
          case 'subscription': {
            const customer = await prisma.customer.findFirst({
              where: {
                id: checkoutSession.client_reference_id!,
              },
              include: {
                customer_subscriptions: true,
              },
            });
            if (!customer) {
              // This can happen in because stripe sends webhooks for both staging and production traffic.
              console.info(
                `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`,
              );
              return {
                status: 200,
                message: `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`,
              };
            }
            if (checkoutSession.subscription) {
              if (!checkoutSession.metadata?.plan_name) {
                Sentry.captureMessage(
                  '[Stripe Webhook] Missing plan name metadata.',
                );
              }

              if (customer.customer_subscriptions.length > 0) {
                await prisma.customerSubscription.update({
                  where: {
                    id: customer.customer_subscriptions[0].id,
                  },
                  data: {
                    stripe_subscription_id:
                      checkoutSession.subscription as string,
                    stripe_customer_id: checkoutSession.customer as string,
                    status: SubscriptionStatus.ACTIVE,
                    plan_name: checkoutSession.metadata?.plan_name as string,
                    ended_at: null,
                  },
                });
              } else {
                await prisma.customerSubscription.create({
                  data: {
                    stripe_subscription_id:
                      checkoutSession.subscription as string,
                    stripe_customer_id: checkoutSession.customer as string,
                    status: SubscriptionStatus.ACTIVE,
                    plan_name: checkoutSession.metadata?.plan_name as string,
                    customer_id: customer.id,
                  },
                });
              }

              await ga.trackEvent(
                'purchase',
                checkoutSession?.metadata?.ga_client_id ?? 'unknown',
                {
                  transaction_id: checkoutSession.subscription,
                  value: (checkoutSession.amount_total ?? 0) / 100,
                  currency: checkoutSession.currency?.toUpperCase(),
                },
              );

              /**
               * Update most recent card (payment method) as
               * default payment method.
               * Prevent error from breaking.
               */
              try {
                const stripe = await getStripeInstance();
                const { data } = await stripe.paymentMethods.list({
                  customer: checkoutSession.customer as string,
                  type: 'card',
                });
                if (data.length > 0) {
                  await stripe.customers.update(
                    checkoutSession.customer as string,
                    {
                      invoice_settings: {
                        default_payment_method: data[0].id,
                      },
                    },
                  );
                }
              } catch (error) {
                Sentry.captureException(error);
              }
            }
            console.info(
              `Processed webhook: type=${event.type} customer=${customer.id}`,
            );
            return { status: 200, message: 'OK' };
          }
          case 'payment': {
            invariant(
              checkoutSession.metadata?.payment_type,
              '[Stripe Webhook] Missing metadata: payment_type.',
            );

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                invariant(
                  checkoutSession.metadata?.invoice_id,
                  '[Stripe Webhook] Missing metadata: invoice_id.',
                );

                const { invoice_id, invoice_number, user_id } =
                  checkoutSession.metadata;
                await prisma.invoice.update({
                  where: {
                    id: invoice_id,
                  },
                  data: {
                    payment_status: InvoicePaymentStatus.PROCESSING,
                  },
                });
                console.info(
                  `Processed webhook: type=${event.type} user_id=${user_id} invoice_id=${invoice_id} invoice_number=${invoice_number}`,
                );
                break;
              }
              case StripeWebhookPaymentType.MILESTONE: {
                invariant(
                  checkoutSession?.metadata?.milestone_id,
                  '[Stripe Webhook] Missing metadata: milestone_id.',
                );

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!,
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(
                    `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`,
                  );
                  return {
                    status: 200,
                    message: `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`,
                  };
                }

                const { quote_id, milestone_id } = checkoutSession.metadata;
                const milestone = await prisma.milestone.update({
                  where: {
                    id: milestone_id,
                  },
                  data: {
                    payment_status: MilestonePaymentStatus.PROCESSING,
                  },
                });

                await biotechInvoiceService.createBiotechInvoice(
                  {
                    milestone,
                    biotech_id: customer?.biotech_id as string,
                    payViaStripe: true,
                  },
                  { prisma },
                );

                console.info(
                  `Processed webhook: type=${event.type} customer=${customer.id} quote=${quote_id} milestone=${milestone_id}`,
                );
                break;
              }
              default: {
                return { status: 200, message: 'Unhandled payment type' };
              }
            }
            return { status: 200, message: 'OK' };
          }
          case 'setup': {
            return { status: 200, message: 'Payment method setup complete' };
          }
          default: {
            return { status: 200, message: 'Unhandled checkout mode.' };
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
            invariant(
              checkoutSession?.metadata?.payment_type,
              '[Stripe Webhook] Missing metadata: payment_type.',
            );

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                invariant(
                  checkoutSession?.metadata?.invoice_id,
                  '[Stripe Webhook] Missing metadata: invoice_id.',
                );

                const { invoice_id, invoice_number, user_id } =
                  checkoutSession.metadata;
                const invoice = await prisma.invoice.update({
                  where: {
                    id: invoice_id,
                  },
                  data: {
                    payment_status: InvoicePaymentStatus.PAID,
                    paid_at: new Date(),
                  },
                });
                const buttonUrl = `${app_env.APP_URL}/app/invoices/${invoice.id}`;
                const invoiceMonth = moment(invoice.from_date).format(
                  'MMM YYYY',
                );
                const receivers = await prisma.vendorMember.findMany({
                  where: {
                    vendor_company_id: invoice.vendor_company_id,
                    role: {
                      in: [
                        CompanyCollaboratorRoleType.OWNER,
                        CompanyCollaboratorRoleType.ADMIN,
                      ],
                    },
                    user: {
                      OR: [
                        { deactivated_at: null },
                        {
                          deactivated_at: {
                            gt: new Date(),
                          },
                        },
                      ],
                    },
                  },
                  include: {
                    user: true,
                  },
                });

                await Promise.all(
                  receivers.map(async (receiver) => {
                    await sendInvoicePaymentNoticeEmail(
                      {
                        button_url: buttonUrl,
                        invoice_month: invoiceMonth,
                        payment_status: 'successful',
                      },
                      receiver.user.email,
                    );

                    await createInvoicePaymentNotification({
                      invoice_id: invoice.id,
                      invoice_month: invoiceMonth,
                      recipient_id: receiver.user_id,
                      payment_status: 'successful',
                    });
                  }),
                );

                console.info(
                  `Processed webhook: type=${event.type} user_id=${user_id} invoice_id=${invoice_id} invoice_number=${invoice_number}`,
                );
                break;
              }
              case StripeWebhookPaymentType.MILESTONE: {
                invariant(
                  checkoutSession?.metadata?.milestone_id,
                  '[Stripe Webhook] Missing metadata: milestone_id.',
                );

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!,
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(
                    `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`,
                  );
                  return {
                    status: 200,
                    message: `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`,
                  };
                }
                const { quote_id, milestone_id } = checkoutSession.metadata;
                await milestoneService.updateMilestoneAsPaid(
                  {
                    milestone_id,
                    user_id: customer.user_id,
                  },
                  { prisma },
                );
                console.info(
                  `Processed webhook: type=${event.type} customer=${customer.id} quote=${quote_id} milestone=${milestone_id}`,
                );
                break;
              }
              default: {
                return { status: 200, message: 'Unhandled payment type' };
              }
            }
            return { status: 200, message: 'OK' };
          }
          default: {
            return { status: 200, message: 'Unhandled checkout mode' };
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
            invariant(
              checkoutSession?.metadata?.payment_type,
              '[Stripe Webhook] Missing metadata: payment_type.',
            );

            switch (checkoutSession?.metadata?.payment_type) {
              case StripeWebhookPaymentType.INVOICE: {
                invariant(
                  checkoutSession?.metadata?.invoice_id,
                  '[Stripe Webhook] Missing metadata: invoice_id.',
                );

                const { invoice_id, invoice_number, user_id } =
                  checkoutSession.metadata;
                const invoice = await prisma.invoice.update({
                  where: {
                    id: invoice_id,
                  },
                  data: {
                    payment_status: InvoicePaymentStatus.FAILED,
                  },
                });
                const buttonUrl = `${app_env.APP_URL}/app/invoices/${invoice.id}`;
                const invoiceMonth = moment(invoice.from_date).format(
                  'MMM YYYY',
                );
                const receivers = await prisma.vendorMember.findMany({
                  where: {
                    vendor_company_id: invoice.vendor_company_id,
                    role: {
                      in: [
                        CompanyCollaboratorRoleType.OWNER,
                        CompanyCollaboratorRoleType.ADMIN,
                      ],
                    },
                    user: {
                      OR: [
                        { deactivated_at: null },
                        {
                          deactivated_at: {
                            gt: new Date(),
                          },
                        },
                      ],
                    },
                  },
                  include: {
                    user: true,
                  },
                });

                await Promise.all(
                  receivers.map(async (receiver) => {
                    await sendInvoicePaymentNoticeEmail(
                      {
                        button_url: buttonUrl,
                        invoice_month: invoiceMonth,
                        payment_status: 'failed',
                      },
                      receiver.user.email,
                    );

                    await createInvoicePaymentNotification({
                      invoice_id: invoice.id,
                      invoice_month: invoiceMonth,
                      recipient_id: receiver.user_id,
                      payment_status: 'failed',
                    });
                  }),
                );
                console.info(
                  `Processed webhook: type=${event.type} user_id=${user_id} invoice_id=${invoice_id} invoice_number=${invoice_number}`,
                );
                break;
              }
              case StripeWebhookPaymentType.MILESTONE: {
                invariant(
                  checkoutSession?.metadata?.milestone_id,
                  '[Stripe Webhook] Missing metadata: milestone_id.',
                );

                const customer = await prisma.customer.findFirst({
                  where: {
                    id: checkoutSession.client_reference_id!,
                  },
                });

                if (!customer) {
                  // This can happen in because stripe sends webhooks for both staging and production traffic.
                  console.info(
                    `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`,
                  );
                  return {
                    status: 200,
                    message: `Skipped webhook: reason=customer_not_found type=${event.type} customer=${checkoutSession.client_reference_id}`,
                  };
                }

                const { quote_id, milestone_id } = checkoutSession.metadata;
                await prisma.milestone.update({
                  where: {
                    id: milestone_id,
                  },
                  data: {
                    payment_status: MilestonePaymentStatus.UNPAID,
                  },
                });

                const milestone = await prisma.milestone.findFirstOrThrow({
                  where: {
                    id: milestone_id,
                  },
                  include: {
                    quote: {
                      include: {
                        project_connection: {
                          include: {
                            customer_connections: true,
                            project_request: true,
                          },
                        },
                      },
                    },
                  },
                });

                const receivers = await prisma.user.findMany({
                  where: {
                    customer: {
                      id: {
                        in: milestone.quote.project_connection.customer_connections.map(
                          (cc) => cc.customer_id,
                        ),
                      },
                    },
                    OR: [
                      { deactivated_at: null },
                      {
                        deactivated_at: {
                          gt: new Date(),
                        },
                      },
                    ],
                  },
                });

                const milestoneUpdateContent = `Payment failed for the following milestone: ${milestone.title}. Please ensure that your payment details are up to date and retry the payment to proceed with the transaction.`;
                await Promise.all(
                  receivers.map(async (receiver) => {
                    await sendMilestoneNoticeEmail(
                      {
                        sender_name: 'Cromatic Admin',
                        project_title:
                          milestone.quote.project_connection.project_request
                            .title,
                        receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
                        milestone_update_content: milestoneUpdateContent,
                        milestone_url: `${app_env.APP_URL}/app/project-connection/${milestone.quote.project_connection_id}/quote/${milestone.quote.id}`,
                      },
                      receiver.email,
                    );

                    await createMilestonePaymentFailedNotification(
                      milestone.quote_id,
                      milestoneUpdateContent,
                      receiver.id,
                      milestone.quote.project_connection_id,
                    );
                  }),
                );
                console.info(
                  `Processed webhook: type=${event.type} customer=${customer.id} quote=${quote_id} milestone=${milestone_id}`,
                );
                break;
              }
              default: {
                return { status: 200, message: 'Unhandled payment type' };
              }
            }
            return { status: 200, message: 'OK' };
          }
          default: {
            return { status: 200, message: 'Unhandled checkout mode' };
          }
        }
      }

      case 'customer.subscription.updated': {
        const { items, customer, cancel_at, status } = event.data
          .object as Stripe.Subscription;
        /**
         * Default cancel at date to null to handle remove ended_at value
         * when customer resume the subscription.
         */
        const cancelAtDate = cancel_at ? moment.unix(cancel_at).toDate() : null;
        const stripeCustomerId = customer as string;

        const subItem = items.data.find((i) => !!i.plan);
        invariant(subItem, '[Stripe Webhook] Missing subscription item.');
        const { plan } = subItem;
        const stripe = await getStripeInstance();
        const product = await stripe.products.retrieve(plan.product as string);

        const { account_type, plan_name } = product.metadata;
        const subscription = await prisma.subscription.findFirst({
          where: {
            stripe_customer_id: stripeCustomerId,
          },
          include: {
            biotech: {
              include: {
                customers: {
                  where: {
                    role: CompanyCollaboratorRoleType.OWNER,
                  },
                },
              },
            },
          },
        });

        const customerSubscription =
          await prisma.customerSubscription.findFirst({
            where: {
              stripe_customer_id: stripeCustomerId,
            },
          });

        if (subscription === null && customerSubscription === null) {
          return {
            status: 200,
            message: 'Skipped webhook: reason=subscription_not_found',
          };
        }

        /**
         * Move legacy customer's subscription to customer_subscriptions table.
         * This logic can be safely remove if all customer has been migrated.
         */
        const isUpgradingLegacyCustomer =
          customerSubscription === null &&
          !!subscription &&
          [
            CustomerSubscriptionPlanName.SOURCING_PLAN,
            CustomerSubscriptionPlanName.WHITE_GLOVE_PLAN,
          ].includes(plan_name as CustomerSubscriptionPlanName);
        if (isUpgradingLegacyCustomer) {
          const firstOwner = subscription.biotech.customers[0];
          await prisma.$transaction(async (trx) => {
            await trx.customerSubscription.create({
              data: {
                plan_name,
                status,
                stripe_customer_id: subscription.stripe_customer_id,
                stripe_subscription_id: subscription.stripe_subscription_id,
                customer_id: firstOwner.id,
              },
            });
            await trx.subscription.delete({
              where: {
                id: subscription.id,
              },
            });
          });
        } else {
          if (customerSubscription) {
            invariant(plan_name, 'Missing metadata: plan_name.');
            await prisma.customerSubscription.update({
              where: {
                id: customerSubscription.id,
              },
              data: {
                plan_name,
                ended_at: cancelAtDate,
                status,
              },
            });
          }

          if (subscription) {
            invariant(account_type, 'Missing metadata: account_type.');
            await prisma.biotech.update({
              where: {
                id: subscription.biotech_id,
              },
              data: {
                account_type,
                subscriptions: {
                  update: {
                    where: {
                      id: subscription.id,
                    },
                    data: {
                      ended_at: cancelAtDate,
                      status,
                    },
                  },
                },
              },
            });
          }
        }

        return { status: 200, message: 'OK' };
      }

      case 'customer.subscription.deleted': {
        const { status, customer, cancel_at } = event.data
          .object as Stripe.Subscription;
        const stripeCustomerId = customer as string;

        const customerSubscription =
          await prisma.customerSubscription.findFirst({
            where: {
              stripe_customer_id: stripeCustomerId,
            },
          });

        if (customerSubscription) {
          await prisma.customerSubscription.update({
            where: {
              id: customerSubscription.id,
            },
            data: {
              status,
              ...(cancel_at ? { ended_at: new Date(cancel_at) } : undefined),
            },
          });
        }

        const biotechSubscription = await prisma.subscription.findFirst({
          where: {
            stripe_customer_id: stripeCustomerId,
          },
        });

        if (biotechSubscription) {
          await prisma.subscription.update({
            where: {
              id: biotechSubscription.id,
            },
            data: {
              status,
              ...(cancel_at ? { ended_at: new Date(cancel_at) } : undefined),
            },
          });
        }

        return { status: 200, message: 'OK' };
      }

      case 'payout.paid':
      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout;
        invariant(
          payout?.metadata?.milestone_id,
          '[Stripe Webhook] Missing metadata: milestone_id.',
        );

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
            vendor_payment_status:
              payout.status === 'paid'
                ? MilestonePaymentStatus.PAID
                : MilestonePaymentStatus.UNPAID,
          },
        });

        // TODO notify admin payout if failed

        return { status: 200, message: 'OK' };
      }

      case 'setup_intent.succeeded': {
        const setupIntent = event.data.object as Stripe.SetupIntent;

        const { customer, payment_method } = setupIntent;

        // Set default payment method.
        if (customer && typeof customer === 'string') {
          const stripe = await getStripeInstance();

          await stripe.customers.update(customer as string, {
            invoice_settings: {
              default_payment_method: payment_method as string,
            },
          });
        } else {
          Sentry.captureMessage('Stripe webhook: Missing customer.');
        }

        return { status: 200, message: 'OK' };
      }
      default: {
        console.warn(`Unhandled webhook: event type=${event.type}`);
        return { status: 200, message: 'Unhandled Event Type' };
      }
    }
  } catch (error) {
    Sentry.captureException(error);
    let message = 'Process Stripe event failed.';
    if (error instanceof Error) {
      message = error.message;
    }
    return { status: 200, message };
  }
};
