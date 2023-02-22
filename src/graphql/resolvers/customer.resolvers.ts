import { Biotech, Customer, PrismaClient, User } from "@prisma/client";
import { Context } from "apollo-server-core";
import { PublicError } from "../errors/PublicError";
import { MutationCreateCustomerArgs, MutationUpdateCustomerArgs } from "../generated";

export default {
  Customer: {
    user: async (parent: Customer, _: void, context: Context<{ prisma: PrismaClient }>): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      });
    },
    biotech: async (parent: Customer, _: void, context: Context<{ prisma: PrismaClient }>): Promise<Biotech | null> => {
      return await context.prisma.biotech.findFirst({
        where: {
          id: parent.biotech_id
        }
      });
    },
  },
  Query: {
    customer: async (_: void, args: { id: string }, context: Context<{prisma: PrismaClient, res: any}>) => {
      return await context.prisma.customer.findFirst({
        where: {
          id: args.id
        }
      });
    }
  },
  Mutation: {
    createCustomer: async (_: void, args: MutationCreateCustomerArgs, context: Context<{prisma: PrismaClient, res: any}>) => {
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
              name: args.company_name
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
    updateCustomer: async (_: void, args: MutationUpdateCustomerArgs, context: Context<{prisma: PrismaClient, res: any}>) => {
      try {
        return await context.prisma.customer.update({
          where: {
            user_id: args.user_id
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
    }
  }
};
