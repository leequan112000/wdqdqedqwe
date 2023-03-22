import { createMailData, sendMail } from "./config";
import type { ProjectRequestInvitationByExistingMemberData } from "./types";
import { projectRequestInvitationByExistingMember } from "./templates";

export const sendProjectCollaboratorInvitation = async (emailData: ProjectRequestInvitationByExistingMemberData, receiverEmail: string) => {
  const mailData = createMailData({
    to: receiverEmail,
    templateId: projectRequestInvitationByExistingMember,
    dynamicTemplateData: {
      login_url: emailData.login_url,
      inviter_full_name: emailData.inviter_full_name,
      project_title: emailData.project_title,
      receiver_full_name: emailData.receiver_full_name,
    },
  });

  await sendMail(mailData);
}
