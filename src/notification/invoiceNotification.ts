import { NotificationType } from "../helper/constant";
import { prisma } from "../prisma";
import { publishNewNotification } from "../helper/pubsub";
import invariant from '../helper/invariant';

type CreateBillingNotificationData = {
  invoice_month: string;
  recipient_id: string;
  invoice_id: string;
}

type CreateInvoicePaymentNotificationData = {
  invoice_month: string;
  recipient_id: string;
  invoice_id: string;
  payment_status: string;
}

type CreateInvoicePaymentReminderNotificationData = {
  invoice_date: string;
  recipient_id: string;
  invoice_id: string;
  due_at: string;
}

type CreateInvoicePaymentOverdueNotificationData = {
  invoice_date: string;
  recipient_id: string;
  invoice_id: string;
  overdue_period: string;
}

export const createBillingNotification = async (data: CreateBillingNotificationData) => {
  const { invoice_month, invoice_id, recipient_id } = data;

  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.NEW_INVOICE_NOTIFICATION,
      message: `Invoice for **${invoice_month}** is ready.`,
      params: {
        invoice_id,
      },
      recipient_id,
    },
  });

  invariant(notification, 'Notification not created.');

  await publishNewNotification(notification);
}

export const createInvoicePaymentNotification = async (data: CreateInvoicePaymentNotificationData) => {
  const { invoice_month, invoice_id, recipient_id, payment_status } = data;

  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.INVOICE_PAYMENT_NOTIFICATION,
      message: `Your payment status for Invoice **${invoice_month}** is ${payment_status}.`,
      params: {
        invoice_id,
      },
      recipient_id,
    },
  });

  invariant(notification, 'Notification not created.');

  await publishNewNotification(notification);
}

export const createInvoicePaymentReminderNotification = async (data: CreateInvoicePaymentReminderNotificationData) => {
  const { invoice_date, invoice_id, recipient_id, due_at } = data;

  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.INVOICE_PAYMENT_REMINDER_NOTIFICATION,
      message: `Your payment for **${invoice_date}** invoice is due on ${due_at}.`,
      params: {
        invoice_id,
      },
      recipient_id,
    },
  });

  invariant(notification, 'Notification not created.');

  await publishNewNotification(notification);
}

export const createInvoicePaymentOverdueNotification = async (data: CreateInvoicePaymentOverdueNotificationData) => {
  const { invoice_date, invoice_id, recipient_id, overdue_period } = data;

  const notification = await prisma.notification.create({
    data: {
      notification_type: NotificationType.INVOICE_PAYMENT_OVERDUE_NOTIFICATION,
      message: `Your payment for **${invoice_date}** invoice is ${overdue_period} overdue.`,
      params: {
        invoice_id,
      },
      recipient_id,
    },
  });

  invariant(notification, 'Notification not created.');

  await publishNewNotification(notification);
}
