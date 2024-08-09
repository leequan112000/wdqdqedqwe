import { PublicError } from '../../graphql/errors/PublicError';
import { createResetPasswordToken } from '../../helper/auth';
import { createResetPasswordUrl } from '../../helper/email';
import invariant from '../../helper/invariant';
import { sendVendorSignUpLink } from '../../mailer/vendor';
import { Context } from '../../types/context';
import { Resolvers } from '../generated';

const resolvers: Resolvers<Context> = {
  Mutation: {
    createVendor: async (_, args, context) => {
      const { email: emailArgs, company_name } = args;
      const email = emailArgs.toLowerCase();

      const user = await context.prisma.user.findUnique({
        where: {
          email,
        },
      });

      invariant(user === null, new PublicError('Email already exists.'));

      const vendor = await context.prisma.vendor.create({
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
      return vendor;
    },
    updateVendor: async (_, args, context) => {
      const { id, company_name, email } = args;
      const vendor = await context.prisma.vendor.update({
        data: {
          company_name: company_name || undefined,
          email: email || undefined,
        },
        where: {
          id,
        },
      });
      return vendor;
    },
    sendVendorSignUpLink: async (_, args, context) => {
      const { id } = args;
      const vendor = await context.prisma.vendor.findUnique({
        where: {
          id,
        },
      });

      invariant(vendor, 'Vendor not found.');

      const resetTokenExpiration =
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const resetToken = createResetPasswordToken();

      await context.prisma.vendor.update({
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

      await sendVendorSignUpLink(
        {
          button_url: resetPasswordUrl,
          company_name: vendor.company_name!,
        },
        vendor.email!,
      );

      return true;
    },
  },
};

export default resolvers;
