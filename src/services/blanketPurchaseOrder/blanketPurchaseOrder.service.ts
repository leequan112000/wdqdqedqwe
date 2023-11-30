import { ServiceContext } from '../../types/context';
import { toCent, toDollar } from '../../helper/money';
import invariant from '../../helper/invariant';
import { hasPermission } from '../../helper/casbin';
import { BlanketPurchaseOrderTransactionType, CasbinAct, CasbinObj } from '../../helper/constant';
import { PermissionDeniedError } from '../../graphql/errors/PermissionDeniedError';
import { PublicError } from '../../graphql/errors/PublicError';

export type CreateBlanketPurchaseOrderArgs = {
  po_number: string;
  name: string;
  amount: number;
  current_user_id: string;
}

export const createBlanketPurchaseOrder = async (args: CreateBlanketPurchaseOrderArgs, context: ServiceContext) => {
  const { po_number, name, amount, current_user_id } = args;
  const allowCreatePurchaseOrder = await hasPermission(current_user_id, CasbinObj.PURCHASE_ORDER, CasbinAct.WRITE);
  invariant(allowCreatePurchaseOrder, new PermissionDeniedError());

  const customer = await context.prisma.customer.findFirstOrThrow({
    where: {
      user_id: current_user_id
    }
  });

  const existingBPO = await context.prisma.blanketPurchaseOrder.findFirst({
    where: {
      po_number,
      biotech_id: customer.biotech_id
    },
  });

  invariant(!existingBPO, new PublicError('A Blanket PO with the same PO number already exists.'));

  const blanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.create({
    data: {
      po_number,
      name,
      amount: toCent(amount),
      balance_amount: toCent(amount),
      biotech_id: customer.biotech_id,
    }
  });

  await context.prisma.blanketPurchaseOrderTransaction.create({
    data: {
      amount: toCent(amount),
      transaction_type: BlanketPurchaseOrderTransactionType.CREDIT,
      blanket_purchase_order_id: blanketPurchaseOrder.id,
      user_id: current_user_id,
    },
  });

  return ({
    ...blanketPurchaseOrder,
    balance_amount: toDollar(blanketPurchaseOrder.balance_amount.toNumber()),
    amount: toDollar(blanketPurchaseOrder.amount.toNumber()),
  });
}

export type CalculateBlanketPurchaseOrderBalanceAmountArgs = {
  id: string;
}

export const calculateBlanketPurchaseOrderBalanceAmount = async (args: CalculateBlanketPurchaseOrderBalanceAmountArgs, context: ServiceContext) => {
  const { id } = args;
  
  const blanketPurchaseOrderTransactions = await context.prisma.blanketPurchaseOrderTransaction.findMany({
    where: {
      blanket_purchase_order_id: id,
    }
  });

  const remainingBalance = blanketPurchaseOrderTransactions.reduce((balance, transaction) => {
    if (transaction.transaction_type === BlanketPurchaseOrderTransactionType.CREDIT) {
      return balance + transaction.amount.toNumber();
    }
    if (transaction.transaction_type === BlanketPurchaseOrderTransactionType.DEBIT) {
      return balance - transaction.amount.toNumber();
    }
    return balance;
  }, 0);

  return toDollar(remainingBalance);
}

export type UpdateBlanketPurchaseOrderArgs = {
  id: string;
  po_number: string;
  name: string;
  amount: number;
  current_user_id: string;
}

