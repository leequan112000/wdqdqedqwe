import { Context } from "../../types/context";
import { Resolvers } from "../generated";

const resolvers: Resolvers<Context> = {
  Mutation: {
    onboardCustomerPersonalInfo: async (_, args, context) => {
      const userId = context.req.user_id;
      const { first_name, last_name, job_title, team, phone_number } = args;

      const user = await context.prisma.user.update({
        data: {
          first_name,
          last_name,
          phone_number,
          customer: {
            update: {
              job_title,
              team,
              has_setup_profile: true,
            }
          }
        },
        where: {
          id: userId,
        },
        include: {
          customer: true,
        },
      });

      return user.customer;
    },
  },
};

export default resolvers;
