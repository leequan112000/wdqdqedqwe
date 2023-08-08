import { sendVendorMemberInvitationByExistingMemberEmail } from "../../mailer/vendorMember";
import { createResetPasswordToken } from "../../helper/auth";
import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../../generated";
import { sendCustomerInvitationEmail } from "../../mailer/customer";
import { addRoleForUser, hasPermission, updateRoleForUser } from "../../helper/casbin";
import invariant from "../../helper/invariant";
import { CasbinAct, CasbinObj, CasbinRole, CompanyCollaboratorRoleType } from "../../helper/constant";
import { PermissionDeniedError } from "../errors/PermissionDeniedError";
import meetingEventService from "../../services/meetingEvent/meetingEvent.service";
import collaboratorService from "../../services/collaborator/collaborator.service";

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
            ...(active_only ? { is_active: true } : {})
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
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Current user id not found.');
      const allowInviteCompanyCollaborator = await hasPermission(
        currentUserId,
        CasbinObj.COMPANY_COLLABORATOR_USER,
        CasbinAct.WRITE
      );
      invariant(allowInviteCompanyCollaborator, new PermissionDeniedError());

      // Check for existing user
      const existingUser = await context.prisma.user.findFirst({
        where: {
          email: args.email,
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

        await addRoleForUser(newUser.id, CasbinRole.USER);

        return newUser;
      })
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
        // Check for existing user
        const existingUser = await context.prisma.user.findFirst({
          where: {
            email: collaborator.email,
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

          return await context.prisma.$transaction(async (trx) => {
            // Create new user
            const newUser = await trx.user.create({
              data: {
                first_name: collaborator.first_name,
                last_name: collaborator.last_name,
                email: collaborator.email,
                reset_password_token: resetToken,
                reset_password_expiration: new Date(resetTokenExpiration),
              },
            });

            // If current user is a biotech member, create customer data for the new user.
            if (currentUser.customer?.biotech_id) {
              await trx.customer.create({
                data: {
                  user_id: newUser.id,
                  biotech_id: currentUser.customer.biotech_id,
                },
              });
              sendCustomerInvitationEmail(currentUser, newUser, "");
            }

            // If current user is a vendor member, create vendor member data for the new user.
            if (currentUser.vendor_member?.vendor_company_id) {
              await trx.vendorMember.create({
                data: {
                  user_id: newUser.id,
                  vendor_company_id: currentUser.vendor_member.vendor_company_id,
                }
              });
              sendVendorMemberInvitationByExistingMemberEmail(currentUser, newUser, "");
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

      if (currentUser?.customer?.biotech_id) {
        sendCustomerInvitationEmail(currentUser, updatedNewUser);
        return updatedNewUser;
      }
      if (currentUser?.vendor_member?.vendor_company_id) {
        sendVendorMemberInvitationByExistingMemberEmail(currentUser, updatedNewUser);
        return updatedNewUser;
      }

      throw new InternalError('User not found.');
    },
    updateCollaboratorRole: async (parent, args, context) => {
      const { role_type, user_id } = args;
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

      // check for casbin role & permission
      switch (role_type) {
        case CompanyCollaboratorRoleType.ADMIN: {
          const canSetAdminRole = await hasPermission(currentUser.id, CasbinObj.COMPANY_COLLABORATOR_ADMIN, CasbinAct.WRITE);
          invariant(canSetAdminRole, new PermissionDeniedError());

          if (user.customer) {
            const updatedCustomer = await context.prisma.$transaction(async (trx) => {
              return await collaboratorService.setCustomerAsAdmin({
                biotech_id: user.customer!.biotech_id,
                customer_id: user.customer!.id,
                user_id: user.id,
              }, {
                prisma: trx,
              });
            });

            return {
              ...user,
              company_collaborator_role: updatedCustomer.role,
            };
          }

          if (user.vendor_member) {
            const updatedVendorMember = await context.prisma.$transaction(async (trx) => {
              return await collaboratorService.setVendorMemberAsAdmin({
                vendor_company_id: user.vendor_member!.vendor_company_id,
                vendor_member_id: user.vendor_member!.id,
                user_id: user.id,
              }, {
                prisma: trx,
              });
            });

            return {
              ...user,
              company_collaborator_role: updatedVendorMember.role,
            };
          }
          break;
        }
        case CompanyCollaboratorRoleType.USER: {
          const canSetUserRole = await hasPermission(currentUser.id, CasbinObj.COMPANY_COLLABORATOR_USER, CasbinAct.WRITE);
          invariant(canSetUserRole, new PermissionDeniedError());

          if (user.customer) {
            const updatedCustomer = await context.prisma.$transaction(async (trx) => {
              return await collaboratorService.setCustomerAsUser({
                customer_id: user.customer!.id,
              }, {
                prisma: trx,
              });
            });

            return {
              ...user,
              company_collaborator_role: updatedCustomer.role,
            };
          }

          if (user.vendor_member) {
            const updatedVendorMember = await context.prisma.$transaction(async (trx) => {
              return await collaboratorService.setVendorMemberAsUser({
                vendor_member_id: user.vendor_member!.id,
              }, {
                prisma: trx,
              });
            });

            return {
              ...user,
              company_collaborator_role: updatedVendorMember.role,
            };
          }
          break;
        }
        default:
          throw new PublicError('Invalid company collaborator role.');
      }

      throw new InternalError('User is nor customer or vendor member.');
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
          customer: true,
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
          const allowDeactivateUser = await hasPermission(user.id, CasbinObj.COMPANY_COLLABORATOR_USER, CasbinAct.DELETE);
          invariant(allowDeactivateUser, new PermissionDeniedError());
          break;
        }
        case CompanyCollaboratorRoleType.ADMIN: {
          const allowDeactivateUser = await hasPermission(user.id, CasbinObj.COMPANY_COLLABORATOR_ADMIN, CasbinAct.DELETE);
          invariant(allowDeactivateUser, new PermissionDeniedError());
          break;
        }
        default: {
          throw new InternalError('User has invalid role.');
        }
      }

      if (user.is_active !== true) {
        return user;
      }

      const deactivatedUser = await context.prisma.$transaction(async (trx) => {
        const deactivatedUser = await trx.user.update({
          where: {
            id: user.id,
          },
          data: {
            is_active: false,
          },
        });

        await trx.projectRequestCollaborator.deleteMany({
          where: {
            customer: {
              user_id,
            },
          },
        });

        await trx.customerConnection.deleteMany({
          where: {
            customer: {
              user_id,
            },
          },
        });

        await trx.vendorMemberConnection.deleteMany({
          where: {
            vendor_member: {
              user_id,
            },
          },
        });

        // Remove any meeting that organized by the deactivated user.
        const organizedMeetingEvents = await trx.meetingEvent.findMany({
          where: {
            organizer_id: user_id,
          },
        });
        const removeMeetingTasks = organizedMeetingEvents.map(async (event) => {
          return await meetingEventService.removeMeetingEvent({ meeting_event_id: event.id }, { prisma: trx });
        });

        const removedMeetingEvents = await Promise.all(removeMeetingTasks);
        const removedMeetingIds = removedMeetingEvents.map((e) => e.id);

        // Remove deactivated user from meeting events' guest list
        const targetedMeetingEvents = await trx.meetingEvent.findMany({
          where: {
            meetingAttendeeConnections: {
              some: {
                user_id,
              }
            },
            id: {
              notIn: removedMeetingIds,
            },
          },
          include: {
            meetingAttendeeConnections: {
              include: {
                user: true,
              },
            },
          },
        });

        const updateMeetingEventTasks = targetedMeetingEvents.map(async (e) => {
          const emailsWithoutDeactivatedUser = e.meetingAttendeeConnections.reduce<string[]>((acc, cur) => {
            if (cur.user_id !== user_id) {
              acc.unshift(cur.user.email);
            }
            return acc;
          }, [])

          return await meetingEventService.updateMeetingEvent({
            attendee_emails: emailsWithoutDeactivatedUser,
            end_time: e.end_time.toISOString(),
            meeting_event_id: e.id,
            start_time: e.start_time.toISOString(),
            timezone: e.timezone,
            title: e.title,
            description: e.description,
          }, {
            prisma: trx
          });
        });

        await Promise.all(updateMeetingEventTasks);

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
          const allowDeactivateUser = await hasPermission(user.id, CasbinObj.COMPANY_COLLABORATOR_USER, CasbinAct.DELETE);
          invariant(allowDeactivateUser, new PermissionDeniedError());
          break;
        }
        case CompanyCollaboratorRoleType.ADMIN: {
          const allowDeactivateUser = await hasPermission(user.id, CasbinObj.COMPANY_COLLABORATOR_ADMIN, CasbinAct.DELETE);
          invariant(allowDeactivateUser, new PermissionDeniedError());
          break;
        }
        default: {
          throw new InternalError('User has invalid role.');
        }
      }

      if (user.is_active === false) {
        const activatedUser = await context.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            is_active: true,
          },
        });

        return activatedUser;
      }

      return user;
    },
  },
};

export default resolvers;
