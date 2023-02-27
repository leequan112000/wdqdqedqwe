import { VendorMemberConnection, ProjectConnection, VendorMember } from "@prisma/client";
import { Context } from "../../context";

export default {
  VendorMemberConnection: {
    project_connection: async (parent: VendorMemberConnection, _: void, context: Context): Promise<ProjectConnection | null> => {
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id
        }
      })
    },
    vendor_member: async (parent: VendorMemberConnection, _: void, context: Context): Promise<VendorMember | null> => {
      return await context.prisma.vendorMember.findFirst({
        where: {
          id: parent.vendor_member_id
        }
      })
    },
  },
};
