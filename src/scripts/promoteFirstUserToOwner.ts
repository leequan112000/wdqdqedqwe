import { PrismaClient, User } from "@prisma/client"
import { CasbinRole, CompanyCollaboratorRoleType } from "../helper/constant";
import { addRoleForUser } from '../helper/casbin';

const prisma = new PrismaClient();

const promoteFirstUserToOwner = async () => {
  try {
    await prisma.$transaction(async (trx) => {
      const biotechs = await trx.biotech.findMany({
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

      const biotechUsers = biotechs.reduce<User[]>((acc, b) => {
        if (b.customers.length > 0) {
          acc.unshift(b.customers[0].user);
        }
        return acc;
      }, []);

      const vendorCompanies = await trx.vendorCompany.findMany({
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

      const vendorUsers = vendorCompanies.reduce<User[]>((acc, b) => {
        if (b.vendor_members.length > 0) {
          acc.unshift(b.vendor_members[0].user);
        }
        return acc;
      }, []);

      const updateBiotechUserTasks = biotechUsers.map(async (u) => {
        await trx.customer.update({
          where: {
            user_id: u.id,
          },
          data: {
            role: CompanyCollaboratorRoleType.OWNER,
          },
        });

        await addRoleForUser(u.id, CasbinRole.OWNER);
      });

      const updateVendorUserTasks = vendorUsers.map(async (u) => {
        await trx.vendorMember.update({
          where: {
            user_id: u.id,
          },
          data: {
            role: CompanyCollaboratorRoleType.OWNER,
          },
        });

        await addRoleForUser(u.id, CasbinRole.OWNER);
      });

      await Promise.all([...updateBiotechUserTasks, ...updateVendorUserTasks]);

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

promoteFirstUserToOwner();
