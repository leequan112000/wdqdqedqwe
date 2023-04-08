import { mailSender, sendMail } from "./config";
import { adminNewProjectRequestTemplate } from "./templates";
import { Admin } from "@prisma/client";

export const sendAdminNewProjectRequestEmail = async (admin: Admin, biotech_name: string) => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: admin.email,
    replyTo: mailSender,
    templateId: adminNewProjectRequestTemplate,
    dynamicTemplateData: {
      retool_url: process.env.RETOOL_PROJECT_URL,
      biotech_name,
      admin_name: admin.username,
    },
  };

  sendMail(mailData);
};
