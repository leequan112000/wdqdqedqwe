import { ServiceContext } from '../../types/context';
import { toCent, toDollar } from '../../helper/money';

export type CreateBlanketPurchaseOrderArgs = {
  po_number: string;
  name: string;
  amount: number;
  current_user_id: string;
}

export const createBlanketPurchaseOrder = async (args: CreateBlanketPurchaseOrderArgs, context: ServiceContext) => {
  const { po_number, name, amount, current_user_id } = args;
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
  })
}

const blanketPurchaseOrderService = {
  createBlanketPurchaseOrder,
};

export default blanketPurchaseOrderService;
