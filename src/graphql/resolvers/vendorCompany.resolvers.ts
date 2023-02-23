import { VendorCompany, VendorMember } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../context";

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
  },
};
