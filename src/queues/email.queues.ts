import {
  CompanyCollaboratorRoleType,
  EmailType,
  MilestoneEventType,
  NotificationType,
  QuoteNotificationActionContent,
} from '../helper/constant';
import { createQueue } from '../helper/queue';
import { prisma } from '../prisma';
import { app_env } from '../environment';
import { sendNewMessageNoticeEmail } from '../mailer/message';
import { sendVendorAcceptProjectNoticeEmail } from '../mailer/projectRequest';
import createAcceptRequestNotification from '../notification/acceptRequestNotification';
import createMessageNotification from '../notification/messageNotification';
import createQuoteNotification from '../notification/quoteNotification';
import {
  createMilestoneNotification,
  createMilestonePaymentFailedNotification,
} from '../notification/milestoneNotification';
import { sendMilestoneNoticeEmail } from '../mailer/milestone';
import { sendNewSubscriptionEmail } from '../mailer/newsletter';
import {
  sendQuoteExpiredNoticeEmail,
  sendQuoteExpiringNoticeEmail,
  sendQuoteNoticeEmail,
} from '../mailer/quote';
import { getReceiversByProjectConnection } from './utils';
import {
  CreateBillingNoticeEmailJobParam,
  CreateInvoicePaymentNoticeEmailJobParam,
  CreateInvoicePaymentOverdueNoticeEmailJobParam,
  CreateInvoicePaymentReminderEmailJobParam,
  CreateSendUserExpiredQuoteNoticeEmailJobParam,
  CreateSendUserExpiringQuoteNoticeEmailJobParam,
} from './types';
import {
  sendBillingNoticeEmail,
  sendInvoicePaymentNoticeEmail,
  sendInvoicePaymentOverdueNoticeEmail,
  sendInvoicePaymentReminderEmail,
} from '../mailer/invoice';
import {
  createBillingNotification,
  createInvoicePaymentNotification,
  createInvoicePaymentOverdueNotification,
  createInvoicePaymentReminderNotification,
} from '../notification/invoiceNotification';
import invariant from '../helper/invariant';

type EmailJob = {
  type: EmailType;
  data: any;
};

const emailQueue = createQueue<EmailJob>('email-old');

