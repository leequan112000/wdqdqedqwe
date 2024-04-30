import { getSignedUrl } from "../../helper/awsS3";
import { Context } from "../../types/context";
import { Resolvers } from "../generated";

const resolvers: Resolvers<Context> = {
  Query: {
    signedUrl: async (_, args) => {
      const { key } = args;

      return await getSignedUrl(key);
    }
  }
}

export default resolvers;
