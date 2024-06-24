import { NotificationType } from '../helper/constant';

type CreateBiotechInvoicePaymentVerifiedNotificationData = {
  recipient_id: string;
  invoice_id: string;
  invoice_number: string;
  invoice_total_amount: string;
};

export const createBiotechInvoicePaymentVerifiedNotificationJob = (
  data: CreateBiotechInvoicePaymentVerifiedNotificationData,
) => {
  const { recipient_id, invoice_id, invoice_number, invoice_total_amount } =
    data;

  return {
    notification_type:
      NotificationType.BIOTECH_INVOICE_PAYMENT_VERIFIED_NOTIFICATION,
    message: `Payment confirmation: Thank you for your payment of ${invoice_total_amount} (Invoice No: ${invoice_number})`,
    params: {
      invoice_id,
    },
    recipient_id,
  };
};

type CreateNewBiotechInvoiceNotificationData = {
  recipient_id: string;
  invoice_id: string;
  invoice_number: string;
  project_title: string;
};

export const createNewBiotechInvoiceNotificationJob = (
  data: CreateNewBiotechInvoiceNotificationData,
) => {
  const { recipient_id, invoice_id, invoice_number, project_title } = data;

  return {
    notification_type: NotificationType.NEW_BIOTECH_INVOICE_NOTIFICATION,
    message: `You have a new invoice for **${project_title}** (Invoice No: ${invoice_number})`,
    params: {
      invoice_id,
    },
    recipient_id,
  };
};

type CreateBiotechInvoicePaymentReminderNotificationData = {
  recipient_id: string;
  invoice_number: string;
  invoice_id: string;
  project_title: string;
  due_at: string;
};

export const createBiotechInvoicePaymentReminderNotificationJob = (
  data: CreateBiotechInvoicePaymentReminderNotificationData,
) => {
  const { project_title, invoice_id, invoice_number, recipient_id, due_at } =
    data;

  return {
    notification_type:
      NotificationType.BIOTECH_INVOICE_PAYMENT_REMINDER_NOTIFICATION,
    message: `Your payment for **${project_title}** (Invoice No: ${invoice_number}) is due on ${due_at}.`,
    params: {
      invoice_id,
    },
    recipient_id,
  };
};

type CreateBiotechInvoicePaymentOverdueNotificationData = {
  recipient_id: string;
  invoice_number: string;
  invoice_id: string;
  project_title: string;
  overdue_period: string;
};

export const createBiotechInvoicePaymentOverdueNotificationJob = (
  data: CreateBiotechInvoicePaymentOverdueNotificationData,
) => {
  const {
    project_title,
    invoice_id,
    invoice_number,
    recipient_id,
    overdue_period,
  } = data;

  return {
    notification_type:
      NotificationType.BIOTECH_INVOICE_PAYMENT_OVERDUE_NOTIFICATION,
    message: `Your payment for **${project_title}** (Invoice No: ${invoice_number}) is ${overdue_period} overdue.`,
    params: {
      invoice_id,
    },
    recipient_id,
  };
};
