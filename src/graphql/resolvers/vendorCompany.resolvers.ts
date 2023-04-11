import { Chat, ProjectConnection, User, VendorCompany, VendorMember } from "@prisma/client";
import { Request } from "express";
import { sendVendorMemberProjectRequestInvitationByAdminEmail } from "../../mailer/vendorMember";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { MutationCreateVendorCompanyArgs, MutationInviteVendorCompaniesToProjectByAdminArgs, MutationOnboardVendorCompanyArgs, MutationUpdateVendorCompanyArgs } from "../../generated";

export default {
  VendorCompany: {
    vendor_members: async (parent: VendorCompany, _: void, context: Context): Promise<VendorMember[] | null> => {
      return await context.prisma.vendorMember.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    project_connections: async (parent: VendorCompany, _: void, context: Context): Promise<ProjectConnection[] | null> => {
      return await context.prisma.projectConnection.findMany({
        where: {
          vendor_company_id: parent.id
        }
      })
    },
    chats: async (parent: VendorCompany, _: void, context: Context): Promise<Chat[] | null> => {
      return await context.prisma.chat.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
  },
  Query: {
    vendorCompany: async (_: void, args: void, context: Context & { req: Request }) => {
      return await context.prisma.$transaction(async (trx) => {
        const vendorMember = await trx.vendorMember.findFirstOrThrow({
          where: {
            user_id: context.req.user_id,
          },
        });

        return await trx.vendorCompany.findFirst({
          where: {
            id: vendorMember.vendor_company_id
          }
        })
      });
    },
  },
  Mutation: {
    createVendorCompany: async (_: void, args: MutationCreateVendorCompanyArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.vendorCompany.create({
          data: {
            name: args.name,
            website: args.website,
            description: args.description,
            address: args.address,
          }
        });
      } catch (error) {
        return error;
      }
    },
    onboardVendorCompany: async (_: void, args: MutationOnboardVendorCompanyArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id,
            },
            include: {
              vendor_member: {
                include: {
                  vendor_company: true
                }
              }
            }
          });

          if (!user.vendor_member) {
            throw new PublicError('Vendor member not found.');
          }

          return await trx.vendorCompany.update({
            where: {
              id: user.vendor_member.vendor_company_id
            },
            data: {
              description: args.description,
              website: args.website,
              address: args.address,
              ...(args.name !== null ? { name: args.name } : {}),
            }
          })
        });
      } catch (error) {
        return error;
      }
    },
    updateVendorCompany: async (_: void, args: MutationUpdateVendorCompanyArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const vendor_member = await trx.vendorMember.findFirst({
            where: {
              user_id: context.req.user_id,
            },
          });

          if (!vendor_member) {
            throw new PublicError('Vendor member not found.');
          }

          return await trx.vendorCompany.update({
            where: {
              id: vendor_member.vendor_company_id
            },
            data: {
              description: args.description,
              website: args.website,
              address: args.address,
              ...(args.name !== null ? { name: args.name } : {}),
            }
          })
        });
      } catch (error) {
        return error;
      }
    },
    inviteVendorCompaniesToProjectByAdmin: async (_: void, args: MutationInviteVendorCompaniesToProjectByAdminArgs, context: Context & { req: Request }) => {
      try {
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
      } catch (error) {
        return error;
      }
    },
  }
};
