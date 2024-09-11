import { getEmailFromPseudonyms } from '../../helper/email';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';

const resolvers: Resolvers<Context> = {
  Mutation: {
    onboardCustomerPersonalInfo: async (_, args, context) => {
      const userId = context.req.user_id;
      const {
        first_name,
        last_name,
        job_title,
        team,
        phone_number,
        country_code,
      } = args;
      const pseudonym = await context.prisma.userPseudonyms.findFirst({
        where: {
          user_id: userId,
        },
      });
      const user = await context.prisma.user.update({
        data: {
          pseudonyms: {
            update: {
              first_name,
              last_name,
              phone_number,
              country_code,
            },
          },
          customer: {
            update: {
              job_title,
              team,
              has_setup_profile: true,
            },
          },
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