emailQueue.process(async (job, done) => {
  const { data, type } = job.data;

  try {
    switch (type) {
      case EmailType.USER_NEW_MESSAGE_NOTICE: {
        const { projectConnectionId, senderUserId, messageText } = data;

        const { receivers, projectConnection, senderCompanyName } =
          await getReceiversByProjectConnection(
            projectConnectionId,
            senderUserId,
          );

        await Promise.all(
          receivers.map(async (receiver) => {
            const notification = await prisma.notification.findFirst({
              where: {
                recipient_id: receiver.id,
                notification_type: NotificationType.MESSAGE_NOTIFICATION,
                read_at: null,
                params: {
                  path: ['project_connection_id'],
                  equals: projectConnection.id,
                },
              },
            });

            if (!notification) {
              await sendNewMessageNoticeEmail(
                {
                  button_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}`,
                  receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
                  project_title: projectConnection.project_request.title,
                  company_name: senderCompanyName,
                  message_text: messageText,
                },
                receiver.email,
              );
              await createMessageNotification(
                senderUserId,
                receiver.id,
                projectConnection.id,
              );
            }
          }),
        );

        done();
        break;
      }
      case EmailType.USER_ACCEPT_PROJECT_REQUEST_NOTICE: {
        const { projectConnectionId, senderUserId } = data;

        const projectConnection =
          await prisma.projectConnection.findFirstOrThrow({
            where: {
              id: projectConnectionId,
            },
            include: {
              customer_connections: true,
              vendor_member_connections: true,
              project_request: true,
            },
          });

        const vendor = await prisma.vendorMember.findFirst({
          where: {
            user_id: senderUserId,
          },
          include: {
            vendor_company: true,
          },
        });

        if (vendor) {
          // notify biotech members
          const receivers = await prisma.user.findMany({
            where: {
              customer: {
                id: {
                  in: projectConnection.customer_connections.map(
                    (cc) => cc.customer_id,
                  ),
                },
              },
              OR: [
                { deactivated_at: null },
                {
                  deactivated_at: {
                    gt: new Date(),
                  },
                },
              ],
            },
          });

          await Promise.all(
            receivers.map(async (receiver) => {
              await sendVendorAcceptProjectNoticeEmail(
                {
                  login_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}`,
                  receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
                  project_title: projectConnection.project_request.title,
                  vendor_company_name: vendor.vendor_company?.name as string,
                },
                receiver.email,
              );

              await createAcceptRequestNotification(
                senderUserId,
                receiver.id,
                projectConnection.id,
              );
            }),
          );
        }

        done();
        break;
      }
      case EmailType.USER_NEW_BLOG_SUBSCRIBPTION_EMAIL: {
        const { receiverEmail } = data;
        const resp = await sendNewSubscriptionEmail(receiverEmail);

        done(null, resp);
        break;
      }
      case EmailType.USER_QUOTE_NOTICE_EMAIL: {
        const { projectConnectionId, quoteId, senderUserId, action } = data;
        const { receivers, projectConnection, senderCompanyName } =
          await getReceiversByProjectConnection(
            projectConnectionId,
            senderUserId,
          );
        await Promise.all(
          receivers.map(async (receiver) => {
            await sendQuoteNoticeEmail(
              {
                sender_name: senderCompanyName,
                project_title: projectConnection.project_request.title,
                receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
                action,
                quotation_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}/quote/${quoteId}`,
              },
              receiver.email,
            );

            await createQuoteNotification(
              senderUserId,
              senderCompanyName,
              quoteId,
              action,
              receiver.id,
              projectConnection.id,
            );
          }),
        );

        done();
        break;
      }
      case EmailType.USER_MILESTONE_NOTICE_EMAIL: {
        const {
          projectConnectionId,
          milestoneTitle,
          quoteId,
          senderUserId,
          milestoneEventType,
        } = data;
        const { receivers, projectConnection, senderCompanyName } =
          await getReceiversByProjectConnection(
            projectConnectionId,
            senderUserId,
          );
        let milestoneUpdateContent = '';
        switch (milestoneEventType) {
          case MilestoneEventType.BIOTECH_PAID:
            milestoneUpdateContent = `Payment is now in escrow for the following milestone: ${milestoneTitle}`;
            break;
          case MilestoneEventType.VENDOR_MARKED_AS_COMPLETE:
            milestoneUpdateContent =
              'New milestone completed! Please review and approve for release of payment.';
            break;
          case MilestoneEventType.BIOTECH_VERIFIED_AS_COMPLETED:
            milestoneUpdateContent =
              'Milestone completion approved! Your payout is now in progress.';
            break;
        }

        await Promise.all(
          receivers.map(async (receiver) => {
            await sendMilestoneNoticeEmail(
              {
                sender_name: senderCompanyName,
                project_title: projectConnection.project_request.title,
                receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
                milestone_update_content: milestoneUpdateContent,
                milestone_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}/quote/${quoteId}`,
              },
              receiver.email,
            );

            await createMilestoneNotification(
              senderUserId,
              quoteId,
              milestoneUpdateContent,
              receiver.id,
              projectConnection.id,
            );
          }),
        );

        done();
        break;
      }
      case EmailType.USER_MILESTONE_PAYMENT_FAILED_NOTICE_EMAIL: {
        const { milestoneId } = data;
        const milestone = await prisma.milestone.findFirstOrThrow({
          where: {
            id: milestoneId,
          },
          include: {
            quote: {
              include: {
                project_connection: {
                  include: {
                    customer_connections: true,
                    project_request: true,
                  },
                },
              },
            },
          },
        });

        const receivers = await prisma.user.findMany({
          where: {
            customer: {
              id: {
                in: milestone.quote.project_connection.customer_connections.map(
                  (cc) => cc.customer_id,
                ),
              },
            },
            OR: [
              { deactivated_at: null },
              {
                deactivated_at: {
                  gt: new Date(),
                },
              },
            ],
          },
        });

        const milestoneUpdateContent = `Payment failed for the following milestone: ${milestone.title}. Please ensure that your payment details are up to date and retry the payment to proceed with the transaction.`;
        await Promise.all(
          receivers.map(async (receiver) => {
            await sendMilestoneNoticeEmail(
              {
                sender_name: 'Cromatic Admin',
                project_title:
                  milestone.quote.project_connection.project_request.title,
                receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
                milestone_update_content: milestoneUpdateContent,
                milestone_url: `${app_env.APP_URL}/app/project-connection/${milestone.quote.project_connection_id}/quote/${milestone.quote.id}`,
              },
              receiver.email,
            );

            await createMilestonePaymentFailedNotification(
              milestone.quote_id,
              milestoneUpdateContent,
              receiver.id,
              milestone.quote.project_connection_id,
            );
          }),
        );

        done();
        break;
      }
      case EmailType.USER_QUOTE_EXPIRING_NOTICE_EMAIL: {
        const { receiverEmail, receiverName, expiringIn, listData, moreCount } =
          data as CreateSendUserExpiringQuoteNoticeEmailJobParam;

        const receiver = await prisma.user.findFirst({
          where: {
            email: receiverEmail,
          },
        });
        invariant(receiver, 'Receiver not found.');
        if (receiver.deactivated_at && receiver.deactivated_at <= new Date()) {
          done(null, 'Deactivated');
          break;
        }

        const buttonUrl = `${app_env.APP_URL}/app/projects/on-going`;
        const resp = await sendQuoteExpiringNoticeEmail(
          {
            button_url: buttonUrl,
            expiring_in: expiringIn,
            receiver_full_name: receiverName,
            list_data: listData,
            more_count: moreCount,
            view_more_url: buttonUrl,
          },
          receiverEmail,
        );

        done(null, resp);
        break;
      }
      case EmailType.USER_QUOTE_EXPIRED_NOTICE_EMAIL: {
        const { receiverEmail, receiverName, listData, moreCount } =
          data as CreateSendUserExpiredQuoteNoticeEmailJobParam;
        const buttonUrl = `${app_env.APP_URL}/app/projects/on-going`;

        const receiver = await prisma.user.findFirst({
          where: {
            email: receiverEmail,
          },
        });
        invariant(receiver, 'Receiver not found.');
        if (receiver.deactivated_at && receiver.deactivated_at <= new Date()) {
          done(null, 'Deactivated');
          break;
        }

        const resp = await sendQuoteExpiredNoticeEmail(
          {
            button_url: buttonUrl,
            receiver_full_name: receiverName,
            list_data: listData,
            more_count: moreCount,
            view_more_url: buttonUrl,
          },
          receiverEmail,
        );

        done(null, resp);
        break;
      }
      case EmailType.USER_BILLING_NOTICE_EMAIL: {
        const {
          invoiceId,
          invoiceMonth,
          invoicePeriod,
          invoiceTotalAmount,
          receiverCompanyName,
          receiverEmail,
          receiverId,
        } = data as CreateBillingNoticeEmailJobParam;
        const buttonUrl = `${app_env.APP_URL}/app/invoices/${invoiceId}`;

        const receiver = await prisma.user.findFirst({
          where: {
            email: receiverEmail,
          },
        });
        invariant(receiver, 'Receiver not found.');
        if (receiver.deactivated_at && receiver.deactivated_at <= new Date()) {
          done(null, 'Deactivated');
          break;
        }

        const resp = await sendBillingNoticeEmail(
          {
            button_url: buttonUrl,
            invoice_month: invoiceMonth,
            invoice_period: invoicePeriod,
            invoice_total_amount: invoiceTotalAmount,
            vendor_company_name: receiverCompanyName,
          },
          receiverEmail,
        );

        await createBillingNotification({
          invoice_id: invoiceId,
          invoice_month: invoiceMonth,
          recipient_id: receiverId,
        });

        done(null, resp);
        break;
      }
      case EmailType.USER_INVOICE_PAYMENT_NOTICE_EMAIL: {
        const { invoiceId, invoiceMonth, paymentStatus, vendorCompanyId } =
          data as CreateInvoicePaymentNoticeEmailJobParam;
        const buttonUrl = `${app_env.APP_URL}/app/invoices/${invoiceId}`;

        const receivers = await prisma.vendorMember.findMany({
          where: {
            vendor_company_id: vendorCompanyId,
            role: {
              in: [
                CompanyCollaboratorRoleType.OWNER,
                CompanyCollaboratorRoleType.ADMIN,
              ],
            },
            user: {
              OR: [
                { deactivated_at: null },
                {
                  deactivated_at: {
                    gt: new Date(),
                  },
                },
              ],
            },
          },
          include: {
            user: true,
          },
        });

        await Promise.all(
          receivers.map(async (receiver) => {
            await sendInvoicePaymentNoticeEmail(
              {
                button_url: buttonUrl,
                invoice_month: invoiceMonth,
                payment_status: paymentStatus,
              },
              receiver.user.email,
            );

            await createInvoicePaymentNotification({
              invoice_id: invoiceId,
              invoice_month: invoiceMonth,
              recipient_id: receiver.user_id,
              payment_status: paymentStatus,
            });
          }),
        );

        done();
        break;
      }
      case EmailType.USER_INVOICE_PAYMENT_REMINDER_EMAIL: {
        const {
          invoiceId,
          invoiceDate,
          invoiceDueAt,
          duePeriod,
          invoiceTotalAmount,
          vendorCompanyId,
        } = data as CreateInvoicePaymentReminderEmailJobParam;
        const buttonUrl = `${app_env.APP_URL}/app/invoices/${invoiceId}`;
        const receivers = await prisma.vendorMember.findMany({
          where: {
            vendor_company_id: vendorCompanyId,
            role: {
              in: [
                CompanyCollaboratorRoleType.OWNER,
                CompanyCollaboratorRoleType.ADMIN,
              ],
            },
            user: {
              OR: [
                { deactivated_at: null },
                {
                  deactivated_at: {
                    gt: new Date(),
                  },
                },
              ],
            },
          },
          include: {
            user: true,
            vendor_company: true,
          },
        });

        await Promise.all(
          receivers.map(async (receiver) => {
            await sendInvoicePaymentReminderEmail(
              {
                button_url: buttonUrl,
                invoice_date: invoiceDate,
                due_at: invoiceDueAt,
                due_period: duePeriod,
                invoice_total_amount: invoiceTotalAmount,
                vendor_company_name: receiver.vendor_company!.name,
              },
              receiver.user.email,
            );

            await createInvoicePaymentReminderNotification({
              invoice_id: invoiceId,
              invoice_date: invoiceDate,
              recipient_id: receiver.user_id,
              due_at: invoiceDueAt,
            });
          }),
        );

        done();
        break;
      }
      case EmailType.USER_INVOICE_PAYMENT_OVERDUE_NOTICE_EMAIL: {
        const {
          invoiceId,
          invoiceDate,
          overduePeriod,
          invoiceTotalAmount,
          vendorCompanyId,
        } = data as CreateInvoicePaymentOverdueNoticeEmailJobParam;
        const buttonUrl = `${app_env.APP_URL}/app/invoices/${invoiceId}`;

        const receivers = await prisma.vendorMember.findMany({
          where: {
            vendor_company_id: vendorCompanyId,
            role: {
              in: [
                CompanyCollaboratorRoleType.OWNER,
                CompanyCollaboratorRoleType.ADMIN,
              ],
            },
            user: {
              OR: [
                { deactivated_at: null },
                {
                  deactivated_at: {
                    gt: new Date(),
                  },
                },
              ],
            },
          },
          include: {
            user: true,
            vendor_company: true,
          },
        });

        await Promise.all(
          receivers.map(async (receiver) => {
            await sendInvoicePaymentOverdueNoticeEmail(
              {
                button_url: buttonUrl,
                invoice_date: invoiceDate,
                overdue_period: overduePeriod,
                invoice_total_amount: invoiceTotalAmount,
                vendor_company_name: receiver.vendor_company!.name,
              },
              receiver.user.email,
            );

            await createInvoicePaymentOverdueNotification({
              invoice_id: invoiceId,
              invoice_date: invoiceDate,
              recipient_id: receiver.user_id,
              overdue_period: overduePeriod,
            });
          }),
        );

        done();
        break;
      }
      default:
        done(new Error('No type match.'));
        break;
    }
  } catch (error) {
    if (error instanceof Error) {
      done(error);
    }
  }
});

