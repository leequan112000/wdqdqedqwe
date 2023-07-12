export type CreateSendUserExpiredQuoteNoticeEmailJobParam = {
  receiverId: string;
  receiverEmail: string;
  receiverName: string;
  projectConnectionId: string;
  projectRequestTitle: string;
  quotes: Array<{
    id: string;
    short_id: string;
    project_request_title: string;
    vendor_full_name: string;
  }>;
}

export type CreateSendUserExpiringQuoteNoticeEmailJobParam = {
  receiverId: string;
  receiverEmail: string;
  receiverName: string;
  projectConnectionId: string;
  projectRequestTitle: string;
  expiringIn: string;
  quotes: Array<{
    id: string;
    short_id: string;
    project_request_title: string;
    vendor_full_name: string;
  }>;
}

export type CreateBillingNoticeEmailJobParam = {
  receiverId: string;
  receiverEmail: string;
  receiverCompanyName: string;
  invoiceMonth: string;
  invoiceTotalAmount: string;
  invoicePeriod: string;
  invoiceId: string;
}
