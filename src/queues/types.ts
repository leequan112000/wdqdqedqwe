export type CreateSendUserExpiredQuoteNoticeEmailJobParam = {
  receiverEmail: string;
  receiverName: string;
  projectConnectionId: string;
  projectRequestTitle: string;
  quotes: Array<{
    short_id: string;
    project_request_title: string;
    vendor_full_name: string;
  }>;
}

export type CreateSendUserExpiringQuoteNoticeEmailJobParam = {
  receiverEmail: string;
  receiverName: string;
  projectConnectionId: string;
  projectRequestTitle: string;
  expiredIn: string;
  quotes: Array<{
    short_id: string;
    project_request_title: string;
    vendor_full_name: string;
  }>;
}
