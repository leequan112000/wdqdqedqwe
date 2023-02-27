import { ProjectRequestComment, ProjectRequest } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../context";
import { PublicError } from "../errors/PublicError";
import { MutationCreateProjectRequestCommentArgs } from "../generated";

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
            }
          });


          if (!projectRequest) {
            throw new PublicError('Project request not found.');
          }

          return await context.prisma.projectRequestComment.create({
            data: { ...args }
          });
        }); 
      } catch (error) {
        return error;
      }
    },
  }
};
