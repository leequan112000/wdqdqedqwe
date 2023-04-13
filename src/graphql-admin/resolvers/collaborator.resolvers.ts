import { InternalError } from "../../graphql/errors/InternalError";
import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { sendVendorMemberInvitationByAdminEmail } from "../../mailer/vendorMember";

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

      if (newUser?.vendor_member?.title) {
        throw new InternalError('User already onboarded.')
      }

      if (!newUser) {
        throw new InternalError('User not found.')
      }

      sendVendorMemberInvitationByAdminEmail(newUser);

      return true;
    },
  }
}

export default resolvers;
