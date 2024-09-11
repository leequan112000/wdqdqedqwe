import { app_env } from '../../environment';
import { createResetPasswordToken } from '../../helper/auth';
import {
  getEmailFromPseudonyms,
  getUserFullNameFromPseudonyms,
} from '../../helper/email';
import { encrypt } from '../../helper/gdprHelper';
import { sendResetPasswordEmail } from '../../mailer/user';
import { ServiceContext } from '../../types/context';

type ResetPasswordArgs = {
  email: string;
};

export const forgotPassword = async (
  args: ResetPasswordArgs,
  context: ServiceContext,
) => {
  const { email } = args;

  const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  const user = await context.prisma.user.findFirst({
    where: {
      pseudonyms: {
        email: encrypt(email),
      },
    },
  });
  const updatedUser = await context.prisma.user.update({
    where: {
      id: user!.id,
    },
    data: {
      reset_password_token: createResetPasswordToken(),
      reset_password_expiration: new Date(resetTokenExpiration),
    },
    include: {
      pseudonyms: true,
    },
  });

  if (updatedUser) {
    const resetPasswordUrl = `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(updatedUser.reset_password_token!)}`;
    sendResetPasswordEmail(
      {
        button_url: resetPasswordUrl,
        receiver_full_name: getUserFullNameFromPseudonyms(
          updatedUser.pseudonyms!,
        ),
        reset_password_url: resetPasswordUrl,
      },
      getEmailFromPseudonyms(updatedUser.pseudonyms!),
    );
  }

  return updatedUser;
};

const authService = {
  forgotPassword,
};

export default authService;
