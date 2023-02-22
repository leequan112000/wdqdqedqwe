import { sign } from 'jsonwebtoken';
import { hash, compare } from "bcryptjs";
import crypto from "crypto";

type JwtTokens = {
  accessToken: string;
  refreshToken: string;
}

interface CreateTokenParams {
  id: string;
}

export const createTokens = (params: CreateTokenParams): JwtTokens => {
  const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
  const accessToken = sign({ user_id: params.id }, ACCESS_TOKEN_SECRET || "secret", { expiresIn: '14d' });
  const refreshToken = sign({ user_id: params.id }, REFRESH_TOKEN_SECRET || "secret", { expiresIn: '100y' });

  return {
    accessToken,
    refreshToken,
  };
}

export const hashPassword = (password: string): Promise<string> => new Promise((resolve, reject) => hash(password, 10, (error, hash) => (error ? reject(error) : resolve(hash))));

export const checkPassword = (reqPassword: string, disgestedPassword: string) => compare(reqPassword, disgestedPassword).then((result) => result).catch(() => false);

export const createResetPasswordToken = () => {
  try {
    const buf = crypto.randomBytes(127);
    return buf.toString('base64');
  } catch (error) {
    throw error;
  }
};