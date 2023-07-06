import { createMailData, sendMail } from "./config";
import type { MilestoneNoticeData } from "./types";
import { milestoneNoticeTemplate } from "./templates";

export const sendMilestoneNoticeEmail = async (emailData: MilestoneNoticeData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: milestoneNoticeTemplate,
    dynamicTemplateData: {
      sender_name: emailData.sender_name,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
      milestone_update_content: emailData.milestone_update_content,
      milestone_url: emailData.milestone_url,
    },
  });

  await sendMail(mailData);
}