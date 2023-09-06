import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  CustomerConnection: {
    project_connection: async (parent, _, context) => {
      invariant(parent.project_connection_id, 'Missing project connection id.')
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id
        }
      })
    },
    customer: async (parent, _, context) => {
      invariant(parent.customer_id, 'Missing customer id.')
      return await context.prisma.customer.findFirst({
        where: {
          id: parent.customer_id
        }
      })
    },
  },
};

export default resolvers;
