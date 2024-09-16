import invariant from '../../helper/invariant';
import {
  extractAndGetAvgCompanySize,
  extractRevenueValue,
} from '../../helper/vendorCompany';
import { getSignedUrl } from '../../helper/awsS3';
import {
  CompanyCollaboratorRoleType,
  VendorSurveyStatus,
} from '../../helper/constant';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import { InternalError } from '../../graphql/errors/InternalError';
import { PublicError } from '../../graphql/errors/PublicError';
import { encrypt } from '../../helper/gdprHelper';

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
        certifications,
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
          data: certifications.map((c) => ({
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
            verified_at: new Date(),
          },
          where: {
            id: vendorSurvey.vendor_company_id,
          },
        });
      });

      return true;
    },
    createVendorFromSurvey: async (_, args, context) => {
      const { survey_id } = args;

      const vendorSurvey = await context.prismaCRODb.vendorSurvey.findUnique({
        where: {
          id: survey_id,
        },
      });

      invariant(vendorSurvey, 'Survey record not found.');

      invariant(
        vendorSurvey.status === VendorSurveyStatus.PENDING,
        new PublicError('The survey is incomplete.'),
      );

      invariant(
        vendorSurvey.email,
        new PublicError('There is no email address submitted in this survey.'),
      );

      const user = await context.prisma.user.findFirst({
        where: {
          email: encrypt(vendorSurvey.email),
        },
        include: {
          vendor_member: true,
          vendor: true,
        },
      });

      let isValidExistingVendor = false;

      invariant(
        user?.vendor === null,
        new PublicError('Vendor already exists.'),
      );

      // Existing vendor
      if (user && user.vendor_member) {
        invariant(
          user.vendor_member.role === CompanyCollaboratorRoleType.OWNER,
          new PublicError('User is not the owner of the vendor company.'),
        );

        isValidExistingVendor = true;
      }

      let firstName: string | undefined, lastName: string | undefined;
      if (vendorSurvey.respondent_name) {
        const nameParts = vendorSurvey.respondent_name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts[nameParts.length - 1];
      }

      const vendor = await context.prisma.vendor.create({
        data: {
          email: vendorSurvey.email,
          company_name: vendorSurvey.company_name,
          company_revenue: vendorSurvey.company_revenue,
          company_description: vendorSurvey.company_description,
          company_ipo_status: vendorSurvey.company_ipo_status,
          company_size: vendorSurvey.company_size,
          company_types: vendorSurvey.company_types,
          certifications: vendorSurvey.certifications,
          custom_specialties: vendorSurvey.custom_specialties,
          note: vendorSurvey.note,
          hq_locations: vendorSurvey.hq_locations,
          other_facility_locations: vendorSurvey.countries,
          logo_url: vendorSurvey.logo_url,
          subspecialty_ids: vendorSurvey.subspecialty_ids,
          website: vendorSurvey.website,
          attachment_key: vendorSurvey.attachment_key,
          attachment_content_type: vendorSurvey.attachment_content_type,
          attachment_file_name: vendorSurvey.attachment_file_name,
          user_company_role: vendorSurvey.respondent_company_role,
          user: {
            ...(isValidExistingVendor && user
              ? {
                  connect: {
                    id: user.id,
                  },
                }
              : {
                  create: {
                    email: encrypt(vendorSurvey.email),
                    first_name: encrypt(firstName),
                    last_name: encrypt(lastName),
                  },
                }),
          },
        },
      });

      if (vendor) return true;
      return false;
    },
  },
};

export default resolver;