export const createSendUserNewMessageNoticeJob = (data: {
  projectConnectionId: string;
  senderUserId: string;
  messageText: string;
}) => {
  emailQueue.add({ type: EmailType.USER_NEW_MESSAGE_NOTICE, data });
};

export const createSendUserQuoteNoticeJob = (data: {
  projectConnectionId: string;
  senderUserId: string;
  quoteId: string;
  action: QuoteNotificationActionContent;
}) => {
  emailQueue.add({ type: EmailType.USER_QUOTE_NOTICE_EMAIL, data });
};

export const createSendUserMilestoneNoticeJob = (data: {
  projectConnectionId: string;
  milestoneTitle: string;
  quoteId: string;
  senderUserId: string;
  milestoneEventType: MilestoneEventType;
}) => {
  emailQueue.add({ type: EmailType.USER_MILESTONE_NOTICE_EMAIL, data });
};

export const createSendUserMilestonePaymentFailedNoticeJob = (data: {
  milestoneId: string;
}) => {
  emailQueue.add({
    type: EmailType.USER_MILESTONE_PAYMENT_FAILED_NOTICE_EMAIL,
    data,
  });
};

export const createSendUserAcceptProjectRequestNoticeJob = (data: {
  projectConnectionId: string;
  senderUserId: string;
}) => {
  emailQueue.add({ type: EmailType.USER_ACCEPT_PROJECT_REQUEST_NOTICE, data });
};

