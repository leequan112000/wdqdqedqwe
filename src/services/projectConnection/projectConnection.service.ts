import { app_env } from '../../environment';
import { PermissionDeniedError } from '../../graphql/errors/PermissionDeniedError';
import { PublicError } from '../../graphql/errors/PublicError';
import { hasPermission } from '../../helper/casbin';
import {
  CasbinAct,
  CasbinObj,
  ProjectConnectionVendorStatus,
  ProjectRequestStatus,
} from '../../helper/constant';
import invariant from '../../helper/invariant';
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
            receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
            project_title: projectConnection.project_request.title,
            vendor_company_name: vendor.vendor_company?.name as string,
          },
          receiver.email,
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

export const declineProjectConnection = async (
  args: AcceptProjectConnectionArgs,
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

export const projectConnectionService = {
  checkIfUserInProjectConnection,
  acceptProjectConnection,
  declineProjectConnection,
};
