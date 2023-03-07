import { ProjectConnection, CustomerConnection, Customer } from "@prisma/client";
import { Context } from "../../types/context";

export default {
  CustomerConnection: {
    project_connection: async (parent: CustomerConnection, _: void, context: Context): Promise<ProjectConnection | null> => {
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id
        }
      })
    },
    customer: async (parent: CustomerConnection, _: void, context: Context): Promise<Customer | null> => {
      return await context.prisma.customer.findFirst({
        where: {
          id: parent.customer_id
        }
      })
    },
  },
};
