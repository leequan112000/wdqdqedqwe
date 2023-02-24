import { Biotech, Customer, ProjectRequest, User } from "@prisma/client";
import { Request } from "express";
import { Context } from "../../context";
import { createResetPasswordToken } from "../../helper/auth";
import { sendCustomerInvitationEmail } from "../../mailer/customer";
import { PublicError } from "../errors/PublicError";
import { MutationCreateCustomerArgs, MutationInviteCustomerArgs, MutationUpdateCustomerArgs } from "../generated";

export default {
  Customer: {
    user: async (parent: Customer, _: void, context: Context): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      });
    },
    biotech: async (parent: Customer, _: void, context: Context): Promise<Biotech | null> => {
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id
        }
      });
    },
    project_requests: async (parent: Customer, _: void, context: Context): Promise<ProjectRequest[] | null> => {
      return await context.prisma.projectRequest.findMany({
        where: {
          customer_id: parent.id
        }
      })
    },
  },
  Query: {
    customer: async (_: void, args: void, context: Context & { req: Request }) => {
      return await context.prisma.customer.findFirst({
        where: {
          id: context.req.user_id
        }
      });
    }
  },
  Mutation: {
    createCustomer: async (_: void, args: MutationCreateCustomerArgs, context: Context) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const customer = await trx.customer.findFirst({
            where: {
              user_id: args.user_id
            }
          });

          if (customer) {
            throw new PublicError('Customer already exist!');
          }

          const biotech = await trx.biotech.findFirst({
            where: {
              name: {
                equals: args.company_name,
                mode: 'insensitive',
              }
            }
          });
  
          if (biotech) {
            throw new PublicError('Your company has already setup an account. Please ask any user from your account to invite you to the company account.');
          }
          
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
      } catch (error) {
        return error;
      }
    },
    updateCustomer: async (_: void, args: MutationUpdateCustomerArgs, context: Context & { req: Request }) => {
      try {
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
      } catch (error) {
        return error;
      }
    },
    inviteCustomer: async (_: void, args: MutationInviteCustomerArgs, context: Context & { req: Request }) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirst({
            where: {
              email: args.email
            }
          });

          if (user) {
            throw new PublicError('User already exist!');
          }

          const currentUser = await trx.user.findFirstOrThrow({
            where: {
              id: context.req.user_id
            },
            include: {
              customer: true
            }
          });

          const resetTokenExpiration = new Date().getTime() + 60 * 60 * 1000;
          const newUser = await trx.user.create({
            data: {
              ...args,
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
      } catch (error) {
        return error;
      }
    }
  }
};
