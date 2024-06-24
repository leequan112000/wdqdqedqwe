import { Prisma, User } from '@prisma/client';
import { PromisePool } from '@supercharge/promise-pool';
import { addRoleForUser } from '../helper/casbin';
import { CasbinRole, CompanyCollaboratorRoleType } from '../helper/constant';
import { prisma } from '../prisma';

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
    const vendorFirstUsers = vendorCompaniesWithFirstUser.reduce<User[]>(
      (acc, b) => {
        if (b.vendor_members.length > 0) {
          acc.unshift(b.vendor_members[0].user);
        }
        return acc;
      },
      [],
    );

    let upsertTaskData: Prisma.VendorMemberConnectionUpsertArgs[] = [];
    await prisma.$transaction(
      async (trx) => {
        await PromisePool.withConcurrency(10)
          .for(vendorFirstUsers)
          .process(async (u) => {
            console.log('Processing:', u.first_name, u.last_name);

            // Promote to owner
            const vendorMember = await trx.vendorMember.update({
              where: {
                user_id: u.id,
              },
              data: {
                role: CompanyCollaboratorRoleType.OWNER,
              },
            });
            console.log('Updated vendor member role');

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

            projectConnections.map((pc) => {
              upsertTaskData.unshift({
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
            await addRoleForUser(u.id, CasbinRole.OWNER);
            console.log('Done casbin role update');
          });

        console.log('Start upsert tasks');
        const upsertTasks = upsertTaskData.map(async (d) => {
          await trx.vendorMemberConnection.upsert(d);
        });
        await Promise.all(upsertTasks);
      },
      { timeout: 90000 },
    );

    console.log('Operation done.');
  } catch (error) {
    console.log('Operation failed.');
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
