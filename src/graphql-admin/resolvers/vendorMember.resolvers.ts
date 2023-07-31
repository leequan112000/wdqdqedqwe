import { PublicError } from '../../graphql/errors/PublicError';
import { Resolvers } from '../../generated';
import { Context } from '../../types/context';
import { createResetPasswordToken } from '../../helper/auth';
import { sendVendorMemberInvitationByAdminEmail, sendVendorMemberInvitationByBiotechEmail } from '../../mailer/vendorMember';

const resolver: Resolvers<Context> = {
  Query: {
    _dummy: () => 'admin graphql',
  },
  Mutation: {
    inviteVendorMemberByAdmin: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirst({
          where: {
            email: args.email,
          },
        });

        if (user) {
          throw new PublicError('User already exist');
        }

        // Only allow admin invite two pocs for one vendor company account
        const primaryVendorMembers = await trx.vendorMember.findMany({
          where: {
            is_primary_member: true,
            vendor_company_id: args.vendor_company_id,
          }
        });

        if (primaryVendorMembers.length >= 2) {
          throw new PublicError('Primary member exists and full');
        }

        const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        const newUser = await trx.user.create({
          data: {
            email: args.email,
            first_name: args.first_name,
            last_name: args.last_name,
            reset_password_token: createResetPasswordToken(),
            reset_password_expiration: new Date(resetTokenExpiration),
          }
        });

        const newVendorMember = await trx.vendorMember.create({
          data: {
            user_id: newUser.id,
            vendor_company_id: args.vendor_company_id,
            is_primary_member: true,
          }
        });

        sendVendorMemberInvitationByAdminEmail(newUser);
        return newVendorMember;
      });
    },
    inviteVendorMemberByBiotech: async (_, args, context) => {
      if (process.env.BIOTECH_INVITE_CRO) {
        return await context.prisma.$transaction(async (trx) => {
          const vendorCompany = await trx.vendorCompany.findFirst({
            where: {
              name: args.vendor_company_id,
            },
          });

          if (!vendorCompany) {
            throw new PublicError('Vendor company not found');
          }

          if (!vendorCompany.invited_by) {
            throw new PublicError('Vendor company not invited by biotech');
          }

          const biotech = await trx.biotech.findFirst({
            where: {
              id: vendorCompany.invited_by,
            },
          });

          if (!biotech) {
            throw new PublicError('Biotech not found');
          }

          const inviter = await trx.user.findFirst({
            where: {
              id: args.user_id,
            },
          });

          if (!inviter) {
            throw new PublicError('Inviter not found');
          }

          const user = await trx.user.findFirst({
            where: {
              email: args.email,
            },
          });

          if (user) {
            throw new PublicError('User already exist');
          }

          const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
          const newUser = await trx.user.create({
            data: {
              email: args.email,
              first_name: args.first_name,
              last_name: args.last_name,
              reset_password_token: createResetPasswordToken(),
              reset_password_expiration: new Date(resetTokenExpiration),
            }
          });
  
          const newVendorMember = await trx.vendorMember.create({
            data: {
              user_id: newUser.id,
              vendor_company_id: vendorCompany.id,
              is_primary_member: true,
            }
          });

          // TODO: send email to new vendor member by biotech
          sendVendorMemberInvitationByBiotechEmail(newUser, biotech.name, inviter);        
          return newVendorMember;
        });
      }
      return null;
    },
  }
}

export default resolver;
