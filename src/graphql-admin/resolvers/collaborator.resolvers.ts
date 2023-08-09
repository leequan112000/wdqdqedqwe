import { Resolvers } from "../../generated";
import { createResetPasswordToken } from "../../helper/auth";
import { Context } from "../../types/context";
import { sendVendorMemberInvitationByAdminEmail } from "../../mailer/vendorMember";
import invariant from "../../helper/invariant";
import { PublicError } from "../../graphql/errors/PublicError";
import collaboratorService from '../../services/collaborator/collaborator.service';
import { CompanyCollaboratorRoleType } from "../../helper/constant";

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
    updateVendorMemberByAdmin: async (_, args, context) => {
      const { user_id, department, first_name, last_name, role, title } = args;
      await context.prisma.$transaction(async (trx) => {
        await trx.user.update({
          where: {
            id: user_id,
          },
          data: {
            first_name: first_name ?? undefined,
            last_name: last_name ?? undefined,
          },
        });
        const updatedVendorMember = await trx.vendorMember.update({
          where: {
            user_id,
          },
          data: {
            title: title ?? undefined,
            department: department ?? undefined,
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
  }
}

export default resolvers;
