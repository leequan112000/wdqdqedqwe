import { withFilter } from "graphql-subscriptions";
import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import sourcererService from "../../services/sourcerer/sourcerer.service";
import { pubsub } from "../../helper/pubsub";
import invariant from "../../helper/invariant";
import { getSignedUrl } from "../../helper/awsS3";
import { formatBytes } from "../../helper/filesize";
import { PublicError } from "../errors/PublicError";

const resolvers: Resolvers<Context> = {
  SourcingSession: {
    biotech: async (parent, _, context) => {
      invariant(parent.biotech_id, "Missing biotech id.");
      return await context.prisma.biotech.findUnique({
        where: {
          id: parent.biotech_id,
        },
      });
    },
    sourcing_subspecialties: async (parent, _, context) => {
      invariant(parent.id, "Missing session id.");
      return await context.prisma.sourcingSession
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .sourcing_subspecialties();
    },
    sourcing_attachments: async (parent, _, context) => {
      invariant(parent.id, "Missing session id.");
      const attachments = await context.prisma.sourcingSession
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .sourcing_attachments();

      return (attachments ?? []).map((a) => ({
        ...a,
        byte_size: Number(a.byte_size),
      }));
    },
    sourced_cros: async (parent, _, context) => {
      invariant(parent.id, "Missing session id.");
      return await context.prisma.sourcingSession
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .sourced_cros({
          orderBy: [{ score: "desc" }],
        });
    },
  },
  SourcingSubspecialty: {
    sourcing_session: async (parent, _, context) => {
      invariant(parent.sourcing_session_id, "Missing session id.");
      return await context.prisma.sourcingSession.findUnique({
        where: {
          id: parent.sourcing_session_id,
        },
      });
    },
  },
  SourcingAttachment: {
    signed_url: async (parent) => {
      invariant(parent.key, "Key not found.");
      return await getSignedUrl(parent.key);
    },
    formatted_filesize: async (parent) => {
      if (parent.byte_size) {
        return formatBytes(parent.byte_size);
      }
      return null;
    },
    sourcing_session: async (parent, _, context) => {
      if (parent.sourcing_session_id) {
        return await context.prisma.sourcingSession.findUnique({
          where: {
            id: parent.sourcing_session_id,
          },
        });
      }
      return null;
    },
  },
  SourcedCro: {
    sourcing_session: async (parent, _, context) => {
      invariant(parent.sourcing_session_id, "Missing session id.");
      return await context.prisma.sourcingSession.findUnique({
        where: {
          id: parent.sourcing_session_id,
        },
      });
    },
    cro_db_vendor_company: async (parent, _, context) => {
      invariant(parent.cro_db_id, "Missing CRO DB id.");
      return await context.prismaCRODb.vendorCompany.findUnique({
        where: {
          id: parent.cro_db_id,
        },
      });
    },
  },
  Query: {
    sourcingSession: async (_, args, context) => {
      const { id } = args;
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError("Customer not found."));

      const sourcingSession = await context.prisma.sourcingSession.findFirst({
        where: {
          id,
          biotech_id: customer.biotech_id,
        },
      });

      invariant(
        sourcingSession,
        new PublicError("Sourcing session not found.")
      );

      return sourcingSession;
    },
    sourcingSessions: async (_, __, context) => {
      const customer = await context.prisma.customer.findUnique({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError("Customer not found."));

      const sessions = await context.prisma.sourcingSession.findMany({
        where: {
          biotech_id: customer.biotech_id,
        },
        orderBy: {
          updated_at: "desc",
        },
      });

      return sessions;
    },
  },
  Mutation: {
    extractPdfRfp: async (_, args, context) => {
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError("Customer not found."));

      const { file, sourcing_session_id } = args;
      const data = await file;

      return await sourcererService.extractPdfToRfp(
        {
          file: data,
          user_id: customer.user_id,
          biotech_id: customer.biotech_id,
          sourcing_session_id: sourcing_session_id as string,
        },
        context
      );
    },
    sourceRfpSpecialties: async (_, args, context) => {
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError("Customer not found."));

      return await sourcererService.sourceRfpSpecialties(
        {
          ...args,
          num_specialties: 5,
          biotech_id: customer.biotech_id,
        },
        context
      );
    },
    sourceCros: async (_, args, context) => {
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError("Customer not found."));

      return await sourcererService.sourceCros(
        {
          ...args,
        },
        context
      );
    },
    shortlistSourcedCro: async (_, args, context) => {
      const { sourcing_session_id, sourced_cro_id } = args;
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError("Customer not found."));

      return await context.prisma.sourcedCro.update({
        where: {
          id: sourced_cro_id,
          sourcing_session_id,
        },
        data: {
          is_shortlisted: true,
        },
      });
    },
    removeSourcedCroFromShortlist: async (_, args, context) => {
      const { sourcing_session_id, sourced_cro_id } = args;
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError("Customer not found."));

      return await context.prisma.sourcedCro.update({
        where: {
          id: sourced_cro_id,
          sourcing_session_id,
        },
        data: {
          is_shortlisted: false,
        },
      });
    },
    confirmEditSourcingDetails: async (_, args, context) => {
      const { sourcing_session_id } = args;
      return await context.prisma.$transaction(async (trx) => {
        await trx.sourcingSubspecialty.deleteMany({
          where: {
            sourcing_session_id: sourcing_session_id,
          },
        });

        await trx.sourcedCro.deleteMany({
          where: {
            sourcing_session_id,
          },
        });

        return await trx.sourcingSession.findUnique({
          where: {
            id: sourcing_session_id,
          },
        });
      });
    },
    confirmEditSourcingSubspecialties: async (_, args, context) => {
      const { sourcing_session_id } = args;

      return await context.prisma.$transaction(async (trx) => {
        await trx.sourcedCro.deleteMany({
          where: {
            sourcing_session_id,
          },
        });

        return await trx.sourcingSession.findUnique({
          where: {
            id: sourcing_session_id,
          },
        });
      });
    },
    cancelAiTask: async (_, args, context) => {
      const { task_id, sourcing_session_id } = args;

      const resp = await sourcererService.revokeAiTask(
        {
          task_id,
          sourcing_session_id,
        },
        context
      );

      return resp;
    },
    confirmRemoveSourcingSession: async (_, args, context) => {
      const { sourcing_session_id } = args;

      const deletedSourcingSession =
        await context.prisma.sourcingSession.delete({
          where: {
            id: sourcing_session_id,
          },
        });

      return deletedSourcingSession;
    },
  },
  Subscription: {
    sourceRfpSpecialties: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator<any>(["SOURCE_RFP_SPECIALTIES"]),
        (payload, variables) => {
          return payload.sourceRfpSpecialties.task_id === variables.task_id;
        }
      ),
    },
    sourceCros: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator<any>(["SOURCE_CROS"]),
        (payload, variables) => {
          return payload.sourceCros.task_id === variables.task_id;
        }
      ),
    },
  },
};

export default resolvers;
