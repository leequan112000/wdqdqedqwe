import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { encrypt } from '../helper/gdprHelper';
async function encryptUserPIIField() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: encrypt(user.email),
        first_name: user.first_name ? encrypt(user.first_name!) : null,
        last_name: user.last_name ? encrypt(user.last_name!) : null,
        phone_number: user.phone_number ? encrypt(user.phone_number!) : null,
        country_code: user.country_code ? encrypt(user.country_code!) : null,
      },
    });
  }
}

encryptUserPIIField()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
