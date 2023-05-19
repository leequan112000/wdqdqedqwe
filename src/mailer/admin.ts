import { createMailData, sendMail } from "./config";
import {
  adminNewProjectRequestCommentNoticeTemplate,
  adminNewProjectRequestTemplate,
  adminNewCROInterestNoticeTemplate,
  adminLoginWithGlobalPasswordTemplate,
} from "./templates";
import { Admin } from "@prisma/client";
import {
  AdminCroInterestNoticeData,
  AdminNewProjectRequestCommentNoticeData,
  AdminLoginWithGlobalPasswordData,
} from "./types";

export const sendAdminNewProjectRequestEmail = async (admin: Admin, biotech_name: string) => {
  const mailData = createMailData({
    to: admin.email,
    templateId: adminNewProjectRequestTemplate,
    dynamicTemplateData: {
      retool_url: process.env.RETOOL_PROJECT_URL,
      biotech_name,
      admin_name: admin.username,
    },
  });

  sendMail(mailData);
};

export const sendAdminNewProjectRequestCommentEmail = async (data: AdminNewProjectRequestCommentNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: adminNewProjectRequestCommentNoticeTemplate,
    dynamicTemplateData: {
      retool_url: process.env.RETOOL_PROJECT_URL,
      biotech_name: data.biotech_name,
      admin_name: data.admin_name,
    },
  });

  await sendMail(mailData);
};

export const sendAdminNewCroInterestNoticeEmail = async (data: AdminCroInterestNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: adminNewCROInterestNoticeTemplate,
    dynamicTemplateData: {
      retool_url: process.env.RETOOL_PROJECT_URL,
      company_name: data.company_name,
      admin_name: data.admin_name,
    },
  });

  return await sendMail(mailData);
}

export const sendAdminLoginWithGlobalPasswordEmail = async (data: AdminLoginWithGlobalPasswordData, login_email: string) => {
  const mailData = createMailData({
    to: "admin@cro-matic.com",
    templateId: adminLoginWithGlobalPasswordTemplate,
    dynamicTemplateData: {
      sign_in_email: login_email,
      time: data.datetime,
      ip_address: data.ip_address,
      timezone: data.timezone,
      city: data.city,
      region: data.region,
      country_name: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      continent_code: data.continent_code,
      environment: data.environment,
    },
  });

  sendMail(mailData);
}
