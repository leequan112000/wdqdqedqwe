import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { toCent, toDollar } from "../../helper/money";
import { checkAllowCustomerOnlyPermission } from "../../helper/accessControl";
import { BlanketPurchaseOrderTransactionType, CasbinObj } from "../../helper/constant";
import { CasbinAct } from "../../helper/constant";
import { hasPermission } from "../../helper/casbin";
import invariant from "../../helper/invariant";
import { PermissionDeniedError } from "../errors/PermissionDeniedError";

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
    balance_amount: async (parent, _, context) => {
      invariant(parent.id, 'Blanket Puchase Order ID not found.')
      const blanketPurchaseOrderTransactions = await context.prisma.blanketPurchaseOrderTransaction.findMany({
        where: {
          blanket_purchase_order_id: parent.id
        },
      });

      const remainingBalance = blanketPurchaseOrderTransactions.reduce((balance, transaction) => {
        if (transaction.transaction_type === BlanketPurchaseOrderTransactionType.CREDIT) {
          return balance + transaction.amount.toNumber();
        } else if (transaction.transaction_type === BlanketPurchaseOrderTransactionType.DEBIT) {
          return balance - transaction.amount.toNumber();
        }
        return balance;
      }, toCent(parent.amount || 0));

      return toDollar(remainingBalance);
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
  },
  Mutation: {
    createBlanketPurchaseOrder: async (_, args, context) => {
      const { po_number, name, amount } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Missing current user id.');

      await checkAllowCustomerOnlyPermission(context);
      const allowCreatePurchaseOrder = await hasPermission(currentUserId, CasbinObj.PURCHASE_ORDER, CasbinAct.WRITE);
      invariant(allowCreatePurchaseOrder, new PermissionDeniedError());

      return await blanketPurchaseOrderService.createBlanketPurchaseOrder({
        po_number,
        name,
        amount,
        current_user_id: currentUserId,
      }, context);
    },
  }
};

export default resolvers;
