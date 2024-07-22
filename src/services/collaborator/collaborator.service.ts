import {
  CasbinAct,
  CasbinObj,
  CasbinRole,
  CompanyCollaboratorRoleType,
} from '../../helper/constant';
import {
  hasPermission,
  updateRoleForUser,
  deleteRolesForUser,
} from '../../helper/casbin';
import { PermissionDeniedError } from '../../graphql/errors/PermissionDeniedError';
import invariant from '../../helper/invariant';
import { InternalError } from '../../graphql/errors/InternalError';
import { Context, ServiceContext } from '../../types/context';
import {
  checkAllowAddProjectCollaborator,
  checkAllowRemoveProjectCollaborator,
} from '../../helper/accessControl';
import { app_env } from '../../environment';
import {
  customerInvitationEmail,
  projectCollaboratorInvitationEmail,
  vendorMemberInvitationByUserEmail,
} from '../../mailer';
import createCollaboratedNotification from '../../notification/collaboratedNotification';
import { PublicError } from '../../graphql/errors/PublicError';
import { createResetPasswordToken } from '../../helper/auth';
import { getUserFullName, createResetPasswordUrl } from '../../helper/email';

type SetCustomerRoleAsAdminArgs = {
  biotech_id: string;
  customer_id: string;
  user_id: string;
};

const setCustomerAsAdmin = async (
  args: SetCustomerRoleAsAdminArgs,
  ctx: ServiceContext,
) => {
  const { biotech_id, customer_id, user_id } = args;

  const projectConnections = await ctx.prisma.projectConnection.findMany({
    where: {
      project_request: {
        biotech_id,
      },
      customer_connections: {
        none: {
          customer_id,
        },
      },
    },
  });

  // Create customer connections to all matched project
  const upsertTasks = projectConnections.map(async (pc) => {
    return await ctx.prisma.customerConnection.upsert({
      create: {
        customer_id,
        project_connection_id: pc.id,
      },
      update: {
        customer_id,
        project_connection_id: pc.id,
      },
      where: {
        project_connection_id_customer_id: {
          customer_id,
          project_connection_id: pc.id,
        },
      },
    });
  });
  await Promise.all(upsertTasks);

  // Remove customer from all project request collaborator lists
  await ctx.prisma.projectRequestCollaborator.deleteMany({
    where: {
      customer_id,
    },
  });

  // Update customer role to admin
  const updatedCustomer = await ctx.prisma.customer.update({
    where: {
      user_id,
    },
    data: {
      role: CompanyCollaboratorRoleType.ADMIN,
    },
  });

  await updateRoleForUser(user_id, CasbinRole.ADMIN);

  return updatedCustomer;
};

type SetCustomerRoleAsUser = {
  customer_id: string;
};

const setCustomerAsUser = async (
  args: SetCustomerRoleAsUser,
  ctx: ServiceContext,
) => {
  const { customer_id } = args;
  const updatedCustomer = await ctx.prisma.customer.update({
    where: {
      id: customer_id,
    },
    data: {
      role: CompanyCollaboratorRoleType.USER,
    },
  });

  await updateRoleForUser(updatedCustomer.user_id, CasbinRole.USER);

  return updatedCustomer;
};

type SetCustomerRoleAsOwner = {
  customer_id: string;
};

const setCustomerAsOwner = async (
  args: SetCustomerRoleAsOwner,
  ctx: ServiceContext,
) => {
  const { customer_id } = args;
  const updatedCustomer = await ctx.prisma.customer.update({
    where: {
      id: customer_id,
    },
    data: {
      role: CompanyCollaboratorRoleType.OWNER,
    },
  });

  await updateRoleForUser(updatedCustomer.user_id, CasbinRole.OWNER);

  return updatedCustomer;
};

type SetVendorMemberRoleAsAdminArgs = {
  vendor_company_id: string;
  vendor_member_id: string;
  user_id: string;
};

