import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  JSON: any;
  Upload: any;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  access_token: Scalars['String'];
  refresh_token: Scalars['String'];
};

export type Availability = {
  __typename?: 'Availability';
  id: Scalars['String'];
  rules: Array<AvailabilityRule>;
  timezone?: Maybe<Scalars['String']>;
};

export type AvailabilityRule = {
  __typename?: 'AvailabilityRule';
  day: Scalars['String'];
  intervals: Array<RuleInterval>;
};

export type AvailabilityRuleInput = {
  day: Scalars['String'];
  intervals: Array<RuleIntervalInput>;
};

export type Biotech = {
  __typename?: 'Biotech';
  about?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  admins?: Maybe<Array<Maybe<User>>>;
  biotech_extra_info?: Maybe<Scalars['String']>;
  biotech_invoices?: Maybe<Array<Maybe<BiotechInvoice>>>;
  blanket_purchase_orders?: Maybe<Array<Maybe<BlanketPurchaseOrder>>>;
  cda_pandadoc_file_id?: Maybe<Scalars['String']>;
  cda_pandadoc_signer?: Maybe<Scalars['String']>;
  cda_signed_at?: Maybe<Scalars['Date']>;
  chats?: Maybe<Array<Maybe<Chat>>>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  facebook_url?: Maybe<Scalars['String']>;
  founded_year?: Maybe<Scalars['String']>;
  has_active_subscription?: Maybe<Scalars['Boolean']>;
  has_setup_profile?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  legal_name?: Maybe<Scalars['String']>;
  linkedin_url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  number_of_reqs_allowed_without_subscription?: Maybe<Scalars['Int']>;
  owner?: Maybe<User>;
  purchase_orders?: Maybe<Array<Maybe<PurchaseOrder>>>;
  skip_cda?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  stripe_customer_id?: Maybe<Scalars['String']>;
  team_size?: Maybe<Scalars['String']>;
  twitter_url?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  upload_limit?: Maybe<Scalars['Float']>;
  upload_used?: Maybe<Scalars['Float']>;
  website?: Maybe<Scalars['String']>;
  zipcode?: Maybe<Scalars['String']>;
};

