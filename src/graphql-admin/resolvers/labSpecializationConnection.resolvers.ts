import { Resolvers } from "../generated";
import { Context } from "../../types/context";
import { PublicError } from "../../graphql/errors/PublicError";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createLabSpecializationConnection: async (parent, args: { lab_specialization_id: string, vendor_company_id: string }, context) => {
      const { lab_specialization_id, vendor_company_id } = args;

      const existingCertificationTagConnection = await context.prisma.labSpecializationConnection.findFirst({
        where: {
          lab_specialization_id: lab_specialization_id,
          vendor_company_id: vendor_company_id,
        }
      });

      invariant(!existingCertificationTagConnection, new PublicError('Lab specialization connection already exists.'));

      return await context.prisma.labSpecializationConnection.create({
        data: {
          lab_specialization_id: lab_specialization_id,
          vendor_company_id: vendor_company_id,
        }
      });
    },
    deleteLabSpecializationConnection: async (parent, args, context) => {
      const { id } = args;

      const existingLabSpecializationConnection = await context.prisma.labSpecializationConnection.findFirst({
        where: {
          id,
        }
      });

      invariant(existingLabSpecializationConnection, new PublicError('Lab specialization connection not found.'));

      return await context.prisma.labSpecializationConnection.delete({
        where: {
          id: existingLabSpecializationConnection.id,
        }
      });
    },
  },
};

export default resolvers;
