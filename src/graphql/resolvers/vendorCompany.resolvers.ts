import { Chat, ProjectConnection, VendorCompany, VendorMember } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { MutationOnboardVendorCompanyArgs, MutationUpdateVendorCompanyArgs } from "../../generated";

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
    primary_members: async (parent: VendorCompany, _: void, context: Context): Promise<VendorMember[] | null> => {
      const { id } = parent;

      const primaryMembers = await context.prisma.vendorMember.findMany({
        where: {
          vendor_company_id: id,
          is_primary_member: true,
        },
      });

      return primaryMembers;
    }
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
              legal_name: args.legal_name,
              description: args.description,
              website: args.website,
              address: args.address,
              address1: args.address1,
              address2: args.address2,
              city: args.city,
              state: args.state,
              country: args.country,
              zipcode: args.zipcode,
              university_name: args.university_name,
              vendor_type: args.vendor_type,
              principal_investigator_name: args.principal_investigator_name,
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
              legal_name: args.legal_name,
              description: args.description,
              website: args.website,
              address: args.address,
              address1: args.address1,
              address2: args.address2,
              city: args.city,
              state: args.state,
              country: args.country,
              zipcode: args.zipcode,
              university_name: args.university_name,
              vendor_type: args.vendor_type,
              principal_investigator_name: args.principal_investigator_name,
              ...(args.name !== null ? { name: args.name } : {}),
            }
          })
        });
      } catch (error) {
        return error;
      }
    },
  }
};
