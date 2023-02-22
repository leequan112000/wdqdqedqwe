import { sign } from 'jsonwebtoken';

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