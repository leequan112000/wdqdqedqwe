import { expect, test, beforeEach, afterEach, vi } from 'vitest';
import { checkPassword, getUserIpInfo } from './auth';
import { User } from '@prisma/client';

let user: User;

beforeEach(() => {
  user = {
    id: 'uuid-1',
    email: 'test@cro-matic.com',
    first_name: 'First name',
    last_name: 'Last name',
    created_at: new Date(),
    updated_at: new Date(),
    encrypted_password:
      '$2y$10$K4oM.sJfGab6pomM6yNsZuvlappT5tlrC3Vpwuiq0FTklUhIZcitO',
    remember_created_at: null,
    reset_password_expiration: null,
    reset_password_sent_at: null,
    reset_password_token: null,
    is_active: true,
    deactivated_at: null,
    phone_number: '5555551234',
    country_code: '1',
  };

  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('checkPassword should return true if correct password', async () => {
  const result = await checkPassword('password', user);

  expect(result).toBe(true);
});

test('checkPassword should return false if incorrect password', async () => {
  const result = await checkPassword('incorrect_password', user);

  expect(result).toBe(false);
});

test('getUserIpInfo should return unknown if no ip provided', async () => {
  const date = new Date();
  vi.setSystemTime(date);
  const result = await getUserIpInfo(undefined);

  expect(result.ip_address).toBe('UNKNOWN');
  expect(result.time).toBe(date.toISOString());
});

test('getUserIpInfo should return the ip info', async () => {
  const date = new Date();
  vi.setSystemTime(date);
  const result = await getUserIpInfo('8.8.8.8');

  expect(result.ip_address).toBe('8.8.8.8');
});
