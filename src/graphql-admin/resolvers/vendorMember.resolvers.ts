import { PublicError } from '../../graphql/errors/PublicError';
import { Resolvers } from '../../generated';
import { Context } from '../../types/context';
import { createResetPasswordToken } from '../../helper/auth';
import invariant from '../../helper/invariant';
import { sendVendorMemberInvitationByAdminEmail } from '../../mailer/vendorMember';
import { addRoleForUser } from '../../helper/casbin';
import { CasbinRole } from '../../helper/constant';

const resolver: Resolvers<Context> = {
  VendorMember: {
    user: async (parent, _, context) => {
      invariant(parent.user_id, 'User id not found.')
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      })
    },
  },
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

        await addRoleForUser(newUser.id, CasbinRole.OWNER);

        sendVendorMemberInvitationByAdminEmail(newUser);
        return newVendorMember;
      });
    },
  }
}

export default resolver;
