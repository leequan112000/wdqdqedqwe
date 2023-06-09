import { toDollar } from "../../helper/money";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { MilestonePaymentStatus, MilestoneStatus } from "../../helper/constant";
import { checkAllowCustomerOnlyPermission, checkAllowVendorOnlyPermission, checkMilestonePermission } from "../../helper/accessControl";

const resolvers: Resolvers<Context> = {
  Query: {
    milestone: async (_, args, context) => {
      const { id } = args;
      await checkMilestonePermission(context, id);
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id
        }
      });

      return milestone
        ? {
          ...milestone,
          amount: toDollar(milestone.amount.toNumber())
        }
        : null;
    },
  },
  Mutation: {
    startMilestone: async (_, args, context) => {
      const { id } = args;
      await checkAllowVendorOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        data: {
          status: MilestoneStatus.IN_PROGRESS,
        },
      });

      // TODO Send notification to biotech

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
    requestMilestonePayment: async (_, args, context) => {
      const { id } = args;
      await checkAllowVendorOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        data: {
          status: MilestoneStatus.PENDING_PAYMENT,
        },
      });

      // TODO Send notification to biotech

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
    markMilestoneAsPaid: async (_, args, context) => {
      const { id } = args;
      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);
      // TODO Check biotech user permission
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        data: {
          payment_status: MilestonePaymentStatus.PROCESSING,
        },
      });

      // TODO Send notification to vendor

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
    verifyMilestoneAsPaid: async (_, args, context) => {
      const { id } = args
      await checkAllowVendorOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        data: {
          status: MilestoneStatus.IN_PROGRESS,
          payment_status: MilestonePaymentStatus.PAID,
        },
      });

      // TODO Send notification to biotech

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
    markMilestoneAsCompleted: async (_, args, context) => {
      const { id } = args
      await checkAllowVendorOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        data: {
          status: MilestoneStatus.PENDING_COMPLETION_APPROVAL,
        },
      });

      // TODO Send notification to biotech

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
    verifyMilestoneAsCompleted: async (_, args, context) => {
      const { id } = args
      await checkAllowCustomerOnlyPermission(context);
      await checkMilestonePermission(context, id);
      const updatedMilestone = await context.prisma.milestone.update({
        where: {
          id,
        },
        data: {
          status: MilestoneStatus.COMPLETED,
        },
      });

      // TODO Send notification to vendor

      return {
        ...updatedMilestone,
        amount: updatedMilestone.amount.toNumber(),
      }
    },
  }
}

export default resolvers;
