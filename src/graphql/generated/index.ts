import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  access_token: Scalars['String']['output'];
  refresh_token: Scalars['String']['output'];
};

export type Availability = {
  __typename?: 'Availability';
  id: Scalars['String']['output'];
  rules: Array<AvailabilityRule>;
  timezone?: Maybe<Scalars['String']['output']>;
};

export type AvailabilityRule = {
  __typename?: 'AvailabilityRule';
  day: Scalars['String']['output'];
  intervals: Array<RuleInterval>;
};

export type AvailabilityRuleInput = {
  day: Scalars['String']['input'];
  intervals: Array<RuleIntervalInput>;
};

export type BillingInfo = {
  __typename?: 'BillingInfo';
  bill_cycle?: Maybe<Scalars['String']['output']>;
  has_active_legacy_plan?: Maybe<Scalars['Boolean']['output']>;
  has_active_sourcerer_plan?: Maybe<Scalars['Boolean']['output']>;
  has_active_white_glove_plan?: Maybe<Scalars['Boolean']['output']>;
  has_scheduled_for_interval_change?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  payment_method?: Maybe<PaymentMethod>;
  plan?: Maybe<Scalars['String']['output']>;
  plan_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  upcoming_bill_amount?: Maybe<Scalars['Float']['output']>;
  upcoming_bill_date?: Maybe<Scalars['Date']['output']>;
};

