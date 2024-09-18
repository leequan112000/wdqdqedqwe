import moment from 'moment';
import currency from 'currency.js';
import { app_env } from '../../environment';
import { ServiceContext } from '../../types/context';
import {
  CompanyCollaboratorRoleType,
  InvoicePaymentStatus,
  MilestonePaymentStatus,
  MilestoneStatus,
} from '../../helper/constant';
import { bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail } from '../../mailer/biotechInvoice';
import { sendMilestoneNoticeEmail } from '../../mailer/milestone';
import { createBiotechInvoicePaymentVerifiedNotificationJob } from '../../notification/biotechInvoiceNotification';
import { createMilestoneNotification } from '../../notification/milestoneNotification';
import { createNotificationQueueJob } from '../../queues/notification.queues';
import { getReceiversByProjectConnection } from '../../queues/utils';
import { decrypt } from '../../helper/gdprHelper';
import { getUserEmail, getUserFullName } from '../../helper/email';

type UpdateMilestoneAsPaidArgs = {
  milestone_id: string;
  user_id: string;
};

const updateMilestoneAsPaid = async (
  args: UpdateMilestoneAsPaidArgs,
  ctx: ServiceContext,
) => {
  const { milestone_id, user_id } = args;

  const updatedMilestone = await ctx.prisma.milestone.update({
    where: {
      id: milestone_id,
    },
    include: {
      quote: {
        include: {
          project_connection: true,
        },
      },
    },
    data: {
      status: MilestoneStatus.IN_PROGRESS,
      payment_status: MilestonePaymentStatus.PAID,
    },
  });

  const biotechInvoiceItem = await ctx.prisma.biotechInvoiceItem.findFirst({
    where: {
      milestone_id,
    },
  });

  const biotechInvoice = await ctx.prisma.biotechInvoice.update({
    where: {
      id: biotechInvoiceItem?.biotech_invoice_id,
    },
    data: {
      payment_status: InvoicePaymentStatus.PAID,
      paid_at: new Date(),
    },
    include: {
      biotech_invoice_items: true,
      biotech: true,
    },
  });

  const receivers = await ctx.prisma.customer.findMany({
    where: {
      biotech_id: biotechInvoice.biotech_id,
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

  const totalAmount = biotechInvoice.biotech_invoice_items.reduce(
    (acc, item) => acc + item.amount.toNumber(),
    0,
  );
  const emailData = receivers.map((r) => ({
    emailData: {
      invoice_date: moment(biotechInvoice.created_at).format('ll'),
      invoice_number: biotechInvoice.invoice_number,
      invoice_total_amount: currency(totalAmount, { fromCents: true }).format(),
      biotech_company_name: biotechInvoice.biotech.name,
      button_url: `${app_env.APP_URL}/app/invoices/${biotechInvoice.id}`,
    },
    receiverEmail: getUserEmail(r.user),
  }));
  const notificationData = receivers.map((r) => {
    return createBiotechInvoicePaymentVerifiedNotificationJob({
      recipient_id: r.user_id,
      invoice_id: biotechInvoice.id,
      invoice_number: biotechInvoice.invoice_number,
      invoice_total_amount: currency(totalAmount, { fromCents: true }).format(),
    });
  });
  bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail(emailData);
  createNotificationQueueJob({ data: notificationData });
  const projectConnectionId = updatedMilestone.quote.project_connection_id;
  const quoteId = updatedMilestone.quote.id;
  const {
    receivers: biotechs,
    projectConnection,
    senderCompanyName,
  } = await getReceiversByProjectConnection(projectConnectionId, user_id!);
  let milestoneUpdateContent = `Payment is now in escrow for the following milestone: ${updatedMilestone.title}`;
  await Promise.all(
    biotechs.map(async (receiver) => {
      const email = getUserEmail(receiver);
      const full_name = getUserFullName(receiver);
      await sendMilestoneNoticeEmail(
        {
          sender_name: senderCompanyName,
          project_title: projectConnection.project_request.title,
          receiver_full_name: full_name,
          milestone_update_content: milestoneUpdateContent,
          milestone_url: `${app_env.APP_URL}/app/project-connection/${projectConnectionId}/quote/${quoteId}`,
        },
        email,
      );

      await createMilestoneNotification(
        user_id,
        quoteId,
        milestoneUpdateContent,
        receiver.id,
        projectConnection.id,
      );
    }),
  );

  return {
    updatedMilestone,
    updatedBiotechInvoice: biotechInvoice,
  };
};

const milestoneService = {
  updateMilestoneAsPaid,
};

export default milestoneService;
