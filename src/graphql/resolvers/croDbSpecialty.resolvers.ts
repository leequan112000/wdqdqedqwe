import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  CroDbSpecialty: {
    subspecialties: async (parent, _, context) => {
      if (parent.subspecialties) return parent.subspecialties;
      invariant(parent.id, "Missing specialty id.");
      return await context.prismaCRODb.subspecialty.findMany({
        where: {
          specialty_id: parent.id,
        },
      });
    },
  },
  Query: {
    croDbSpecialties: async (_, __, context) => {
      return await context.prismaCRODb.specialty.findMany({
        include: {
          subspecialties: true,
        },
      });
    },
    croDbSpecialty: async (_, args, context) => {
      return await context.prismaCRODb.specialty.findFirst({
        where: {
          name: args.name,
        },
        include: {
          subspecialties: true,
        },
      });
    },
  },
};

export default resolvers;