export type BiotechInviteVendor = {
  __typename?: 'BiotechInviteVendor';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  company_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  inviter?: Maybe<User>;
  inviter_id?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  project_connection?: Maybe<ProjectConnection>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type BiotechInvoice = {
  __typename?: 'BiotechInvoice';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  biotech_invoice_attachment?: Maybe<BiotechInvoiceAttachment>;
  biotech_invoice_items?: Maybe<Array<Maybe<BiotechInvoiceItem>>>;
  blanket_purchase_order_transaction?: Maybe<BlanketPurchaseOrderTransaction>;
  created_at?: Maybe<Scalars['Date']>;
  due_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  invoice_number?: Maybe<Scalars['String']>;
  paid_at?: Maybe<Scalars['Date']>;
  payment_status?: Maybe<Scalars['String']>;
  purchase_order?: Maybe<PurchaseOrder>;
  reference_id?: Maybe<Scalars['String']>;
  stripe_txn_id?: Maybe<Scalars['String']>;
  total_amount?: Maybe<Scalars['Float']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type BiotechInvoiceAttachment = {
  __typename?: 'BiotechInvoiceAttachment';
  biotech_invoice?: Maybe<BiotechInvoice>;
  biotech_invoice_id?: Maybe<Scalars['String']>;
  byte_size?: Maybe<Scalars['Float']>;
  created_at?: Maybe<Scalars['Date']>;
  document_type?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  formatted_filesize?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  signed_url?: Maybe<Scalars['String']>;
};

export type BiotechInvoiceItem = {
  __typename?: 'BiotechInvoiceItem';
  amount?: Maybe<Scalars['Float']>;
  biotech_invoice?: Maybe<BiotechInvoice>;
  biotech_invoice_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  milestone?: Maybe<Milestone>;
  milestone_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type BlanketPurchaseOrder = {
  __typename?: 'BlanketPurchaseOrder';
  amount?: Maybe<Scalars['Float']>;
  balance_amount?: Maybe<Scalars['Float']>;
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  blanket_purchase_order_transactions?: Maybe<Array<Maybe<BlanketPurchaseOrderTransaction>>>;
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  po_number?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type BlanketPurchaseOrderTransaction = {
  __typename?: 'BlanketPurchaseOrderTransaction';
  amount?: Maybe<Scalars['Float']>;
  biotech_invoice?: Maybe<BiotechInvoice>;
  biotech_invoice_id?: Maybe<Scalars['String']>;
  blanket_purchase_order?: Maybe<BlanketPurchaseOrder>;
  blanket_purchase_order_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  transaction_type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  all_day?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  end_time?: Maybe<Scalars['Date']>;
  guests?: Maybe<Array<Maybe<CalendarUser>>>;
  id?: Maybe<Scalars['String']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  meeting_link?: Maybe<Scalars['String']>;
  organizer?: Maybe<CalendarUser>;
  start_time?: Maybe<Scalars['Date']>;
  timezone?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type CalendarUser = {
  __typename?: 'CalendarUser';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CertificationTag = {
  __typename?: 'CertificationTag';
  full_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['Int']>;
  short_name?: Maybe<Scalars['String']>;
};

export type CertificationTagConnection = {
  __typename?: 'CertificationTagConnection';
  certification_tag?: Maybe<CertificationTag>;
  certification_tag_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
};

export type Chat = {
  __typename?: 'Chat';
  id?: Maybe<Scalars['String']>;
  messages?: Maybe<Array<Maybe<Message>>>;
  messagesConnection?: Maybe<MessagesConnection>;
};


export type ChatMessagesConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
};

export type CompanyAttachment = {
  __typename?: 'CompanyAttachment';
  byte_size?: Maybe<Scalars['Float']>;
  created_at?: Maybe<Scalars['Date']>;
  document_type?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  formatted_filesize?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  signed_url?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
};

export type CompanyAttachmentUploadResult = {
  __typename?: 'CompanyAttachmentUploadResult';
  data?: Maybe<CompanyAttachment>;
  error_message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CreateMilestoneInput = {
  amount: Scalars['Float'];
  description?: InputMaybe<Scalars['String']>;
  timeline?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CroDbSpecialty = {
  __typename?: 'CroDbSpecialty';
  definition?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  subspecialties?: Maybe<Array<Maybe<CroDbSubspecialty>>>;
};

export type CroDbSubspecialty = {
  __typename?: 'CroDbSubspecialty';
  definition?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  specialty?: Maybe<CroDbSpecialty>;
  specialty_id?: Maybe<Scalars['String']>;
};

export type CroDbVendorCompany = {
  __typename?: 'CroDbVendorCompany';
  company_description?: Maybe<Scalars['String']>;
  company_ipo_status?: Maybe<Scalars['String']>;
  company_name?: Maybe<Scalars['String']>;
  company_revenue?: Maybe<Scalars['String']>;
  company_size?: Maybe<Scalars['String']>;
  crunchbase_url?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  is_cromatic_vendor?: Maybe<Scalars['Boolean']>;
  linkedin_url?: Maybe<Scalars['String']>;
  logo_url?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['String']>;
  vendor_company_certifications?: Maybe<Array<Maybe<CroDbVendorCompanyCertification>>>;
  vendor_company_locations?: Maybe<Array<Maybe<CroDbVendorCompanyLocation>>>;
  vendor_company_subspecialties?: Maybe<Array<Maybe<CroDbVendorCompanySubspecialty>>>;
  vendor_company_types?: Maybe<Array<Maybe<CroDbVendorCompanyType>>>;
  website_url?: Maybe<Scalars['String']>;
};

export type CroDbVendorCompanyCertification = {
  __typename?: 'CroDbVendorCompanyCertification';
  certification_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
};

export type CroDbVendorCompanyLocation = {
  __typename?: 'CroDbVendorCompanyLocation';
  country?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
};

export type CroDbVendorCompanySubspecialty = {
  __typename?: 'CroDbVendorCompanySubspecialty';
  id?: Maybe<Scalars['String']>;
  subspecialty?: Maybe<CroDbSubspecialty>;
  subspecialty_id?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
};

export type CroDbVendorCompanyType = {
  __typename?: 'CroDbVendorCompanyType';
  company_type?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
};

export type CroDbVendorSurvey = {
  __typename?: 'CroDbVendorSurvey';
  attachment_content_type?: Maybe<Scalars['String']>;
  attachment_file_name?: Maybe<Scalars['String']>;
  attachment_key?: Maybe<Scalars['String']>;
  certifications?: Maybe<Array<Maybe<Scalars['String']>>>;
  company_name?: Maybe<Scalars['String']>;
  company_types?: Maybe<Array<Maybe<Scalars['String']>>>;
  countries?: Maybe<Array<Maybe<Scalars['String']>>>;
  created_at?: Maybe<Scalars['Date']>;
  custom_specialties?: Maybe<Array<Maybe<Scalars['String']>>>;
  id?: Maybe<Scalars['String']>;
  logo_url?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  subspecialty_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_company?: Maybe<CroDbVendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type CromaticParticipantInput = {
  email: Scalars['String'];
  id: Scalars['String'];
};

export type Customer = {
  __typename?: 'Customer';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  customer_connections?: Maybe<Array<Maybe<CustomerConnection>>>;
  has_setup_profile?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  job_title?: Maybe<Scalars['String']>;
  project_requests?: Maybe<Array<Maybe<ProjectRequest>>>;
  team?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']>;
};

export type CustomerConnection = {
  __typename?: 'CustomerConnection';
  created_at?: Maybe<Scalars['Date']>;
  customer?: Maybe<Customer>;
  customer_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type DateWithTimeSlots = {
  __typename?: 'DateWithTimeSlots';
  date?: Maybe<Scalars['String']>;
  time_slots?: Maybe<Array<Maybe<Scalars['Date']>>>;
};

export type ExternalGuest = {
  __typename?: 'ExternalGuest';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type ExternalParticipantInput = {
  email: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};

export type ExtractedRfp = {
  __typename?: 'ExtractedRfp';
  preparation_details?: Maybe<Scalars['String']>;
  project_desc?: Maybe<Scalars['String']>;
  project_title?: Maybe<Scalars['String']>;
  vendor_requirement?: Maybe<Scalars['String']>;
};

export type InitialVendorSurveyData = {
  __typename?: 'InitialVendorSurveyData';
  countries?: Maybe<Array<Maybe<Scalars['String']>>>;
  has_submitted: Scalars['Boolean'];
  id: Scalars['String'];
  logo_url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  subspecialty_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  vendor_type?: Maybe<Array<Maybe<Scalars['String']>>>;
  website?: Maybe<Scalars['String']>;
};

export type InviteCollaboratorInput = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
};

export type Invoice = {
  __typename?: 'Invoice';
  commission_rate?: Maybe<Scalars['Float']>;
  created_at?: Maybe<Scalars['Date']>;
  due_at?: Maybe<Scalars['Date']>;
  from_date?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  invoice_items?: Maybe<Array<Maybe<InvoiceItem>>>;
  invoice_number?: Maybe<Scalars['String']>;
  paid_at?: Maybe<Scalars['Date']>;
  payment_status?: Maybe<Scalars['String']>;
  stripe_txn_id?: Maybe<Scalars['String']>;
  to_date?: Maybe<Scalars['Date']>;
  total_amount?: Maybe<Scalars['Float']>;
  total_milestone_amount?: Maybe<Scalars['Float']>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
};

export type InvoiceItem = {
  __typename?: 'InvoiceItem';
  amount?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['String']>;
  invoice?: Maybe<Invoice>;
  invoice_id?: Maybe<Scalars['String']>;
  milestone?: Maybe<Milestone>;
  milestone_amount?: Maybe<Scalars['Float']>;
  milestone_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type LabSpecialization = {
  __typename?: 'LabSpecialization';
  full_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['Int']>;
  short_name?: Maybe<Scalars['String']>;
};

export type LabSpecializationConnection = {
  __typename?: 'LabSpecializationConnection';
  id?: Maybe<Scalars['String']>;
  lab_specialization?: Maybe<LabSpecialization>;
  lab_specialization_id?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
};

export type MarkMilestoneCompleteResponse = {
  __typename?: 'MarkMilestoneCompleteResponse';
  milestone?: Maybe<Milestone>;
  upload_results?: Maybe<Array<Maybe<UploadResult>>>;
};

export type MeetingEvent = {
  __typename?: 'MeetingEvent';
  attending_company?: Maybe<Scalars['String']>;
  attending_company_participants?: Maybe<Array<Maybe<MeetingParticipant>>>;
  description?: Maybe<Scalars['String']>;
  end_time?: Maybe<Scalars['Date']>;
  external_guests?: Maybe<Array<Maybe<MeetingParticipant>>>;
  /** @deprecated Use `participants`. */
  guests?: Maybe<Array<Maybe<User>>>;
  id: Scalars['String'];
  meeting_link?: Maybe<Scalars['String']>;
  organizer?: Maybe<User>;
  organizer_company?: Maybe<Scalars['String']>;
  organizer_company_participants?: Maybe<Array<Maybe<MeetingParticipant>>>;
  organizer_id?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  phone_country?: Maybe<Scalars['String']>;
  phone_link?: Maybe<Scalars['String']>;
  phone_pin?: Maybe<Scalars['String']>;
  platform?: Maybe<Scalars['String']>;
  project_connection_id?: Maybe<Scalars['String']>;
  project_request?: Maybe<ProjectRequest>;
  start_time?: Maybe<Scalars['Date']>;
  timezone?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type MeetingParticipant = {
  __typename?: 'MeetingParticipant';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  content?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']>;
};

export type MessageEdge = {
  __typename?: 'MessageEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Message>;
};

export type MessagesConnection = {
  __typename?: 'MessagesConnection';
  edges?: Maybe<Array<Maybe<MessageEdge>>>;
  pageInfo?: Maybe<MessagesPageInfo>;
};

export type MessagesPageInfo = {
  __typename?: 'MessagesPageInfo';
  endCursor: Scalars['String'];
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
};

export type Milestone = {
  __typename?: 'Milestone';
  amount?: Maybe<Scalars['Float']>;
  biotech_invoice_item?: Maybe<BiotechInvoiceItem>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  payment_status?: Maybe<Scalars['String']>;
  project_attachments?: Maybe<Array<Maybe<ProjectAttachment>>>;
  quote?: Maybe<Quote>;
  quote_id?: Maybe<Scalars['String']>;
  short_id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  timeline?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vendor_payment_status?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptProjectConnection?: Maybe<ProjectConnection>;
  acceptQuote?: Maybe<Quote>;
  addMoreParticipants?: Maybe<Array<Maybe<MeetingParticipant>>>;
  addProjectCollaborator?: Maybe<User>;
  answerInvitation?: Maybe<SubmitAttendanceResp>;
  createBiotechInviteVendor?: Maybe<BiotechInviteVendor>;
  createBlanketPurchaseOrder?: Maybe<BlanketPurchaseOrder>;
  createCda?: Maybe<Scalars['Boolean']>;
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
  disconnectOauth2?: Maybe<Scalars['Boolean']>;
  draftQuoteReview?: Maybe<Array<Maybe<ReviewAnswer>>>;
  extractPdfRfp?: Maybe<ExtractedRfp>;
  forgotPassword?: Maybe<Scalars['Boolean']>;
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
  onboardBiotech?: Maybe<Biotech>;
  payByBlanketPurchaseOrder?: Maybe<Milestone>;
  payByPurchaseOrder?: Maybe<Milestone>;
  reactivateCollaborator?: Maybe<User>;
  refreshJWT?: Maybe<AuthResponse>;
  removeAttachment?: Maybe<ProjectAttachment>;
  removeBlanketPurchaseOrder?: Maybe<BlanketPurchaseOrder>;
  removeCompanyAttachment?: Maybe<CompanyAttachment>;
  removeGuest?: Maybe<Scalars['Boolean']>;
  removeMeetingEvent?: Maybe<MeetingEvent>;
  removeParticipant?: Maybe<Scalars['Boolean']>;
  removeProjectCollaborator?: Maybe<User>;
  removeProjectRequestCollaborator?: Maybe<ProjectRequestCollaborator>;
  removeSourcedCroFromShortlist?: Maybe<SourcedCro>;
  resendExpiredQuote?: Maybe<Quote>;
  resendInvitation?: Maybe<User>;
  resendVendorMemberInviteByBiotech?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<Scalars['Boolean']>;
  saveAvailabilityRules?: Maybe<Availability>;
  sendGuestReminder?: Maybe<Scalars['Boolean']>;
  sendMessage?: Maybe<Message>;
  setProjectRequestPublic?: Maybe<ProjectRequest>;
  shortlistSourcedCro?: Maybe<SourcedCro>;
  signInUser: AuthResponse;
  signUpUser: AuthResponse;
  skipAddCertificationTag?: Maybe<VendorCompany>;
  skipAddLabSpecialization?: Maybe<VendorCompany>;
  skipCda?: Maybe<Scalars['Boolean']>;
  sourceCros?: Maybe<SourcingTask>;
  sourceRfpSpecialties?: Maybe<SourcingTask>;
  startChat?: Maybe<Scalars['Boolean']>;
  submitCroInterest?: Maybe<Scalars['Boolean']>;
  subscribeEmailUpdates?: Maybe<Scalars['Boolean']>;
  transferBiotechOwnership?: Maybe<User>;
  transferVendorCompanyOwnership?: Maybe<User>;
  updateBiotech?: Maybe<Biotech>;
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
  updateVendorMember?: Maybe<VendorMember>;
  uploadBiotechInvoicePaymentReceipt?: Maybe<BiotechInvoice>;
  uploadCompanyAttachment?: Maybe<CompanyAttachmentUploadResult>;
  uploadContract?: Maybe<UploadResult>;
  uploadDocuments?: Maybe<Array<Maybe<UploadResult>>>;
  verifyMilestoneAsCompleted?: Maybe<Milestone>;
  withdrawProjectRequest?: Maybe<ProjectRequest>;
};


export type MutationAcceptProjectConnectionArgs = {
  id: Scalars['String'];
};


export type MutationAcceptQuoteArgs = {
  id: Scalars['String'];
};


export type MutationAddMoreParticipantsArgs = {
  cromatic_participants: Array<CromaticParticipantInput>;
  external_participants: Array<ExternalParticipantInput>;
  meeting_event_id: Scalars['String'];
};


export type MutationAddProjectCollaboratorArgs = {
  project_connection_id: Scalars['String'];
  user_id: Scalars['String'];
};


export type MutationAnswerInvitationArgs = {
  answer: Scalars['String'];
  email: Scalars['String'];
  guest_token?: InputMaybe<Scalars['String']>;
  meeting_token: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationCreateBiotechInviteVendorArgs = {
  company_name: Scalars['String'];
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  project_request_id: Scalars['String'];
  website: Scalars['String'];
};


export type MutationCreateBlanketPurchaseOrderArgs = {
  amount: Scalars['Float'];
  name: Scalars['String'];
  po_number: Scalars['String'];
};


export type MutationCreateCertificationTagArgs = {
  full_name: Scalars['String'];
};


export type MutationCreateChatArgs = {
  project_connection_id: Scalars['String'];
};


export type MutationCreateCustomerArgs = {
  company_name: Scalars['String'];
  job_title?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  user_id: Scalars['String'];
};


export type MutationCreateLabSpecializationArgs = {
  full_name: Scalars['String'];
};


export type MutationCreateMeetingEventArgs = {
  cromatic_participants: Array<CromaticParticipantInput>;
  description?: InputMaybe<Scalars['String']>;
  end_time: Scalars['String'];
  external_participants: Array<ExternalParticipantInput>;
  is_sharable?: InputMaybe<Scalars['Boolean']>;
  meeting_link?: InputMaybe<Scalars['String']>;
  platform: Scalars['String'];
  project_connection_id: Scalars['String'];
  start_time: Scalars['String'];
  timezone: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreateProjectDeclineFeedbackArgs = {
  project_connection_id: Scalars['String'];
  project_decline_tag_ids: Array<InputMaybe<Scalars['String']>>;
  reason?: InputMaybe<Scalars['String']>;
};


export type MutationCreateProjectRequestArgs = {
  company_name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  existing_vendor_contact_description?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  in_contact_with_vendor: Scalars['Boolean'];
  is_private: Scalars['Boolean'];
  last_name?: InputMaybe<Scalars['String']>;
  max_budget?: InputMaybe<Scalars['Int']>;
  objective_description: Scalars['String'];
  preparation_description?: InputMaybe<Scalars['String']>;
  project_challenge_description?: InputMaybe<Scalars['String']>;
  project_deadline_requirement?: InputMaybe<Scalars['String']>;
  project_request_collaborators?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  project_start_time_requirement?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  vendor_location_requirement?: InputMaybe<Scalars['String']>;
  vendor_requirement: Scalars['String'];
  vendor_search_timeframe: Scalars['String'];
  website?: InputMaybe<Scalars['String']>;
};


export type MutationCreateProjectRequestCommentArgs = {
  content: Scalars['String'];
  project_request_id: Scalars['String'];
};


export type MutationCreateQuoteArgs = {
  amount: Scalars['Float'];
  milestones?: InputMaybe<Array<CreateMilestoneInput>>;
  project_connection_id: Scalars['String'];
  send_to_biotech?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateVendorSurveyArgs = {
  attachment?: InputMaybe<Scalars['Upload']>;
  certifications?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  company_name: Scalars['String'];
  company_types: Array<Scalars['String']>;
  countries: Array<Scalars['String']>;
  custom_specialties?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  logo: Scalars['Upload'];
  note?: InputMaybe<Scalars['String']>;
  products?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subspecialty_ids: Array<Scalars['String']>;
  token: Scalars['String'];
  website: Scalars['String'];
};


export type MutationDeactivateCollaboratorArgs = {
  user_id: Scalars['String'];
};


export type MutationDeclineQuoteArgs = {
  id: Scalars['String'];
};


export type MutationDeclinedProjectConnectionArgs = {
  id: Scalars['String'];
};


export type MutationDisconnectOauth2Args = {
  provider: Scalars['String'];
};


export type MutationDraftQuoteReviewArgs = {
  input?: InputMaybe<Array<ReviewInput>>;
  is_final_step?: InputMaybe<Scalars['Boolean']>;
  quote_id: Scalars['String'];
};


export type MutationExtractPdfRfpArgs = {
  file: Scalars['Upload'];
};


export type MutationForgotPasswordArgs = {
  email?: InputMaybe<Scalars['String']>;
};


export type MutationInviteCollaboratorArgs = {
  custom_message?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  role?: InputMaybe<Scalars['String']>;
};


export type MutationInviteCollaboratorsArgs = {
  collaborators: Array<InviteCollaboratorInput>;
};


export type MutationInviteCustomerArgs = {
  custom_message?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
};


export type MutationInviteProjectCollaboratorViaEmailArgs = {
  custom_message?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  project_connection_id: Scalars['String'];
  role?: InputMaybe<Scalars['String']>;
};


export type MutationInviteVendorMemberArgs = {
  custom_message?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
};


export type MutationMarkMilestoneAsCompletedArgs = {
  files?: InputMaybe<Array<InputMaybe<Scalars['Upload']>>>;
  id: Scalars['String'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['String'];
};


export type MutationMarkNotificationsInProjectAsReadArgs = {
  project_connection_id: Scalars['String'];
};


export type MutationMarkQuoteNotificationsAsReadArgs = {
  quote_id: Scalars['String'];
};


export type MutationOnboardBiotechArgs = {
  about?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  biotech_extra_info?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  facebook_url?: InputMaybe<Scalars['String']>;
  founded_year?: InputMaybe<Scalars['String']>;
  legal_name?: InputMaybe<Scalars['String']>;
  linkedin_url?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  team_size?: InputMaybe<Scalars['String']>;
  twitter_url?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};


export type MutationPayByBlanketPurchaseOrderArgs = {
  blanket_purchase_order_id: Scalars['String'];
  id: Scalars['String'];
};


export type MutationPayByPurchaseOrderArgs = {
  id: Scalars['String'];
  po_number: Scalars['String'];
};


export type MutationReactivateCollaboratorArgs = {
  user_id: Scalars['String'];
};


export type MutationRemoveAttachmentArgs = {
  id: Scalars['String'];
};


export type MutationRemoveBlanketPurchaseOrderArgs = {
  id: Scalars['String'];
};


export type MutationRemoveCompanyAttachmentArgs = {
  id: Scalars['String'];
};


export type MutationRemoveGuestArgs = {
  email: Scalars['String'];
  meeting_event_id: Scalars['String'];
};


export type MutationRemoveMeetingEventArgs = {
  meeting_event_id: Scalars['String'];
};


export type MutationRemoveParticipantArgs = {
  meeting_event_id: Scalars['String'];
  user_id: Scalars['String'];
};


export type MutationRemoveProjectCollaboratorArgs = {
  project_connection_id: Scalars['String'];
  user_id: Scalars['String'];
};


export type MutationRemoveProjectRequestCollaboratorArgs = {
  customer_id: Scalars['String'];
  project_request_id: Scalars['String'];
};


export type MutationRemoveSourcedCroFromShortlistArgs = {
  sourced_cro_id: Scalars['String'];
  sourcing_session_id: Scalars['String'];
};


export type MutationResendExpiredQuoteArgs = {
  id: Scalars['String'];
};


export type MutationResendInvitationArgs = {
  user_id: Scalars['String'];
};


export type MutationResendVendorMemberInviteByBiotechArgs = {
  biotech_invite_vendor_id: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  new_password?: InputMaybe<Scalars['String']>;
  reset_token?: InputMaybe<Scalars['String']>;
};


export type MutationSaveAvailabilityRulesArgs = {
  input: SaveAvailabilityRulesInput;
};


export type MutationSendGuestReminderArgs = {
  email: Scalars['String'];
  meeting_event_id: Scalars['String'];
};


export type MutationSendMessageArgs = {
  content: Scalars['String'];
  project_connection_id: Scalars['String'];
};


export type MutationSetProjectRequestPublicArgs = {
  project_request_id: Scalars['String'];
};


export type MutationShortlistSourcedCroArgs = {
  sourced_cro_id: Scalars['String'];
  sourcing_session_id: Scalars['String'];
};


export type MutationSignInUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpUserArgs = {
  company_name: Scalars['String'];
  country_code: Scalars['String'];
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  password: Scalars['String'];
  phone_number: Scalars['String'];
};


export type MutationSourceCrosArgs = {
  names: Array<Scalars['String']>;
  sourcing_session_id: Scalars['String'];
};


export type MutationSourceRfpSpecialtiesArgs = {
  preparation_details: Scalars['String'];
  project_desc: Scalars['String'];
  project_title: Scalars['String'];
  sourcing_session_id?: InputMaybe<Scalars['String']>;
  vendor_requirement: Scalars['String'];
};


export type MutationStartChatArgs = {
  project_connection_id: Scalars['String'];
};


export type MutationSubmitCroInterestArgs = {
  company_name: Scalars['String'];
  company_type: Scalars['String'];
  country_code?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  interest: Scalars['String'];
  last_name: Scalars['String'];
  phone_number?: InputMaybe<Scalars['String']>;
  service: Scalars['String'];
};


export type MutationSubscribeEmailUpdatesArgs = {
  email: Scalars['String'];
};


export type MutationTransferBiotechOwnershipArgs = {
  biotech_id: Scalars['String'];
  user_id: Scalars['String'];
};


export type MutationTransferVendorCompanyOwnershipArgs = {
  user_id: Scalars['String'];
  vendor_company_id: Scalars['String'];
};


export type MutationUpdateBiotechArgs = {
  about?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  biotech_extra_info?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  facebook_url?: InputMaybe<Scalars['String']>;
  founded_year?: InputMaybe<Scalars['String']>;
  legal_name?: InputMaybe<Scalars['String']>;
  linkedin_url?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  team_size?: InputMaybe<Scalars['String']>;
  twitter_url?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateBlanketPurchaseOrderArgs = {
  amount: Scalars['Float'];
  id: Scalars['String'];
  name: Scalars['String'];
  po_number: Scalars['String'];
};


export type MutationUpdateCollaboratorRoleArgs = {
  role_type: Scalars['String'];
  user_id: Scalars['String'];
};


export type MutationUpdateCustomerArgs = {
  has_setup_profile?: InputMaybe<Scalars['Boolean']>;
  job_title?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateMeetingDetailsArgs = {
  description?: InputMaybe<Scalars['String']>;
  end_time?: InputMaybe<Scalars['String']>;
  meeting_event_id: Scalars['String'];
  meeting_link?: InputMaybe<Scalars['String']>;
  platform?: InputMaybe<Scalars['String']>;
  start_time?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateMeetingEventSharableArgs = {
  is_sharable: Scalars['Boolean'];
  meeting_event_id: Scalars['String'];
};


export type MutationUpdateProjectRequestCollaboratorsArgs = {
  customer_ids: Array<InputMaybe<Scalars['String']>>;
  project_request_id: Scalars['String'];
};


export type MutationUpdateQuoteArgs = {
  amount: Scalars['Float'];
  id: Scalars['String'];
  milestones: Array<UpdateMilestoneInput>;
  send_to_biotech?: InputMaybe<Scalars['Boolean']>;
};


export type MutationUpdateUserInfoArgs = {
  country_code?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  phone_number?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']>;
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  cro_extra_info?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  facebook_url?: InputMaybe<Scalars['String']>;
  founded_year?: InputMaybe<Scalars['String']>;
  google_scholar_url?: InputMaybe<Scalars['String']>;
  legal_name?: InputMaybe<Scalars['String']>;
  linkedin_url?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  principal_investigator_name?: InputMaybe<Scalars['String']>;
  project_completed_per_year?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  team_size?: InputMaybe<Scalars['String']>;
  twitter_url?: InputMaybe<Scalars['String']>;
  university_name?: InputMaybe<Scalars['String']>;
  vendor_type?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateVendorCompanyCertificationTagsArgs = {
  certification_tag_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  new_certification_tag_names?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationUpdateVendorCompanyLabSpecializationsArgs = {
  lab_specialization_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  new_lab_specialization_names?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationUpdateVendorMemberArgs = {
  department?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUploadBiotechInvoicePaymentReceiptArgs = {
  file: Scalars['Upload'];
  id: Scalars['String'];
};


export type MutationUploadCompanyAttachmentArgs = {
  file: Scalars['Upload'];
  vendor_company_id: Scalars['String'];
};


export type MutationUploadContractArgs = {
  file: Scalars['Upload'];
  project_connection_id: Scalars['String'];
};


export type MutationUploadDocumentsArgs = {
  files: Array<InputMaybe<Scalars['Upload']>>;
  project_connection_id: Scalars['String'];
};


export type MutationVerifyMilestoneAsCompletedArgs = {
  id: Scalars['String'];
  password: Scalars['String'];
};


export type MutationWithdrawProjectRequestArgs = {
  project_request_id: Scalars['String'];
};

export type News = {
  __typename?: 'News';
  cover_img_url?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  is_featured?: Maybe<Scalars['Boolean']>;
  logo_url?: Maybe<Scalars['String']>;
  published_at?: Maybe<Scalars['Date']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Notification = {
  __typename?: 'Notification';
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notification_type?: Maybe<Scalars['String']>;
  params?: Maybe<Scalars['JSON']>;
  read_at?: Maybe<Scalars['Date']>;
  recipient?: Maybe<User>;
  recipient_id?: Maybe<Scalars['String']>;
  sender?: Maybe<User>;
  sender_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  url?: Maybe<Scalars['String']>;
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges?: Maybe<Array<Maybe<NotificationEdge>>>;
  pageInfo?: Maybe<NotificationPageInfo>;
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Notification>;
};

export type NotificationPageInfo = {
  __typename?: 'NotificationPageInfo';
  endCursor: Scalars['String'];
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
};

export type Perk = {
  __typename?: 'Perk';
  created_at?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  expired_at?: Maybe<Scalars['Date']>;
  external_url?: Maybe<Scalars['String']>;
  how_to_redeem?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  perk_category?: Maybe<PerkCategory>;
  perk_category_id?: Maybe<Scalars['String']>;
  reward_description?: Maybe<Scalars['String']>;
  terms?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type PerkCategory = {
  __typename?: 'PerkCategory';
  created_at?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  perks?: Maybe<Array<Maybe<Perk>>>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type ProjectAttachment = {
  __typename?: 'ProjectAttachment';
  byte_size?: Maybe<Scalars['Float']>;
  created_at?: Maybe<Scalars['Date']>;
  document_type?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  formatted_filesize?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  milestone?: Maybe<Milestone>;
  milestone_id?: Maybe<Scalars['String']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']>;
  signed_url?: Maybe<Scalars['String']>;
  zoho_editor_url?: Maybe<Scalars['String']>;
};

export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  biotech_invite_vendor?: Maybe<BiotechInviteVendor>;
  biotech_invite_vendor_id?: Maybe<Scalars['String']>;
  chat?: Maybe<Chat>;
  collaborators_not_invited?: Maybe<Array<Maybe<User>>>;
  created_at?: Maybe<Scalars['Date']>;
  customer_connections?: Maybe<Array<Maybe<CustomerConnection>>>;
  documents?: Maybe<Array<Maybe<ProjectAttachment>>>;
  expired_at?: Maybe<Scalars['Date']>;
  external_collaborators?: Maybe<Array<Maybe<User>>>;
  final_contract?: Maybe<ProjectAttachment>;
  final_contract_uploaded_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  internal_collaborators?: Maybe<Array<Maybe<User>>>;
  messages?: Maybe<Array<Maybe<Message>>>;
  project_attachments?: Maybe<Array<Maybe<ProjectAttachment>>>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']>;
  quotes?: Maybe<Array<Maybe<Quote>>>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
  vendor_display_status?: Maybe<Scalars['String']>;
  vendor_member_connections?: Maybe<Array<Maybe<VendorMemberConnection>>>;
  vendor_status?: Maybe<Scalars['String']>;
};

export type ProjectConnectionFilter = {
  status?: InputMaybe<Scalars['String']>;
};

export type ProjectDeclineFeedback = {
  __typename?: 'ProjectDeclineFeedback';
  id?: Maybe<Scalars['String']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
};

export type ProjectDeclineTag = {
  __typename?: 'ProjectDeclineTag';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type ProjectDeclineTagConnection = {
  __typename?: 'ProjectDeclineTagConnection';
  id?: Maybe<Scalars['String']>;
  project_decline_feedback?: Maybe<ProjectDeclineFeedback>;
  project_decline_feedback_id?: Maybe<Scalars['String']>;
  project_decline_tag?: Maybe<ProjectDeclineTag>;
  project_decline_tag_id?: Maybe<Scalars['String']>;
};

export type ProjectRequest = {
  __typename?: 'ProjectRequest';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  customer?: Maybe<Customer>;
  customer_id?: Maybe<Scalars['String']>;
  existing_vendor_contact_description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  in_contact_with_vendor: Scalars['Boolean'];
  is_private: Scalars['Boolean'];
  max_budget: Scalars['Int'];
  objective_description: Scalars['String'];
  preparation_description?: Maybe<Scalars['String']>;
  project_challenge_description?: Maybe<Scalars['String']>;
  project_connections?: Maybe<Array<Maybe<ProjectConnection>>>;
  project_deadline_requirement?: Maybe<Scalars['String']>;
  project_request_collaborators?: Maybe<Array<Maybe<ProjectRequestCollaborator>>>;
  project_request_comments?: Maybe<Array<Maybe<ProjectRequestComment>>>;
  project_start_time_requirement?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  title: Scalars['String'];
  updated_at?: Maybe<Scalars['Date']>;
  vendor_location_requirement?: Maybe<Scalars['String']>;
  vendor_requirement: Scalars['String'];
  vendor_search_timeframe: Scalars['String'];
};


export type ProjectRequestProject_ConnectionsArgs = {
  filter?: InputMaybe<ProjectRequestProjectConnectionFilter>;
};

export type ProjectRequestCollaborator = {
  __typename?: 'ProjectRequestCollaborator';
  created_at?: Maybe<Scalars['Date']>;
  customer?: Maybe<Customer>;
  customer_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type ProjectRequestComment = {
  __typename?: 'ProjectRequestComment';
  content?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type ProjectRequestProjectConnectionFilter = {
  collaboration_status?: InputMaybe<Scalars['String']>;
  vendor_status?: InputMaybe<Scalars['String']>;
};

export type PubMeeting = {
  __typename?: 'PubMeeting';
  end_time?: Maybe<Scalars['String']>;
  guest_info?: Maybe<PubMeetingGuestInfo>;
  id?: Maybe<Scalars['String']>;
  is_ended?: Maybe<Scalars['Boolean']>;
  meeting_link?: Maybe<Scalars['String']>;
  organizer_company_name?: Maybe<Scalars['String']>;
  organizer_name?: Maybe<Scalars['String']>;
  platform?: Maybe<Scalars['String']>;
  project_title?: Maybe<Scalars['String']>;
  start_time?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type PubMeetingGuestInfo = {
  __typename?: 'PubMeetingGuestInfo';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type PubRvsp = {
  __typename?: 'PubRVSP';
  guest_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  meeting_title?: Maybe<Scalars['String']>;
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  biotech_invoice?: Maybe<BiotechInvoice>;
  biotech_invoice_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  po_number?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
};

export type Query = {
  __typename?: 'Query';
  availability?: Maybe<Availability>;
  availableDateTimeSlots?: Maybe<Array<Maybe<DateWithTimeSlots>>>;
  bioInvitedProjectConnections?: Maybe<Array<Maybe<ProjectConnection>>>;
  biotech?: Maybe<Biotech>;
  biotechInviteVendors?: Maybe<Array<Maybe<BiotechInviteVendor>>>;
  biotechInvoice?: Maybe<BiotechInvoice>;
  biotechInvoices?: Maybe<Array<Maybe<BiotechInvoice>>>;
  blanketPurchaseOrders?: Maybe<Array<Maybe<BlanketPurchaseOrder>>>;
  casbinPermission?: Maybe<Scalars['String']>;
  collaborators?: Maybe<Array<Maybe<User>>>;
  croDbSpecialties?: Maybe<Array<Maybe<CroDbSpecialty>>>;
  croDbSpecialty?: Maybe<CroDbSpecialty>;
  croDbVendorCompany?: Maybe<CroDbVendorCompany>;
  customer?: Maybe<Customer>;
  featuredNews?: Maybe<Array<Maybe<News>>>;
  googleCalendarAuthorizationUri?: Maybe<Scalars['String']>;
  googleCalendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
  initialVendorSurveyData?: Maybe<InitialVendorSurveyData>;
  invoice?: Maybe<Invoice>;
  invoiceCheckoutUrl?: Maybe<Scalars['String']>;
  invoices?: Maybe<Array<Maybe<Invoice>>>;
  meetingEvents?: Maybe<Array<Maybe<MeetingEvent>>>;
  meetingFormAttendees?: Maybe<Array<Maybe<User>>>;
  microsoftCalendarAuthorizationUri?: Maybe<Scalars['String']>;
  microsoftCalendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
  milestone?: Maybe<Milestone>;
  milestoneCheckoutUrl?: Maybe<Scalars['String']>;
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
  sourcingSession?: Maybe<SourcingSession>;
  sourcingSessions?: Maybe<Array<Maybe<SourcingSession>>>;
  stripePricingTableId?: Maybe<Scalars['String']>;
  suggestedCertificationTags?: Maybe<Array<Maybe<CertificationTag>>>;
  suggestedLabSpecializations?: Maybe<Array<Maybe<LabSpecialization>>>;
  upcomingMeetingEvents?: Maybe<Array<Maybe<MeetingEvent>>>;
  user?: Maybe<User>;
  vendorCompany?: Maybe<VendorCompany>;
  vendorCompanyStripeAccount?: Maybe<StripeAccountData>;
  vendorCompanyStripeConnectUrl?: Maybe<Scalars['String']>;
  vendorMember?: Maybe<VendorMember>;
};


export type QueryAvailableDateTimeSlotsArgs = {
  attendee_user_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  duration_in_min: Scalars['Int'];
  from: Scalars['String'];
  meeting_event_id?: InputMaybe<Scalars['String']>;
  timezone: Scalars['String'];
  to: Scalars['String'];
};


export type QueryBioInvitedProjectConnectionsArgs = {
  project_request_id: Scalars['String'];
};


export type QueryBiotechInviteVendorsArgs = {
  project_request_id?: InputMaybe<Scalars['String']>;
};


export type QueryBiotechInvoiceArgs = {
  id: Scalars['String'];
};


export type QueryBiotechInvoicesArgs = {
  has_paid?: InputMaybe<Scalars['Boolean']>;
};


export type QueryCollaboratorsArgs = {
  active_only?: InputMaybe<Scalars['Boolean']>;
};


export type QueryCroDbSpecialtyArgs = {
  name: Scalars['String'];
};


export type QueryCroDbVendorCompanyArgs = {
  id: Scalars['String'];
};


export type QueryGoogleCalendarAuthorizationUriArgs = {
  redirect_url?: InputMaybe<Scalars['String']>;
};


export type QueryInitialVendorSurveyDataArgs = {
  token: Scalars['String'];
};


export type QueryInvoiceArgs = {
  id: Scalars['String'];
};


export type QueryInvoiceCheckoutUrlArgs = {
  cancel_url: Scalars['String'];
  id: Scalars['String'];
  success_url: Scalars['String'];
};


export type QueryMeetingEventsArgs = {
  status?: InputMaybe<Scalars['String']>;
};


export type QueryMeetingFormAttendeesArgs = {
  project_connection_id: Scalars['String'];
};


export type QueryMicrosoftCalendarAuthorizationUriArgs = {
  redirect_url?: InputMaybe<Scalars['String']>;
};


export type QueryMilestoneArgs = {
  id: Scalars['String'];
};


export type QueryMilestoneCheckoutUrlArgs = {
  cancel_url: Scalars['String'];
  id: Scalars['String'];
  success_url: Scalars['String'];
};


export type QueryMoreAttendeesToAddArgs = {
  meeting_event_id: Scalars['String'];
};


export type QueryNotificationsArgs = {
  unread_only?: InputMaybe<Scalars['Boolean']>;
};


export type QueryNotificationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryProjectConnectionArgs = {
  id: Scalars['String'];
};


export type QueryProjectConnectionsArgs = {
  filter?: InputMaybe<ProjectConnectionFilter>;
};


export type QueryProjectRequestArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryProjectRequestsArgs = {
  status?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryPubMeetingArgs = {
  guest_token?: InputMaybe<Scalars['String']>;
  token: Scalars['String'];
};


export type QueryQuoteArgs = {
  id?: InputMaybe<Scalars['String']>;
  project_connection_id?: InputMaybe<Scalars['String']>;
};


export type QueryQuoteReviewArgs = {
  quote_id: Scalars['String'];
};


export type QueryQuoteReviewQuestionsArgs = {
  quote_id: Scalars['String'];
};


export type QuerySearchCertificationTagsArgs = {
  search_content?: InputMaybe<Scalars['String']>;
};


export type QuerySearchLabSpecializationsArgs = {
  search_content?: InputMaybe<Scalars['String']>;
};


export type QuerySourcingSessionArgs = {
  id: Scalars['String'];
};


export type QueryUpcomingMeetingEventsArgs = {
  project_connection_id?: InputMaybe<Scalars['String']>;
};


export type QueryVendorCompanyStripeConnectUrlArgs = {
  refresh_url?: InputMaybe<Scalars['String']>;
  return_url?: InputMaybe<Scalars['String']>;
};

export type Quote = {
  __typename?: 'Quote';
  amount?: Maybe<Scalars['Float']>;
  expired_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  milestones?: Maybe<Array<Maybe<Milestone>>>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']>;
  quote_review?: Maybe<Review>;
  short_id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  total_amount?: Maybe<Scalars['Float']>;
  total_in_escrow?: Maybe<Scalars['Float']>;
  total_milestones_paid?: Maybe<Scalars['Float']>;
  total_payment?: Maybe<Scalars['Float']>;
};

export type Review = {
  __typename?: 'Review';
  id?: Maybe<Scalars['String']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  review_answers?: Maybe<Array<Maybe<ReviewAnswer>>>;
  review_question_set_id?: Maybe<Scalars['String']>;
  review_questions?: Maybe<Array<Maybe<ReviewQuestion>>>;
};

export type ReviewAnswer = {
  __typename?: 'ReviewAnswer';
  answer_text?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  option_value?: Maybe<Scalars['String']>;
  rating_value?: Maybe<Scalars['Int']>;
  review_question_id?: Maybe<Scalars['String']>;
};

export type ReviewInput = {
  answer_text?: InputMaybe<Scalars['String']>;
  option_value?: InputMaybe<Scalars['String']>;
  rating_value?: InputMaybe<Scalars['Int']>;
  review_question_id: Scalars['String'];
};

export type ReviewQuestion = {
  __typename?: 'ReviewQuestion';
  group_title?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  is_required?: Maybe<Scalars['Boolean']>;
  ordinal?: Maybe<Scalars['Int']>;
  question_text?: Maybe<Scalars['String']>;
  question_type?: Maybe<Scalars['String']>;
  review_question_options?: Maybe<Array<Maybe<ReviewQuestionOption>>>;
  review_question_set_id?: Maybe<Scalars['String']>;
};

export type ReviewQuestionOption = {
  __typename?: 'ReviewQuestionOption';
  id?: Maybe<Scalars['String']>;
  option_text?: Maybe<Scalars['String']>;
  ordinal?: Maybe<Scalars['Int']>;
};

export type ReviewQuestionSet = {
  __typename?: 'ReviewQuestionSet';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type RuleInterval = {
  __typename?: 'RuleInterval';
  from: Scalars['String'];
  to: Scalars['String'];
};

export type RuleIntervalInput = {
  from: Scalars['String'];
  to: Scalars['String'];
};

export type SaveAvailabilityRulesInput = {
  rules: Array<AvailabilityRuleInput>;
  timezone: Scalars['String'];
};

export type SourceCroSubscriptionData = {
  __typename?: 'SourceCroSubscriptionData';
  cro_db_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  is_shortlisted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
};

export type SourceCroSubscriptionPayload = {
  __typename?: 'SourceCroSubscriptionPayload';
  data?: Maybe<Array<Maybe<SourceCroSubscriptionData>>>;
  sourcing_session_id?: Maybe<Scalars['String']>;
  task_id?: Maybe<Scalars['String']>;
};

export type SourceRfpSpecialtySubscriptionData = {
  __typename?: 'SourceRfpSpecialtySubscriptionData';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  sourcing_session_id?: Maybe<Scalars['String']>;
};

export type SourceRfpSpecialtySubscriptionPayload = {
  __typename?: 'SourceRfpSpecialtySubscriptionPayload';
  data?: Maybe<Array<Maybe<SourceRfpSpecialtySubscriptionData>>>;
  sourcing_session_id?: Maybe<Scalars['String']>;
  task_id?: Maybe<Scalars['String']>;
};

export type SourcedCro = {
  __typename?: 'SourcedCro';
  cro_db_id?: Maybe<Scalars['String']>;
  cro_db_vendor_company?: Maybe<CroDbVendorCompany>;
  id?: Maybe<Scalars['String']>;
  is_shortlisted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  sourcing_session?: Maybe<SourcingSession>;
  sourcing_session_id?: Maybe<Scalars['String']>;
};

export type SourcingSession = {
  __typename?: 'SourcingSession';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  preparation_details?: Maybe<Scalars['String']>;
  project_desc?: Maybe<Scalars['String']>;
  project_title?: Maybe<Scalars['String']>;
  sourced_cros?: Maybe<Array<Maybe<SourcedCro>>>;
  sourcing_subspecialties?: Maybe<Array<Maybe<SourcingSubspecialty>>>;
  task_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_requirement?: Maybe<Scalars['String']>;
};

export type SourcingSubspecialty = {
  __typename?: 'SourcingSubspecialty';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  sourcing_session?: Maybe<SourcingSession>;
  sourcing_session_id?: Maybe<Scalars['String']>;
};

export type SourcingTask = {
  __typename?: 'SourcingTask';
  id?: Maybe<Scalars['String']>;
  sourcing_session_id?: Maybe<Scalars['String']>;
};

export type StripeAccountCapabilities = {
  __typename?: 'StripeAccountCapabilities';
  tax_reporting_us_1099_k?: Maybe<Scalars['String']>;
  transfers?: Maybe<Scalars['String']>;
};

export type StripeAccountData = {
  __typename?: 'StripeAccountData';
  capabilities?: Maybe<StripeAccountCapabilities>;
  charges_enabled?: Maybe<Scalars['Boolean']>;
  details_submitted?: Maybe<Scalars['Boolean']>;
  external_accounts?: Maybe<StripeExternalAccount>;
  payouts_enabled?: Maybe<Scalars['Boolean']>;
  requirements?: Maybe<StripeAccountRequirements>;
};

export type StripeAccountRequirementError = {
  __typename?: 'StripeAccountRequirementError';
  code?: Maybe<Scalars['String']>;
};

export type StripeAccountRequirements = {
  __typename?: 'StripeAccountRequirements';
  current_deadline?: Maybe<Scalars['String']>;
  currently_due?: Maybe<Array<Maybe<Scalars['String']>>>;
  disabled_reason?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<StripeAccountRequirementError>>>;
  eventually_due?: Maybe<Array<Maybe<Scalars['String']>>>;
  past_due?: Maybe<Array<Maybe<Scalars['String']>>>;
  pending_verification?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type StripeExternalAccount = {
  __typename?: 'StripeExternalAccount';
  data?: Maybe<Array<Maybe<StripeExternalAccountData>>>;
};

export type StripeExternalAccountData = {
  __typename?: 'StripeExternalAccountData';
  bank_name?: Maybe<Scalars['String']>;
  brand?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  exp_month?: Maybe<Scalars['Int']>;
  exp_year?: Maybe<Scalars['Int']>;
  last4?: Maybe<Scalars['String']>;
  object?: Maybe<Scalars['String']>;
  routing_number?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type SubmitAttendanceResp = {
  __typename?: 'SubmitAttendanceResp';
  email?: Maybe<Scalars['String']>;
  meeting_link?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  cdaSignedAt?: Maybe<Scalars['String']>;
  cdaUrl?: Maybe<Scalars['String']>;
  newMessage?: Maybe<MessageEdge>;
  newNotification?: Maybe<Notification>;
  sourceCros?: Maybe<SourceCroSubscriptionPayload>;
  sourceRfpSpecialties?: Maybe<SourceRfpSpecialtySubscriptionPayload>;
};


export type SubscriptionNewMessageArgs = {
  chat_id: Scalars['String'];
};


export type SubscriptionSourceCrosArgs = {
  task_id: Scalars['String'];
};


export type SubscriptionSourceRfpSpecialtiesArgs = {
  task_id: Scalars['String'];
};

export type SubspecialtyNameWithWeight = {
  name: Scalars['String'];
  weight: Scalars['Float'];
};

export type UpdateMilestoneInput = {
  amount: Scalars['Float'];
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  timeline?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type UploadResult = {
  __typename?: 'UploadResult';
  data?: Maybe<ProjectAttachment>;
  error_message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  /** @deprecated Remove after all cda expired. */
  cda_signed_at?: Maybe<Scalars['Date']>;
  cda_url?: Maybe<Scalars['String']>;
  company_collaborator_role?: Maybe<Scalars['String']>;
  company_name?: Maybe<Scalars['String']>;
  country_code?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  customer?: Maybe<Customer>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  full_name?: Maybe<Scalars['String']>;
  has_completed_onboarding?: Maybe<Scalars['Boolean']>;
  has_setup_profile?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  is_connected_google?: Maybe<Scalars['Boolean']>;
  is_connected_microsoft?: Maybe<Scalars['Boolean']>;
  last_name?: Maybe<Scalars['String']>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
  phone_number?: Maybe<Scalars['String']>;
  skip_cda?: Maybe<Scalars['Boolean']>;
  updated_at?: Maybe<Scalars['Date']>;
  user_type?: Maybe<Scalars['String']>;
  vendor_member?: Maybe<VendorMember>;
};

export type VendorCompany = {
  __typename?: 'VendorCompany';
  address?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  cda_pandadoc_file_id?: Maybe<Scalars['String']>;
  cda_pandadoc_signer?: Maybe<Scalars['String']>;
  cda_signed_at?: Maybe<Scalars['Date']>;
  certification_tags?: Maybe<Array<Maybe<CertificationTag>>>;
  chats?: Maybe<Array<Maybe<Chat>>>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  cro_extra_info?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  facebook_url?: Maybe<Scalars['String']>;
  founded_year?: Maybe<Scalars['String']>;
  google_scholar_url?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invited_by?: Maybe<Scalars['String']>;
  is_on_marketplace?: Maybe<Scalars['Boolean']>;
  lab_specializations?: Maybe<Array<Maybe<LabSpecialization>>>;
  legal_name?: Maybe<Scalars['String']>;
  linkedin_url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  primary_members?: Maybe<Array<Maybe<VendorMember>>>;
  principal_investigator_name?: Maybe<Scalars['String']>;
  project_completed_per_year?: Maybe<Scalars['String']>;
  project_connections?: Maybe<Array<Maybe<ProjectConnection>>>;
  skip_cda?: Maybe<Scalars['Boolean']>;
  skip_certification_tag?: Maybe<Scalars['Boolean']>;
  skip_lab_specialization?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  stripe_account?: Maybe<Scalars['String']>;
  team_size?: Maybe<Scalars['String']>;
  twitter_url?: Maybe<Scalars['String']>;
  university_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_members?: Maybe<Array<Maybe<VendorMember>>>;
  vendor_type?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  zipcode?: Maybe<Scalars['String']>;
};

export type VendorMember = {
  __typename?: 'VendorMember';
  created_at?: Maybe<Scalars['Date']>;
  department?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
  vendor_member_connections?: Maybe<Array<Maybe<VendorMemberConnection>>>;
};

export type VendorMemberConnection = {
  __typename?: 'VendorMemberConnection';
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_member?: Maybe<VendorMember>;
  vendor_member_id?: Maybe<Scalars['String']>;
};

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

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  Availability: ResolverTypeWrapper<Availability>;
  AvailabilityRule: ResolverTypeWrapper<AvailabilityRule>;
  AvailabilityRuleInput: AvailabilityRuleInput;
  Biotech: ResolverTypeWrapper<Biotech>;
  BiotechInviteVendor: ResolverTypeWrapper<BiotechInviteVendor>;
  BiotechInvoice: ResolverTypeWrapper<BiotechInvoice>;
  BiotechInvoiceAttachment: ResolverTypeWrapper<BiotechInvoiceAttachment>;
  BiotechInvoiceItem: ResolverTypeWrapper<BiotechInvoiceItem>;
  BlanketPurchaseOrder: ResolverTypeWrapper<BlanketPurchaseOrder>;
  BlanketPurchaseOrderTransaction: ResolverTypeWrapper<BlanketPurchaseOrderTransaction>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CalendarEvent: ResolverTypeWrapper<CalendarEvent>;
  CalendarUser: ResolverTypeWrapper<CalendarUser>;
  CertificationTag: ResolverTypeWrapper<CertificationTag>;
  CertificationTagConnection: ResolverTypeWrapper<CertificationTagConnection>;
  Chat: ResolverTypeWrapper<Chat>;
  CompanyAttachment: ResolverTypeWrapper<CompanyAttachment>;
  CompanyAttachmentUploadResult: ResolverTypeWrapper<CompanyAttachmentUploadResult>;
  CreateMilestoneInput: CreateMilestoneInput;
  CroDbSpecialty: ResolverTypeWrapper<CroDbSpecialty>;
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
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateWithTimeSlots: ResolverTypeWrapper<DateWithTimeSlots>;
  ExternalGuest: ResolverTypeWrapper<ExternalGuest>;
  ExternalParticipantInput: ExternalParticipantInput;
  ExtractedRfp: ResolverTypeWrapper<ExtractedRfp>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  InitialVendorSurveyData: ResolverTypeWrapper<InitialVendorSurveyData>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  InviteCollaboratorInput: InviteCollaboratorInput;
  Invoice: ResolverTypeWrapper<Invoice>;
  InvoiceItem: ResolverTypeWrapper<InvoiceItem>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
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
  SourceCroSubscriptionData: ResolverTypeWrapper<SourceCroSubscriptionData>;
  SourceCroSubscriptionPayload: ResolverTypeWrapper<SourceCroSubscriptionPayload>;
  SourceRfpSpecialtySubscriptionData: ResolverTypeWrapper<SourceRfpSpecialtySubscriptionData>;
  SourceRfpSpecialtySubscriptionPayload: ResolverTypeWrapper<SourceRfpSpecialtySubscriptionPayload>;
  SourcedCro: ResolverTypeWrapper<SourcedCro>;
  SourcingSession: ResolverTypeWrapper<SourcingSession>;
  SourcingSubspecialty: ResolverTypeWrapper<SourcingSubspecialty>;
  SourcingTask: ResolverTypeWrapper<SourcingTask>;
  String: ResolverTypeWrapper<Scalars['String']>;
  StripeAccountCapabilities: ResolverTypeWrapper<StripeAccountCapabilities>;
  StripeAccountData: ResolverTypeWrapper<StripeAccountData>;
  StripeAccountRequirementError: ResolverTypeWrapper<StripeAccountRequirementError>;
  StripeAccountRequirements: ResolverTypeWrapper<StripeAccountRequirements>;
  StripeExternalAccount: ResolverTypeWrapper<StripeExternalAccount>;
  StripeExternalAccountData: ResolverTypeWrapper<StripeExternalAccountData>;
  SubmitAttendanceResp: ResolverTypeWrapper<SubmitAttendanceResp>;
  Subscription: ResolverTypeWrapper<{}>;
  SubspecialtyNameWithWeight: SubspecialtyNameWithWeight;
  UpdateMilestoneInput: UpdateMilestoneInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UploadResult: ResolverTypeWrapper<UploadResult>;
  User: ResolverTypeWrapper<User>;
  VendorCompany: ResolverTypeWrapper<VendorCompany>;
  VendorMember: ResolverTypeWrapper<VendorMember>;
  VendorMemberConnection: ResolverTypeWrapper<VendorMemberConnection>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: AuthResponse;
  Availability: Availability;
  AvailabilityRule: AvailabilityRule;
  AvailabilityRuleInput: AvailabilityRuleInput;
  Biotech: Biotech;
  BiotechInviteVendor: BiotechInviteVendor;
  BiotechInvoice: BiotechInvoice;
  BiotechInvoiceAttachment: BiotechInvoiceAttachment;
  BiotechInvoiceItem: BiotechInvoiceItem;
  BlanketPurchaseOrder: BlanketPurchaseOrder;
  BlanketPurchaseOrderTransaction: BlanketPurchaseOrderTransaction;
  Boolean: Scalars['Boolean'];
  CalendarEvent: CalendarEvent;
  CalendarUser: CalendarUser;
  CertificationTag: CertificationTag;
  CertificationTagConnection: CertificationTagConnection;
  Chat: Chat;
  CompanyAttachment: CompanyAttachment;
  CompanyAttachmentUploadResult: CompanyAttachmentUploadResult;
  CreateMilestoneInput: CreateMilestoneInput;
  CroDbSpecialty: CroDbSpecialty;
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
  Date: Scalars['Date'];
  DateWithTimeSlots: DateWithTimeSlots;
  ExternalGuest: ExternalGuest;
  ExternalParticipantInput: ExternalParticipantInput;
  ExtractedRfp: ExtractedRfp;
  Float: Scalars['Float'];
  InitialVendorSurveyData: InitialVendorSurveyData;
  Int: Scalars['Int'];
  InviteCollaboratorInput: InviteCollaboratorInput;
  Invoice: Invoice;
  InvoiceItem: InvoiceItem;
  JSON: Scalars['JSON'];
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
  SourceCroSubscriptionData: SourceCroSubscriptionData;
  SourceCroSubscriptionPayload: SourceCroSubscriptionPayload;
  SourceRfpSpecialtySubscriptionData: SourceRfpSpecialtySubscriptionData;
  SourceRfpSpecialtySubscriptionPayload: SourceRfpSpecialtySubscriptionPayload;
  SourcedCro: SourcedCro;
  SourcingSession: SourcingSession;
  SourcingSubspecialty: SourcingSubspecialty;
  SourcingTask: SourcingTask;
  String: Scalars['String'];
  StripeAccountCapabilities: StripeAccountCapabilities;
  StripeAccountData: StripeAccountData;
  StripeAccountRequirementError: StripeAccountRequirementError;
  StripeAccountRequirements: StripeAccountRequirements;
  StripeExternalAccount: StripeExternalAccount;
  StripeExternalAccountData: StripeExternalAccountData;
  SubmitAttendanceResp: SubmitAttendanceResp;
  Subscription: {};
  SubspecialtyNameWithWeight: SubspecialtyNameWithWeight;
  UpdateMilestoneInput: UpdateMilestoneInput;
  Upload: Scalars['Upload'];
  UploadResult: UploadResult;
  User: User;
  VendorCompany: VendorCompany;
  VendorMember: VendorMember;
  VendorMemberConnection: VendorMemberConnection;
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

export type BiotechResolvers<ContextType = any, ParentType extends ResolversParentTypes['Biotech'] = ResolversParentTypes['Biotech']> = ResolversObject<{
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  admins?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  biotech_extra_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  biotech_invoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInvoice']>>>, ParentType, ContextType>;
  blanket_purchase_orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['BlanketPurchaseOrder']>>>, ParentType, ContextType>;
  cda_pandadoc_file_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_pandadoc_signer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_signed_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
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
  legal_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  linkedin_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  number_of_reqs_allowed_without_subscription?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  purchase_orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['PurchaseOrder']>>>, ParentType, ContextType>;
  skip_cda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
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
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_cromatic_vendor?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  linkedin_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logo_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company_certifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbVendorCompanyCertification']>>>, ParentType, ContextType>;
  vendor_company_locations?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbVendorCompanyLocation']>>>, ParentType, ContextType>;
  vendor_company_subspecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbVendorCompanySubspecialty']>>>, ParentType, ContextType>;
  vendor_company_types?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbVendorCompanyType']>>>, ParentType, ContextType>;
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
  certifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_types?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  countries?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  custom_specialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logo_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subspecialty_ids?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
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

export type ExtractedRfpResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExtractedRfp'] = ResolversParentTypes['ExtractedRfp']> = ResolversObject<{
  preparation_details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_desc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InitialVendorSurveyDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['InitialVendorSurveyData'] = ResolversParentTypes['InitialVendorSurveyData']> = ResolversObject<{
  countries?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  has_submitted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logo_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subspecialty_ids?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  vendor_type?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
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
  createBiotechInviteVendor?: Resolver<Maybe<ResolversTypes['BiotechInviteVendor']>, ParentType, ContextType, RequireFields<MutationCreateBiotechInviteVendorArgs, 'company_name' | 'email' | 'first_name' | 'last_name' | 'project_request_id' | 'website'>>;
  createBlanketPurchaseOrder?: Resolver<Maybe<ResolversTypes['BlanketPurchaseOrder']>, ParentType, ContextType, RequireFields<MutationCreateBlanketPurchaseOrderArgs, 'amount' | 'name' | 'po_number'>>;
  createCda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagArgs, 'full_name'>>;
  createChat?: Resolver<Maybe<ResolversTypes['Chat']>, ParentType, ContextType, RequireFields<MutationCreateChatArgs, 'project_connection_id'>>;
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'company_name' | 'user_id'>>;
  createLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationArgs, 'full_name'>>;
  createMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationCreateMeetingEventArgs, 'cromatic_participants' | 'end_time' | 'external_participants' | 'platform' | 'project_connection_id' | 'start_time' | 'timezone' | 'title'>>;
  createProjectDeclineFeedback?: Resolver<Maybe<ResolversTypes['ProjectDeclineFeedback']>, ParentType, ContextType, RequireFields<MutationCreateProjectDeclineFeedbackArgs, 'project_connection_id' | 'project_decline_tag_ids'>>;
  createProjectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestArgs, 'in_contact_with_vendor' | 'is_private' | 'objective_description' | 'title' | 'vendor_requirement' | 'vendor_search_timeframe'>>;
  createProjectRequestComment?: Resolver<Maybe<ResolversTypes['ProjectRequestComment']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestCommentArgs, 'content' | 'project_request_id'>>;
  createQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationCreateQuoteArgs, 'amount' | 'project_connection_id'>>;
  createVendorSurvey?: Resolver<Maybe<ResolversTypes['CroDbVendorSurvey']>, ParentType, ContextType, RequireFields<MutationCreateVendorSurveyArgs, 'company_name' | 'company_types' | 'countries' | 'logo' | 'subspecialty_ids' | 'token' | 'website'>>;
  deactivateCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeactivateCollaboratorArgs, 'user_id'>>;
  declineQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationDeclineQuoteArgs, 'id'>>;
  declinedProjectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<MutationDeclinedProjectConnectionArgs, 'id'>>;
  disconnectOauth2?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDisconnectOauth2Args, 'provider'>>;
  draftQuoteReview?: Resolver<Maybe<Array<Maybe<ResolversTypes['ReviewAnswer']>>>, ParentType, ContextType, RequireFields<MutationDraftQuoteReviewArgs, 'quote_id'>>;
  extractPdfRfp?: Resolver<Maybe<ResolversTypes['ExtractedRfp']>, ParentType, ContextType, RequireFields<MutationExtractPdfRfpArgs, 'file'>>;
  forgotPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationForgotPasswordArgs>>;
  inviteCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInviteCollaboratorArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteCollaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<MutationInviteCollaboratorsArgs, 'collaborators'>>;
  inviteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationInviteCustomerArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteProjectCollaboratorViaEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInviteProjectCollaboratorViaEmailArgs, 'email' | 'first_name' | 'last_name' | 'project_connection_id'>>;
  inviteVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberArgs, 'email' | 'first_name' | 'last_name'>>;
  markMilestoneAsCompleted?: Resolver<Maybe<ResolversTypes['MarkMilestoneCompleteResponse']>, ParentType, ContextType, RequireFields<MutationMarkMilestoneAsCompletedArgs, 'id'>>;
  markNotificationAsRead?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationMarkNotificationAsReadArgs, 'id'>>;
  markNotificationsInProjectAsRead?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, RequireFields<MutationMarkNotificationsInProjectAsReadArgs, 'project_connection_id'>>;
  markQuoteNotificationsAsRead?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, RequireFields<MutationMarkQuoteNotificationsAsReadArgs, 'quote_id'>>;
  onboardBiotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationOnboardBiotechArgs>>;
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
  saveAvailabilityRules?: Resolver<Maybe<ResolversTypes['Availability']>, ParentType, ContextType, RequireFields<MutationSaveAvailabilityRulesArgs, 'input'>>;
  sendGuestReminder?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendGuestReminderArgs, 'email' | 'meeting_event_id'>>;
  sendMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'content' | 'project_connection_id'>>;
  setProjectRequestPublic?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationSetProjectRequestPublicArgs, 'project_request_id'>>;
  shortlistSourcedCro?: Resolver<Maybe<ResolversTypes['SourcedCro']>, ParentType, ContextType, RequireFields<MutationShortlistSourcedCroArgs, 'sourced_cro_id' | 'sourcing_session_id'>>;
  signInUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignInUserArgs, 'email' | 'password'>>;
  signUpUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignUpUserArgs, 'company_name' | 'country_code' | 'email' | 'first_name' | 'last_name' | 'password' | 'phone_number'>>;
  skipAddCertificationTag?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  skipAddLabSpecialization?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  skipCda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sourceCros?: Resolver<Maybe<ResolversTypes['SourcingTask']>, ParentType, ContextType, RequireFields<MutationSourceCrosArgs, 'names' | 'sourcing_session_id'>>;
  sourceRfpSpecialties?: Resolver<Maybe<ResolversTypes['SourcingTask']>, ParentType, ContextType, RequireFields<MutationSourceRfpSpecialtiesArgs, 'preparation_details' | 'project_desc' | 'project_title' | 'vendor_requirement'>>;
  startChat?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationStartChatArgs, 'project_connection_id'>>;
  submitCroInterest?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubmitCroInterestArgs, 'company_name' | 'company_type' | 'email' | 'first_name' | 'interest' | 'last_name' | 'service'>>;
  subscribeEmailUpdates?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubscribeEmailUpdatesArgs, 'email'>>;
  transferBiotechOwnership?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationTransferBiotechOwnershipArgs, 'biotech_id' | 'user_id'>>;
  transferVendorCompanyOwnership?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationTransferVendorCompanyOwnershipArgs, 'user_id' | 'vendor_company_id'>>;
  updateBiotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationUpdateBiotechArgs>>;
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
  updateVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, Partial<MutationUpdateVendorMemberArgs>>;
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
  max_budget?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  objective_description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preparation_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_challenge_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType, Partial<ProjectRequestProject_ConnectionsArgs>>;
  project_deadline_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_request_collaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequestCollaborator']>>>, ParentType, ContextType>;
  project_request_comments?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequestComment']>>>, ParentType, ContextType>;
  project_start_time_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  bioInvitedProjectConnections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType, RequireFields<QueryBioInvitedProjectConnectionsArgs, 'project_request_id'>>;
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotechInviteVendors?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInviteVendor']>>>, ParentType, ContextType, Partial<QueryBiotechInviteVendorsArgs>>;
  biotechInvoice?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType, RequireFields<QueryBiotechInvoiceArgs, 'id'>>;
  biotechInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInvoice']>>>, ParentType, ContextType, Partial<QueryBiotechInvoicesArgs>>;
  blanketPurchaseOrders?: Resolver<Maybe<Array<Maybe<ResolversTypes['BlanketPurchaseOrder']>>>, ParentType, ContextType>;
  casbinPermission?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, Partial<QueryCollaboratorsArgs>>;
  croDbSpecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['CroDbSpecialty']>>>, ParentType, ContextType>;
  croDbSpecialty?: Resolver<Maybe<ResolversTypes['CroDbSpecialty']>, ParentType, ContextType, RequireFields<QueryCroDbSpecialtyArgs, 'name'>>;
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
  sourcingSession?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType, RequireFields<QuerySourcingSessionArgs, 'id'>>;
  sourcingSessions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcingSession']>>>, ParentType, ContextType>;
  stripePricingTableId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  suggestedCertificationTags?: Resolver<Maybe<Array<Maybe<ResolversTypes['CertificationTag']>>>, ParentType, ContextType>;
  suggestedLabSpecializations?: Resolver<Maybe<Array<Maybe<ResolversTypes['LabSpecialization']>>>, ParentType, ContextType>;
  upcomingMeetingEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingEvent']>>>, ParentType, ContextType, Partial<QueryUpcomingMeetingEventsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  vendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendorCompanyStripeAccount?: Resolver<Maybe<ResolversTypes['StripeAccountData']>, ParentType, ContextType>;
  vendorCompanyStripeConnectUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<QueryVendorCompanyStripeConnectUrlArgs>>;
  vendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType>;
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

export type SourceCroSubscriptionDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourceCroSubscriptionData'] = ResolversParentTypes['SourceCroSubscriptionData']> = ResolversObject<{
  cro_db_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_shortlisted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourceCroSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourceCroSubscriptionPayload'] = ResolversParentTypes['SourceCroSubscriptionPayload']> = ResolversObject<{
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourceCroSubscriptionData']>>>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  task_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourceRfpSpecialtySubscriptionDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourceRfpSpecialtySubscriptionData'] = ResolversParentTypes['SourceRfpSpecialtySubscriptionData']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourceRfpSpecialtySubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourceRfpSpecialtySubscriptionPayload'] = ResolversParentTypes['SourceRfpSpecialtySubscriptionPayload']> = ResolversObject<{
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourceRfpSpecialtySubscriptionData']>>>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  task_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcedCroResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcedCro'] = ResolversParentTypes['SourcedCro']> = ResolversObject<{
  cro_db_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cro_db_vendor_company?: Resolver<Maybe<ResolversTypes['CroDbVendorCompany']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_shortlisted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sourcing_session?: Resolver<Maybe<ResolversTypes['SourcingSession']>, ParentType, ContextType>;
  sourcing_session_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcingSessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcingSession'] = ResolversParentTypes['SourcingSession']> = ResolversObject<{
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  preparation_details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_desc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourced_cros?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcedCro']>>>, ParentType, ContextType>;
  sourcing_subspecialties?: Resolver<Maybe<Array<Maybe<ResolversTypes['SourcingSubspecialty']>>>, ParentType, ContextType>;
  task_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourcingSubspecialtyResolvers<ContextType = any, ParentType extends ResolversParentTypes['SourcingSubspecialty'] = ResolversParentTypes['SourcingSubspecialty']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  cdaSignedAt?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "cdaSignedAt", ParentType, ContextType>;
  cdaUrl?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "cdaUrl", ParentType, ContextType>;
  newMessage?: SubscriptionResolver<Maybe<ResolversTypes['MessageEdge']>, "newMessage", ParentType, ContextType, RequireFields<SubscriptionNewMessageArgs, 'chat_id'>>;
  newNotification?: SubscriptionResolver<Maybe<ResolversTypes['Notification']>, "newNotification", ParentType, ContextType>;
  sourceCros?: SubscriptionResolver<Maybe<ResolversTypes['SourceCroSubscriptionPayload']>, "sourceCros", ParentType, ContextType, RequireFields<SubscriptionSourceCrosArgs, 'task_id'>>;
  sourceRfpSpecialties?: SubscriptionResolver<Maybe<ResolversTypes['SourceRfpSpecialtySubscriptionPayload']>, "sourceRfpSpecialties", ParentType, ContextType, RequireFields<SubscriptionSourceRfpSpecialtiesArgs, 'task_id'>>;
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
  cda_signed_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  cda_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_collaborator_role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  full_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_completed_onboarding?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_setup_profile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_connected_google?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_connected_microsoft?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType>;
  phone_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  skip_cda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_member?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorCompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorCompany'] = ResolversParentTypes['VendorCompany']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_pandadoc_file_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_pandadoc_signer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_signed_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
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
  legal_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  linkedin_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  primary_members?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMember']>>>, ParentType, ContextType>;
  principal_investigator_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_completed_per_year?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType>;
  skip_cda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
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
  ExtractedRfp?: ExtractedRfpResolvers<ContextType>;
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
  SourceCroSubscriptionData?: SourceCroSubscriptionDataResolvers<ContextType>;
  SourceCroSubscriptionPayload?: SourceCroSubscriptionPayloadResolvers<ContextType>;
  SourceRfpSpecialtySubscriptionData?: SourceRfpSpecialtySubscriptionDataResolvers<ContextType>;
  SourceRfpSpecialtySubscriptionPayload?: SourceRfpSpecialtySubscriptionPayloadResolvers<ContextType>;
  SourcedCro?: SourcedCroResolvers<ContextType>;
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
  Upload?: GraphQLScalarType;
  UploadResult?: UploadResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VendorCompany?: VendorCompanyResolvers<ContextType>;
  VendorMember?: VendorMemberResolvers<ContextType>;
  VendorMemberConnection?: VendorMemberConnectionResolvers<ContextType>;
}>;

