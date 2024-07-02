import moment from 'moment';
import { nanoid } from 'nanoid';
import { toCent, toDollar } from '../../helper/money';
import { Resolvers } from '../generated';
import { Context } from '../../types/context';
import { app_env } from '../../environment';
import {
  MilestonePaymentStatus,
  MilestoneStatus,
  QuoteNotificationActionContent,
  QuoteStatus,
} from '../../helper/constant';
import invariant from '../../helper/invariant';
import { PublicError } from '../errors/PublicError';
import { QuoteNotFoundError } from '../errors/QuoteNotFoundError';
import { getReceiversByProjectConnection } from '../../queues/utils';
import { sendQuoteNoticeEmail } from '../../mailer/quote';
import createQuoteNotification from '../../notification/quoteNotification';

const EXPIRY_DAYS = 7;

function generateQuoteShortId() {
  return `qt_${nanoid(10)}`;
}

function generateMilestoneShortId() {
  return `ms_${nanoid(10)}`;
}

const resolvers: Resolvers<Context> = {
  Quote: {
    milestones: async (parent, _, context) => {
      if (parent.milestones) {
        return parent.milestones;
      }

      invariant(parent.id, 'Quote id not found.');

      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
        orderBy: {
          ordinal: 'asc',
        },
      });

      return milestones.map((m) => ({
        ...m,
        amount: toDollar(m.amount.toNumber()),
      }));
    },
    project_connection: async (parent, _, context) => {
      invariant(
        parent.project_connection_id,
        'Project connection id not found.',
      );
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id,
        },
      });
    },
    total_amount: async (parent, _, context) => {
      invariant(parent.id, 'Quote id not found.');
      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
      });

      const totalAmount = milestones.reduce((acc, cur) => {
        return acc + cur.amount.toNumber();
      }, 0);

      return toDollar(totalAmount);
    },
    total_in_escrow: async (parent, _, context) => {
      invariant(parent.id, 'Quote id not found.');
      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
      });

      // Customer's payments are processing or paid, but not yet pay to vendor.
      const amountInEscrow = milestones.reduce((acc, cur) => {
        if (
          [MilestonePaymentStatus.PAID].includes(
            cur.payment_status as MilestonePaymentStatus,
          ) &&
          [
            MilestonePaymentStatus.UNPAID,
            MilestonePaymentStatus.PROCESSING,
          ].includes(cur.vendor_payment_status as MilestonePaymentStatus)
        ) {
          return acc + cur.amount.toNumber();
        }
        return acc;
      }, 0);

      return toDollar(amountInEscrow);
    },
    total_payment: async (parent, _, context) => {
      invariant(parent.id, 'Quote id not found.');
      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
      });

      const amountPaid = milestones.reduce((acc, cur) => {
        if (cur.payment_status === MilestonePaymentStatus.PAID) {
          return acc + cur.amount.toNumber();
        }
        return acc;
      }, 0);

      return toDollar(amountPaid);
    },
    total_milestones_paid: async (parent, _, context) => {
      invariant(parent.id, 'Quote id not found.');
      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
      });

      const amountPaid = milestones.reduce((acc, cur) => {
        if (cur.vendor_payment_status === MilestonePaymentStatus.PAID) {
          return acc + cur.amount.toNumber();
        }
        return acc;
      }, 0);

      return toDollar(amountPaid);
    },
    status: async (parentQuote, _, context) => {
      const now = new Date();
      if (parentQuote.expired_at && parentQuote.status) {
        if (
          parentQuote.status === QuoteStatus.PENDING_DECISION &&
          now >= new Date(parentQuote.expired_at)
        ) {
          return QuoteStatus.EXPIRED;
        }
      }

      invariant(parentQuote.id, 'Quote id not found.');
      const milestones =
        (await context.prisma.quote
          .findUnique({
            where: {
              id: parentQuote.id,
            },
          })
          .milestones()) || [];

      const completedMilestones = milestones.filter(
        (m) => m.status === MilestoneStatus.COMPLETED,
      );

      if (completedMilestones.length === milestones.length) {
        return QuoteStatus.COMPLETED;
      }

      if (parentQuote.status) {
        return parentQuote.status;
      }
      return null;
    },
    quote_review: async (parent, _, context) => {
      const quoteId = parent.id;
      invariant(quoteId, 'Quote id not found.');
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');

      const review = await context.prisma.review.findFirst({
        where: {
          quote_review: {
            quote_id: quoteId,
          },
          user_id: currentUserId,
        },
        include: {
          review_answers: true,
        },
      });

      return review;
    },
  },
  Query: {
    quote: async (_, args, context) => {
      const { project_connection_id, id } = args;
      const quote = await context.prisma.quote.findFirst({
        where: {
          ...(project_connection_id ? { project_connection_id } : {}),
          ...(id ? { id } : {}),
        },
      });

      invariant(quote, new QuoteNotFoundError());

      return {
        ...quote,
        amount: toDollar(quote.amount.toNumber()),
      };
    },
  },
  Mutation: {
    createQuote: async (_, args, context) => {
      const {
        amount,
        project_connection_id,
        milestones,
        send_to_biotech = false,
      } = args;

      const newQuote = await context.prisma.$transaction(async (trx) => {
        const expiryDate = moment().endOf('d').add(EXPIRY_DAYS, 'd');
        const newQuote = await trx.quote.create({
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
            return await trx.milestone.create({
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

        return {
          ...newQuote,
          amount: toDollar(newQuote.amount.toNumber()),
          milestones: (newMilestones || []).map((m) => ({
            ...m,
            amount: toDollar(m.amount.toNumber()),
          })),
        };
      });

      if (send_to_biotech) {
        const { receivers, projectConnection, senderCompanyName } =
          await getReceiversByProjectConnection(
            project_connection_id,
            context.req.user_id!,
          );

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
              context.req.user_id!,
              senderCompanyName,
              newQuote.id,
              QuoteNotificationActionContent.SUBMITTED,
              receiver.id,
              projectConnection.id,
            );
          }),
        );
      }

      return newQuote;
    },
    updateQuote: async (_, args, context) => {
      const { id, amount, milestones, send_to_biotech } = args;

      const updatedQuote = await context.prisma.$transaction(async (trx) => {
        const expiryDate = moment().endOf('d').add(EXPIRY_DAYS, 'd');
        const updatedQuote = await trx.quote.update({
          data: {
            amount: toCent(amount),
            ...(send_to_biotech
              ? {
                  status: QuoteStatus.PENDING_DECISION,
                  expired_at: expiryDate.toDate(),
                }
              : {}),
          },
          where: {
            id,
          },
          include: {
            milestones: true,
          },
        });

        const newMilestones = milestones.filter((m) => !m.id);
        const updateMilestones = milestones.filter((m) => !!m.id);
        const removedMilestones = updatedQuote.milestones
          // Find milestones which are not in the existing milestones list for removal.
          .filter((el) => {
            return !updateMilestones.some((f) => {
              return f.id === el.id;
            });
          });

        const updateMilestoneTasks = updateMilestones.map(async (um) => {
          return await trx.milestone.update({
            data: {
              title: um.title,
              amount: toCent(um.amount),
              description: um.description,
              timeline: um.timeline,
              ordinal: milestones.findIndex((m) => m === um) || 0,
            },
            where: {
              id: um.id!,
            },
          });
        });

        await Promise.all(updateMilestoneTasks);

        const createMilestoneTasks = newMilestones.map(async (nm) => {
          return await trx.milestone.create({
            data: {
              amount: toCent(nm.amount),
              title: nm.title,
              description: nm.description,
              timeline: nm.timeline,
              quote_id: updatedQuote.id,
              status: MilestoneStatus.NOT_STARTED,
              payment_status: MilestonePaymentStatus.UNPAID,
              vendor_payment_status: MilestonePaymentStatus.UNPAID,
              short_id: generateMilestoneShortId(),
              ordinal: milestones.findIndex((m) => m === nm) || 0,
            },
          });
        });

        await Promise.all(createMilestoneTasks);

        const deleteMilestoneTasks = removedMilestones.map(async (rm) => {
          return await trx.milestone.delete({
            where: {
              id: rm.id!,
            },
          });
        });

        await Promise.all(deleteMilestoneTasks);

        const quote = await trx.quote.findFirst({
          where: {
            id: updatedQuote.id,
          },
        });

        const latestMilestones = await trx.milestone.findMany({
          where: {
            quote_id: quote?.id,
          },
          orderBy: {
            ordinal: 'asc',
          },
        });

        return {
          ...quote,
          amount: toDollar(quote!.amount.toNumber()),
          milestones: (latestMilestones || []).map((m) => ({
            ...m,
            amount: toDollar(m.amount.toNumber()),
          })),
        };
      });

      if (send_to_biotech) {
        const { receivers, projectConnection, senderCompanyName } =
          await getReceiversByProjectConnection(
            updatedQuote.project_connection_id!,
            context.req.user_id!,
          );

        await Promise.all(
          receivers.map(async (receiver) => {
            await sendQuoteNoticeEmail(
              {
                sender_name: senderCompanyName,
                project_title: projectConnection.project_request.title,
                receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
                action: QuoteNotificationActionContent.SUBMITTED,
                quotation_url: `${app_env.APP_URL}/app/project-connection/${updatedQuote.project_connection_id}/quote/${id}`,
              },
              receiver.email,
            );

            await createQuoteNotification(
              context.req.user_id!,
              senderCompanyName,
              id,
              QuoteNotificationActionContent.SUBMITTED,
              receiver.id,
              projectConnection.id,
            );
          }),
        );
      }

      return updatedQuote;
    },
    acceptQuote: async (_, args, context) => {
      const { id } = args;
      const now = new Date();

      const quote = await context.prisma.quote.findFirst({
        where: {
          id,
        },
      });
      invariant(quote, 'Quote not found.');

      if (quote.expired_at && now >= quote.expired_at) {
        throw new PublicError('The quote is expired.');
      }

      const updatedQuote = await context.prisma.quote.update({
        where: {
          id,
        },
        data: {
          status: QuoteStatus.ACCEPTED,
        },
      });
      const { receivers, projectConnection, senderCompanyName } =
        await getReceiversByProjectConnection(
          updatedQuote.project_connection_id!,
          context.req.user_id!,
        );

      await Promise.all(
        receivers.map(async (receiver) => {
          await sendQuoteNoticeEmail(
            {
              sender_name: senderCompanyName,
              project_title: projectConnection.project_request.title,
              receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
              action: QuoteNotificationActionContent.ACCEPTED,
              quotation_url: `${app_env.APP_URL}/app/project-connection/${updatedQuote.project_connection_id}/quote/${id}`,
            },
            receiver.email,
          );

          await createQuoteNotification(
            context.req.user_id!,
            senderCompanyName,
            id,
            QuoteNotificationActionContent.ACCEPTED,
            receiver.id,
            projectConnection.id,
          );
        }),
      );
      return {
        ...updatedQuote,
        amount: updatedQuote.amount.toNumber(),
      };
    },
    declineQuote: async (_, args, context) => {
      const { id } = args;
      const now = new Date();

      const quote = await context.prisma.quote.findFirst({
        where: {
          id,
        },
      });
      invariant(quote, 'Quote not found.');

      if (quote.expired_at && now >= quote.expired_at) {
        throw new PublicError('The quote is expired.');
      }

      const updatedQuote = await context.prisma.quote.update({
        where: {
          id,
        },
        data: {
          status: QuoteStatus.DECLINED,
        },
      });
      const { receivers, projectConnection, senderCompanyName } =
        await getReceiversByProjectConnection(
          updatedQuote.project_connection_id!,
          context.req.user_id!,
        );

      await Promise.all(
        receivers.map(async (receiver) => {
          await sendQuoteNoticeEmail(
            {
              sender_name: senderCompanyName,
              project_title: projectConnection.project_request.title,
              receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
              action: QuoteNotificationActionContent.DECLINED,
              quotation_url: `${app_env.APP_URL}/app/project-connection/${updatedQuote.project_connection_id}/quote/${id}`,
            },
            receiver.email,
          );

          await createQuoteNotification(
            context.req.user_id!,
            senderCompanyName,
            id,
            QuoteNotificationActionContent.DECLINED,
            receiver.id,
            projectConnection.id,
          );
        }),
      );
      return {
        ...updatedQuote,
        amount: updatedQuote.amount.toNumber(),
      };
    },
    resendExpiredQuote: async (_, args, context) => {
      const { id } = args;

      const expiryDate = moment().endOf('d').add(EXPIRY_DAYS, 'd');

      const updatedQuote = await context.prisma.quote.update({
        where: {
          id,
        },
        data: {
          expired_at: expiryDate.toDate(),
        },
      });

      // TODO: email

      return {
        ...updatedQuote,
        amount: updatedQuote.amount.toNumber(),
      };
    },
  },
};

export default resolvers;
