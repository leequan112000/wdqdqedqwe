import invariant from '../../helper/invariant';
import {
  extractAndGetAvgCompanySize,
  extractRevenueValue,
} from '../../helper/vendorCompany';
import { getSignedUrl } from '../../helper/awsS3';
import { VendorSurveyStatus } from '../../helper/constant';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import { InternalError } from '../../graphql/errors/InternalError';

const resolver: Resolvers<Context> = {
  Query: {
    vendorSurveyAttachmentSignedUrl: async (_, args) => {
      const { key } = args;
      return await getSignedUrl(key);
    },
  },
  Mutation: {
    approveVendorSurvey: async (_, args, context) => {
      const {
        id,
        company_name,
        company_description,
        company_ipo_status,
        company_revenue,
        company_size,
        website_url,
        logo_url,
        company_types,
        countries,
        certificates,
        subspecialty_ids,
      } = args;

      await context.prismaCRODb.$transaction(async (trx) => {
        const vendorSurvey = await trx.vendorSurvey.update({
          data: {
            status: VendorSurveyStatus.REVIEWED,
          },
          where: {
            id,
          },
          include: {
            vendor_company: true,
          },
        });

        invariant(
          vendorSurvey.vendor_company_id,
          new InternalError('Vendor company id not found.'),
        );

        // Clear all existing records
        await trx.vendorCompanyType.deleteMany({
          where: {
            vendor_company_id: vendorSurvey.vendor_company_id,
          },
        });

        await trx.vendorCompanyCertification.deleteMany({
          where: {
            vendor_company_id: vendorSurvey.vendor_company_id,
          },
        });

        await trx.vendorCompanyLocation.deleteMany({
          where: {
            vendor_company_id: vendorSurvey.vendor_company_id,
          },
        });

        await trx.vendorCompanySubspecialty.deleteMany({
          where: {
            vendor_company_id: vendorSurvey.vendor_company_id,
          },
        });

        // Update with new records
        await trx.vendorCompanyType.createMany({
          data: company_types.map((t) => ({
            company_type: t,
            vendor_company_id: vendorSurvey.vendor_company_id!,
          })),
        });

        await trx.vendorCompanyCertification.createMany({
          data: certificates.map((c) => ({
            certification_name: c,
            vendor_company_id: vendorSurvey.vendor_company_id!,
          })),
        });

        await trx.vendorCompanyLocation.createMany({
          data: countries.map((c) => ({
            country: c,
            vendor_company_id: vendorSurvey.vendor_company_id!,
          })),
        });

        await trx.vendorCompanySubspecialty.createMany({
          data: subspecialty_ids.map((s) => ({
            subspecialty_id: s,
            vendor_company_id: vendorSurvey.vendor_company_id!,
          })),
        });

        const avgCompanySize = extractAndGetAvgCompanySize(company_size);
        const revenueValue = extractRevenueValue(company_revenue);

        await trx.vendorCompany.update({
          data: {
            company_name,
            company_description,
            company_ipo_status,
            company_revenue,
            company_size,
            website_url,
            logo_url,
            company_average_size: avgCompanySize,
            company_revenue_value: revenueValue,
          },
          where: {
            id: vendorSurvey.vendor_company_id,
          },
        });
      });

      return true;
    },
  },
};

export default resolver;
