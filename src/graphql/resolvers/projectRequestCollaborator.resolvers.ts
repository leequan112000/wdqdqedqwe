import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { InternalError } from "../errors/InternalError";

const resolvers: Resolvers<Context> = {
  ProjectRequestCollaborator: {
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
    customer: async (parent, _, context) => {
      if (!parent.customer_id) {
        throw new InternalError('Missing customer id.');
      }
      return await context.prisma.customer.findFirst({
        where: {
          id: parent.customer_id
        }
      })
    },
  },
};

export default resolvers;
