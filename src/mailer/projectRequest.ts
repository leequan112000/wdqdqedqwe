import { User } from "@prisma/client";
import { createMailData, sendMail } from "./config";
import { projectRequestSubmissionTemplate } from "./templates";
import { app_env } from "../environment";

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