export type BillingInvoice = {
  __typename?: 'BillingInvoice';
  amount?: Maybe<Scalars['Float']['output']>;
  date?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  invoice_url?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Biotech = {
  __typename?: 'Biotech';
  about?: Maybe<Scalars['String']['output']>;
  account_type?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  admins?: Maybe<Array<Maybe<User>>>;
  biotech_extra_info?: Maybe<Scalars['String']['output']>;
  biotech_invoices?: Maybe<Array<Maybe<BiotechInvoice>>>;
  blanket_purchase_orders?: Maybe<Array<Maybe<BlanketPurchaseOrder>>>;
  chats?: Maybe<Array<Maybe<Chat>>>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  facebook_url?: Maybe<Scalars['String']['output']>;
  founded_year?: Maybe<Scalars['String']['output']>;
  has_active_subscription?: Maybe<Scalars['Boolean']['output']>;
  has_setup_profile?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  linkedin_url?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<User>;
  purchase_orders?: Maybe<Array<Maybe<PurchaseOrder>>>;
  state?: Maybe<Scalars['String']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  team_size?: Maybe<Scalars['String']['output']>;
  twitter_url?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  upload_limit?: Maybe<Scalars['Float']['output']>;
  upload_used?: Maybe<Scalars['Float']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  zipcode?: Maybe<Scalars['String']['output']>;
};

export type BiotechInviteVendor = {
  __typename?: 'BiotechInviteVendor';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  inviter?: Maybe<User>;
  inviter_id?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  project_connection?: Maybe<ProjectConnection>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type BiotechInvoice = {
  __typename?: 'BiotechInvoice';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']['output']>;
  biotech_invoice_attachment?: Maybe<BiotechInvoiceAttachment>;
  biotech_invoice_items?: Maybe<Array<Maybe<BiotechInvoiceItem>>>;
  blanket_purchase_order_transaction?: Maybe<BlanketPurchaseOrderTransaction>;
  created_at?: Maybe<Scalars['Date']['output']>;
  due_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invoice_number?: Maybe<Scalars['String']['output']>;
  paid_at?: Maybe<Scalars['Date']['output']>;
  payment_status?: Maybe<Scalars['String']['output']>;
  purchase_order?: Maybe<PurchaseOrder>;
  reference_id?: Maybe<Scalars['String']['output']>;
  stripe_txn_id?: Maybe<Scalars['String']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type BiotechInvoiceAttachment = {
  __typename?: 'BiotechInvoiceAttachment';
  biotech_invoice?: Maybe<BiotechInvoice>;
  biotech_invoice_id?: Maybe<Scalars['String']['output']>;
  byte_size?: Maybe<Scalars['Float']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  document_type?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  formatted_filesize?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  signed_url?: Maybe<Scalars['String']['output']>;
};

export type BiotechInvoiceItem = {
  __typename?: 'BiotechInvoiceItem';
  amount?: Maybe<Scalars['Float']['output']>;
  biotech_invoice?: Maybe<BiotechInvoice>;
  biotech_invoice_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  milestone?: Maybe<Milestone>;
  milestone_id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type BlanketPurchaseOrder = {
  __typename?: 'BlanketPurchaseOrder';
  amount?: Maybe<Scalars['Float']['output']>;
  balance_amount?: Maybe<Scalars['Float']['output']>;
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']['output']>;
  blanket_purchase_order_transactions?: Maybe<Array<Maybe<BlanketPurchaseOrderTransaction>>>;
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  po_number?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type BlanketPurchaseOrderTransaction = {
  __typename?: 'BlanketPurchaseOrderTransaction';
  amount?: Maybe<Scalars['Float']['output']>;
  biotech_invoice?: Maybe<BiotechInvoice>;
  biotech_invoice_id?: Maybe<Scalars['String']['output']>;
  blanket_purchase_order?: Maybe<BlanketPurchaseOrder>;
  blanket_purchase_order_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  transaction_type?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  all_day?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end_time?: Maybe<Scalars['Date']['output']>;
  guests?: Maybe<Array<Maybe<CalendarUser>>>;
  id?: Maybe<Scalars['String']['output']>;
  is_draft?: Maybe<Scalars['Boolean']['output']>;
  meeting_link?: Maybe<Scalars['String']['output']>;
  organizer?: Maybe<CalendarUser>;
  start_time?: Maybe<Scalars['Date']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type CalendarUser = {
  __typename?: 'CalendarUser';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type CertificationTag = {
  __typename?: 'CertificationTag';
  full_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  short_name?: Maybe<Scalars['String']['output']>;
};

export type CertificationTagConnection = {
  __typename?: 'CertificationTagConnection';
  certification_tag?: Maybe<CertificationTag>;
  certification_tag_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type Chat = {
  __typename?: 'Chat';
  id?: Maybe<Scalars['String']['output']>;
  messages?: Maybe<Array<Maybe<Message>>>;
  messagesConnection?: Maybe<MessagesConnection>;
};


export type ChatMessagesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type CompanyAttachment = {
  __typename?: 'CompanyAttachment';
  byte_size?: Maybe<Scalars['Float']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  document_type?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  formatted_filesize?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  signed_url?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type CompanyAttachmentUploadResult = {
  __typename?: 'CompanyAttachmentUploadResult';
  data?: Maybe<CompanyAttachment>;
  error_message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CompanyProfile = Biotech | VendorCompany;

export type CreateMilestoneInput = {
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  timeline?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CroDbSpecialty = {
  __typename?: 'CroDbSpecialty';
  definition?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subspecialties?: Maybe<Array<Maybe<CroDbSubspecialty>>>;
};

export type CroDbSubspecialtiesFilterInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type CroDbSubspecialty = {
  __typename?: 'CroDbSubspecialty';
  definition?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  specialty?: Maybe<CroDbSpecialty>;
  specialty_id?: Maybe<Scalars['String']['output']>;
};

export type CroDbVendorCompany = {
  __typename?: 'CroDbVendorCompany';
  company_description?: Maybe<Scalars['String']['output']>;
  company_ipo_status?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  company_revenue?: Maybe<Scalars['String']['output']>;
  company_size?: Maybe<Scalars['String']['output']>;
  crunchbase_url?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  is_active?: Maybe<Scalars['Boolean']['output']>;
  is_confirmed?: Maybe<Scalars['Boolean']['output']>;
  is_cromatic_vendor?: Maybe<Scalars['Boolean']['output']>;
  linkedin_url?: Maybe<Scalars['String']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Scalars['String']['output']>;
  vendor_company_certifications?: Maybe<Array<Maybe<CroDbVendorCompanyCertification>>>;
  vendor_company_locations?: Maybe<Array<Maybe<CroDbVendorCompanyLocation>>>;
  vendor_company_subspecialties?: Maybe<Array<Maybe<CroDbVendorCompanySubspecialty>>>;
  vendor_company_types?: Maybe<Array<Maybe<CroDbVendorCompanyType>>>;
  verified_at?: Maybe<Scalars['Date']['output']>;
  website_url?: Maybe<Scalars['String']['output']>;
};

export type CroDbVendorCompanyCertification = {
  __typename?: 'CroDbVendorCompanyCertification';
  certification_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type CroDbVendorCompanyLocation = {
  __typename?: 'CroDbVendorCompanyLocation';
  country?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type CroDbVendorCompanySubspecialty = {
  __typename?: 'CroDbVendorCompanySubspecialty';
  id?: Maybe<Scalars['String']['output']>;
  subspecialty?: Maybe<CroDbSubspecialty>;
  subspecialty_id?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type CroDbVendorCompanyType = {
  __typename?: 'CroDbVendorCompanyType';
  company_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type CroDbVendorSurvey = {
  __typename?: 'CroDbVendorSurvey';
  attachment_content_type?: Maybe<Scalars['String']['output']>;
  attachment_file_name?: Maybe<Scalars['String']['output']>;
  attachment_key?: Maybe<Scalars['String']['output']>;
  certifications?: Maybe<Array<Scalars['String']['output']>>;
  company_description?: Maybe<Scalars['String']['output']>;
  company_ipo_status?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  company_revenue?: Maybe<Scalars['String']['output']>;
  company_size?: Maybe<Scalars['String']['output']>;
  company_types?: Maybe<Array<Scalars['String']['output']>>;
  countries?: Maybe<Array<Scalars['String']['output']>>;
  created_at?: Maybe<Scalars['Date']['output']>;
  custom_specialties?: Maybe<Array<Scalars['String']['output']>>;
  email?: Maybe<Scalars['String']['output']>;
  hq_locations?: Maybe<Array<Scalars['String']['output']>>;
  id?: Maybe<Scalars['String']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Array<Scalars['String']['output']>>;
  respondent_company_role?: Maybe<Scalars['String']['output']>;
  respondent_name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  step?: Maybe<VendorSurveyStep>;
  subspecialty_ids?: Maybe<Array<Scalars['String']['output']>>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type CromaticParticipantInput = {
  email: Scalars['String']['input'];
  id: Scalars['String']['input'];
};

export type Customer = {
  __typename?: 'Customer';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  customer_connections?: Maybe<Array<Maybe<CustomerConnection>>>;
  has_setup_profile?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  project_requests?: Maybe<Array<Maybe<ProjectRequest>>>;
  team?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type CustomerConnection = {
  __typename?: 'CustomerConnection';
  created_at?: Maybe<Scalars['Date']['output']>;
  customer?: Maybe<Customer>;
  customer_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type DateWithTimeSlots = {
  __typename?: 'DateWithTimeSlots';
  date?: Maybe<Scalars['String']['output']>;
  time_slots?: Maybe<Array<Maybe<Scalars['Date']['output']>>>;
};

export type ExternalGuest = {
  __typename?: 'ExternalGuest';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type ExternalParticipantInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type InitialVendorSurveyData = {
  __typename?: 'InitialVendorSurveyData';
  certifications?: Maybe<Array<Scalars['String']['output']>>;
  company_description?: Maybe<Scalars['String']['output']>;
  company_ipo_status?: Maybe<Scalars['String']['output']>;
  company_revenue?: Maybe<Scalars['String']['output']>;
  company_size?: Maybe<Scalars['String']['output']>;
  countries?: Maybe<Array<Scalars['String']['output']>>;
  has_submitted: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  logo_url?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subspecialty_ids?: Maybe<Array<Scalars['String']['output']>>;
  vendor_type?: Maybe<Array<Scalars['String']['output']>>;
  website?: Maybe<Scalars['String']['output']>;
};

export type InviteCollaboratorInput = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
};

export type Invoice = {
  __typename?: 'Invoice';
  commission_rate?: Maybe<Scalars['Float']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  due_at?: Maybe<Scalars['Date']['output']>;
  from_date?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invoice_items?: Maybe<Array<Maybe<InvoiceItem>>>;
  invoice_number?: Maybe<Scalars['String']['output']>;
  paid_at?: Maybe<Scalars['Date']['output']>;
  payment_status?: Maybe<Scalars['String']['output']>;
  stripe_txn_id?: Maybe<Scalars['String']['output']>;
  to_date?: Maybe<Scalars['Date']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
  total_milestone_amount?: Maybe<Scalars['Float']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type InvoiceItem = {
  __typename?: 'InvoiceItem';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invoice?: Maybe<Invoice>;
  invoice_id?: Maybe<Scalars['String']['output']>;
  milestone?: Maybe<Milestone>;
  milestone_amount?: Maybe<Scalars['Float']['output']>;
  milestone_id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type LabSpecialization = {
  __typename?: 'LabSpecialization';
  full_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  short_name?: Maybe<Scalars['String']['output']>;
};

export type LabSpecializationConnection = {
  __typename?: 'LabSpecializationConnection';
  id?: Maybe<Scalars['String']['output']>;
  lab_specialization?: Maybe<LabSpecialization>;
  lab_specialization_id?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type MarkMilestoneCompleteResponse = {
  __typename?: 'MarkMilestoneCompleteResponse';
  milestone?: Maybe<Milestone>;
  upload_results?: Maybe<Array<Maybe<UploadResult>>>;
};

export type MeetingEvent = {
  __typename?: 'MeetingEvent';
  attending_company?: Maybe<Scalars['String']['output']>;
  attending_company_participants?: Maybe<Array<Maybe<MeetingParticipant>>>;
  description?: Maybe<Scalars['String']['output']>;
  end_time?: Maybe<Scalars['Date']['output']>;
  external_guests?: Maybe<Array<Maybe<MeetingParticipant>>>;
  /** @deprecated Use `participants`. */
  guests?: Maybe<Array<Maybe<User>>>;
  id: Scalars['String']['output'];
  meeting_link?: Maybe<Scalars['String']['output']>;
  organizer?: Maybe<User>;
  organizer_company?: Maybe<Scalars['String']['output']>;
  organizer_company_participants?: Maybe<Array<Maybe<MeetingParticipant>>>;
  organizer_id?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  phone_country?: Maybe<Scalars['String']['output']>;
  phone_link?: Maybe<Scalars['String']['output']>;
  phone_pin?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  project_connection_id?: Maybe<Scalars['String']['output']>;
  project_request?: Maybe<ProjectRequest>;
  start_time?: Maybe<Scalars['Date']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type MeetingParticipant = {
  __typename?: 'MeetingParticipant';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type Message = {
  __typename?: 'Message';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type MessageEdge = {
  __typename?: 'MessageEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Message>;
};

export type MessagesConnection = {
  __typename?: 'MessagesConnection';
  edges?: Maybe<Array<Maybe<MessageEdge>>>;
  pageInfo?: Maybe<MessagesPageInfo>;
};

export type MessagesPageInfo = {
  __typename?: 'MessagesPageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
};

export type Milestone = {
  __typename?: 'Milestone';
  amount?: Maybe<Scalars['Float']['output']>;
  biotech_invoice_item?: Maybe<BiotechInvoiceItem>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  payment_status?: Maybe<Scalars['String']['output']>;
  project_attachments?: Maybe<Array<Maybe<ProjectAttachment>>>;
  quote?: Maybe<Quote>;
  quote_id?: Maybe<Scalars['String']['output']>;
  short_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  timeline?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  vendor_payment_status?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptProjectConnection?: Maybe<ProjectConnection>;
  acceptQuote?: Maybe<Quote>;
  addMoreParticipants?: Maybe<Array<Maybe<MeetingParticipant>>>;
  addProjectCollaborator?: Maybe<User>;
  answerInvitation?: Maybe<SubmitAttendanceResp>;
  cancelAiTask?: Maybe<SourcingTask>;
  cancelInvitation?: Maybe<User>;
  cancelSubscription?: Maybe<Scalars['Boolean']['output']>;
  changePassword?: Maybe<Scalars['Boolean']['output']>;
  confirmEditSourcingDetails?: Maybe<SourcingSession>;
  confirmEditSourcingSubspecialties?: Maybe<SourcingSession>;
  confirmRemoveSourcingSession?: Maybe<SourcingSession>;
  /** @deprecated Deprecated feature. */
  createBiotechInviteVendor?: Maybe<BiotechInviteVendor>;
  createBlanketPurchaseOrder?: Maybe<BlanketPurchaseOrder>;
  createCertificationTag?: Maybe<CertificationTag>;
  createChat?: Maybe<Chat>;
  createCustomer: Customer;
  createLabSpecialization?: Maybe<LabSpecialization>;
  createMeetingEvent?: Maybe<MeetingEvent>;
  createProjectDeclineFeedback?: Maybe<ProjectDeclineFeedback>;
  createProjectRequest?: Maybe<ProjectRequest>;
  createProjectRequestComment?: Maybe<ProjectRequestComment>;
  createQuote?: Maybe<Quote>;
  createVendorSurvey?: Maybe<CroDbVendorSurvey>;
  deactivateCollaborator?: Maybe<User>;
  declineQuote?: Maybe<Quote>;
  declinedProjectConnection?: Maybe<ProjectConnection>;
  disconnectOauth2?: Maybe<Scalars['Boolean']['output']>;
  draftQuoteReview?: Maybe<Array<Maybe<ReviewAnswer>>>;
  extractPdfRfp?: Maybe<SourcingSession>;
  forgotPassword?: Maybe<Scalars['Boolean']['output']>;
  inviteCollaborator?: Maybe<User>;
  inviteCollaborators?: Maybe<Array<Maybe<User>>>;
  /** @deprecated Use `inviteCollaborator`. */
  inviteCustomer?: Maybe<Customer>;
  inviteProjectCollaboratorViaEmail?: Maybe<User>;
  /** @deprecated Use `inviteCollaborator`. */
  inviteVendorMember?: Maybe<VendorMember>;
  markMilestoneAsCompleted?: Maybe<MarkMilestoneCompleteResponse>;
  markNotificationAsRead?: Maybe<Notification>;
  markNotificationsInProjectAsRead?: Maybe<Array<Maybe<Notification>>>;
  markQuoteNotificationsAsRead?: Maybe<Array<Maybe<Notification>>>;
  onboardCustomerPersonalInfo?: Maybe<Customer>;
  payByBlanketPurchaseOrder?: Maybe<Milestone>;
  payByPurchaseOrder?: Maybe<Milestone>;
  reactivateCollaborator?: Maybe<User>;
  refreshJWT?: Maybe<AuthResponse>;
  removeAttachment?: Maybe<ProjectAttachment>;
  removeBlanketPurchaseOrder?: Maybe<BlanketPurchaseOrder>;
  removeCompanyAttachment?: Maybe<CompanyAttachment>;
  removeGuest?: Maybe<Scalars['Boolean']['output']>;
  removeMeetingEvent?: Maybe<MeetingEvent>;
  removeParticipant?: Maybe<Scalars['Boolean']['output']>;
  removeProjectCollaborator?: Maybe<User>;
  removeProjectRequestCollaborator?: Maybe<ProjectRequestCollaborator>;
  removeSourcedCroFromShortlist?: Maybe<SourcedCro>;
  resendExpiredQuote?: Maybe<Quote>;
  resendInvitation?: Maybe<User>;
  resendVendorMemberInviteByBiotech?: Maybe<Scalars['Boolean']['output']>;
  resetPassword?: Maybe<Scalars['Boolean']['output']>;
  resumeSubscription?: Maybe<Scalars['Boolean']['output']>;
  saveAvailabilityRules?: Maybe<Availability>;
  scheduleSubscriptionChange?: Maybe<Scalars['Boolean']['output']>;
  sendGuestReminder?: Maybe<Scalars['Boolean']['output']>;
  sendMessage?: Maybe<Message>;
  sendSourcingShortlist?: Maybe<Scalars['Boolean']['output']>;
  setProjectRequestPublic?: Maybe<ProjectRequest>;
  shortlistSourcedCro?: Maybe<SourcedCro>;
  signInUser: AuthResponse;
  signUpUser: AuthResponse;
  skipAddCertificationTag?: Maybe<VendorCompany>;
  skipAddLabSpecialization?: Maybe<VendorCompany>;
  sourceCros?: Maybe<SourcingTask>;
  sourceRfpSpecialties?: Maybe<SourcingTask>;
  startChat?: Maybe<Scalars['Boolean']['output']>;
  submitContactUsTicket?: Maybe<Scalars['Boolean']['output']>;
  submitCroInterest?: Maybe<Scalars['Boolean']['output']>;
  submitVendorOnboarding?: Maybe<Vendor>;
  submitVendorSurvey?: Maybe<CroDbVendorSurvey>;
  subscribeEmailUpdates?: Maybe<Scalars['Boolean']['output']>;
  transferBiotechOwnership?: Maybe<User>;
  transferVendorCompanyOwnership?: Maybe<User>;
  updateBiotech?: Maybe<Biotech>;
  updateBiotechProfile?: Maybe<Biotech>;
  updateBlanketPurchaseOrder?: Maybe<BlanketPurchaseOrder>;
  updateCollaboratorRole?: Maybe<User>;
  updateCustomer: Customer;
  updateMeetingDetails?: Maybe<MeetingEvent>;
  updateMeetingEventSharable?: Maybe<MeetingEvent>;
  updateProjectRequestCollaborators?: Maybe<Array<Maybe<ProjectRequestCollaborator>>>;
  updateQuote?: Maybe<Quote>;
  updateUserInfo?: Maybe<User>;
  updateVendorCompany?: Maybe<VendorCompany>;
  updateVendorCompanyCertificationTags?: Maybe<VendorCompany>;
  updateVendorCompanyLabSpecializations?: Maybe<VendorCompany>;
  updateVendorCompanyProfile?: Maybe<VendorCompany>;
  updateVendorMember?: Maybe<VendorMember>;
  updateVendorProfile?: Maybe<Vendor>;
  updateVendorUserProfile?: Maybe<Vendor>;
  uploadBiotechInvoicePaymentReceipt?: Maybe<BiotechInvoice>;
  uploadCompanyAttachment?: Maybe<CompanyAttachmentUploadResult>;
  uploadContract?: Maybe<UploadResult>;
  uploadDocuments?: Maybe<Array<Maybe<UploadResult>>>;
  verifyMilestoneAsCompleted?: Maybe<Milestone>;
  withdrawProjectRequest?: Maybe<ProjectRequest>;
};


export type MutationAcceptProjectConnectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationAcceptQuoteArgs = {
  id: Scalars['String']['input'];
};


export type MutationAddMoreParticipantsArgs = {
  cromatic_participants: Array<CromaticParticipantInput>;
  external_participants: Array<ExternalParticipantInput>;
  meeting_event_id: Scalars['String']['input'];
};


export type MutationAddProjectCollaboratorArgs = {
  project_connection_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationAnswerInvitationArgs = {
  answer: Scalars['String']['input'];
  email: Scalars['String']['input'];
  guest_token?: InputMaybe<Scalars['String']['input']>;
  meeting_token: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelAiTaskArgs = {
  sourcing_session_id: Scalars['String']['input'];
  task_id: Scalars['String']['input'];
};


export type MutationCancelInvitationArgs = {
  user_id: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  new_password: Scalars['String']['input'];
  old_password: Scalars['String']['input'];
};


export type MutationConfirmEditSourcingDetailsArgs = {
  sourcing_session_id: Scalars['String']['input'];
};


export type MutationConfirmEditSourcingSubspecialtiesArgs = {
  sourcing_session_id: Scalars['String']['input'];
};


export type MutationConfirmRemoveSourcingSessionArgs = {
  sourcing_session_id: Scalars['String']['input'];
};


export type MutationCreateBiotechInviteVendorArgs = {
  company_name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  project_request_id: Scalars['String']['input'];
  website: Scalars['String']['input'];
};


export type MutationCreateBlanketPurchaseOrderArgs = {
  amount: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  po_number: Scalars['String']['input'];
};


export type MutationCreateCertificationTagArgs = {
  full_name: Scalars['String']['input'];
};


export type MutationCreateChatArgs = {
  project_connection_id: Scalars['String']['input'];
};


export type MutationCreateCustomerArgs = {
  company_name: Scalars['String']['input'];
  job_title?: InputMaybe<Scalars['String']['input']>;
  team?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
};


export type MutationCreateLabSpecializationArgs = {
  full_name: Scalars['String']['input'];
};


export type MutationCreateMeetingEventArgs = {
  cromatic_participants: Array<CromaticParticipantInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  end_time: Scalars['String']['input'];
  external_participants: Array<ExternalParticipantInput>;
  is_sharable?: InputMaybe<Scalars['Boolean']['input']>;
  meeting_link?: InputMaybe<Scalars['String']['input']>;
  platform: Scalars['String']['input'];
  project_connection_id: Scalars['String']['input'];
  start_time: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateProjectDeclineFeedbackArgs = {
  project_connection_id: Scalars['String']['input'];
  project_decline_tag_ids: Array<InputMaybe<Scalars['String']['input']>>;
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateProjectRequestArgs = {
  company_name?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  existing_vendor_contact_description?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  in_contact_with_vendor: Scalars['Boolean']['input'];
  is_private: Scalars['Boolean']['input'];
  last_name?: InputMaybe<Scalars['String']['input']>;
  max_budget?: InputMaybe<Scalars['Int']['input']>;
  objective_description: Scalars['String']['input'];
  preparation_description?: InputMaybe<Scalars['String']['input']>;
  project_challenge_description?: InputMaybe<Scalars['String']['input']>;
  project_deadline_requirement?: InputMaybe<Scalars['String']['input']>;
  project_request_collaborators?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  project_start_time_requirement?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  vendor_location_requirement?: InputMaybe<Scalars['String']['input']>;
  vendor_requirement: Scalars['String']['input'];
  vendor_search_timeframe: Scalars['String']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateProjectRequestCommentArgs = {
  content: Scalars['String']['input'];
  project_request_id: Scalars['String']['input'];
};


export type MutationCreateQuoteArgs = {
  amount: Scalars['Float']['input'];
  milestones?: InputMaybe<Array<CreateMilestoneInput>>;
  project_connection_id: Scalars['String']['input'];
  send_to_biotech?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationCreateVendorSurveyArgs = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  certifications?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  company_description: Scalars['String']['input'];
  company_ipo_status: Scalars['String']['input'];
  company_name: Scalars['String']['input'];
  company_revenue: Scalars['String']['input'];
  company_size: Scalars['String']['input'];
  company_types: Array<Scalars['String']['input']>;
  countries: Array<Scalars['String']['input']>;
  custom_specialties?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  email: Scalars['String']['input'];
  logo: Scalars['Upload']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  products?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  subspecialty_ids: Array<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  website: Scalars['String']['input'];
};


export type MutationDeactivateCollaboratorArgs = {
  user_id: Scalars['String']['input'];
};


export type MutationDeclineQuoteArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeclinedProjectConnectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDisconnectOauth2Args = {
  provider: Scalars['String']['input'];
};


export type MutationDraftQuoteReviewArgs = {
  input?: InputMaybe<Array<ReviewInput>>;
  is_final_step?: InputMaybe<Scalars['Boolean']['input']>;
  quote_id: Scalars['String']['input'];
};


export type MutationExtractPdfRfpArgs = {
  file: Scalars['Upload']['input'];
  sourcing_session_id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationForgotPasswordArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
};


export type MutationInviteCollaboratorArgs = {
  custom_message?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};


export type MutationInviteCollaboratorsArgs = {
  collaborators: Array<InviteCollaboratorInput>;
};


export type MutationInviteCustomerArgs = {
  custom_message?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
};


export type MutationInviteProjectCollaboratorViaEmailArgs = {
  custom_message?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  project_connection_id: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};


export type MutationInviteVendorMemberArgs = {
  custom_message?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
};


export type MutationMarkMilestoneAsCompletedArgs = {
  files?: InputMaybe<Array<InputMaybe<Scalars['Upload']['input']>>>;
  id: Scalars['String']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationMarkNotificationsInProjectAsReadArgs = {
  project_connection_id: Scalars['String']['input'];
};


export type MutationMarkQuoteNotificationsAsReadArgs = {
  quote_id: Scalars['String']['input'];
};


export type MutationOnboardCustomerPersonalInfoArgs = {
  country_code?: InputMaybe<Scalars['String']['input']>;
  first_name: Scalars['String']['input'];
  job_title: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  phone_number?: InputMaybe<Scalars['String']['input']>;
  team: Scalars['String']['input'];
};


export type MutationPayByBlanketPurchaseOrderArgs = {
  blanket_purchase_order_id: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationPayByPurchaseOrderArgs = {
  id: Scalars['String']['input'];
  po_number: Scalars['String']['input'];
};


export type MutationReactivateCollaboratorArgs = {
  user_id: Scalars['String']['input'];
};


export type MutationRemoveAttachmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveBlanketPurchaseOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveCompanyAttachmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveGuestArgs = {
  email: Scalars['String']['input'];
  meeting_event_id: Scalars['String']['input'];
};


export type MutationRemoveMeetingEventArgs = {
  meeting_event_id: Scalars['String']['input'];
};


export type MutationRemoveParticipantArgs = {
  meeting_event_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationRemoveProjectCollaboratorArgs = {
  project_connection_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationRemoveProjectRequestCollaboratorArgs = {
  customer_id: Scalars['String']['input'];
  project_request_id: Scalars['String']['input'];
};


export type MutationRemoveSourcedCroFromShortlistArgs = {
  sourced_cro_id: Scalars['String']['input'];
  sourcing_session_id: Scalars['String']['input'];
};


export type MutationResendExpiredQuoteArgs = {
  id: Scalars['String']['input'];
};


export type MutationResendInvitationArgs = {
  user_id: Scalars['String']['input'];
};


export type MutationResendVendorMemberInviteByBiotechArgs = {
  biotech_invite_vendor_id: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  new_password?: InputMaybe<Scalars['String']['input']>;
  reset_token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSaveAvailabilityRulesArgs = {
  input: SaveAvailabilityRulesInput;
};


export type MutationScheduleSubscriptionChangeArgs = {
  price_id: Scalars['String']['input'];
};


export type MutationSendGuestReminderArgs = {
  email: Scalars['String']['input'];
  meeting_event_id: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String']['input'];
  project_connection_id: Scalars['String']['input'];
};


export type MutationSendSourcingShortlistArgs = {
  sourcing_session_id: Scalars['String']['input'];
};


export type MutationSetProjectRequestPublicArgs = {
  project_request_id: Scalars['String']['input'];
};


export type MutationShortlistSourcedCroArgs = {
  sourced_cro_id: Scalars['String']['input'];
  sourcing_session_id: Scalars['String']['input'];
};


export type MutationSignInUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
};


export type MutationSourceCrosArgs = {
  names: Array<Scalars['String']['input']>;
  sourcing_session_id: Scalars['String']['input'];
};


export type MutationSourceRfpSpecialtiesArgs = {
  preparation_details: Scalars['String']['input'];
  project_desc: Scalars['String']['input'];
  project_title: Scalars['String']['input'];
  sourcing_session_id?: InputMaybe<Scalars['String']['input']>;
  vendor_requirement: Scalars['String']['input'];
};


export type MutationStartChatArgs = {
  project_connection_id: Scalars['String']['input'];
};


export type MutationSubmitContactUsTicketArgs = {
  payload: SubmitContactUsTicketPayload;
};


export type MutationSubmitCroInterestArgs = {
  company_name: Scalars['String']['input'];
  company_type: Scalars['String']['input'];
  country_code?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  interest: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  phone_number?: InputMaybe<Scalars['String']['input']>;
  service: Scalars['String']['input'];
};


export type MutationSubmitVendorOnboardingArgs = {
  onboarding_step: VendorOnboardingStep;
  payload: VendorOnboardingPayload;
};


export type MutationSubmitVendorSurveyArgs = {
  payload: VendorSurveyPayload;
  step: VendorSurveyStep;
  survey_id?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSubscribeEmailUpdatesArgs = {
  email: Scalars['String']['input'];
};


export type MutationTransferBiotechOwnershipArgs = {
  biotech_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationTransferVendorCompanyOwnershipArgs = {
  user_id: Scalars['String']['input'];
  vendor_company_id: Scalars['String']['input'];
};


export type MutationUpdateBiotechArgs = {
  about?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  biotech_extra_info?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  facebook_url?: InputMaybe<Scalars['String']['input']>;
  founded_year?: InputMaybe<Scalars['String']['input']>;
  linkedin_url?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  team_size?: InputMaybe<Scalars['String']['input']>;
  twitter_url?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateBiotechProfileArgs = {
  about?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  team_size?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateBlanketPurchaseOrderArgs = {
  amount: Scalars['Float']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  po_number: Scalars['String']['input'];
};


export type MutationUpdateCollaboratorRoleArgs = {
  role_type: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationUpdateCustomerArgs = {
  has_setup_profile?: InputMaybe<Scalars['Boolean']['input']>;
  job_title?: InputMaybe<Scalars['String']['input']>;
  team?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateMeetingDetailsArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  end_time?: InputMaybe<Scalars['String']['input']>;
  meeting_event_id: Scalars['String']['input'];
  meeting_link?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  start_time?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateMeetingEventSharableArgs = {
  is_sharable: Scalars['Boolean']['input'];
  meeting_event_id: Scalars['String']['input'];
};


export type MutationUpdateProjectRequestCollaboratorsArgs = {
  customer_ids: Array<InputMaybe<Scalars['String']['input']>>;
  project_request_id: Scalars['String']['input'];
};


export type MutationUpdateQuoteArgs = {
  amount: Scalars['Float']['input'];
  id: Scalars['String']['input'];
  milestones: Array<UpdateMilestoneInput>;
  send_to_biotech?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateUserInfoArgs = {
  country_code?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  phone_number?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  cro_extra_info?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  facebook_url?: InputMaybe<Scalars['String']['input']>;
  founded_year?: InputMaybe<Scalars['String']['input']>;
  google_scholar_url?: InputMaybe<Scalars['String']['input']>;
  linkedin_url?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  principal_investigator_name?: InputMaybe<Scalars['String']['input']>;
  project_completed_per_year?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  team_size?: InputMaybe<Scalars['String']['input']>;
  twitter_url?: InputMaybe<Scalars['String']['input']>;
  university_name?: InputMaybe<Scalars['String']['input']>;
  vendor_type?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateVendorCompanyCertificationTagsArgs = {
  certification_tag_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  new_certification_tag_names?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type MutationUpdateVendorCompanyLabSpecializationsArgs = {
  lab_specialization_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  new_lab_specialization_names?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type MutationUpdateVendorCompanyProfileArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  certification_tag_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  founded_year?: InputMaybe<Scalars['String']['input']>;
  lab_specialization_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  new_certification_tag_names?: InputMaybe<Array<Scalars['String']['input']>>;
  new_lab_specialization_names?: InputMaybe<Array<Scalars['String']['input']>>;
  project_completed_per_year?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  team_size?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  zipcode?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateVendorMemberArgs = {
  department?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateVendorProfileArgs = {
  payload: UpdateVendorProfilePayload;
};


export type MutationUpdateVendorUserProfileArgs = {
  payload: UpdateVendorUserProfilePayload;
};


export type MutationUploadBiotechInvoicePaymentReceiptArgs = {
  file: Scalars['Upload']['input'];
  id: Scalars['String']['input'];
};


export type MutationUploadCompanyAttachmentArgs = {
  file: Scalars['Upload']['input'];
  vendor_company_id: Scalars['String']['input'];
};


export type MutationUploadContractArgs = {
  file: Scalars['Upload']['input'];
  project_connection_id: Scalars['String']['input'];
};


export type MutationUploadDocumentsArgs = {
  files: Array<InputMaybe<Scalars['Upload']['input']>>;
  project_connection_id: Scalars['String']['input'];
};


export type MutationVerifyMilestoneAsCompletedArgs = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationWithdrawProjectRequestArgs = {
  project_request_id: Scalars['String']['input'];
};

export type News = {
  __typename?: 'News';
  cover_img_url?: Maybe<Scalars['String']['output']>;
  excerpt?: Maybe<Scalars['String']['output']>;
  is_featured?: Maybe<Scalars['Boolean']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  published_at?: Maybe<Scalars['Date']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Notification = {
  __typename?: 'Notification';
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  notification_type?: Maybe<Scalars['String']['output']>;
  params?: Maybe<Scalars['JSON']['output']>;
  read_at?: Maybe<Scalars['Date']['output']>;
  recipient?: Maybe<User>;
  recipient_id?: Maybe<Scalars['String']['output']>;
  sender?: Maybe<User>;
  sender_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges?: Maybe<Array<Maybe<NotificationEdge>>>;
  pageInfo?: Maybe<NotificationPageInfo>;
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Notification>;
};

export type NotificationPageInfo = {
  __typename?: 'NotificationPageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  display_brand?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  last_4?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Perk = {
  __typename?: 'Perk';
  created_at?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  expired_at?: Maybe<Scalars['Date']['output']>;
  external_url?: Maybe<Scalars['String']['output']>;
  how_to_redeem?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  perk_category?: Maybe<PerkCategory>;
  perk_category_id?: Maybe<Scalars['String']['output']>;
  reward_description?: Maybe<Scalars['String']['output']>;
  terms?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type PerkCategory = {
  __typename?: 'PerkCategory';
  created_at?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  perks?: Maybe<Array<Maybe<Perk>>>;
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type ProjectAttachment = {
  __typename?: 'ProjectAttachment';
  byte_size?: Maybe<Scalars['Float']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  document_type?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  formatted_filesize?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  milestone?: Maybe<Milestone>;
  milestone_id?: Maybe<Scalars['String']['output']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']['output']>;
  signed_url?: Maybe<Scalars['String']['output']>;
  zoho_editor_url?: Maybe<Scalars['String']['output']>;
};

export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  biotech_invite_vendor?: Maybe<BiotechInviteVendor>;
  biotech_invite_vendor_id?: Maybe<Scalars['String']['output']>;
  chat?: Maybe<Chat>;
  collaborators_not_invited?: Maybe<Array<Maybe<User>>>;
  created_at?: Maybe<Scalars['Date']['output']>;
  customer_connections?: Maybe<Array<Maybe<CustomerConnection>>>;
  documents?: Maybe<Array<Maybe<ProjectAttachment>>>;
  expired_at?: Maybe<Scalars['Date']['output']>;
  external_collaborators?: Maybe<Array<Maybe<User>>>;
  final_contract?: Maybe<ProjectAttachment>;
  final_contract_uploaded_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  internal_collaborators?: Maybe<Array<Maybe<User>>>;
  messages?: Maybe<Array<Maybe<Message>>>;
  project_attachments?: Maybe<Array<Maybe<ProjectAttachment>>>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']['output']>;
  quotes?: Maybe<Array<Maybe<Quote>>>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
  vendor_display_status?: Maybe<Scalars['String']['output']>;
  vendor_member_connections?: Maybe<Array<Maybe<VendorMemberConnection>>>;
  vendor_status?: Maybe<Scalars['String']['output']>;
};

export type ProjectConnectionFilter = {
  status?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectDeclineFeedback = {
  __typename?: 'ProjectDeclineFeedback';
  id?: Maybe<Scalars['String']['output']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
};

export type ProjectDeclineTag = {
  __typename?: 'ProjectDeclineTag';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ProjectDeclineTagConnection = {
  __typename?: 'ProjectDeclineTagConnection';
  id?: Maybe<Scalars['String']['output']>;
  project_decline_feedback?: Maybe<ProjectDeclineFeedback>;
  project_decline_feedback_id?: Maybe<Scalars['String']['output']>;
  project_decline_tag?: Maybe<ProjectDeclineTag>;
  project_decline_tag_id?: Maybe<Scalars['String']['output']>;
};

export type ProjectRequest = {
  __typename?: 'ProjectRequest';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  customer?: Maybe<Customer>;
  customer_id?: Maybe<Scalars['String']['output']>;
  existing_vendor_contact_description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  in_contact_with_vendor: Scalars['Boolean']['output'];
  is_private: Scalars['Boolean']['output'];
  is_white_glove?: Maybe<Scalars['Boolean']['output']>;
  max_budget: Scalars['Int']['output'];
  objective_description: Scalars['String']['output'];
  preparation_description?: Maybe<Scalars['String']['output']>;
  project_challenge_description?: Maybe<Scalars['String']['output']>;
  project_connections?: Maybe<Array<Maybe<ProjectConnection>>>;
  project_deadline_requirement?: Maybe<Scalars['String']['output']>;
  project_request_collaborators?: Maybe<Array<Maybe<ProjectRequestCollaborator>>>;
  project_request_comments?: Maybe<Array<Maybe<ProjectRequestComment>>>;
  project_start_time_requirement?: Maybe<Scalars['String']['output']>;
  sourcing_session_id?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['Date']['output']>;
  vendor_location_requirement?: Maybe<Scalars['String']['output']>;
  vendor_requirement: Scalars['String']['output'];
  vendor_search_timeframe: Scalars['String']['output'];
};


export type ProjectRequestProject_ConnectionsArgs = {
  filter?: InputMaybe<ProjectRequestProjectConnectionFilter>;
};

export type ProjectRequestCollaborator = {
  __typename?: 'ProjectRequestCollaborator';
  created_at?: Maybe<Scalars['Date']['output']>;
  customer?: Maybe<Customer>;
  customer_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type ProjectRequestComment = {
  __typename?: 'ProjectRequestComment';
  content?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type ProjectRequestProjectConnectionFilter = {
  collaboration_status?: InputMaybe<Scalars['String']['input']>;
  vendor_status?: InputMaybe<Scalars['String']['input']>;
};

export type Pseudonyms = {
  __typename?: 'Pseudonyms';
  country_code?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  phone_number?: Maybe<Scalars['String']['output']>;
};

export type PubMeeting = {
  __typename?: 'PubMeeting';
  end_time?: Maybe<Scalars['String']['output']>;
  guest_info?: Maybe<PubMeetingGuestInfo>;
  id?: Maybe<Scalars['String']['output']>;
  is_ended?: Maybe<Scalars['Boolean']['output']>;
  meeting_link?: Maybe<Scalars['String']['output']>;
  organizer_company_name?: Maybe<Scalars['String']['output']>;
  organizer_name?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  project_title?: Maybe<Scalars['String']['output']>;
  start_time?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PubMeetingGuestInfo = {
  __typename?: 'PubMeetingGuestInfo';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type PubRvsp = {
  __typename?: 'PubRVSP';
  guest_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  meeting_title?: Maybe<Scalars['String']['output']>;
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']['output']>;
  biotech_invoice?: Maybe<BiotechInvoice>;
  biotech_invoice_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  po_number?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type Query = {
  __typename?: 'Query';
  availability?: Maybe<Availability>;
  availableDateTimeSlots?: Maybe<Array<Maybe<DateWithTimeSlots>>>;
  billingInfo?: Maybe<BillingInfo>;
  billingInvoices?: Maybe<Array<Maybe<BillingInvoice>>>;
  billingPortalUrl?: Maybe<Scalars['String']['output']>;
  bioInvitedProjectConnections?: Maybe<Array<Maybe<ProjectConnection>>>;
  biotech?: Maybe<Biotech>;
  biotechInviteVendors?: Maybe<Array<Maybe<BiotechInviteVendor>>>;
  biotechInvoice?: Maybe<BiotechInvoice>;
  biotechInvoices?: Maybe<Array<Maybe<BiotechInvoice>>>;
  blanketPurchaseOrders?: Maybe<Array<Maybe<BlanketPurchaseOrder>>>;
  casbinPermission?: Maybe<Scalars['String']['output']>;
  collaborators?: Maybe<Array<Maybe<User>>>;
  companyProfile?: Maybe<CompanyProfile>;
  croDbSpecialties?: Maybe<Array<Maybe<CroDbSpecialty>>>;
  croDbSpecialty?: Maybe<CroDbSpecialty>;
  croDbSubspecialties?: Maybe<Array<Maybe<CroDbSubspecialty>>>;
  croDbVendorCompany?: Maybe<CroDbVendorCompany>;
  customer?: Maybe<Customer>;
  featuredNews?: Maybe<Array<Maybe<News>>>;
  googleCalendarAuthorizationUri?: Maybe<Scalars['String']['output']>;
  googleCalendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
  initialVendorSurveyData?: Maybe<InitialVendorSurveyData>;
  invoice?: Maybe<Invoice>;
  invoiceCheckoutUrl?: Maybe<Scalars['String']['output']>;
  invoices?: Maybe<Array<Maybe<Invoice>>>;
  meetingEvents?: Maybe<Array<Maybe<MeetingEvent>>>;
  meetingFormAttendees?: Maybe<Array<Maybe<User>>>;
  microsoftCalendarAuthorizationUri?: Maybe<Scalars['String']['output']>;
  microsoftCalendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
  milestone?: Maybe<Milestone>;
  milestoneCheckoutUrl?: Maybe<Scalars['String']['output']>;
  moreAttendeesToAdd?: Maybe<Array<Maybe<User>>>;
  news?: Maybe<Array<Maybe<News>>>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
  notificationsConnection?: Maybe<NotificationConnection>;
  perkCategories?: Maybe<Array<Maybe<PerkCategory>>>;
  projectConnection?: Maybe<ProjectConnection>;
  projectConnections?: Maybe<Array<Maybe<ProjectConnection>>>;
  projectDeclineTags?: Maybe<Array<Maybe<ProjectDeclineTag>>>;
  projectRequest?: Maybe<ProjectRequest>;
  projectRequests?: Maybe<Array<Maybe<ProjectRequest>>>;
  pubMeeting?: Maybe<PubMeeting>;
  quote?: Maybe<Quote>;
  quoteReview?: Maybe<Review>;
  quoteReviewQuestions?: Maybe<Array<Maybe<ReviewQuestion>>>;
  searchCertificationTags?: Maybe<Array<Maybe<CertificationTag>>>;
  searchLabSpecializations?: Maybe<Array<Maybe<LabSpecialization>>>;
  signedUrl?: Maybe<Scalars['String']['output']>;
  sourcedCros?: Maybe<SourcedCroConnection>;
  sourcererLiteSearch?: Maybe<SourcererLiteSearchPaginatedResult>;
  sourcingSession?: Maybe<SourcingSession>;
  sourcingSessions?: Maybe<Array<Maybe<SourcingSession>>>;
  stripePricingTableId?: Maybe<Scalars['String']['output']>;
  stripeSetupIntent?: Maybe<Scalars['String']['output']>;
  subscriptionCheckoutSessionUrl?: Maybe<Scalars['String']['output']>;
  subscriptionPlans: Array<SubscriptionPlan>;
  suggestedCertificationTags?: Maybe<Array<Maybe<CertificationTag>>>;
  suggestedLabSpecializations?: Maybe<Array<Maybe<LabSpecialization>>>;
  upcomingMeetingEvents?: Maybe<Array<Maybe<MeetingEvent>>>;
  user?: Maybe<User>;
  vendor?: Maybe<Vendor>;
  vendorBillingInfo?: Maybe<BillingInfo>;
  vendorCompany?: Maybe<VendorCompany>;
  vendorCompanyStripeAccount?: Maybe<StripeAccountData>;
  vendorCompanyStripeConnectUrl?: Maybe<Scalars['String']['output']>;
  vendorListingSubscriptionCheckoutLink?: Maybe<Scalars['String']['output']>;
  vendorMember?: Maybe<VendorMember>;
  vendorSurveyData?: Maybe<CroDbVendorSurvey>;
};


export type QueryAvailableDateTimeSlotsArgs = {
  attendee_user_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  duration_in_min: Scalars['Int']['input'];
  from: Scalars['String']['input'];
  meeting_event_id?: InputMaybe<Scalars['String']['input']>;
  timezone: Scalars['String']['input'];
  to: Scalars['String']['input'];
};


export type QueryBillingPortalUrlArgs = {
  return_url: Scalars['String']['input'];
};


export type QueryBioInvitedProjectConnectionsArgs = {
  project_request_id: Scalars['String']['input'];
};


export type QueryBiotechInviteVendorsArgs = {
  project_request_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBiotechInvoiceArgs = {
  id: Scalars['String']['input'];
};


export type QueryBiotechInvoicesArgs = {
  has_paid?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCollaboratorsArgs = {
  active_only?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryCroDbSpecialtyArgs = {
  name: Scalars['String']['input'];
};


export type QueryCroDbSubspecialtiesArgs = {
  filter?: InputMaybe<CroDbSubspecialtiesFilterInput>;
};


export type QueryCroDbVendorCompanyArgs = {
  id: Scalars['String']['input'];
};


export type QueryGoogleCalendarAuthorizationUriArgs = {
  redirect_url?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInitialVendorSurveyDataArgs = {
  token: Scalars['String']['input'];
};


export type QueryInvoiceArgs = {
  id: Scalars['String']['input'];
};


export type QueryInvoiceCheckoutUrlArgs = {
  cancel_url: Scalars['String']['input'];
  id: Scalars['String']['input'];
  success_url: Scalars['String']['input'];
};


export type QueryMeetingEventsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeetingFormAttendeesArgs = {
  project_connection_id: Scalars['String']['input'];
};


export type QueryMicrosoftCalendarAuthorizationUriArgs = {
  redirect_url?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMilestoneArgs = {
  id: Scalars['String']['input'];
};


export type QueryMilestoneCheckoutUrlArgs = {
  cancel_url: Scalars['String']['input'];
  id: Scalars['String']['input'];
  success_url: Scalars['String']['input'];
};


export type QueryMoreAttendeesToAddArgs = {
  meeting_event_id: Scalars['String']['input'];
};


export type QueryNotificationsArgs = {
  unread_only?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryNotificationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProjectConnectionArgs = {
  id: Scalars['String']['input'];
};


export type QueryProjectConnectionsArgs = {
  filter?: InputMaybe<ProjectConnectionFilter>;
};


export type QueryProjectRequestArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProjectRequestsArgs = {
  status?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryPubMeetingArgs = {
  guest_token?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
};


export type QueryQuoteArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  project_connection_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQuoteReviewArgs = {
  quote_id: Scalars['String']['input'];
};


export type QueryQuoteReviewQuestionsArgs = {
  quote_id: Scalars['String']['input'];
};


export type QuerySearchCertificationTagsArgs = {
  search_content?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchLabSpecializationsArgs = {
  search_content?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySignedUrlArgs = {
  key: Scalars['String']['input'];
};


export type QuerySourcedCrosArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filterCountryBy?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sourcing_session_id: Scalars['String']['input'];
};


export type QuerySourcererLiteSearchArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  disable_spellcheck?: InputMaybe<Scalars['Boolean']['input']>;
  filter_country_by?: InputMaybe<Scalars['String']['input']>;
  fingerprint?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  ip_address?: InputMaybe<Scalars['String']['input']>;
  keyword: Scalars['String']['input'];
  sort_by?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySourcingSessionArgs = {
  id: Scalars['String']['input'];
};


export type QuerySubscriptionCheckoutSessionUrlArgs = {
  cancel_url: Scalars['String']['input'];
  ga_client_id?: InputMaybe<Scalars['String']['input']>;
  price_id: Scalars['String']['input'];
  success_url: Scalars['String']['input'];
};


export type QueryUpcomingMeetingEventsArgs = {
  project_connection_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVendorCompanyStripeConnectUrlArgs = {
  refresh_url?: InputMaybe<Scalars['String']['input']>;
  return_url?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVendorListingSubscriptionCheckoutLinkArgs = {
  cancel_url: Scalars['String']['input'];
  ga_client_id?: InputMaybe<Scalars['String']['input']>;
  success_url: Scalars['String']['input'];
};


export type QueryVendorSurveyDataArgs = {
  survey_id?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
};

export type Quote = {
  __typename?: 'Quote';
  amount?: Maybe<Scalars['Float']['output']>;
  expired_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  milestones?: Maybe<Array<Maybe<Milestone>>>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']['output']>;
  quote_review?: Maybe<Review>;
  short_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  total_amount?: Maybe<Scalars['Float']['output']>;
  total_in_escrow?: Maybe<Scalars['Float']['output']>;
  total_milestones_paid?: Maybe<Scalars['Float']['output']>;
  total_payment?: Maybe<Scalars['Float']['output']>;
};

export type Review = {
  __typename?: 'Review';
  id?: Maybe<Scalars['String']['output']>;
  is_draft?: Maybe<Scalars['Boolean']['output']>;
  review_answers?: Maybe<Array<Maybe<ReviewAnswer>>>;
  review_question_set_id?: Maybe<Scalars['String']['output']>;
  review_questions?: Maybe<Array<Maybe<ReviewQuestion>>>;
};

export type ReviewAnswer = {
  __typename?: 'ReviewAnswer';
  answer_text?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  option_value?: Maybe<Scalars['String']['output']>;
  rating_value?: Maybe<Scalars['Int']['output']>;
  review_question_id?: Maybe<Scalars['String']['output']>;
};

export type ReviewInput = {
  answer_text?: InputMaybe<Scalars['String']['input']>;
  option_value?: InputMaybe<Scalars['String']['input']>;
  rating_value?: InputMaybe<Scalars['Int']['input']>;
  review_question_id: Scalars['String']['input'];
};

export type ReviewQuestion = {
  __typename?: 'ReviewQuestion';
  group_title?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  is_required?: Maybe<Scalars['Boolean']['output']>;
  ordinal?: Maybe<Scalars['Int']['output']>;
  question_text?: Maybe<Scalars['String']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  review_question_options?: Maybe<Array<Maybe<ReviewQuestionOption>>>;
  review_question_set_id?: Maybe<Scalars['String']['output']>;
};

export type ReviewQuestionOption = {
  __typename?: 'ReviewQuestionOption';
  id?: Maybe<Scalars['String']['output']>;
  option_text?: Maybe<Scalars['String']['output']>;
  ordinal?: Maybe<Scalars['Int']['output']>;
};

export type ReviewQuestionSet = {
  __typename?: 'ReviewQuestionSet';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type RuleInterval = {
  __typename?: 'RuleInterval';
  from: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export type RuleIntervalInput = {
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};

export type SaveAvailabilityRulesInput = {
  rules: Array<AvailabilityRuleInput>;
  timezone: Scalars['String']['input'];
};

export type SourceCroSubscriptionPayload = {
  __typename?: 'SourceCroSubscriptionPayload';
  data?: Maybe<SourcingSession>;
  sourcing_session_id?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  task_id?: Maybe<Scalars['String']['output']>;
};

export type SourceRfpSpecialtySubscriptionPayload = {
  __typename?: 'SourceRfpSpecialtySubscriptionPayload';
  data?: Maybe<SourcingSession>;
  sourcing_session_id?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  task_id?: Maybe<Scalars['String']['output']>;
};

export type SourcedCro = {
  __typename?: 'SourcedCro';
  id?: Maybe<Scalars['String']['output']>;
  is_shortlisted?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
  sourcing_session?: Maybe<SourcingSession>;
  sourcing_session_id?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
};

export type SourcedCroConnection = {
  __typename?: 'SourcedCroConnection';
  edges?: Maybe<Array<Maybe<SourcedCroEdge>>>;
  page_info?: Maybe<SourcedCroPageInfo>;
  top_match_vendor_company_ids?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type SourcedCroEdge = {
  __typename?: 'SourcedCroEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<SourcedCro>;
};

export type SourcedCroPageInfo = {
  __typename?: 'SourcedCroPageInfo';
  end_cursor: Scalars['String']['output'];
  has_next_page?: Maybe<Scalars['Boolean']['output']>;
  total_count?: Maybe<Scalars['Int']['output']>;
};

export type SourcererLiteSearchPaginatedResult = {
  __typename?: 'SourcererLiteSearchPaginatedResult';
  did_you_mean_suggestion?: Maybe<Scalars['String']['output']>;
  edges?: Maybe<Array<Maybe<SourcererLiteSearchResultEdge>>>;
  page_info?: Maybe<SourcererLiteSearchResultPageInfo>;
  related_subspecialty_names?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type SourcererLiteSearchResultEdge = {
  __typename?: 'SourcererLiteSearchResultEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<CroDbVendorCompany>;
};

export type SourcererLiteSearchResultPageInfo = {
  __typename?: 'SourcererLiteSearchResultPageInfo';
  end_cursor?: Maybe<Scalars['String']['output']>;
  has_next_page?: Maybe<Scalars['Boolean']['output']>;
  total_count?: Maybe<Scalars['Int']['output']>;
};

export type SourcingAttachment = {
  __typename?: 'SourcingAttachment';
  byte_size?: Maybe<Scalars['Float']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  formatted_filesize?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  signed_url?: Maybe<Scalars['String']['output']>;
  sourcing_session?: Maybe<SourcingSession>;
  sourcing_session_id?: Maybe<Scalars['String']['output']>;
};

export type SourcingSession = {
  __typename?: 'SourcingSession';
  biotech?: Maybe<Biotech>;
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  preparation_details?: Maybe<Scalars['String']['output']>;
  project_desc?: Maybe<Scalars['String']['output']>;
  project_title?: Maybe<Scalars['String']['output']>;
  shortlisted_cros?: Maybe<Array<Maybe<SourcedCro>>>;
  sourced_cros?: Maybe<Array<Maybe<SourcedCro>>>;
  sourcing_attachments?: Maybe<Array<Maybe<SourcingAttachment>>>;
  sourcing_subspecialties?: Maybe<Array<Maybe<SourcingSubspecialty>>>;
  task_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
  vendor_requirement?: Maybe<Scalars['String']['output']>;
};

export type SourcingSubspecialty = {
  __typename?: 'SourcingSubspecialty';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  related_subspecialties?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  sourcing_session?: Maybe<SourcingSession>;
  sourcing_session_id?: Maybe<Scalars['String']['output']>;
};

export type SourcingTask = {
  __typename?: 'SourcingTask';
  id?: Maybe<Scalars['String']['output']>;
  sourcing_session_id?: Maybe<Scalars['String']['output']>;
};

export type StripeAccountCapabilities = {
  __typename?: 'StripeAccountCapabilities';
  tax_reporting_us_1099_k?: Maybe<Scalars['String']['output']>;
  transfers?: Maybe<Scalars['String']['output']>;
};

export type StripeAccountData = {
  __typename?: 'StripeAccountData';
  capabilities?: Maybe<StripeAccountCapabilities>;
  charges_enabled?: Maybe<Scalars['Boolean']['output']>;
  details_submitted?: Maybe<Scalars['Boolean']['output']>;
  external_accounts?: Maybe<StripeExternalAccount>;
  payouts_enabled?: Maybe<Scalars['Boolean']['output']>;
  requirements?: Maybe<StripeAccountRequirements>;
};

export type StripeAccountRequirementError = {
  __typename?: 'StripeAccountRequirementError';
  code?: Maybe<Scalars['String']['output']>;
};

export type StripeAccountRequirements = {
  __typename?: 'StripeAccountRequirements';
  current_deadline?: Maybe<Scalars['String']['output']>;
  currently_due?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  disabled_reason?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<Maybe<StripeAccountRequirementError>>>;
  eventually_due?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  past_due?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  pending_verification?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type StripeExternalAccount = {
  __typename?: 'StripeExternalAccount';
  data?: Maybe<Array<Maybe<StripeExternalAccountData>>>;
};

export type StripeExternalAccountData = {
  __typename?: 'StripeExternalAccountData';
  bank_name?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  exp_month?: Maybe<Scalars['Int']['output']>;
  exp_year?: Maybe<Scalars['Int']['output']>;
  last4?: Maybe<Scalars['String']['output']>;
  object?: Maybe<Scalars['String']['output']>;
  routing_number?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type SubmitAttendanceResp = {
  __typename?: 'SubmitAttendanceResp';
  email?: Maybe<Scalars['String']['output']>;
  meeting_link?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type SubmitContactUsTicketPayload = {
  company_name: Scalars['String']['input'];
  company_type: Scalars['String']['input'];
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  remark?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage?: Maybe<MessageEdge>;
  newNotification?: Maybe<Notification>;
  sourceCros?: Maybe<SourceCroSubscriptionPayload>;
  sourceRfpSpecialties?: Maybe<SourceRfpSpecialtySubscriptionPayload>;
};


export type SubscriptionNewMessageArgs = {
  chat_id: Scalars['String']['input'];
};


export type SubscriptionSourceCrosArgs = {
  task_id: Scalars['String']['input'];
};


export type SubscriptionSourceRfpSpecialtiesArgs = {
  task_id: Scalars['String']['input'];
};

export type SubscriptionFeature = {
  __typename?: 'SubscriptionFeature';
  items: Array<SubscriptionFeatureItem>;
  name: Scalars['String']['output'];
};

export type SubscriptionFeatureItem = {
  __typename?: 'SubscriptionFeatureItem';
  description: Scalars['String']['output'];
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  description: Scalars['String']['output'];
  features: Array<SubscriptionFeature>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  prices: Array<SubscriptionPrice>;
};

export type SubscriptionPrice = {
  __typename?: 'SubscriptionPrice';
  amount_per_month?: Maybe<Scalars['Int']['output']>;
  discount_percentage?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  interval?: Maybe<Scalars['String']['output']>;
};

export type SubspecialtyNameWithWeight = {
  name: Scalars['String']['input'];
  weight: Scalars['Float']['input'];
};

export type UpdateMilestoneInput = {
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  timeline?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type UpdateVendorProfilePayload = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  company_description?: InputMaybe<Scalars['String']['input']>;
  company_ipo_status?: InputMaybe<Scalars['String']['input']>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  company_revenue?: InputMaybe<Scalars['String']['input']>;
  company_size?: InputMaybe<Scalars['String']['input']>;
  company_types?: InputMaybe<Array<Scalars['String']['input']>>;
  custom_specialties?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Scalars['String']['input']>;
  hq_locations?: InputMaybe<Array<Scalars['String']['input']>>;
  logo?: InputMaybe<Scalars['Upload']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  other_facility_locations?: InputMaybe<Array<Scalars['String']['input']>>;
  products?: InputMaybe<Array<Scalars['String']['input']>>;
  subspecialty_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVendorUserProfilePayload = {
  country_code?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  user_company_role?: InputMaybe<Scalars['String']['input']>;
};

export type UploadResult = {
  __typename?: 'UploadResult';
  data?: Maybe<ProjectAttachment>;
  error_message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  company_collaborator_role?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  country_code?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  customer?: Maybe<Customer>;
  deactivated_at?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  has_completed_onboarding?: Maybe<Scalars['Boolean']['output']>;
  has_setup_profile?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  /** @deprecated Use `deactivated_at`. */
  is_active?: Maybe<Scalars['Boolean']['output']>;
  is_connected_google?: Maybe<Scalars['Boolean']['output']>;
  is_connected_microsoft?: Maybe<Scalars['Boolean']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
  phone_number?: Maybe<Scalars['String']['output']>;
  pseudonyms?: Maybe<Pseudonyms>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  user_type?: Maybe<Scalars['String']['output']>;
  vendor_member?: Maybe<VendorMember>;
};

export type Vendor = {
  __typename?: 'Vendor';
  attachment_content_type?: Maybe<Scalars['String']['output']>;
  attachment_file_name?: Maybe<Scalars['String']['output']>;
  attachment_file_size?: Maybe<Scalars['Int']['output']>;
  attachment_key?: Maybe<Scalars['String']['output']>;
  certifications?: Maybe<Array<Scalars['String']['output']>>;
  company_description?: Maybe<Scalars['String']['output']>;
  company_ipo_status?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  company_revenue?: Maybe<Scalars['String']['output']>;
  company_size?: Maybe<Scalars['String']['output']>;
  company_types?: Maybe<Array<Scalars['String']['output']>>;
  custom_specialties?: Maybe<Array<Scalars['String']['output']>>;
  department?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  has_active_subscription?: Maybe<Scalars['Boolean']['output']>;
  hq_locations?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['String']['output'];
  is_profile_approved?: Maybe<Scalars['Boolean']['output']>;
  logo_url?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  onboarding_step?: Maybe<VendorOnboardingStep>;
  other_facility_locations?: Maybe<Array<Scalars['String']['output']>>;
  products?: Maybe<Array<Scalars['String']['output']>>;
  stripe_subscription_id?: Maybe<Scalars['String']['output']>;
  subscription_status?: Maybe<Scalars['String']['output']>;
  subspecialty_ids?: Maybe<Array<Scalars['String']['output']>>;
  user?: Maybe<User>;
  user_company_role?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type VendorCompany = {
  __typename?: 'VendorCompany';
  address?: Maybe<Scalars['String']['output']>;
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  certification_tags?: Maybe<Array<Maybe<CertificationTag>>>;
  chats?: Maybe<Array<Maybe<Chat>>>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  cro_extra_info?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  facebook_url?: Maybe<Scalars['String']['output']>;
  founded_year?: Maybe<Scalars['String']['output']>;
  google_scholar_url?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invited_by?: Maybe<Scalars['String']['output']>;
  is_on_marketplace?: Maybe<Scalars['Boolean']['output']>;
  lab_specializations?: Maybe<Array<Maybe<LabSpecialization>>>;
  linkedin_url?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  primary_members?: Maybe<Array<Maybe<VendorMember>>>;
  principal_investigator_name?: Maybe<Scalars['String']['output']>;
  project_completed_per_year?: Maybe<Scalars['String']['output']>;
  project_connections?: Maybe<Array<Maybe<ProjectConnection>>>;
  skip_certification_tag?: Maybe<Scalars['Boolean']['output']>;
  skip_lab_specialization?: Maybe<Scalars['Boolean']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  stripe_account?: Maybe<Scalars['String']['output']>;
  team_size?: Maybe<Scalars['String']['output']>;
  twitter_url?: Maybe<Scalars['String']['output']>;
  university_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  vendor_members?: Maybe<Array<Maybe<VendorMember>>>;
  vendor_type?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  zipcode?: Maybe<Scalars['String']['output']>;
};

export type VendorMember = {
  __typename?: 'VendorMember';
  created_at?: Maybe<Scalars['Date']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']['output']>;
  vendor_member_connections?: Maybe<Array<Maybe<VendorMemberConnection>>>;
};

export type VendorMemberConnection = {
  __typename?: 'VendorMemberConnection';
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  vendor_member?: Maybe<VendorMember>;
  vendor_member_id?: Maybe<Scalars['String']['output']>;
};

export type VendorOnboardingPayload = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  company_description?: InputMaybe<Scalars['String']['input']>;
  company_ipo_status?: InputMaybe<Scalars['String']['input']>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  company_revenue?: InputMaybe<Scalars['String']['input']>;
  company_size?: InputMaybe<Scalars['String']['input']>;
  company_types?: InputMaybe<Array<Scalars['String']['input']>>;
  custom_specialties?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Scalars['String']['input']>;
  hq_locations?: InputMaybe<Array<Scalars['String']['input']>>;
  logo?: InputMaybe<Scalars['Upload']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  other_facility_locations?: InputMaybe<Array<Scalars['String']['input']>>;
  products?: InputMaybe<Array<Scalars['String']['input']>>;
  subspecialty_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  user_company_role?: InputMaybe<Scalars['String']['input']>;
  user_name?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export enum VendorOnboardingStep {
  AdditionalInformation = 'ADDITIONAL_INFORMATION',
  CompanyDetails = 'COMPANY_DETAILS',
  CompanyInformation = 'COMPANY_INFORMATION',
  Intro = 'INTRO',
  Services = 'SERVICES',
  Subscription = 'SUBSCRIPTION',
  ThankYou = 'THANK_YOU'
}

export type VendorSurveyPayload = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  certifications?: InputMaybe<Array<Scalars['String']['input']>>;
  company_description?: InputMaybe<Scalars['String']['input']>;
  company_ipo_status?: InputMaybe<Scalars['String']['input']>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  company_revenue?: InputMaybe<Scalars['String']['input']>;
  company_size?: InputMaybe<Scalars['String']['input']>;
  company_types?: InputMaybe<Array<Scalars['String']['input']>>;
  countries?: InputMaybe<Array<Scalars['String']['input']>>;
  custom_specialties?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Scalars['String']['input']>;
  hq_locations?: InputMaybe<Array<Scalars['String']['input']>>;
  logo?: InputMaybe<Scalars['Upload']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  products?: InputMaybe<Array<Scalars['String']['input']>>;
  respondent_company_role?: InputMaybe<Scalars['String']['input']>;
  respondent_name?: InputMaybe<Scalars['String']['input']>;
  subspecialty_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export enum VendorSurveyStep {
  AdditionalInformation = 'ADDITIONAL_INFORMATION',
  CompanyDetails = 'COMPANY_DETAILS',
  CompanyInformation = 'COMPANY_INFORMATION',
  Intro = 'INTRO',
  Services = 'SERVICES'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  CompanyProfile: ( Biotech ) | ( VendorCompany );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  Availability: ResolverTypeWrapper<Availability>;
  AvailabilityRule: ResolverTypeWrapper<AvailabilityRule>;
  AvailabilityRuleInput: AvailabilityRuleInput;
  BillingInfo: ResolverTypeWrapper<BillingInfo>;
  BillingInvoice: ResolverTypeWrapper<BillingInvoice>;
  Biotech: ResolverTypeWrapper<Biotech>;
  BiotechInviteVendor: ResolverTypeWrapper<BiotechInviteVendor>;
  BiotechInvoice: ResolverTypeWrapper<BiotechInvoice>;
  BiotechInvoiceAttachment: ResolverTypeWrapper<BiotechInvoiceAttachment>;
  BiotechInvoiceItem: ResolverTypeWrapper<BiotechInvoiceItem>;
  BlanketPurchaseOrder: ResolverTypeWrapper<BlanketPurchaseOrder>;
  BlanketPurchaseOrderTransaction: ResolverTypeWrapper<BlanketPurchaseOrderTransaction>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CalendarEvent: ResolverTypeWrapper<CalendarEvent>;
  CalendarUser: ResolverTypeWrapper<CalendarUser>;
  CertificationTag: ResolverTypeWrapper<CertificationTag>;
  CertificationTagConnection: ResolverTypeWrapper<CertificationTagConnection>;
  Chat: ResolverTypeWrapper<Chat>;
  CompanyAttachment: ResolverTypeWrapper<CompanyAttachment>;
  CompanyAttachmentUploadResult: ResolverTypeWrapper<CompanyAttachmentUploadResult>;
  CompanyProfile: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CompanyProfile']>;
  CreateMilestoneInput: CreateMilestoneInput;
  CroDbSpecialty: ResolverTypeWrapper<CroDbSpecialty>;
  CroDbSubspecialtiesFilterInput: CroDbSubspecialtiesFilterInput;
  CroDbSubspecialty: ResolverTypeWrapper<CroDbSubspecialty>;
  CroDbVendorCompany: ResolverTypeWrapper<CroDbVendorCompany>;
  CroDbVendorCompanyCertification: ResolverTypeWrapper<CroDbVendorCompanyCertification>;
  CroDbVendorCompanyLocation: ResolverTypeWrapper<CroDbVendorCompanyLocation>;
  CroDbVendorCompanySubspecialty: ResolverTypeWrapper<CroDbVendorCompanySubspecialty>;
  CroDbVendorCompanyType: ResolverTypeWrapper<CroDbVendorCompanyType>;
  CroDbVendorSurvey: ResolverTypeWrapper<CroDbVendorSurvey>;
  CromaticParticipantInput: CromaticParticipantInput;
  Customer: ResolverTypeWrapper<Customer>;
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateWithTimeSlots: ResolverTypeWrapper<DateWithTimeSlots>;
  ExternalGuest: ResolverTypeWrapper<ExternalGuest>;
  ExternalParticipantInput: ExternalParticipantInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  InitialVendorSurveyData: ResolverTypeWrapper<InitialVendorSurveyData>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  InviteCollaboratorInput: InviteCollaboratorInput;
  Invoice: ResolverTypeWrapper<Invoice>;
  InvoiceItem: ResolverTypeWrapper<InvoiceItem>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LabSpecialization: ResolverTypeWrapper<LabSpecialization>;
  LabSpecializationConnection: ResolverTypeWrapper<LabSpecializationConnection>;
  MarkMilestoneCompleteResponse: ResolverTypeWrapper<MarkMilestoneCompleteResponse>;
  MeetingEvent: ResolverTypeWrapper<MeetingEvent>;
  MeetingParticipant: ResolverTypeWrapper<MeetingParticipant>;
  Message: ResolverTypeWrapper<Message>;
  MessageEdge: ResolverTypeWrapper<MessageEdge>;
  MessagesConnection: ResolverTypeWrapper<MessagesConnection>;
  MessagesPageInfo: ResolverTypeWrapper<MessagesPageInfo>;
  Milestone: ResolverTypeWrapper<Milestone>;
  Mutation: ResolverTypeWrapper<{}>;
  News: ResolverTypeWrapper<News>;
  Notification: ResolverTypeWrapper<Notification>;
  NotificationConnection: ResolverTypeWrapper<NotificationConnection>;
  NotificationEdge: ResolverTypeWrapper<NotificationEdge>;
  NotificationPageInfo: ResolverTypeWrapper<NotificationPageInfo>;
  PaymentMethod: ResolverTypeWrapper<PaymentMethod>;
  Perk: ResolverTypeWrapper<Perk>;
  PerkCategory: ResolverTypeWrapper<PerkCategory>;
  ProjectAttachment: ResolverTypeWrapper<ProjectAttachment>;
  ProjectConnection: ResolverTypeWrapper<ProjectConnection>;
  ProjectConnectionFilter: ProjectConnectionFilter;
  ProjectDeclineFeedback: ResolverTypeWrapper<ProjectDeclineFeedback>;
  ProjectDeclineTag: ResolverTypeWrapper<ProjectDeclineTag>;
  ProjectDeclineTagConnection: ResolverTypeWrapper<ProjectDeclineTagConnection>;
  ProjectRequest: ResolverTypeWrapper<ProjectRequest>;
  ProjectRequestCollaborator: ResolverTypeWrapper<ProjectRequestCollaborator>;
  ProjectRequestComment: ResolverTypeWrapper<ProjectRequestComment>;
  ProjectRequestProjectConnectionFilter: ProjectRequestProjectConnectionFilter;
  Pseudonyms: ResolverTypeWrapper<Pseudonyms>;
  PubMeeting: ResolverTypeWrapper<PubMeeting>;
  PubMeetingGuestInfo: ResolverTypeWrapper<PubMeetingGuestInfo>;
  PubRVSP: ResolverTypeWrapper<PubRvsp>;
  PurchaseOrder: ResolverTypeWrapper<PurchaseOrder>;
  Query: ResolverTypeWrapper<{}>;
  Quote: ResolverTypeWrapper<Quote>;
  Review: ResolverTypeWrapper<Review>;
  ReviewAnswer: ResolverTypeWrapper<ReviewAnswer>;
  ReviewInput: ReviewInput;
  ReviewQuestion: ResolverTypeWrapper<ReviewQuestion>;
  ReviewQuestionOption: ResolverTypeWrapper<ReviewQuestionOption>;
  ReviewQuestionSet: ResolverTypeWrapper<ReviewQuestionSet>;
  RuleInterval: ResolverTypeWrapper<RuleInterval>;
  RuleIntervalInput: RuleIntervalInput;
  SaveAvailabilityRulesInput: SaveAvailabilityRulesInput;
  SourceCroSubscriptionPayload: ResolverTypeWrapper<SourceCroSubscriptionPayload>;
  SourceRfpSpecialtySubscriptionPayload: ResolverTypeWrapper<SourceRfpSpecialtySubscriptionPayload>;
  SourcedCro: ResolverTypeWrapper<SourcedCro>;
  SourcedCroConnection: ResolverTypeWrapper<SourcedCroConnection>;
  SourcedCroEdge: ResolverTypeWrapper<SourcedCroEdge>;
  SourcedCroPageInfo: ResolverTypeWrapper<SourcedCroPageInfo>;
  SourcererLiteSearchPaginatedResult: ResolverTypeWrapper<SourcererLiteSearchPaginatedResult>;
  SourcererLiteSearchResultEdge: ResolverTypeWrapper<SourcererLiteSearchResultEdge>;
  SourcererLiteSearchResultPageInfo: ResolverTypeWrapper<SourcererLiteSearchResultPageInfo>;
  SourcingAttachment: ResolverTypeWrapper<SourcingAttachment>;
  SourcingSession: ResolverTypeWrapper<SourcingSession>;
  SourcingSubspecialty: ResolverTypeWrapper<SourcingSubspecialty>;
  SourcingTask: ResolverTypeWrapper<SourcingTask>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StripeAccountCapabilities: ResolverTypeWrapper<StripeAccountCapabilities>;
  StripeAccountData: ResolverTypeWrapper<StripeAccountData>;
  StripeAccountRequirementError: ResolverTypeWrapper<StripeAccountRequirementError>;
  StripeAccountRequirements: ResolverTypeWrapper<StripeAccountRequirements>;
  StripeExternalAccount: ResolverTypeWrapper<StripeExternalAccount>;
  StripeExternalAccountData: ResolverTypeWrapper<StripeExternalAccountData>;
  SubmitAttendanceResp: ResolverTypeWrapper<SubmitAttendanceResp>;
  SubmitContactUsTicketPayload: SubmitContactUsTicketPayload;
  Subscription: ResolverTypeWrapper<{}>;
  SubscriptionFeature: ResolverTypeWrapper<SubscriptionFeature>;
  SubscriptionFeatureItem: ResolverTypeWrapper<SubscriptionFeatureItem>;
  SubscriptionPlan: ResolverTypeWrapper<SubscriptionPlan>;
  SubscriptionPrice: ResolverTypeWrapper<SubscriptionPrice>;
  SubspecialtyNameWithWeight: SubspecialtyNameWithWeight;
  UpdateMilestoneInput: UpdateMilestoneInput;
  UpdateVendorProfilePayload: UpdateVendorProfilePayload;
  UpdateVendorUserProfilePayload: UpdateVendorUserProfilePayload;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  UploadResult: ResolverTypeWrapper<UploadResult>;
  User: ResolverTypeWrapper<User>;
  Vendor: ResolverTypeWrapper<Vendor>;
  VendorCompany: ResolverTypeWrapper<VendorCompany>;
  VendorMember: ResolverTypeWrapper<VendorMember>;
  VendorMemberConnection: ResolverTypeWrapper<VendorMemberConnection>;
  VendorOnboardingPayload: VendorOnboardingPayload;
  VendorOnboardingStep: VendorOnboardingStep;
  VendorSurveyPayload: VendorSurveyPayload;
  VendorSurveyStep: VendorSurveyStep;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: AuthResponse;
  Availability: Availability;
  AvailabilityRule: AvailabilityRule;
  AvailabilityRuleInput: AvailabilityRuleInput;
  BillingInfo: BillingInfo;
  BillingInvoice: BillingInvoice;
  Biotech: Biotech;
  BiotechInviteVendor: BiotechInviteVendor;
  BiotechInvoice: BiotechInvoice;
  BiotechInvoiceAttachment: BiotechInvoiceAttachment;
  BiotechInvoiceItem: BiotechInvoiceItem;
  BlanketPurchaseOrder: BlanketPurchaseOrder;
  BlanketPurchaseOrderTransaction: BlanketPurchaseOrderTransaction;
  Boolean: Scalars['Boolean']['output'];
  CalendarEvent: CalendarEvent;
  CalendarUser: CalendarUser;
  CertificationTag: CertificationTag;
  CertificationTagConnection: CertificationTagConnection;
  Chat: Chat;
  CompanyAttachment: CompanyAttachment;
  CompanyAttachmentUploadResult: CompanyAttachmentUploadResult;
  CompanyProfile: ResolversUnionTypes<ResolversParentTypes>['CompanyProfile'];
  CreateMilestoneInput: CreateMilestoneInput;
  CroDbSpecialty: CroDbSpecialty;
  CroDbSubspecialtiesFilterInput: CroDbSubspecialtiesFilterInput;
  CroDbSubspecialty: CroDbSubspecialty;
  CroDbVendorCompany: CroDbVendorCompany;
  CroDbVendorCompanyCertification: CroDbVendorCompanyCertification;
  CroDbVendorCompanyLocation: CroDbVendorCompanyLocation;
  CroDbVendorCompanySubspecialty: CroDbVendorCompanySubspecialty;
  CroDbVendorCompanyType: CroDbVendorCompanyType;
  CroDbVendorSurvey: CroDbVendorSurvey;
  CromaticParticipantInput: CromaticParticipantInput;
  Customer: Customer;
  CustomerConnection: CustomerConnection;
  Date: Scalars['Date']['output'];
  DateWithTimeSlots: DateWithTimeSlots;
  ExternalGuest: ExternalGuest;
  ExternalParticipantInput: ExternalParticipantInput;
  Float: Scalars['Float']['output'];
  InitialVendorSurveyData: InitialVendorSurveyData;
  Int: Scalars['Int']['output'];
  InviteCollaboratorInput: InviteCollaboratorInput;
  Invoice: Invoice;
  InvoiceItem: InvoiceItem;
  JSON: Scalars['JSON']['output'];
  LabSpecialization: LabSpecialization;
  LabSpecializationConnection: LabSpecializationConnection;
  MarkMilestoneCompleteResponse: MarkMilestoneCompleteResponse;
  MeetingEvent: MeetingEvent;
  MeetingParticipant: MeetingParticipant;
  Message: Message;
  MessageEdge: MessageEdge;
  MessagesConnection: MessagesConnection;
  MessagesPageInfo: MessagesPageInfo;
  Milestone: Milestone;
  Mutation: {};
  News: News;
  Notification: Notification;
  NotificationConnection: NotificationConnection;
  NotificationEdge: NotificationEdge;
  NotificationPageInfo: NotificationPageInfo;
  PaymentMethod: PaymentMethod;
  Perk: Perk;
  PerkCategory: PerkCategory;
  ProjectAttachment: ProjectAttachment;
  ProjectConnection: ProjectConnection;
  ProjectConnectionFilter: ProjectConnectionFilter;
  ProjectDeclineFeedback: ProjectDeclineFeedback;
  ProjectDeclineTag: ProjectDeclineTag;
  ProjectDeclineTagConnection: ProjectDeclineTagConnection;
  ProjectRequest: ProjectRequest;
  ProjectRequestCollaborator: ProjectRequestCollaborator;
  ProjectRequestComment: ProjectRequestComment;
  ProjectRequestProjectConnectionFilter: ProjectRequestProjectConnectionFilter;
  Pseudonyms: Pseudonyms;
  PubMeeting: PubMeeting;
  PubMeetingGuestInfo: PubMeetingGuestInfo;
  PubRVSP: PubRvsp;
  PurchaseOrder: PurchaseOrder;
  Query: {};
  Quote: Quote;
  Review: Review;
  ReviewAnswer: ReviewAnswer;
  ReviewInput: ReviewInput;
  ReviewQuestion: ReviewQuestion;
  ReviewQuestionOption: ReviewQuestionOption;
  ReviewQuestionSet: ReviewQuestionSet;
  RuleInterval: RuleInterval;
  RuleIntervalInput: RuleIntervalInput;
  SaveAvailabilityRulesInput: SaveAvailabilityRulesInput;
  SourceCroSubscriptionPayload: SourceCroSubscriptionPayload;
  SourceRfpSpecialtySubscriptionPayload: SourceRfpSpecialtySubscriptionPayload;
  SourcedCro: SourcedCro;
  SourcedCroConnection: SourcedCroConnection;
  SourcedCroEdge: SourcedCroEdge;
  SourcedCroPageInfo: SourcedCroPageInfo;
  SourcererLiteSearchPaginatedResult: SourcererLiteSearchPaginatedResult;
  SourcererLiteSearchResultEdge: SourcererLiteSearchResultEdge;
  SourcererLiteSearchResultPageInfo: SourcererLiteSearchResultPageInfo;
  SourcingAttachment: SourcingAttachment;
  SourcingSession: SourcingSession;
  SourcingSubspecialty: SourcingSubspecialty;
  SourcingTask: SourcingTask;
  String: Scalars['String']['output'];
  StripeAccountCapabilities: StripeAccountCapabilities;
  StripeAccountData: StripeAccountData;
  StripeAccountRequirementError: StripeAccountRequirementError;
  StripeAccountRequirements: StripeAccountRequirements;
  StripeExternalAccount: StripeExternalAccount;
  StripeExternalAccountData: StripeExternalAccountData;
  SubmitAttendanceResp: SubmitAttendanceResp;
  SubmitContactUsTicketPayload: SubmitContactUsTicketPayload;
  Subscription: {};
  SubscriptionFeature: SubscriptionFeature;
  SubscriptionFeatureItem: SubscriptionFeatureItem;
  SubscriptionPlan: SubscriptionPlan;
  SubscriptionPrice: SubscriptionPrice;
  SubspecialtyNameWithWeight: SubspecialtyNameWithWeight;
  UpdateMilestoneInput: UpdateMilestoneInput;
  UpdateVendorProfilePayload: UpdateVendorProfilePayload;
  UpdateVendorUserProfilePayload: UpdateVendorUserProfilePayload;
  Upload: Scalars['Upload']['output'];
  UploadResult: UploadResult;
  User: User;
  Vendor: Vendor;
  VendorCompany: VendorCompany;
  VendorMember: VendorMember;
  VendorMemberConnection: VendorMemberConnection;
  VendorOnboardingPayload: VendorOnboardingPayload;
  VendorSurveyPayload: VendorSurveyPayload;
}>;

export type AuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  access_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refresh_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AvailabilityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Availability'] = ResolversParentTypes['Availability']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rules?: Resolver<Array<ResolversTypes['AvailabilityRule']>, ParentType, ContextType>;
  timezone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AvailabilityRuleResolvers<ContextType = any, ParentType extends ResolversParentTypes['AvailabilityRule'] = ResolversParentTypes['AvailabilityRule']> = ResolversObject<{
  day?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intervals?: Resolver<Array<ResolversTypes['RuleInterval']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BillingInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BillingInfo'] = ResolversParentTypes['BillingInfo']> = ResolversObject<{
  bill_cycle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_active_legacy_plan?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_active_sourcerer_plan?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_active_white_glove_plan?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_scheduled_for_interval_change?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payment_method?: Resolver<Maybe<ResolversTypes['PaymentMethod']>, ParentType, ContextType>;
  plan?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  plan_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  upcoming_bill_amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  upcoming_bill_date?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BillingInvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['BillingInvoice'] = ResolversParentTypes['BillingInvoice']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invoice_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BiotechResolvers<ContextType = any, ParentType extends ResolversParentTypes['Biotech'] = ResolversParentTypes['Biotech']> = ResolversObject<{
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  account_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  admins?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  biotech_extra_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  biotech_invoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInvoice']>>>, ParentType, ContextType>;
  blanket_purchase_orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['BlanketPurchaseOrder']>>>, ParentType, ContextType>;
  chats?: Resolver<Maybe<Array<Maybe<ResolversTypes['Chat']>>>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customer']>>>, ParentType, ContextType>;
  facebook_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  founded_year?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_active_subscription?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_setup_profile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  linkedin_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  purchase_orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['PurchaseOrder']>>>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripe_customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  team_size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitter_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  upload_limit?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  upload_used?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zipcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BiotechInviteVendorResolvers<ContextType = any, ParentType extends ResolversParentTypes['BiotechInviteVendor'] = ResolversParentTypes['BiotechInviteVendor']> = ResolversObject<{
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  inviter?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  inviter_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_request?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType>;
  project_request_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BiotechInvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['BiotechInvoice'] = ResolversParentTypes['BiotechInvoice']> = ResolversObject<{
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  biotech_invoice_attachment?: Resolver<Maybe<ResolversTypes['BiotechInvoiceAttachment']>, ParentType, ContextType>;
  biotech_invoice_items?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInvoiceItem']>>>, ParentType, ContextType>;
  blanket_purchase_order_transaction?: Resolver<Maybe<ResolversTypes['BlanketPurchaseOrderTransaction']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  due_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invoice_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paid_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  payment_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  purchase_order?: Resolver<Maybe<ResolversTypes['PurchaseOrder']>, ParentType, ContextType>;
  reference_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripe_txn_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BiotechInvoiceAttachmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['BiotechInvoiceAttachment'] = ResolversParentTypes['BiotechInvoiceAttachment']> = ResolversObject<{
  biotech_invoice?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType>;
  biotech_invoice_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  byte_size?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  document_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  filename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  formatted_filesize?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signed_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BiotechInvoiceItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['BiotechInvoiceItem'] = ResolversParentTypes['BiotechInvoiceItem']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  biotech_invoice?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType>;
  biotech_invoice_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  milestone?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType>;
  milestone_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlanketPurchaseOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlanketPurchaseOrder'] = ResolversParentTypes['BlanketPurchaseOrder']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  balance_amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blanket_purchase_order_transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['BlanketPurchaseOrderTransaction']>>>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  po_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlanketPurchaseOrderTransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlanketPurchaseOrderTransaction'] = ResolversParentTypes['BlanketPurchaseOrderTransaction']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  biotech_invoice?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType>;
  biotech_invoice_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  blanket_purchase_order?: Resolver<Maybe<ResolversTypes['BlanketPurchaseOrder']>, ParentType, ContextType>;
  blanket_purchase_order_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transaction_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CalendarEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['CalendarEvent'] = ResolversParentTypes['CalendarEvent']> = ResolversObject<{
  all_day?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  guests?: Resolver<Maybe<Array<Maybe<ResolversTypes['CalendarUser']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_draft?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  meeting_link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizer?: Resolver<Maybe<ResolversTypes['CalendarUser']>, ParentType, ContextType>;
  start_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  timezone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CalendarUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['CalendarUser'] = ResolversParentTypes['CalendarUser']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CertificationTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['CertificationTag'] = ResolversParentTypes['CertificationTag']> = ResolversObject<{
  full_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  short_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CertificationTagConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CertificationTagConnection'] = ResolversParentTypes['CertificationTagConnection']> = ResolversObject<{
  certification_tag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType>;
  certification_tag_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChatResolvers<ContextType = any, ParentType extends ResolversParentTypes['Chat'] = ResolversParentTypes['Chat']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['Message']>>>, ParentType, ContextType>;
  messagesConnection?: Resolver<Maybe<ResolversTypes['MessagesConnection']>, ParentType, ContextType, RequireFields<ChatMessagesConnectionArgs, 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompanyAttachmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['CompanyAttachment'] = ResolversParentTypes['CompanyAttachment']> = ResolversObject<{
  byte_size?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  document_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  filename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  formatted_filesize?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signed_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompanyAttachmentUploadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CompanyAttachmentUploadResult'] = ResolversParentTypes['CompanyAttachmentUploadResult']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['CompanyAttachment']>, ParentType, ContextType>;
  error_message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompanyProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['CompanyProfile'] = ResolversParentTypes['CompanyProfile']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Biotech' | 'VendorCompany', ParentType, ContextType>;
}>;

export type CroDbSpecialtyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbSpecialty'] = ResolversParentTypes['CroDbSpecialty']> = ResolversObject<{
  definition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subspecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbSubspecialty']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CroDbSubspecialtyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbSubspecialty'] = ResolversParentTypes['CroDbSubspecialty']> = ResolversObject<{
  definition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  specialty?: Resolver<Maybe<ResolversTypes['CroDbSpecialty']>, ParentType, ContextType>;
  specialty_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CroDbVendorCompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbVendorCompany'] = ResolversParentTypes['CroDbVendorCompany']> = ResolversObject<{
  company_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_ipo_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_revenue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  crunchbase_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  is_active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_confirmed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_cromatic_vendor?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  linkedin_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logo_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company_certifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbVendorCompanyCertification']>>>, ParentType, ContextType>;
  vendor_company_locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbVendorCompanyLocation']>>>, ParentType, ContextType>;
  vendor_company_subspecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbVendorCompanySubspecialty']>>>, ParentType, ContextType>;
  vendor_company_types?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbVendorCompanyType']>>>, ParentType, ContextType>;
  verified_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  website_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CroDbVendorCompanyCertificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbVendorCompanyCertification'] = ResolversParentTypes['CroDbVendorCompanyCertification']> = ResolversObject<{
  certification_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CroDbVendorCompanyLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbVendorCompanyLocation'] = ResolversParentTypes['CroDbVendorCompanyLocation']> = ResolversObject<{
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CroDbVendorCompanySubspecialtyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbVendorCompanySubspecialty'] = ResolversParentTypes['CroDbVendorCompanySubspecialty']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subspecialty?: Resolver<Maybe<ResolversTypes['CroDbSubspecialty']>, ParentType, ContextType>;
  subspecialty_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CroDbVendorCompanyTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbVendorCompanyType'] = ResolversParentTypes['CroDbVendorCompanyType']> = ResolversObject<{
  company_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CroDbVendorSurveyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbVendorSurvey'] = ResolversParentTypes['CroDbVendorSurvey']> = ResolversObject<{
  attachment_content_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  attachment_file_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  attachment_key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  certifications?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  company_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_ipo_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_revenue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_types?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  countries?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  custom_specialties?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hq_locations?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logo_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  respondent_company_role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  respondent_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['VendorSurveyStep']>, ParentType, ContextType>;
  subspecialty_ids?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customer_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomerConnection']>>>, ParentType, ContextType>;
  has_setup_profile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  job_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_requests?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequest']>>>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerConnection'] = ResolversParentTypes['CustomerConnection']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DateWithTimeSlotsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DateWithTimeSlots'] = ResolversParentTypes['DateWithTimeSlots']> = ResolversObject<{
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time_slots?: Resolver<Maybe<Array<Maybe<ResolversTypes['Date']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExternalGuestResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExternalGuest'] = ResolversParentTypes['ExternalGuest']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InitialVendorSurveyDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['InitialVendorSurveyData'] = ResolversParentTypes['InitialVendorSurveyData']> = ResolversObject<{
  certifications?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  company_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_ipo_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_revenue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  countries?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  has_submitted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logo_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subspecialty_ids?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  vendor_type?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invoice'] = ResolversParentTypes['Invoice']> = ResolversObject<{
  commission_rate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  due_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  from_date?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invoice_items?: Resolver<Maybe<Array<Maybe<ResolversTypes['InvoiceItem']>>>, ParentType, ContextType>;
  invoice_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paid_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  payment_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripe_txn_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  to_date?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  total_amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  total_milestone_amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvoiceItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvoiceItem'] = ResolversParentTypes['InvoiceItem']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invoice?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType>;
  invoice_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  milestone?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType>;
  milestone_amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  milestone_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LabSpecializationResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabSpecialization'] = ResolversParentTypes['LabSpecialization']> = ResolversObject<{
  full_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  short_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LabSpecializationConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabSpecializationConnection'] = ResolversParentTypes['LabSpecializationConnection']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lab_specialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType>;
  lab_specialization_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarkMilestoneCompleteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarkMilestoneCompleteResponse'] = ResolversParentTypes['MarkMilestoneCompleteResponse']> = ResolversObject<{
  milestone?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType>;
  upload_results?: Resolver<Maybe<Array<Maybe<ResolversTypes['UploadResult']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MeetingEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeetingEvent'] = ResolversParentTypes['MeetingEvent']> = ResolversObject<{
  attending_company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  attending_company_participants?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingParticipant']>>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  external_guests?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingParticipant']>>>, ParentType, ContextType>;
  guests?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  meeting_link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  organizer_company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizer_company_participants?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingParticipant']>>>, ParentType, ContextType>;
  organizer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_pin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  platform?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_request?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType>;
  start_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  timezone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MeetingParticipantResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeetingParticipant'] = ResolversParentTypes['MeetingParticipant']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageEdge'] = ResolversParentTypes['MessageEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessagesConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessagesConnection'] = ResolversParentTypes['MessagesConnection']> = ResolversObject<{
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['MessageEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<Maybe<ResolversTypes['MessagesPageInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessagesPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessagesPageInfo'] = ResolversParentTypes['MessagesPageInfo']> = ResolversObject<{
  endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasNextPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPreviousPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MilestoneResolvers<ContextType = any, ParentType extends ResolversParentTypes['Milestone'] = ResolversParentTypes['Milestone']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  biotech_invoice_item?: Resolver<Maybe<ResolversTypes['BiotechInvoiceItem']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payment_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_attachments?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectAttachment']>>>, ParentType, ContextType>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType>;
  quote_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  short_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timeline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_payment_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  acceptProjectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<MutationAcceptProjectConnectionArgs, 'id'>>;
  acceptQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationAcceptQuoteArgs, 'id'>>;
  addMoreParticipants?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingParticipant']>>>, ParentType, ContextType, RequireFields<MutationAddMoreParticipantsArgs, 'cromatic_participants' | 'external_participants' | 'meeting_event_id'>>;
  addProjectCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationAddProjectCollaboratorArgs, 'project_connection_id' | 'user_id'>>;
  answerInvitation?: Resolver<Maybe<ResolversTypes['SubmitAttendanceResp']>, ParentType, ContextType, RequireFields<MutationAnswerInvitationArgs, 'answer' | 'email' | 'meeting_token'>>;
  cancelAiTask?: Resolver<Maybe<ResolversTypes['SourcingTask']>, ParentType, ContextType, RequireFields<MutationCancelAiTaskArgs, 'sourcing_session_id' | 'task_id'>>;
  cancelInvitation?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCancelInvitationArgs, 'user_id'>>;
  cancelSubscription?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  changePassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'new_password' | 'old_password'>>;
  confirmEditSourcingDetails?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType, RequireFields<MutationConfirmEditSourcingDetailsArgs, 'sourcing_session_id'>>;
  confirmEditSourcingSubspecialties?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType, RequireFields<MutationConfirmEditSourcingSubspecialtiesArgs, 'sourcing_session_id'>>;
  confirmRemoveSourcingSession?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType, RequireFields<MutationConfirmRemoveSourcingSessionArgs, 'sourcing_session_id'>>;
  createBiotechInviteVendor?: Resolver<Maybe<ResolversTypes['BiotechInviteVendor']>, ParentType, ContextType, RequireFields<MutationCreateBiotechInviteVendorArgs, 'company_name' | 'email' | 'first_name' | 'last_name' | 'project_request_id' | 'website'>>;
  createBlanketPurchaseOrder?: Resolver<Maybe<ResolversTypes['BlanketPurchaseOrder']>, ParentType, ContextType, RequireFields<MutationCreateBlanketPurchaseOrderArgs, 'amount' | 'name' | 'po_number'>>;
  createCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagArgs, 'full_name'>>;
  createChat?: Resolver<Maybe<ResolversTypes['Chat']>, ParentType, ContextType, RequireFields<MutationCreateChatArgs, 'project_connection_id'>>;
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'company_name' | 'user_id'>>;
  createLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationArgs, 'full_name'>>;
  createMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationCreateMeetingEventArgs, 'cromatic_participants' | 'end_time' | 'external_participants' | 'platform' | 'project_connection_id' | 'start_time' | 'timezone' | 'title'>>;
  createProjectDeclineFeedback?: Resolver<Maybe<ResolversTypes['ProjectDeclineFeedback']>, ParentType, ContextType, RequireFields<MutationCreateProjectDeclineFeedbackArgs, 'project_connection_id' | 'project_decline_tag_ids'>>;
  createProjectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestArgs, 'in_contact_with_vendor' | 'is_private' | 'objective_description' | 'title' | 'vendor_requirement' | 'vendor_search_timeframe'>>;
  createProjectRequestComment?: Resolver<Maybe<ResolversTypes['ProjectRequestComment']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestCommentArgs, 'content' | 'project_request_id'>>;
  createQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationCreateQuoteArgs, 'amount' | 'project_connection_id'>>;
  createVendorSurvey?: Resolver<Maybe<ResolversTypes['CroDbVendorSurvey']>, ParentType, ContextType, RequireFields<MutationCreateVendorSurveyArgs, 'company_description' | 'company_ipo_status' | 'company_name' | 'company_revenue' | 'company_size' | 'company_types' | 'countries' | 'email' | 'logo' | 'subspecialty_ids' | 'website'>>;
  deactivateCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeactivateCollaboratorArgs, 'user_id'>>;
  declineQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationDeclineQuoteArgs, 'id'>>;
  declinedProjectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<MutationDeclinedProjectConnectionArgs, 'id'>>;
  disconnectOauth2?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDisconnectOauth2Args, 'provider'>>;
  draftQuoteReview?: Resolver<Maybe<Array<Maybe<ResolversTypes['ReviewAnswer']>>>, ParentType, ContextType, RequireFields<MutationDraftQuoteReviewArgs, 'quote_id'>>;
  extractPdfRfp?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType, RequireFields<MutationExtractPdfRfpArgs, 'file'>>;
  forgotPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationForgotPasswordArgs>>;
  inviteCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInviteCollaboratorArgs, 'email' | 'name'>>;
  inviteCollaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<MutationInviteCollaboratorsArgs, 'collaborators'>>;
  inviteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationInviteCustomerArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteProjectCollaboratorViaEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInviteProjectCollaboratorViaEmailArgs, 'email' | 'name' | 'project_connection_id'>>;
  inviteVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberArgs, 'email' | 'first_name' | 'last_name'>>;
  markMilestoneAsCompleted?: Resolver<Maybe<ResolversTypes['MarkMilestoneCompleteResponse']>, ParentType, ContextType, RequireFields<MutationMarkMilestoneAsCompletedArgs, 'id'>>;
  markNotificationAsRead?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationMarkNotificationAsReadArgs, 'id'>>;
  markNotificationsInProjectAsRead?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, RequireFields<MutationMarkNotificationsInProjectAsReadArgs, 'project_connection_id'>>;
  markQuoteNotificationsAsRead?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, RequireFields<MutationMarkQuoteNotificationsAsReadArgs, 'quote_id'>>;
  onboardCustomerPersonalInfo?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationOnboardCustomerPersonalInfoArgs, 'first_name' | 'job_title' | 'last_name' | 'team'>>;
  payByBlanketPurchaseOrder?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<MutationPayByBlanketPurchaseOrderArgs, 'blanket_purchase_order_id' | 'id'>>;
  payByPurchaseOrder?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<MutationPayByPurchaseOrderArgs, 'id' | 'po_number'>>;
  reactivateCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationReactivateCollaboratorArgs, 'user_id'>>;
  refreshJWT?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType>;
  removeAttachment?: Resolver<Maybe<ResolversTypes['ProjectAttachment']>, ParentType, ContextType, RequireFields<MutationRemoveAttachmentArgs, 'id'>>;
  removeBlanketPurchaseOrder?: Resolver<Maybe<ResolversTypes['BlanketPurchaseOrder']>, ParentType, ContextType, RequireFields<MutationRemoveBlanketPurchaseOrderArgs, 'id'>>;
  removeCompanyAttachment?: Resolver<Maybe<ResolversTypes['CompanyAttachment']>, ParentType, ContextType, RequireFields<MutationRemoveCompanyAttachmentArgs, 'id'>>;
  removeGuest?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRemoveGuestArgs, 'email' | 'meeting_event_id'>>;
  removeMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationRemoveMeetingEventArgs, 'meeting_event_id'>>;
  removeParticipant?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRemoveParticipantArgs, 'meeting_event_id' | 'user_id'>>;
  removeProjectCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRemoveProjectCollaboratorArgs, 'project_connection_id' | 'user_id'>>;
  removeProjectRequestCollaborator?: Resolver<Maybe<ResolversTypes['ProjectRequestCollaborator']>, ParentType, ContextType, RequireFields<MutationRemoveProjectRequestCollaboratorArgs, 'customer_id' | 'project_request_id'>>;
  removeSourcedCroFromShortlist?: Resolver<Maybe<ResolversTypes['SourcedCro']>, ParentType, ContextType, RequireFields<MutationRemoveSourcedCroFromShortlistArgs, 'sourced_cro_id' | 'sourcing_session_id'>>;
  resendExpiredQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationResendExpiredQuoteArgs, 'id'>>;
  resendInvitation?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationResendInvitationArgs, 'user_id'>>;
  resendVendorMemberInviteByBiotech?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationResendVendorMemberInviteByBiotechArgs, 'biotech_invite_vendor_id'>>;
  resetPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationResetPasswordArgs>>;
  resumeSubscription?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  saveAvailabilityRules?: Resolver<Maybe<ResolversTypes['Availability']>, ParentType, ContextType, RequireFields<MutationSaveAvailabilityRulesArgs, 'input'>>;
  scheduleSubscriptionChange?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationScheduleSubscriptionChangeArgs, 'price_id'>>;
  sendGuestReminder?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendGuestReminderArgs, 'email' | 'meeting_event_id'>>;
  sendMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'content' | 'project_connection_id'>>;
  sendSourcingShortlist?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendSourcingShortlistArgs, 'sourcing_session_id'>>;
  setProjectRequestPublic?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationSetProjectRequestPublicArgs, 'project_request_id'>>;
  shortlistSourcedCro?: Resolver<Maybe<ResolversTypes['SourcedCro']>, ParentType, ContextType, RequireFields<MutationShortlistSourcedCroArgs, 'sourced_cro_id' | 'sourcing_session_id'>>;
  signInUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignInUserArgs, 'email' | 'password'>>;
  signUpUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignUpUserArgs, 'email' | 'password' | 'timezone'>>;
  skipAddCertificationTag?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  skipAddLabSpecialization?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  sourceCros?: Resolver<Maybe<ResolversTypes['SourcingTask']>, ParentType, ContextType, RequireFields<MutationSourceCrosArgs, 'names' | 'sourcing_session_id'>>;
  sourceRfpSpecialties?: Resolver<Maybe<ResolversTypes['SourcingTask']>, ParentType, ContextType, RequireFields<MutationSourceRfpSpecialtiesArgs, 'preparation_details' | 'project_desc' | 'project_title' | 'vendor_requirement'>>;
  startChat?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationStartChatArgs, 'project_connection_id'>>;
  submitContactUsTicket?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubmitContactUsTicketArgs, 'payload'>>;
  submitCroInterest?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubmitCroInterestArgs, 'company_name' | 'company_type' | 'email' | 'first_name' | 'interest' | 'last_name' | 'service'>>;
  submitVendorOnboarding?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<MutationSubmitVendorOnboardingArgs, 'onboarding_step' | 'payload'>>;
  submitVendorSurvey?: Resolver<Maybe<ResolversTypes['CroDbVendorSurvey']>, ParentType, ContextType, RequireFields<MutationSubmitVendorSurveyArgs, 'payload' | 'step'>>;
  subscribeEmailUpdates?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubscribeEmailUpdatesArgs, 'email'>>;
  transferBiotechOwnership?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationTransferBiotechOwnershipArgs, 'biotech_id' | 'user_id'>>;
  transferVendorCompanyOwnership?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationTransferVendorCompanyOwnershipArgs, 'user_id' | 'vendor_company_id'>>;
  updateBiotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationUpdateBiotechArgs>>;
  updateBiotechProfile?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationUpdateBiotechProfileArgs>>;
  updateBlanketPurchaseOrder?: Resolver<Maybe<ResolversTypes['BlanketPurchaseOrder']>, ParentType, ContextType, RequireFields<MutationUpdateBlanketPurchaseOrderArgs, 'amount' | 'id' | 'name' | 'po_number'>>;
  updateCollaboratorRole?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateCollaboratorRoleArgs, 'role_type' | 'user_id'>>;
  updateCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, Partial<MutationUpdateCustomerArgs>>;
  updateMeetingDetails?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationUpdateMeetingDetailsArgs, 'meeting_event_id'>>;
  updateMeetingEventSharable?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationUpdateMeetingEventSharableArgs, 'is_sharable' | 'meeting_event_id'>>;
  updateProjectRequestCollaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequestCollaborator']>>>, ParentType, ContextType, RequireFields<MutationUpdateProjectRequestCollaboratorsArgs, 'customer_ids' | 'project_request_id'>>;
  updateQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationUpdateQuoteArgs, 'amount' | 'id' | 'milestones'>>;
  updateUserInfo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserInfoArgs, 'email' | 'first_name' | 'last_name'>>;
  updateVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyArgs>>;
  updateVendorCompanyCertificationTags?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyCertificationTagsArgs>>;
  updateVendorCompanyLabSpecializations?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyLabSpecializationsArgs>>;
  updateVendorCompanyProfile?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyProfileArgs>>;
  updateVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, Partial<MutationUpdateVendorMemberArgs>>;
  updateVendorProfile?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<MutationUpdateVendorProfileArgs, 'payload'>>;
  updateVendorUserProfile?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<MutationUpdateVendorUserProfileArgs, 'payload'>>;
  uploadBiotechInvoicePaymentReceipt?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType, RequireFields<MutationUploadBiotechInvoicePaymentReceiptArgs, 'file' | 'id'>>;
  uploadCompanyAttachment?: Resolver<Maybe<ResolversTypes['CompanyAttachmentUploadResult']>, ParentType, ContextType, RequireFields<MutationUploadCompanyAttachmentArgs, 'file' | 'vendor_company_id'>>;
  uploadContract?: Resolver<Maybe<ResolversTypes['UploadResult']>, ParentType, ContextType, RequireFields<MutationUploadContractArgs, 'file' | 'project_connection_id'>>;
  uploadDocuments?: Resolver<Maybe<Array<Maybe<ResolversTypes['UploadResult']>>>, ParentType, ContextType, RequireFields<MutationUploadDocumentsArgs, 'files' | 'project_connection_id'>>;
  verifyMilestoneAsCompleted?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<MutationVerifyMilestoneAsCompletedArgs, 'id' | 'password'>>;
  withdrawProjectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationWithdrawProjectRequestArgs, 'project_request_id'>>;
}>;

export type NewsResolvers<ContextType = any, ParentType extends ResolversParentTypes['News'] = ResolversParentTypes['News']> = ResolversObject<{
  cover_img_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  excerpt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_featured?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  logo_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  published_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notification_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  params?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  read_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  recipient?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  recipient_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  sender_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotificationConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationConnection'] = ResolversParentTypes['NotificationConnection']> = ResolversObject<{
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['NotificationEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<Maybe<ResolversTypes['NotificationPageInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotificationEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationEdge'] = ResolversParentTypes['NotificationEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotificationPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotificationPageInfo'] = ResolversParentTypes['NotificationPageInfo']> = ResolversObject<{
  endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasNextPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPreviousPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentMethodResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentMethod'] = ResolversParentTypes['PaymentMethod']> = ResolversObject<{
  display_brand?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  last_4?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PerkResolvers<ContextType = any, ParentType extends ResolversParentTypes['Perk'] = ResolversParentTypes['Perk']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expired_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  external_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  how_to_redeem?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  perk_category?: Resolver<Maybe<ResolversTypes['PerkCategory']>, ParentType, ContextType>;
  perk_category_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reward_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  terms?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PerkCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['PerkCategory'] = ResolversParentTypes['PerkCategory']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  perks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Perk']>>>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectAttachmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectAttachment'] = ResolversParentTypes['ProjectAttachment']> = ResolversObject<{
  byte_size?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  document_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  filename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  formatted_filesize?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  milestone?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType>;
  milestone_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signed_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zoho_editor_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectConnection'] = ResolversParentTypes['ProjectConnection']> = ResolversObject<{
  biotech_invite_vendor?: Resolver<Maybe<ResolversTypes['BiotechInviteVendor']>, ParentType, ContextType>;
  biotech_invite_vendor_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  chat?: Resolver<Maybe<ResolversTypes['Chat']>, ParentType, ContextType>;
  collaborators_not_invited?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customer_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomerConnection']>>>, ParentType, ContextType>;
  documents?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectAttachment']>>>, ParentType, ContextType>;
  expired_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  external_collaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  final_contract?: Resolver<Maybe<ResolversTypes['ProjectAttachment']>, ParentType, ContextType>;
  final_contract_uploaded_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  internal_collaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['Message']>>>, ParentType, ContextType>;
  project_attachments?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectAttachment']>>>, ParentType, ContextType>;
  project_request?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType>;
  project_request_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Quote']>>>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_display_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_member_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMemberConnection']>>>, ParentType, ContextType>;
  vendor_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectDeclineFeedbackResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectDeclineFeedback'] = ResolversParentTypes['ProjectDeclineFeedback']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectDeclineTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectDeclineTag'] = ResolversParentTypes['ProjectDeclineTag']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectDeclineTagConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectDeclineTagConnection'] = ResolversParentTypes['ProjectDeclineTagConnection']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_decline_feedback?: Resolver<Maybe<ResolversTypes['ProjectDeclineFeedback']>, ParentType, ContextType>;
  project_decline_feedback_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_decline_tag?: Resolver<Maybe<ResolversTypes['ProjectDeclineTag']>, ParentType, ContextType>;
  project_decline_tag_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectRequest'] = ResolversParentTypes['ProjectRequest']> = ResolversObject<{
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  existing_vendor_contact_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  in_contact_with_vendor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_private?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_white_glove?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  max_budget?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  objective_description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preparation_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_challenge_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType, Partial<ProjectRequestProject_ConnectionsArgs>>;
  project_deadline_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_request_collaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequestCollaborator']>>>, ParentType, ContextType>;
  project_request_comments?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequestComment']>>>, ParentType, ContextType>;
  project_start_time_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_location_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_requirement?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendor_search_timeframe?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectRequestCollaboratorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectRequestCollaborator'] = ResolversParentTypes['ProjectRequestCollaborator']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_request?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType>;
  project_request_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectRequestCommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectRequestComment'] = ResolversParentTypes['ProjectRequestComment']> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_request?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType>;
  project_request_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PseudonymsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pseudonyms'] = ResolversParentTypes['Pseudonyms']> = ResolversObject<{
  country_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PubMeetingResolvers<ContextType = any, ParentType extends ResolversParentTypes['PubMeeting'] = ResolversParentTypes['PubMeeting']> = ResolversObject<{
  end_time?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  guest_info?: Resolver<Maybe<ResolversTypes['PubMeetingGuestInfo']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_ended?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  meeting_link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizer_company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizer_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  platform?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start_time?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PubMeetingGuestInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PubMeetingGuestInfo'] = ResolversParentTypes['PubMeetingGuestInfo']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PubRvspResolvers<ContextType = any, ParentType extends ResolversParentTypes['PubRVSP'] = ResolversParentTypes['PubRVSP']> = ResolversObject<{
  guest_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meeting_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PurchaseOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['PurchaseOrder'] = ResolversParentTypes['PurchaseOrder']> = ResolversObject<{
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  biotech_invoice?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType>;
  biotech_invoice_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  po_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  availability?: Resolver<Maybe<ResolversTypes['Availability']>, ParentType, ContextType>;
  availableDateTimeSlots?: Resolver<Maybe<Array<Maybe<ResolversTypes['DateWithTimeSlots']>>>, ParentType, ContextType, RequireFields<QueryAvailableDateTimeSlotsArgs, 'duration_in_min' | 'from' | 'timezone' | 'to'>>;
  billingInfo?: Resolver<Maybe<ResolversTypes['BillingInfo']>, ParentType, ContextType>;
  billingInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['BillingInvoice']>>>, ParentType, ContextType>;
  billingPortalUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryBillingPortalUrlArgs, 'return_url'>>;
  bioInvitedProjectConnections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType, RequireFields<QueryBioInvitedProjectConnectionsArgs, 'project_request_id'>>;
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotechInviteVendors?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInviteVendor']>>>, ParentType, ContextType, Partial<QueryBiotechInviteVendorsArgs>>;
  biotechInvoice?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType, RequireFields<QueryBiotechInvoiceArgs, 'id'>>;
  biotechInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInvoice']>>>, ParentType, ContextType, Partial<QueryBiotechInvoicesArgs>>;
  blanketPurchaseOrders?: Resolver<Maybe<Array<Maybe<ResolversTypes['BlanketPurchaseOrder']>>>, ParentType, ContextType>;
  casbinPermission?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, Partial<QueryCollaboratorsArgs>>;
  companyProfile?: Resolver<Maybe<ResolversTypes['CompanyProfile']>, ParentType, ContextType>;
  croDbSpecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbSpecialty']>>>, ParentType, ContextType>;
  croDbSpecialty?: Resolver<Maybe<ResolversTypes['CroDbSpecialty']>, ParentType, ContextType, RequireFields<QueryCroDbSpecialtyArgs, 'name'>>;
  croDbSubspecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbSubspecialty']>>>, ParentType, ContextType, Partial<QueryCroDbSubspecialtiesArgs>>;
  croDbVendorCompany?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType, RequireFields<QueryCroDbVendorCompanyArgs, 'id'>>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  featuredNews?: Resolver<Maybe<Array<Maybe<ResolversTypes['News']>>>, ParentType, ContextType>;
  googleCalendarAuthorizationUri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<QueryGoogleCalendarAuthorizationUriArgs>>;
  googleCalendarEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['CalendarEvent']>>>, ParentType, ContextType>;
  initialVendorSurveyData?: Resolver<Maybe<ResolversTypes['InitialVendorSurveyData']>, ParentType, ContextType, RequireFields<QueryInitialVendorSurveyDataArgs, 'token'>>;
  invoice?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<QueryInvoiceArgs, 'id'>>;
  invoiceCheckoutUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryInvoiceCheckoutUrlArgs, 'cancel_url' | 'id' | 'success_url'>>;
  invoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invoice']>>>, ParentType, ContextType>;
  meetingEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingEvent']>>>, ParentType, ContextType, Partial<QueryMeetingEventsArgs>>;
  meetingFormAttendees?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QueryMeetingFormAttendeesArgs, 'project_connection_id'>>;
  microsoftCalendarAuthorizationUri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<QueryMicrosoftCalendarAuthorizationUriArgs>>;
  microsoftCalendarEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['CalendarEvent']>>>, ParentType, ContextType>;
  milestone?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<QueryMilestoneArgs, 'id'>>;
  milestoneCheckoutUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryMilestoneCheckoutUrlArgs, 'cancel_url' | 'id' | 'success_url'>>;
  moreAttendeesToAdd?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QueryMoreAttendeesToAddArgs, 'meeting_event_id'>>;
  news?: Resolver<Maybe<Array<Maybe<ResolversTypes['News']>>>, ParentType, ContextType>;
  notifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, Partial<QueryNotificationsArgs>>;
  notificationsConnection?: Resolver<Maybe<ResolversTypes['NotificationConnection']>, ParentType, ContextType, RequireFields<QueryNotificationsConnectionArgs, 'first'>>;
  perkCategories?: Resolver<Maybe<Array<Maybe<ResolversTypes['PerkCategory']>>>, ParentType, ContextType>;
  projectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<QueryProjectConnectionArgs, 'id'>>;
  projectConnections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType, Partial<QueryProjectConnectionsArgs>>;
  projectDeclineTags?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectDeclineTag']>>>, ParentType, ContextType>;
  projectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, Partial<QueryProjectRequestArgs>>;
  projectRequests?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequest']>>>, ParentType, ContextType, Partial<QueryProjectRequestsArgs>>;
  pubMeeting?: Resolver<Maybe<ResolversTypes['PubMeeting']>, ParentType, ContextType, RequireFields<QueryPubMeetingArgs, 'token'>>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, Partial<QueryQuoteArgs>>;
  quoteReview?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType, RequireFields<QueryQuoteReviewArgs, 'quote_id'>>;
  quoteReviewQuestions?: Resolver<Maybe<Array<Maybe<ResolversTypes['ReviewQuestion']>>>, ParentType, ContextType, RequireFields<QueryQuoteReviewQuestionsArgs, 'quote_id'>>;
  searchCertificationTags?: Resolver<Maybe<Array<Maybe<ResolversTypes['CertificationTag']>>>, ParentType, ContextType, Partial<QuerySearchCertificationTagsArgs>>;
  searchLabSpecializations?: Resolver<Maybe<Array<Maybe<ResolversTypes['LabSpecialization']>>>, ParentType, ContextType, Partial<QuerySearchLabSpecializationsArgs>>;
  signedUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QuerySignedUrlArgs, 'key'>>;
  sourcedCros?: Resolver<Maybe<ResolversTypes['SourcedCroConnection']>, ParentType, ContextType, RequireFields<QuerySourcedCrosArgs, 'first' | 'sourcing_session_id'>>;
  sourcererLiteSearch?: Resolver<Maybe<ResolversTypes['SourcererLiteSearchPaginatedResult']>, ParentType, ContextType, RequireFields<QuerySourcererLiteSearchArgs, 'first' | 'keyword'>>;
  sourcingSession?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType, RequireFields<QuerySourcingSessionArgs, 'id'>>;
  sourcingSessions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcingSession']>>>, ParentType, ContextType>;
  stripePricingTableId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripeSetupIntent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subscriptionCheckoutSessionUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QuerySubscriptionCheckoutSessionUrlArgs, 'cancel_url' | 'price_id' | 'success_url'>>;
  subscriptionPlans?: Resolver<Array<ResolversTypes['SubscriptionPlan']>, ParentType, ContextType>;
  suggestedCertificationTags?: Resolver<Maybe<Array<Maybe<ResolversTypes['CertificationTag']>>>, ParentType, ContextType>;
  suggestedLabSpecializations?: Resolver<Maybe<Array<Maybe<ResolversTypes['LabSpecialization']>>>, ParentType, ContextType>;
  upcomingMeetingEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingEvent']>>>, ParentType, ContextType, Partial<QueryUpcomingMeetingEventsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  vendor?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType>;
  vendorBillingInfo?: Resolver<Maybe<ResolversTypes['BillingInfo']>, ParentType, ContextType>;
  vendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendorCompanyStripeAccount?: Resolver<Maybe<ResolversTypes['StripeAccountData']>, ParentType, ContextType>;
  vendorCompanyStripeConnectUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<QueryVendorCompanyStripeConnectUrlArgs>>;
  vendorListingSubscriptionCheckoutLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryVendorListingSubscriptionCheckoutLinkArgs, 'cancel_url' | 'success_url'>>;
  vendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType>;
  vendorSurveyData?: Resolver<Maybe<ResolversTypes['CroDbVendorSurvey']>, ParentType, ContextType, Partial<QueryVendorSurveyDataArgs>>;
}>;

export type QuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quote'] = ResolversParentTypes['Quote']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  expired_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  milestones?: Resolver<Maybe<Array<Maybe<ResolversTypes['Milestone']>>>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quote_review?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType>;
  short_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  total_in_escrow?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  total_milestones_paid?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  total_payment?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_draft?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  review_answers?: Resolver<Maybe<Array<Maybe<ResolversTypes['ReviewAnswer']>>>, ParentType, ContextType>;
  review_question_set_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  review_questions?: Resolver<Maybe<Array<Maybe<ResolversTypes['ReviewQuestion']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewAnswerResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewAnswer'] = ResolversParentTypes['ReviewAnswer']> = ResolversObject<{
  answer_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  option_value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rating_value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  review_question_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewQuestion'] = ResolversParentTypes['ReviewQuestion']> = ResolversObject<{
  group_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  ordinal?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  question_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  question_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  review_question_options?: Resolver<Maybe<Array<Maybe<ResolversTypes['ReviewQuestionOption']>>>, ParentType, ContextType>;
  review_question_set_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewQuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewQuestionOption'] = ResolversParentTypes['ReviewQuestionOption']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  option_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ordinal?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewQuestionSetResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewQuestionSet'] = ResolversParentTypes['ReviewQuestionSet']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RuleIntervalResolvers<ContextType = any, ParentType extends ResolversParentTypes['RuleInterval'] = ResolversParentTypes['RuleInterval']> = ResolversObject<{
  from?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourceCroSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourceCroSubscriptionPayload'] = ResolversParentTypes['SourceCroSubscriptionPayload']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  task_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourceRfpSpecialtySubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourceRfpSpecialtySubscriptionPayload'] = ResolversParentTypes['SourceRfpSpecialtySubscriptionPayload']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  task_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcedCroResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcedCro'] = ResolversParentTypes['SourcedCro']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_shortlisted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sourcing_session?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcedCroConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcedCroConnection'] = ResolversParentTypes['SourcedCroConnection']> = ResolversObject<{
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcedCroEdge']>>>, ParentType, ContextType>;
  page_info?: Resolver<Maybe<ResolversTypes['SourcedCroPageInfo']>, ParentType, ContextType>;
  top_match_vendor_company_ids?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcedCroEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcedCroEdge'] = ResolversParentTypes['SourcedCroEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['SourcedCro']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcedCroPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcedCroPageInfo'] = ResolversParentTypes['SourcedCroPageInfo']> = ResolversObject<{
  end_cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  has_next_page?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  total_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcererLiteSearchPaginatedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcererLiteSearchPaginatedResult'] = ResolversParentTypes['SourcererLiteSearchPaginatedResult']> = ResolversObject<{
  did_you_mean_suggestion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcererLiteSearchResultEdge']>>>, ParentType, ContextType>;
  page_info?: Resolver<Maybe<ResolversTypes['SourcererLiteSearchResultPageInfo']>, ParentType, ContextType>;
  related_subspecialty_names?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcererLiteSearchResultEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcererLiteSearchResultEdge'] = ResolversParentTypes['SourcererLiteSearchResultEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcererLiteSearchResultPageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcererLiteSearchResultPageInfo'] = ResolversParentTypes['SourcererLiteSearchResultPageInfo']> = ResolversObject<{
  end_cursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_next_page?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  total_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcingAttachmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcingAttachment'] = ResolversParentTypes['SourcingAttachment']> = ResolversObject<{
  byte_size?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  filename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  formatted_filesize?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signed_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourcing_session?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcingSessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcingSession'] = ResolversParentTypes['SourcingSession']> = ResolversObject<{
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  preparation_details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_desc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortlisted_cros?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcedCro']>>>, ParentType, ContextType>;
  sourced_cros?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcedCro']>>>, ParentType, ContextType>;
  sourcing_attachments?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcingAttachment']>>>, ParentType, ContextType>;
  sourcing_subspecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcingSubspecialty']>>>, ParentType, ContextType>;
  task_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcingSubspecialtyResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcingSubspecialty'] = ResolversParentTypes['SourcingSubspecialty']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  related_subspecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  sourcing_session?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcingTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcingTask'] = ResolversParentTypes['SourcingTask']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StripeAccountCapabilitiesResolvers<ContextType = any, ParentType extends ResolversParentTypes['StripeAccountCapabilities'] = ResolversParentTypes['StripeAccountCapabilities']> = ResolversObject<{
  tax_reporting_us_1099_k?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  transfers?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StripeAccountDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['StripeAccountData'] = ResolversParentTypes['StripeAccountData']> = ResolversObject<{
  capabilities?: Resolver<Maybe<ResolversTypes['StripeAccountCapabilities']>, ParentType, ContextType>;
  charges_enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  details_submitted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  external_accounts?: Resolver<Maybe<ResolversTypes['StripeExternalAccount']>, ParentType, ContextType>;
  payouts_enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requirements?: Resolver<Maybe<ResolversTypes['StripeAccountRequirements']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StripeAccountRequirementErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['StripeAccountRequirementError'] = ResolversParentTypes['StripeAccountRequirementError']> = ResolversObject<{
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StripeAccountRequirementsResolvers<ContextType = any, ParentType extends ResolversParentTypes['StripeAccountRequirements'] = ResolversParentTypes['StripeAccountRequirements']> = ResolversObject<{
  current_deadline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currently_due?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  disabled_reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['StripeAccountRequirementError']>>>, ParentType, ContextType>;
  eventually_due?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  past_due?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  pending_verification?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StripeExternalAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['StripeExternalAccount'] = ResolversParentTypes['StripeExternalAccount']> = ResolversObject<{
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['StripeExternalAccountData']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StripeExternalAccountDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['StripeExternalAccountData'] = ResolversParentTypes['StripeExternalAccountData']> = ResolversObject<{
  bank_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  brand?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exp_month?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  exp_year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  last4?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  object?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  routing_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubmitAttendanceRespResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmitAttendanceResp'] = ResolversParentTypes['SubmitAttendanceResp']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meeting_link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  newMessage?: SubscriptionResolver<Maybe<ResolversTypes['MessageEdge']>, "newMessage", ParentType, ContextType, RequireFields<SubscriptionNewMessageArgs, 'chat_id'>>;
  newNotification?: SubscriptionResolver<Maybe<ResolversTypes['Notification']>, "newNotification", ParentType, ContextType>;
  sourceCros?: SubscriptionResolver<Maybe<ResolversTypes['SourceCroSubscriptionPayload']>, "sourceCros", ParentType, ContextType, RequireFields<SubscriptionSourceCrosArgs, 'task_id'>>;
  sourceRfpSpecialties?: SubscriptionResolver<Maybe<ResolversTypes['SourceRfpSpecialtySubscriptionPayload']>, "sourceRfpSpecialties", ParentType, ContextType, RequireFields<SubscriptionSourceRfpSpecialtiesArgs, 'task_id'>>;
}>;

export type SubscriptionFeatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionFeature'] = ResolversParentTypes['SubscriptionFeature']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['SubscriptionFeatureItem']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionFeatureItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionFeatureItem'] = ResolversParentTypes['SubscriptionFeatureItem']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionPlan'] = ResolversParentTypes['SubscriptionPlan']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  features?: Resolver<Array<ResolversTypes['SubscriptionFeature']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prices?: Resolver<Array<ResolversTypes['SubscriptionPrice']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionPrice'] = ResolversParentTypes['SubscriptionPrice']> = ResolversObject<{
  amount_per_month?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  discount_percentage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interval?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UploadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadResult'] = ResolversParentTypes['UploadResult']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['ProjectAttachment']>, ParentType, ContextType>;
  error_message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  company_collaborator_role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  deactivated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  full_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_completed_onboarding?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_setup_profile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  is_active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_connected_google?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_connected_microsoft?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType>;
  phone_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pseudonyms?: Resolver<Maybe<ResolversTypes['Pseudonyms']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_member?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vendor'] = ResolversParentTypes['Vendor']> = ResolversObject<{
  attachment_content_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  attachment_file_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  attachment_file_size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  attachment_key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  certifications?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  company_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_ipo_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_revenue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_types?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  custom_specialties?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_active_subscription?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hq_locations?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  is_profile_approved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  logo_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  onboarding_step?: Resolver<Maybe<ResolversTypes['VendorOnboardingStep']>, ParentType, ContextType>;
  other_facility_locations?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  stripe_subscription_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subscription_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subspecialty_ids?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_company_role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorCompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorCompany'] = ResolversParentTypes['VendorCompany']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  certification_tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['CertificationTag']>>>, ParentType, ContextType>;
  chats?: Resolver<Maybe<Array<Maybe<ResolversTypes['Chat']>>>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  cro_extra_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  facebook_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  founded_year?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  google_scholar_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invited_by?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_on_marketplace?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lab_specializations?: Resolver<Maybe<Array<Maybe<ResolversTypes['LabSpecialization']>>>, ParentType, ContextType>;
  linkedin_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  primary_members?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMember']>>>, ParentType, ContextType>;
  principal_investigator_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_completed_per_year?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType>;
  skip_certification_tag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  skip_lab_specialization?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripe_account?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  team_size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitter_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  university_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_members?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMember']>>>, ParentType, ContextType>;
  vendor_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zipcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorMember'] = ResolversParentTypes['VendorMember']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_member_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMemberConnection']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorMemberConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorMemberConnection'] = ResolversParentTypes['VendorMemberConnection']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_member?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType>;
  vendor_member_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AuthResponse?: AuthResponseResolvers<ContextType>;
  Availability?: AvailabilityResolvers<ContextType>;
  AvailabilityRule?: AvailabilityRuleResolvers<ContextType>;
  BillingInfo?: BillingInfoResolvers<ContextType>;
  BillingInvoice?: BillingInvoiceResolvers<ContextType>;
  Biotech?: BiotechResolvers<ContextType>;
  BiotechInviteVendor?: BiotechInviteVendorResolvers<ContextType>;
  BiotechInvoice?: BiotechInvoiceResolvers<ContextType>;
  BiotechInvoiceAttachment?: BiotechInvoiceAttachmentResolvers<ContextType>;
  BiotechInvoiceItem?: BiotechInvoiceItemResolvers<ContextType>;
  BlanketPurchaseOrder?: BlanketPurchaseOrderResolvers<ContextType>;
  BlanketPurchaseOrderTransaction?: BlanketPurchaseOrderTransactionResolvers<ContextType>;
  CalendarEvent?: CalendarEventResolvers<ContextType>;
  CalendarUser?: CalendarUserResolvers<ContextType>;
  CertificationTag?: CertificationTagResolvers<ContextType>;
  CertificationTagConnection?: CertificationTagConnectionResolvers<ContextType>;
  Chat?: ChatResolvers<ContextType>;
  CompanyAttachment?: CompanyAttachmentResolvers<ContextType>;
  CompanyAttachmentUploadResult?: CompanyAttachmentUploadResultResolvers<ContextType>;
  CompanyProfile?: CompanyProfileResolvers<ContextType>;
  CroDbSpecialty?: CroDbSpecialtyResolvers<ContextType>;
  CroDbSubspecialty?: CroDbSubspecialtyResolvers<ContextType>;
  CroDbVendorCompany?: CroDbVendorCompanyResolvers<ContextType>;
  CroDbVendorCompanyCertification?: CroDbVendorCompanyCertificationResolvers<ContextType>;
  CroDbVendorCompanyLocation?: CroDbVendorCompanyLocationResolvers<ContextType>;
  CroDbVendorCompanySubspecialty?: CroDbVendorCompanySubspecialtyResolvers<ContextType>;
  CroDbVendorCompanyType?: CroDbVendorCompanyTypeResolvers<ContextType>;
  CroDbVendorSurvey?: CroDbVendorSurveyResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  CustomerConnection?: CustomerConnectionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateWithTimeSlots?: DateWithTimeSlotsResolvers<ContextType>;
  ExternalGuest?: ExternalGuestResolvers<ContextType>;
  InitialVendorSurveyData?: InitialVendorSurveyDataResolvers<ContextType>;
  Invoice?: InvoiceResolvers<ContextType>;
  InvoiceItem?: InvoiceItemResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LabSpecialization?: LabSpecializationResolvers<ContextType>;
  LabSpecializationConnection?: LabSpecializationConnectionResolvers<ContextType>;
  MarkMilestoneCompleteResponse?: MarkMilestoneCompleteResponseResolvers<ContextType>;
  MeetingEvent?: MeetingEventResolvers<ContextType>;
  MeetingParticipant?: MeetingParticipantResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  MessageEdge?: MessageEdgeResolvers<ContextType>;
  MessagesConnection?: MessagesConnectionResolvers<ContextType>;
  MessagesPageInfo?: MessagesPageInfoResolvers<ContextType>;
  Milestone?: MilestoneResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  News?: NewsResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationConnection?: NotificationConnectionResolvers<ContextType>;
  NotificationEdge?: NotificationEdgeResolvers<ContextType>;
  NotificationPageInfo?: NotificationPageInfoResolvers<ContextType>;
  PaymentMethod?: PaymentMethodResolvers<ContextType>;
  Perk?: PerkResolvers<ContextType>;
  PerkCategory?: PerkCategoryResolvers<ContextType>;
  ProjectAttachment?: ProjectAttachmentResolvers<ContextType>;
  ProjectConnection?: ProjectConnectionResolvers<ContextType>;
  ProjectDeclineFeedback?: ProjectDeclineFeedbackResolvers<ContextType>;
  ProjectDeclineTag?: ProjectDeclineTagResolvers<ContextType>;
  ProjectDeclineTagConnection?: ProjectDeclineTagConnectionResolvers<ContextType>;
  ProjectRequest?: ProjectRequestResolvers<ContextType>;
  ProjectRequestCollaborator?: ProjectRequestCollaboratorResolvers<ContextType>;
  ProjectRequestComment?: ProjectRequestCommentResolvers<ContextType>;
  Pseudonyms?: PseudonymsResolvers<ContextType>;
  PubMeeting?: PubMeetingResolvers<ContextType>;
  PubMeetingGuestInfo?: PubMeetingGuestInfoResolvers<ContextType>;
  PubRVSP?: PubRvspResolvers<ContextType>;
  PurchaseOrder?: PurchaseOrderResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Quote?: QuoteResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  ReviewAnswer?: ReviewAnswerResolvers<ContextType>;
  ReviewQuestion?: ReviewQuestionResolvers<ContextType>;
  ReviewQuestionOption?: ReviewQuestionOptionResolvers<ContextType>;
  ReviewQuestionSet?: ReviewQuestionSetResolvers<ContextType>;
  RuleInterval?: RuleIntervalResolvers<ContextType>;
  SourceCroSubscriptionPayload?: SourceCroSubscriptionPayloadResolvers<ContextType>;
  SourceRfpSpecialtySubscriptionPayload?: SourceRfpSpecialtySubscriptionPayloadResolvers<ContextType>;
  SourcedCro?: SourcedCroResolvers<ContextType>;
  SourcedCroConnection?: SourcedCroConnectionResolvers<ContextType>;
  SourcedCroEdge?: SourcedCroEdgeResolvers<ContextType>;
  SourcedCroPageInfo?: SourcedCroPageInfoResolvers<ContextType>;
  SourcererLiteSearchPaginatedResult?: SourcererLiteSearchPaginatedResultResolvers<ContextType>;
  SourcererLiteSearchResultEdge?: SourcererLiteSearchResultEdgeResolvers<ContextType>;
  SourcererLiteSearchResultPageInfo?: SourcererLiteSearchResultPageInfoResolvers<ContextType>;
  SourcingAttachment?: SourcingAttachmentResolvers<ContextType>;
  SourcingSession?: SourcingSessionResolvers<ContextType>;
  SourcingSubspecialty?: SourcingSubspecialtyResolvers<ContextType>;
  SourcingTask?: SourcingTaskResolvers<ContextType>;
  StripeAccountCapabilities?: StripeAccountCapabilitiesResolvers<ContextType>;
  StripeAccountData?: StripeAccountDataResolvers<ContextType>;
  StripeAccountRequirementError?: StripeAccountRequirementErrorResolvers<ContextType>;
  StripeAccountRequirements?: StripeAccountRequirementsResolvers<ContextType>;
  StripeExternalAccount?: StripeExternalAccountResolvers<ContextType>;
  StripeExternalAccountData?: StripeExternalAccountDataResolvers<ContextType>;
  SubmitAttendanceResp?: SubmitAttendanceRespResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SubscriptionFeature?: SubscriptionFeatureResolvers<ContextType>;
  SubscriptionFeatureItem?: SubscriptionFeatureItemResolvers<ContextType>;
  SubscriptionPlan?: SubscriptionPlanResolvers<ContextType>;
  SubscriptionPrice?: SubscriptionPriceResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadResult?: UploadResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vendor?: VendorResolvers<ContextType>;
  VendorCompany?: VendorCompanyResolvers<ContextType>;
  VendorMember?: VendorMemberResolvers<ContextType>;
  VendorMemberConnection?: VendorMemberConnectionResolvers<ContextType>;
}>;

