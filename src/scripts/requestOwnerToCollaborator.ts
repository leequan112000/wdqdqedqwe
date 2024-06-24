import { PrismaClient } from '@prisma/client';
import { PromisePool } from '@supercharge/promise-pool';

const prisma = new PrismaClient();

const main = async () => {
  try {
    const allProjectRequests = await prisma.projectRequest.findMany();
    await prisma.$transaction(
      async (trx) => {
        await PromisePool.withConcurrency(10)
          .for(allProjectRequests)
          .process(async (request) => {
            console.log('Processing:', request.title);

            await trx.projectRequestCollaborator.upsert({
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
                },
              },
            });
          });

        console.log('Operation succeeded.');
      },
      { timeout: 90000 },
    );
  } catch (error) {
    console.log('Operation failed.');
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
  process.exit(0);
};

main();
