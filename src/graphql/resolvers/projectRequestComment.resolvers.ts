import { ProjectRequestComment, ProjectRequest } from "@prisma/client";
import { Request } from "express";
import moment from "moment";
import { Context } from "../../types/context";
import { PublicError } from "../errors/PublicError";
import { MutationCreateProjectRequestCommentArgs } from "../../generated";
import { createSendAdminNewProjectRequestCommentJob } from "../../queues/email.queues";

export default {
  ProjectRequestComment: {
    project_request: async (parent: ProjectRequestComment, _: void, context: Context): Promise<ProjectRequest | null> => {
      return await context.prisma.projectRequest.findFirst({
        where: {
          id: parent.project_request_id
        }
      })
    },
  },
  Mutation: {
    createProjectRequestComment: async (_: void, args: MutationCreateProjectRequestCommentArgs, context: Context & { req: Request }) => {
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
            throw new PublicError('Project request not found.');
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
        return error;
      }
    },
  }
};
