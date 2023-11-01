import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { toDollar } from "../../helper/money";
import { checkAllowCustomerOnlyPermission } from "../../helper/accessControl";
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
  Query: {
    blanketPurchaseOrders: async (_, __, context) => {
      await checkAllowCustomerOnlyPermission(context);

      const currentCustomer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id
        },
      });

      const blanketPurchaseOrders = await context.prisma.blanketPurchaseOrder.findMany({
        where: {
          biotech_id: currentCustomer?.biotech_id
        }
      });

      return blanketPurchaseOrders.map((bpo) => ({
        ...bpo,
        amount: toDollar(bpo.amount.toNumber()),
      }))
    },
  }
};

export default resolvers;
