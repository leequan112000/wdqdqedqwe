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
