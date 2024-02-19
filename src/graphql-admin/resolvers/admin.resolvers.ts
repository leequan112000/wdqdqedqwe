import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import { PublicError } from "../../graphql/errors/PublicError";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createAdmin: async (_, args, context) => {
      const existingAdmin = await context.prisma.admin.findFirst({
        where: {
          username: args.username,
        }
      });

      invariant(!existingAdmin, new PublicError('Admin already exists'));

      const lowerCaseEmail = args.email.toLowerCase();

      return await context.prisma.admin.create({
        data: {
          username: args.username,
          email: lowerCaseEmail,
          team: args.team,
          encrypted_password: "",
        }
      });
    },
    deleteAdmin: async (_, args, context) => {
      const existingAdmin = await context.prisma.admin.findFirst({
        where: {
          id: args.id,
        }
      });

      invariant(existingAdmin, new PublicError('Admin not found.'));

      await context.prisma.admin.delete({
        where: {
          id: args.id,
        }
      });

      return true;
    }
  }
}

export default resolvers;
