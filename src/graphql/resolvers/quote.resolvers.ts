import { toCent, toDollar } from "../../helper/money";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { PublicError } from "../errors/PublicError";
import { MilestonePaymentStatus, MilestoneStatus, QuoteStatus, SubscriptionStatus } from "../../helper/constant";
import { getStripeInstance } from "../../helper/stripe";
import shortUUID from "short-uuid";

function generateQuoteShortId() {
  return `qt_${shortUUID.generate()}`;
}

function generateMilestoneShortId() {
  return `ms_${shortUUID.generate()}`;
}

const resolvers: Resolvers<Context> = {
  Quote: {
    milestones: async (parent, _, context) => {
      if (parent.milestones) {
        return parent.milestones;
      }

      if (!parent.id) {
        throw new InternalError('Missing quote ID');
      }

      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
        orderBy: {
          created_at: 'asc',
        },
      });

      return milestones
        .map((m) => ({
          ...m,
          amount: toDollar(m.amount.toNumber()),
        }));
    },
    project_connection: async (parent, _, context) => {
      if (!parent.project_connection_id) {
        throw new InternalError("Project connection id not found.");
      }
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id,
        },
      });
    },
  },
  Query: {
    quote: async (_, args, context) => {
      const { project_connection_id, id } = args;
      const quote = await context.prisma.quote.findFirst({
        where: {
          ...(project_connection_id ? { project_connection_id } : {}),
          ...(id ? { id } : {}),
        }
      });

      return quote
        ? {
          ...quote,
          amount: toDollar(quote.amount.toNumber())
        }
        : {};
    },
  },
  Mutation: {
    createQuote: async (_, args, context) => {
      const { amount, project_connection_id, milestones, send_to_biotech = false } = args

      return await context.prisma.$transaction(async (trx) => {
        const newQuote = await trx.quote.create({
          data: {
            amount: toCent(amount),
            status: send_to_biotech ? QuoteStatus.PENDING_DECISION : QuoteStatus.DRAFT,
            project_connection_id,
            short_id: generateQuoteShortId(),
          },
        });

        let newMilestones;
        if (milestones && milestones.length > 0) {
          const tasks = milestones.map(async (m) => {
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
              }
            })
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
      })
    },
    updateQuote: async (_, args, context) => {
      const { id, amount, milestones, send_to_biotech } = args;

      return await context.prisma.$transaction(async (trx) => {
        const updatedQuote = await trx.quote.update({
          data: {
            amount: toCent(amount),
            ...(send_to_biotech ? { status: QuoteStatus.PENDING_DECISION } : {})
          },
          where: {
            id,
          },
          include: {
            milestones: true,
          },
        });

        const newMilestones = milestones.filter((m) => !m.id);
        const updateMilestones = milestones.filter((m) => !!m.id)
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
              amount: toCent(um.amount),
              description: um.description,
              timeline: um.timeline,
            },
            where: {
              id: um.id!
            },
          });
        })

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
            created_at: 'asc',
          },
        })

        return {
          ...quote,
          amount: toDollar(quote!.amount.toNumber()),
          milestones: (latestMilestones || []).map((m) => ({
            ...m,
            amount: toDollar(m.amount.toNumber()),
          })),
        };
      })
    },
    acceptQuote: async (_, args, context) => {
      const { id } = args
      const updatedQuote = await context.prisma.quote.update({
        where: {
          id,
        },
        data: {
          status: QuoteStatus.ACCEPTED,
        },
      });

      return {
        ...updatedQuote,
        amount: updatedQuote.amount.toNumber(),
      }
    },
    declineQuote: async (_, args, context) => {
      const { id } = args
      const updatedQuote = await context.prisma.quote.update({
        where: {
          id,
        },
        data: {
          status: QuoteStatus.DECLINED,
        },
      });

      return {
        ...updatedQuote,
        amount: updatedQuote.amount.toNumber(),
      }
    },
  }
}

export default resolvers;