export const updateBlanketPurchaseOrder = async (args: UpdateBlanketPurchaseOrderArgs, context: ServiceContext) => {
  const { id, po_number, name, amount, current_user_id } = args;
  const allowEditPurchaseOrder = await hasPermission(current_user_id, CasbinObj.PURCHASE_ORDER, CasbinAct.WRITE);
  invariant(allowEditPurchaseOrder, new PermissionDeniedError());

  const blanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.findFirst({
    where: {
      id,
    },
    include: {
      blanket_purchase_order_transactions: true
    }
  });

  invariant(blanketPurchaseOrder, 'Blanket Pruchase Order not found.');

  const customer = await context.prisma.customer.findFirstOrThrow({
    where: {
      user_id: current_user_id
    }
  });

  invariant(customer?.biotech_id === blanketPurchaseOrder.biotech_id, new PermissionDeniedError());

  if (blanketPurchaseOrder.blanket_purchase_order_transactions.length > 1) {
    invariant(toCent(amount) >= blanketPurchaseOrder.amount.toNumber(), new PublicError('Amount adjustments are allowed only for increasing the amount when transactions are present, decreasing is not permitted.'));
    invariant(po_number === blanketPurchaseOrder.po_number, new PublicError('Modification of the Purchase Order number is not allowed when transactions are associated with it'));

    if (toCent(amount) > blanketPurchaseOrder.amount.toNumber()) {
      await context.prisma.blanketPurchaseOrderTransaction.create({
        data: {
          amount: toCent(amount) - blanketPurchaseOrder.amount.toNumber(),
          transaction_type: BlanketPurchaseOrderTransactionType.CREDIT,
          blanket_purchase_order_id: id,
          user_id: current_user_id,
        },
      });
    }
  } else {
    await context.prisma.blanketPurchaseOrderTransaction.update({
      where: {
        id: blanketPurchaseOrder.blanket_purchase_order_transactions[0].id,
      },
      data: {
        amount: toCent(amount),
      },
    });
  }

  const balanceAmount = await calculateBlanketPurchaseOrderBalanceAmount({ id }, context);

  const updatedBlanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.update({
    where: {
      id,
    },
    data: {
      po_number,
      name,
      amount: toCent(amount),
      balance_amount: toCent(balanceAmount),
    }
  });

  return ({
    ...updatedBlanketPurchaseOrder,
    balance_amount: toDollar(updatedBlanketPurchaseOrder.balance_amount.toNumber()),
    amount: toDollar(updatedBlanketPurchaseOrder.amount.toNumber()),
  });
}

export type RemoveBlanketPurchaseOrderArgs = {
  id: string;
  current_user_id: string;
}

export const removeBlanketPurchaseOrder = async (args: RemoveBlanketPurchaseOrderArgs, context: ServiceContext) => {
  const { id, current_user_id } = args;
  const allowDeletePurchaseOrder = await hasPermission(current_user_id, CasbinObj.PURCHASE_ORDER, CasbinAct.DELETE);
  invariant(allowDeletePurchaseOrder, new PermissionDeniedError());

  const blanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.findFirst({
    where: {
      id,
    },
    include: {
      blanket_purchase_order_transactions: true
    }
  });

  invariant(blanketPurchaseOrder, 'Blanket Pruchase Order not found.');

  const customer = await context.prisma.customer.findFirst({
    where: {
      user_id: current_user_id
    }
  });

  invariant(customer?.biotech_id === blanketPurchaseOrder.biotech_id, new PermissionDeniedError());
  
  invariant(blanketPurchaseOrder.blanket_purchase_order_transactions.length <= 1, new PublicError('Unable to delete Blanket Purchase Order with associated transactions for record-keeping purposes.'));

  await context.prisma.blanketPurchaseOrderTransaction.deleteMany({
    where: {
      blanket_purchase_order_id: id,
    }
  });

  const removedBlanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.delete({
    where: {
      id,
    }
  });

  return ({
    ...removedBlanketPurchaseOrder,
    balance_amount: toDollar(removedBlanketPurchaseOrder.balance_amount.toNumber()),
    amount: toDollar(removedBlanketPurchaseOrder.amount.toNumber()),
  });
}

const blanketPurchaseOrderService = {
  createBlanketPurchaseOrder,
  calculateBlanketPurchaseOrderBalanceAmount,
  updateBlanketPurchaseOrder,
  removeBlanketPurchaseOrder,
};

export default blanketPurchaseOrderService;
