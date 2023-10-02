import { ServiceContext } from '../../types/context';
import { MockContext, createMockContext } from '../../testContext';
import { expect, test, vi, beforeEach, describe } from 'vitest';
import quoteService, { CreateQuoteArgs } from './quote.service';
import { Milestone, Prisma, Quote } from '@prisma/client';
import { MilestonePaymentStatus, MilestoneStatus, QuoteStatus } from '../../helper/constant';
import { createSendUserQuoteNoticeJob } from '../../queues/email.queues';
import { toDollar } from '../../helper/money';

vi.mock('../../queues/email.queues.ts', () => ({
  createSendUserQuoteNoticeJob: vi.fn(),
}));

vi.mock('@sendgrid/mail');

let mockCtx: MockContext
let ctx: ServiceContext

describe('quote.service', () => {
  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as ServiceContext;
  });

  describe('createQuote', () => {
    test('should create new quote without sending notification', async () => {
      vi.mocked(createSendUserQuoteNoticeJob).mockImplementation(() => true);
      const createQuoteInput: CreateQuoteArgs = {
        amount: 1000.00,
        milestones: [
          {
            amount: 1000.00,
            title: 'Milestone 1',
            description: 'Milestone 1 description',
            timeline: '1 week',
          },
        ],
        project_connection_id: 'project-connection-123',
        send_to_biotech: false,
        current_user_id: 'uuid',
      };

      const newQuote: Quote = {
        id: 'uuid',
        amount: new Prisma.Decimal(1000),
        created_at: new Date(),
        updated_at: new Date(),
        expired_at: new Date(),
        project_connection_id: 'uuid',
        short_id: 'short_uuid',
        status: QuoteStatus.DRAFT,
      }

      const newMilestone: Milestone = {
        id: 'uuid',
        amount: new Prisma.Decimal(1000),
        created_at: new Date(),
        updated_at: new Date(),
        description: 'description',
        ordinal: 0,
        payment_status: MilestonePaymentStatus.UNPAID,
        quote_id: 'uuid',
        short_id: 'uuid',
        status: MilestoneStatus.NOT_STARTED,
        timeline: '1 week',
        title: 'title',
        vendor_payment_status: MilestonePaymentStatus.UNPAID,
      }

      mockCtx.prisma.quote.create.mockResolvedValueOnce(newQuote);
      mockCtx.prisma.milestone.create.mockResolvedValueOnce(newMilestone);

      const { milestones, ...rest } = await quoteService.createQuote(createQuoteInput, ctx);

      /**
       * Test quote and milestones array separately to prevent
       * 'Compared values have no visual difference with jest' error.
       */
      expect(milestones).toEqual([{
        ...newMilestone,
        amount: toDollar(newMilestone.amount.toNumber()),
      }]);
      expect(rest).toEqual({
        ...newQuote,
        amount: toDollar(newQuote.amount.toNumber()),
      });

      expect(createSendUserQuoteNoticeJob).not.toHaveBeenCalled();
    });

    test('should create new quote and send notification', async () => {
      vi.mocked(createSendUserQuoteNoticeJob).mockImplementation(() => true);
      const createQuoteInput: CreateQuoteArgs = {
        amount: 1000.00,
        milestones: [
          {
            amount: 1000.00,
            title: 'Milestone 1',
            description: 'Milestone 1 description',
            timeline: '1 week',
          },
        ],
        project_connection_id: 'project-connection-123',
        send_to_biotech: true,
        current_user_id: 'uuid',
      };

      const newQuote: Quote = {
        id: 'uuid',
        amount: new Prisma.Decimal(1000),
        created_at: new Date(),
        updated_at: new Date(),
        expired_at: new Date(),
        project_connection_id: 'uuid',
        short_id: 'short_uuid',
        status: QuoteStatus.DRAFT,
      }

      const newMilestone: Milestone = {
        id: 'uuid',
        amount: new Prisma.Decimal(1000),
        created_at: new Date(),
        updated_at: new Date(),
        description: 'description',
        ordinal: 0,
        payment_status: MilestonePaymentStatus.UNPAID,
        quote_id: 'uuid',
        short_id: 'uuid',
        status: MilestoneStatus.NOT_STARTED,
        timeline: '1 week',
        title: 'title',
        vendor_payment_status: MilestonePaymentStatus.UNPAID,
      }

      mockCtx.prisma.quote.create.mockResolvedValueOnce(newQuote);
      mockCtx.prisma.milestone.create.mockResolvedValueOnce(newMilestone);
      mockCtx.prisma.$transaction.mockImplementation((callback) => callback(mockCtx.prisma));

      const { milestones, ...rest } = await quoteService.createQuote(createQuoteInput, ctx);

      /**
       * Test quote and milestones array separately to prevent
       * 'Compared values have no visual difference with jest' error.
       */
      expect(milestones).toEqual([{
        ...newMilestone,
        amount: toDollar(newMilestone.amount.toNumber()),
      }]);
      expect(rest).toEqual({
        ...newQuote,
        amount: toDollar(newQuote.amount.toNumber()),
      });

      expect(createSendUserQuoteNoticeJob).toHaveBeenCalled();
    });
  });
});


