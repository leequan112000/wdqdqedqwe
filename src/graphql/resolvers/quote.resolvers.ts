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
        amount: m.amount.toNumber(),
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

      return quote || {};
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
  }
}

export default resolvers;
