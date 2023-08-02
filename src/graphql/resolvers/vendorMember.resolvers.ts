import { createResetPasswordToken } from "../../helper/auth";
import { sendVendorMemberInvitationByExistingMemberEmail } from "../../mailer/vendorMember";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";

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
  }
};

export default resolvers;
