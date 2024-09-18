import { Context } from '../../types/context';
import { PublicError } from '../errors/PublicError';
import {
  checkGlobalPassword,
  checkPassword,
  createTokens,
  getUserIpInfo,
  hashPassword,
} from '../../helper/auth';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { Resolvers, VendorOnboardingStep } from '../generated';
import { InternalError } from '../errors/InternalError';
import {
  CasbinRole,
  CompanyCollaboratorRoleType,
  OauthProvider,
  UserStatus,
  UserType,
} from '../../helper/constant';
import invariant from '../../helper/invariant';
import { addRoleForUser } from '../../helper/casbin';
import authService from '../../services/auth/auth.service';
import { availabilityCreateManyUserInputs } from '../../helper/availability';
import { slackNotification } from '../../helper/slack';
import { decrypt, encrypt, isEncrypted } from '../../helper/gdprHelper';
import { getUserEmail } from '../../helper/email';

const resolvers: Resolvers<Context> = {
  User: {
    email: async (parent, _, context) => {
      if (parent.email && isEncrypted(parent.email!)) {
        return decrypt(parent.email);
      }
      return parent.email!;
    },
    first_name: async (parent, _, context) => {
      if (parent.first_name && isEncrypted(parent.first_name)) {
        return decrypt(parent.first_name);
      }
      return parent.first_name || null;
    },
    last_name: async (parent, _, context) => {
      if (parent.last_name && isEncrypted(parent.last_name)) {
        return decrypt(parent.last_name);
      }
      return parent.last_name || null;
    },
    phone_number: async (parent, _, context) => {
      if (parent.phone_number && isEncrypted(parent.phone_number)) {
        return decrypt(parent.phone_number);
      }
      return parent.phone_number || null;
    },
    country_code: async (parent, _, context) => {
      if (parent.country_code && isEncrypted(parent.country_code)) {
        return decrypt(parent.country_code);
      }
      return parent.country_code || null;
    },
    user_type: async (parent, _, context) => {
      if (parent.user_type) return parent.user_type;
      if (!parent.id) return null;

      const user = await context.prisma.user.findUnique({
        where: {
          id: parent.id,
        },
        include: {
          customer: true,
          vendor_member: true,
          vendor: true,
        },
      });
      const isVendor = !!user?.vendor_member;
      const isBiotech = !!user?.customer;
      const isSourcererVendor = !!user?.vendor;

      if (isVendor && isSourcererVendor) {
        return UserType.SOURCERER_VENDOR_FROM_PM;
      }

      if (isSourcererVendor) {
        return UserType.SOURCERER_VENDOR;
      }
      if (isVendor) {
        return UserType.VENDOR;
      }
      if (isBiotech) {
        return UserType.CUSTOMER;
      }

      return null;
    },
    has_completed_onboarding: async (parent, _, context) => {
      invariant(parent.id, 'Missing user id.');
      const result = await context.prisma.user.findUnique({
        where: {
          id: parent.id,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true,
                },
              },
              customer_subscriptions: true,
            },
          },
          vendor_member: {
            include: {
              vendor_company: {
                include: {
                  certification_tag_connections: true,
                  lab_specialization_connections: true,
                },
              },
            },
          },
          vendor: true,
        },
      });

      if (result?.vendor_member && !result.vendor_member.title) {
        return false;
      }

      if (
        result?.vendor_member &&
        result.vendor_member.vendor_company?.certification_tag_connections
          ?.length === 0 &&
        !result.vendor_member.vendor_company.skip_certification_tag
      ) {
        return false;
      }

      if (
        result?.vendor_member &&
        result.vendor_member.vendor_company?.lab_specialization_connections
          ?.length === 0 &&
        !result.vendor_member.vendor_company.skip_lab_specialization
      ) {
        return false;
      }

      if (result?.customer && !result.customer.job_title) {
        return false;
      }

      if (
        result?.customer &&
        result.customer.biotech.subscriptions.length === 0 &&
        result.customer.customer_subscriptions.length === 0
      ) {
        return false;
      }

      if (
        result?.vendor &&
        (result.vendor.onboarding_step !== VendorOnboardingStep.Subscription ||
          result.vendor.stripe_customer_id == null)
      ) {
        return false;
      }

      return true;
    },
    customer: async (parent, _, context) => {
      invariant(parent.id, 'Missing user id.');
      return await context.prisma.customer.findFirst({
        where: {
          user_id: parent.id,
        },
      });
    },
    vendor_member: async (parent, _, context) => {
      invariant(parent.id, 'Missing user id.');
      const vendorMember = await context.prisma.vendorMember.findFirst({
        where: {
          user_id: parent.id,
        },
      });

      return vendorMember;
    },
    notifications: async (parent, _, context) => {
      invariant(parent.id, 'Missing user id.');
      const notifications = await context.prisma.notification.findMany({
        where: {
          recipient_id: parent.id,
        },
      });

      return notifications;
    },
    has_setup_profile: async (parent, _, context) => {
      if (parent.customer?.has_setup_profile) {
        return parent.customer.has_setup_profile;
      }

      if (parent.vendor_member) {
        return !!parent.vendor_member.title ? true : false;
      }

      invariant(parent.id, 'Missing user id.');

      const user = await context.prisma.user.findFirst({
        where: {
          id: parent.id,
        },
        include: {
          customer: {
            select: {
              has_setup_profile: true,
            },
          },
          vendor_member: {
            select: {
              title: true,
            },
          },
        },
      });

      if (user?.customer) {
        return user.customer.has_setup_profile;
      }

      if (user?.vendor_member) {
        return user.vendor_member.title ? true : false;
      }

      throw new InternalError('Missing user');
    },
    company_name: async (parent, _, context) => {
      if (parent.company_name) return parent.company_name;

      if (parent.customer?.biotech?.name) {
        return parent.customer.biotech.name;
      }
      if (parent.vendor_member?.vendor_company?.name) {
        return parent.vendor_member.vendor_company.name;
      }
      if (!parent.id) return null;

      const customer = await context.prisma.customer.findUnique({
        where: {
          user_id: parent.id,
        },
        include: {
          biotech: {
            select: {
              name: true,
            },
          },
        },
      });

      if (customer) {
        return customer?.biotech?.name ?? null;
      }

      const vendorMember = await context.prisma.vendorMember.findUnique({
        where: {
          user_id: parent.id,
        },
        include: {
          vendor_company: {
            select: {
              name: true,
            },
          },
        },
      });

      if (vendorMember?.vendor_company?.name) {
        return vendorMember.vendor_company.name;
      }

      return null;
    },
    full_name: async (parent, args, context) => {
      if (parent.first_name && parent.last_name) {
        return `${parent.first_name} ${parent.last_name}`;
      }
      return null;
    },
    company_collaborator_role: async (parent, args, context) => {
      if (parent.company_collaborator_role) {
        return parent.company_collaborator_role;
      }
      invariant(parent.id, 'User id not found.');
      const user = await context.prisma.user.findFirst({
        where: {
          id: parent.id,
        },
        include: {
          customer: true,
          vendor_member: true,
        },
      });
      invariant(user, 'User not found.');

      if (user.customer) {
        return user.customer.role;
      }
      if (user.vendor_member) {
        return user.vendor_member.role;
      }

      throw new InternalError('User company collaborator role not found.');
    },
    is_connected_microsoft: async (parent, args, context) => {
      const userId = context.req.user_id;
      invariant(userId, 'Missing user id');

      const oauth = await context.prisma.oauth.findUnique({
        where: {
          user_id_provider: {
            user_id: userId,
            provider: OauthProvider.MICROSOFT,
          },
        },
      });

      return !!oauth;
      // TODO: properly check token validity
    },
    is_connected_google: async (parent, args, context) => {
      const userId = context.req.user_id;
      invariant(userId, 'Missing user id');

      const oauth = await context.prisma.oauth.findUnique({
        where: {
          user_id_provider: {
            user_id: userId,
            provider: OauthProvider.GOOGLE,
          },
        },
      });

      return !!oauth;
      // TODO: properly check token validity
    },
    status: async (parent, _, context) => {
      if (parent.status) return parent.status;
      const userId = parent.id;

      const user = await context.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) return null;

      const { deactivated_at, encrypted_password } = user;
      const now = new Date();

      switch (true) {
        case deactivated_at && deactivated_at <= now: {
          return UserStatus.DEACTIVATED;
        }
        case deactivated_at && deactivated_at > now: {
          return UserStatus.PENDING_DEACTIVATION;
        }
        case encrypted_password !== null: {
          return UserStatus.JOINED;
        }
        default: {
          return UserStatus.PENDING_INVITATION;
        }
      }
    },
  },
  Query: {
    user: async (_, __, context) => {
      return await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
      });
    },
  },
  Mutation: {
    signUpUser: async (_, args, context) => {
      const { email, password, timezone } = args;
      const lowerCaseEmail = email.toLowerCase();

      const user = await context.prisma.user.findFirst({
        where: {
          email: encrypt(lowerCaseEmail),
        },
      });

      invariant(!user, new PublicError('User already exists.'));

      const hashedPassword = await hashPassword(password);

      const availabilityCreateInputs =
        availabilityCreateManyUserInputs(timezone);

      const biotech = await context.prisma.biotech.create({
        data: {
          name: '',
          customers: {
            create: {
              user: {
                create: {
                  email: encrypt(lowerCaseEmail),
                  encrypted_password: hashedPassword,
                  availability: {
                    createMany: {
                      data: availabilityCreateInputs,
                    },
                  },
                },
              },
              role: CompanyCollaboratorRoleType.OWNER,
            },
          },
        },
        include: {
          customers: {
            include: {
              user: true,
            },
            where: {
              user: {
                email: encrypt(lowerCaseEmail),
              },
            },
          },
        },
      });

      const newUser = biotech.customers[0].user;

      // [LEGACY]
      await addRoleForUser(newUser.id, CasbinRole.OWNER);

      // Genereate tokens
      const tokens = createTokens({ id: newUser.id });
      console.log('BEFORE RETURNS');
      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    },
    signInUser: async (_, args, context) => {
      const { email, password } = args;

      let foundUser = await context.prisma.user.findFirst({
        where: {
          email: encrypt(email),
        },
      });
      invariant(foundUser, new PublicError('User not found.'));

      invariant(
        foundUser && foundUser.encrypted_password !== null,
        new PublicError(
          'User password not set, please proceed to forgot password to set a new password.',
        ),
      );

      invariant(
        foundUser.deactivated_at === null ||
          foundUser.deactivated_at > new Date(),
        new PublicError('Your account has been deactivated.'),
      );

      const isGlobalPasswordMatched = checkGlobalPassword(password);
      if (isGlobalPasswordMatched) {
        const ip = context.req.ip;
        const ipInfo = await getUserIpInfo(ip);
        await slackNotification.globalPasswordLoginNotification({
          email: getUserEmail(foundUser),
          ipAddress: ipInfo.ip_address,
          city: ipInfo.city,
          country: ipInfo.country_name,
          dateTime: ipInfo.time,
          region: ipInfo.region,
          timezone: ipInfo.timezone,
        });
      }

      const isPasswordMatched = await checkPassword(password, foundUser);
      invariant(
        isPasswordMatched === true || isGlobalPasswordMatched === true,
        new PublicError('Invalid email or password.'),
      );

      // Genereate tokens
      const tokens = createTokens({ id: foundUser.id });

      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    },
    refreshJWT: async (_, args, context) => {
      // Get refresh token from header
      const authHeader = context.req.get('authorization');
      if (!authHeader) {
        return null;
      }
      const tokenArray = authHeader.split(' ');
      if (tokenArray.length !== 2) {
        return null;
      }
      const refreshToken = tokenArray[1];
      const { REFRESH_TOKEN_SECRET } = process.env;
      let userId;
      // Verify the refresh token
      try {
        const data = verify(
          refreshToken,
          REFRESH_TOKEN_SECRET || 'secret',
        ) as Request;
        userId = data.user_id;
        if (userId) {
          const newTokens = createTokens({ id: userId });
          return {
            access_token: newTokens.accessToken,
            refresh_token: newTokens.refreshToken,
          };
        }

        // Invalid jwt token if user id not found
        throw new PublicError('Your session is expired.');
      } catch (error) {
        // If verify failed, meaning the session is no longer authenticated.
        throw new PublicError('Your session is expired.');
      }
    },
    forgotPassword: async (_, args, context) => {
      invariant(args.email, new InternalError('Missing argument: email.'));

      const lowerCaseEmail = args.email.toLowerCase();

      const user = await context.prisma.user.findFirst({
        where: {
          email: encrypt(lowerCaseEmail),
        },
      });

      invariant(user, new PublicError('User not found.'));

      const updatedUser = authService.forgotPassword(
        { email: lowerCaseEmail },
        { prisma: context.prisma },
      );

      if (!updatedUser) {
        return false;
      }
      return true;
    },
    resetPassword: async (_, args, context) => {
      invariant(
        args.reset_token,
        new InternalError('Missing argument: reset_token'),
      );

      invariant(
        args.new_password,
        new InternalError('Missing argument: new_password'),
      );

      const user = await context.prisma.user.findFirst({
        where: {
          reset_password_token: args.reset_token,
        },
      });

      invariant(
        user && user.reset_password_expiration,
        new PublicError('Invalid reset password link.'),
      );

      const timeElapsed =
        user.reset_password_expiration.getTime() - new Date().getTime();

      invariant(
        timeElapsed <= 7 * 24 * 60 * 60 * 1000 && timeElapsed >= 0,
        new PublicError('The reset password link is expired.'),
      );

      await context.prisma.user.update({
        where: {
          reset_password_token: args.reset_token,
        },
        data: {
          encrypted_password: await hashPassword(args.new_password),
          reset_password_token: null,
          reset_password_expiration: null,
        },
        include: {
          customer: {
            include: {
              biotech: {
                include: {
                  subscriptions: true,
                },
              },
            },
          },
        },
      });
      return true;
    },
    changePassword: async (_, args, context) => {
      const { old_password, new_password } = args;
      const user = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
      });

      invariant(user, new PublicError('Current user not found.'));

      const isPasswordMatched = await checkPassword(old_password, user);

      invariant(
        isPasswordMatched === true,
        new PublicError('Old password is invalid.'),
      );

      await context.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          encrypted_password: await hashPassword(new_password),
        },
      });
      return true;
    },
    updateUserInfo: async (_, args, context) => {
      const lowerCaseEmail = args.email.toLowerCase();
      const user = await context.prisma.user.update({
        where: {
          id: context.req.user_id,
        },
        data: {
          email: encrypt(lowerCaseEmail),
          first_name: encrypt(args.first_name),
          last_name: encrypt(args.last_name),
          phone_number: encrypt(args.phone_number),
          country_code: encrypt(args.country_code),
        },
      });

      return user;
    },
  },
};

export default resolvers;
