import { PaidVendorProfileFilePath } from '../../helper/constant';
import invariant from '../../helper/invariant';
import storeUpload from '../../helper/storeUpload';
import { Context } from '../../types/context';
import { PaidVendorOnboardingStep, Resolvers } from '../generated';

const resolvers: Resolvers<Context> = {
  Query: {
    paidVendor: async (_, __, context) => {
      const userId = context.req.user_id;

      const paidVendor = await context.prisma.paidVendor.findUnique({
        where: {
          user_id: userId,
        },
        include: {
          user: true,
        },
      });

      invariant(paidVendor, "Vendor data doesn't exists");

      return {
        ...paidVendor,
        onboarding_step: paidVendor.onboarding_step as PaidVendorOnboardingStep,
      };
    },
  },

  Mutation: {
    submitPaidVendorOnboarding: async (_, args, context) => {
      const { payload, onboarding_step } = args;
      const userId = context.req.user_id;
      const paidVendor = await context.prisma.paidVendor.findUnique({
        where: {
          user_id: userId,
        },
      });

      invariant(paidVendor, "Vendor record doesn't exist");

      let logoUrl: string | undefined,
        attachment_key: string | undefined,
        attachment_file_name: string | undefined,
        attachment_content_type: string | undefined,
        attachment_file_size: number | undefined;

      if (payload.logo) {
        const { bucket, key } = await storeUpload(
          await payload.logo,
          PaidVendorProfileFilePath.LOGO,
          true,
        );

        logoUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
      }

      if (payload.attachment) {
        const { filename, key, contentType, filesize } = await storeUpload(
          await payload.attachment,
          PaidVendorProfileFilePath.ATTACHMENT,
        );

        attachment_key = key;
        attachment_file_name = filename;
        attachment_content_type = contentType as string;
        attachment_file_size = filesize;
      }

      let firstName: string | undefined, lastName: string | undefined;
      if (payload.user_name) {
        const nameParts = payload.user_name.split(' ');
        firstName = nameParts[0];
        lastName = nameParts[nameParts.length - 1];
      }
      console.log(payload);
      const updatedPaidVendor = await context.prisma.paidVendor.update({
        where: {
          id: paidVendor.id,
        },
        data: {
          ...(payload.user_company_role && {
            user_company_role: payload.user_company_role,
          }),
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
          ...(payload.hq_locations && {
            hq_locations: payload.hq_locations || [],
          }),
          ...(payload.other_facility_locations && {
            other_facility_locations: payload.other_facility_locations || [],
          }),
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
          attachment_key,
          attachment_file_name,
          attachment_file_size,
          attachment_content_type,
          logo_url: logoUrl,
          onboarding_step,
          ...(payload.user_name
            ? {
                user: {
                  update: {
                    first_name: firstName,
                    last_name: lastName,
                  },
                },
              }
            : {}),
        },
        include: {
          user: true,
        },
      });

      return {
        ...updatedPaidVendor,
        onboarding_step:
          updatedPaidVendor.onboarding_step as PaidVendorOnboardingStep,
      };
    },
  },
};

export default resolvers;
