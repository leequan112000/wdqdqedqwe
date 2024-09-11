import { parseResolveInfo, type ResolveTree } from 'graphql-parse-resolve-info';
import { Prisma } from '@prisma/client';
import { Context } from '../../types/context';
import {
  Resolvers,
  ProjectRequestComment,
  ProjectRequestProjectConnectionFilter,
} from '../generated';
import { PublicError } from '../errors/PublicError';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { nonNullable } from '../../helper/filter';
import {
  CasbinAct,
  CasbinObj,
  CompanyCollaboratorRoleType,
  AdminTeam,
  ProjectConnectionCollaborationStatus,
  ProjectRequestStatus,
} from '../../helper/constant';
import { filterByCollaborationStatus } from '../../helper/projectConnection';
import invariant from '../../helper/invariant';
import { hasPermission } from '../../helper/casbin';
import {
  bulkNewProjectRequestAdminNoticeEmail,
  sendPrivateProjectRequestSubmissionEmail,
  sendProjectRequestSubmissionEmail,
} from '../../mailer/projectRequest';
import { sendAdminBiotechInviteVendorNoticeEmail } from '../../mailer/admin';
import { getUserFullNameFromPseudonyms } from '../../helper/email';

const resolvers: Resolvers<Context> = {
  ProjectRequest: {
    biotech: async (parent, _, context) => {
      if (!parent.biotech_id) {
        return {};
      }
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id,
        },
      });
    },
    customer: async (parent, _, context) => {
      if (!parent.customer_id) {
        return {};
      }
      return await context.prisma.customer.findFirst({
        where: {
          id: parent.customer_id,
        },
      });
    },
    project_connections: async (projectRequest, args, context) => {
      if (projectRequest.project_connections)
        return projectRequest.project_connections;
      invariant(projectRequest.id, 'Missing project request id.');

      const { filter } = args;

      const projectConnections =
        (await context.prisma.projectRequest
          .findUnique({
            where: {
              id: projectRequest.id,
            },
          })
          .project_connections({
            where: {
              customer_connections: {
                some: {
                  customer: {
                    user_id: context.req.user_id,
                  },
                },
              },
              vendor_status: filter?.vendor_status
                ? {
                    equals: filter.vendor_status,
                  }
                : {},
            },
            orderBy: [
              { final_contract_uploaded_at: { sort: 'desc', nulls: 'last' } },
              { updated_at: 'desc' },
            ],
            include: {
              quotes: {
                include: {
                  milestones: true,
                },
              },
            },
          })) || [];

      if (filter?.collaboration_status) {
        return filterByCollaborationStatus(
          projectConnections,
          filter.collaboration_status as ProjectConnectionCollaborationStatus,
        );
      }

      return projectConnections.map(({ quotes, ...pc }) => pc);
    },
    project_request_comments: async (parent, _, context) => {
      invariant(parent.id, 'Missing project request id.');

      const data = await context.prisma.projectRequestComment.findMany({
        where: {
          project_request_id: parent.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const processed: ProjectRequestComment[] = data.map((d) => ({
        content: d.content,
        created_at: d.created_at.toISOString(),
        id: d.id,
        project_request_id: d.project_request_id,
        updated_at: d.updated_at.toISOString(),
      }));
      return processed;
    },
    project_request_collaborators: async (parent, _, context) => {
      invariant(parent.id, 'Missing id.');
      return await context.prisma.projectRequestCollaborator.findMany({
        where: {
          project_request_id: parent.id,
        },
      });
    },
    is_white_glove: (parent) => {
      return !!parent.sourcing_session_id;
    },
  },
  Query: {
    projectRequests: async (_, args, context, info) => {
      /**
       * Parse resolve info to find any filter args on ProjectRequest.project_connections.
       * If exist, we will do the filter in this resolver in order to prevent
       * problem that fetch project request with ZERO project connections.
       */
      const parsed = parseResolveInfo(info) as ResolveTree;
      const projectConnectionFilter = parsed.fieldsByTypeName.ProjectRequest
        .project_connections?.args?.filter as
        | ProjectRequestProjectConnectionFilter
        | undefined;

      // A flag to skip ProjectRequest.project_connections resolver.
      const willSkipProjectConnectionsResolver =
        !!projectConnectionFilter?.collaboration_status;

      const customer = await context.prisma.customer.findFirstOrThrow({
        where: {
          user_id: context.req.user_id,
        },
      });

      const data = await context.prisma.projectRequest.findMany({
        where: {
          ...(args.status && args.status.length > 0
            ? {
                status: {
                  in: args.status.filter(nonNullable),
                },
              }
            : {}),
          OR: [
            // owner and admin are allow to view all project within the company
            ...(customer.role === CompanyCollaboratorRoleType.OWNER ||
            customer.role === CompanyCollaboratorRoleType.ADMIN
              ? [
                  {
                    biotech_id: customer.biotech_id,
                  },
                ]
              : [{}]),
            // by project connection collaborator
            {
              project_connections: {
                some: {
                  customer_connections: {
                    some: {
                      customer_id: customer.id,
                    },
                  },
                },
              },
            },
            // by project request collaborator
            {
              project_request_collaborators: {
                some: {
                  customer_id: customer.id,
                },
              },
            },
          ],
          ...(projectConnectionFilter
            ? {
                project_connections: {
                  some: {
                    vendor_status: projectConnectionFilter.vendor_status,
                  },
                },
              }
            : {}),
        },
        orderBy: [
          // Sort by status to grouped matched experiments first
          { status: 'asc' },
          { updated_at: 'desc' },
        ],
        include: {
          ...(willSkipProjectConnectionsResolver
            ? {
                project_connections: {
                  where: {
                    customer_connections: {
                      some: {
                        customer: {
                          user_id: context.req.user_id,
                        },
                      },
                    },
                    vendor_status: projectConnectionFilter?.vendor_status
                      ? {
                          equals: projectConnectionFilter.vendor_status,
                        }
                      : {},
                  },
                  orderBy: [
                    {
                      final_contract_uploaded_at: {
                        sort: 'desc',
                        nulls: 'last',
                      },
                    },
                    { updated_at: 'desc' },
                  ],
                  include: {
                    quotes: {
                      include: {
                        milestones: true,
                      },
                    },
                  },
                },
              }
            : {}),
        },
      });

      if (willSkipProjectConnectionsResolver) {
        return (
          data
            .map((pr) => ({
              ...pr,
              project_connections: filterByCollaborationStatus(
                // @ts-ignore
                pr.project_connections,
                projectConnectionFilter.collaboration_status as ProjectConnectionCollaborationStatus,
              ),
            }))
            // Filter out project request with ZERO project connection.
            .filter((pr) => pr.project_connections.length > 0)
            // Convert decimal to number.
            .map((pr) => ({
              ...pr,
              max_budget: pr.max_budget?.toNumber() || 0,
              project_connections: pr.project_connections.map((pc) => ({
                ...pc,
                quotes: pc.quotes.map((q) => ({
                  ...q,
                  amount: q.amount.toNumber(),
                  milestones: q.milestones.map((m) => ({
                    ...m,
                    amount: m.amount.toNumber(),
                  })),
                })),
              })),
            }))
        );
      }

      return data.map((d) => ({
        ...d,
        max_budget: d.max_budget?.toNumber() || 0,
      }));
    },
    projectRequest: async (_, args, context) => {
      const vendor = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      try {
        const projectRequest = await context.prisma.projectRequest.findFirst({
          where: {
            id: args.id!,
          },
        });

        invariant(projectRequest, new PermissionDeniedError());

        if (vendor) {
          // Check if vendor is in the project connection
          const projectConnection =
            await context.prisma.projectConnection.findFirst({
              where: {
                project_request_id: projectRequest.id,
                vendor_member_connections: {
                  some: {
                    vendor_member_id: vendor.id,
                  },
                },
              },
            });
          invariant(projectConnection, new PermissionDeniedError());
        } else {
          // Check if customer is the project request owner / admin / collaborator
          const customer = await context.prisma.customer.findFirst({
            where: {
              user_id: context.req.user_id,
            },
          });
          invariant(customer, new PermissionDeniedError());

          if (customer.role === CompanyCollaboratorRoleType.USER) {
            const projectConnection =
              await context.prisma.projectConnection.findFirst({
                where: {
                  project_request_id: projectRequest.id,
                  customer_connections: {
                    some: {
                      customer_id: customer.id,
                    },
                  },
                },
              });

            const projectRequestCollaborator =
              await context.prisma.projectRequestCollaborator.findFirst({
                where: {
                  project_request_id: projectRequest.id,
                  customer_id: customer.id,
                },
              });
            invariant(
              projectConnection || projectRequestCollaborator,
              new PermissionDeniedError(),
            );
          }
        }

        return {
          ...projectRequest,
          max_budget: projectRequest.max_budget?.toNumber() || 0,
        };
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2023'
        ) {
          throw new PermissionDeniedError();
        }
        throw error;
      }
    },
  },
  Mutation: {
    createProjectRequest: async (_, args, context) => {
      const { project_request_collaborators, ...project_request_args } = args;
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Missing current user id.');
      const allowCreateProjectRequest = await hasPermission(
        currentUserId,
        CasbinObj.PROJECT_REQUEST,
        CasbinAct.WRITE,
      );
      invariant(allowCreateProjectRequest, new PermissionDeniedError());
      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirstOrThrow({
          where: {
            id: currentUserId,
          },
          include: {
            pseudonyms: true,
            customer: {
              include: {
                biotech: true,
              },
            },
          },
        });

        invariant(user.customer, 'User is not a customer.');
        const projectRequest = await trx.projectRequest.create({
          data: {
            status: ProjectRequestStatus.PROCESSING,
            customer_id: user.customer.id,
            biotech_id: user.customer.biotech_id,
            title: args.title,
            vendor_requirement: args.vendor_requirement,
            objective_description: args.objective_description,
            preparation_description: args.preparation_description,
            in_contact_with_vendor: args.in_contact_with_vendor,
            existing_vendor_contact_description:
              args.existing_vendor_contact_description,
            project_challenge_description: args.project_challenge_description,
            vendor_search_timeframe: args.vendor_search_timeframe,
            max_budget: args.max_budget,
            vendor_location_requirement: args.vendor_location_requirement,
            project_start_time_requirement: args.project_start_time_requirement,
            project_deadline_requirement: args.project_deadline_requirement,
            is_private: args.is_private,
          },
        });

        if (
          project_request_collaborators &&
          project_request_collaborators.length > 0
        ) {
          await trx.projectRequestCollaborator.createMany({
            data: project_request_collaborators.map((customerId) => {
              return {
                customer_id: customerId as string,
                project_request_id: projectRequest.id,
              };
            }),
          });
        }

        /**
         * If PUBLIC request:
         * - send public request submission confirmation email to the request creator
         * - notify admin public request
         */
        if (!projectRequest.is_private) {
          const receivers = await context.prisma.admin.findMany({
            where: {
              team: AdminTeam.SCIENCE,
            },
          });
          const emailData = receivers.map((r) => ({
            emailData: {
              admin_name: r.username,
              biotech_name: user.customer?.biotech.name,
              retool_url: process.env.RETOOL_PROJECT_URL,
            },
            receiverEmail: r.email,
          }));
          sendProjectRequestSubmissionEmail(user);
          bulkNewProjectRequestAdminNoticeEmail(emailData);
        }

        /**
         * If PRIVATE request:
         * - send private request submission confirmation email to the request creator
         * - create biotech invite vendor record
         * - notify admin biotech invite vendor
         */
        if (projectRequest.is_private) {
          invariant(args.company_name, 'Company name is required.');
          invariant(args.website, 'Website is required.');
          invariant(args.email, 'Email is required.');
          invariant(args.first_name, 'First name is required.');
          invariant(args.last_name, 'Last name is required.');
          const lowerCaseEmail = args.email.toLowerCase();
          const admins = await context.prisma.admin.findMany({
            where: {
              team: AdminTeam.SCIENCE,
            },
          });

          await trx.biotechInviteVendor.create({
            data: {
              biotech_id: user.customer.biotech_id,
              project_request_id: projectRequest.id,
              company_name: args.company_name,
              website: args.website,
              email: lowerCaseEmail,
              first_name: args.first_name,
              last_name: args.last_name,
              inviter_id: user.id,
            },
          });
          sendPrivateProjectRequestSubmissionEmail(user);

          // Send email to admin
          const biotechInfo = await trx.biotech.findFirst({
            where: {
              id: user.customer.biotech_id,
            },
          });
          invariant(biotechInfo, 'Biotech not found.');
          const data = {
            biotech_name: biotechInfo.name,
            inviter_full_name: getUserFullNameFromPseudonyms(user.pseudonyms!),
            vendor_company_name: args.company_name,
            website: args.website,
            first_name: args.first_name,
            last_name: args.last_name,
            email: lowerCaseEmail,
            project_request_name: projectRequest.title,
          };
          await Promise.all(
            admins.map(async (admin) => {
              sendAdminBiotechInviteVendorNoticeEmail(admin, data);
            }),
          );
        }

        return {
          ...projectRequest,
          max_budget: projectRequest.max_budget?.toNumber() || 0,
        };
      });
    },
    withdrawProjectRequest: async (_, args, context) => {
      const currentUserId = context.req.user_id;
      invariant(currentUserId, 'Missing current user id.');
      const allowWithdrawProjectRequest = await hasPermission(
        currentUserId,
        CasbinObj.PROJECT_REQUEST,
        CasbinAct.WRITE,
      );
      invariant(allowWithdrawProjectRequest, new PermissionDeniedError());
      const user = await context.prisma.user.findFirstOrThrow({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            include: {
              biotech: true,
            },
          },
        },
      });

      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: args.project_request_id,
        },
      });
      invariant(projectRequest, new PublicError('Project request not found.'));

      invariant(
        projectRequest.biotech_id === user.customer?.biotech_id,
        new PermissionDeniedError(),
      );

      const updatedRequest = await context.prisma.projectRequest.update({
        data: {
          status: ProjectRequestStatus.WITHDRAWN,
        },
        where: {
          id: args.project_request_id,
        },
      });

      return {
        ...updatedRequest,
        max_budget: updatedRequest.max_budget?.toNumber() || 0,
      };
    },
    setProjectRequestPublic: async (_, args, context) => {
      const user = await context.prisma.user.findFirstOrThrow({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: {
            include: {
              biotech: true,
            },
          },
        },
      });

      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: args.project_request_id,
        },
      });
      invariant(projectRequest, new PublicError('Project request not found.'));

      invariant(
        projectRequest.biotech_id === user.customer?.biotech_id,
        new PermissionDeniedError(),
      );

      const updatedRequest = await context.prisma.projectRequest.update({
        data: {
          is_private: false,
        },
        where: {
          id: args.project_request_id,
        },
      });
      const receivers = await context.prisma.admin.findMany({
        where: {
          team: AdminTeam.SCIENCE,
        },
      });
      const emailData = receivers.map((r) => ({
        emailData: {
          admin_name: r.username,
          biotech_name: user.customer?.biotech.name,
          retool_url: process.env.RETOOL_PROJECT_URL,
        },
        receiverEmail: r.email,
      }));
      bulkNewProjectRequestAdminNoticeEmail(emailData);

      return {
        ...updatedRequest,
        max_budget: updatedRequest.max_budget?.toNumber() || 0,
      };
    },
  },
};

export default resolvers;
