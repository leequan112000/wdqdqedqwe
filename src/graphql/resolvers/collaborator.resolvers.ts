import moment from "moment";
import { vendorMemberInvitationByUserEmail } from "../../mailer";
import { createResetPasswordToken } from "../../helper/auth";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../generated";
import { customerInvitationEmail } from "../../mailer/customer";
import { addRoleForUser, hasPermission } from "../../helper/casbin";
import invariant from "../../helper/invariant";
import { CasbinAct, CasbinObj, CasbinRole, CompanyCollaboratorRoleType } from "../../helper/constant";
import { PermissionDeniedError } from "../errors/PermissionDeniedError";
import subscriptionService from "../../services/subscription/subscription.service";
import collaboratorService from "../../services/collaborator/collaborator.service";
import { createResetPasswordUrl, getUserFullName } from "../../helper/email";
import { checkAllowCustomerOnlyPermission, checkAllowVendorOnlyPermission } from "../../helper/accessControl";

const resolvers: Resolvers<Context> = {
  Query: {
    collaborators: async (_, args, context) => {
      const { active_only } = args;
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

      invariant(user, 'User not found.');

      if (user.customer?.biotech_id) {
        return await context.prisma.user.findMany({
          where: {
            customer: {
              biotech_id: user.customer.biotech_id,
            },
            ...(active_only
              ? { NOT: { deactivated_at: { lte: new Date() } } }
              : {}),
          },
          orderBy: {
            created_at: "asc",
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
      const currentUserId = context.req.user_id;
      const { role = CompanyCollaboratorRoleType.USER } = args;
      const castedRole = (role as CompanyCollaboratorRoleType) || CompanyCollaboratorRoleType.USER;

      invariant(currentUserId, 'Current user id not found.');

      // Check if current user has the permission to set the role.
      if (castedRole) {
        const roleEnum = Object.values(CompanyCollaboratorRoleType);
        invariant(roleEnum.includes(castedRole as CompanyCollaboratorRoleType), 'Invalid company collaborator role.');
        await collaboratorService.checkPermissionToEditRole({
          role: castedRole,
          user_id: currentUserId,
        });
      }

      const lowerCaseEmail = args.email.toLowerCase();

      // Check for existing user
      const existingUser = await context.prisma.user.findFirst({
        where: {
          email: {
            mode: 'insensitive',
            equals: lowerCaseEmail,
          },
        },
      });

      invariant(!existingUser, new PublicError('User already exists!'));

      // Get current user data with company id
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: currentUserId,
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
      invariant(currentUser, 'Current user not found.');

      const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const resetToken = createResetPasswordToken();

      const isBiotech = !!currentUser.customer;
      const isVendor = !!currentUser.vendor_member;

      const newUser = await context.prisma.$transaction(async (trx) => {
        const splitName = args.name.split(' ');
        const firstName = splitName[0];
        const lastName = splitName.length === 1 ? '' : splitName[splitName.length - 1];
        // Create new user
        const newUser = await trx.user.create({
          data: {
            first_name: firstName,
            last_name: lastName,
            email: lowerCaseEmail,
            reset_password_token: resetToken,
            reset_password_expiration: new Date(resetTokenExpiration),
            customer: isBiotech
              ? {
                create: {
                  biotech_id: currentUser.customer!.biotech_id,
                },
              }
              : undefined,
            vendor_member: isVendor
              ? {
                create: {
                  vendor_company_id: currentUser.vendor_member!.vendor_company_id,
                },
              }
              : undefined,
          },
          include: {
            customer: true,
            vendor_member: true,
          },
        });
        const emailMessage = args.custom_message || '';
        const resetPasswordUrl = createResetPasswordUrl(resetToken)
        const currentUserFullName = getUserFullName(currentUser)
        const newUserFullName = getUserFullName(newUser)

        // Send email
        if (isBiotech) {
          customerInvitationEmail({
            inviter_full_name: currentUserFullName,
            inviter_message: emailMessage,
            login_url: resetPasswordUrl,
            receiver_full_name: newUserFullName,
          }, newUser.email)
        }
        if (isVendor) {
          vendorMemberInvitationByUserEmail(
            {
              inviter_full_name: currentUserFullName,
              inviter_message: emailMessage,
              login_url: resetPasswordUrl,
              receiver_full_name: newUserFullName
            },
            newUser.email,
          )
        }

        // Update company role and casbin role
        await collaboratorService.updateUserRole({
          role: castedRole,
          user_id: newUser.id,
        }, { prisma: trx })

        return newUser;
      });

      return {
        ...newUser,
        company_collaborator_role: castedRole,
      };
    },
    inviteCollaborators: async (parent, args, context) => {
      const { collaborators } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const allowInviteCompanyCollaborator = await hasPermission(
        currentUserId,
        CasbinObj.COMPANY_COLLABORATOR_USER,
        CasbinAct.WRITE
      );
      invariant(allowInviteCompanyCollaborator, new PermissionDeniedError());

      const addCollaboratorTasks = collaborators.map(async (collaborator) => {
        const lowerCaseEmail = collaborator.email.toLowerCase();
        // Check for existing user
        const existingUser = await context.prisma.user.findFirst({
          where: {
            email: {
              mode: 'insensitive',
              equals: lowerCaseEmail,
            },
          },
        });

        invariant(!existingUser, new PublicError(`User ${existingUser?.email} already exists!`));

        return existingUser;
      });

      await Promise.all(addCollaboratorTasks);

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

      invariant(currentUser, 'Current user not found.');

      const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

      let newUsers;
      if (collaborators && collaborators.length > 0) {
        const collabs = collaborators.map(async (collaborator) => {
          const resetToken = createResetPasswordToken();
          const lowerCaseEmail = collaborator.email.toLowerCase();

          return await context.prisma.$transaction(async (trx) => {
            // Create new user
            const newUser = await trx.user.create({
              data: {
                first_name: collaborator.first_name,
                last_name: collaborator.last_name,
                email: lowerCaseEmail,
                reset_password_token: resetToken,
                reset_password_expiration: new Date(resetTokenExpiration),
              },
            });
            const newUserFullName = getUserFullName(newUser)
            const resetPasswordUrl = createResetPasswordUrl(resetToken)
            const currentUserFullName = getUserFullName(currentUser)

            // If current user is a biotech member, create customer data for the new user.
            if (currentUser.customer?.biotech_id) {
              await trx.customer.create({
                data: {
                  user_id: newUser.id,
                  biotech_id: currentUser.customer.biotech_id,
                },
              });
              customerInvitationEmail(
                {
                  inviter_full_name: currentUserFullName,
                  inviter_message: "",
                  login_url: resetPasswordUrl,
                  receiver_full_name: newUserFullName,
                },
                newUser.email,
              );
            }

            // If current user is a vendor member, create vendor member data for the new user.
            if (currentUser.vendor_member?.vendor_company_id) {
              await trx.vendorMember.create({
                data: {
                  user_id: newUser.id,
                  vendor_company_id: currentUser.vendor_member.vendor_company_id,
                }
              });
              vendorMemberInvitationByUserEmail(
                {
                  inviter_full_name: currentUserFullName,
                  inviter_message: "",
                  login_url: resetPasswordUrl,
                  receiver_full_name: newUserFullName
                },
                newUser.email,
              );
            }

            await addRoleForUser(newUser.id, CasbinRole.USER);

            return newUser;
          });
        });

        newUsers = await Promise.all(collabs);
      }

      return newUsers || [];
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
      invariant(currentUser, 'Current user not found.');

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

      invariant(newUser, 'User not found.');

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
      const updatedUserFullName = getUserFullName(updatedNewUser)
      const resetPasswordUrl = createResetPasswordUrl(resetToken)
      const currentUserFullName = getUserFullName(currentUser)

      if (currentUser?.customer?.biotech_id) {
        customerInvitationEmail(
          {
            inviter_full_name: currentUserFullName,
            inviter_message: "",
            login_url: resetPasswordUrl,
            receiver_full_name: updatedUserFullName,
          },
          updatedNewUser.email,
        );
        return updatedNewUser;
      }
      if (currentUser?.vendor_member?.vendor_company_id) {
        vendorMemberInvitationByUserEmail(
          {
            inviter_full_name: currentUserFullName,
            inviter_message: "",
            login_url: resetPasswordUrl,
            receiver_full_name: updatedUserFullName
          },
          updatedNewUser.email,
        );
        return updatedNewUser;
      }

      throw new InternalError('User not found.');
    },
    cancelInvitation: async (_, args, context) => {
      const { user_id } = args;

      const user = await context.prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });

      // Abort if user already sign up.
      invariant(
        !user?.encrypted_password,
        new PublicError(
          "Unable to cancel. Please contact support for assistance."
        )
      );

      await context.prisma.$transaction(async (trx) => {
        try {
          await collaboratorService.deleteNewUser({ user_id }, { prisma: trx });
        } catch (error) {
          throw new PublicError(
            "Unable to cancel. Please contact support for assistance."
          );
        }
      });

      return user;
    },
    updateCollaboratorRole: async (parent, args, context) => {
      const { role_type, user_id } = args;
      const castedRole = (role_type as CompanyCollaboratorRoleType);
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        }
      });
      invariant(currentUser, 'Current user not found.');

      const user = await context.prisma.user.findFirst({
        where: {
          id: user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });
      invariant(user, 'User not found.');

      invariant(
        currentUser.customer?.biotech_id === user.customer?.biotech_id
        || currentUser.vendor_member?.vendor_company_id === user.vendor_member?.vendor_company_id,
        'The user is not belong to the same company.',
      );

      await collaboratorService.checkPermissionToEditRole({
        role: castedRole,
        user_id: currentUser.id,
      });


      await context.prisma.$transaction(async (trx) => {
        await collaboratorService.updateUserRole({
          user_id,
          role: castedRole,
        }, {
          prisma: trx,
        });
      });

      return {
        ...user,
        company_collaborator_role: role_type,
      }
    },
    deactivateCollaborator: async (_, args, context) => {
      const { user_id } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
        include: {
          vendor_member: true,
          customer: true,
        }
      });
      invariant(currentUser, 'Current user not found.');

      const user = await context.prisma.user.findFirst({
        where: {
          id: user_id,
        },
        include: {
          vendor_member: true,
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true
                },
              },
            },
          },
        },
      });

      invariant(user, new PublicError('User not found.'));

      invariant(
        user.customer?.biotech_id === currentUser.customer?.biotech_id
        || user.vendor_member?.vendor_company_id === currentUser.vendor_member?.vendor_company_id,
        new PermissionDeniedError(),
      );

      const userRole = user.customer?.role || user.vendor_member?.role;

      invariant(userRole !== CompanyCollaboratorRoleType.OWNER, new PermissionDeniedError());

      switch (userRole) {
        case CompanyCollaboratorRoleType.USER: {
          const allowDeactivateUser = await hasPermission(currentUser.id, CasbinObj.COMPANY_COLLABORATOR_USER, CasbinAct.DELETE);
          invariant(allowDeactivateUser, new PermissionDeniedError());
          break;
        }
        case CompanyCollaboratorRoleType.ADMIN: {
          const allowDeactivateUser = await hasPermission(currentUser.id, CasbinObj.COMPANY_COLLABORATOR_ADMIN, CasbinAct.DELETE);
          invariant(allowDeactivateUser, new PermissionDeniedError());
          break;
        }
        default: {
          throw new InternalError('User has invalid role.');
        }
      }

      if (user.deactivated_at !== null) {
        return user;
      }

      const deactivatedUser = await context.prisma.$transaction(async (trx) => {
        const deactivatedUser = await trx.user.update({
          where: {
            id: user.id,
          },
          data: {
            is_active: false,
            deactivated_at: moment().endOf('month').toDate(),
          },
        });

        if (!!user.customer?.biotech) {
          await subscriptionService.decreaseSubscriptionQuantity({
            stripe_sub_id:
              user.customer.biotech.subscriptions[0].stripe_subscription_id,
          });
        }

        return deactivatedUser;
      });

      return deactivatedUser;
    },
    reactivateCollaborator: async (_, args, context) => {
      const { user_id } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: currentUserId,
        },
        include: {
          vendor_member: true,
          customer: true,
        }
      });
      invariant(currentUser, 'Current user not found.');

      const user = await context.prisma.user.findFirst({
        where: {
          id: user_id,
        },
        include: {
          vendor_member: true,
          customer: true,
        }
      });

      invariant(user, new PublicError('User not found.'));

      invariant(
        user.customer?.biotech_id === currentUser.customer?.biotech_id
        || user.vendor_member?.vendor_company_id === currentUser.vendor_member?.vendor_company_id,
        new PermissionDeniedError(),
      );

      const userRole = user.customer?.role || user.vendor_member?.role;

      invariant(userRole !== CompanyCollaboratorRoleType.OWNER, new PermissionDeniedError());

      switch (userRole) {
        case CompanyCollaboratorRoleType.USER: {
          const allowDeactivateUser = await hasPermission(currentUser.id, CasbinObj.COMPANY_COLLABORATOR_USER, CasbinAct.DELETE);
          invariant(allowDeactivateUser, new PermissionDeniedError());
          break;
        }
        case CompanyCollaboratorRoleType.ADMIN: {
          const allowDeactivateUser = await hasPermission(currentUser.id, CasbinObj.COMPANY_COLLABORATOR_ADMIN, CasbinAct.DELETE);
          invariant(allowDeactivateUser, new PermissionDeniedError());
          break;
        }
        default: {
          throw new InternalError('User has invalid role.');
        }
      }

      if (user.deactivated_at && user.deactivated_at <= new Date()) {
        const activatedUser = await context.prisma.$transaction(async (trx) => {
          const activatedUser = await trx.user.update({
            where: {
              id: user.id,
            },
            data: {
              is_active: true,
              deactivated_at: null,
            },
            include: {
              customer: {
                include: {
                  biotech: {
                    include: {
                      subscriptions: true,
                    },
                  },
                },
              }
            }
          });


          if (!!activatedUser.customer?.biotech) {
            await subscriptionService.increaseSubscriptionQuantity({
              stripe_sub_id:
              activatedUser.customer.biotech.subscriptions[0].stripe_subscription_id,
            });
          }

          return activatedUser;
        })

        return activatedUser;
      }

      return user;
    },
    transferBiotechOwnership: async (_, args, context) => {
      await checkAllowCustomerOnlyPermission(context);
      const { user_id, biotech_id } = args;
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
        }
      });

      invariant(currentUser, 'Current user not found.');
      invariant(currentUser.customer?.role === CasbinRole.OWNER, 'Only the owner has the permission to transfer ownership. Current user does not have this permission.');

      const newOwner = await context.prisma.customer.findFirst({
        where: {
          user_id,
        },
      });

      invariant(newOwner, new PublicError('Selected user not found.'));
      invariant(newOwner.biotech_id === biotech_id, new PublicError('The new owner must belong to the same biotech as you.'));
      invariant(currentUser.id !== user_id, new PublicError('The selected user is already the owner.'));

      return await context.prisma.$transaction(async (trx) => {
        await collaboratorService.setCustomerAsUser(
          {
            customer_id: currentUser.customer?.id as string,
          },
          { prisma: trx },
        );

        return await collaboratorService.setCustomerAsOwner(
          {
            customer_id: newOwner.id,
          },
          { prisma: trx },
        );
      });
    },
    transferVendorCompanyOwnership: async (_, args, context) => {
      await checkAllowVendorOnlyPermission(context);
      const { user_id, vendor_company_id } = args;
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          vendor_member: true,
        }
      });

      invariant(currentUser, 'Current user not found.');
      invariant(currentUser.vendor_member?.role === CasbinRole.OWNER, 'Only the owner has the permission to transfer ownership. Current user does not have this permission.');

      const newOwner = await context.prisma.vendorMember.findFirst({
        where: {
          user_id,
        },
      });

      invariant(newOwner, new PublicError('Selected user not found.'));
      invariant(newOwner.vendor_company_id === vendor_company_id, new PublicError('The new owner must belong to the same vendor company as you.'));
      invariant(currentUser.id !== user_id, new PublicError('The selected user is already the owner.'));

      return await context.prisma.$transaction(async (trx) => {
        await collaboratorService.setVendorMemberAsUser(
          {
            vendor_member_id: currentUser.vendor_member?.id as string,
          },
          { prisma: trx },
        );

        return await collaboratorService.setVendorMemberAsOwner(
          {
            vendor_member_id: newOwner.id,
          },
          { prisma: trx },
        );
      });
    },
  },
};

export default resolvers;
