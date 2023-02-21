import { User } from "@prisma/client";
import { mailSender, sendMail } from "./config";
import { app_env } from "../environment";

export const sendResetPasswordEmail = (user: User) => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: user.email,
    replyTo: mailSender,
    subject: 'Cromatic | Reset Cromatic Password',
    html:
      `Hi ${user.first_name},`
      + '<br />'
      + '<p>We’ve received a request to reset the password for your Cromatic account.</p>'
      + '<p>To reset, click on the link below to set a new password:</p>'
      + `<a href="${app_env.APP_URL}/reset-password?token=${user.reset_password_token}">
      ${app_env.APP_URL}/reset-password?token=${user.reset_password_token}
      </a>`
      + '<br />'
      + '<p>If you didn’t ask to change your password, don’t worry! Your password is still safe and you can delete this email.</p>'
      + `<p>If you have any questions, please contact us at
        <span>
          <a href="mailto:${mailSender}">
            ${mailSender}
          </a>
        </span>
      </p>`
      + '<br />'
      + '<p>Best,</p>'
      + '<p>Cromatic</p>'
  };

  sendMail(mailData);
};