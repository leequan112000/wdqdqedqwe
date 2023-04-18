import { createMailData, sendMail } from "./config";
import { adminNewProjectRequestCommentNoticeTemplate, adminNewProjectRequestTemplate } from "./templates";
import { Admin } from "@prisma/client";
import { AdminNewProjectRequestCommentNoticeData } from "./types";

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
}
