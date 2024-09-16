import { app_env } from '../../environment';
import { PermissionDeniedError } from '../../graphql/errors/PermissionDeniedError';
import { PublicError } from '../../graphql/errors/PublicError';
import { hasPermission } from '../../helper/casbin';
import {
  CasbinAct,
  CasbinObj,
  NotificationType,
  ProjectConnectionCollaborationStatus,
  ProjectConnectionVendorExperimentStatus,
  ProjectConnectionVendorStatus,
  ProjectRequestStatus,
} from '../../helper/constant';
import { getUserEmail, getUserFullName } from '../../helper/email';
import invariant from '../../helper/invariant';
import { filterByCollaborationStatus } from '../../helper/projectConnection';
import { sendVendorAcceptProjectNoticeEmail } from '../../mailer/projectRequest';
import createAcceptRequestNotification from '../../notification/acceptRequestNotification';
import { ServiceContext, Context } from '../../types/context';
import chatService from '../chat/chat.service';

type CheckIfUserInProjectConnectionArgs = {
  user_id: string;
  project_connection_id: string;
};

export const checkIfUserInProjectConnection = async (
  args: CheckIfUserInProjectConnectionArgs,
  context: ServiceContext,
) => {
  const { project_connection_id, user_id } = args;

  const cc = await context.prisma.customerConnection.findFirst({
    where: {
      customer: {
        user_id,
      },
      project_connection_id,
    },
  });

  const vmc = await context.prisma.vendorMemberConnection.findFirst({
    where: {
      vendor_member: {
        user_id,
      },
      project_connection_id,
    },
  });

  return !!cc || !!vmc;
};

type AcceptProjectConnectionArgs = {
  id: string;
};

