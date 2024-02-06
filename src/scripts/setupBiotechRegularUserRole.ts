import { User } from '@prisma/client';
import { PromisePool } from '@supercharge/promise-pool';
import { prisma } from '../prisma';
import { addRoleForUser } from '../helper/casbin';
import { CasbinRole } from '../helper/constant';

const main = async () => {
  try {
    const biotechsWithFirstUser = await prisma.biotech.findMany({
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
    const biotechFirstUserIDs = biotechFirstUsers.map((u) => u.id);
    const biotechWithRegularUsers = await prisma.biotech.findMany({
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

    await PromisePool
      .withConcurrency(10)
      .for(biotechRegularUsers)
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
