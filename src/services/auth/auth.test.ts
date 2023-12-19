import { expect, test, vi, beforeEach } from 'vitest'
import { User } from '@prisma/client';
import authService from './auth.service';
import { sendResetPasswordEmail } from "../../mailer/user";
import { MockContext, createMockContext } from '../../testContext';
import { ServiceContext } from '../../types/context';

vi.mock('../../mailer/user', () => ({
  sendResetPasswordEmail: vi.fn(),
}));

vi.mock('@sendgrid/mail');

let mockCtx: MockContext
let ctx: ServiceContext

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as ServiceContext;
});

test('forgotPassword should return prisma user object', async () => {
  vi.mocked(sendResetPasswordEmail).mockResolvedValueOnce(true);

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
    is_active: true,
    phone_number: "5555551234",
    country_code: "1",
  }

  mockCtx.prisma.user.update.mockResolvedValue(user);

  const updatedUser = await authService.forgotPassword({ email: user.email }, ctx);

  expect(updatedUser).equal(user);
  expect(sendResetPasswordEmail).toHaveBeenCalled();
});
