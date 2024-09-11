import moment from 'moment';
import { Context } from '../../types/context';
import {
  CasbinRole,
  CompanyCollaboratorRoleType,
  InvitedByType,
  ProjectConnectionVendorStatus,
  ProjectRequestStatus,
} from '../../helper/constant';
import { Resolvers } from '../generated';
import { PublicError } from '../../graphql/errors/PublicError';
import invariant from '../../helper/invariant';
import { createResetPasswordToken } from '../../helper/auth';
import {
  vendorMemberInvitationByBiotechEmail,
  vendorMemberProjectRequestInvitationByAdminEmail,
} from '../../mailer/vendorMember';
import { app_env } from '../../environment';
import { addRoleForUser } from '../../helper/casbin';
import {
  createResetPasswordUrl,
  getEmailFromPseudonyms,
  getUserFullName,
  getUserFullNameFromPseudonyms,
} from '../../helper/email';
import createAdminInviteNotificationJob from '../../notification/adminInviteNotification';
import { createNotificationQueueJob } from '../../queues/notification.queues';
import { encrypt } from '../../helper/gdprHelper';

const PROJECT_REQUEST_RESPONSE_PERIOD = 14; // in day

const resolvers: Resolvers<Context> = {
  Mutation: {
    createVendorCompany: async (_, args, context) => {
      return await context.prisma.vendorCompany.create({
        data: {
          name: args.name,
          website: args.website,
          description: args.description,
          address: args.address,
          vendor_type: args.vendor_type,
          skip_cda: true, // deprecated
          is_on_marketplace: true,
          invited_by: InvitedByType.ADMIN,
        },
      });
    },
    inviteVendorCompaniesToProjectByAdmin: async (_, args, context) => {
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: args.project_request_id,
        },
      });

      invariant(projectRequest, new PublicError('Invalid project request ID.'));
      invariant(
        projectRequest.status !== ProjectRequestStatus.WITHDRAWN,
        new PublicError('Project request has already been withdrawn.'),
      );

      const newExpiryDate = moment()
        .add(PROJECT_REQUEST_RESPONSE_PERIOD, 'd')
        .endOf('d');

      await Promise.all(
        args.vendor_company_ids.map(async (vendor_company_id) => {
          // trycatch to prevent single error breaking all the promises
          try {
            await context.prisma.$transaction(async (trx) => {
              // Check existing project connection
              const existingProjectConnection =
                await trx.projectConnection.findFirst({
                  where: {
                    project_request_id: projectRequest.id,
                    vendor_company_id: vendor_company_id!,
                  },
                });

              invariant(
                !existingProjectConnection,
                new PublicError('Project connection exists'),
              );
              const primaryVendorMembers = await trx.vendorMember.findMany({
                where: {
                  vendor_company_id: vendor_company_id as string,
                  role: {
                    in: [
                      CompanyCollaboratorRoleType.OWNER,
                      CompanyCollaboratorRoleType.ADMIN,
                    ],
                  },
                },
                include: {
                  user: {
                    include: {
                      pseudonyms: true,
                    },
                  },
                },
              });

              invariant(
                primaryVendorMembers,
                new PublicError('No primary vendor member found.'),
              );

              const projectConnection = await trx.projectConnection.create({
                data: {
                  project_request_id: args.project_request_id,
                  vendor_company_id: vendor_company_id as string,
                  vendor_status: ProjectConnectionVendorStatus.PENDING,
                  expired_at: newExpiryDate.toDate(),
                },
              });

              // Include owner, admin and request collaborators to customer connections
              const biotechOwnerAndAdmins = await trx.customer.findMany({
                where: {
                  biotech_id: projectRequest.biotech_id,
                  role: {
                    in: [
                      CompanyCollaboratorRoleType.OWNER,
                      CompanyCollaboratorRoleType.ADMIN,
                    ],
                  },
                  user: {
                    OR: [
                      { deactivated_at: null },
                      {
                        deactivated_at: {
                          gt: new Date(),
                        },
                      },
                    ],
                  },
                },
              });

              const projectRequestCollaborators =
                await trx.projectRequestCollaborator.findMany({
                  where: { project_request_id: projectRequest.id },
                });

              await trx.customerConnection.createMany({
                data: [
                  ...biotechOwnerAndAdmins.map((c) => ({
                    project_connection_id: projectConnection.id,
                    customer_id: c.id,
                  })),
                  ...projectRequestCollaborators.map((c) => ({
                    project_connection_id: projectConnection.id,
                    customer_id: c.customer_id,
                  })),
                ],
              });

              if (!projectRequest.initial_assigned_at) {
                await trx.projectRequest.update({
                  where: {
                    id: args.project_request_id,
                  },
                  data: {
                    initial_assigned_at: projectConnection.created_at,
                  },
                });
              }
              await Promise.all(
                primaryVendorMembers.map(async (primaryVendorMember) => {
                  await trx.vendorMemberConnection.create({
                    data: {
                      project_connection_id: projectConnection.id,
                      vendor_member_id: primaryVendorMember.id,
                    },
                  });

                  // Send email and notification
                  const primaryVendorMemberFullName =
                    getUserFullNameFromPseudonyms(
                      primaryVendorMember.user.pseudonyms!,
                    );
                  vendorMemberProjectRequestInvitationByAdminEmail(
                    {
                      login_url: `${app_env.APP_URL}/app/project-connection/${projectConnection.id}/project-request`,
                      project_request_title: projectRequest.title,
                      receiver_full_name: primaryVendorMemberFullName,
                    },
                    getEmailFromPseudonyms(
                      primaryVendorMember.user.pseudonyms!,
                    ),
                  );
                  const notificationJob = createAdminInviteNotificationJob({
                    project_connection_id: projectConnection.id,
                    project_title: projectRequest.title,
                    recipient_id: primaryVendorMember.user_id,
                  });
                  createNotificationQueueJob({ data: [notificationJob] });
                }),
              );
            });
          } catch (error) {
            // no-op
          }
        }),
      );

      return true;
    },
    inviteVendorCompanyToProjectByBiotech: async (_, args, context) => {
      if (process.env.ENABLE_BIOTECH_INVITE_CRO === 'true') {
        const { biotech_invite_vendor_id, vendor_type } = args;
        invariant(
          biotech_invite_vendor_id,
          'Biotech invite vendor ID is required.',
        );
        invariant(vendor_type, 'Vendor type is required.');

        const newExpiryDate = moment()
          .add(PROJECT_REQUEST_RESPONSE_PERIOD, 'd')
          .endOf('d');

        const biotechInviteVendor =
          await context.prisma.biotechInviteVendor.findFirst({
            where: {
              id: biotech_invite_vendor_id,
            },
            include: {
              biotech: true,
              inviter: {
                include: {
                  pseudonyms: true,
                },
              },
              project_request: true,
            },
          });

        invariant(
          biotechInviteVendor,
          new PublicError('Biotech invite vendor record not found.'),
        );
        const biotech = biotechInviteVendor.biotech;
        const inviter = biotechInviteVendor.inviter;
        const projectRequest = biotechInviteVendor.project_request;
        invariant(biotech, new PublicError('Biotech not found.'));
        invariant(inviter, new PublicError('Inviter not found.'));
        invariant(
          projectRequest,
          new PublicError('Project request not found.'),
        );

        const biotechCustomer = await context.prisma.customer.findFirst({
          where: {
            biotech_id: biotechInviteVendor.biotech_id as string,
            user_id: biotechInviteVendor.inviter_id as string,
          },
        });
        invariant(
          biotechCustomer,
          new PublicError('Biotech customer not found.'),
        );

        // Check if vendor company already exists
        const existingVendorCompany =
          await context.prisma.vendorCompany.findFirst({
            where: {
              name: biotechInviteVendor.company_name,
            },
          });

        // Check if user already exists
        const existingUser = await context.prisma.user.findFirst({
          where: {
            pseudonyms: {
              email: encrypt(biotechInviteVendor.email),
            },
          },
          include: {
            pseudonyms: true,
          },
        });

        const existingVendorMember =
          await context.prisma.vendorMember.findFirst({
            where: {
              user_id: existingUser?.id,
              vendor_company_id: existingVendorCompany?.id,
            },
          });

        const inviterFullName = getUserFullNameFromPseudonyms(
          inviter.pseudonyms!,
        );

        // Check if the vendor company with the same user already exists
        // If vendor copmany is not in marketplace, assign request to this vendor company
        if (
          existingVendorCompany &&
          existingUser &&
          existingVendorMember?.vendor_company_id ===
            existingVendorCompany.id &&
          !existingVendorCompany.is_on_marketplace &&
          existingVendorCompany.invited_by !== InvitedByType.ADMIN
        ) {
          invariant(
            existingVendorMember,
            new PublicError('Vendor member not exists.'),
          );

          const existingProjectConnection =
            await context.prisma.projectConnection.findFirst({
              where: {
                project_request_id:
                  biotechInviteVendor.project_request_id as string,
                vendor_company_id: existingVendorCompany.id,
              },
            });
          invariant(
            !existingProjectConnection,
            new PublicError('Project connection exists.'),
          );

          const projectConnection =
            await context.prisma.projectConnection.create({
              data: {
                project_request_id:
                  biotechInviteVendor.project_request_id as string,
                vendor_company_id: existingVendorCompany.id,
                vendor_status: ProjectConnectionVendorStatus.PENDING,
                expired_at: newExpiryDate.toDate(),
                biotech_invite_vendor_id: biotechInviteVendor.id,
              },
            });
          await context.prisma.customerConnection.create({
            data: {
              project_connection_id: projectConnection.id,
              customer_id: biotechCustomer.id,
            },
          });
          await context.prisma.vendorMemberConnection.create({
            data: {
              project_connection_id: projectConnection.id,
              vendor_member_id: existingVendorMember.id,
            },
          });

          // Send email to existing vendor member by biotech
          const viewProjectConnectionUrl = `${app_env.APP_URL}/app/project-connection/${projectConnection.id}/project-request`;
          const existingUserFullName = getUserFullNameFromPseudonyms(
            existingUser.pseudonyms!,
          );
          vendorMemberInvitationByBiotechEmail(
            {
              biotech_name: biotech.name,
              inviter_full_name: inviterFullName,
              login_url: viewProjectConnectionUrl,
              project_request_name: projectRequest.title,
              receiver_full_name: existingUserFullName,
            },
            getEmailFromPseudonyms(existingUser.pseudonyms!),
          );
          invariant(!existingUser, new PublicError('User already exists.'));

          return true;
          // Check if the vendor company with the same user already exists
          // If vendor copmany is in marketplace, assign request to this vendor company
        } else if (
          existingVendorCompany &&
          existingUser &&
          existingVendorMember?.vendor_company_id ===
            existingVendorCompany.id &&
          existingVendorCompany.is_on_marketplace &&
          existingVendorCompany.invited_by === InvitedByType.ADMIN
        ) {
          invariant(
            existingVendorMember,
            new PublicError('Vendor member not exists.'),
          );

          const existingProjectConnection =
            await context.prisma.projectConnection.findFirst({
              where: {
                project_request_id:
                  biotechInviteVendor.project_request_id as string,
                vendor_company_id: existingVendorCompany.id,
              },
            });
          invariant(
            !existingProjectConnection,
            new PublicError('Project connection exists.'),
          );

          const primaryVendorMembers =
            await context.prisma.vendorMember.findMany({
              where: {
                vendor_company_id: existingVendorCompany.id,
                role: {
                  in: [
                    CompanyCollaboratorRoleType.OWNER,
                    CompanyCollaboratorRoleType.ADMIN,
                  ],
                },
              },
              include: {
                user: true,
              },
            });
          invariant(
            primaryVendorMembers,
            new PublicError('No primary vendor member found.'),
          );

          const projectConnection =
            await context.prisma.projectConnection.create({
              data: {
                project_request_id:
                  biotechInviteVendor.project_request_id as string,
                vendor_company_id: existingVendorCompany.id,
                vendor_status: ProjectConnectionVendorStatus.PENDING,
                expired_at: newExpiryDate.toDate(),
                biotech_invite_vendor_id: biotechInviteVendor.id,
              },
            });
          await context.prisma.customerConnection.create({
            data: {
              project_connection_id: projectConnection.id,
              customer_id: biotechCustomer.id,
            },
          });
          await Promise.all(
            primaryVendorMembers.map(async (pvm) => {
              await context.prisma.vendorMemberConnection.create({
                data: {
                  project_connection_id: projectConnection.id,
                  vendor_member_id: pvm.id,
                },
              });
            }),
          );

          // Send email to existing vendor member by biotech
          const viewProjectConnectionUrl = `${app_env.APP_URL}/app/project-connection/${projectConnection.id}/project-request`;
          const existingUserFullName = getUserFullNameFromPseudonyms(
            existingUser.pseudonyms!,
          );
          vendorMemberInvitationByBiotechEmail(
            {
              biotech_name: biotech.name,
              inviter_full_name: inviterFullName,
              login_url: viewProjectConnectionUrl,
              project_request_name: projectRequest.title,
              receiver_full_name: existingUserFullName,
            },
            getEmailFromPseudonyms(existingUser.pseudonyms!),
          );
          invariant(!existingUser, new PublicError('User already exists.'));

          return true;
        } else {
          invariant(
            !existingVendorCompany,
            new PublicError('Vendor company already exists.'),
          );

          const newVendorCompany = await context.prisma.vendorCompany.create({
            data: {
              name: biotechInviteVendor.company_name,
              website: biotechInviteVendor.website,
              vendor_type: vendor_type,
              skip_cda: true,
              is_on_marketplace: false,
              invited_by: biotechInviteVendor.biotech_id,
            },
          });

          const resetTokenExpiration =
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
          const resetToken = createResetPasswordToken();

          const newUser = await context.prisma.user.create({
            data: {
              reset_password_token: resetToken,
              reset_password_expiration: new Date(resetTokenExpiration),
              pseudonyms: {
                create: {
                  email: encrypt(biotechInviteVendor.email),
                  first_name: encrypt(biotechInviteVendor.first_name),
                  last_name: encrypt(biotechInviteVendor.last_name),
                },
              },
            },
            include: {
              pseudonyms: true,
            },
          });

          const newVendorMember = await context.prisma.vendorMember.create({
            data: {
              user_id: newUser.id,
              vendor_company_id: newVendorCompany.id,
              role: CompanyCollaboratorRoleType.OWNER,
            },
          });

          await addRoleForUser(newUser.id, CasbinRole.OWNER);

          const projectConnection =
            await context.prisma.projectConnection.create({
              data: {
                project_request_id:
                  biotechInviteVendor.project_request_id as string,
                vendor_company_id: newVendorCompany.id,
                vendor_status: ProjectConnectionVendorStatus.PENDING,
                expired_at: newExpiryDate.toDate(),
                biotech_invite_vendor_id: biotechInviteVendor.id,
              },
            });
          await context.prisma.customerConnection.create({
            data: {
              project_connection_id: projectConnection.id,
              customer_id: biotechCustomer.id,
            },
          });
          await context.prisma.vendorMemberConnection.create({
            data: {
              project_connection_id: projectConnection.id,
              vendor_member_id: newVendorMember.id,
            },
          });

          // Send email to new vendor member by biotech
          const resetPasswordUrl = createResetPasswordUrl(resetToken);
          const newUserFullName = getUserFullNameFromPseudonyms(
            newUser.pseudonyms!,
          );
          vendorMemberInvitationByBiotechEmail(
            {
              biotech_name: biotech.name,
              inviter_full_name: inviterFullName,
              login_url: resetPasswordUrl,
              project_request_name: projectRequest.title,
              receiver_full_name: newUserFullName,
            },
            getEmailFromPseudonyms(newUser.pseudonyms!),
          );

          return true;
        }
      }

      return null;
    },
    createSourcererVendorProfileForOldVendor: async (_, args, context) => {
      const { vendor_company_id } = args;

      const vendorCompany = await context.prisma.vendorCompany.findUnique({
        where: {
          id: vendor_company_id,
        },
        include: {
          vendor_members: {
            where: {
              role: {
                equals: CompanyCollaboratorRoleType.OWNER,
              },
            },
            orderBy: {
              created_at: 'desc',
            },
            include: {
              user: {
                include: {
                  pseudonyms: true,
                },
              },
            },
          },
        },
      });

      invariant(
        vendorCompany?.vendor_members?.[0]?.user,
        new PublicError('Missing owner user record.'),
      );

      const ownerVendorMember = vendorCompany.vendor_members[0];
      const ownerUser = ownerVendorMember.user;

      await context.prisma.vendor.create({
        data: {
          user: {
            connect: {
              id: ownerUser.id,
            },
          },
          company_name: vendorCompany.name,
          company_description: vendorCompany.description,
          company_size: vendorCompany.team_size,
          website: vendorCompany.website,
          user_company_role: ownerVendorMember.title,
          department: ownerVendorMember.department,
          email: getEmailFromPseudonyms(ownerUser.pseudonyms!),
        },
      });

      return true;
    },
  },
};

export default resolvers;
