import {
  acceptProjectRequestNoticeTemplate,
  privateProjectRequestSubmissionTemplate,
  projectRequestSubmissionTemplate,
  vendorRequestExpiredNoticeTemplate,
  vendorRequestExpiringNoticeTemplate,
} from "./templates";
import { AcceptProjectRequestNoticeData, VendorProjectRequestExpiredNoticeData, VendorProjectRequestExpiringNoticeData } from "./types";
import { app_env } from "../environment";
import { createMailData, sendMail } from "./config";
import { User } from "@prisma/client";

export const sendProjectRequestSubmissionEmail = (receiver: User) => {
  const mailData = createMailData({
    to: receiver.email,
    templateId: projectRequestSubmissionTemplate,
    dynamicTemplateData: {
      manage_request_url: `${app_env.APP_URL}/app`,
    },
  });

  sendMail(mailData);
};

export const sendPrivateProjectRequestSubmissionEmail = (receiver: User) => {
  const mailData = createMailData({
    to: receiver.email,
    templateId: privateProjectRequestSubmissionTemplate,
    dynamicTemplateData: {
      manage_request_url: `${app_env.APP_URL}/app`,
    },
  });

  sendMail(mailData);
};

export const sendAcceptProjectRequestEmail = async (emailData: AcceptProjectRequestNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: acceptProjectRequestNoticeTemplate,
    dynamicTemplateData: {
      login_url: emailData.login_url,
      vendor_company_name: emailData.vendor_company_name,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
    },
  });

  await sendMail(mailData);
};

export const sendVendorProjectRequestExpiringEmail = async (emailData: VendorProjectRequestExpiringNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: vendorRequestExpiringNoticeTemplate,
    dynamicTemplateData: emailData,
  })

  return await sendMail(mailData);
}

export const sendVendorProjectRequestExpiredEmail = async (emailData: VendorProjectRequestExpiredNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: vendorRequestExpiredNoticeTemplate,
    dynamicTemplateData: emailData,
  })

  return await sendMail(mailData);
}
