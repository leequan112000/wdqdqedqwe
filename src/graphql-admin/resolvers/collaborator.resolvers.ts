import { InternalError } from "../../graphql/errors/InternalError";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { sendCustomerInvitationEmail } from "../../mailer/customer";
import { sendVendorMemberInvitationByExistingMemberEmail } from "../../mailer/vendorMember";

const resolvers: Resolvers<Context> = {
  Mutation: {
    resendInvitationByAdmin: async (parent, args, context) => {
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
        return true;
      }
      if (currentUser?.vendor_member?.vendor_company_id) {
        sendVendorMemberInvitationByExistingMemberEmail(currentUser, newUser);
        return true;
      }

      throw new InternalError('User not found.');
    },
  }
}

export default resolvers;
