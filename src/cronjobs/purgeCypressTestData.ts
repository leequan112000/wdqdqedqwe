import { prisma } from '../prisma';
import userService from '../services/user/user.service';

async function main() {
  const cypressUsers = await prisma.user.findMany({
    where: {
      first_name: 'Cypress',
    },
  });

  for (const user of cypressUsers) {
    await prisma.$transaction(
      async (trx) => {
        return userService.purgeTestDataByUser(
          {
            user_id: user.id,
          },
          {
            prisma: trx,
          },
        );
      },
      {
        maxWait: 10000,
        timeout: 40000,
      },
    );
  }

  process.exit(0);
}

main();
