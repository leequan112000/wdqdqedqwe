import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  CroDbSubspecialty: {
    specialty: async (parent, _, context) => {
      invariant(parent.specialty_id, 'Missing specialty id.');
      return await context.prismaCRODb.specialty.findFirst({
        where: {
          id: parent.specialty_id,
        }
      });
    },
  },
};

export default resolvers;
