import { PublicError } from '../../graphql/errors/PublicError';
import { Resolvers } from '../generated';
import { Context } from '../../types/context';
import { createResetPasswordToken } from '../../helper/auth';
import invariant from '../../helper/invariant';
import { CasbinRole, CompanyCollaboratorRoleType } from '../../helper/constant';
import collaboratorService from '../../services/collaborator/collaborator.service';
import { addRoleForUser } from '../../helper/casbin';
import { vendorMemberInvitationByAdminEmail } from '../../mailer';
import {
  createResetPasswordUrl,
  getUserEmail,
  getUserFullName,
} from '../../helper/email';
import { encrypt } from '../../helper/gdprHelper';

const resolver: Resolvers<Context> = {
  VendorMember: {
    user: async (parent, _, context) => {
      if (parent.user) return parent.user;

      if (!parent.user_id) return null;

      return await context.prisma.user.findUnique({
        where: {
          id: parent.user_id,
        },
      });
    },
  },
  Query: {
    _dummy: () => 'admin graphql',
  },
  Mutation: {
    inviteVendorMemberByAdmin: async (_, args, context) => {
      const lowerCaseEmail = args.email.toLowerCase();
      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirst({
          where: {
            email: encrypt(lowerCaseEmail),
          },
        });

        invariant(user === null, new PublicError('User already exist.'));

        const owner = await trx.vendorMember.findFirst({
          where: {
            role: CompanyCollaboratorRoleType.OWNER,
            vendor_company_id: args.vendor_company_id,
          },
        });
        const noOwner = owner === null;

        // Check if company has owner.
        invariant(
          (args.role === CompanyCollaboratorRoleType.OWNER && noOwner) ||
            args.role !== CompanyCollaboratorRoleType.OWNER,
          new PublicError('Owner already exists!'),
        );

        const resetTokenExpiration =
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        const resetToken = createResetPasswordToken();
        const newUser = await trx.user.create({
          data: {
            reset_password_token: resetToken,
            reset_password_expiration: new Date(resetTokenExpiration),
            email: encrypt(lowerCaseEmail),
            first_name: encrypt(args.first_name),
            last_name: encrypt(args.last_name),
            phone_number: encrypt(args.phone_number) || null,
            country_code: encrypt(args.country_code) || null,
          },
        });

        invariant(newUser.reset_password_token);

        const newVendorMember = await trx.vendorMember.create({
          data: {
            user_id: newUser.id,
            vendor_company_id: args.vendor_company_id,
          },
        });

        switch (args.role) {
          case CompanyCollaboratorRoleType.ADMIN: {
            await collaboratorService.setVendorMemberAsAdmin(
              {
                user_id: newUser.id,
                vendor_company_id: args.vendor_company_id,
                vendor_member_id: newVendorMember.id,
              },
              { prisma: trx },
            );
            break;
          }
          case CompanyCollaboratorRoleType.USER: {
            await collaboratorService.setVendorMemberAsUser(
              {
                vendor_member_id: newVendorMember.id,
              },
              { prisma: trx },
            );
            break;
          }
          case CompanyCollaboratorRoleType.OWNER: {
            await trx.vendorMember.update({
              where: {
                id: newVendorMember.id,
              },
              data: {
                role: CompanyCollaboratorRoleType.OWNER,
              },
            });
            await addRoleForUser(newUser.id, CasbinRole.OWNER);
            break;
          }
          default:
            throw new PublicError('Invalid role.');
        }

        const resetPasswordUrl = createResetPasswordUrl(resetToken);
        const newUserFullName = getUserFullName(newUser);

        vendorMemberInvitationByAdminEmail(
          {
            login_url: resetPasswordUrl,
            receiver_full_name: newUserFullName,
          },
          getUserEmail(newUser),
        );

        return newVendorMember;
      });
    },
  },
};

export default resolver;
