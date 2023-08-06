import { Prisma, PrismaClient } from "@prisma/client";
import { CasbinRole, CompanyCollaboratorRoleType } from "../../helper/constant";
import { updateRoleForUser } from "../../helper/casbin";

interface ServiceContext {
  prisma: PrismaClient | Prisma.TransactionClient
}

type PromoteCustomerToAdminArgs = {
  biotech_id: string;
  customer_id: string;
  user_id: string;
}

const promoteCustomerToAdmin = async (args: PromoteCustomerToAdminArgs, ctx: ServiceContext) => {
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

type PromoteVendorMemberToAdminArgs = {
  vendor_company_id: string;
  vendor_member_id: string;
  user_id: string;
}

const promoteVendorMemberToAdmin = async (args: PromoteVendorMemberToAdminArgs, ctx: ServiceContext) => {
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

const collaboratorService = {
  promoteCustomerToAdmin,
  promoteVendorMemberToAdmin,
}

export default collaboratorService;
