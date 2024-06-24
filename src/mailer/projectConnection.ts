import { projectRequestInvitationByExistingMemberTemplate } from './templates';
import { createSendMailJob } from '../queues/sendMail.queues';

type ProjectRequestInvitationByExistingMemberEmailData = {
  login_url: string;
  project_title: string;
  inviter_full_name: string;
  receiver_full_name: string;
};

export const projectCollaboratorInvitationEmail = async (
  emailData: ProjectRequestInvitationByExistingMemberEmailData,
  receiverEmail: string,
) => {
  createSendMailJob({
    emailData,
    receiverEmail,
    templateId: projectRequestInvitationByExistingMemberTemplate,
  });
};
