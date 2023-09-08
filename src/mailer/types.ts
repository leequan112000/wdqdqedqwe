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
  button_url: string;
  receiver_full_name: string;
  project_title: string;
  company_name: string;
  message_text: string;
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

export type QuoteExpiringNoticeData = {
  receiver_full_name: string;
  button_url: string;
  expiring_in: string;
  quotes: Array<{
    short_id: string;
    project_request_title: string;
    vendor_full_name: string;
  }>;
}

export type QuoteExpiredNoticeData = {
  receiver_full_name: string;
  button_url: string;
  quotes: Array<{
    short_id: string;
    project_request_title: string;
    vendor_full_name: string;
  }>;
}

export type ProjectRequestInvitationByAdminData = {
  project_request_title: string;
  login_url: string;
  receiver_full_name: string;
}

export type AdminNewProjectRequestCommentNoticeData = {
  biotech_name: string;
  admin_name: string;
  project_request_name: string;
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

export type AdminBiotechInviteVendorNoticeData = {
  biotech_name: string;
  inviter_full_name: string;
  vendor_company_name: string;
  website: string;
  first_name: string;
  last_name: string;
  email: string;
  project_request_name: string;
}

export type BiotechInviteVendorMemberData = {
  inviter_first_name: string;
  inviter_last_name: string;
  biotech_name: string;
}

export type BillingNoticeData = {
  invoice_month: string;
  vendor_company_name: string;
  invoice_period: string;
  invoice_total_amount: string;
  button_url: string;
}

export type InvoicePaymentNoticeData = {
  invoice_month: string;
  payment_status: string;
  button_url: string;
}

export type InvoicePaymentReminderData = {
  invoice_date: string;
  vendor_company_name: string;
  due_at: string;
  due_period: string
  invoice_total_amount: string;
  button_url: string;
}

export type InvoicePaymentOverdueNoticeData = {
  invoice_date: string;
  vendor_company_name: string;
  overdue_period: string;
  invoice_total_amount: string;
  button_url: string;
}

export type VendorProjectRequestExpiringNoticeData = {
  receiver_full_name: string;
  button_url: string;
  expiring_in: string;
  requests: Array<{
    project_request_title: string;
    biotech_full_name: string;
  }>;
}

export type VendorProjectRequestExpiredNoticeData = {
  receiver_full_name: string;
  button_url: string;
  requests: Array<{
    project_request_title: string;
    biotech_full_name: string;
  }>;
}
