import { Context } from '../../types/context';
import { PublicError } from '../errors/PublicError';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';
import vendorSurveyService from '../../services/vendorSurvey/vendorSurvey.service';

const resolvers: Resolvers<Context> = {
  CroDbVendorSurvey: {
    vendor_company: async (parent, _, context) => {
      invariant(parent.vendor_company_id, 'Missing vendor company id.');
      return await context.prismaCRODb.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id,
        },
      });
    },
  },
  Query: {
    initialVendorSurveyData: async (_, args, context) => {
      const { token: vendor_company_id } = args;

      const vendorCompany = await context.prismaCRODb.vendorCompany.findFirst({
        where: {
          id: vendor_company_id,
        },
        include: {
          vendor_company_locations: true,
          vendor_company_subspecialties: true,
          vendor_company_types: true,
          vendor_survey: true,
        },
      });

      invariant(vendorCompany, new PublicError('Invalid token!'));

      if (vendorCompany.vendor_survey) {
        return {
          id: vendorCompany.id,
          has_submitted: true,
        };
      }
      const subspecialtyIds = vendorCompany.vendor_company_subspecialties.map(
        (s) => s.subspecialty_id,
      );
      const vendorType = vendorCompany.vendor_company_types.map(
        (t) => t.company_type,
      );
      const countries = vendorCompany.vendor_company_locations.map(
        (l) => l.country,
      );

      return {
        id: vendorCompany.id,
        countries: [...new Set(countries)],
        logo_url: vendorCompany.logo_url,
        name: vendorCompany.company_name,
        company_description: vendorCompany.company_description,
        company_ipo_status: vendorCompany.company_ipo_status,
        company_revenue: vendorCompany.company_revenue,
        company_size: vendorCompany.company_size,
        subspecialty_ids: subspecialtyIds,
        website: vendorCompany.website_url,
        vendor_type: [...new Set(vendorType)],
        has_submitted: false,
      };
    },
  },
  Mutation: {
    createVendorSurvey: async (_, args, context) => {
      const {
        token: vendor_company_id,
        company_name,
        company_description,
        company_ipo_status,
        company_revenue,
        company_size,
        company_types,
        website,
        countries,
        subspecialty_ids,
        custom_specialties,
        certifications,
        products,
        email,
        note,
        logo,
        attachment,
      } = args;

      const vendorCompany = vendor_company_id
        ? await context.prismaCRODb.vendorCompany.findUnique({
            where: {
              id: vendor_company_id,
            },
            include: {
              vendor_survey: true,
            },
          })
        : null;

      const existingVendorSurvey = vendorCompany
        ? vendorCompany.vendor_survey
        : null;

      invariant(
        !existingVendorSurvey,
        new PublicError('Profile update has been submitted.'),
      );

      await vendorSurveyService.createVendorSurvey(
        {
          vendor_company_id,
          company_name,
          company_description,
          company_ipo_status,
          company_revenue,
          company_size,
          company_types,
          website,
          countries,
          subspecialty_ids,
          custom_specialties: custom_specialties as string[],
          products: products as string[],
          certifications: certifications as string[],
          logo: await logo,
          email,
          ...(note !== null ? { note } : {}),
          ...(attachment !== null ? { attachment: await attachment } : {}),
        },
        context,
      );
      return vendorCompany;
    },
  },
};

export default resolvers;
