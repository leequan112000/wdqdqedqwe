import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { toDollar } from "../../helper/money";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  InvoiceItem: {
    invoice: async (parent, _, context) => {
      invariant(parent.invoice_id, 'Invoice ID not found.');
      return await context.prisma.invoice.findFirst({
        where: {
          id: parent.invoice_id,
        },
      });
    },
    milestone: async (parent, _, context) => {
      invariant(parent.milestone_id, 'Milestone ID not found.')
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
