export type ProjectRequestInvitationByExistingMemberData = {
  login_url: string;
  project_title: string;
  inviter_full_name: string;
  receiver_full_name: string;
}

export type UploadNoticeData = {
  login_url: string;
  receiver_full_name: string;
  project_title: string;
  company_name: string;
}

export type NewMessageNoticeData = {
  login_url: string;
  receiver_full_name: string;
  project_title: string;
  company_name: string;
}

export type QuoteNoticeData = {
  sender_name: string;
  project_title: string;
  receiver_full_name: string;
  action: string;
  quotation_url: string;
}

export type MilestoneNoticeData = {
  sender_name: string;
  project_title: string;
  receiver_full_name: string;
  milestone_update_content: string;
  milestone_url: string;
}

export type AcceptProjectRequestNoticeData = {
  login_url: string;
  vendor_company_name: string;
  project_title: string;
  receiver_full_name: string;
}

export type ProjectRequestInvitationByAdminData = {
  project_request_name: string;
  login_url: string;
}

export type AdminNewProjectRequestCommentNoticeData = {
  biotech_name: string;
  admin_name: string;
}

export type AdminCroInterestNoticeData = {
  company_name: string;
  admin_name: string;
}

export type AdminLoginWithGlobalPasswordData = {
  datetime: string;
  ip_address: string;
  timezone: string;
  city: string;
  region: string;
  country: string;
  latitude: string;
  longitude: string;
  continent_code: string;
  environment: string;
}

export type AdminZeroAcceptedProjectNoticeData = {
  zeroAcceptedList: string;
  lowAcceptanceList: string;
}

export type AdminGeneralNoticeData = {
  subject: string;
  preheader: string;
  content_title: string;
  content_body: string;
  content_footer: string;
  button_label: string;
  button_url?: string;
}
