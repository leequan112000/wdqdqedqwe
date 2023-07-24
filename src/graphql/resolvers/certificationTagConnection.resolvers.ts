import { Request } from "express";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../../generated";

const resolvers: Resolvers<Context> = {
  CertificationTagConnection: {
    certification_tag: async (parent, _, context) => {
      if (!parent.certification_tag_id) {
        throw new InternalError('Certification tag id not found');
      }

      return await context.prisma.certificationTag.findFirst({
        where: {
          id: parent.certification_tag_id
        }
      });
    },
    vendor_company: async (parent, _, context) => {
      if (!parent.vendor_company_id) {
        throw new InternalError('Vendor company id not found');
      }

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      });
    },
  },
};

export default resolvers;
