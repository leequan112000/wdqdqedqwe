import { Resolvers } from "../generated";
import { createResetPasswordToken } from "../../helper/auth";
import { Context } from "../../types/context";
import invariant from "../../helper/invariant";
import { PublicError } from "../../graphql/errors/PublicError";
import collaboratorService from '../../services/collaborator/collaborator.service';
import { CompanyCollaboratorRoleType } from "../../helper/constant";
import { createCustomerInvitationByAdminEmailJob, createVendorMemberInvitationByAdminEmailJob } from "../../queues/email.queues";

function ignoreEmptyString(data: string | undefined | null) {
  if (data === "") {
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

      invariant(updatedNewUser.reset_password_token, new PublicError('Reset password token not found'));

      createVendorMemberInvitationByAdminEmailJob(
        {
          receiverEmail: updatedNewUser.email,
          receiverName: `${updatedNewUser.first_name} ${updatedNewUser.last_name}`,
          resetPasswordToken: updatedNewUser.reset_password_token
        }
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

      invariant(!newUser?.customer?.job_title, new PublicError('User already onboarded.'))

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

      invariant(updatedNewUser.reset_password_token, new PublicError('Reset password token not found'));

      createCustomerInvitationByAdminEmailJob(
        {
          receiverEmail: updatedNewUser.email,
          receiverName: `${updatedNewUser.first_name} ${updatedNewUser.last_name}`,
          resetPasswordToken: updatedNewUser.reset_password_token
        }
      );

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
            first_name: ignoreEmptyString(first_name) ?? undefined,
            last_name: ignoreEmptyString(last_name) ?? undefined,
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
  }
}

export default resolvers;
