import { withFilter } from "graphql-subscriptions";
import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import sourcererService from '../../services/sourcerer/sourcerer.service';
import { pubsub } from "../../helper/pubsub";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  SourcingSession: {
    sourcing_specialties: async (parent, _, context) => {
      invariant(parent.id, 'Missing session id.');
      return await context.prisma.sourcingSpecialty.findMany({
        where: {
          sourcing_session_id: parent.id
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
      });
    },
  },
  SourcingSpecialty: {
    sourcing_session: async (parent, _, context) => {
      invariant(parent.sourcing_session_id, 'Missing session id.');
      return await context.prisma.sourcingSession.findFirst({
        where: {
          id: parent.sourcing_session_id
        },
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
    sourcing_specialty: async (parent, _, context) => {
      invariant(parent.sourcing_specialty_id, 'Missing specialty id.');
      return await context.prisma.sourcingSpecialty.findFirst({
        where: {
          id: parent.sourcing_specialty_id
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
  },
  Mutation: {
    extractPdfRfp: async (_, args, __) => {
      const { file } = args;
      const data = await file;

      return await sourcererService.extractPdfToRfp(data);
    },
    sourceRfpSpecialties: async (_, args, context) => {
      return await sourcererService.sourceRfpSpecialties({
        ...args,
        num_specialties: 5,
      }, context);
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
  }
}

export default resolvers;