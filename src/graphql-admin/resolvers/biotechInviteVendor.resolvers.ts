import { Resolvers } from "../../generated";
import { Context } from "../../types/context";
import { PublicError } from "../../graphql/errors/PublicError";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Mutation: {
    updateBiotechInviteVendor: async (_, args, context) => {
      const biotechInviteVendor = await context.prisma.biotechInviteVendor.findFirst({
        where: {
          id: args.id,
        },
      });
      invariant(biotechInviteVendor, new PublicError ('Biotech invite vendor not found.'));

      const updatedBiotechInviteVendor = await context.prisma.biotechInviteVendor.update({
        where: {
          id: biotechInviteVendor.id,
        },
        data: {
          company_name: args.company_name,
          website: args.website,
          first_name: args.first_name,
          last_name: args.last_name,
          email: args.email,
        },
      });

      return updatedBiotechInviteVendor;
    },
  }
};

export default resolvers;
