import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { sendAdminCROInterestNoticeQueue } from "../../queues/notification.queues";

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

      if (newInterestedCro) {
        sendAdminCROInterestNoticeQueue.add({ companyName: company_name });
        return true;
      }

      return false;
    }
  }
}

export default resolvers;
