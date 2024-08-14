import { deleteObject } from '../../helper/awsS3';
import {
  SubscriptionStatus,
  VendorProfileFilePath,
} from '../../helper/constant';
import invariant from '../../helper/invariant';
import { slackNotification } from '../../helper/slack';
import storeUpload from '../../helper/storeUpload';
import { Context } from '../../types/context';
import { VendorOnboardingStep, Resolvers } from '../generated';

const resolvers: Resolvers<Context> = {
  Vendor: {
    user: async (parent, _, context) => {
      if (parent.user) return parent.user;

      invariant(parent.user_id, 'Missing user id');

      return await context.prisma.user.findUnique({
        where: {
          id: parent.user_id,
        },
      });
    },
    has_active_subscription: async (parent) => {
      return (
        !!parent.stripe_subscription_id &&
        parent.subscription_status === SubscriptionStatus.ACTIVE
      );
    },
  },
  Query: {
    vendor: async (_, __, context) => {
      const userId = context.req.user_id;

      const vendor = await context.prisma.vendor.findUnique({
        where: {
          user_id: userId,
        },
        include: {
          user: true,
        },
      });

      invariant(vendor, "Vendor data doesn't exists");

      return {
        ...vendor,
        onboarding_step: vendor.onboarding_step as VendorOnboardingStep,
      };
    },
  },

  Mutation: {
    submitVendorOnboarding: async (_, args, context) => {
      const { payload, onboarding_step } = args;
      const userId = context.req.user_id;
      const vendor = await context.prisma.vendor.findUnique({
        where: {
          user_id: userId,
        },
      });

      invariant(vendor, "Vendor record doesn't exist");

      let logoUrl: string | undefined,
        attachment_key: string | undefined,
        attachment_file_name: string | undefined,
        attachment_content_type: string | undefined,
        attachment_file_size: number | undefined;

      if (payload.logo) {
        const { bucket, key } = await storeUpload(
          await payload.logo,
          VendorProfileFilePath.LOGO,
          true,
        );

        logoUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
      }

      if (payload.attachment) {
        const { filename, key, contentType, filesize } = await storeUpload(
          await payload.attachment,
          VendorProfileFilePath.ATTACHMENT,
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

      const updatedVendor = await context.prisma.vendor.update({
        where: {
          id: vendor.id,
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
        ...updatedVendor,
        onboarding_step: updatedVendor.onboarding_step as VendorOnboardingStep,
      };
    },
    updateVendorUserProfile: async (_, args, context) => {
      const userId = context.req.user_id;
      const { payload } = args;

      const vendor = await context.prisma.vendor.findUnique({
        where: {
          user_id: userId,
        },
      });

      invariant(vendor, 'Vendor not found.');

      const updatedVendor = await context.prisma.vendor.update({
        data: {
          ...(payload?.user_company_role
            ? {
                user_company_role: payload.user_company_role,
              }
            : {}),
          ...(payload?.department
            ? {
                department: payload.department,
              }
            : {}),

          user: {
            update: {
              ...(payload?.first_name
                ? { first_name: payload.first_name }
                : {}),
              ...(payload?.last_name ? { last_name: payload.last_name } : {}),
              ...(payload?.phone_number
                ? { phone_number: payload.phone_number }
                : {}),
              ...(payload?.country_code
                ? { country_code: payload.country_code }
                : {}),
            },
          },
        },
        where: {
          id: vendor.id,
        },
        include: {
          user: true,
        },
      });

      return {
        ...updatedVendor,
        onboarding_step: updatedVendor.onboarding_step as VendorOnboardingStep,
      };
    },
    updateVendorProfile: async (_, args, context) => {
      const { payload } = args;

      const userId = context.req.user_id;

      const vendor = await context.prisma.vendor.findUnique({
        where: {
          user_id: userId,
        },
      });

      invariant(vendor, 'Missing vendor');

      let logoUrl: string | undefined,
        attachment_key: string | undefined | null,
        attachment_file_name: string | undefined | null,
        attachment_content_type: string | undefined | null,
        attachment_file_size: number | undefined | null,
        attachment_key_to_delete: string | undefined;

      if (payload.logo) {
        const { bucket, key } = await storeUpload(
          await payload.logo,
          VendorProfileFilePath.LOGO,
          true,
        );

        logoUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
      }

      if (payload.attachment) {
        const { filename, key, contentType, filesize } = await storeUpload(
          await payload.attachment,
          VendorProfileFilePath.ATTACHMENT,
        );

        attachment_key = key;
        attachment_file_name = filename;
        attachment_content_type = contentType as string;
        attachment_file_size = filesize;
      }

      return await context.prisma.$transaction(async (trx) => {
        // Delete attachement if attachment payload is null
        if (vendor.attachment_key && payload.attachment === null) {
          attachment_key = null;
          attachment_file_name = null;
          attachment_content_type = null;
          attachment_file_size = null;
          attachment_key_to_delete = vendor.attachment_key;
        }

        const updatedVendor = await trx.vendor.update({
          where: {
            id: vendor.id,
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
            edit_counts: {
              increment: 1,
            },
          },
        });

        if (attachment_key_to_delete) {
          await deleteObject(attachment_key_to_delete);
        }

        await slackNotification.singleTextNotification(
          `A vendor has updated their listing profile:\n*${updatedVendor.company_name}*`,
        );

        return {
          ...updatedVendor,
          onboarding_step:
            updatedVendor.onboarding_step as VendorOnboardingStep,
        };
      });
    },
  },
};

export default resolvers;
