import { User } from "@prisma/client";
import { createMailData, mailSender, sendMail } from "./config";
import { customerInvitationByAdminTemplate, customerInvitationTemplate } from "./templates";
import { app_env } from "../environment";

export const sendCustomerInvitationEmail = (inviter: User, receiver: User, custom_message: string = '') => {
  const mailData = createMailData({
    to: receiver.email,
    templateId: customerInvitationTemplate,
    dynamicTemplateData: {
      login_url: `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(receiver.reset_password_token!)}`,
      inviter_full_name: `${inviter.first_name} ${inviter.last_name}`,
      inviter_message: custom_message,
      receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
    },
  });

  sendMail(mailData);
};

export const sendCustomerInvitationByAdminEmail = (receiver: User) => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: receiver.email,
    replyTo: mailSender,
    templateId: customerInvitationByAdminTemplate,
    dynamicTemplateData: {
      login_url: `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(receiver.reset_password_token!)}`,
      receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
    },
  };

  sendMail(mailData);
};
