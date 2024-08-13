import invariant from '../../helper/invariant';
import { sendAdminShortlistSubmissionNotificationEmail } from '../../mailer/admin';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import { slackNotification } from '../../helper/slack';

const resolvers: Resolvers<Context> = {
  Mutation: {
    sendSourcingShortlist: async (_, args, context) => {
      const userId = context.req.user_id;
      const { sourcing_session_id } = args;
      const sourcingSession =
        await context.prismaCRODb.sourcingSession.findFirst({
          where: {
            id: sourcing_session_id,
          },
          include: {
            sourced_cros: {
              where: {
                is_shortlisted: true,
              },
            },
          },
        });

      invariant(sourcingSession, 'No sourcing session found.');

      const admins = await context.prisma.admin.findMany();

      await sendAdminShortlistSubmissionNotificationEmail(
        admins.map((admin) => ({
          emailData: {
            admin_name: admin.username,
            project_title: sourcingSession.project_title,
            shortlisted_vendors: sourcingSession.sourced_cros.map((vendor) => ({
              id: vendor.vendor_company_id,
              company_name: vendor.name,
            })),
            sourcing_session_id,
            button_url: process.env.RETOOL_PROJECT_URL!,
          },
          receiverEmail: admin.email,
        })),
      );

      const user = await context.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      const buttonUrl =
        'https://cromatic.retool.com/apps/8950a5f6-06a1-11ef-92d5-077fdfe0d512/Cromatic%20Web/White%20Glove%20-%20Sourcing%20Sessions' +
        `?searchTerm=${sourcing_session_id}`;

      await slackNotification.newShortlistNotification({
        submittedBy: user ? [user.first_name, user.last_name].join(' ') : 'N/A',
        submittedAt: new Date().toISOString(),
        shortlistCounts: sourcingSession.sourced_cros.length.toString(),
        shortlistedVendors: sourcingSession.sourced_cros.map((cro) => ({
          vendor_id: cro.id,
          vendor_name: cro.name,
        })),
        buttonUrl,
      });

      return true;
    },
  },
};

export default resolvers;
