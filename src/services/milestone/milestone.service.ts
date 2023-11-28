import moment from "moment";
import currency from "currency.js";

import { app_env } from "../../environment";
import { ServiceContext } from "../../types/context";
import { CompanyCollaboratorRoleType, InvoicePaymentStatus, MilestoneEventType, MilestonePaymentStatus } from "../../helper/constant";

import { bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail } from "../../mailer/biotechInvoice";
import { createBiotechInvoicePaymentVerifiedNotificationJob } from "../../notification/biotechInvoiceNotification";
import { createNotificationQueueJob } from "../../queues/notification.queues";
import { createSendUserMilestoneNoticeJob } from "../../queues/email.queues";

type UpdateMilestoneAsPaidArgs = {
  milestone_id: string;
  user_id: string;
}

const updateMilestoneAsPaid = async (args: UpdateMilestoneAsPaidArgs, ctx: ServiceContext) => {
  const { milestone_id, user_id } = args;

  const updatedMilestone = await ctx.prisma.milestone.update({
    where: {
      id: milestone_id,
    },
    include: {
      quote: {
        include: {
          project_connection: true,
        }
      }
    },
    data: {
      payment_status: MilestonePaymentStatus.PAID,
    }
  });

  const biotechInvoiceItem = await ctx.prisma.biotechInvoiceItem.findFirst({
    where: {
      milestone_id,
    }
  });

  const biotechInvoice = await ctx.prisma.biotechInvoice.update({
    where: {
      id: biotechInvoiceItem?.biotech_invoice_id
    },
    data: {
      payment_status: InvoicePaymentStatus.PAID,
      paid_at: new Date(),
    },
    include: {
      biotech_invoice_items: true,
      biotech: true,
    }
  });

  const receivers = await ctx.prisma.customer.findMany({
    where: {
      biotech_id: biotechInvoice.biotech_id,
      role: CompanyCollaboratorRoleType.OWNER,
      user: {
        is_active: true,
      },
    },
    include: {
      user: true,
    }
  });

  const totalAmount = biotechInvoice.biotech_invoice_items.reduce((acc, item) => acc + item.amount.toNumber(), 0);
  const emailData = receivers.map((r) => ({
    emailData: {
      invoice_date: moment(biotechInvoice.created_at).format('ll'),
      invoice_number: biotechInvoice.invoice_number,
      invoice_total_amount: currency(totalAmount, { fromCents: true }).format(),
      biotech_company_name: biotechInvoice.biotech.name,
      button_url: `${app_env.APP_URL}/app/invoices/${biotechInvoice.id}`
    },
    receiverEmail: r.user.email,
  }));
  const notificationData = receivers.map((r) => {
    return createBiotechInvoicePaymentVerifiedNotificationJob({
      recipient_id: r.user_id,
      invoice_id: biotechInvoice.id,
      invoice_number: biotechInvoice.invoice_number,
      invoice_total_amount: currency(totalAmount, { fromCents: true }).format(),
    })
  })
  bulkBiotechInvoicePaymentVerifiedByCromaticAdminEmail(emailData);
  createNotificationQueueJob({ data: notificationData });

  createSendUserMilestoneNoticeJob({
    projectConnectionId: updatedMilestone.quote.project_connection_id,
    milestoneTitle: updatedMilestone.title,
    quoteId: updatedMilestone.quote.id,
    senderUserId: user_id,
    milestoneEventType: MilestoneEventType.BIOTECH_PAID,
  });

  return {
    updatedMilestone,
    updatedBiotechInvoice: biotechInvoice,
  }
}

const milestoneService = {
  updateMilestoneAsPaid,
};

export default milestoneService;
