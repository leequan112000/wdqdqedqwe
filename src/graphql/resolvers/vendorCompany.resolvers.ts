import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers, StripeAccountData } from "../generated";;
import { getStripeInstance } from "../../helper/stripe";
import invariant from "../../helper/invariant";
import { hasPermission } from "../../helper/casbin";
import { CasbinAct, CasbinObj } from "../../helper/constant";
import { PermissionDeniedError } from "../errors/PermissionDeniedError";
import { checkAllowEditCompanyInfoPermission } from "../../helper/accessControl";

const resolvers: Resolvers<Context> = {
  VendorCompany: {
    vendor_members: async (parent, _, context) => {
      invariant(parent.id, 'Vendor company id not found.');
      return await context.prisma.vendorMember.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    project_connections: async (parent, _, context) => {
      invariant(parent.id, 'Vendor company id not found.');
      return await context.prisma.projectConnection.findMany({
        where: {
          vendor_company_id: parent.id
        }
      })
    },
    chats: async (parent, _, context) => {
      invariant(parent.id, 'Vendor company id not found.');
      return await context.prisma.chat.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    primary_members: async (parent, _, context) => {
      invariant(parent.id, 'Vendor company id not found.');

      const primaryMembers = await context.prisma.vendorMember.findMany({
        where: {
          vendor_company_id: parent.id,
          is_primary_member: true,
        },
      });

      return primaryMembers;
    },
    certification_tags: async (parent, _, context) => {
      invariant(parent.id, 'Vendor company id not found.');

      const certificationTagConnections = await context.prisma.certificationTagConnection.findMany({
        where: {
          vendor_company_id: parent.id,
        },
        include: {
          certification_tag: true
        }
      });

      const certificationTags = certificationTagConnections.map(c => c.certification_tag);
      const priorityTags = certificationTags.filter((tag) => tag.priority && tag.priority > 0);
      const nonPriorityTags = certificationTags.filter((tag) => tag.priority === null);

      return [...priorityTags, ...nonPriorityTags];
    },
    lab_specializations: async (parent, _, context) => {
      invariant(parent.id, 'Vendor company id not found.');

      const labSpecializationConnections = await context.prisma.labSpecializationConnection.findMany({
        where: {
          vendor_company_id: parent.id,
        },
        include: {
          lab_specialization: true
        }
      });

      const labSpecializations = labSpecializationConnections.map(c => c.lab_specialization);

      return labSpecializations;
    },
  },
  Query: {
    vendorCompany: async (_, __, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const vendorMember = await trx.vendorMember.findFirstOrThrow({
          where: {
            user_id: context.req.user_id,
          },
        });

        return await trx.vendorCompany.findFirst({
          where: {
            id: vendorMember.vendor_company_id
          }
        })
      });
    },
    vendorCompanyStripeConnectUrl: async (_, args, context) => {
      const { refresh_url, return_url } = args;

      invariant(context.req.user_id, 'Current user id not found.');
      const allowSetupBankAccount = await hasPermission(context.req.user_id, CasbinObj.PAYOUT_ACCOUNT, CasbinAct.WRITE);
      invariant(allowSetupBankAccount, new PermissionDeniedError());

      return await context.prisma.$transaction(async (trx) => {
        const vendorMember = await trx.vendorMember.findFirstOrThrow({
          where: {
            user_id: context.req.user_id,
          },
          include: {
            vendor_company: true
          }
        });

        if (vendorMember.vendor_company) {
          try {
            const { vendor_company } = vendorMember;
            let stripeAccount = vendor_company.stripe_account as string;
            const stripe = await getStripeInstance();
            if (vendor_company.stripe_account === null) {
              const account = await stripe.accounts.create({
                type: 'standard',
                country: 'US',
              });

              stripeAccount = account.id;

              await trx.vendorCompany.update({
                where: {
                  id: vendor_company.id
                },
                data: {
                  stripe_account: account.id,
                }
              });
            }

            const accountLink = await stripe.accountLinks.create({
              account: stripeAccount,
              refresh_url: `${refresh_url}?stripe_connect=refresh&stripe_account_id=${stripeAccount}`,
              return_url: `${return_url}?stripe_connect=success&stripe_account_id=${stripeAccount}`,
              type: 'account_onboarding',
            });

            return accountLink.url;
          } catch (error) {
            throw new PublicError(error as string);
          }
        } else {
          return null;
        }
      });
    },
    vendorCompanyStripeAccount: async (_, __, context) => {
      const vendorMember = await context.prisma.vendorMember.findFirstOrThrow({
        where: {
          user_id: context.req.user_id,
        },
        include: {
          vendor_company: true
        }
      });

      if (vendorMember.vendor_company) {
        try {
          const { vendor_company } = vendorMember;
          if (vendor_company.stripe_account === null || vendor_company.stripe_account === '') {
            return null;
          }
          const stripe = await getStripeInstance();
          const account = await stripe.accounts.retrieve(vendor_company.stripe_account);
          return account as StripeAccountData;
        } catch (error) {
          throw new PublicError(error as string);
        }
      } else {
        return null;
      }
    }
  },
  Mutation: {
    updateVendorCompany: async (_, args, context) => {
      await checkAllowEditCompanyInfoPermission(context);

      return await context.prisma.$transaction(async (trx) => {
        const vendor_member = await trx.vendorMember.findFirst({
          where: {
            user_id: context.req.user_id,
          },
          include: {
            vendor_company: true
          }
        });

        invariant(vendor_member, new PublicError('Vendor member not found.'));

        if (args.legal_name && args.legal_name !== vendor_member?.vendor_company?.legal_name) {
          const existingVendorCompany = await trx.vendorCompany.findFirst({
            where: {
              legal_name: args.legal_name
            }
          });

          invariant(!existingVendorCompany, new PublicError('Vendor company legal name already exists.'));
        }

        return await trx.vendorCompany.update({
          where: {
            id: vendor_member.vendor_company_id
          },
          data: {
            legal_name: args.legal_name,
            description: args.description,
            website: args.website,
            address: args.address,
            address1: args.address1,
            address2: args.address2,
            city: args.city,
            state: args.state,
            country: args.country,
            zipcode: args.zipcode,
            university_name: args.university_name,
            vendor_type: args.vendor_type,
            principal_investigator_name: args.principal_investigator_name,
            google_scholar_url: args.google_scholar_url,
            founded_year: args.founded_year,
            team_size: args.team_size,
            linkedin_url: args.linkedin_url,
            twitter_url: args.twitter_url,
            facebook_url: args.facebook_url,
            cro_extra_info: args.cro_extra_info,
            project_completed_per_year: args.project_completed_per_year,
            ...(args.name !== null ? { name: args.name } : {}),
          }
        })
      });
    },
    updateVendorCompanyCertificationTags: async (_, args, context) => {
      await checkAllowEditCompanyInfoPermission(context);

      return await context.prisma.$transaction(async (trx) => {
        const vendor_member = await trx.vendorMember.findFirst({
          where: {
            user_id: context.req.user_id,
          },
          include: {
            vendor_company: true
          }
        });

        invariant(vendor_member, new PublicError('Vendor member not found.'));

        const { certification_tag_ids, new_certification_tag_names } = args;

        const certificationTagIds = certification_tag_ids || [];

        const certificationTagConnections = await trx.certificationTagConnection.findMany({
          where: {
            vendor_company_id: vendor_member.vendor_company_id,
          },
          include: {
            certification_tag: true
          }
        });

        let newTagIds: string[] = [];
        // Check if certification tag exist
        if (new_certification_tag_names && new_certification_tag_names.length > 0) {
          const existingCertificationTag = await trx.certificationTag.findMany({
            where: {
              full_name: {
                in: new_certification_tag_names as string[]
              }
            },
          });

          let verifiedNewCertificationTagNames = new_certification_tag_names;
          if (existingCertificationTag.length > 0) {
            newTagIds = newTagIds.concat(existingCertificationTag.map(c => c.id));

            verifiedNewCertificationTagNames = new_certification_tag_names.filter(
              n => !existingCertificationTag.map(c => c.full_name).includes(n as string)
            )
          }

          // Create new tag by user
          if (verifiedNewCertificationTagNames.length > 0) {
            await trx.certificationTag.createMany({
              data: verifiedNewCertificationTagNames.map(name => {
                return {
                  full_name: name as string,
                }
              }),
            });

            const newCertificationTags = await trx.certificationTag.findMany({
              where: {
                full_name: {
                  in: verifiedNewCertificationTagNames as string[]
                }
              }
            });

            newTagIds = newTagIds.concat(newCertificationTags.map(c => c.id.toString()));
          }
        }

        const certificationTags = certificationTagConnections.map(c => c.certification_tag);
        // Disconnect the existing certification tag connections
        await trx.certificationTagConnection.deleteMany({
          where: {
            vendor_company_id: vendor_member.vendor_company_id,
            certification_tag_id: {
              in: certificationTags.map((c) => c.id)
            }
          },
        });

        // Connect the new certification tags
        const tagsToBeConnected = [...certificationTagIds, ...newTagIds];
        if (tagsToBeConnected.length > 0) {
          await trx.certificationTagConnection.createMany({
            data: tagsToBeConnected.map(id => {
              return {
                certification_tag_id: id as string,
                vendor_company_id: vendor_member.vendor_company_id
              }
            }),
          });
        }

        return await trx.vendorCompany.findFirst({
          where: {
            id: vendor_member.vendor_company_id,
          }
        })
      });
    },
    updateVendorCompanyLabSpecializations: async (_, args, context) => {
      await checkAllowEditCompanyInfoPermission(context);

      return await context.prisma.$transaction(async (trx) => {
        const vendor_member = await trx.vendorMember.findFirst({
          where: {
            user_id: context.req.user_id,
          },
          include: {
            vendor_company: true
          }
        });

        invariant(vendor_member, new PublicError('Vendor member not found.'));

        const { lab_specialization_ids, new_lab_specialization_names } = args;

        const labSpecializationIds = lab_specialization_ids || [];

        const labSpecializationConnections = await trx.labSpecializationConnection.findMany({
          where: {
            vendor_company_id: vendor_member.vendor_company_id,
          },
          include: {
            lab_specialization: true
          }
        });

        let newSpecializationIds: string[] = [];
        // Check if lab specialization exist
        if (new_lab_specialization_names && new_lab_specialization_names.length > 0) {
          const existingLabSpecialization = await trx.labSpecialization.findMany({
            where: {
              full_name: {
                in: new_lab_specialization_names as string[]
              }
            },
          });

          let verifiedNewLabSpecializationNames = new_lab_specialization_names;
          if (existingLabSpecialization.length > 0) {
            newSpecializationIds = newSpecializationIds.concat(existingLabSpecialization.map(c => c.id));

            verifiedNewLabSpecializationNames = new_lab_specialization_names.filter(
              n => !existingLabSpecialization.map(c => c.full_name).includes(n as string)
            )
          }

          // Create new specialization by user
          if (verifiedNewLabSpecializationNames.length > 0) {
            await trx.labSpecialization.createMany({
              data: verifiedNewLabSpecializationNames.map(name => {
                return {
                  full_name: name as string,
                }
              }),
            });

            const newLabSpecializations = await trx.labSpecialization.findMany({
              where: {
                full_name: {
                  in: verifiedNewLabSpecializationNames as string[]
                }
              }
            });

            newSpecializationIds = newSpecializationIds.concat(newLabSpecializations.map(c => c.id.toString()));
          }
        }

        const labSpecializations = labSpecializationConnections.map(c => c.lab_specialization);
        // Disconnect the existing lab specialization connections
        await trx.labSpecializationConnection.deleteMany({
          where: {
            vendor_company_id: vendor_member.vendor_company_id,
            lab_specialization_id: {
              in: labSpecializations.map((c) => c.id)
            }
          },
        });

        // Connect the new lab specializations
        const specializationsToBeConnected = [...labSpecializationIds, ...newSpecializationIds];
        if (specializationsToBeConnected.length > 0) {
          await trx.labSpecializationConnection.createMany({
            data: specializationsToBeConnected.map(id => {
              return {
                lab_specialization_id: id as string,
                vendor_company_id: vendor_member.vendor_company_id
              }
            }),
          });
        }

        return await trx.vendorCompany.findFirst({
          where: {
            id: vendor_member.vendor_company_id,
          }
        })
      });
    },
    skipAddCertificationTag: async (_, args, context) => {
      const vendor_member = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(vendor_member, new PublicError('Vendor member not found.'));

      return await context.prisma.vendorCompany.update({
        where: {
          id: vendor_member.vendor_company_id
        },
        data: {
          skip_certification_tag: true,
        }
      });
    },
    skipAddLabSpecialization: async (_, args, context) => {
      const vendor_member = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(vendor_member, new PublicError('Vendor member not found.'));

      return await context.prisma.vendorCompany.update({
        where: {
          id: vendor_member.vendor_company_id
        },
        data: {
          skip_lab_specialization: true,
        }
      });
    },
  }
};

export default resolvers;
