import { InternalError } from "../../graphql/errors/InternalError";
import { Resolvers } from "../../generated";
import { createResetPasswordToken } from "../../helper/auth";
import { Context } from "../../types/context";
import { sendVendorMemberInvitationByAdminEmail } from "../../mailer/vendorMember";
import invariant from "../../helper/invariant";
import { PublicError } from "../../graphql/errors/PublicError";

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

      invariant(!newUser?.vendor_member?.title, new PublicError('User already onboarded.'))

      const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const resetToken = createResetPasswordToken();
      const updatedNewUser = await context.prisma.user.update({
        where: {
          id: args.user_id,
        },
        data: {
          reset_password_token: resetToken,
          reset_password_expiration: new Date(resetTokenExpiration),
        },
      });

      sendVendorMemberInvitationByAdminEmail(updatedNewUser);

      return true;
    },
  }
}

export default resolvers;
