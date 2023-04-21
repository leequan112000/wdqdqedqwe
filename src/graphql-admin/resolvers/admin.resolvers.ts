import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { PublicError } from "../../graphql/errors/PublicError";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createAdmin: async (_, args, context) => {
      const existingAdmin = await context.prisma.admin.findFirst({
        where: {
          username: args.username,
        }
      });

      if (existingAdmin) {
        throw new PublicError('Admin already exists');
      }

      await context.prisma.admin.create({
        data: {
          username: args.username,
          email: args.email,
          team: args.team,
          encrypted_password: "",
        }
      });

      return true;
    },
    deleteAdmin: async (_, args, context) => {
      const existingAdmin = await context.prisma.admin.findFirst({
        where: {
          id: args.id,
        }
      });

      if (!existingAdmin) {
        throw new PublicError('Admin not found');
      }

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
