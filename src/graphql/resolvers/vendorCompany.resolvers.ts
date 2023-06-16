import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers, StripeAccountData } from "../../generated";
import { InternalError } from "../errors/InternalError";
import { getStripeInstance } from "../../helper/stripe";

const resolvers: Resolvers<Context> = {
  VendorCompany: {
    vendor_members: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Vendor company id not found.')
      }
      return await context.prisma.vendorMember.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    project_connections: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Vendor company id not found.')
      }
      return await context.prisma.projectConnection.findMany({
        where: {
          vendor_company_id: parent.id
        }
      })
    },
    chats: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Vendor company id not found.')
      }
      return await context.prisma.chat.findMany({
        where: {
          vendor_company_id: parent.id
        }
      });
    },
    primary_members: async (parent, _, context) => {
      if (!parent.id) {
        throw new InternalError('Vendor company id not found.')
      }

      const primaryMembers = await context.prisma.vendorMember.findMany({
        where: {
          vendor_company_id: parent.id,
          is_primary_member: true,
        },
      });

      return primaryMembers;
    }
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
    onboardVendorCompany: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirstOrThrow({
          where: {
            id: context.req.user_id,
          },
          include: {
            vendor_member: {
              include: {
                vendor_company: true
              }
            }
          }
        });

        if (!user.vendor_member) {
          throw new PublicError('Vendor member not found.');
        }

        return await trx.vendorCompany.update({
          where: {
            id: user.vendor_member.vendor_company_id
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
            ...(args.name !== null ? { name: args.name } : {}),
          }
        })
      });
    },
    updateVendorCompany: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const vendor_member = await trx.vendorMember.findFirst({
          where: {
            user_id: context.req.user_id,
          },
        });

        if (!vendor_member) {
          throw new PublicError('Vendor member not found.');
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
            ...(args.name !== null ? { name: args.name } : {}),
          }
        })
      });
    },
  }
};

export default resolvers;