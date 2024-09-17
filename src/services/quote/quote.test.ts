import { expect, test, vi, beforeEach, describe } from 'vitest';
import { faker } from '@faker-js/faker';
import {
  CustomerConnection,
  Milestone,
  Prisma,
  ProjectConnection,
  ProjectRequest,
  Quote,
  User,
  VendorMemberConnection,
} from '@prisma/client';
import { ServiceContext } from '../../types/context';
import { MockContext, createMockContext } from '../../testContext';
import quoteService, { CreateQuoteArgs } from './quote.service';
import {
  MilestonePaymentStatus,
  MilestoneStatus,
  QuoteStatus,
} from '../../helper/constant';
import { toDollar } from '../../helper/money';
import * as quoteNotificationModule from '../../notification/quoteNotification';
import * as quoteMailerModule from '../../mailer/quote';
import * as utils from '../../queues/utils';
import { PrismaClientMainDb } from '../../prisma';
import { mockDeep } from 'vitest-mock-extended';

vi.mock('@sendgrid/mail');
vi.mock('../../env.ts');

let mockCtx: MockContext;
let ctx: ServiceContext;
let projectRequest: ProjectRequest;
let vendorMemberConnection: VendorMemberConnection;
let projectConnection: ProjectConnection & {
  customer_connections: CustomerConnection[];
  vendor_member_connections: VendorMemberConnection[];
  project_request: ProjectRequest;
};
let user: User;

