import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import invariant from '../../helper/invariant';

const resolvers: Resolvers<Context> = {
  ProjectDeclineTagConnection: {
    project_decline_tag: async (parent, _, context) => {
      invariant(
        parent.project_decline_tag_id,
        'Project decline tag id not found',
      );

      return await context.prisma.projectDeclineTag.findFirst({
        where: {
          id: parent.project_decline_tag_id,
        },
      });
    },
    project_decline_feedback: async (parent, _, context) => {
      invariant(
        parent.project_decline_feedback_id,
        'Project decline feedback id not found.',
      );

      return await context.prisma.projectDeclineFeedback.findFirst({
        where: {
          id: parent.project_decline_feedback_id,
        },
      });
    },
  },
};

export default resolvers;