const setVendorMemberAsAdmin = async (
  args: SetVendorMemberRoleAsAdminArgs,
  ctx: ServiceContext,
) => {
  const { vendor_company_id, vendor_member_id, user_id } = args;

  const projectConnections = await ctx.prisma.projectConnection.findMany({
    where: {
      vendor_company_id: vendor_company_id,
      vendor_member_connections: {
        none: {
          vendor_member_id: vendor_member_id,
        },
      },
    },
  });

  // Create vendor member connection to all project connections
  const upsertTasks = projectConnections.map(async (pc) => {
    await ctx.prisma.vendorMemberConnection.upsert({
      create: {
        vendor_member_id: vendor_member_id,
        project_connection_id: pc.id,
      },
      update: {
        vendor_member_id: vendor_member_id,
        project_connection_id: pc.id,
      },
      where: {
        project_connection_id_vendor_member_id: {
          vendor_member_id: vendor_member_id,
          project_connection_id: pc.id,
        },
      },
    });
  });

  await Promise.all(upsertTasks);

  // Update vendor member role to admin
  const updatedVendorMember = await ctx.prisma.vendorMember.update({
    where: {
      user_id: user_id,
    },
    data: {
      role: CompanyCollaboratorRoleType.ADMIN,
    },
  });

  await updateRoleForUser(user_id, CasbinRole.ADMIN);

  return updatedVendorMember;
};

type SetVendorMemberAsUser = {
  vendor_member_id: string;
};

const setVendorMemberAsUser = async (
  args: SetVendorMemberAsUser,
  ctx: ServiceContext,
) => {
  const { vendor_member_id } = args;

  const updatedVendorMember = await ctx.prisma.vendorMember.update({
    where: {
      id: vendor_member_id,
    },
    data: {
      role: CompanyCollaboratorRoleType.USER,
    },
  });

  await updateRoleForUser(updatedVendorMember.user_id, CasbinRole.USER);

  return updatedVendorMember;
};

type SetVendorMemberAsOwner = {
  vendor_member_id: string;
};

const setVendorMemberAsOwner = async (
  args: SetVendorMemberAsOwner,
  ctx: ServiceContext,
) => {
  const { vendor_member_id } = args;

  const updatedVendorMember = await ctx.prisma.vendorMember.update({
    where: {
      id: vendor_member_id,
    },
    data: {
      role: CompanyCollaboratorRoleType.OWNER,
    },
  });

  await updateRoleForUser(updatedVendorMember.user_id, CasbinRole.OWNER);

  return updatedVendorMember;
};

type CheckPermissionToEditRoleArgs = {
  user_id: string;
  role: CompanyCollaboratorRoleType;
};

const checkPermissionToEditRole = async (
  args: CheckPermissionToEditRoleArgs,
) => {
  const { user_id, role } = args;

  switch (role) {
    case CompanyCollaboratorRoleType.USER: {
      const allow = await hasPermission(
        user_id,
        CasbinObj.COMPANY_COLLABORATOR_USER,
        CasbinAct.WRITE,
      );
      invariant(allow, new PermissionDeniedError());
      break;
    }
    case CompanyCollaboratorRoleType.ADMIN: {
      const allow = await hasPermission(
        user_id,
        CasbinObj.COMPANY_COLLABORATOR_ADMIN,
        CasbinAct.WRITE,
      );
      invariant(allow, new PermissionDeniedError());
      break;
    }
    default: {
      throw new InternalError('User has invalid role.');
    }
  }
};

type UpdateUserRoleArgs = {
  user_id: string;
  role: CompanyCollaboratorRoleType;
};

const updateUserRole = async (
  args: UpdateUserRoleArgs,
  ctx: ServiceContext,
) => {
  const { role, user_id } = args;
  const user = await ctx.prisma.user.findFirst({
    where: {
      id: user_id,
    },
    include: {
      customer: true,
      vendor_member: true,
    },
  });

  invariant(user, 'User not found.');

  const isBiotech = !!user.customer;
  const isVendor = !!user.vendor_member;

  switch (role) {
    case CompanyCollaboratorRoleType.ADMIN: {
      if (isBiotech) {
        await setCustomerAsAdmin(
          {
            biotech_id: user.customer!.biotech_id,
            customer_id: user.customer!.id,
            user_id,
          },
          ctx,
        );
      }
      if (isVendor) {
        await setVendorMemberAsAdmin(
          {
            user_id,
            vendor_company_id: user.vendor_member!.vendor_company_id,
            vendor_member_id: user.vendor_member!.id,
          },
          ctx,
        );
      }
      break;
    }
    case CompanyCollaboratorRoleType.USER: {
      if (isBiotech) {
        await setCustomerAsUser(
          {
            customer_id: user.customer!.id,
          },
          ctx,
        );
      }
      if (isVendor) {
        await setVendorMemberAsUser(
          {
            vendor_member_id: user.vendor_member!.id,
          },
          ctx,
        );
      }
      break;
    }
    default:
      throw new InternalError('Invalid role.');
  }
};

