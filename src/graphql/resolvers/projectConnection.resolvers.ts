import { CustomerConnection, ProjectAttachment, ProjectConnection, ProjectRequest, VendorCompany, VendorMemberConnection } from "@prisma/client";
import { Context } from "../../context";

export default {
  ProjectConnection: {
    vendor_company: async (parent: ProjectConnection, _: void, context: Context): Promise<VendorCompany | null> => {
      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id
        }
      })
    },
    project_request: async (parent: ProjectConnection, _: void, context: Context): Promise<ProjectRequest | null> => {
      return await context.prisma.projectRequest.findFirst({
        where: {
          id: parent.project_request_id
        }
      })
    },
    vendor_member_connections: async (parent: ProjectConnection, _: void, context: Context): Promise<VendorMemberConnection[] | null> => {
      return await context.prisma.vendorMemberConnection.findMany({
        where: {
          project_connection_id: parent.id
        }
      })
    },
    customer_connections: async (parent: ProjectConnection, _: void, context: Context): Promise<CustomerConnection[] | null> => {
      return await context.prisma.customerConnection.findMany({
        where: {
          project_connection_id: parent.id
        }
      })
    },
    project_attachments: async (parent: ProjectConnection, _: void, context: Context): Promise<ProjectAttachment[] | null> => {
      return await context.prisma.projectAttachment.findMany({
        where: {
          project_connection_id: parent.id
        }
      })
    },
  },
};
