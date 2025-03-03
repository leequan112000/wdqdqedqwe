import { PermissionDeniedError } from '../graphql/errors/PermissionDeniedError';
import { Context } from '../types/context';
import { hasPermission } from './casbin';
import { CasbinAct, CasbinObj } from './constant';
import invariant from './invariant';

export const checkProjectConnectionPermission = async (
  context: Context,
  projectConnectionId: string,
) => {
  const currentUser = await context.prisma.user.findFirst({
    where: {
      id: context.req.user_id,
    },
  });

  invariant(currentUser, new PermissionDeniedError());

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
        },
      },
    });

    invariant(projectConnection, new PermissionDeniedError());

    const projectRequestUserId =
      projectConnection.project_request.customer.user_id;
    const accessableCustomerUserIds =
      projectConnection.customer_connections.map((cc) => cc.customer.user_id);
    const accessableVendorMemberIds =
      projectConnection.vendor_member_connections.map(
        (vmc) => vmc.vendor_member.user_id,
      );
    if (
      ![
        projectRequestUserId,
        ...accessableCustomerUserIds,
        ...accessableVendorMemberIds,
      ].includes(currentUser.id)
    ) {
      throw new PermissionDeniedError();
    }
  } catch (error) {
    throw new PermissionDeniedError();
  }
};

export const checkMilestonePermission = async (
  context: Context,
  milestoneId: string,
) => {
  try {
    const milestone = await context.prisma.milestone.findFirst({
      where: {
        id: milestoneId,
      },
      include: {
        quote: true,
      },
    });

    invariant(milestone, new PermissionDeniedError());

    await checkProjectConnectionPermission(
      context,
      milestone.quote.project_connection_id,
    );
  } catch (error) {
    throw new PermissionDeniedError();
  }
};

export const checkInvoicePermission = async (
  context: Context,
  invoiceId: string,
) => {
  try {
    const currentVendor = await context.prisma.vendorMember.findFirst({
      where: {
        user_id: context.req.user_id,
      },
    });

    invariant(currentVendor, new PermissionDeniedError());

    const invoice = await context.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
      },
    });

    invariant(invoice, new PermissionDeniedError());
    invariant(
      invoice.vendor_company_id === currentVendor.vendor_company_id,
      new PermissionDeniedError(),
    );
  } catch (error) {
    throw new PermissionDeniedError();
  }
};

export const checkBiotechInvoicePermission = async (
  context: Context,
  biotechInvoiceId: string,
) => {
  try {
    const currentCustomer = await context.prisma.customer.findFirst({
      where: {
        user_id: context.req.user_id,
      },
    });

    invariant(currentCustomer, new PermissionDeniedError());

    const biotechInvoice = await context.prisma.biotechInvoice.findFirst({
      where: {
        id: biotechInvoiceId,
      },
    });

    invariant(biotechInvoice, new PermissionDeniedError());
    invariant(
      biotechInvoice.biotech_id === currentCustomer.biotech_id,
      new PermissionDeniedError(),
    );
  } catch (error) {
    throw new PermissionDeniedError();
  }
};

export const checkAllowVendorOnlyPermission = async (context: Context) => {
  try {
    const vendor = await context.prisma.vendorMember.findFirst({
      where: {
        user_id: context.req.user_id,
      },
    });

    invariant(vendor, new PermissionDeniedError());
  } catch (error) {
    throw new PermissionDeniedError();
  }
};

export const checkAllowCustomerOnlyPermission = async (context: Context) => {
  try {
    const customer = await context.prisma.customer.findFirst({
      where: {
        user_id: context.req.user_id,
      },
    });

    invariant(customer, new PermissionDeniedError());
  } catch (error) {
    throw new PermissionDeniedError();
  }
};

export const checkAllowEditCompanyInfoPermission = async (context: Context) => {
  const currentUserId = context.req.user_id;
  invariant(currentUserId, 'Current user id not found.');
  const allowEditCompanyInfo = await hasPermission(
    currentUserId,
    CasbinObj.COMPANY_INFO,
    CasbinAct.WRITE,
  );
  invariant(allowEditCompanyInfo, new PermissionDeniedError());
};

export const checkAllowAddProjectCollaborator = async (context: Context) => {
  const currentUserId = context.req.user_id;
  invariant(currentUserId, 'Current user id not found.');
  const allowAddProjectCollaborator = await hasPermission(
    currentUserId,
    CasbinObj.PROJECT_COLLABORATOR,
    CasbinAct.WRITE,
  );
  invariant(allowAddProjectCollaborator, new PermissionDeniedError());
};

export const checkAllowRemoveProjectCollaborator = async (context: Context) => {
  const currentUserId = context.req.user_id;
  invariant(currentUserId, 'Current user id not found.');
  const allowRemoveProjectCollaborator = await hasPermission(
    currentUserId,
    CasbinObj.PROJECT_COLLABORATOR,
    CasbinAct.DELETE,
  );
  invariant(allowRemoveProjectCollaborator, new PermissionDeniedError());
};
