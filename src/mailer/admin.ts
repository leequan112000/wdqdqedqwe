import { mailSender, sendMail } from "./config";
import { adminNewProjectRequestTemplate } from "./templates";
import { AdminTeam } from "../helper/constant";
import { prisma } from '../connectDB';

export const sendAdminNewProjectRequestEmail = async (biotech_name: string) => {
  const admins = await prisma.admin.findMany({
    where: {
      team: AdminTeam.SCIENCE
    }
  })

  await Promise.all(
    admins.map(admin => {
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
    })
  );
};
