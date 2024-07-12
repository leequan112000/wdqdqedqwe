import moment from 'moment';
import { nanoid } from 'nanoid';
import { app_env } from '../../environment';
import { ServiceContext } from '../../types/context';
import {
  MilestonePaymentStatus,
  MilestoneStatus,
  QuoteNotificationActionContent,
  QuoteStatus,
} from '../../helper/constant';
import { toCent, toDollar } from '../../helper/money';
import { sendQuoteNoticeEmail } from '../../mailer/quote';
import createQuoteNotification from '../../notification/quoteNotification';
import { getReceiversByProjectConnection } from '../../queues/utils';

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
    const { receivers, projectConnection, senderCompanyName } =
      await getReceiversByProjectConnection(
        project_connection_id,
        current_user_id,
      );

    console.log({ receivers, projectConnection });
    await Promise.all(
      receivers.map(async (receiver) => {
        await sendQuoteNoticeEmail(
          {
            sender_name: senderCompanyName,
            project_title: projectConnection.project_request.title,
            receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
            action: QuoteNotificationActionContent.SUBMITTED,
            quotation_url: `${app_env.APP_URL}/app/project-connection/${project_connection_id}/quote/${newQuote.id}`,
          },
          receiver.email,
        );

        await createQuoteNotification(
          current_user_id,
          senderCompanyName,
          newQuote.id,
          QuoteNotificationActionContent.SUBMITTED,
          receiver.id,
          projectConnection.id,
        );
      }),
    );
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
