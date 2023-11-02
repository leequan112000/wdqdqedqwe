import { User } from "@prisma/client";
import { createMailData, sendMail } from "./config";
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

export const sendCustomerInvitationByAdminEmail = async (receiverEmail: string, receiverName: string, resetPasswordToken: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: customerInvitationByAdminTemplate,
    dynamicTemplateData: {
      login_url: `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(resetPasswordToken)}`,
      receiver_full_name: receiverName,
    },
  })

  return sendMail(mailData);
};
