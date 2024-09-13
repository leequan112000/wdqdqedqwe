import { UserPseudonyms } from '@prisma/client';
import { app_env } from '../environment';
import { decrypt } from './gdprHelper';

export function createResetPasswordUrl(token: string) {
  return `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
}

export function getUserFullNameFromPseudonyms(pseudonyms?: UserPseudonyms) {
  if (!pseudonyms) return '';
  const { first_name, last_name } = pseudonyms;
  return `${first_name} ${last_name}`;
}

export function getEmailFromPseudonyms(pseudonyms?: UserPseudonyms) {
  if (!pseudonyms) return '';
  return pseudonyms.email;
}
