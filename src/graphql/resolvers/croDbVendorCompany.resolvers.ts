import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";
import { CroDbVendorCompanyType } from "../../helper/constant";

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
    company_size: async (parent, _, context) => {
      let companySize = parent.company_size;
      if (!companySize) {
        companySize = (await context.prismaCRODb.vendorCompany.findUnique({
          where: {
            id: parent.id!,
          },
          select: {
            id: true,
            company_size: true,
          },
        }))?.company_size;
      }

      return companySize
        ? companySize.replace('-', ' – ')
        : null;
    }
  },
  CroDbVendorCompanyLocation: {
    country: async (parent, _, __) => {
      return parent.country?.trim() || '';
    },
  },
  CroDbVendorCompanySubspecialty: {
    subspecialty: async (parent, _, context) => {
      invariant(parent.subspecialty_id, 'Missing subspecialty id.');
      return await context.prismaCRODb.subspecialty.findFirst({
        where: {
          id: parent.subspecialty_id
        },
      });
    },
  },
  CroDbVendorCompanyType: {
    company_type: async (parent, _, context) => {
      let companyType = parent.company_type;
      if (!companyType) {
        companyType = (await context.prismaCRODb.vendorCompanyType.findUnique({
          where: {
            id: parent.id!,
          },
          select: {
            id: true,
            company_type: true,
          },
        }))?.company_type;
      }

      if (companyType?.trim() === CroDbVendorCompanyType.NON_PROFIT) {
        return 'Non-profit';
      }
      return companyType || null;
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
