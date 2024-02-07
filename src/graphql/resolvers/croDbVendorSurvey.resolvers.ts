import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";
import vendorSurveyService from "../../services/vendorSurvey/vendorSurvey.service";

const resolvers: Resolvers<Context> = {
  CroDbVendorSurvey: {
    vendor_company: async (parent, _, context) => {
      invariant(parent.vendor_company_id, 'Missing vendor company id.');
      return await context.prismaCRODb.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      });
    },
  },
  Mutation: {
    createVendorSurvey: async (_, args, context) => {
      const {
        vendor_company_id,
        company_name,
        company_types,
        website,
        countries,
        subspecialty_ids,
        custom_specialties,
        certifications,
        product,
        note,
        logo,
        attachment,
      } = args;
      const vendorCompany = await context.prismaCRODb.vendorCompany.findFirst({
        where: { id: vendor_company_id }
      });

      invariant(vendorCompany, new PublicError('Vendor company not found.'));

      const existingVendorSurvey = await context.prismaCRODb.vendorSurvey.findFirst({
        where: {
          vendor_company_id,
        }
      });

      invariant(!existingVendorSurvey, new PublicError('Profile update has been submitted.'));

      await vendorSurveyService.createVendorSurvey({
        vendor_company_id,
        company_name,
        company_types,
        website,
        countries,
        subspecialty_ids,
        custom_specialties: custom_specialties as string[],
        certifications: certifications as string[],
        logo: await logo,
        ...(product !== null ? { product } : {}),
        ...(note !== null ? { note } : {}),
        ...(attachment !== null ? { attachment: await attachment } : {}),
      }, context)
      return vendorCompany;
    }
  },
};

export default resolvers;
