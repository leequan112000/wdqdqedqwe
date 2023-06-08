import moment from "moment";
import { Context } from "../../types/context";
import { ProjectConnectionVendorStatus, ProjectRequestStatus } from "../../helper/constant";
import { Resolvers } from "../../generated";
import { PublicError } from "../../graphql/errors/PublicError";
import { createSendAdminProjectInvitationJob } from "../../queues/email.queues";

const PROJECT_REQUEST_RESPONSE_PERIOD = 14; // in day

const resolvers: Resolvers<Context> = {
  Mutation: {
    createVendorCompany: async (_, args, context) => {
      return await context.prisma.vendorCompany.create({
        data: {
          name: args.name,
          website: args.website,
          description: args.description,
          address: args.address,
          vendor_type: args.vendor_type,
          skip_cda: args.skip_cda || false,
        }
      });
    },
    inviteVendorCompaniesToProjectByAdmin: async (_, args, context) => {
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: args.project_request_id
        }
      });

      if (!projectRequest) {
        throw new PublicError('Invalid project request ID.');
      }

      if (projectRequest.status === ProjectRequestStatus.WITHDRAWN) {
        throw new PublicError('Project request has already been withdrawn.');
      }

      const newExpiryDate = moment().add(PROJECT_REQUEST_RESPONSE_PERIOD, 'd').endOf('d');

      await Promise.all(
        args.vendor_company_ids.map(async (vendor_company_id) => {
          // trycatch to prevent single error breaking all the promises
          try {
            await context.prisma.$transaction(async (trx) => {
              // Check existing project connection
              const existingProjectConnection = await trx.projectConnection.findFirst({
                where: {
                  project_request_id: projectRequest.id,
                  vendor_company_id: vendor_company_id!,
                }
              });

              if (existingProjectConnection) {
                throw new PublicError('Project connection exists');
              }
              const primaryVendorMembers = await trx.vendorMember.findMany({
                where: {
                  vendor_company_id: vendor_company_id as string,
                  is_primary_member: true,
                },
                include: {
                  user: true,
                }
              });

              if (!primaryVendorMembers) {
                throw new PublicError('No primary vendor member found.');
              }

              const projectConnection = await trx.projectConnection.create({
                data: {
                  project_request_id: args.project_request_id,
                  vendor_company_id: vendor_company_id as string,
                  vendor_status: ProjectConnectionVendorStatus.PENDING,
                  expired_at: newExpiryDate.toDate(),
                }
              });
              await trx.customerConnection.create({
                data: {
                  project_connection_id: projectConnection.id,
                  customer_id: projectRequest.customer_id,
                }
              });
              if (!projectRequest.initial_assigned_at) {
                await trx.projectRequest.update({
                  where: {
                    id: args.project_request_id,
                  },
                  data: {
                    initial_assigned_at: projectConnection.created_at,
                  }
                });
              }
              await Promise.all(
                primaryVendorMembers.map(async (primaryVendorMember) => {
                  await trx.vendorMemberConnection.create({
                    data: {
                      project_connection_id: projectConnection.id,
                      vendor_member_id: primaryVendorMember.id,
                    }
                  });

                  // Send email and notification
                  createSendAdminProjectInvitationJob({
                    primaryMemberUserId: primaryVendorMember.user_id,
                    projectRequestId: projectRequest.id,
                    projectRequestName: projectRequest.title,
                    receiverEmail: primaryVendorMember.user.email,
                    vendorCompanyId: primaryVendorMember.vendor_company_id,
                    projectConnectionId: projectConnection.id,
                  });
                })
              );
            })
          } catch (error) {
            // no-op
          }
        }),
      );

      return true;
    },
  }
}

export default resolvers;
