import { ProjectRequestStatus } from "../../helper/constant";
import invariant from "../../helper/invariant";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createProjectRequest: async (_, args, context) => {
      const consultantUserId = context.req.consultant_user_id;

      invariant(
        context.req.consultant_user_id,
        "Consultant user id not found."
      );

      const consultantUser = await context.prisma.user.findUnique({
        where: {
          id: consultantUserId,
        },
        include: {
          customer: true,
        },
      });

      invariant(consultantUser, "Consultant user not found.");

      const consultantCustomer = consultantUser.customer;
      invariant(consultantCustomer, "Consultant user not found.");

      const projectRequest = await context.prisma.projectRequest.create({
        data: {
          status: ProjectRequestStatus.PROCESSING,
          customer_id: consultantCustomer.id,
          biotech_id: consultantCustomer.biotech_id,
          title: args.title,
          vendor_requirement: args.vendor_requirement || "-",
          objective_description: args.objective_description || "-",
          preparation_description: args.preparation_description || "-",
          in_contact_with_vendor: false,
          vendor_search_timeframe: "-",
          sourcing_session_id: args.sourcing_session_id,
        },
      });

      return projectRequest;
    },
    connectCustomerToProject: async (_, args, context) => {
      const { customer_id, project_connection_id } = args;

      await context.prisma.customerConnection.upsert({
        where: {
          project_connection_id_customer_id: {
            customer_id,
            project_connection_id,
          },
        },
        create: {
          customer_id,
          project_connection_id,
        },
        update: {
          customer_id,
          project_connection_id,
        },
      });

      // TODO: notify customer about the connection

      return true;
    },
  },
};

export default resolvers;