type DeleteNewUserArgs = {
  user_id: string;
};

/**
 * Delete a newly invited user that hasn't complete the account creation.
 */
const deleteNewUser = async (args: DeleteNewUserArgs, ctx: ServiceContext) => {
  await ctx.prisma.user.delete({
    where: {
      id: args.user_id,
    },
  });

  await deleteRolesForUser(args.user_id);
};

type AddProjectCollaboratorArgs = {
  project_connection_id: string;
  user_id: string;
};

const addProjectCollaborator = async (
  args: AddProjectCollaboratorArgs,
  context: Context,
) => {
  const { project_connection_id, user_id } = args;

  await checkAllowAddProjectCollaborator(context);

  const currentUser = await context.prisma.user.findFirst({
    where: {
      id: context.req.user_id,
    },
  });

  invariant(currentUser, 'Current user not found.');

  const user = await context.prisma.user.findFirst({
    where: {
      id: user_id,
    },
    include: {
      customer: true,
      vendor_member: true,
      notifications: true,
    },
  });

  invariant(user, 'User not found.');

  if (user.customer || user.vendor_member) {
    if (user?.customer) {
      await context.prisma.customerConnection.upsert({
        where: {
          project_connection_id_customer_id: {
            customer_id: user.customer.id,
            project_connection_id,
          },
        },
        create: {
          customer_id: user.customer.id,
          project_connection_id,
        },
        update: {
          customer_id: user.customer.id,
          project_connection_id,
        },
      });
    } else if (user?.vendor_member) {
      await context.prisma.vendorMemberConnection.upsert({
        where: {
          project_connection_id_vendor_member_id: {
            vendor_member_id: user.vendor_member.id,
            project_connection_id,
          },
        },
        create: {
          vendor_member_id: user.vendor_member.id,
          project_connection_id,
        },
        update: {
          vendor_member_id: user.vendor_member.id,
          project_connection_id,
        },
      });
    }

    const projectConnection = await context.prisma.projectConnection.findFirst({
      where: {
        id: project_connection_id,
      },
      include: {
        project_request: {
          select: {
            title: true,
          },
        },
      },
    });

    if (projectConnection) {
      projectCollaboratorInvitationEmail(
        {
          login_url: `${app_env.APP_URL}/app/project-connection/${project_connection_id}`,
          inviter_full_name: `${currentUser.first_name} ${currentUser.last_name}`,
          project_title: projectConnection.project_request.title,
          receiver_full_name: `${user.first_name} ${user.last_name}`,
        },
        user.email,
      );

      try {
        createCollaboratedNotification(
          currentUser.id,
          user.id,
          projectConnection.id,
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      // no-op
      // TODO: report to bug channel
    }

    return user;
  }

  throw new InternalError('User is not customer nor vendor member');
};

const removeProjectCollaborator = async (
  args: AddProjectCollaboratorArgs,
  context: Context,
) => {
  const { project_connection_id, user_id } = args;

  await checkAllowRemoveProjectCollaborator(context);

  const user = await context.prisma.user.findFirst({
    where: {
      id: user_id,
    },
    include: {
      customer: true,
      vendor_member: true,
    },
  });

  invariant(user, 'User not found.');

  if (user.customer) {
    await context.prisma.customerConnection.delete({
      where: {
        project_connection_id_customer_id: {
          customer_id: user.customer.id,
          project_connection_id,
        },
      },
    });
    return user;
  }

  if (user.vendor_member) {
    await context.prisma.vendorMemberConnection.delete({
      where: {
        project_connection_id_vendor_member_id: {
          vendor_member_id: user.vendor_member.id,
          project_connection_id,
        },
      },
    });
    return user;
  }

  throw new InternalError('User is not customer nor vendor member');
};

type InviteProjectCollaboratorViaEmailArgs = {
  project_connection_id: string;
  email: string;
  name: string;
  custom_message?: string | null;
  role?: string | null;
};
export const inviteProjectCollaboratorViaEmail = async (
  args: InviteProjectCollaboratorViaEmailArgs,
  context: Context,
) => {
  const currentUserId = context.req.user_id;
  const { project_connection_id, email, name, custom_message, role } = args;
  const castedRole =
    (role as CompanyCollaboratorRoleType) || CompanyCollaboratorRoleType.USER;

  invariant(currentUserId, 'Current user id not found.');

  // Check if current user has the permission to set the role.
  if (castedRole) {
    const roleEnum = Object.values(CompanyCollaboratorRoleType);
    invariant(
      roleEnum.includes(castedRole as CompanyCollaboratorRoleType),
      'Invalid company collaborator role.',
    );
    await collaboratorService.checkPermissionToEditRole({
      role: castedRole,
      user_id: currentUserId,
    });
  }

  await checkAllowAddProjectCollaborator(context);

  const currentUser = await context.prisma.user.findFirst({
    where: {
      id: currentUserId,
    },
    include: {
      customer: true,
      vendor_member: true,
    },
  });

  invariant(currentUser, 'Current user not found.');

  const existingUser = await context.prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      customer: true,
      vendor_member: true,
    },
  });

  if (existingUser) {
    // If user exists and same company as the current user.
    if (
      (existingUser.customer &&
        existingUser.customer?.biotech_id ===
          currentUser.customer?.biotech_id) ||
      (existingUser.vendor_member &&
        existingUser.vendor_member.vendor_company_id ===
          currentUser.vendor_member?.vendor_company_id)
    ) {
      throw new PublicError('User already exists.');
    } else {
      // If user exists but not the same company as the current user.
      throw new PublicError(
        'Please make sure the user is belong to your company.',
      );
    }
  }

  const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  const resetToken = createResetPasswordToken();

  const isBiotech = !!currentUser.customer;
  const isVendor = !!currentUser.vendor_member;

  // If user doesn't exists
  // 1. Create new user
  // 2. Create customer/vendor member connection
  // 3. Send invitation email
  return await context.prisma.$transaction(async (trx) => {
    const splitName = args.name.split(' ');
    const firstName = splitName[0];
    const lastName =
      splitName.length === 1 ? '' : splitName[splitName.length - 1];

    const newUser = await trx.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        reset_password_token: resetToken,
        reset_password_expiration: new Date(resetTokenExpiration),
        customer: isBiotech
          ? {
              create: {
                biotech_id: currentUser.customer!.biotech_id,
                customer_connections: {
                  create: {
                    project_connection_id,
                  },
                },
              },
            }
          : undefined,
        vendor_member: isVendor
          ? {
              create: {
                vendor_company_id: currentUser.vendor_member!.vendor_company_id,
                vendor_member_connections: {
                  create: {
                    project_connection_id,
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        customer: true,
        vendor_member: true,
      },
    });
    const emailMessage = custom_message || '';

    const newUserFullName = getUserFullName(newUser);
    const resetPasswordUrl = createResetPasswordUrl(resetToken);
    const currentUserFullName = getUserFullName(currentUser);

    // Send email
    if (isBiotech) {
      customerInvitationEmail(
        {
          inviter_full_name: currentUserFullName,
          inviter_message: emailMessage,
          login_url: resetPasswordUrl,
          receiver_full_name: newUserFullName,
        },
        newUser.email,
      );
    }
    if (isVendor) {
      vendorMemberInvitationByUserEmail(
        {
          inviter_full_name: currentUserFullName,
          inviter_message: emailMessage,
          login_url: resetPasswordUrl,
          receiver_full_name: newUserFullName,
        },
        newUser.email,
      );
    }

    // Update company role and casbin role
    await collaboratorService.updateUserRole(
      {
        role: castedRole,
        user_id: newUser.id,
      },
      { prisma: trx },
    );

    // Create notification
    createCollaboratedNotification(
      currentUser.id,
      newUser.id,
      project_connection_id,
    );

    return newUser;
  });
};

const collaboratorService = {
  setCustomerAsAdmin,
  setCustomerAsUser,
  setCustomerAsOwner,
  setVendorMemberAsAdmin,
  setVendorMemberAsUser,
  setVendorMemberAsOwner,
  checkPermissionToEditRole,
  updateUserRole,
  deleteNewUser,
  addProjectCollaborator,
  removeProjectCollaborator,
  inviteProjectCollaboratorViaEmail,
};

export default collaboratorService;
