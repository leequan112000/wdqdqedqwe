import moment from 'moment';
import { createResetPasswordToken } from '../../helper/auth';
import {
  vendorMemberInvitationByBiotechEmail,
  vendorMemberInvitationByUserEmail,
} from '../../mailer';
import { Context } from '../../types/context';
import { PublicError } from '../errors/PublicError';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';
import {
  createResetPasswordUrl,
  getEmailFromPseudonyms,
  getUserFullNameFromPseudonyms,
} from '../../helper/email';
import { availabilitiesCreateData } from '../../helper/availability';
import { encrypt } from '../../helper/gdprHelper';

const PROJECT_REQUEST_RESPONSE_PERIOD = 14; // in day

const resolvers: Resolvers<Context> = {
  VendorMember: {
    user: async (parent, _, context) => {
      invariant(parent.user_id, 'Missing user id.');

      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id,
        },
      });
    },
    vendor_company: async (parent, _, context) => {
      invariant(parent.vendor_company_id, 'Missing vendor company id.');

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id,
        },
      });
    },
  },
  Query: {
    vendorMember: async (_, __, context) => {
      return await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });
    },
  },
  Mutation: {
    updateVendorMember: async (_, args, context) => {
      const { timezone } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Missing user id.');
      return context.prisma.$transaction(async (trx) => {
        const existingRules = await trx.availability.findMany({
          where: {
            user_id: currentUserId,
          },
        });
        const hasExistingRules = existingRules.length > 0;
        if (timezone && !hasExistingRules) {
          const availabilityCreateInputs = availabilitiesCreateData(
            timezone,
            currentUserId,
          );
          await trx.availability.createMany({
            data: availabilityCreateInputs,
          });
        }

        return await context.prisma.vendorMember.update({
          where: {
            user_id: context.req.user_id,
          },
          data: {
            title: args.title,
            phone: args.phone,
            department: args.department,
          },
        });
      });
    },
    inviteVendorMember: async (_, args, context) => {
      try {
        const lowerCaseEmail = args.email.toLowerCase();
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirst({
            where: {
              pseudonyms: {
                email: encrypt(lowerCaseEmail),
              },
            },
          });

          invariant(!user, new PublicError('User already exist!'));

          const currentUser = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id,
            },
            include: {
              vendor_member: true,
              pseudonyms: true,
            },
          });

          const resetTokenExpiration =
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
          const resetToken = createResetPasswordToken();
          const newUser = await trx.user.create({
            data: {
              pseudonyms: {
                create: {
                  email: encrypt(lowerCaseEmail),
                  first_name: encrypt(args.first_name),
                  last_name: encrypt(args.last_name),
                },
              },
              ...args,
              reset_password_token: resetToken,
              reset_password_expiration: new Date(resetTokenExpiration),
            },
            include: {
              pseudonyms: true,
            },
          });

          const newVendorMember = await trx.vendorMember.create({
            data: {
              user_id: newUser.id,
              vendor_company_id: currentUser.vendor_member?.vendor_company_id!,
            },
          });

          const newUserFullName = getUserFullNameFromPseudonyms(
            newUser.pseudonyms!,
          );
          const resetPasswordUrl = createResetPasswordUrl(resetToken);
          const currentUserFullName = getUserFullNameFromPseudonyms(
            currentUser.pseudonyms!,
          );

          vendorMemberInvitationByUserEmail(
            {
              inviter_full_name: currentUserFullName,
              inviter_message: args.custom_message || '',
              login_url: resetPasswordUrl,
              receiver_full_name: newUserFullName,
            },
            getEmailFromPseudonyms(newUser.pseudonyms!),
          );

          return newVendorMember;
        });
      } catch (error) {
        throw error;
      }
    },
    resendVendorMemberInviteByBiotech: async (_, args, context) => {
      if (process.env.ENABLE_BIOTECH_INVITE_CRO === 'true') {
        invariant(
          args.biotech_invite_vendor_id,
          'Biotech invite vendor ID is required.',
        );

        const biotechInviteVendor =
          await context.prisma.biotechInviteVendor.findFirst({
            where: {
              id: args.biotech_invite_vendor_id,
            },
            include: {
              biotech: true,
              inviter: {
                include: {
                  pseudonyms: true,
                },
              },
              project_request: true,
            },
          });

        const projectRequest = biotechInviteVendor?.project_request;
        invariant(
          biotechInviteVendor,
          'Biotech invite vendor record not found.',
        );
        invariant(
          biotechInviteVendor.project_request_id,
          'Project request ID is not found.',
        );
        invariant(projectRequest, 'Project request not found.');
        const vendorCompany = await context.prisma.vendorCompany.findFirst({
          where: {
            name: biotechInviteVendor.company_name,
          },
        });

        const projectConnection =
          await context.prisma.projectConnection.findFirst({
            where: {
              project_request_id: biotechInviteVendor.project_request_id,
              vendor_company_id: vendorCompany?.id,
            },
          });

        const newExpiryDate = moment()
          .add(PROJECT_REQUEST_RESPONSE_PERIOD, 'd')
          .endOf('d');

        const resetProjectExpiryDate =
          await context.prisma.projectConnection.update({
            where: {
              id: projectConnection?.id,
            },
            data: {
              expired_at: newExpiryDate.toDate(),
            },
          });

        const invitedUser = await context.prisma.user.findFirst({
          where: {
            pseudonyms: {
              email: encrypt(biotechInviteVendor.email),
            },
          },
          include: {
            pseudonyms: true,
            vendor_member: true,
          },
        });
        invariant(invitedUser, 'Invited user not found.');
        invariant(biotechInviteVendor.biotech?.name, 'Biotech name not found.');
        invariant(biotechInviteVendor.inviter, 'Inviter not found.');
        const inviterFullName = getUserFullNameFromPseudonyms(
          biotechInviteVendor.inviter.pseudonyms!,
        );
        const receiverFullName = getUserFullNameFromPseudonyms(
          invitedUser.pseudonyms!,
        );

        invariant(
          invitedUser.reset_password_token,
          'Reset password token not found.',
        );
        const resetTokenExpiration =
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        const resetPasswordUrl = createResetPasswordUrl(
          invitedUser.reset_password_token,
        );

        if (!invitedUser?.vendor_member?.title) {
          const resetInvitedUserPasswordExpiryDate =
            await context.prisma.user.update({
              where: {
                id: invitedUser?.id,
              },
              data: {
                reset_password_expiration: new Date(resetTokenExpiration),
              },
            });
          vendorMemberInvitationByBiotechEmail(
            {
              biotech_name: biotechInviteVendor.biotech.name,
              inviter_full_name: inviterFullName,
              login_url: resetPasswordUrl,
              project_request_name: projectRequest.title,
              receiver_full_name: receiverFullName,
            },
            getEmailFromPseudonyms(invitedUser.pseudonyms!),
          );
          return true;
        }

        vendorMemberInvitationByBiotechEmail(
          {
            biotech_name: biotechInviteVendor.biotech.name,
            inviter_full_name: inviterFullName,
            login_url: resetPasswordUrl,
            project_request_name: projectRequest.title,
            receiver_full_name: receiverFullName,
          },
          getEmailFromPseudonyms(invitedUser.pseudonyms!),
        );
        return true;
      }
      return null;
    },
  },
};

export default resolvers;