export const acceptProjectConnection = async (
  args: AcceptProjectConnectionArgs,
  context: Context,
) => {
  const currentDate = new Date();
  const currentUserId = context.req.user_id;
  invariant(currentUserId, 'Current user id not found.');
  const allowAcceptProjectConnection = await hasPermission(
    currentUserId,
    CasbinObj.PROJECT_CONNECTION,
    CasbinAct.WRITE,
  );
  invariant(allowAcceptProjectConnection, new PermissionDeniedError());

  const projectConnection = await context.prisma.projectConnection.findFirst({
    where: {
      id: args.id,
    },
    include: {
      customer_connections: true,
      vendor_member_connections: true,
      project_request: true,
    },
  });
  invariant(projectConnection, 'Project connection not found.');

  if (
    projectConnection.expired_at &&
    currentDate >= projectConnection.expired_at
  ) {
    throw new PublicError('You can no longer accept this request');
  }

  const updatedProjectConnection = await context.prisma.$transaction(
    async (trx) => {
      if (
        projectConnection.project_request.status ===
        ProjectRequestStatus.WITHDRAWN
      ) {
        throw new PublicError('Project request has been withdrawn');
      }
      if (
        projectConnection.project_request.status ===
        ProjectRequestStatus.PROCESSING
      ) {
        await trx.projectRequest.update({
          where: {
            id: projectConnection.project_request_id,
          },
          data: {
            status: ProjectRequestStatus.MATCHED,
          },
        });
      }

      let chat = await trx.chat.findFirst({
        where: {
          project_connection_id: projectConnection.id,
        },
      });

      if (!chat) {
        chat = await trx.chat.create({
          data: {
            biotech_id: projectConnection.project_request.biotech_id,
            vendor_company_id: projectConnection.vendor_company_id,
            project_connection_id: projectConnection.id,
          },
        });
      }

      await chatService.createSystemMessage(
        {
          chat_id: chat.id,
          content:
            "You've found a match! Start a conversation with your partner to kick off your project.",
        },
        { prisma: trx },
      );

      return await trx.projectConnection.update({
        where: {
          id: args.id,
        },
        data: {
          vendor_status: ProjectConnectionVendorStatus.ACCEPTED,
        },
      });
    },
  );

  const vendor = await context.prisma.vendorMember.findFirst({
    where: {
      user_id: currentUserId,
    },
    include: {
      vendor_company: true,
    },
  });

  if (vendor) {
    // notify biotech members
    const receivers = await context.prisma.user.findMany({
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

    // send email and notification to biotech members
    await Promise.all(
      receivers.map(async (receiver) => {
        await sendVendorAcceptProjectNoticeEmail(
          {
            login_url: `${app_env.APP_URL}/app/project-connection/${projectConnection.id}`,
            receiver_full_name: getUserFullName(receiver),
            project_title: projectConnection.project_request.title,
            vendor_company_name: vendor.vendor_company?.name as string,
          },
          getUserEmail(receiver),
        );

        await createAcceptRequestNotification(
          currentUserId,
          receiver.id,
          projectConnection.id,
        );
      }),
    );
  }
  return updatedProjectConnection;
};

type DeclineProjectConnectionArgs = {
  id: string;
};

export const declineProjectConnection = async (
  args: DeclineProjectConnectionArgs,
  context: Context,
) => {
  const currentUserId = context.req.user_id;
  invariant(currentUserId, 'Current user id not found.');
  const allowDeclineProjectConnection = await hasPermission(
    currentUserId,
    CasbinObj.PROJECT_CONNECTION,
    CasbinAct.WRITE,
  );
  invariant(allowDeclineProjectConnection, new PermissionDeniedError());

  const currentDate = new Date();
  const projectConnection = await context.prisma.projectConnection.findFirst({
    where: {
      id: args.id,
    },
  });
  invariant(projectConnection, 'Project connection not found.');
  // Check for expiry if project connection has never responsed.
  if (
    projectConnection.vendor_status === ProjectConnectionVendorStatus.PENDING &&
    projectConnection.expired_at &&
    currentDate >= projectConnection.expired_at
  ) {
    throw new PublicError('You can no longer decline this request');
  }
  const updatedProjectConnection =
    await context.prisma.projectConnection.update({
      where: {
        id: args.id,
      },
      data: {
        vendor_status: ProjectConnectionVendorStatus.DECLINED,
      },
    });
  return updatedProjectConnection;
};

type GetProjectConnectionsArgs = {
  filter?: {
    status?: string | null;
  } | null;
};

export const getProjectConnections = async (
  args: GetProjectConnectionsArgs,
  context: Context,
) => {
  const { filter } = args;
  // find vendor member id
  const vendorMember = await context.prisma.vendorMember.findFirst({
    where: {
      user_id: context.req.user_id,
    },
  });
  invariant(vendorMember, 'Vendor member not found.');
  // find vendor member connections
  const vendorMemberConnections =
    await context.prisma.vendorMemberConnection.findMany({
      where: {
        vendor_member_id: vendorMember.id,
      },
      include: {
        project_connection: {
          include: {
            quotes: {
              include: {
                milestones: true,
              },
            },
            project_request: true,
          },
        },
      },
      orderBy: {
        project_connection: { created_at: 'desc' },
      },
    });

  const now = new Date();
  const projectConnections = vendorMemberConnections.map(
    (vmc) => vmc.project_connection,
  );
  let result = [...projectConnections];
  if (filter?.status) {
    // not expired project connections
    const validProjectConnections = projectConnections.filter(
      (pc) => (pc?.expired_at && now < pc.expired_at) || pc.expired_at === null,
    );

    if (filter.status === ProjectConnectionVendorExperimentStatus.UNOPEN) {
      const notiQueryTasks = validProjectConnections.map(async (pc) => {
        const notifications = await context.prisma.notification.findMany({
          where: {
            params: {
              path: ['project_connection_id'],
              equals: pc.id,
            },
            read_at: null,
            notification_type: NotificationType.ADMIN_INVITE_NOTIFICATION,
          },
        });
        return {
          ...pc,
          notifications,
        };
      });
      const projectConnectionWithNotifications =
        await Promise.all(notiQueryTasks);

      result = projectConnectionWithNotifications.filter(
        (pc) => pc.notifications.length > 0,
      );
    }

    if (filter.status === ProjectConnectionVendorExperimentStatus.PENDING) {
      result = validProjectConnections.filter(
        (pc) =>
          pc.vendor_status === ProjectConnectionVendorStatus.PENDING &&
          pc.project_request.status !== ProjectRequestStatus.WITHDRAWN,
      );
    }

    if (filter.status === ProjectConnectionVendorExperimentStatus.ONGOING) {
      result = filterByCollaborationStatus(
        projectConnections,
        ProjectConnectionCollaborationStatus.ONGOING,
      ).filter(
        (pc) =>
          pc.vendor_status === ProjectConnectionVendorStatus.ACCEPTED &&
          pc.project_request.status !== ProjectRequestStatus.WITHDRAWN,
      );
    }

    if (filter.status === ProjectConnectionVendorExperimentStatus.COMPLETED) {
      result = filterByCollaborationStatus(
        projectConnections,
        ProjectConnectionCollaborationStatus.COMPLETED,
      );
    }

    if (filter.status === ProjectConnectionVendorExperimentStatus.DECLINED) {
      result = projectConnections.filter(
        (pc) => pc.vendor_status === ProjectConnectionVendorStatus.DECLINED,
      );
    }

    if (filter.status === ProjectConnectionVendorExperimentStatus.EXPIRED) {
      result = projectConnections.filter(
        (pc) =>
          pc.project_request.status === ProjectRequestStatus.WITHDRAWN ||
          (pc.vendor_status === ProjectConnectionVendorStatus.PENDING &&
            pc?.expired_at &&
            now >= pc.expired_at),
      );
    }
  }

  // Sort & group result
  result = [
    // Accepted
    ...result.filter(
      (pc) =>
        pc.vendor_status === ProjectConnectionVendorStatus.ACCEPTED &&
        pc.project_request.status !== ProjectRequestStatus.WITHDRAWN,
    ),
    // Pending decision (Non expired)
    ...result.filter(
      (pc) =>
        pc.vendor_status === ProjectConnectionVendorStatus.PENDING &&
        pc.project_request.status !== ProjectRequestStatus.WITHDRAWN &&
        (pc.expired_at === null || (pc.expired_at && now < pc.expired_at)),
    ),
    // Expired
    ...result.filter(
      (pc) =>
        pc.vendor_status === ProjectConnectionVendorStatus.PENDING &&
        pc.project_request.status !== ProjectRequestStatus.WITHDRAWN &&
        pc.expired_at &&
        now >= pc.expired_at,
    ),
    // Withdrawn
    ...result.filter(
      (pc) =>
        pc.vendor_status === ProjectConnectionVendorStatus.DECLINED &&
        pc.project_request.status !== ProjectRequestStatus.WITHDRAWN,
    ),
    ...result.filter(
      (pc) => pc.project_request.status === ProjectRequestStatus.WITHDRAWN,
    ),
  ];

  return result.map((pc) => ({
    ...pc,
    project_request: {
      ...pc.project_request,
      max_budget: pc.project_request.max_budget?.toNumber() || 0,
    },
    quotes: pc.quotes.map((q) => ({
      ...q,
      amount: q.amount.toNumber(),
      milestones: q.milestones.map((m) => ({
        ...m,
        amount: m.amount.toNumber(),
      })),
    })),
  }));
};

export const projectConnectionService = {
  checkIfUserInProjectConnection,
  acceptProjectConnection,
  declineProjectConnection,
  getProjectConnections,
};
