import { toCent, toDollar } from "../../helper/money";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { MilestonePaymentStatus, MilestoneStatus, QuoteStatus } from "../../helper/constant";
import { nanoid } from "nanoid";

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

      if (!parent.id) {
        throw new InternalError('Missing quote ID');
      }

      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
        orderBy: {
          ordinal: 'asc',
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
    total_amount: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Quote id not found');
      }
      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
      });

      const totalAmount = milestones.reduce((acc, cur) => {
        return acc + cur.amount.toNumber();
      }, 0)

      return toDollar(totalAmount)
    },
    total_in_escrow: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Quote id not found');
      }
      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
      });

      const amountInEscrow = milestones.reduce((acc, cur) => {
        if (cur.payment_status === MilestonePaymentStatus.PROCESSING && cur.vendor_payment_status === MilestonePaymentStatus.UNPAID) {
          return acc + cur.amount.toNumber();
        }
        return acc;
      }, 0)

      return toDollar(amountInEscrow)
    },
    total_payment: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Quote id not found');
      }
      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
      });

      const amountPaid = milestones.reduce((acc, cur) => {
        if ([MilestonePaymentStatus.PAID, MilestonePaymentStatus.PROCESSING].includes(cur.payment_status as MilestonePaymentStatus)) {
          return acc + cur.amount.toNumber();
        }
        return acc;
      }, 0)

      return toDollar(amountPaid)
    },
    total_milestones_paid: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Quote id not found');
      }
      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        },
      });

      const amountPaid = milestones.reduce((acc, cur) => {
        if ([MilestonePaymentStatus.PAID, MilestonePaymentStatus.PROCESSING].includes(cur.payment_status as MilestonePaymentStatus)) {
          return acc + cur.amount.toNumber();
        }
        return acc;
      }, 0)

      return toDollar(amountPaid)
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
                ordinal: i
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
              title: um.title,
              amount: toCent(um.amount),
              description: um.description,
              timeline: um.timeline,
              ordinal: milestones.findIndex((m) => m === um) || 0
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
              ordinal: milestones.findIndex((m) => m === nm) || 0
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
