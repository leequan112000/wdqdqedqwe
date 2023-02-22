import { Customer, PrismaClient, User } from "@prisma/client";
import { Context } from "apollo-server-core";
import { PublicError } from "../errors/PublicError";
import { checkPassword, createTokens, hashPassword, createResetPasswordToken } from "../../helper/auth";
import { ACCESS_TOKEN_MAX_AGE } from "../../helper/constant";
import { REFRESH_TOKEN_MAX_AGE } from "../../helper/constant";
import { verify } from "jsonwebtoken";
import { Request } from "express";
import { sendResetPasswordEmail } from "../../mailer/user";
import { MutationSignUpUserArgs } from "../generated";

const isUnitTest = process.env.NODE_ENV === 'test';

const setAuthTokensToCookies = (accessToken: string, refreshToken: string, res: any) => {
  if (isUnitTest) {
    return; // Skip setting cookies in unit test
  }
  res.cookie('access-token', accessToken, { maxAge: ACCESS_TOKEN_MAX_AGE, sameSite: 'none', secure: true });
  res.cookie('refresh-token', refreshToken, { maxAge: REFRESH_TOKEN_MAX_AGE, sameSite: 'none', secure: true });
};

export default {
  User: {
    customer: async (parent: User, _: void, context: Context<{ prisma: PrismaClient }>): Promise<Customer | null> => {
      return await context.prisma.customer.findFirst({
        where: {
          user_id: parent.id
        }
      })
    },
  },
  Query: {
    user: async (_: void, args: { id: string }, context: Context<{prisma: PrismaClient, res: any}>) => {
      return await context.prisma.user.findFirst({
        where: {
          id: args.id
        }
      });
    }
  },
  Mutation: {
    signUpUser: async (_: void, args: MutationSignUpUserArgs, context: Context<{prisma: PrismaClient, res: any}>) => {
      try {
        return await context.prisma.$transaction(async (trx) => {
          const user = await trx.user.findFirst({
            where: {
              email: args.email,
            },
          })
    
          if (user) {
            throw new PublicError('User already exist');
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
    
          const hashedPassword = await hashPassword(args.password);
          
          const newCreatedUser = await trx.user.create({
            data: {
              email: args.email,
              first_name: args.first_name,
              last_name: args.last_name,
              encrypted_password: hashedPassword,
            }
          });

          await trx.customer.create({
            data: {
              user_id: newCreatedUser.id,
              biotech_id: newBiotech.id,
            }
          });
    
          // Genereate tokens
          const tokens = createTokens({ id: newCreatedUser.id });
          setAuthTokensToCookies(tokens.accessToken, tokens.refreshToken, context.res);
    
          return {
            ...newCreatedUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          };
        });
      } catch (error) {
        return error;
      }
    },
    signInUser: async (_: void, args: { email: string, password: string }, context: Context<{prisma: PrismaClient, res: any}>) => {
      try {
        let foundUser = await context.prisma.user.findFirst({
          where: {
            email: args.email
          }
        });

        if (!foundUser) {
          throw new PublicError('User not found.');
        }

        if (foundUser && foundUser.encrypted_password === null) {
          throw new PublicError('User password not set, please proceed to forgot password to set a new password');
        }

        const isPasswordMatched = await checkPassword(args.password, foundUser.encrypted_password!);
        if (isPasswordMatched === true) {
          // Genereate tokens
          const tokens = createTokens({ id: foundUser.id, });
          setAuthTokensToCookies(tokens.accessToken, tokens.refreshToken, context.res);
          
          return {
            ...foundUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          };
        }
        throw new PublicError('Invalid email or password.');
      } catch (error) {
        return error;
      }
    },
    refreshJWT: async (_: void, args: { email: string }, context: Context<{prisma: PrismaClient, req: any}>) => {
      // Get refresh token from header
      const authHeader = context.req.get('authorization');
      const tokenArray = authHeader.split(' ');
      if (tokenArray.length !== 2) {
        return null;
      }
      const refreshToken = tokenArray[1];
      const { REFRESH_TOKEN_SECRET } = process.env;
      let userId;
      // Verify the refresh token
      try {
        const data = verify(refreshToken, REFRESH_TOKEN_SECRET || "secret") as Request;
        userId = data.user_id;
        if (userId) {
          const newTokens = createTokens({ id: userId });
          const user = await context.prisma.user.findFirst({
            where: {
              id: userId
            }
          });

          return {
            ...user,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          };
        }

        // Invalid jwt token if user id not found
        throw new PublicError('Your session is expired.');
      } catch (error) {
        // If verify failed, meaning the session is no longer authenticated.
        throw new PublicError('Your session is expired.');
      }
    },
    forgotPassword: async (_: void, args: { email: string }, context: Context<{prisma: PrismaClient, req: any}>) => {
      const resetTokenExpiration = new Date().getTime() + 60 * 60 * 1000;
    
      try {
        const user = await context.prisma.user.update({
          where: {
            email: args.email,
          },
          data: {
            reset_password_token: createResetPasswordToken(),
            reset_password_expiration: new Date(resetTokenExpiration),
          },
        });
    
        if (!user) {
          return false;
        } 
        sendResetPasswordEmail(user);
        return true;
      } catch (error) {
        return error;
      }
    },
    resetPassword: async (_: void, args: { reset_token: string, new_password: string }, context: Context<{prisma: PrismaClient, req: any}>) => {
      try {
        const user = await context.prisma.user.findFirst({
          where: {
            reset_password_token: args.reset_token
          }
        });

        if (!user || !user.reset_password_expiration) return false;

        const timeElapsed = user.reset_password_expiration.getTime() - new Date().getTime();

        if (timeElapsed <= 60 * 60 * 1000 && timeElapsed >= 0) {
          await context.prisma.user.update({
            where: {
              reset_password_token: args.reset_token
            },
            data: {
              encrypted_password: await hashPassword(args.new_password),
              reset_password_token: null,
              reset_password_expiration: null,
            },
          });
          return true;
        }
        return false;
      } catch (error) {
        return error;
      }
    },
  },
};
