import { User, Prisma } from "@prisma/client";
import PromisePool from '@supercharge/promise-pool';
import { addRoleForUser } from "../helper/casbin";
import { CasbinRole, CompanyCollaboratorRoleType } from "../helper/constant";
import { prisma } from "../prisma";

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

    let upsertTaskData: Prisma.CustomerConnectionUpsertArgs[] = [];
    await prisma.$transaction(async (trx) => {
      await PromisePool
        .withConcurrency(10)
        .for(biotechFirstUsers)
        .process(async (u) => {
          console.log('Processing:', u.first_name, u.last_name);
          // Promote to owner
          const customer = await trx.customer.update({
            where: {
              user_id: u.id,
            },
            data: {
              role: CompanyCollaboratorRoleType.OWNER,
            },
          });
          console.log('Updated customer role');

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

          // Prepare upsert task
          projectConnections.map(async (pc) => {
            upsertTaskData.unshift({
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
            });
          });

          // Add casbin owner role
          await addRoleForUser(u.id, CasbinRole.OWNER);
          console.log('Done casbin role update');
        })

      console.log('Start upsert tasks');
      const upsertTasks = upsertTaskData.map(async (d) => {
        await trx.customerConnection.upsert(d);
      });
      console.log(upsertTasks.length);
      await Promise.all(upsertTasks);
    }, { timeout: 90000 });
    console.log('Operation done.')
  } catch (error) {
    console.log('Operation failed.')
    console.log(error)
  } finally {
    await prisma.$disconnect();
  }
}

main();
