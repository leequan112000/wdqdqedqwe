import { ProjectRequest, User } from "@prisma/client";
import { mailSender, sendMail } from "./config";
import { vendorMemberInvitationByAdminTemplate, vendorMemberInvitationByExistingMemberTemplate, vendorMemberInvitationToProjectRequestByAdminTemplate } from "./templates";
import { app_env } from "../environment";

export const sendVendorMemberInvitationByExistingMemberEmail = (inviter: User, receiver: User, custom_message: string = '') => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: receiver.email,
    replyTo: mailSender,
    templateId: vendorMemberInvitationByExistingMemberTemplate,
    dynamicTemplateData: {
      login_url: `${app_env.APP_URL}/reset-password?token=${receiver.reset_password_token}`,
      inviter_full_name: `${inviter.first_name} ${inviter.last_name}`,
      inviter_message: custom_message,
      receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
    },
  };

  sendMail(mailData);
};

export const sendVendorMemberInvitationByAdminEmail = (receiver: User) => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: receiver.email,
    replyTo: mailSender,
    templateId: vendorMemberInvitationByAdminTemplate,
    dynamicTemplateData: {
      login_url: `${app_env.APP_URL}/reset-password?token=${receiver.reset_password_token}`,
      receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
    },
  };

  sendMail(mailData);
};

export const sendVendorMemberProjectRequestInvitationByAdminEmail = (project_request: ProjectRequest, receiver: User) => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: receiver.email,
    replyTo: mailSender,
    templateId: vendorMemberInvitationToProjectRequestByAdminTemplate,
    dynamicTemplateData: {
      login_url: `${app_env.APP_URL}/reset-password?token=${receiver.reset_password_token}`,
      project_request_name: project_request.title,
    },
  };

  sendMail(mailData);
};
