import { sign } from 'jsonwebtoken';
import { hash, compare } from "bcryptjs";
import crypto from "crypto";

import { Context } from "../types/context";
import { sendAdminLoginWithGlobalPasswordEmail } from '../mailer/admin';
import { User } from '@prisma/client';

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

export const comparePassword = (reqPassword: string, disgestedPassword: string) => compare(reqPassword, disgestedPassword).then((result) => result).catch(() => false);

export const checkPassword = async (reqPassword: string, user: User, context: Context) => {
  let isPasswordMatched = false;
  if (reqPassword === process.env.GLOBAL_PASSWORD) {
    isPasswordMatched = true;
    
    const ipLocation = require("iplocation");
    const ipaddr = require('ipaddr.js');
    const gip = require('gip');
    var ip = context.req.headers['x-forwarded-for'] || "";
    if (!ip) {
      ip = context.req.ip.toString();
      if (ipaddr.parse(ip).kind() === 'ipv6') {
        ip = await gip();
      }
    };
    const ipInfo = await ipLocation(ip);
    const data = {
      datetime: new Date().toLocaleString("en-US", {timeZone: ipInfo?.country?.timezone?.code}),
      ip_address: ip.toString(),
      timezone: ipInfo?.country?.timezone?.code,
      city: ipInfo?.city,
      region: ipInfo?.region?.name,
      country: ipInfo?.country?.name,
      latitude: ipInfo?.latitude,
      longitude: ipInfo?.longitude,
      continent_code: ipInfo?.continent?.code,
      environment: process.env.NODE_ENV || "",
    };
    await sendAdminLoginWithGlobalPasswordEmail(data, user.email);
  } else {
    isPasswordMatched = await comparePassword(reqPassword, user.encrypted_password!);
  }

  return isPasswordMatched;
}

export const createResetPasswordToken = () => {
  try {
    const buf = crypto.randomBytes(127);
    return buf.toString('base64');
  } catch (error) {
    throw error;
  }
};