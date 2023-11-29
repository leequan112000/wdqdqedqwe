import { CasbinAct, CasbinObj, CasbinRole, CompanyCollaboratorRoleType } from "../../helper/constant";
import { hasPermission, updateRoleForUser } from "../../helper/casbin";
import { PermissionDeniedError } from "../../graphql/errors/PermissionDeniedError";
import invariant from "../../helper/invariant";
import { InternalError } from "../../graphql/errors/InternalError";
import { ServiceContext } from "../../types/context";

type SetCustomerRoleAsAdminArgs = {
  biotech_id: string;
  customer_id: string;
  user_id: string;
}

const setCustomerAsAdmin = async (args: SetCustomerRoleAsAdminArgs, ctx: ServiceContext) => {
  const { biotech_id, customer_id, user_id } = args;

  const projectConnections = await ctx.prisma.projectConnection.findMany({
    where: {
      project_request: {
        biotech_id,
      },
      customer_connections: {
        none: {
          customer_id,
        }
      }
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
        }
      }
    })
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
}

type SetCustomerRoleAsUser = {
  customer_id: string;
}

const setCustomerAsUser = async (args: SetCustomerRoleAsUser, ctx: ServiceContext) => {
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
}

type SetCustomerRoleAsOwner = {
  customer_id: string;
}

const setCustomerAsOwner = async (args: SetCustomerRoleAsOwner, ctx: ServiceContext) => {
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
}

type SetVendorMemberRoleAsAdminArgs = {
  vendor_company_id: string;
  vendor_member_id: string;
  user_id: string;
}

const setVendorMemberAsAdmin = async (args: SetVendorMemberRoleAsAdminArgs, ctx: ServiceContext) => {
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
}

type SetVendorMemberAsUser = {
  vendor_member_id: string;
}

const setVendorMemberAsUser = async (args: SetVendorMemberAsUser, ctx: ServiceContext) => {
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
}

type SetVendorMemberAsOwner = {
  vendor_member_id: string;
}

const setVendorMemberAsOwner = async (args: SetVendorMemberAsOwner, ctx: ServiceContext) => {
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
}

type CheckPermissionToEditRoleArgs = {
  user_id: string;
  role: CompanyCollaboratorRoleType;
}

const checkPermissionToEditRole = async (args: CheckPermissionToEditRoleArgs) => {
  const { user_id, role } = args;

  switch (role) {
    case CompanyCollaboratorRoleType.USER: {
      const allow = await hasPermission(user_id, CasbinObj.COMPANY_COLLABORATOR_USER, CasbinAct.WRITE);
      invariant(allow, new PermissionDeniedError());
      break;
    }
    case CompanyCollaboratorRoleType.ADMIN: {
      const allow = await hasPermission(user_id, CasbinObj.COMPANY_COLLABORATOR_ADMIN, CasbinAct.WRITE);
      invariant(allow, new PermissionDeniedError());
      break;
    }
    default: {
      throw new InternalError('User has invalid role.');
    }
  }
}

type UpdateUserRoleArgs = {
  user_id: string;
  role: CompanyCollaboratorRoleType;
}

const updateUserRole = async (args: UpdateUserRoleArgs, ctx: ServiceContext) => {
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
        await setCustomerAsAdmin({
          biotech_id: user.customer!.biotech_id,
          customer_id: user.customer!.id,
          user_id
        }, ctx);
      }
      if (isVendor) {
        await setVendorMemberAsAdmin({
          user_id,
          vendor_company_id: user.vendor_member!.vendor_company_id,
          vendor_member_id: user.vendor_member!.id,
        }, ctx)
      }
      break;
    }
    case CompanyCollaboratorRoleType.USER: {
      if (isBiotech) {
        await setCustomerAsUser({
          customer_id: user.customer!.id,
        }, ctx);
      }
      if (isVendor) {
        await setVendorMemberAsUser({
          vendor_member_id: user.vendor_member!.id,
        }, ctx);
      }
      break;
    }
    default:
      throw new InternalError('Invalid role.');
  }
}

const collaboratorService = {
  setCustomerAsAdmin,
  setCustomerAsUser,
  setCustomerAsOwner,
  setVendorMemberAsAdmin,
  setVendorMemberAsUser,
  setVendorMemberAsOwner,
  checkPermissionToEditRole,
  updateUserRole,
}

export default collaboratorService;
