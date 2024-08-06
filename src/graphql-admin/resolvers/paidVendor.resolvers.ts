import { createResetPasswordToken } from '../../helper/auth';
import { createResetPasswordUrl } from '../../helper/email';
import invariant from '../../helper/invariant';
import { sendPaidVendorSignUpLink } from '../../mailer/paidVendor';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';

const resolvers: Resolvers<Context> = {
  Mutation: {
    createPaidVendor: async (_, args, context) => {
      const { email: emailArgs, company_name } = args;
      const email = emailArgs.toLowerCase();

      const paidVendor = await context.prisma.paidVendor.create({
        data: {
          email,
          company_name: company_name || undefined,
          user: {
            create: {
              email,
            },
          },
        },
      });

      return paidVendor;
    },
    sendPaidVendorSignUpLink: async (_, args, context) => {
      const { id } = args;
      const paidVendor = await context.prisma.paidVendor.findUnique({
        where: {
          id,
        },
      });

      invariant(paidVendor, 'Vendor not found.');

      const resetTokenExpiration =
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const resetToken = createResetPasswordToken();

      await context.prisma.paidVendor.update({
        data: {
          user: {
            update: {
              reset_password_token: resetToken,
              reset_password_expiration: new Date(resetTokenExpiration),
              reset_password_sent_at: new Date(),
            },
          },
        },
        where: {
          id,
        },
      });

      const resetPasswordUrl = createResetPasswordUrl(resetToken);
      console.log(resetPasswordUrl);

      // TODO: Send email
      await sendPaidVendorSignUpLink(
        {
          button_url: resetPasswordUrl,
          company_name: paidVendor.company_name!,
        },
        paidVendor.email!,
      );

      return true;
    },
  },
};

export default resolvers;
