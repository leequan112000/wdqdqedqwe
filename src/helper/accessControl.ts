import { PermissionDeniedError } from '../graphql/errors/PermissionDeniedError';
import { Context } from '../types/context';

export const checkProjectConnectionPermission = async (context: Context, projectConnectionId: string) => {
  const currentUser = await context.prisma.user.findFirst({
    where: {
      id: context.req.user_id
    },
  });

  if (!currentUser) {
    throw new PermissionDeniedError();
  }

  try {
    const projectConnection = await context.prisma.projectConnection.findFirst({
      where: {
        id: projectConnectionId,
      },
      include: {
        customer_connections: {
          include: {
            customer: true,
          },
        },
        vendor_member_connections: {
          include: {
            vendor_member: true,
          },
        },
        project_request: {
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        }
      },
    });

    if (!projectConnection) {
      throw new PermissionDeniedError();
    }

    const projectRequestUserId = projectConnection.project_request.customer.user_id;
    const accessableCustomerUserIds = projectConnection.customer_connections.map((cc) => cc.customer.user_id);
    const accessableVendorMemberIds = projectConnection.vendor_member_connections.map((vmc) => vmc.vendor_member.user_id);
    if (![projectRequestUserId, ...accessableCustomerUserIds, ...accessableVendorMemberIds].includes(currentUser.id)) {
      throw new PermissionDeniedError();
    }
  } catch (error) {
    throw new PermissionDeniedError();
  }
}

export const checkMilestonePermission = async (context: Context, milestoneId: string) => {
  try {
    const milestone = await context.prisma.milestone.findFirst({
      where: {
        id: milestoneId,
      },
      include: {
        quote: true
      }
    });

    if (!milestone) {
      throw new PermissionDeniedError();
    }

    await checkProjectConnectionPermission(context, milestone.quote.project_connection_id);
  } catch (error) {
    throw new PermissionDeniedError();
  }
}

export const checkInvoicePermission = async (context: Context, invoiceId: string) => {
  try {
    const currentVendor = await context.prisma.vendorMember.findFirst({
      where: {
        user_id: context.req.user_id
      },
    });
  
    if (!currentVendor) {
      throw new PermissionDeniedError();
    }

    const invoice = await context.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
      },
    });

    if (!invoice) {
      throw new PermissionDeniedError();
    }
    
    if (invoice.vendor_company_id !== currentVendor.vendor_company_id) {
      throw new PermissionDeniedError();
    }
  } catch (error) {
    throw new PermissionDeniedError();
  }
}

export const checkAllowVendorOnlyPermission = async (context: Context) => {
  try {
    const vendor = await context.prisma.vendorMember.findFirst({
      where: {
        user_id: context.req.user_id
      }
    });
    
    if (!vendor) {
      throw new PermissionDeniedError();
    }
  } catch (error) {
    throw new PermissionDeniedError();
  }
}

export const checkAllowCustomerOnlyPermission = async (context: Context) => {
  try {
    const customer = await context.prisma.customer.findFirst({
      where: {
        user_id: context.req.user_id
      }
    });

    if (!customer) {
      throw new PermissionDeniedError();
    }
  } catch (error) {
    throw new PermissionDeniedError();
  }
}
