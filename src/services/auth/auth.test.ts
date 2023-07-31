import { expect, test, vi, MockedFunction } from 'vitest'
import { User } from '@prisma/client';
import authService from './auth.service';
import { sendResetPasswordEmail } from "../../mailer/user";
import prisma from '../../__mocks__/prisma'

vi.mock('../../mailer/user', () => ({
  sendResetPasswordEmail: vi.fn(),
}));

vi.mock('@sendgrid/mail');

vi.mock('../../prisma');

test('forgotPassword should return prisma user object', async () => {
  vi.mocked(sendResetPasswordEmail).mockImplementation(() => true);

  const user: User = {
    id: 'uuid-1',
    email: 'test@cro-matic.com',
    first_name: 'First name',
    last_name: 'Last name',
    created_at: new Date(),
    updated_at: new Date(),
    encrypted_password: null,
    remember_created_at: null,
    reset_password_expiration: null,
    reset_password_sent_at: null,
    reset_password_token: null,
  }

  prisma.user.update.mockResolvedValue(user);

  const updatedUser = await authService.forgotPassword({ email: user.email })

  expect(updatedUser).equal(user);
  expect(sendResetPasswordEmail).toHaveBeenCalled();
});
