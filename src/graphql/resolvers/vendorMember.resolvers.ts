import { User, VendorCompany, VendorMember } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../context";

export default {
  VendorMember: {
    user: async (parent: VendorMember, _: void, context: Context): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      });
    },
    vendor_company: async (parent: VendorMember, _: void, context: Context): Promise<VendorCompany | null> => {
      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      });
    },
  },
  Query: {
    vendorMember: async (_: void, args: void, context: Context & { req: Request }) => {
      return await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });
    },
  },
};
