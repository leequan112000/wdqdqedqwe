import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { InternalError } from "../errors/InternalError";

const resolvers: Resolvers<Context> = {
  CustomerConnection: {
    project_connection: async (parent, _, context) => {
      if (!parent.project_connection_id) {
        throw new InternalError('Missing project connection id.');
      }
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id
        }
      })
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
