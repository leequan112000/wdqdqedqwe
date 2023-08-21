import { Context } from "../../types/context";
import { createResetPasswordToken } from "../../helper/auth";
import { sendCustomerInvitationEmail } from "../../mailer/customer";
import { PublicError } from "../errors/PublicError";
import { Resolvers } from "../../generated";
import invariant from "../../helper/invariant";

const resolvers: Resolvers<Context> = {
  Customer: {
    user: async (parent, _, context) => {
      invariant(parent.user_id, 'Missing user id.');
      const user = await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      });

      invariant(user, new PublicError('User not found.'));

      return user;
    },
    biotech: async (parent, _, context) => {
      invariant(parent.biotech_id, 'Missing biotech id.');
      const biotech = await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id
        }
      });

      invariant(biotech, new PublicError('Biotech not found.'));

      return biotech;
    },
    project_requests: async (parent, _, context) => {
      invariant(parent.id, new PublicError('Missing customer id.'));
      const projectRequests = await context.prisma.projectRequest.findMany({
        where: {
          customer_id: parent.id
        }
      });

      const processedResult = projectRequests.map((projectRequest) => ({
        ...projectRequest,
        max_budget: projectRequest.max_budget?.toNumber() || 0,
      }))

      return processedResult;
    },
    customer_connections: async (parent, _, context) => {
      invariant(parent.id, 'Missing customer id.');
      const connections = await context.prisma.customerConnection.findMany({
        where: {
          customer_id: parent.id
        }
      });

      return connections;
    },
  },
  Query: {
    customer: async (_, args, context) => {
      const customer = await context.prisma.customer.findFirst({
        where: {
          id: context.req.user_id
        }
      });

      invariant(customer, new PublicError('Customer not found.'));
      return customer;
    }
  },
  Mutation: {
    createCustomer: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const customer = await trx.customer.findFirst({
          where: {
            user_id: args.user_id
          }
        });

        invariant(!customer, new PublicError('Customer already exist!'));

        const biotech = await trx.biotech.findFirst({
          where: {
            name: {
              equals: args.company_name,
              mode: 'insensitive',
            }
          }
        });

        invariant(!biotech, new PublicError('Your company has already setup an account. Please ask any user from your account to invite you to the company account.'));

        const newBiotech = await trx.biotech.create({
          data: {
            name: args.company_name,
          }
        });

        return await trx.customer.create({
          data: {
            team: args.team,
            job_title: args.job_title,
            user_id: args.user_id,
            biotech_id: newBiotech.id,
          }
        });
      });
    },
    updateCustomer: async (_, args, context) => {
      return await context.prisma.customer.update({
        where: {
          user_id: context.req.user_id
        },
        data: {
          job_title: args.job_title,
          team: args.team,
          ...(args.has_setup_profile !== null ? { has_setup_profile: args.has_setup_profile } : {})
        }
      });
    },
    inviteCustomer: async (_, args, context) => {
      return await context.prisma.$transaction(async (trx) => {
        const user = await trx.user.findFirst({
          where: {
            email: args.email
          }
        });

        invariant(!user, new PublicError('User already exists!'));

        const currentUser = await trx.user.findFirstOrThrow({
          where: {
            id: context.req.user_id
          },
          include: {
            customer: true
          }
        });

        const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        const newUser = await trx.user.create({
          data: {
            first_name: args.first_name,
            last_name: args.last_name,
            email: args.email,
            reset_password_token: createResetPasswordToken(),
            reset_password_expiration: new Date(resetTokenExpiration),
          }
        });

        const newCustomer = await trx.customer.create({
          data: {
            user_id: newUser.id,
            biotech_id: currentUser.customer?.biotech_id!,
          }
        });

        sendCustomerInvitationEmail(currentUser, newUser, args.custom_message || "");

        return newCustomer;
      });
    }
  }
};

export default resolvers;
