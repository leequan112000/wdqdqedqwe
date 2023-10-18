import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { toDollar } from "../../helper/money";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  BlanketPurchaseOrder: {
    biotech: async (parent, _, context) => {
      invariant(parent.biotech_id, 'Biotech ID not found.');
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id,
        },
      });
    },
    blanket_purchase_order_transactions: async (parent, _, context) => {
      invariant(parent.id, 'Blanket Puchase Order ID not found.')
      const blanketPurchaseOrderTransactions = await context.prisma.blanketPurchaseOrderTransaction.findMany({
        where: {
          blanket_purchase_order_id: parent.id,
        },
      });

      return blanketPurchaseOrderTransactions.map((blanketPurchaseOrderTransaction) => {
        return {
          ...blanketPurchaseOrderTransaction,
          amount: toDollar(blanketPurchaseOrderTransaction.amount.toNumber()),
        }
      });
    },
  },
};

export default resolvers;
