import { Biotech, BiotechInvoice, BiotechInvoiceItem, Customer, Invoice, Milestone, Prisma, ProjectConnection, Quote, User, CustomerSubscription } from '@prisma/client';
import { expect, test, vi, beforeEach, describe, afterEach } from 'vitest';
import Stripe from 'stripe';
import { MockContext, createMockContext } from '../../../testContext';
import { ServiceContext } from '../../../types/context';
import {
  checkoutSessionCompleted,

  checkoutSessionAsyncPaymentSucceeded,
  checkoutSessionAsyncPaymentFailed,

  customerSubscriptionUpdated,
  customerSubscriptionUpdatedWithCancelAt,
  customerSubscriptionDeleted,

} from './stripe-mock-data/stripeMockData';
import { processStripeEvent } from './stripe';
import { prisma } from '../../../__mocks__/prisma';
import stripe from '../../../helper/__mocks__/stripe';
import {
  createInvoicePaymentNoticeEmailJob,
  createSendUserMilestoneNoticeJob,
  createSendUserMilestonePaymentFailedNoticeJob
} from '../../../queues/email.queues';
import {
  InvoicePaymentStatus, MilestonePaymentStatus, MilestoneStatus, ProjectConnectionVendorStatus, QuoteStatus
} from '../../../helper/constant';
import { bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail } from '../../../mailer/biotechInvoice';
import { NotificationJob, createNotificationQueueJob } from '../../../queues/notification.queues';

vi.mock('../../../prisma.ts');

vi.mock('../../../services/biotechInvoice/biotechInvoice.service');

vi.mock('@sendgrid/mail');

vi.mock('../../../queues/email.queues.ts', () => ({
  createInvoicePaymentNoticeEmailJob: vi.fn(),
  createSendUserMilestoneNoticeJob: vi.fn(),
  createSendUserMilestonePaymentFailedNoticeJob: vi.fn(),
}));

vi.mock('../../../mailer/biotechInvoice.ts', () => ({
  bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail: vi.fn(),
}));

vi.mock('../../../queues/notification.queues.ts', () => ({
  createNotificationQueueJob: vi.fn(),
}));

vi.mock('../../../helper/stripe.ts', () => ({
  getStripeInstance: () => stripe,
}));

const API_VERSION = "2022-08-01";

