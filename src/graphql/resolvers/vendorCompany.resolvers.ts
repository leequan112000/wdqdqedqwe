import { VendorCompany, VendorMember } from "@prisma/client";
import { Request } from "express";
import { createVendorCompanyCda, createVendorCompanyViewCdaSession } from "../../helper/pandadoc";
import { Context } from "../../context";
import { PublicError } from "../errors/PublicError";

export default {
  VendorCompany: {
    vendor_members: async (parent: VendorCompany, _: void, context: Context): Promise<VendorMember[] | null> => {
      return await context.prisma.vendorMember.findMany({
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
    createCda: async (_: void, __: void, context: Context & { req: Request }) => {
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

          if (user.vendor_member?.vendor_company?.cda_pandadoc_file_id) {
            throw new PublicError("CDA already exist.")
          }

          // Create new CDA if not exist
          const docResponse = await createVendorCompanyCda(user);
          await trx.biotech.update({
            where: {
              id: user.vendor_member?.vendor_company_id
            },
            data: {
              cda_pandadoc_file_id: docResponse.id
            }
          });

          return docResponse.id;
        });
      } catch (error) {
        return error
      }
    }
  }
};
