import { PrismaClient } from "@prisma/client";
import { Context } from "apollo-server-core";
import { PublicError } from "../errors/PublicError";
import { hash } from "bcryptjs";
import { createTokens } from "../../helper/auth";
import { ACCESS_TOKEN_MAX_AGE } from "../../helper/constant";
import { REFRESH_TOKEN_MAX_AGE } from "../../helper/constant";

const isUnitTest = process.env.NODE_ENV === 'test';

const hashPassword = (password: string): Promise<string> => new Promise((resolve, reject) => hash(password, 10, (error, hash) => (error ? reject(error) : resolve(hash))));

const setAuthTokensToCookies = (accessToken: string, refreshToken: string, res: any) => {
  if (isUnitTest) {
    return; // Skip setting cookies in unit test
  }
  res.cookie('access-token', accessToken, { maxAge: ACCESS_TOKEN_MAX_AGE, sameSite: 'none', secure: true });
  res.cookie('refresh-token', refreshToken, { maxAge: REFRESH_TOKEN_MAX_AGE, sameSite: 'none', secure: true });
};

export default {
  Mutation: {
    signUpUser: async (_: void, args: { email: string, first_name: string, last_name: string, password: string }, context: Context<{prisma: PrismaClient, res: any}>) => {
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
    
          const hashedPassword = await hashPassword(args.password);
          
          const newCreatedUser = await trx.user.create({
            data: {
              email: args.email,
              first_name: args.first_name,
              last_name: args.last_name,
              encrypted_password: hashedPassword,
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
  },
};
