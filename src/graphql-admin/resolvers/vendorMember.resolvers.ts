import { PublicError } from '../../graphql/errors/PublicError';
import { Resolvers } from '../../generated';
import { Context } from '../../types/context';
import { createResetPasswordToken } from '../../helper/auth';
import { sendVendorMemberInvitationByAdminEmail } from '../../mailer/vendorMember';

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

        // Only allow admin invite one poc for one vendor company account
        const primaryVendorMember = await trx.vendorMember.findFirst({
          where: {
            is_primary_member: true,
            vendor_company_id: args.vendor_company_id,
          }
        });

        if (primaryVendorMember) {
          throw new PublicError('Primary member exists');
        }

        const resetTokenExpiration = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
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
  }
}

export default resolver;
