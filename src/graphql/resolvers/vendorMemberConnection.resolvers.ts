import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { InternalError } from "../errors/InternalError";

const resolvers: Resolvers<Context> = {
  VendorMemberConnection: {
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
    vendor_member: async (parent, _, context) => {
      if (!parent.vendor_member_id) {
        throw new InternalError('Missing vendor member id.');
      }
      return await context.prisma.vendorMember.findFirst({
        where: {
          id: parent.vendor_member_id
        }
      })
    },
  },
};

export default resolvers;
