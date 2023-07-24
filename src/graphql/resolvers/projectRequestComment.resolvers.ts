import moment from "moment";
import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { createSendAdminNewProjectRequestCommentJob } from "../../queues/email.queues";
import { InternalError } from "../errors/InternalError";
import { PermissionDeniedError } from "../errors/PermissionDeniedError";

const resolvers: Resolvers<Context> = {
  ProjectRequestComment: {
    project_request: async (parent, _, context) => {
      if (!parent?.project_request_id) {
        throw new InternalError('Missing project request id');
      }
      const projectRequest = await context.prisma.projectRequest.findFirst({
        where: {
          id: parent.project_request_id,
        },
      });
      if (!projectRequest) {
        throw new InternalError('Project request not found');
      }
      return {
        ...projectRequest,
        max_budget: projectRequest.max_budget?.toNumber() || 0,
      };
    },
  },
  Mutation: {
    createProjectRequestComment: async (_, args, context) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const customer = await trx.customer.findFirstOrThrow({
            where: {
              user_id: context.req.user_id,
            },
          });

          // Ensure user has the right access to comment
          const projectRequest = await trx.projectRequest.findFirst({
            where: {
              customer_id: customer.id,
              id: args.project_request_id
            },
            include: { biotech: true },
          });


          if (!projectRequest) {
            throw new PermissionDeniedError();
          }

          const fifteenMinBefore = moment().subtract(15, 'minute');
          const commentsWithinThePast15Min = await trx.projectRequestComment.findFirst({
            where: {
              project_request_id: args.project_request_id,
              created_at: {
                gte: fifteenMinBefore.toDate(),
              }
            },
            orderBy: {
              created_at: 'desc',
            },
          });

          const newComment = await trx.projectRequestComment.create({
            data: { ...args }
          });

          // Simple anti spam mechanism.
          // Only send if there is no email sent in the past 15 minutes.
          if (!commentsWithinThePast15Min) {
            createSendAdminNewProjectRequestCommentJob({
              biotechName: projectRequest.biotech.name,
            });
          }
          return newComment;
        });
      } catch (error) {
        throw error;
      }
    },
  }
};

export default resolvers;
