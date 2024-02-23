import { withFilter } from "graphql-subscriptions";
import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import sourcererService from '../../services/sourcerer/sourcerer.service';
import { pubsub } from "../../helper/pubsub";
import invariant from "../../helper/invariant";
import { PublicError } from "../errors/PublicError";

const resolvers: Resolvers<Context> = {
  SourcingSession: {
    biotech: async (parent, _, context) => {
      invariant(parent.biotech_id, 'Missing biotech id.');
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id
        },
      });
    },
    sourcing_subspecialties: async (parent, _, context) => {
      invariant(parent.id, 'Missing session id.');
      return await context.prisma.sourcingSubspecialty.findMany({
        where: {
          sourcing_session_id: parent.id
        },
      });
    },
    sourced_cros: async (parent, _, context) => {
      invariant(parent.id, 'Missing session id.');
      return await context.prisma.sourcedCro.findMany({
        where: {
          sourcing_session_id: parent.id
        },
        orderBy: [
          { score: 'desc' }
        ],
      });
    },
  },
  SourcingSubspecialty: {
    sourcing_session: async (parent, _, context) => {
      invariant(parent.sourcing_session_id, 'Missing session id.');
      return await context.prisma.sourcingSession.findFirst({
        where: {
          id: parent.sourcing_session_id
        },
      });
    },
  },
  SourcedCro: {
    sourcing_session: async (parent, _, context) => {
      invariant(parent.sourcing_session_id, 'Missing session id.');
      return await context.prisma.sourcingSession.findFirst({
        where: {
          id: parent.sourcing_session_id
        },
      });
    },
    cro_db_vendor_company: async (parent, _, context) => {
      invariant(parent.cro_db_id, 'Missing CRO DB id.');
      return await context.prismaCRODb.vendorCompany.findFirst({
        where: {
          id: parent.cro_db_id
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

      invariant(customer, new PublicError('Customer not found.'));

      const sourcingSession = await context.prisma.sourcingSession.findFirst({
        where: {
          id,
          biotech_id: customer.biotech_id,
        },
      });

      invariant(sourcingSession, new PublicError('Sourcing session not found.'));

      return sourcingSession;
    },
  },
  Mutation: {
    extractPdfRfp: async (_, args, __) => {
      const { file } = args;
      const data = await file;

      return await sourcererService.extractPdfToRfp(data);
    },
    sourceRfpSpecialties: async (_, args, context) => {
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError('Customer not found.'));

      return await sourcererService.sourceRfpSpecialties({
        ...args,
        num_specialties: 5,
        biotech_id: customer.biotech_id,
      }, context);
    },
    sourceCros: async (_, args, context) => {
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError('Customer not found.'));

      return await sourcererService.sourceCros({
        ...args,
      }, context);
    },
    shortlistSourcedCro: async (_, args, context) => {
      const { sourcing_session_id, sourced_cro_id } = args;
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError('Customer not found.'));

      return await context.prisma.sourcedCro.update({
        where: {
          id: sourced_cro_id,
          sourcing_session_id,
        },
        data: {
          is_shortlisted: true,
        }
      });
    },
    removeSourcedCroFromShortlist: async (_, args, context) => {
      const { sourcing_session_id, sourced_cro_id } = args;
      const customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      invariant(customer, new PublicError('Customer not found.'));

      return await context.prisma.sourcedCro.update({
        where: {
          id: sourced_cro_id,
          sourcing_session_id,
        },
        data: {
          is_shortlisted: false,
        }
      });
    },
  },
  Subscription: {
    sourceRfpSpecialties: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator<any>(['SOURCE_RFP_SPECIALTIES']),
        (payload, variables) => {
          return (payload.sourceRfpSpecialties.task_id === variables.task_id);
        },
      ),
    },
    sourceCros: {
      // @ts-ignore
      subscribe: withFilter(
        () => pubsub.asyncIterator<any>(['SOURCE_CROS']),
        (payload, variables) => {
          return (payload.sourceCros.task_id === variables.task_id);
        },
      ),
    },
  }
}

export default resolvers;
