import invariant from '../../helper/invariant';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import { slackNotification } from '../../helper/slack';
import { getUserFullName } from '../../helper/email';
import { WhiteGloveStatus } from '../../helper/constant';

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

      const user = await context.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      const buttonUrl =
        'https://cromatic.retool.com/apps/8950a5f6-06a1-11ef-92d5-077fdfe0d512/Cromatic%20Web/White%20Glove%20-%20Sourcing%20Sessions' +
        `?searchTerm=${sourcing_session_id}`;

      await slackNotification.newShortlistNotification({
        submittedBy: user ? getUserFullName(user) : 'N/A',
        submittedAt: new Date().toISOString(),
        shortlistCounts: sourcingSession.sourced_cros.length.toString(),
        shortlistedVendors: sourcingSession.sourced_cros.map((cro) => ({
          vendor_id: cro.id,
          vendor_name: cro.name,
        })),
        buttonUrl,
      });

      await context.prismaCRODb.sourcingSession.update({
        where: {
          id: sourcing_session_id,
        },
        data: {
          whiteglove_status: WhiteGloveStatus.SUBMITTED,
        },
      });

      return true;
    },
    updateWhiteGloveStatus: async (_, args, context) => {
      const { sourcing_session_id, whiteglove_status } = args;

      return await context.prismaCRODb.sourcingSession.update({
        where: {
          id: sourcing_session_id,
        },
        data: {
          whiteglove_status,
        },
      });
    },
  },
};

export default resolvers;
