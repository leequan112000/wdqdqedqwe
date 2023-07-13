import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { InternalError } from "../errors/InternalError";
import { toDollar } from "../../helper/money";

const resolvers: Resolvers<Context> = {
  InvoiceItem: {
    invoice: async (parent, _, context) => {
      if (!parent.invoice_id) {
        throw new InternalError('Invoice ID not found.');
      }
      return await context.prisma.invoice.findFirst({
        where: {
          id: parent.invoice_id,
        },
      });
    },
    milestone: async (parent, _, context) => {
      if (!parent.milestone_id) {
        throw new InternalError('Milestone ID not found.');
      }
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id: parent.milestone_id,
        },
      });
      return milestone ? { ...milestone, amount: toDollar(milestone.amount.toNumber()) } : null;
    },
  },
};

export default resolvers;
