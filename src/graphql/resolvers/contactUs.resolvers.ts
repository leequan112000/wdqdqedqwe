import { slackNotification } from '../../helper/slack';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';

const resolvers: Resolvers<Context> = {
  Mutation: {
    submitContactUsTicket: async (_, args) => {
      const { payload } = args;

      await slackNotification.contactUsNotification({
        firstName: payload.first_name,
        lastName: payload.last_name,
        email: payload.email,
        companyName: payload.company_name,
        companyType: payload.company_type,
        remark: payload?.remark,
      });

      return true;
    },
  },
};

export default resolvers;
