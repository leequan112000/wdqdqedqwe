import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import sourcererService from '../../services/sourcerer/sourcerer.service';

const resolvers: Resolvers<Context> = {
  Mutation: {
    extractPdfRfp: async (_, args, __) => {
      const { file } = args;
      const data = await file;

      return await sourcererService.extractPdfToRfp(data);
    },
  }
}

export default resolvers;