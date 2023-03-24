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
