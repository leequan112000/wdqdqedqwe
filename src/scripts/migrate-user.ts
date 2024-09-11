import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { encrypt } from '../helper/gdprHelper';
async function migrateUsersToPseudonyms() {
  const pseudonyms = await prisma.userPseudonyms.findMany();
  for (const pseudonym of pseudonyms) {
    console.log(pseudonym);
    await prisma.userPseudonyms.update({
      where: {
        id: pseudonym.id,
      },
      data: {
        email: encrypt(pseudonym.email),
        first_name: pseudonym.first_name
          ? encrypt(pseudonym.first_name!)
          : null,
        last_name: pseudonym.last_name ? encrypt(pseudonym.last_name!) : null,
        phone_number: pseudonym.phone_number
          ? encrypt(pseudonym.phone_number!)
          : null,
        country_code: pseudonym.country_code
          ? encrypt(pseudonym.country_code!)
          : null,
      },
    });
  }
}

migrateUsersToPseudonyms()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