let mockCtx: MockContext;
let ctx: ServiceContext;
let customer: Customer;
let customerSubscription: CustomerSubscription;
let biotech: Biotech;
let invoice: Invoice;
let quote: Quote;
let milestone: Milestone;
let projectConnection: ProjectConnection;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as ServiceContext;
  customer = {
    biotech_id: 'uuid',
    created_at: new Date(),
    has_setup_profile: true,
    id: 'uuid',
    job_title: 'Software Engineer',
    team: 'Cromatic',
    updated_at: new Date(),
    user_id: 'uuid',
    role: 'user',
  };

  customerSubscription = {
    id: 'uuid',
    created_at: new Date(),
    customer_id: 'uuid',
    ended_at: null,
    updated_at: new Date(),
    plan_name: 'sourcing_plan',
    status: 'active',
    stripe_subscription_id: checkoutSessionCompleted.data.object.subscription,
    stripe_customer_id: checkoutSessionCompleted.data.object.customer,
  }

  biotech = {
    id: 'uuid',
    name: 'Biotech Name',
    about: 'Description',
    account_type: 'standard',
    address: '97 Willow St, Redwood City, CA 94063, USA',
    address1: '97',
    address2: 'Willow Street',
    city: 'Redwood City',
    country: 'United States',
    state: 'CA',
    zipcode: '94063',
    cda_pandadoc_file_id: null,
    biotech_extra_info: null,
    cda_pandadoc_signer: null,
    cda_signed_at: null,
    created_at: new Date(),
    facebook_url: null,
    founded_year: null,
    has_setup_profile: true,
    legal_name: 'Legal Name',
    linkedin_url: null,
    skip_cda: false,
    team_size: '1-10',
    twitter_url: null,
    updated_at: new Date(),
    upload_limit: 1000000,
    website: 'www.cromatic.bio',
  };

  invoice = {
    id: 'uuid',
    created_at: new Date(),
    updated_at: new Date(),
    commission_rate: 5,
    due_at: new Date(),
    from_date: new Date(),
    invoice_number: 'invoice-number',
    paid_at: null,
    payment_status: 'status',
    stripe_txn_id: 'stripe_id',
    to_date: new Date(),
    vendor_company_id: 'uuid',
  };

  quote = {
    id: 'uuid',
    amount: new Prisma.Decimal(1000),
    created_at: new Date(),
    expired_at: new Date(),
    project_connection_id: 'uuid',
    short_id: 'uuid',
    status: QuoteStatus.ACCEPTED,
    updated_at: new Date(),
  }

  milestone = {
    id: 'uuid',
    amount: new Prisma.Decimal(1000),
    created_at: new Date(),
    description: 'Description',
    ordinal: 0,
    payment_status: MilestonePaymentStatus.UNPAID,
    quote_id: 'uuid',
    short_id: 'short_uuid',
    status: MilestoneStatus.NOT_STARTED,
    timeline: '1 month',
    title: 'Title',
    updated_at: new Date(),
    vendor_payment_status: MilestonePaymentStatus.UNPAID,
  };

  projectConnection = {
    id: 'uuid',
    created_at: new Date(),
    expired_at: new Date(),
    updated_at: new Date(),
    final_contract_uploaded_at: null,
    project_request_id: 'uuid',
    vendor_company_id: 'uuid',
    vendor_status: ProjectConnectionVendorStatus.ACCEPTED,
    biotech_invite_vendor_id: null,
  };
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('process stripe event', () => {
  describe('checkout.session.completed', () => {
    describe('mode: payment, type: milestone', () => {
      test('should skip webhook and return 200', async () => {
        const event = checkoutSessionCompleted as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'milestone';
        prisma.customer.findFirst.mockResolvedValue(null);

        const result = await processStripeEvent(event);

        expect(result.status).toEqual(200);
        expect(result.message).contain('Skipped');
      });

      test('should return 200 & OK', async () => {
        const event = checkoutSessionCompleted as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'milestone';
        prisma.customer.findFirst.mockResolvedValue(customer);

        const result = await processStripeEvent(event);

        expect(result.status).toEqual(200);
        expect(result.message).contain('OK');
      });
    });

    describe('mode: payment, type: invoice', () => {
      test('should return 200 & OK', async () => {
        const event = checkoutSessionCompleted as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'invoice';
        (event.data.object as Stripe.Checkout.Session).metadata!.invoice_id = 'uuid';
        prisma.customer.findFirst.mockResolvedValue(customer);

        const result = await processStripeEvent(event);

        expect(result.status).toEqual(200);
        expect(result.message).contain('OK');
      });
      test('should return 400, missing invoice_id', async () => {
        const event = checkoutSessionCompleted as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'invoice';
        delete (event.data.object as Stripe.Checkout.Session).metadata?.invoice_id;
        prisma.customer.findFirst.mockResolvedValue(customer);

        const result = await processStripeEvent(event);

        expect(result.status).toEqual(400);
        expect(result.message).contain('Webhook Signed Error');
      });
    });

    describe('mode: subscription', () => {
      test('should skip webhook and return 200', async () => {
        const event = checkoutSessionCompleted as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'subscription';
        prisma.customer.findFirst.mockResolvedValue(null);

        const result = await processStripeEvent(event);

        expect(result.status).toEqual(200);
        expect(result.message).contain('Skipped');
      });

      test('should create subscription and return 200', async () => {
        const event = checkoutSessionCompleted as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'subscription';
        prisma.customer.findFirst.mockResolvedValue({
          ...customer,
          customer_subscriptions: [],
        } as Customer & {
          customer_subscriptions: CustomerSubscription[];
        });


        const result = await processStripeEvent(event);
        expect(prisma.customerSubscription.create).toBeCalled();
        expect(result.status).toEqual(200);
        expect(result.message).contain('OK');
      });

      test('should update subscription and return 200', async () => {
        const event = checkoutSessionCompleted as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'subscription';
        prisma.customer.findFirst.mockResolvedValue({
          ...customer,
          customer_subscriptions: [customerSubscription],
        } as Customer & {
          customer_subscriptions: CustomerSubscription[];
        });


        const result = await processStripeEvent(event);
        expect(prisma.customerSubscription.update).toBeCalled();
        expect(result.status).toEqual(200);
        expect(result.message).contain('OK');
      });
    });
  });

  describe('checkout.session.async_payment_succeed', () => {
    describe('mode: setup', () => {
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentSucceeded as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'setup';

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(200);
        expect(message).toEqual('OK');
      })
    });
    describe('mode: subscription', () => {
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentSucceeded as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'subscription';

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(200);
        expect(message).toEqual('OK');
      })
    });
    describe('mode: payment, type: invoice', () => {
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentSucceeded as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'invoice';
        (event.data.object as Stripe.Checkout.Session).metadata!.invoice_id = 'uuid';

        prisma.invoice.update.mockResolvedValue(invoice);
        vi.mocked(createInvoicePaymentNoticeEmailJob).mockImplementation(() => true);

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(200);
        expect(message).toEqual('OK');
        expect(createInvoicePaymentNoticeEmailJob).toBeCalled();
      })
    });
    describe('mode: payment, type: milestone', () => {
      test('should skip and return 200', async () => {
        const event = checkoutSessionAsyncPaymentSucceeded as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'milestone';

        prisma.customer.findFirst.mockResolvedValue(null);

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(200);
        expect(message).contain('Skipped');
      });
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentSucceeded as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'milestone';
        (event.data.object as Stripe.Checkout.Session).metadata!.milestone_id = 'uuid';
        (event.data.object as Stripe.Checkout.Session).metadata!.quote_id = 'uuid';

        prisma.customer.findFirst.mockResolvedValue(customer);
        prisma.milestone.update.mockResolvedValue({
          ...milestone,
          quote: {
            ...quote,
            project_connection: projectConnection,
          },
        } as Milestone & {
          quote: Quote & {
            project_connection: ProjectConnection;
          };
        });

        prisma.biotechInvoiceItem.findFirst.mockResolvedValue({
          id: 'uuid',
          name: 'Item Name',
          amount: new Prisma.Decimal(1000),
          biotech_invoice_id: 'uuid',
          milestone_id: 'uuid',
        });

        prisma.biotechInvoice.update.mockResolvedValue({
          id: 'uuid',
          invoice_number: 'binv_uuid',
          biotech_id: 'uuid',
          payment_status: 'paid',
          due_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          paid_at: new Date(),
          stripe_txn_id: null,
          reference_id: 'uuid',
          biotech_invoice_items: [],
          biotech,
        } as BiotechInvoice & {
          biotech_invoice_items: BiotechInvoiceItem[];
          biotech: Biotech;
        });

        prisma.customer.findMany.mockResolvedValue([{
          ...customer,
          user: {
            id: 'uuid',
            email: 'user@cromatic.bio',
            first_name: 'Cromatic',
            last_name: 'User',
            encrypted_password: 'password',
            reset_password_token: null,
            reset_password_expiration: null,
            reset_password_sent_at: null,
            remember_created_at: null,
            created_at: new Date(),
            updated_at: new Date(),
            is_active: true,
          }
        } as Customer & {
          user: User;
        }]);

        vi.mocked(bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail).mockImplementation(() => Promise.resolve());
        vi.mocked(createNotificationQueueJob);
        vi.mocked(createSendUserMilestoneNoticeJob).mockImplementation(() => true);

        const { message, status } = await processStripeEvent(event);

        expect(message).contain('OK');
        expect(status).toEqual(200);
        expect(prisma.milestone.update).toBeCalledWith({
          where: {
            id: 'uuid',
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
            status: MilestoneStatus.IN_PROGRESS,
          },
        });
        expect(createSendUserMilestoneNoticeJob).toBeCalled();
      });
    });
    describe('mode: payment, type: unhandled', () => {
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentSucceeded as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'unhandled';
        (event.data.object as Stripe.Checkout.Session).metadata!.invoice_id = 'uuid';

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(400);
        expect(message).contain('Unhandled');
      })
    });
  });

  describe('checkout.session.async_payment_failed', () => {
    describe('mode: setup', () => {
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentFailed as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'setup';

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(200);
        expect(message).toEqual('OK');
      });
    });
    describe('mode: subscription', () => {
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentFailed as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'subscription';

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(200);
        expect(message).toEqual('OK');
      })
    });
    describe('mode: payment, type: invoice', () => {
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentFailed as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'invoice';
        (event.data.object as Stripe.Checkout.Session).metadata!.invoice_id = 'uuid';
        (event.data.object as Stripe.Checkout.Session).metadata!.invoice_number = 'uuid';
        (event.data.object as Stripe.Checkout.Session).metadata!.user_id = 'uuid';

        prisma.invoice.update.mockResolvedValue(invoice);
        vi.mocked(createInvoicePaymentNoticeEmailJob).mockImplementation(() => true);

        const { message, status } = await processStripeEvent(event);

        expect(prisma.invoice.update).toBeCalledWith({
          where: {
            id: 'uuid',
          },
          data: {
            payment_status: InvoicePaymentStatus.FAILED,
          },
        });
        expect(status).toEqual(200);
        expect(message).toEqual('OK');
        expect(createInvoicePaymentNoticeEmailJob).toBeCalled();
      })
    });
    describe('mode: payment, type: milestone', () => {
      test('should skip and return 200', async () => {
        const event = checkoutSessionAsyncPaymentFailed as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'milestone';

        prisma.customer.findFirst.mockResolvedValue(null);

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(200);
        expect(message).contain('Skipped');
      });
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentFailed as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'milestone';
        (event.data.object as Stripe.Checkout.Session).metadata!.milestone_id = 'uuid';
        (event.data.object as Stripe.Checkout.Session).metadata!.quote_id = 'uuid';

        prisma.customer.findFirst.mockResolvedValue(customer);
        vi.mocked(createSendUserMilestonePaymentFailedNoticeJob).mockImplementation(() => true);

        const { message, status } = await processStripeEvent(event);

        expect(message).contain('OK');
        expect(status).toEqual(200);
        expect(prisma.milestone.update).toBeCalledWith({
          where: {
            id: 'uuid',
          },
          data: {
            payment_status: MilestonePaymentStatus.UNPAID,
          },
        });
        expect(createSendUserMilestonePaymentFailedNoticeJob).toBeCalled();
      });
    });
    describe('mode: payment, type: unhandled', () => {
      test('should return 200', async () => {
        const event = checkoutSessionAsyncPaymentFailed as Stripe.Event;
        (event.data.object as Stripe.Checkout.Session).mode = 'payment';
        (event.data.object as Stripe.Checkout.Session).metadata!.payment_type = 'unhandled';
        (event.data.object as Stripe.Checkout.Session).metadata!.invoice_id = 'uuid';

        const { message, status } = await processStripeEvent(event);

        expect(status).toEqual(400);
        expect(message).contain('Unhandled');
      })
    });
  });

  describe('customer.subscription.updated (legacy flow)', () => {
    test('should return 200', async () => {
      const event = customerSubscriptionUpdated as Stripe.Event;

      stripe.products.retrieve.mockResolvedValueOnce({
        id: "prod_NortzQ6i7n9Xnw",
        object: "product",
        active: true,
        created: 1683014531,
        default_price: null,
        description: "(created by Stripe CLI)",
        images: [],
        livemode: false,
        metadata: {
          account_type: 'sourcerer',
          plan_name: 'sourcerer'
        },
        name: "myproduct",
        package_dimensions: null,
        shippable: null,
        statement_descriptor: null,
        tax_code: null,
        unit_label: null,
        updated: 1683014531,
        url: null,
        lastResponse: {
          headers: {},
          requestId: 'string',
          statusCode: 200,
        },
        attributes: [],
        type: 'good',
      });

      prisma.subscription.findFirst.mockResolvedValue({
        id: 'uuid',
        biotech_id: 'uuid',
        created_at: new Date(),
        ended_at: new Date(),
        status: 'active',
        stripe_customer_id: 'uuid',
        stripe_subscription_id: 'uuid',
        updated_at: new Date(),
      });

      const { message, status } = await processStripeEvent(event);

      expect(prisma.biotech.update).toBeCalledWith({
        where: {
          id: 'uuid',
        },
        data: {
          account_type: 'sourcerer',
          subscriptions: {
            update: {
              where: {
                id: 'uuid',
              },
              data: {
                ended_at: null,
                status: 'active',
              },
            },
          },
        },
      });
      expect(message).toEqual('OK');
      expect(status).toEqual(200);
    });
  });

  describe('customer.subscription.updated (current flow)', () => {
    test('should return 200', async () => {
      const event = customerSubscriptionUpdated as Stripe.Event;

      stripe.products.retrieve.mockResolvedValueOnce({
        id: "prod_NortzQ6i7n9Xnw",
        object: "product",
        active: true,
        created: 1683014531,
        default_price: null,
        description: "(created by Stripe CLI)",
        images: [],
        livemode: false,
        metadata: {
          account_type: 'sourcerer',
          plan_name: 'sourcerer'
        },
        name: "myproduct",
        package_dimensions: null,
        shippable: null,
        statement_descriptor: null,
        tax_code: null,
        unit_label: null,
        updated: 1683014531,
        url: null,
        lastResponse: {
          headers: {},
          requestId: 'string',
          statusCode: 200,
        },
        attributes: [],
        type: 'good',
      });

      prisma.customerSubscription.findFirst.mockResolvedValue({
        id: 'uuid',
        customer_id: 'uuid',
        created_at: new Date(),
        ended_at: new Date(),
        status: 'active',
        stripe_customer_id: 'uuid',
        stripe_subscription_id: 'uuid',
        updated_at: new Date(),
        plan_name: 'sourcerer',
      });

      const { message, status } = await processStripeEvent(event);

      expect(prisma.customerSubscription.update).toBeCalledWith({
        where: {
          id: 'uuid',
        },
        data: {
          plan_name: 'sourcerer',
          ended_at: null,
          status: 'active',
        },
      });
      expect(message).toEqual('OK');
      expect(status).toEqual(200);
    });
  });

  describe('customer.subscription.updated (cancel flow)', () => {
    test('should return 200', async () => {
      const event = customerSubscriptionUpdatedWithCancelAt as any;

      stripe.products.retrieve.mockResolvedValueOnce({
        id: "prod_NortzQ6i7n9Xnw",
        object: "product",
        active: true,
        created: 1683014531,
        default_price: null,
        description: "(created by Stripe CLI)",
        images: [],
        livemode: false,
        metadata: {
          account_type: 'sourcerer',
          plan_name: 'sourcerer'
        },
        name: "myproduct",
        package_dimensions: null,
        shippable: null,
        statement_descriptor: null,
        tax_code: null,
        unit_label: null,
        updated: 1683014531,
        url: null,
        lastResponse: {
          headers: {},
          requestId: 'string',
          statusCode: 200,
        },
        attributes: [],
        type: 'good',
      });

      prisma.customerSubscription.findFirst.mockResolvedValue({
        id: 'uuid',
        customer_id: 'uuid',
        created_at: new Date(),
        ended_at: new Date(),
        status: 'active',
        stripe_customer_id: 'uuid',
        stripe_subscription_id: 'uuid',
        updated_at: new Date(),
        plan_name: 'sourcerer',
      });

      const { message, status } = await processStripeEvent(event);

      expect(prisma.customerSubscription.update).toBeCalledWith({
        where: {
          id: 'uuid',
        },
        data: {
          plan_name: 'sourcerer',
          ended_at: new Date(event.data.object.cancel_at * 1000),
          status: 'canceled',
        },
      });
      expect(message).toEqual('OK');
      expect(status).toEqual(200);
    });
  });

  describe('customer.subscription.deleted', () => {
    describe('subscription deleted with cancel_at', () => {
      test('should return 200', async () => {
        const event = customerSubscriptionDeleted as Stripe.Event;
        const subscriptionObj = event.data.object as Stripe.Subscription;
        subscriptionObj.cancel_at = new Date().getTime();

        prisma.subscription.findFirst.mockResolvedValue({
          id: 'uuid',
          biotech_id: 'uuid',
          created_at: new Date(),
          ended_at: new Date(),
          status: 'active',
          stripe_customer_id: 'uuid',
          stripe_subscription_id: 'uuid',
          updated_at: new Date(),
        });

        const { message, status } = await processStripeEvent(event);

        expect(prisma.subscription.update).toBeCalledWith({
          where: {
            id: 'uuid',
          },
          data: {
            status: subscriptionObj.status,
            ended_at: new Date(subscriptionObj.cancel_at),
          },
        });
        expect(message).toEqual('OK');
        expect(status).toEqual(200);
      });
    });
    describe('subscription deleted without cancel_at', () => {
      test('should return 200', async () => {
        const event = customerSubscriptionDeleted as Stripe.Event;
        const subscriptionObj = event.data.object as Stripe.Subscription;
        subscriptionObj.cancel_at = null;

        prisma.subscription.findFirst.mockResolvedValue({
          id: 'uuid',
          biotech_id: 'uuid',
          created_at: new Date(),
          ended_at: new Date(),
          status: 'active',
          stripe_customer_id: 'uuid',
          stripe_subscription_id: 'uuid',
          updated_at: new Date(),
        });

        const { message, status } = await processStripeEvent(event);

        expect(prisma.subscription.update).toBeCalledWith({
          where: {
            id: 'uuid',
          },
          data: {
            status: subscriptionObj.status,
          },
        });
        expect(message).toEqual('OK');
        expect(status).toEqual(200);
      });
    });
  });
});
