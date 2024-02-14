import { getSignedUrl } from "../../helper/awsS3";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";

const resolver: Resolvers<Context> = {
  Query: {
    vendorSurveyAttachmentSignedUrl: async (parent, args) => {
      const { key } = args;
      return await getSignedUrl(key);
    },
  },
};

export default resolver;
