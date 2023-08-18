import moment from "moment";
import { createResetPasswordToken } from "../../helper/auth";
import { sendVendorMemberInvitationByBiotechEmail, sendVendorMemberInvitationByExistingMemberEmail } from "../../mailer/vendorMember";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";
import { app_env } from "../../environment";

const PROJECT_REQUEST_RESPONSE_PERIOD = 14; // in day

const resolvers: Resolvers<Context> = {
  VendorMember: {
    user: async (parent, _, context) => {
      invariant(parent.user_id, 'Missing user id.');

      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      });
    },
    vendor_company: async (parent, _, context) => {
      invariant(parent.vendor_company_id, 'Missing vendor company id.');

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
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
      try {
        return await context.prisma.vendorMember.update({
          where: {
            user_id: context.req.user_id
          },
          data: {
            title: args.title,
            phone: args.phone,
            department: args.department,
            ...(args.is_primary_member !== null ? { is_primary_member: args.is_primary_member } : {}),
          }
        });
      } catch (error) {
        throw error;
      }
    },
    inviteVendorMember: async (_, args, context) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirst({
            where: {
              email: args.email
            }
          });

          invariant(!user, new PublicError('User already exist!'));

          const currentUser = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id
            },
            include: {
              vendor_member: true
            }
          });

          const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
          const newUser = await trx.user.create({
            data: {
              ...args,
              reset_password_token: createResetPasswordToken(),
              reset_password_expiration: new Date(resetTokenExpiration),
            }
          });

          const newVendorMember = await trx.vendorMember.create({
            data: {
              user_id: newUser.id,
              vendor_company_id: currentUser.vendor_member?.vendor_company_id!,
            }
          });

          sendVendorMemberInvitationByExistingMemberEmail(currentUser, newUser, args.custom_message || "");

          return newVendorMember;
        });
      } catch (error) {
        throw error;
      }
    },
    resendVendorMemberInviteByBiotech: async (_, args, context) => {
      if (process.env.ENABLE_BIOTECH_INVITE_CRO === 'true') {
        invariant(args.biotech_invite_vendor_id, 'Biotech invite vendor ID is required.');

        const biotechInviteVendor = await context.prisma.biotechInviteVendor.findFirst({
          where: {
            id: args.biotech_invite_vendor_id,
          },
          include: {
            biotech: true,
            inviter: true,
          },
        });

        invariant(biotechInviteVendor, 'Biotech invite vendor record not found.');
        invariant(biotechInviteVendor.project_request_id, 'Project request ID is not found.');
        const vendorCompany = await context.prisma.vendorCompany.findFirst({
          where: {
            name: biotechInviteVendor.company_name,
          },
        });

        const projectConnection = await context.prisma.projectConnection.findFirst({
          where: {
            project_request_id: biotechInviteVendor.project_request_id,
            vendor_company_id: vendorCompany?.id,
          },
        });

        const newExpiryDate = moment().add(PROJECT_REQUEST_RESPONSE_PERIOD, 'd').endOf('d');

        const resetProjectExpiryDate = await context.prisma.projectConnection.update({
          where: {
            id: projectConnection?.id,
          },
          data: {
            expired_at: newExpiryDate.toDate(),
          },
        });

        const invitedUser = await context.prisma.user.findFirst({
          where: {
            email: biotechInviteVendor.email,
          },
          include: {
            vendor_member: true,
          },
        });
        invariant(invitedUser, 'Invited user not found.');
        invariant(biotechInviteVendor.biotech?.name, 'Biotech name not found.');
        invariant(biotechInviteVendor.inviter, 'Inviter not found.');

        const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        const buttonUrl = `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(
          invitedUser.reset_password_token!
        )}`;

        if (!invitedUser?.vendor_member?.title) {
          const resetInvitedUserPasswordExpiryDate = await context.prisma.user.update({
            where: {
              id: invitedUser?.id,
            },
            data: {
              reset_password_expiration: new Date(resetTokenExpiration),
            },
          });
          sendVendorMemberInvitationByBiotechEmail(
            invitedUser,
            biotechInviteVendor.biotech?.name,
            biotechInviteVendor.inviter,
            buttonUrl,
          );
          return true;
        }

        sendVendorMemberInvitationByBiotechEmail(
          invitedUser,
          biotechInviteVendor.biotech?.name,
          biotechInviteVendor.inviter,
          buttonUrl,
        );
        return true;
      }
      return null;
    },
  }
};

export default resolvers;
