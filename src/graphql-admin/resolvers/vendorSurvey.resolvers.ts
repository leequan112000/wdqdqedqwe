import { PublicError } from "../../graphql/errors/PublicError";
import { getSignedUrl } from "../../helper/awsS3";
import { VendorSurveyStatus } from "../../helper/constant";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";

const resolver: Resolvers<Context> = {
  Query: {
    vendorSurveyAttachmentSignedUrl: async (parent, args) => {
      const { key } = args;
      return await getSignedUrl(key);
    },
  },
  Mutation: {
    approveVendorSurvey: async (parent, args, context) => {
      const { id } = args;

      await context.prismaCRODb.vendorSurvey.update({
        data: {
          status: VendorSurveyStatus.REVIEWED,
        },
        where: {
          id,
        },
      });

      return true;
    },
  }
};

export default resolver;
