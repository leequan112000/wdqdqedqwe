import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Mutation: {
    createBiotechInviteVendor: async (_, args, context) => {
      const { company_name, website, email, first_name, last_name } = args;

      const user = await context.prisma.user.findFirstOrThrow({
        where: {
          id: context.req.user_id
        },
        include: {
          customer: {
            include: {
              biotech: true
            }
          }
        }
      });

      const newBiotechInviteVendor = await context.prisma.biotechInviteVendor.create({
        data: {
          company_name: company_name,
          website: website,
          email: email,
          first_name: first_name,
          last_name: last_name,
          biotech_id: user.customer?.biotech_id!,
          inviter_id: user.id,
        }
      });

      // TODO: Send email to admin

      return newBiotechInviteVendor;
    },
  },
}

export default resolvers;
