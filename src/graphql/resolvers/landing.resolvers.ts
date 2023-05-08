import { Context } from "../../types/context";
import { Resolvers } from "../../generated";

const resolvers: Resolvers<Context> = {
  Mutation: {
    submitCroInterest: async (parent, args, context) => {
      const {
        company_name, company_type, email, interest, service
      } = args

      const newInterestedCro = await context.prisma.interestedCro.create({
        data: {
          company_name,
          company_type,
          email,
          interest,
          service,
        },
      });

      // TODO: send email

      if (newInterestedCro) {
        return true;
      }

      return false;
    }
  }
}

export default resolvers;
