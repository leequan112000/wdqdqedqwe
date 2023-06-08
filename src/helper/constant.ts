export const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 14; // 14 days
export const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 100; // 100 years

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
}

export enum ProjectRequestStatus {
  PROCESSING = 'processing',
  MATCHED = 'matched',
  WITHDRAWN = 'withdrawn',
}

export enum ProjectConnectionVendorStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export enum AdminTeam {
  ENGINEER = 'engineer',
  PRODUCT = 'product',
  SCIENCE = 'science',
}

export enum NotificationType {
  ACCEPT_REQUEST_NOTIFICATION = 'AcceptRequestNotification',
  ADMIN_INVITE_NOTIFICATION = 'AdminInviteNotification',
  COLLABORATED_NOTIFICATION = 'CollaboratedNotification',
  FILE_UPLOAD_NOTIFICATION = 'FileUploadNotification',
  FINAL_CONTRACT_UPLOAD_NOTIFICATION = 'FinalContractUploadNotification',
  MESSAGE_NOTIFICATION = 'MessageNotification',
}

export enum ProjectAttachmentDocumentType {
  FILE,
  REDLINE_FILE,
}

export const PROJECT_ATTACHMENT_DOCUMENT_TYPE: Record<number, string> = {
  [ProjectAttachmentDocumentType.FILE]: 'file',
  [ProjectAttachmentDocumentType.REDLINE_FILE]: 'redline_file',
}

export enum MeetingPlatform {
  GOOGLE_MEET = 'google-meet',
}

export enum BiotechAccountType {
  STARDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum EmailType {
  ADMIN_NEW_PROJECT_REQUEST = 'admin:new-project-request',
  ADMIN_PROJECT_INVITATION = 'admin:project-invitation',
  ADMIN_NEW_PROJECT_REQUEST_COMMENT = 'admin:new-project-request-comment',
  ADMIN_CRO_INTEREST_NOTICE = 'admin:cro-interest-notice',
  ADMIN_ZERO_ACCEPTED_PROJECT_NOTICE = 'admin:zero-accepted-project-notice',
  USER_FILE_UPLOAD_NOTICE = 'user:file-upload-notice',
  USER_NEW_MESSAGE_NOTICE = 'user:new-message-notice',
  USER_ACCEPT_PROJECT_REQUEST_NOTICE = 'user:accept-project-request-notice',
  USER_NEW_BLOG_SUBSCRIBPTION_EMAIL = 'user:new-blog-subscription-email',
  BIOTECH_INVITE_VENDOR_MEMBER_EMAIL = 'biotech:invite-vendor-member-email',
}
