import { createResetPasswordToken } from "../../helper/auth";
import { sendResetPasswordEmail } from "../../mailer/user";
import prisma from "../../prisma";

type ResetPasswordArgs = {
  email: string;
}

export const resetPassword = async (args: ResetPasswordArgs) => {
  const { email } = args;

  const resetTokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  const updatedUser = await prisma.user.update({
    where: {
      email,
    },
    data: {
      reset_password_token: createResetPasswordToken(),
      reset_password_expiration: new Date(resetTokenExpiration),
    },
  });

  if (updatedUser) {
    sendResetPasswordEmail(updatedUser);
  }

  return updatedUser;
}

const authService = {
  resetPassword,
};

export default authService;
