import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { toDollar } from "../../helper/money";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  BlanketPurchaseOrderTransaction: {
    blanket_purchase_order: async (parent, _, context) => {
      invariant(parent.blanket_purchase_order_id, 'Blanket Puchase Order ID not found.');
      const blanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.findFirst({
        where: {
          id: parent.blanket_purchase_order_id,
        },
      });

      return blanketPurchaseOrder ? { ...blanketPurchaseOrder, amount: toDollar(blanketPurchaseOrder.amount.toNumber()) } : null;
    },
    biotech_invoice: async (parent, _, context) => {
      invariant(parent.biotech_invoice_id, 'Invoice ID not found.');
      return await context.prisma.biotechInvoice.findFirst({
        where: {
          id: parent.biotech_invoice_id,
        },
      });
    },
    user: async (parent, _, context) => {
      invariant(parent.user_id, 'User ID not found.');
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id,
        },
      });
    },
  },
};

export default resolvers;
