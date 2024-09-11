import { Resolvers } from '../generated';
import { createResetPasswordToken } from '../../helper/auth';
import { Context } from '../../types/context';
import invariant from '../../helper/invariant';
import { PublicError } from '../../graphql/errors/PublicError';
import collaboratorService from '../../services/collaborator/collaborator.service';
import { CompanyCollaboratorRoleType } from '../../helper/constant';
import {
  customerInvitationByAdminEmail,
  vendorMemberInvitationByAdminEmail,
} from '../../mailer';
import {
  createResetPasswordUrl,
  getEmailFromPseudonyms,
  getUserFullName,
  getUserFullNameFromPseudonyms,
} from '../../helper/email';
import { encrypt } from '../../helper/gdprHelper';

function ignoreEmptyString(data: string | undefined | null) {
  if (data === '') {
    return undefined;
  }
  return data;
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    resendVendorMemberInvitationByAdmin: async (parent, args, context) => {
      const newUser = await context.prisma.user.findFirst({
        where: {
          id: args.user_id,
        },
        include: {
          vendor_member: {
            select: {
              title: true,
            },
          },
        },
      });

      invariant(newUser, new PublicError('User not found.'));

      invariant(
        !newUser?.vendor_member?.title,
        new PublicError('User already onboarded.'),
      );

      const resetTokenExpiration =
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const resetToken = createResetPasswordToken();
      const updatedNewUser = await context.prisma.user.update({
        where: {
          id: args.user_id,
        },
        data: {
          reset_password_token: resetToken,
          reset_password_expiration: new Date(resetTokenExpiration),
        },
        include: {
          pseudonyms: true,
          vendor_member: true,
        },
      });

      invariant(
        updatedNewUser.reset_password_token,
        new PublicError('Reset password token not found'),
      );

      const resetPasswordUrl = createResetPasswordUrl(resetToken);
      const updatedNewUserFullName = getUserFullNameFromPseudonyms(
        updatedNewUser.pseudonyms!,
      );

      vendorMemberInvitationByAdminEmail(
        {
          login_url: resetPasswordUrl,
          receiver_full_name: updatedNewUserFullName,
        },
        getEmailFromPseudonyms(updatedNewUser.pseudonyms!),
      );

      return true;
    },
    resendCustomerInvitationByAdmin: async (parent, args, context) => {
      const newUser = await context.prisma.user.findFirst({
        where: {
          id: args.user_id,
        },
        include: {
          customer: {
            select: {
              job_title: true,
            },
          },
        },
      });

      invariant(newUser, new PublicError('User not found.'));

      invariant(
        !newUser?.customer?.job_title,
        new PublicError('User already onboarded.'),
      );

      const resetTokenExpiration =
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const resetToken = createResetPasswordToken();
      const updatedNewUser = await context.prisma.user.update({
        where: {
          id: args.user_id,
        },
        data: {
          reset_password_token: resetToken,
          reset_password_expiration: new Date(resetTokenExpiration),
        },
        include: {
          pseudonyms: true,
        },
      });

      invariant(
        updatedNewUser.reset_password_token,
        new PublicError('Reset password token not found'),
      );

      const resetPasswordUrl = createResetPasswordUrl(resetToken);
      const updatedNewUserFullName = getUserFullNameFromPseudonyms(
        updatedNewUser.pseudonyms!,
      );
      customerInvitationByAdminEmail(
        {
          login_url: resetPasswordUrl,
          receiver_full_name: updatedNewUserFullName,
        },
        getEmailFromPseudonyms(updatedNewUser.pseudonyms!),
      );

      return true;
    },
    updateVendorMemberByAdmin: async (_, args, context) => {
      const {
        user_id,
        department,
        first_name,
        last_name,
        role,
        title,
        country_code,
        phone_number,
      } = args;
      await context.prisma.$transaction(async (trx) => {
        await trx.user.update({
          where: {
            id: user_id,
          },
          data: {
            pseudonyms: {
              update: {
                first_name: encrypt(ignoreEmptyString(first_name)) ?? undefined,
                last_name: encrypt(ignoreEmptyString(last_name)) ?? undefined,
                country_code: encrypt(country_code) || null,
                phone_number: encrypt(phone_number) || null,
              },
            },
          },
        });
        const updatedVendorMember = await trx.vendorMember.update({
          where: {
            user_id,
          },
          data: {
            title: ignoreEmptyString(title) ?? undefined,
            department: ignoreEmptyString(department) ?? undefined,
          },
        });

        switch (role) {
          case CompanyCollaboratorRoleType.ADMIN: {
            await collaboratorService.setVendorMemberAsAdmin(
              {
                user_id,
                vendor_company_id: updatedVendorMember.vendor_company_id,
                vendor_member_id: updatedVendorMember.id,
              },
              { prisma: trx },
            );
            break;
          }
          case CompanyCollaboratorRoleType.USER: {
            await collaboratorService.setVendorMemberAsUser(
              {
                vendor_member_id: updatedVendorMember.id,
              },
              { prisma: trx },
            );
            break;
          }
          case CompanyCollaboratorRoleType.OWNER: {
            // ignore
            break;
          }
          default:
            throw new PublicError('Invalid role');
        }
      });
      return true;
    },
    updateCustomerByAdmin: async (_, args, context) => {
      const {
        user_id,
        team,
        first_name,
        last_name,
        role,
        job_title,
        phone_number,
        country_code,
      } = args;
      await context.prisma.$transaction(async (trx) => {
        await trx.user.update({
          where: {
            id: user_id,
          },
          data: {
            pseudonyms: {
              update: {
                first_name: encrypt(ignoreEmptyString(first_name)) ?? undefined,
                last_name: encrypt(ignoreEmptyString(last_name)) ?? undefined,
                country_code: encrypt(country_code) || null,
                phone_number: encrypt(phone_number) || null,
              },
            },
          },
        });
        const updatedCustomer = await trx.customer.update({
          where: {
            user_id,
          },
          data: {
            job_title: ignoreEmptyString(job_title) ?? undefined,
            team: ignoreEmptyString(team) ?? undefined,
          },
        });

        switch (role) {
          case CompanyCollaboratorRoleType.ADMIN: {
            await collaboratorService.setCustomerAsAdmin(
              {
                user_id,
                biotech_id: updatedCustomer.biotech_id,
                customer_id: updatedCustomer.id,
              },
              { prisma: trx },
            );
            break;
          }
          case CompanyCollaboratorRoleType.USER: {
            await collaboratorService.setCustomerAsUser(
              {
                customer_id: updatedCustomer.id,
              },
              { prisma: trx },
            );
            break;
          }
          case CompanyCollaboratorRoleType.OWNER: {
            // ignore
            break;
          }
          default:
            throw new PublicError('Invalid role');
        }
      });
      return true;
    },
    transferBiotechOwnershipByAdmin: async (_, args, context) => {
      const { biotech_id, user_id } = args;
      const owner = await context.prisma.customer.findFirst({
        where: {
          biotech_id,
          role: CompanyCollaboratorRoleType.OWNER,
        },
        include: {
          user: true,
        },
      });

      invariant(owner, new PublicError('Owner not found.'));

      const newOwner = await context.prisma.customer.findFirst({
        where: {
          user_id,
        },
      });

      invariant(newOwner, new PublicError('New owner user not found.'));
      invariant(
        newOwner.biotech_id === biotech_id,
        new PublicError('The new owner does not belong to this biotech.'),
      );
      invariant(
        owner.user_id !== user_id,
        new PublicError('The user is already the owner of this biotech.'),
      );

      await context.prisma.$transaction(async (trx) => {
        await collaboratorService.setCustomerAsUser(
          {
            customer_id: owner.id,
          },
          { prisma: trx },
        );

        await collaboratorService.setCustomerAsOwner(
          {
            customer_id: newOwner.id,
          },
          { prisma: trx },
        );
      });
      return true;
    },
    transferVendorCompanyOwnershipByAdmin: async (_, args, context) => {
      const { vendor_company_id, user_id } = args;
      const owner = await context.prisma.vendorMember.findFirst({
        where: {
          vendor_company_id,
          role: CompanyCollaboratorRoleType.OWNER,
        },
        include: {
          user: true,
        },
      });

      invariant(owner, new PublicError('Owner not found.'));

      const newOwner = await context.prisma.vendorMember.findFirst({
        where: {
          user_id,
        },
      });

      invariant(newOwner, new PublicError('New owner user not found.'));
      invariant(
        newOwner.vendor_company_id === vendor_company_id,
        new PublicError(
          'The new owner does not belong to this vendor company.',
        ),
      );
      invariant(
        owner.user_id !== user_id,
        new PublicError(
          'The user is already the owner of this vendor company.',
        ),
      );

      await context.prisma.$transaction(async (trx) => {
        await collaboratorService.setVendorMemberAsUser(
          {
            vendor_member_id: owner.id,
          },
          { prisma: trx },
        );

        await collaboratorService.setVendorMemberAsOwner(
          {
            vendor_member_id: newOwner.id,
          },
          { prisma: trx },
        );
      });
      return true;
    },
  },
};

export default resolvers;
