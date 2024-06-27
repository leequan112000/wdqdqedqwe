import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import { createSendNewBlogSubscriptionEmailJob } from '../../queues/email.queues';
import { AdminTeam } from '../../helper/constant';
import { searchContact, upsertContacts } from '../../helper/sendgrid';
import { PublicError } from '../errors/PublicError';
import { bulkCroInterestAdminNoticeEmail } from '../../mailer/admin';

const resolvers: Resolvers<Context> = {
  Mutation: {
    submitCroInterest: async (parent, args, context) => {
      const {
        company_name,
        company_type,
        email,
        interest,
        service,
        first_name,
        last_name,
        country_code,
        phone_number,
      } = args;

      const newInterestedCro = await context.prisma.interestedCro.create({
        data: {
          company_name,
          company_type,
          email,
          interest,
          service,
          first_name,
          last_name,
          phone_number: phone_number || null,
          country_code: country_code || null,
        },
      });

      if (newInterestedCro) {
        const receivers = await context.prisma.admin.findMany({
          where: {
            team: AdminTeam.SCIENCE,
          },
        });
        const emailData = receivers.map((r) => ({
          emailData: {
            retool_url: process.env.RETOOL_PROJECT_URL,
            admin_name: r.username,
            company_name: company_name,
          },
          receiverEmail: r.email,
        }));
        bulkCroInterestAdminNoticeEmail(emailData);
        return true;
      }

      return false;
    },
    subscribeEmailUpdates: async (parent, args, context) => {
      const { email } = args;

      const [searchResp] = await searchContact(email);
      // Skip if exists
      if ((searchResp.body as any).contact_count > 0) {
        return true;
      }

      const [response, body] = await upsertContacts([email]);

      const { statusCode } = response;

      if (statusCode === 202) {
        createSendNewBlogSubscriptionEmailJob({ receiverEmail: email });
        return true;
      }

      throw new PublicError('Something went wrong');
    },
  },
};

export default resolvers;
