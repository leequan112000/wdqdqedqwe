import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import crypto from 'crypto';
import { User } from '@prisma/client';
import ipaddr from 'ipaddr.js';
import { getIpGeoInfo } from './ip';

type JwtTokens = {
  accessToken: string;
  refreshToken: string;
};

interface CreateTokenParams {
  id: string;
}

export const createTokens = (params: CreateTokenParams): JwtTokens => {
  const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
  const accessToken = sign(
    { user_id: params.id },
    ACCESS_TOKEN_SECRET || 'secret',
    { expiresIn: '14d' },
  );
  const refreshToken = sign(
    { user_id: params.id },
    REFRESH_TOKEN_SECRET || 'secret',
    { expiresIn: '100y' },
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve, reject) =>
    hash(password, 10, (error, hash) =>
      error ? reject(error) : resolve(hash),
    ),
  );

export const comparePassword = (
  reqPassword: string,
  disgestedPassword: string,
) =>
  compare(reqPassword, disgestedPassword)
    .then((result) => result)
    .catch(() => false);

export const getUserIpInfo = async (ip: string | undefined | null) => {
  let result = {
    time: new Date().toISOString(),
    environment: process.env.APP_ENV || '',
    ip_address: 'UNKNOWN',
    timezone: 'UNKNOWN',
    city: 'UNKNOWN',
    region: 'UNKNOWN',
    country_name: 'UNKNOWN',
    latitude: 'UNKNOWN',
    longitude: 'UNKNOWN',
    continent_code: 'UNKNOWN',
  };

  if (!ip) {
    return result;
  }

  const parsedIp = ipaddr.parse(ip);

  if (parsedIp.kind() === 'ipv4') {
    const ipInfo = await getIpGeoInfo(ip);
    result = {
      ...result,
      ip_address: ip,
      timezone: ipInfo?.timezone || 'UNKNOWN',
      city: ipInfo?.city || 'UNKNOWN',
      region: ipInfo?.region || 'UNKNOWN',
      country_name: ipInfo?.country_name || 'UNKNOWN',
      latitude: ipInfo?.latitude?.toString() || 'UNKNOWN',
      longitude: ipInfo?.longitude?.toString() || 'UNKNOWN',
      continent_code: ipInfo?.continent_code || 'UNKNOWN',
    };
  }

  return result;
};

export const checkGlobalPassword = (reqPassword: string) => {
  return reqPassword === process.env.GLOBAL_PASSWORD;
};

export const checkPassword = async (reqPassword: string, user: User) => {
  return await comparePassword(reqPassword, user.encrypted_password!);
};

export const createResetPasswordToken = () => {
  try {
    const buf = crypto.randomBytes(127);
    return buf.toString('base64');
  } catch (error) {
    throw error;
  }
};
