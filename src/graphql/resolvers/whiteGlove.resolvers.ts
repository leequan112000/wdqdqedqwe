import invariant from "../../helper/invariant";
import { sendAdminShortlistSubmissionNotificationEmail } from "../../mailer/admin";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";

const resolvers: Resolvers<Context> = {
  Mutation: {
    sendSourcingShortlist: async (_, args, context) => {
      const { sourcing_session_id } = args;
      const sourcingSession = await context.prisma.sourcingSession.findFirst({
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

      invariant(sourcingSession, "No sourcing session found.");

      const admins = await context.prisma.admin.findMany();

      await sendAdminShortlistSubmissionNotificationEmail(
        admins.map((admin) => ({
          emailData: {
            admin_name: admin.username,
            project_title: sourcingSession.project_title,
            shortlisted_vendors: sourcingSession.sourced_cros.map((vendor) => ({
              id: vendor.cro_db_id,
              company_name: vendor.name,
            })),
            sourcing_session_id,
            button_url: process.env.RETOOL_PROJECT_URL!,
          },
          receiverEmail: admin.email,
        }))
      );

      return true;
    },
  },
};

export default resolvers;
