import { User } from "@prisma/client";
import { mailSender, sendMail } from "./config";
import { projectRequestSubmissionTemplate } from "./templates";
import { app_env } from "../environment";

export const sendProjectRequestSubmissionEmail = (receiver: User) => {
  const mailData = {
    from: `Cromatic <${mailSender}>`,
    to: receiver.email,
    replyTo: mailSender,
    templateId: projectRequestSubmissionTemplate,
    dynamicTemplateData: {
      // TODO set to correct URL
      manage_request_url: `${app_env.APP_URL}`,
    },
  };

  sendMail(mailData);
};