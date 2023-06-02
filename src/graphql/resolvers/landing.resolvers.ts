import { Context } from "../../types/context";
import { Resolvers } from "../../generated";
import { createSendAdminCroInterestNoticeJob } from "../../queues/email.queues";
import { upsertContacts } from '../../helper/sendgrid';
import { PublicError } from "../errors/PublicError";

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
        createSendAdminCroInterestNoticeJob({ companyName: company_name });
        return true;
      }

      return false;
    },
    subscribeEmailUpdates: async (parent, args, context) => {
      const { email } = args;

      const [response, body] = await upsertContacts([email]);

      const { statusCode } = response;

      if (statusCode === 202) {
        return true;
      }

      throw new PublicError('Something went wrong');
    },
  },
};

export default resolvers;