describe('quote.service', () => {
  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as ServiceContext;
    user = {
      id: faker.string.uuid(),
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      encrypted_password: null,
      reset_password_token: null,
      reset_password_expiration: null,
      reset_password_sent_at: null,
      remember_created_at: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
      phone_number: null,
      country_code: null,
      deactivated_at: null,
    };
    projectRequest = {
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      vendor_requirement: faker.lorem.sentence(),
      objective_description: faker.lorem.sentence(),
      preparation_description: faker.lorem.sentence(),
      in_contact_with_vendor: faker.datatype.boolean(),
      existing_vendor_contact_description: faker.lorem.sentence(),
      project_challenge_description: faker.lorem.sentence(),
      vendor_search_timeframe: faker.string.sample(),
      max_budget: new Prisma.Decimal(
        faker.datatype.number({ min: 1000, max: 50000 }),
      ),
      vendor_location_requirement: faker.address.countryCode(),
      project_start_time_requirement: faker.date.future().toISOString(),
      project_deadline_requirement: faker.date.future().toISOString(),
      status: 'OPEN',
      created_at: new Date(),
      updated_at: new Date(),
      initial_assigned_at: null,
      is_private: faker.datatype.boolean(),
      biotech_id: faker.string.uuid(),
      customer_id: faker.string.uuid(),
      sourcing_session_id: null,
    };
    vendorMemberConnection = {
      id: faker.string.uuid(),
      vendor_member_id: faker.string.uuid(),
      project_connection_id: faker.string.uuid(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    projectConnection = {
      id: faker.string.uuid(),
      project_request_id: faker.string.uuid(),
      vendor_status: 'ACCEPTED',
      vendor_company_id: faker.string.uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      final_contract_uploaded_at: null,
      expired_at: null,
      biotech_invite_vendor_id: null,
      customer_connections: [],
      vendor_member_connections: [vendorMemberConnection],
      project_request: projectRequest,
    };
  });

  describe('createQuote', () => {
    test('should create new quote without sending notification', async () => {
      const sendQuoteNoticeEmailSpy = vi
        .spyOn(quoteMailerModule, 'sendQuoteNoticeEmail')
        .mockResolvedValue();

      const createQuoteNotificationSpy = vi
        .spyOn(quoteNotificationModule, 'default')
        .mockResolvedValue();
      const createQuoteInput: CreateQuoteArgs = {
        amount: faker.datatype.number({ min: 500, max: 10000 }),
        milestones: [
          {
            amount: faker.datatype.number({ min: 500, max: 5000 }),
            title: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            timeline: faker.string.sample(),
          },
        ],
        project_connection_id: projectConnection.id,
        send_to_biotech: false,
        current_user_id: faker.string.uuid(),
      };

      const newQuote: Quote = {
        id: faker.string.uuid(),
        amount: new Prisma.Decimal(createQuoteInput.amount),
        created_at: new Date(),
        updated_at: new Date(),
        expired_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        project_connection_id: createQuoteInput.project_connection_id,
        short_id: `qt_${faker.string.uuid().slice(0, 10)}`,
        status: QuoteStatus.DRAFT,
      };

      const newMilestone: Milestone = {
        id: faker.string.uuid(),
        amount: new Prisma.Decimal(createQuoteInput.milestones[0].amount),
        created_at: new Date(),
        updated_at: new Date(),
        description: faker.lorem.sentence(),
        ordinal: 0,
        payment_status: MilestonePaymentStatus.UNPAID,
        quote_id: newQuote.id,
        short_id: `ms_${faker.string.uuid().slice(0, 10)}`,
        status: MilestoneStatus.NOT_STARTED,
        timeline: faker.lorem.sentence(),
        title: createQuoteInput.milestones[0].title,
        vendor_payment_status: MilestonePaymentStatus.UNPAID,
      };

      mockCtx.prisma.quote.create.mockResolvedValueOnce(newQuote);
      mockCtx.prisma.milestone.create.mockResolvedValueOnce(newMilestone);
      mockCtx.prisma.$transaction.mockResolvedValueOnce([
        newQuote,
        newMilestone,
      ]);
      const { milestones, ...rest } = await quoteService.createQuote(
        createQuoteInput,
        ctx,
      );

      /**
       * Test quote and milestones array separately to prevent
       * 'Compared values have no visual difference with jest' error.
       */
      expect(milestones).toEqual([
        {
          ...newMilestone,
          amount: toDollar(newMilestone.amount.toNumber()),
        },
      ]);
      expect(rest).toEqual({
        ...newQuote,
        amount: toDollar(newQuote.amount.toNumber()),
      });
      expect(sendQuoteNoticeEmailSpy).not.toHaveBeenCalled();
      expect(createQuoteNotificationSpy).not.toHaveBeenCalled();
    });

    test('should create new quote and send notification', async () => {
      const sendQuoteNoticeEmailSpy = vi
        .spyOn(quoteMailerModule, 'sendQuoteNoticeEmail')
        .mockResolvedValue();

      const createQuoteNotificationSpy = vi
        .spyOn(quoteNotificationModule, 'default')
        .mockResolvedValue();

      const createQuoteInput: CreateQuoteArgs = {
        amount: faker.datatype.number({ min: 500, max: 10000 }),
        milestones: [
          {
            amount: faker.datatype.number({ min: 500, max: 5000 }),
            title: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            timeline: faker.string.sample(),
          },
        ],
        project_connection_id: projectConnection.id,
        send_to_biotech: true,
        current_user_id: faker.string.uuid(),
      };

      const newQuote: Quote = {
        id: faker.string.uuid(),
        amount: new Prisma.Decimal(createQuoteInput.amount),
        created_at: new Date(),
        updated_at: new Date(),
        expired_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        project_connection_id: createQuoteInput.project_connection_id,
        short_id: `qt_${faker.string.uuid().slice(0, 10)}`,
        status: QuoteStatus.DRAFT,
      };

      const newMilestone: Milestone = {
        id: faker.string.uuid(),
        amount: new Prisma.Decimal(createQuoteInput.milestones[0].amount),
        created_at: new Date(),
        updated_at: new Date(),
        description: faker.lorem.sentence(),
        ordinal: 0,
        payment_status: MilestonePaymentStatus.UNPAID,
        quote_id: newQuote.id,
        short_id: `ms_${faker.string.uuid().slice(0, 10)}`,
        status: MilestoneStatus.NOT_STARTED,
        timeline: faker.lorem.sentence(),
        title: createQuoteInput.milestones[0].title,
        vendor_payment_status: MilestonePaymentStatus.UNPAID,
      };

      mockCtx.prisma.quote.create.mockResolvedValueOnce(newQuote);
      mockCtx.prisma.milestone.create.mockResolvedValueOnce(newMilestone);
      mockCtx.prisma.$transaction.mockResolvedValueOnce([
        newQuote,
        newMilestone,
      ]);

      vi.spyOn(utils, 'getReceiversByProjectConnection').mockResolvedValue({
        projectConnection,
        receivers: [user],
        senderCompanyName: 'company',
      });
      const { milestones, ...rest } = await quoteService.createQuote(
        createQuoteInput,
        ctx,
      );

      /**
       * Test quote and milestones array separately to prevent
       * 'Compared values have no visual difference with jest' error
       */
      expect(milestones).toEqual([
        {
          ...newMilestone,
          amount: toDollar(newMilestone.amount.toNumber()),
        },
      ]);
      expect(rest).toEqual({
        ...newQuote,
        amount: toDollar(newQuote.amount.toNumber()),
      });

      expect(sendQuoteNoticeEmailSpy).toHaveBeenCalled();
      expect(createQuoteNotificationSpy).toHaveBeenCalled();
    });
  });
});
