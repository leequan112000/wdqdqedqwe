import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";

// TODO: better utilities for currecy
function toCent(num: number) {
  return num * 100;
}

function toDollar(cent: number) {
  return cent / 100;
}

const resolvers: Resolvers<Context> = {
  Quote: {
    milestones: async (parent, args, context) => {
      if (parent.milestones) {
        return parent.milestones;
      }

      if (!parent.id) {
        throw new InternalError('Missing quote ID');
      }

      const milestones = await context.prisma.milestone.findMany({
        where: {
          quote_id: parent.id,
        }
      });

      return milestones.map((m) => ({
        ...m,
        amount: toDollar(m.amount.toNumber()),
      }));
    }
  },
  Query: {
    quote: async (parent, args, context) => {
      const { project_connection_id } = args;
      const quote = await context.prisma.quote.findFirst({
        where: {
          project_connection_id,
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
    createQuote: async (parent, args, context) => {
      const { amount, project_connection_id, milestones } = args

      return await context.prisma.$transaction(async (trx) => {
        const newQuote = await trx.quote.create({
          data: {
            amount: toCent(amount),
            status: 'new',
            project_connection_id,
          },
        });

        let newMilestones;
        if (milestones && milestones.length > 0) {
          const tasks = milestones.map(async (m) => {
            return await trx.milestone.create({
              data: {
                amount: m.amount,
                due_at: m.due_at,
                description: m.description,
                status: 'pending',
                quote_id: newQuote.id,
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
    updateQuote: async (parent, args, context) => {
      const { id, amount, milestones } = args;

      return await context.prisma.$transaction(async (trx) => {
        const updatedQuote = await trx.quote.update({
          data: {
            amount: toCent(amount),
          },
          where: {
            id,
          },
          include: {
            milestones: true,
          },
        });

        const newMilestones = milestones.filter((m) => !m.id);
        const updateMilestons = milestones.filter((m) => !!m.id)
        const removedMilestones = updateMilestons
          .filter((el) => {
            return !updatedQuote.milestones.some((f) => {
              return f.id === el.id;
            });
          });

        const updateMilestoneTasks = updateMilestons.map(async (um) => {
          return await trx.milestone.update({
            data: {
              amount: toCent(um.amount),
              description: um.description,
              due_at: um.due_at,
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
              description: nm.description,
              status: 'draft',
              due_at: new Date(),
              quote_id: updatedQuote.id,
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
          include: {
            milestones: true,
          }
        })

        return {
          ...quote,
          amount: toDollar(quote!.amount.toNumber()),
          milestones: (quote!.milestones || []).map((m) => ({
            ...m,
            amount: toDollar(m.amount.toNumber()),
          })),
        };
      })
    }
  }
}

export default resolvers;
