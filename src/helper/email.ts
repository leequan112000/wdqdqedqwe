import { User } from '@prisma/client';
import { app_env } from '../environment';
import { decrypt } from './gdprHelper';

export function createResetPasswordUrl(token: string) {
  return `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
}

export function getUserFullName({ first_name, last_name }: User) {
  return `${decrypt(first_name)} ${decrypt(last_name)}`;
}

export function getUserEmail({ email }: User) {
  return decrypt(email);
}
