import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  try {
    await prisma.$transaction(async (trx) => {
      const allProjectRequests = await trx.projectRequest.findMany();
      const upsertProjectRequestCollaborators = allProjectRequests.map(async (request) => {
        return await trx.projectRequestCollaborator.upsert({
          create: {
            customer_id: request.customer_id,
            project_request_id: request.id,
          },
          update: {
            customer_id: request.customer_id,
            project_request_id: request.id,
          },
          where: {
            project_request_id_customer_id: {
              customer_id: request.customer_id,
              project_request_id: request.id,
            }
          }
        })
      });

      await Promise.all(upsertProjectRequestCollaborators);
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
