import { sendVendorMemberInvitationByExistingMemberEmail } from "../../mailer/vendorMember";
import { createResetPasswordToken } from "../../helper/auth";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../../generated";
import { sendCustomerInvitationEmail } from "../../mailer/customer";

const resolvers: Resolvers<Context> = {
  Query: {
    collaborators: async (_, __, context) => {
      const userId = context.req.user_id;
      const user = await context.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          customer: {
            select: {
              biotech_id: true,
            },
          },
          vendor_member: {
            select: {
              vendor_company_id: true,
            },
          },
        },
      });

      if (!user) {
        throw new InternalError('User not found');
      }

      if (user.customer?.biotech_id) {
        return await context.prisma.user.findMany({
          where: {
            customer: {
              biotech_id: user.customer.biotech_id,
            },
          },
          orderBy: {
            created_at: 'asc'
          },
        });
      }

      if (user.vendor_member?.vendor_company_id) {
        return await context.prisma.user.findMany({
          where: {
            vendor_member: {
              vendor_company_id: user.vendor_member.vendor_company_id,
            },
          },
          orderBy: {
            created_at: 'asc'
          },
        });
      }

      throw new InternalError('Collaborators not found.');
    },
  },
  Mutation: {
    inviteCollaborator: async (parent, args, context) => {
      // Check for existing user
      const existingUser = await context.prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });

      if (existingUser) {
        throw new PublicError('User already exists!')
      }

      // Get current user data with company id
      const userId = context.req.user_id;
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          customer: {
            select: {
              biotech_id: true,
            },
          },
          vendor_member: {
            select: {
              vendor_company_id: true,
            },
          },
        },
      });

      if (!currentUser) {
        throw new InternalError('Current user not found');
      }

      const resetTokenExpiration = new Date().getTime() + 60 * 60 * 1000;
      const resetToken = createResetPasswordToken();

      return await context.prisma.$transaction(async (trx) => {
        // Create new user
        const newUser = await trx.user.create({
          data: {
            first_name: args.first_name,
            last_name: args.last_name,
            email: args.email,
            reset_password_token: resetToken,
            reset_password_expiration: new Date(resetTokenExpiration),
          },
        });
        const emailMessage = args.custom_message || '';

        // If current user is a biotech member, create customer data for the new user.
        if (currentUser.customer?.biotech_id) {
          await trx.customer.create({
            data: {
              user_id: newUser.id,
              biotech_id: currentUser.customer.biotech_id,
            },
          });
          sendCustomerInvitationEmail(currentUser, newUser, emailMessage);
        }

        // If current user is a vendor member, create vendor member data for the new user.
        if (currentUser.vendor_member?.vendor_company_id) {
          await trx.vendorMember.create({
            data: {
              user_id: newUser.id,
              vendor_company_id: currentUser.vendor_member.vendor_company_id,
            }
          });
          sendVendorMemberInvitationByExistingMemberEmail(currentUser, newUser, emailMessage);
        }

        return newUser;
      })
    },
    resendInvitation: async (parent, args, context) => {
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            select: {
              biotech_id: true,
            },
          },
          vendor_member: {
            select: {
              vendor_company_id: true,
            },
          },
        },
      });
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
          vendor_member: {
            select: {
              title: true,
            },
          },
        },
      });

      if (newUser?.customer?.job_title || newUser?.vendor_member?.title) {
        throw new InternalError('User already onboarded.')
      }

      if (!newUser) {
        throw new InternalError('User not found.')
      }

      if (currentUser?.customer?.biotech_id) {
        sendCustomerInvitationEmail(currentUser, newUser);
        return newUser;
      }
      if (currentUser?.vendor_member?.vendor_company_id) {
        sendVendorMemberInvitationByExistingMemberEmail(currentUser, newUser);
        return newUser;
      }

      throw new InternalError('User not found.');
    },
  },
};

export default resolvers;
