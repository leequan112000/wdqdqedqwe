import { PrismaClient, Prisma } from "@prisma/client";
import invariant from "../../helper/invariant";
import { deleteRolesForUser } from "../../helper/casbin";

interface ServiceContext {
  prisma: PrismaClient | Prisma.TransactionClient;
}

type PurgeTestDataByUserEventArgs = {
  user_id: string;
}

const purgeTestDataByUser = async (args: PurgeTestDataByUserEventArgs, ctx: ServiceContext) => {
  const { user_id } = args;
  const user = await ctx.prisma.user.findFirst({
    where: {
      id: user_id,
    },
    include: {
      customer: true,
      vendor_member: true,
    }
  });

  invariant(user, 'User not found.');

  invariant((user?.first_name.includes('[TEST]') || user?.first_name === 'Cypress'), 'The user is not a test user. Abort deletion.');

  if (user.customer) {
    const biotech = await ctx.prisma.biotech.findFirst({
      where: {
        id: user.customer.biotech_id,
      },
      include: {
        customers: true,
        project_requests: {
          include: {
            project_connections: {
              include: {
                chats: true,
                customer_connections: true,
                vendor_member_connections: true,
              }
            }
          }
        }
      }
    });

    invariant(biotech, 'Biotech not found.');

    const projectRequestIds = biotech.project_requests.map(p => p.id);
    let projectConnectionIds: string[] = [];
    for (const projectRequest of biotech.project_requests) {
      projectConnectionIds.concat(projectRequest.project_connections.map(c => c.id));
    }

    // Delete vendor_member_connections
    await ctx.prisma.vendorMemberConnection.deleteMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete customer_connections
    await ctx.prisma.customerConnection.deleteMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete project_attachments
    await ctx.prisma.projectAttachment.deleteMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete meeting_events
    const meetingEvents = await ctx.prisma.meetingEvent.findMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });
    await ctx.prisma.meetingAttendeeConnection.deleteMany({
      where: {
        meeting_event_id: {
          in: meetingEvents.map(m => m.id),
        }
      }
    });
    await ctx.prisma.meetingEvent.deleteMany({
      where: {
        id: {
          in: meetingEvents.map(m => m.id),
        }
      }
    });

    // Delete quotes & milestones
    const quotes = await ctx.prisma.quote.findMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });
    await ctx.prisma.milestone.deleteMany({
      where: {
        quote_id: {
          in: quotes.map(q => q.id),
        }
      }
    });
    await ctx.prisma.quote.deleteMany({
      where: {
        id: {
          in: quotes.map(q => q.id),
        }
      }
    });

    // Delete chats
    await ctx.prisma.chat.deleteMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete project_connections
    await ctx.prisma.projectConnection.deleteMany({
      where: {
        project_request_id: {
          in: projectRequestIds,
        }
      }
    });

    // Delete project_request_collaborators
    await ctx.prisma.projectRequestCollaborator.deleteMany({
      where: {
        project_request_id: {
          in: projectRequestIds,
        }
      }
    });

    // Delete project_requests
    await ctx.prisma.projectRequest.deleteMany({
      where: {
        biotech_id: biotech.id
      }
    });

    // Delete biotech_invite_vendors
    await ctx.prisma.biotechInviteVendor.deleteMany({
      where: {
        biotech_id: biotech.id
      }
    });

    // Delete customers
    await ctx.prisma.customer.deleteMany({
      where: {
        biotech_id: biotech.id
      }
    });

    // Delete subscription
    await ctx.prisma.subscription.deleteMany({
      where: {
        biotech_id: biotech.id,
      }
    });

    // Delete users
    const userIds = biotech.customers.map(c => c.user_id);
    await ctx.prisma.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    });

    // Delete user roles
    for (const userId of userIds) {
      await deleteRolesForUser(userId);
    }

    // Delete biotech
    await ctx.prisma.biotech.delete({
      where: {
        id: biotech.id
      }
    });
  }

  if (user.vendor_member) {
    const vendorCompany = await ctx.prisma.vendorCompany.findFirst({
      where: {
        id: user.vendor_member.vendor_company_id,
      },
      include: {
        vendor_members: {
          include: {
            vendor_member_connections: {
              include: {
                project_connection: {
                  include: {
                    chats: true,
                    customer_connections: true
                  }
                }
              }
            }
          }
        }
      }
    })

    invariant(vendorCompany, 'Vendor company not found.');

    let projectConnectionIds: string[] = [];
    for (const vendorMember of vendorCompany.vendor_members) {
      projectConnectionIds.concat(vendorMember.vendor_member_connections.map(v => v.project_connection_id));
    }

    // Delete customer_connections
    await ctx.prisma.customerConnection.deleteMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete project_attachments
    await ctx.prisma.projectAttachment.deleteMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete meeting_events
    const meetingEvents = await ctx.prisma.meetingEvent.findMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds
        }
      }
    });
    await ctx.prisma.meetingAttendeeConnection.deleteMany({
      where: {
        meeting_event_id: {
          in: meetingEvents.map(m => m.id),
        }
      }
    });
    await ctx.prisma.meetingEvent.deleteMany({
      where: {
        id: {
          in: meetingEvents.map(m => m.id),
        }
      }
    });

    // Delete quotes & milestones
    const quotes = await ctx.prisma.quote.findMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds
        }
      }
    });
    await ctx.prisma.milestone.deleteMany({
      where: {
        quote_id: {
          in: quotes.map(q => q.id),
        }
      }
    });
    await ctx.prisma.quote.deleteMany({
      where: {
        id: {
          in: quotes.map(q => q.id),
        }
      }
    });

    // Delete chats
    await ctx.prisma.chat.deleteMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete project_connections
    await ctx.prisma.projectConnection.deleteMany({
      where: {
        project_request_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete vendor_member_connections
    await ctx.prisma.vendorMemberConnection.deleteMany({
      where: {
        project_connection_id: {
          in: projectConnectionIds,
        }
      }
    });

    // Delete certification_tag_connections
    await ctx.prisma.certificationTagConnection.deleteMany({
      where: {
        vendor_company_id: vendorCompany.id
      }
    });

    // Delete lab_specialization_connections
    await ctx.prisma.labSpecializationConnection.deleteMany({
      where: {
        vendor_company_id: vendorCompany.id
      }
    });

    // Delete vendor_members
    await ctx.prisma.vendorMember.deleteMany({
      where: {
        id: {
          in: vendorCompany.vendor_members.map(v => v.id)
        }
      }
    });

    // Delete users
    const userIds = vendorCompany.vendor_members.map(v => v.user_id);
    await ctx.prisma.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    });

    // Delete user roles
    for (const userId of userIds) {
      await deleteRolesForUser(userId);
    }

    // Delete vendor_company
    await ctx.prisma.vendorCompany.delete({
      where: {
        id: vendorCompany.id
      }
    });
  }

  return true;
}

type UnregisterBiotechAccountEventArgs = {
  biotech_id: string;
}

const unregisterBiotechAccount = async (args: UnregisterBiotechAccountEventArgs, ctx: ServiceContext) => {
  // This function is use to unregister account that vendor wrongly signed up as biotech
  const { biotech_id } = args;
  const biotech = await ctx.prisma.biotech.findFirst({
    where: {
      id: biotech_id,
    },
    include: {
      customers: {
        include: {
          user: true
        }
      }
    }
  });

  invariant(biotech, 'Biotech not found.');

  // Biotech should have only one user
  await ctx.prisma.customer.delete({
    where: {
      id: biotech.customers[0].id
    }
  });

  await ctx.prisma.user.delete({
    where: {
      id: biotech.customers[0].user_id
    }
  });

  await ctx.prisma.biotech.delete({
    where: {
      id: biotech_id
    }
  });

  await deleteRolesForUser(biotech.customers[0].user_id);

  return true;
}

const userService = {
  purgeTestDataByUser,
  unregisterBiotechAccount,
};

export default userService;
