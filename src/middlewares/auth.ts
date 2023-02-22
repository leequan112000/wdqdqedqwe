import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { context } from '../context';
import { createTokens } from '../helper/auth';
import { ACCESS_TOKEN_MAX_AGE } from '../helper/constant';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = context.prisma;
  const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
  const refreshToken = req.cookies['refresh-token'];
  const accessToken = req.cookies['access-token'];

  // We expect only access_token from authorization header.
  // This header will only exist in the request from mobile.
  // If this header exist, we will verify the access token.
  // In case of refresh token found, the verification will fail and process with Unauthenticated
  const authHeader = req.get('authorization');
  const tokenArray = authHeader ? authHeader?.split(' ') : [];
  if (tokenArray.length === 2) {
    const accessTokenFromHeader = tokenArray[1];
    try {
      const data = verify(accessTokenFromHeader, ACCESS_TOKEN_SECRET || "secret") as Request;
      req.user_id = data.user_id;
      return next();
    } catch (error) {
      return next();
    }
  }

  // If refresh token and access token are not present. End middleware.
  if (!refreshToken && !accessToken) {
    return next();
  }

  try {
    // Try to verify access token.
    // If verified, save decoded user_id to the req context which will then pass to apollo context.
    // If not verified or access token undefined, this will throw error and proceed.
    const data = verify(accessToken, ACCESS_TOKEN_SECRET || "secret") as Request;
    req.user_id = data.user_id;
    return next();
  } catch {}

  // If refresh token is not present. End middleware.
  if (!refreshToken) {
    return next();
  }

  let data;

  try {
    // Verify the refresh token.
    // If verified, save the decoded data.
    // If not verified, this will throw error and end middleware.
    data = verify(refreshToken, REFRESH_TOKEN_SECRET || "secret") as Request;
  } catch {
    return next();
  }

  // Find the user using the decoded user identification.
  const user = await prisma.user.findFirst({
    where: { id: data?.user_id }
  })

  // If user doesn't exist. End middleware.
  if (!user) {
    return next();
  }

  // If user exists, refresh the access token.
  const tokens = createTokens({ id: user.id });
  res.cookie('access-token', tokens.accessToken, { maxAge: ACCESS_TOKEN_MAX_AGE, sameSite: 'none', secure: true });
  // Set user id to request so that resolver can read it and prevent unauthenticated
  req.user_id = data.user_id;

  return next();
};
