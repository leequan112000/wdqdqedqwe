export type ProjectRequestInvitationByExistingMemberData = {
  login_url: string;
  project_title: string;
  inviter_full_name: string;
  receiver_full_name: string;
}

export type DocumentUploadNoticeData = {
  login_url: string;
  receiver_full_name: string;
  project_title: string;
  company_name: string;
}
