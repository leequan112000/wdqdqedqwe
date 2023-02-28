import { Customer, ProjectConnection, ProjectRequest, ProjectRequestComment } from "@prisma/client";
import { Context } from "../../context";
import { PublicError } from "../errors/PublicError";
import { Request } from "express";
import { MutationCreateProjectRequestArgs } from "../generated";
import { ProjectRequestStatus } from "../../helper/constant";
import { sendProjectRequestSubmissionEmail } from "../../mailer/projectRequest";
import { sendAdminNewProjectRequestEmail } from "../../mailer/admin";

export default {
  ProjectRequest: {
    customer: async (parent: ProjectRequest, _: void, context: Context): Promise<Customer | null> => {
      return await context.prisma.customer.findFirst({
        where: {
          id: parent.customer_id
        }
      })
    },
    project_connections: async (parent: ProjectRequest, _: void, context: Context): Promise<ProjectConnection[] | null> => {
      return await context.prisma.projectConnection.findMany({
        where: {
          project_request_id: parent.id
        }
      })
    },
    project_request_comments: async (parent: ProjectRequest, _: void, context: Context): Promise<ProjectRequestComment[] | null> => {
      return await context.prisma.projectRequestComment.findMany({
        where: {
          project_request_id: parent.id
        }
      })
    },
  },
  Mutation: {
    createProjectRequest: async (_: void, args: MutationCreateProjectRequestArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id
            },
            include: {
              customer: {
                include: {
                  biotech: true
                }
              }
            }
          });

          if (!user.customer) {
            throw new PublicError('User is not a customer.');
          }

          const projectRequest = await trx.projectRequest.create({
            data: {
              status: ProjectRequestStatus.PROCESSING,
              customer_id: user.customer.id,
              ...args,
            }
          });

          // TODO implement queue
          sendProjectRequestSubmissionEmail(user);
          await sendAdminNewProjectRequestEmail(user.customer.biotech.name);

          return projectRequest;
        });        
      } catch (error) {
        return error;
      }
    },
  },
};
