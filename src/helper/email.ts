import { app_env } from "../environment";

export function createResetPasswordUrl(token: string) {
  return `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
}

export function getUserFullName(user: {
  first_name?: string | null;
  last_name?: string | null;
}) {
  const { first_name, last_name } = user;
  return `${first_name} ${last_name}`;
}
