export type CreateSendUserExpiredQuoteNoticeEmailJobParam = {
  receiverEmail: string;
  receiverName: string;
  listData: Array<{
    project_request_title: string;
    quotes: Array<{
      short_id: string;
      vendor_full_name: string;
    }>;
  }>;
  moreCount?: number;
}

export type CreateSendUserExpiringQuoteNoticeEmailJobParam = {
  receiverEmail: string;
  receiverName: string;
  expiringIn: string;
  listData: Array<{
    project_request_title: string;
    quotes: Array<{
      short_id: string;
      vendor_full_name: string;
    }>;
  }>;
  moreCount?: number;
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
