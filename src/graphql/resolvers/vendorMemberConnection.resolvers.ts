import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  VendorMemberConnection: {
    project_connection: async (parent, _, context) => {
      invariant(parent.project_connection_id, 'Missing project connection id.');
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id
        }
      })
    },
    vendor_member: async (parent, _, context) => {
      invariant(parent.vendor_member_id, 'Missing vendor member id.');
      return await context.prisma.vendorMember.findFirst({
        where: {
          id: parent.vendor_member_id
        }
      })
    },
  },
};

export default resolvers;
