import { User } from '@prisma/client';
import { PromisePool } from '@supercharge/promise-pool';
import { prisma } from '../prisma';
import { addRoleForUser } from '../helper/casbin';
import { CasbinRole } from '../helper/constant';

const main = async () => {
  try {
    const vendorCompaniesWithFirstUser = await prisma.vendorCompany.findMany({
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
    const vendorCompanyFirstUserIDs = vendorFirstUsers.map((u) => u.id);
    const vendorCompanyWithRegularUsers = await prisma.vendorCompany.findMany({
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

    await PromisePool
      .withConcurrency(10)
      .for(vendorCompanyRegularUsers)
      .process(async (u) => {
        console.log('Processing:', u.first_name, u.last_name);
        await addRoleForUser(u.id, CasbinRole.USER);
      });

    console.log('Operation done.')
  } catch (error) {
    console.log('Operation failed.')
    console.log(error)
  } finally {
    await prisma.$disconnect();
  }
  process.exit(0);
}

main();
