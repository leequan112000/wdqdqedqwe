import invariant from "../../helper/invariant";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import vendorCompanyService from "../../services/vendorCompany/vendorCompany.service";

const resolvers: Resolvers<Context> = {
  CompanyProfile: {
    __resolveType: (obj) => {
      if (obj.__typename === "Biotech") {
        return "Biotech";
      }
      if (obj.__typename === "VendorCompany") {
        return "VendorCompany";
      }
      return null;
    },
  },
  Query: {
    companyProfile: async (_, __, context) => {
      const userId = context.req.user_id;

      const user = await context.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          customer: {
            include: {
              biotech: true,
            },
          },
          vendor_member: {
            include: {
              vendor_company: true,
            },
          },
        },
      });

      invariant(user, "User not found.");

      if (user.customer) {
        return {
          __typename: "Biotech",
          ...user.customer.biotech,
        };
      }
      if (user.vendor_member) {
        return {
          __typename: "VendorCompany",
          ...user.vendor_member.vendor_company,
        };
      }

      return null;
    },
  },
  Mutation: {
    updateBiotechProfile: async (_, args, context) => {
      const {
        name,
        about,
        address,
        address1,
        address2,
        city,
        state,
        country,
        team_size,
        website,
        zipcode,
      } = args;

      const user = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
        },
      });

      invariant(user?.customer, "Customer not found.");

      const updatedBiotech = await context.prisma.biotech.update({
        where: {
          id: user.customer.biotech_id,
        },
        data: {
          name: name || undefined,
          about: about || undefined,
          address: address || undefined,
          address1: address1 || undefined,
          address2: address2 || undefined,
          city: city || undefined,
          state: state || undefined,
          country: country || undefined,
          team_size: team_size || undefined,
          website: website || undefined,
          zipcode: zipcode || undefined,
        },
      });

      return updatedBiotech;
    },
    updateVendorCompanyProfile: async (_, args, context) => {
      const {
        address1,
        address2,
        address,
        city,
        country,
        description,
        founded_year,
        name,
        project_completed_per_year,
        state,
        team_size,
        website,
        zipcode,
        certification_tag_ids,
        new_certification_tag_names,
        lab_specialization_ids,
        new_lab_specialization_names,
      } = args;

      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirst({
          where: {
            id: context.req.user_id,
          },
          include: {
            vendor_member: true,
          },
        });

        invariant(user?.vendor_member, "Vendor member not found.");

        const updatedVendorCompany = await trx.vendorCompany.update({
          where: {
            id: user.vendor_member.vendor_company_id,
          },
          data: {
            name: name || undefined,
            description: description || undefined,
            address: address || undefined,
            address1: address1 || undefined,
            address2: address2 || undefined,
            city: city || undefined,
            state: state || undefined,
            country: country || undefined,
            team_size: team_size || undefined,
            website: website || undefined,
            zipcode: zipcode || undefined,
            founded_year: founded_year || undefined,
            project_completed_per_year: project_completed_per_year || undefined,

            /**
             * IMPORTANT:
             * Explicitly set to true to prevent user from going back to onboarding flow
             * when refreshing the screen.
             */
            skip_lab_specialization: true,
            skip_certification_tag: true,
          },
        });

        // Start updating certificate connection.
        await vendorCompanyService.updateVendorCompanyCertificationTag(
          {
            vendor_company_id: user.vendor_member.vendor_company_id,
            certification_tag_ids: certification_tag_ids || [],
            new_certification_tag_names: new_certification_tag_names || [],
          },
          {
            prisma: trx,
          }
        );
        // Done updating certificate connection

        // Update lab specialization
        await vendorCompanyService.updateVendorCompanyLabSpecialization(
          {
            lab_specialization_ids: lab_specialization_ids || [],
            new_lab_specialization_names: new_lab_specialization_names || [],
            vendor_company_id: user.vendor_member.vendor_company_id,
          },
          {
            prisma: trx,
          }
        );

        return updatedVendorCompany;
      });
    },
  },
};

export default resolvers;
