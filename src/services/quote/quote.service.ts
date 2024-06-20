import moment from 'moment';
import { nanoid } from 'nanoid';
import { ServiceContext } from '../../types/context';
import { toCent, toDollar } from '../../helper/money';
import {
  MilestonePaymentStatus,
  MilestoneStatus,
  QuoteNotificationActionContent,
  QuoteStatus,
} from '../../helper/constant';
import { createSendUserQuoteNoticeJob } from '../../queues/email.queues';

const EXPIRY_DAYS = 7;

function generateQuoteShortId() {
  return `qt_${nanoid(10)}`;
}

function generateMilestoneShortId() {
  return `ms_${nanoid(10)}`;
}

export type CreateQuoteArgs = {
  amount: number;
  send_to_biotech: boolean;
  project_connection_id: string;
  milestones: Array<{
    amount: number;
    title: string;
    description?: string;
    timeline?: string;
  }>;
  current_user_id: string;
};

export const createQuote = async (
  args: CreateQuoteArgs,
  context: ServiceContext,
) => {
  const {
    amount,
    milestones,
    project_connection_id,
    send_to_biotech,
    current_user_id,
  } = args;

  const expiryDate = moment().endOf('d').add(EXPIRY_DAYS, 'd');
  const newQuote = await context.prisma.quote.create({
    data: {
      amount: toCent(amount),
      status: send_to_biotech
        ? QuoteStatus.PENDING_DECISION
        : QuoteStatus.DRAFT,
      project_connection_id,
      short_id: generateQuoteShortId(),
      expired_at: send_to_biotech ? expiryDate.toDate() : null,
    },
  });

  let newMilestones;
  if (milestones && milestones.length > 0) {
    const tasks = milestones.map(async (m, i) => {
      return await context.prisma.milestone.create({
        data: {
          amount: toCent(m.amount),
          timeline: m.timeline,
          description: m.description,
          quote_id: newQuote.id,
          status: MilestoneStatus.NOT_STARTED,
          payment_status: MilestonePaymentStatus.UNPAID,
          vendor_payment_status: MilestonePaymentStatus.UNPAID,
          short_id: generateMilestoneShortId(),
          title: m.title,
          ordinal: i,
        },
      });
    });

    newMilestones = await Promise.all(tasks);
  }

  if (send_to_biotech) {
    createSendUserQuoteNoticeJob({
      projectConnectionId: project_connection_id,
      senderUserId: current_user_id,
      quoteId: newQuote.id,
      action: QuoteNotificationActionContent.SUBMITTED,
    });
  }

  return {
    ...newQuote,
    amount: toDollar(newQuote.amount.toNumber()),
    milestones: (newMilestones || []).map((m) => ({
      ...m,
      amount: toDollar(m.amount.toNumber()),
    })),
  };
};

const quoteService = {
  createQuote,
};

export default quoteService;
