import { Chat, ProjectConnection, VendorCompany, VendorMember } from "@prisma/client";
import { Request } from "express";
import { createVendorCompanyCda, createVendorCompanyViewCdaSession } from "../../helper/pandadoc";
import { Context } from "../../context";
import { PublicError } from "../errors/PublicError";
import { MutationOnboardVendorCompanyArgs, MutationUpdateVendorCompanyArgs } from "../generated";

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
    cdaUrl: async (_: void, __: void, context: Context & { req: Request }) => {
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

          const file_id = user.vendor_member?.vendor_company?.cda_pandadoc_file_id;
          if (file_id) {
            const viewDocSessionResponse = await createVendorCompanyViewCdaSession(user.email, file_id);
            return `https://app.pandadoc.com/s/${viewDocSessionResponse.id}`;
          }

          return null;
        });
      } catch (error) {
        return null
      }
    }
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

          let cda_pandadoc_file_id = user?.vendor_member?.vendor_company?.cda_pandadoc_file_id;

          if (cda_pandadoc_file_id === null) {
            const docResponse = await createVendorCompanyCda(user);
            cda_pandadoc_file_id = docResponse.id as string;
          }

          return await context.prisma.vendorCompany.update({
            where: {
              id: user.vendor_member.vendor_company_id
            },
            data: {
              description: args.description,
              website: args.website,
              address: args.address,
              cda_pandadoc_file_id,
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

          return await context.prisma.vendorCompany.update({
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
  }
};
