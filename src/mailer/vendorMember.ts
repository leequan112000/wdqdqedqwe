import { User } from "@prisma/client";
import { createMailData, mailSender, sendMail } from "./config";
import {
  vendorMemberInvitationByAdminTemplate,
  vendorMemberInvitationByExistingMemberTemplate,
  vendorMemberInvitationToProjectRequestByAdminTemplate,
  vendorMemberInvitationByBiotechTemplate
} from "./templates";
import { app_env } from "../environment";
import { ProjectRequestInvitationByAdminData } from "./types";

export const sendVendorMemberInvitationByExistingMemberEmail = (inviter: User, receiver: User, custom_message: string = '') => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: receiver.email,
    replyTo: mailSender,
    templateId: vendorMemberInvitationByExistingMemberTemplate,
    dynamicTemplateData: {
      login_url: `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(receiver.reset_password_token!)}`,
      inviter_full_name: `${inviter.first_name} ${inviter.last_name}`,
      inviter_message: custom_message,
      receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
    },
  };

  sendMail(mailData);
};

export const sendVendorMemberInvitationByAdminEmail = async (receiverEmail: string, receiverName: string, resetPasswordToken: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: vendorMemberInvitationByAdminTemplate,
    dynamicTemplateData: {
      login_url: `${app_env.APP_URL}/reset-password?token=${encodeURIComponent(resetPasswordToken)}`,
      receiver_full_name: receiverName,
    },
  });

  return sendMail(mailData);
};

export const sendVendorMemberProjectRequestInvitationByAdminEmail = async (emailData: ProjectRequestInvitationByAdminData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: vendorMemberInvitationToProjectRequestByAdminTemplate,
    dynamicTemplateData: {
      login_url: emailData.login_url,
      project_request_title: emailData.project_request_title,
      receiver_full_name: emailData.receiver_full_name,
    },
  });

  await sendMail(mailData);
};

export const sendVendorMemberInvitationByBiotechEmail = async (receiver: User, biotech_name: string, inviter: User, buttonUrl: string, project_request_name: string) => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: receiver.email,
    replyTo: mailSender,
    templateId: vendorMemberInvitationByBiotechTemplate,
    dynamicTemplateData: {
      login_url: buttonUrl,
      receiver_full_name: `${receiver.first_name} ${receiver.last_name}`,
      biotech_name: biotech_name,
      inviter_full_name: `${inviter.first_name} ${inviter.last_name}`,
      project_request_name: project_request_name,
    },
  };

  return await sendMail(mailData);
};
