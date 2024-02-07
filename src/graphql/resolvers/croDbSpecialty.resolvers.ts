import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  CroDbSpecialty: {
    subspecialties: async (parent, _, context) => {
      invariant(parent.id, 'Missing specialty id.');
      return await context.prismaCRODb.subspecialty.findMany({
        where: {
          specialty_id: parent.id,
        }
      });
    },
  },
};

export default resolvers;
