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

  const blanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.create({
    data: {
      po_number,
      name,
      amount: toCent(amount),
      biotech_id: customer.biotech_id,
    }
  });

  return ({
    ...blanketPurchaseOrder,
    amount: toDollar(blanketPurchaseOrder.amount.toNumber()),
  });
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

  if (blanketPurchaseOrder.blanket_purchase_order_transactions.length > 0) {
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
  }

  const updatedBlanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.update({
    where: {
      id,
    },
    data: {
      po_number,
      name,
      amount: toCent(amount),
    }
  });

  return ({
    ...updatedBlanketPurchaseOrder,
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
  
  invariant(blanketPurchaseOrder.blanket_purchase_order_transactions.length === 0, new PublicError('Unable to delete Blanket Purchase Order with associated transactions for record-keeping purposes.'));

  const removedBlanketPurchaseOrder = await context.prisma.blanketPurchaseOrder.delete({
    where: {
      id,
    }
  });

  return ({
    ...removedBlanketPurchaseOrder,
    amount: toDollar(removedBlanketPurchaseOrder.amount.toNumber()),
  });
}

const blanketPurchaseOrderService = {
  createBlanketPurchaseOrder,
  updateBlanketPurchaseOrder,
  removeBlanketPurchaseOrder,
};

export default blanketPurchaseOrderService;
