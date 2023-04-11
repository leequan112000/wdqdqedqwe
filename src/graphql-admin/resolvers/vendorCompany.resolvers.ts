import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { PublicError } from "../../graphql/errors/PublicError";
import { User, VendorMember } from "@prisma/client";
import { sendVendorMemberProjectRequestInvitationByAdminEmail } from "../../mailer/vendorMember";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createVendorCompany: async (_, args, context) => {
      return await context.prisma.vendorCompany.create({
        data: {
          name: args.name,
          website: args.website,
          description: args.description,
          address: args.address,
        }
      });
    },
    inviteVendorCompaniesToProjectByAdmin: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const projectRequest = await trx.projectRequest.findFirst({
          where: {
            id: args.project_request_id
          }
        });

        if (!projectRequest) {
          throw new PublicError('Invalid project request ID.');
        }

        let primaryVendorMembers: (VendorMember & {user: User })[] = [];
        await Promise.all(
          args.vendor_company_ids.map(async (vendor_company_id) => {
            const primaryVendorMember = await trx.vendorMember.findFirst({
              where: {
                vendor_company_id: vendor_company_id as string,
                is_primary_member: true,
              },
              include: {
                user: true,
              }
            });

            if (!primaryVendorMember) {
              throw new PublicError('No primary vendor member found.');
            }

            const projectConnection = await trx.projectConnection.create({
              data: {
                project_request_id: args.project_request_id,
                vendor_company_id: vendor_company_id as string,
              }
            });

            if (!projectConnection) {
              throw new PublicError('There was an error while creating the project connection.');
            }

            await trx.vendorMemberConnection.create({
              data: {
                project_connection_id: projectConnection.id,
                vendor_member_id: primaryVendorMember.id,
              }
            });

            await trx.customerConnection.create({
              data: {
                project_connection_id: projectConnection.id,
                customer_id: projectRequest.customer_id,
              }
            });

            primaryVendorMembers.push(primaryVendorMember);
          })
        );

        await Promise.all(
          primaryVendorMembers.map((primaryVendorMember) => {
            // TODO: use queue & send notification to vendor members
            sendVendorMemberProjectRequestInvitationByAdminEmail(projectRequest, primaryVendorMember.user);
          })
        );
        return true;
      });
    },
  }
}

export default resolvers;
