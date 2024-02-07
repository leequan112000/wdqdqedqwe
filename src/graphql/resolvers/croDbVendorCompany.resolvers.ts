import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  CroDbVendorCompany: {
    vendor_company_subspecialties: async (parent, _, context) => {
      invariant(parent.id, 'Missing vendor company id.');
      return await context.prismaCRODb.vendorCompanySubspecialty.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    vendor_company_locations: async (parent, _, context) => {
      invariant(parent.id, 'Missing vendor company id.');
      return await context.prismaCRODb.vendorCompanyLocation.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    vendor_company_types: async (parent, _, context) => {
      invariant(parent.id, 'Missing vendor company id.');
      return await context.prismaCRODb.vendorCompanyType.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    vendor_company_certifications: async (parent, _, context) => {
      invariant(parent.id, 'Missing vendor company id.');
      return await context.prismaCRODb.vendorCompanyCertification.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
  },
  Query: {
    croDbVendorCompany: async (_, args, context) => {
      const { id } = args;
      const vendorCompany = await context.prismaCRODb.vendorCompany.findFirst({
        where: { id }
      });

      invariant(vendorCompany, new PublicError('Vendor company not found.'));
      return vendorCompany;
    }
  },
};

export default resolvers;