export const createSendNewBlogSubscriptionEmailJob = (data: {
  receiverEmail: string;
}) => {
  emailQueue.add({ type: EmailType.USER_NEW_BLOG_SUBSCRIBPTION_EMAIL, data });
};

export const createSendUserExpiringQuoteNoticeEmailJob = (
  data: CreateSendUserExpiringQuoteNoticeEmailJobParam,
) => {
  return emailQueue.add({
    type: EmailType.USER_QUOTE_EXPIRING_NOTICE_EMAIL,
    data,
  });
};

export const createSendUserExpiredQuoteNoticeEmailJob = (
  data: CreateSendUserExpiredQuoteNoticeEmailJobParam,
) => {
  return emailQueue.add({
    type: EmailType.USER_QUOTE_EXPIRED_NOTICE_EMAIL,
    data,
  });
};

export const createBillingNoticeEmailJob = (
  data: CreateBillingNoticeEmailJobParam,
) => {
  emailQueue.add({ type: EmailType.USER_BILLING_NOTICE_EMAIL, data });
};

export const createInvoicePaymentNoticeEmailJob = (
  data: CreateInvoicePaymentNoticeEmailJobParam,
) => {
  emailQueue.add({ type: EmailType.USER_INVOICE_PAYMENT_NOTICE_EMAIL, data });
};

export const createInvoicePaymentReminderEmailJob = (
  data: CreateInvoicePaymentReminderEmailJobParam,
) => {
  emailQueue.add({ type: EmailType.USER_INVOICE_PAYMENT_REMINDER_EMAIL, data });
};

export const createInvoicePaymentOverdueNoticeEmailJob = (
  data: CreateInvoicePaymentOverdueNoticeEmailJobParam,
) => {
  emailQueue.add({
    type: EmailType.USER_INVOICE_PAYMENT_OVERDUE_NOTICE_EMAIL,
    data,
  });
};
