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

export type CreateInvoicePaymentNoticeEmailJobParam = {
  vendorCompanyId: string;
  invoiceMonth: string;
  paymentStatus: string;
  invoiceId: string;
}

export type CreateInvoicePaymentReminderEmailJobParam = {
  vendorCompanyId: string;
  invoiceDueAt: string
  duePeriod: string
  invoiceDate: string;
  invoiceTotalAmount: string;
  invoiceId: string;
}

export type CreateInvoicePaymentOverdueNoticeEmailJobParam = {
  vendorCompanyId: string;
  overduePeriod: string
  invoiceDate: string;
  invoiceTotalAmount: string;
  invoiceId: string;
}

export type CreateVendorProjectRequestExpiringNoticeEmailJobParam = {
  receiverEmail: string;
  receiverName: string;
  expiringIn: string;
  requests: Array<{
    project_request_title: string;
    biotech_full_name: string;
  }>;
}

export type CreateVendorProjectRequestExpiredNoticeEmailJobParam = {
  receiverEmail: string;
  receiverName: string;
  requests: Array<{
    project_request_title: string;
    biotech_full_name: string;
  }>;
}
