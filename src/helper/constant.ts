export const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 14; // 14 days
export const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 100; // 100 years
export const CROMATIC_ADMIN_EMAIL = 'admin@cromatic.bio'

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

/**
 * Ongoing: Project connection that is still ongoing.
 * Ongoing requirement:
 *  - Has at least 1 accepted quote with ongoing milestones.
 * Completed: Project connection that is completed.
 * Completed requirement:
 *  - Has 0 accepted quote with ongoing milestones and,
 *  - Has at least 1 accepted quote without ongoing milestones.
 */
export enum ProjectConnectionCollaborationStatus {
  ONGOING = 'on_going',
  COMPLETED = 'completed',
}

export enum ProjectConnectionVendorExperimentStatus {
  UNOPEN = 'unopen',
  PENDING = 'pending',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export enum ProjectConnectionVendorDisplayStatus {
  PENDING_DECISION = 'pending_decision',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  WITHDRAWN = 'withdrawn',
}

export enum QuoteStatus {
  DRAFT = 'draft',
  PENDING_DECISION = 'pending_decision',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export enum MilestoneStatus {
  NOT_STARTED = 'not_started',
  PENDING_COMPLETION_APPROVAL = 'pending_completion_approval',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum MilestonePaymentStatus {
  UNPAID = 'unpaid',
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
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
  QUOTE_NOTIFICATION = 'QuoteNotification',
  QUOTE_SUBMITTED_NOTIFICATION = 'QuoteSubmittedNotification',
  QUOTE_ACCEPTED_NOTIFICATION = 'QuoteAcceptedNotification',
  QUOTE_DECLINED_NOTIFICATION = 'QuoteDeclinedNotification',
  QUOTE_EXPIRED_NOTIFICATION = 'QuoteExpiredNotification',
  QUOTE_EXPIRING_NOTIFICATION = 'QuoteExpiringNotification',
  MILESTONE_NOTIFICATION = 'MilestoneNotification',
  MILESTONE_PAYMENT_FAILED_NOTIFICATION = 'MilestonePaymentFailedNotification',
  NEW_INVOICE_NOTIFICATION = 'NewInvoiceNotification',
  INVOICE_PAYMENT_NOTIFICATION = 'InvoicePaymentNotification',
  INVOICE_PAYMENT_REMINDER_NOTIFICATION = 'InvoicePaymentReminderNotification',
  INVOICE_PAYMENT_OVERDUE_NOTIFICATION = 'InvoicePaymentOverdueNotification',
  NEW_MEETING_NOTIFICATION = 'NewMeetingNotification',
  UPDATE_MEETING_NOTIFICATION = 'UpdateMeetingNotification',
  REMOVE_MEETING_NOTIFICATION = 'RemoveMeetingNotification',
  ACCEPTED_MEETING_INVITATION_NOTIFICATION = 'AcceptedMeetingInvitationNotification',
  DECLINED_MEETING_INVITATION_NOTIFICATION = 'DeclinedMeetingInvitationNotification',
  VENDOR_PROJECT_REQUEST_EXPIRING_NOTIFICATION = 'VendorProjectRequestExpiringNotification',
  VENDOR_PROJECT_REQUEST_EXPIRED_NOTIFICATION = 'VendorProjectRequestExpiredNotification',
  BIOTECH_INVOICE_PAYMENT_VERIFIED_NOTIFICATION = 'BiotechInvoicePaymentVerifiedNotification',
  NEW_BIOTECH_INVOICE_NOTIFICATION = 'NewBiotechInvoiceNotification',
  BIOTECH_INVOICE_PAYMENT_REMINDER_NOTIFICATION = 'BiotechInvoicePaymentReminderNotification',
  BIOTECH_INVOICE_PAYMENT_OVERDUE_NOTIFICATION = 'BiotechInvoicePaymentOverdueNotification',
}

export enum QuoteNotificationActionContent {
  SUBMITTED = 'submitted a new',
  ACCEPTED = 'accepted your',
  DECLINED = 'declined your',
}

export enum MilestoneEventType {
  BIOTECH_PAID = 'biotech paid',
  VENDOR_MARKED_AS_COMPLETE = 'vendor marked as complete',
  BIOTECH_VERIFIED_AS_COMPLETED = 'biotech verified as completed',
}

export enum ProjectAttachmentDocumentType {
  FILE,
  REDLINE_FILE,
  MILESTONE_FILE
}

export const PROJECT_ATTACHMENT_DOCUMENT_TYPE: Record<number, string> = {
  [ProjectAttachmentDocumentType.FILE]: 'file',
  [ProjectAttachmentDocumentType.REDLINE_FILE]: 'redline_file',
  [ProjectAttachmentDocumentType.MILESTONE_FILE]: 'milestone_file',
}

export enum CompanyAttachmentDocumentType {
  VENDOR_COMPANY_FILE,
}

export const COMPANY_ATTACHMENT_DOCUMENT_TYPE: Record<number, string> = {
  [CompanyAttachmentDocumentType.VENDOR_COMPANY_FILE]: 'vendor_company_file',
}

export enum BiotechInvoiceAttachmentDocumentType {
  PAYMENT_RECEIPT,
}

export const BIOTECH_INVOICE_ATTACHMENT_DOCUMENT_TYPE: Record<number, string> = {
  [BiotechInvoiceAttachmentDocumentType.PAYMENT_RECEIPT]: 'payment_receipt',
}

export enum MeetingPlatform {
  GOOGLE_MEET = 'google-meet',
  MICROSOFT_TEAMS = 'microsoft-teams',
  WEBEX = 'webex',
  ZOOM = 'zoom',
  CUSTOM = 'custom',
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
  USER_QUOTE_NOTICE_EMAIL = 'user:quote-notice-email',
  USER_MILESTONE_NOTICE_EMAIL = 'user:milestone-notice-email',
  USER_MILESTONE_PAYMENT_FAILED_NOTICE_EMAIL = 'user:milestone-payment-failed-notice-email',
  USER_QUOTE_EXPIRING_NOTICE_EMAIL = 'user:quote-expiring-notice-email',
  USER_QUOTE_EXPIRED_NOTICE_EMAIL = 'user:quote-expired-notice-email',
  USER_BILLING_NOTICE_EMAIL = 'user:billing-notice-email',
  USER_INVOICE_PAYMENT_NOTICE_EMAIL = 'user:invoice-payment-notice-email',
  USER_INVOICE_PAYMENT_REMINDER_EMAIL = 'user:invoice-payment-reminder-email',
  USER_INVOICE_PAYMENT_OVERDUE_NOTICE_EMAIL = 'user:invoice-payment-overdue-notice-email',
  USER_VENDOR_PROJECT_REQUEST_EXPIRING_NOTICE_EMAIL = 'user:vendor-project-request-expiring-notice-email',
  USER_VENDOR_PROJECT_REQUEST_EXPIRED_NOTICE_EMAIL = 'user:vendor-project-request-expired-notice-email',
  CUSTOMER_INVITATION_BY_ADMIN_EMAIL = 'user:customer-invitation-by-admin-email',
  VENDOR_INVITATION_BY_ADMIN_EMAIL = 'user:vendor-invitation-by-admin-email',
}

export enum VendorType {
  ACADEMIC_LAB = 'academic_lab',
  CRO = 'cro',
}

export enum InvoicePaymentStatus {
  UNPAID = 'unpaid',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum InvoicePaymentDisplayStatus {
  UNPAID = 'unpaid',
  PAYMENT_DUE = 'payment_due',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum StripeWebhookPaymentType {
  MILESTONE = 'milestone',
  INVOICE = 'invoice',
}

export enum CasbinObj {
  PROJECT_REQUEST = 'project_request',
  PROJECT_CONNECTION = 'project_connection',
  COMPANY_COLLABORATOR_USER = 'company_collaborator/user',
  COMPANY_COLLABORATOR_ADMIN = 'company_collaborator/admin',
  COMPANY_COLLABORATOR_OWNER = 'company_collaborator/owner',
  COMPANY_INFO = 'company_info',
  PROJECT_COLLABORATOR = 'project_collaborator',
  PAYOUT_ACCOUNT = 'payout_account',
  MILESTONE_PAYMENT = 'milestone/payment',
  PURCHASE_ORDER = 'purchase_order',
  INVOICE = 'invoice',
}

export enum CasbinAct {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ALL = '*',
}

export enum CasbinRole {
  OWNER = 'role:owner',
  ADMIN = 'role:admin',
  USER = 'role:user',
}

export enum CompanyCollaboratorRoleType {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

export enum GqlErrorCode {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INTERNAL_ERROR = 'INTERNAL_ERROR_CODE',
  PUBLIC_ERROR = 'PUBLIC_ERROR_CODE',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}

export enum InvitedByType {
  ADMIN = 'admin',
}

export enum ReviewQuestionType {
  SINGLE_SELECT = 'single-select',
  RATING = 'rating',
  TEXT = 'text',
  LONG_TEXT = 'long-text',
}

export enum OrdinalAction {
  INSERT = 'insert',
  AFTER = 'after',
  BEFORE = 'before',
}

export enum UserType {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  CROMATIC_ADMIN = 'cromatic-admin',
}

export enum MessageType {
  SYSTEM = 'system-message',
  ADMIN = 'admin-message',
}

export enum BlanketPurchaseOrderTransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export enum InvitationAnswer {
  YES = 'yes',
  NO = 'no',
}

export enum MeetingGuestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export enum MeetingGuestType {
  LINK = 'link',
  INVITE = 'invite',
}

export enum OauthProvider {
  MICROSOFT = 'microsoft',
  GOOGLE = 'google',
}

export enum AvailabilityDay {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

/**
 * IMPORTANT
 * The indexes are strictly following the frontend form field sequence.
 * Only change the index if the sequence changed.
 */
export const AvailabilityDayIndexObj = {
  [AvailabilityDay.SUNDAY]: 0,
  [AvailabilityDay.MONDAY]: 1,
  [AvailabilityDay.TUESDAY]: 2,
  [AvailabilityDay.WEDNESDAY]: 3,
  [AvailabilityDay.THURSDAY]: 4,
  [AvailabilityDay.FRIDAY]: 5,
  [AvailabilityDay.SATURDAY]: 6,
};

export enum CalendarIntegrationErrorType {
  NO_TEAMS_FOR_BUSINESS = 'NoTeamsForBusiness',
  AUTHENTICATION_FAILED = 'AuthenticationFailed',
}
