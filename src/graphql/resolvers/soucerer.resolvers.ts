import { withFilter } from "graphql-subscriptions";
import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import sourcererService from '../../services/sourcerer/sourcerer.service';
import { pubsub } from "../../helper/pubsub";

const resolvers: Resolvers<Context> = {
  Mutation: {
    extractPdfRfp: async (_, args, __) => {
      const { file } = args;
      const data = await file;

      return await sourcererService.extractPdfToRfp(data);
    },
    sourceRfpSpecialties: async (_, args, __) => {
      return await sourcererService.sourceRfpSpecialties({
        ...args,
        num_specialties: 5,
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
  }
}

export default resolvers;