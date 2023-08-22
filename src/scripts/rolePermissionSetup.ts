import { PrismaClient, User } from "@prisma/client"
import { CasbinRole, CompanyCollaboratorRoleType } from "../helper/constant";
import { addRoleForUser } from '../helper/casbin';

const prisma = new PrismaClient();

const main = async () => {
  try {
    await prisma.$transaction(async (trx) => {
      //#region Find and make first user as owner role
      const biotechsWithFirstUser = await trx.biotech.findMany({
        select: {
          customers: {
            select: {
              user: true,
            },
            orderBy: {
              user: {
                created_at: 'asc',
              },
            },
            take: 1,
          },
        },
      });
      const biotechFirstUsers = biotechsWithFirstUser.reduce<User[]>((acc, b) => {
        if (b.customers.length > 0) {
          acc.unshift(b.customers[0].user);
        }
        return acc;
      }, []);
      const updateBiotechUserTasks = biotechFirstUsers.map(async (u) => {
        // Promote to owner
        const customer = await trx.customer.update({
          where: {
            user_id: u.id,
          },
          data: {
            role: CompanyCollaboratorRoleType.OWNER,
          },
        });

        // Build customer connection if haven't
        const projectConnections = await trx.projectConnection.findMany({
          where: {
            project_request: {
              biotech_id: customer.biotech_id,
            },
            customer_connections: {
              none: {
                customer_id: customer.id,
              }
            }
          },
        });
        const upsertTasks = projectConnections.map(async (pc) => {
          return await trx.customerConnection.upsert({
            create: {
              customer_id: customer.id,
              project_connection_id: pc.id,
            },
            update: {
              customer_id: customer.id,
              project_connection_id: pc.id,
            },
            where: {
              project_connection_id_customer_id: {
                customer_id: customer.id,
                project_connection_id: pc.id,
              }
            }
          })
        });
        await Promise.all(upsertTasks);

        // Add casbin owner role
        await addRoleForUser(u.id, CasbinRole.OWNER);
      });

      const vendorCompaniesWithFirstUser = await trx.vendorCompany.findMany({
        select: {
          vendor_members: {
            select: {
              user: true,
            },
            orderBy: {
              user: {
                created_at: 'asc',
              },
            },
            take: 1,
          },
        },
      });
      const vendorFirstUsers = vendorCompaniesWithFirstUser.reduce<User[]>((acc, b) => {
        if (b.vendor_members.length > 0) {
          acc.unshift(b.vendor_members[0].user);
        }
        return acc;
      }, []);
      const updateVendorUserTasks = vendorFirstUsers.map(async (u) => {
        // Promote to owner
        const vendorMember = await trx.vendorMember.update({
          where: {
            user_id: u.id,
          },
          data: {
            role: CompanyCollaboratorRoleType.OWNER,
          },
        });

        // Build vendor member connection if haven't
        const projectConnections = await trx.projectConnection.findMany({
          where: {
            vendor_company_id: vendorMember.vendor_company_id,
            vendor_member_connections: {
              none: {
                vendor_member_id: vendorMember.id,
              },
            },
          },
        });
        const upsertTasks = projectConnections.map(async (pc) => {
          await trx.vendorMemberConnection.upsert({
            create: {
              vendor_member_id: vendorMember.id,
              project_connection_id: pc.id,
            },
            update: {
              vendor_member_id: vendorMember.id,
              project_connection_id: pc.id,
            },
            where: {
              project_connection_id_vendor_member_id: {
                vendor_member_id: vendorMember.id,
                project_connection_id: pc.id,
              },
            },
          });
        });
        await Promise.all(upsertTasks);

        // Add casbin owner role
        await addRoleForUser(u.id, CasbinRole.OWNER);
      });
      await Promise.all([...updateBiotechUserTasks, ...updateVendorUserTasks]);
      //#endregion

      //#region Find and make regular user as user role
      const biotechFirstUserIDs = biotechFirstUsers.map((u) => u.id);
      const biotechWithRegularUsers = await trx.biotech.findMany({
        select: {
          customers: {
            select: {
              user: true,
            },
            where: {
              user_id: {
                notIn: biotechFirstUserIDs,
              },
            },
          },
        },
      });
      const biotechRegularUsers = biotechWithRegularUsers.reduce<User[]>((acc, b) => {
        if (b.customers.length > 0) {
          const users = b.customers.map((c) => c.user);
          acc.unshift(...users);
        }
        return acc;
      }, []);
      const updateBiotechRegularUserTasks = biotechRegularUsers.map(async (u) => {
        await addRoleForUser(u.id, CasbinRole.USER);
      });
      await Promise.all(updateBiotechRegularUserTasks);

      const vendorCompanyFirstUserIDs = vendorFirstUsers.map((u) => u.id);
      const vendorCompanyWithRegularUsers = await trx.vendorCompany.findMany({
        select: {
          vendor_members: {
            select: {
              user: true,
            },
            where: {
              user_id: {
                notIn: vendorCompanyFirstUserIDs,
              },
            },
          },
        },
      });
      const vendorCompanyRegularUsers = vendorCompanyWithRegularUsers.reduce<User[]>((acc, v) => {
        if (v.vendor_members.length > 0) {
          const users = v.vendor_members.map((vm) => vm.user);
          acc.unshift(...users);
        }
        return acc;
      }, []);
      const updateVendorCompanyRegularUserTasks = vendorCompanyRegularUsers.map(async (u) => {
        await addRoleForUser(u.id, CasbinRole.USER);
      });
      await Promise.all(updateVendorCompanyRegularUserTasks);
      //#endregion

      console.log('Operation succeeded.')
    });
  } catch (error) {
    console.log('Operation failed.')
    console.log(error)
  } finally {
    await prisma.$disconnect();
  }
  process.exit(0);
}

main();
