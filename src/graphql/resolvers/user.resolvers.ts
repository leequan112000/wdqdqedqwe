import { PrismaClient } from "@prisma/client";
import { Context } from "apollo-server-core";
import { PublicError } from "../errors/PublicError";
import { hash, compare } from "bcryptjs";
import { createTokens } from "../../helper/auth";
import { ACCESS_TOKEN_MAX_AGE } from "../../helper/constant";
import { REFRESH_TOKEN_MAX_AGE } from "../../helper/constant";
import { verify } from "jsonwebtoken";
import { Request } from "express";

const isUnitTest = process.env.NODE_ENV === 'test';

const hashPassword = (password: string): Promise<string> => new Promise((resolve, reject) => hash(password, 10, (error, hash) => (error ? reject(error) : resolve(hash))));

const checkPassword = (reqPassword: string, disgestedPassword: string) => compare(reqPassword, disgestedPassword).then((result) => result).catch(() => false);

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

        const isPasswordMatched = await checkPassword(args.password, foundUser.encrypted_password);
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
        userId = data.userId;
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
  },
};
