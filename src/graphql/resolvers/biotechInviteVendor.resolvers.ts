import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';
import { PublicError } from '../errors/PublicError';
import { sendAdminBiotechInviteVendorNoticeEmail } from '../../mailer/admin';
import { AdminTeam } from '../../helper/constant';

const resolvers: Resolvers<Context> = {
  BiotechInviteVendor: {
    biotech: async (parent, _, context) => {
      invariant(parent.biotech_id, 'Biotech id not found.');

      const biotech = await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id,
        },
      });

      invariant(biotech, 'Biotech not found.');
      return biotech;
    },
    inviter: async (parent, _, context) => {
      invariant(parent.inviter_id, 'Inviter id not found.');

      const inviter = await context.prisma.user.findFirst({
        where: {
          id: parent.inviter_id,
        },
      });

      invariant(inviter, 'Inviter not found.');
      return inviter;
    },
    project_request: async (parent, _, context) => {
      invariant(parent.project_request_id, 'Project request id not found.');

      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: parent.project_request_id,
        },
      });

      invariant(projectRequest, 'Project request not found.');
      const processedResult = {
        ...projectRequest,
        max_budget: projectRequest.max_budget?.toNumber() || 0,
      };

      return processedResult;
    },
  },
  Query: {
    biotechInviteVendors: async (_, args, context) => {
      const { project_request_id } = args;

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

      invariant(
        project_request_id,
        new PublicError('Project request ID is required.'),
      );

      const projectRequest =
        await context.prisma.projectRequest.findFirstOrThrow({
          where: {
            id: project_request_id,
          },
        });

      invariant(projectRequest, new PublicError('Project request not found.'));

      const biotechInviteVendors =
        await context.prisma.biotechInviteVendor.findMany({
          where: {
            biotech_id: user.customer?.biotech_id!,
            project_request_id: project_request_id,
          },
        });

      return biotechInviteVendors;
    },
  },
  Mutation: {
    createBiotechInviteVendor: async (_, args, context) => {
      const {
        company_name,
        website,
        email,
        first_name,
        last_name,
        project_request_id,
      } = args;

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

      const projectRequest =
        await context.prisma.projectRequest.findFirstOrThrow({
          where: {
            id: project_request_id,
          },
        });

      invariant(projectRequest, new PublicError('Project request not found.'));

      const admins = await context.prisma.admin.findMany({
        where: {
          team: AdminTeam.SCIENCE,
        },
      });

      const newBiotechInviteVendor =
        await context.prisma.biotechInviteVendor.create({
          data: {
            company_name: company_name,
            website: website,
            email: email,
            first_name: first_name,
            last_name: last_name,
            biotech_id: user.customer?.biotech_id!,
            inviter_id: user.id,
            project_request_id: project_request_id,
          },
        });

      // Send email to admin
      const data = {
        biotech_name: user.customer?.biotech?.name!,
        inviter_full_name: `${user.first_name} ${user.last_name}`,
        vendor_company_name: company_name,
        website: website,
        first_name: first_name,
        last_name: last_name,
        email: email,
        project_request_name: projectRequest.title,
      };
      await Promise.all(
        admins.map(async (admin) => {
          sendAdminBiotechInviteVendorNoticeEmail(admin, data);
        }),
      );

      return newBiotechInviteVendor;
    },
  },
};

export default resolvers;
