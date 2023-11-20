import { NotificationType } from "../helper/constant";

type CreateBiotechInvoicePaymentVerifiedNotificationData = {
  recipient_id: string;
  invoice_id: string;
  invoice_number: string;
  invoice_total_amount: string;
}

export const createBiotechInvoicePaymentVerifiedNotificationJob = (
  data: CreateBiotechInvoicePaymentVerifiedNotificationData
) => {
  const { recipient_id, invoice_id, invoice_number, invoice_total_amount } = data;

  return {
    notification_type: NotificationType.BIOTECH_INVOICE_PAYMENT_VERIFIED_NOTIFICATION,
    message: `Payment confirmation: Thank you for your payment of ${invoice_total_amount} (Invoice No: ${invoice_number})`,
    params: {
      invoice_id,
    },
    recipient_id,
  };
};
