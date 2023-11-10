import { User, ProjectConnection, CustomerConnection, VendorMemberConnection, ProjectRequest } from "@prisma/client";
import prisma from "../prisma";

export const getReceiversByProjectConnection = async (projectConnectionId: string, senderUserId: string): Promise<{
  receivers: User[];
  projectConnection: ProjectConnection & {
    customer_connections: CustomerConnection[];
    vendor_member_connections: VendorMemberConnection[];
    project_request: ProjectRequest;
  }
  senderCompanyName: string;
}> => {
  const projectConnection = await prisma.projectConnection.findFirstOrThrow({
    where: {
      id: projectConnectionId,
    },
    include: {
      customer_connections: true,
      vendor_member_connections: true,
      project_request: true,
    }
  });

  const vendor = await prisma.vendorMember.findFirst({
    where: {
      user_id: senderUserId,
    },
    include: {
      vendor_company: true,
    }
  });

  let senderCompanyName = "";
  let receivers: User[] = [];

  if (vendor) {
    // if uploader is vendor, notify biotech members
    senderCompanyName = vendor.vendor_company?.name as string;
    receivers = await prisma.user.findMany({
      where: {
        customer: {
          id: {
            in: projectConnection.customer_connections.map(cc => cc.customer_id),
          },
          has_setup_profile: {
            equals: true
          }
        },
        is_active: true,
      }
    });
  } else {
    // if uploader is customer, notify vendor members
    const customer = await prisma.customer.findFirstOrThrow({
      where: {
        user_id: senderUserId,
      },
      include: {
        biotech: true,
      }
    });
    senderCompanyName = customer.biotech.name;
    receivers = await prisma.user.findMany({
      where: {
        vendor_member: {
          id: {
            in: projectConnection.vendor_member_connections.map(vmc => vmc.vendor_member_id),
          },
          title: {
            not: null
          }
        },
        is_active: true,
      }
    });
  }

  return {
    senderCompanyName,
    projectConnection,
    receivers,
  }
}
