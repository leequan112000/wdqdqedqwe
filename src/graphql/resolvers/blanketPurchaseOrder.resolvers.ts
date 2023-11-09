import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { toDollar } from "../../helper/money";
import { checkAllowCustomerOnlyPermission } from "../../helper/accessControl";
import invariant from "../../helper/invariant";

import blanketPurchaseOrderService from "../../services/blanketPurchaseOrder/blanketPurchaseOrder.service";

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
        },
        orderBy: {
          created_at: 'desc'
        },
      });

      return blanketPurchaseOrders.map((bpo) => ({
        ...bpo,
        balance_amount: toDollar(bpo.balance_amount.toNumber()),
        amount: toDollar(bpo.amount.toNumber()),
      }))
    },
  },
  Mutation: {
    createBlanketPurchaseOrder: async (_, args, context) => {
      const { po_number, name, amount } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Missing current user id.');
      await checkAllowCustomerOnlyPermission(context);

      return await context.prisma.$transaction(async (trx) => {
        return await blanketPurchaseOrderService.createBlanketPurchaseOrder({
          po_number,
          name,
          amount,
          current_user_id: currentUserId,
        }, { prisma: trx });
      });
    },
    updateBlanketPurchaseOrder: async (_, args, context) => {
      const { id, po_number, name, amount } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Missing current user id.');
      await checkAllowCustomerOnlyPermission(context);

      return await context.prisma.$transaction(async (trx) => {
        return await blanketPurchaseOrderService.updateBlanketPurchaseOrder({
          id,
          po_number,
          name,
          amount,
          current_user_id: currentUserId,
        }, { prisma: trx });
      });
    },
    removeBlanketPurchaseOrder: async (_, args, context) => {
      const { id } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Missing current user id.');
      await checkAllowCustomerOnlyPermission(context);

      return await context.prisma.$transaction(async (trx) => {
        return await blanketPurchaseOrderService.removeBlanketPurchaseOrder({
          id,
          current_user_id: currentUserId,
        }, { prisma: trx });
      });
    },
  }
};

export default resolvers;
