import { Prisma } from '@prisma/client';
import { Resolvers } from '../generated';
import { Context } from '../../types/context';
import { InternalError } from '../errors/InternalError';
import collaboratorService from '../../services/collaborator/collaborator.service';
import { checkProjectConnectionPermission } from '../../helper/accessControl';
import {
  ProjectAttachmentDocumentType,
  ProjectConnectionVendorStatus,
  ProjectRequestStatus,
  PROJECT_ATTACHMENT_DOCUMENT_TYPE,
  QuoteStatus,
  ProjectConnectionCollaborationStatus,
  ProjectConnectionVendorExperimentStatus,
  NotificationType,
  ProjectConnectionVendorDisplayStatus,
} from '../../helper/constant';
import { toDollar } from '../../helper/money';
import { filterByCollaborationStatus } from '../../helper/projectConnection';
import invariant from '../../helper/invariant';
import { projectConnectionService } from '../../services/projectConnection/projectConnection.service';

const resolvers: Resolvers<Context> = {
  ProjectConnection: {
    vendor_company: async (parentProjectConnection, _, context) => {
      invariant(
        parentProjectConnection.vendor_company_id,
        'Vendor company id not found.',
      );
      const vendorCompany = await context.prisma.vendorCompany.findUnique({
        where: {
          id: parentProjectConnection.vendor_company_id,
        },
      });
      invariant(vendorCompany, 'Vendor company not found.');
      return vendorCompany;
    },
    project_request: async (parent, _, context) => {
      invariant(parent.project_request_id, 'Project request id not found.');
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: parent.project_request_id,
        },
      });
      invariant(projectRequest, 'Project request not found.');
      return {
        ...projectRequest,
        max_budget: projectRequest.max_budget?.toNumber() || 0,
      };
    },
    vendor_member_connections: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const vendorMemberConnections =
        await context.prisma.vendorMemberConnection.findMany({
          where: {
            project_connection_id: parent.id,
          },
        });

      return vendorMemberConnections;
    },
    customer_connections: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      return await context.prisma.customerConnection.findMany({
        where: {
          project_connection_id: parent.id,
        },
      });
    },
    project_attachments: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const projectAttachments =
        await context.prisma.projectAttachment.findMany({
          where: {
            project_connection_id: parent.id,
          },
        });

      return projectAttachments.map((a) => ({
        ...a,
        byte_size: Number(a.byte_size),
        document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[a.document_type],
      }));
    },
    quotes: async (projectConnection, _, context) => {
      if (projectConnection.quotes) return projectConnection.quotes;

      invariant(projectConnection.id, 'Project connection id not found.');
      const currentUserId = context.req.user_id;

      const currentUser = await context.prisma.user.findUnique({
        where: {
          id: currentUserId,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      invariant(currentUser, 'Current user not found.');

      const filter: Prisma.QuoteWhereInput = {};

      if (currentUser.customer) {
        filter.status = {
          not: QuoteStatus.DRAFT,
        };
      }

      const quotes =
        (await context.prisma.projectConnection
          .findUnique({
            where: {
              id: projectConnection.id,
            },
          })
          .quotes({
            where: filter,
            orderBy: {
              created_at: 'asc',
            },
          })) || [];

      return quotes.map((quote) => {
        return {
          ...quote,
          amount: toDollar(quote.amount.toNumber()),
        };
      });
    },
    chat: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      return await context.prisma.chat.findFirst({
        where: {
          project_connection_id: parent.id,
        },
      });
    },
    messages: async (parent, args, context) => {
      invariant(parent.id, 'Project connection id not found.');
      invariant(context.req.user_id, 'Current user not found.');

      const messages = await context.prisma.message.findMany({
        where: {
          chat: {
            project_connection_id: parent.id,
          },
        },
      });

      return messages || [];
    },
    documents: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const projectAttachments =
        await context.prisma.projectAttachment.findMany({
          where: {
            project_connection_id: parent.id,
            document_type: ProjectAttachmentDocumentType.FILE,
          },
        });
      return projectAttachments.map((a) => ({
        ...a,
        byte_size: Number(a.byte_size),
        document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[a.document_type],
      }));
    },
    final_contract: async (parent, _, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const projectAttachment =
        await context.prisma.projectAttachment.findFirst({
          where: {
            project_connection_id: parent.id,
            document_type: ProjectAttachmentDocumentType.REDLINE_FILE,
          },
        });
      return projectAttachment
        ? {
            ...projectAttachment,
            byte_size: Number(projectAttachment.byte_size),
            document_type:
              PROJECT_ATTACHMENT_DOCUMENT_TYPE[projectAttachment.document_type],
          }
        : null;
    },
    collaborators_not_invited: async (parent, args, context) => {
      invariant(parent.id, 'Project connection id not found.');
      invariant(parent.project_request_id, 'Project request id not found.');

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      invariant(currentUser, 'Current user not found.');

      if (currentUser.customer) {
        const customers = await context.prisma.customer.findMany({
          where: {
            customer_connections: {
              none: {
                project_connection_id: parent.id,
              },
            },
            biotech_id: currentUser.customer.biotech_id,
          },
          include: {
            user: true,
          },
        });

        return customers.map((c) => c.user);
      }

      if (currentUser.vendor_member) {
        const vendorMembers = await context.prisma.vendorMember.findMany({
          where: {
            vendor_member_connections: {
              none: {
                project_connection_id: parent.id,
              },
            },
            vendor_company_id: currentUser.vendor_member.vendor_company_id,
          },
          include: {
            user: true,
          },
        });
        return vendorMembers.map((v) => v.user);
      }

      throw new InternalError('User is not customer nor vendor member');
    },
    internal_collaborators: async (parent, args, context) => {
      invariant(parent.id, 'Project connection id not found.');

      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      invariant(currentUser, 'Current user not found.');

      let users;

      if (currentUser?.customer) {
        const customerConnections =
          await context.prisma.customerConnection.findMany({
            where: {
              project_connection_id: parent.id,
            },
            include: {
              customer: {
                include: {
                  user: true,
                },
              },
            },
          });
        users = customerConnections.map((cc) => cc.customer.user);
      }

      if (currentUser?.vendor_member) {
        const vendorConnections =
          await context.prisma.vendorMemberConnection.findMany({
            where: {
              project_connection_id: parent.id,
            },
            include: {
              vendor_member: {
                include: {
                  user: true,
                },
              },
            },
          });
        users = vendorConnections.map((vs) => vs.vendor_member.user);
      }

      invariant(users, 'Current user is not customer nor vendor member');

      return users;
    },
    external_collaborators: async (parent, args, context) => {
      invariant(parent.id, 'Project connection id not found.');
      const currentUser = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });

      invariant(currentUser, 'Current user not found.');

      if (currentUser?.customer) {
        const vendorConnections =
          await context.prisma.vendorMemberConnection.findMany({
            where: {
              project_connection_id: parent.id,
              vendor_member: {
                title: {
                  not: null,
                },
              },
            },
            include: {
              vendor_member: {
                include: {
                  user: true,
                },
              },
            },
          });
        return vendorConnections.map((vs) => vs.vendor_member.user);
      }

      if (currentUser?.vendor_member) {
        const customerConnections =
          await context.prisma.customerConnection.findMany({
            where: {
              project_connection_id: parent.id,
              customer: {
                has_setup_profile: true,
                job_title: {
                  not: null,
                },
              },
            },
            include: {
              customer: {
                include: {
                  user: true,
                },
              },
            },
          });
        return customerConnections.map((cc) => cc.customer.user);
      }

      throw new InternalError('Current user is not customer nor vendor member');
    },
    vendor_display_status: async (parent, args, context) => {
      const {
        vendor_status,
        project_request: parentProjectRequest,
        project_request_id,
      } = parent;
      const now = new Date();

      invariant(parent.id, 'Project connection id not found.');

      if (parent.vendor_display_status) {
        return parent.vendor_display_status;
      }

      invariant(project_request_id, 'Project request id not found.');
      const projectRequest =
        parentProjectRequest ||
        (await context.prisma.projectRequest.findFirst({
          where: {
            id: project_request_id,
          },
        }));

      invariant(projectRequest, 'Project request not found.');

      if (projectRequest.status === ProjectRequestStatus.WITHDRAWN) {
        return ProjectConnectionVendorDisplayStatus.WITHDRAWN;
      }

      if (vendor_status === ProjectConnectionVendorStatus.DECLINED) {
        return ProjectConnectionVendorDisplayStatus.DECLINED;
      }

      if (vendor_status === ProjectConnectionVendorStatus.PENDING) {
        if (parent.expired_at && now >= parent.expired_at) {
          return ProjectConnectionVendorDisplayStatus.EXPIRED;
        }

        return ProjectConnectionVendorDisplayStatus.PENDING_DECISION;
      }

      if (vendor_status === ProjectConnectionVendorStatus.ACCEPTED) {
        return ProjectConnectionVendorDisplayStatus.ACCEPTED;
      }

      return null;
    },
  },
  Query: {
    projectConnection: async (parent, args, context) => {
      await checkProjectConnectionPermission(context, args.id);
      const projectConnection =
        await context.prisma.projectConnection.findFirst({
          where: {
            id: args.id,
          },
        });
      return projectConnection;
    },
    projectConnections: async (parent, args, context) => {
      return projectConnectionService.getProjectConnections(args, context);
    },
    bioInvitedProjectConnections: async (parent, args, context) => {
      if (process.env.ENABLE_BIOTECH_INVITE_CRO === 'true') {
        const { project_request_id } = args;
        invariant(project_request_id, 'Project request id is required.');

        const projectConnections =
          await context.prisma.projectConnection.findMany({
            where: {
              project_request_id,
              AND: {
                biotech_invite_vendor_id: {
                  not: null,
                },
              },
            },
            include: {
              vendor_company: true,
              biotech_invite_vendor: true,
            },
          });

        invariant(projectConnections, 'Project connections not found.');

        return projectConnections.map((pc) => ({
          ...pc,
          vendor_company: {
            ...pc.vendor_company,
          },
          biotech_invite_vendor: {
            ...pc.biotech_invite_vendor,
          },
        }));
      }
      return [];
    },
  },
  Mutation: {
    acceptProjectConnection: async (_, args, context) => {
      return projectConnectionService.acceptProjectConnection(args, context);
    },
    declinedProjectConnection: async (_, args, context) => {
      return projectConnectionService.declineProjectConnection(args, context);
    },
    addProjectCollaborator: async (parent, args, context) => {
      return collaboratorService.addProjectCollaborator(args, context);
    },
    removeProjectCollaborator: async (parent, args, context) => {
      return collaboratorService.removeProjectCollaborator(args, context);
    },
    inviteProjectCollaboratorViaEmail: async (parent, args, context) => {
      return collaboratorService.inviteProjectCollaboratorViaEmail(
        args,
        context,
      );
    },
  },
};

export default resolvers;
