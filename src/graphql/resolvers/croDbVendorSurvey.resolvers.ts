import { Context } from '../../types/context';
import { PublicError } from '../errors/PublicError';
import { Resolvers, VendorSurveyStep } from '../generated';
import invariant from '../../helper/invariant';
import vendorSurveyService from '../../services/vendorSurvey/vendorSurvey.service';
import {
  VendorSurveyFilePath,
  VendorSurveyStatus,
} from '../../helper/constant';
import storeUpload from '../../helper/storeUpload';
import { VendorSurvey } from '../../../prisma-cro/generated/client';

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
          vendor_company_certifications: true,
          vendor_survey: true,
        },
      });

      invariant(vendorCompany, new PublicError('Invalid token!'));

      const subspecialtyIds = vendorCompany.vendor_company_subspecialties.map(
        (s) => s.subspecialty_id,
      );
      const vendorType = vendorCompany.vendor_company_types.map(
        (t) => t.company_type,
      );
      const countries = vendorCompany.vendor_company_locations.map(
        (l) => l.country,
      );
      const ceritifcations = vendorCompany.vendor_company_certifications.map(
        (c) => c.certification_name,
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
        certifications: ceritifcations,
        has_submitted: false,
      };
    },
    vendorSurveyData: async (_, args, context) => {
      const { token: vendorCompanyId, survey_id: surveyId } = args;

      const vendorSurvey = await context!.prismaCRODb.vendorSurvey.findFirst({
        where: {
          ...(vendorCompanyId ? { vendor_company_id: vendorCompanyId } : {}),
          ...(surveyId ? { id: surveyId } : {}),
        },
      });

      return {
        ...vendorSurvey,
        step: vendorSurvey?.step as VendorSurveyStep,
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

      const vendorSurvey = await vendorSurveyService.createVendorSurvey(
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
      return {
        ...vendorSurvey,
        step: vendorSurvey.step as VendorSurveyStep,
      };
    },
    submitVendorSurvey: async (_, args, context) => {
      const { step, payload, survey_id, token: vendor_company_id } = args;

      let vendorSurvey: VendorSurvey | null = null;

      if (survey_id) {
        vendorSurvey = await context!.prismaCRODb.vendorSurvey.findUnique({
          where: {
            id: survey_id,
          },
        });
      }
      if (vendor_company_id) {
        const vendorCompany =
          await context!.prismaCRODb.vendorCompany.findFirst({
            where: {
              id: vendor_company_id,
            },
            include: {
              vendor_survey: true,
            },
          });

        if (!vendorSurvey && vendorCompany?.vendor_survey) {
          vendorSurvey = vendorCompany?.vendor_survey;
        }
        invariant(vendorCompany, 'Invalid token!');
      }

      if (!vendorSurvey) {
        const newVendorSurvey = await context!.prismaCRODb.vendorSurvey.create({
          data: {
            email: payload.email,
            status: VendorSurveyStatus.INCOMPLETE,
            step,
            vendor_company_id: vendor_company_id || undefined,
          },
        });
        return {
          ...newVendorSurvey,
          step: newVendorSurvey.step as VendorSurveyStep,
        };
      }

      invariant(survey_id || vendor_company_id, 'Missing identifier.');

      let logoUrl: string | undefined,
        attachment_key: string | undefined,
        attachment_file_name: string | undefined,
        attachment_content_type: string | undefined;

      if (payload.logo) {
        const { bucket, key } = await storeUpload(
          await payload.logo,
          VendorSurveyFilePath.LOGO,
          true,
        );

        logoUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
      }

      if (payload.attachment) {
        const { filename, key, contentType } = await storeUpload(
          await payload.attachment,
          VendorSurveyFilePath.ATTACHMENT,
        );

        attachment_key = key;
        attachment_file_name = filename;
        attachment_content_type = contentType as string;
      }

      const updatedVendorSurvey =
        await context!.prismaCRODb.vendorSurvey.update({
          where: {
            id: vendorSurvey.id,
          },
          data: {
            ...(payload.company_name && { company_name: payload.company_name }),
            ...(payload.company_description && {
              company_description: payload.company_description,
            }),
            ...(payload.company_ipo_status && {
              company_ipo_status: payload.company_ipo_status,
            }),
            ...(payload.company_revenue && {
              company_revenue: payload.company_revenue,
            }),
            ...(payload.company_size && { company_size: payload.company_size }),
            ...(payload.company_types && {
              company_types: payload.company_types || [],
            }),
            ...(payload.countries && { countries: payload.countries || [] }),
            ...(payload.website && { website: payload.website }),
            ...(payload.subspecialty_ids && {
              subspecialty_ids: payload.subspecialty_ids || [],
            }),
            ...(payload.custom_specialties && {
              custom_specialties: payload.custom_specialties || [],
            }),
            ...(payload.certifications && {
              certifications: payload.certifications || [],
            }),
            ...(payload.products && {
              products: payload.products || [],
            }),
            ...(payload.note && {
              note: payload.note,
            }),
            ...(payload.respondent_name && {
              respondent_name: payload.respondent_name,
            }),
            ...(payload.respondent_company_role && {
              respondent_company_role: payload.respondent_company_role,
            }),
            attachment_key,
            attachment_file_name,
            attachment_content_type,
            logo_url: logoUrl,
            status:
              step === VendorSurveyStep.AdditionalInformation
                ? VendorSurveyStatus.PENDING
                : undefined,
            step,
          },
        });

      return {
        ...updatedVendorSurvey,
        step: updatedVendorSurvey.step as VendorSurveyStep,
      };
    },
  },
};

export default resolvers;
