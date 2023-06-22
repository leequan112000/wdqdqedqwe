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

export type Admin = {
  __typename?: 'Admin';
  created_at?: Maybe<Scalars['Date']>;
  email?: Maybe<Scalars['String']>;
  encrypted_password?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  team?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  username?: Maybe<Scalars['String']>;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  access_token: Scalars['String'];
  refresh_token: Scalars['String'];
};

export type Biotech = {
  __typename?: 'Biotech';
  about?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  biotech_extra_info?: Maybe<Scalars['String']>;
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
  skip_cda?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  stripe_customer_id?: Maybe<Scalars['String']>;
  twitter_url?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  upload_limit?: Maybe<Scalars['Float']>;
  upload_used?: Maybe<Scalars['Float']>;
  website?: Maybe<Scalars['String']>;
  zipcode?: Maybe<Scalars['String']>;
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
  amount: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  timeline?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
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

export type InviteCollaboratorInput = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
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
  lab_specialization?: Maybe<LabSpecializationConnection>;
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
  description?: Maybe<Scalars['String']>;
  end_time?: Maybe<Scalars['Date']>;
  guests?: Maybe<Array<Maybe<User>>>;
  id?: Maybe<Scalars['String']>;
  meeting_link?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  phone_country?: Maybe<Scalars['String']>;
  phone_link?: Maybe<Scalars['String']>;
  phone_pin?: Maybe<Scalars['String']>;
  project_connection_id?: Maybe<Scalars['String']>;
  project_request?: Maybe<ProjectRequest>;
  start_time?: Maybe<Scalars['Date']>;
  timezone?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  content?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']>;
};

export type Milestone = {
  __typename?: 'Milestone';
  amount?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  payment_status?: Maybe<Scalars['String']>;
  project_attachments?: Maybe<Array<Maybe<ProjectAttachment>>>;
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
  addProjectCollaborator?: Maybe<User>;
  createAdmin?: Maybe<Admin>;
  createCda?: Maybe<Scalars['Boolean']>;
  createCertificationTag?: Maybe<CertificationTag>;
  createCertificationTagConnection?: Maybe<CertificationTagConnection>;
  createChat?: Maybe<Chat>;
  createCustomer: Customer;
  createLabSpecialization?: Maybe<LabSpecialization>;
  createLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  createMeetingEvent?: Maybe<MeetingEvent>;
  createProjectRequest?: Maybe<ProjectRequest>;
  createProjectRequestComment?: Maybe<ProjectRequestComment>;
  createQuote?: Maybe<Quote>;
  createVendorCompany?: Maybe<VendorCompany>;
  declineQuote?: Maybe<Quote>;
  declinedProjectConnection?: Maybe<ProjectConnection>;
  deleteAdmin?: Maybe<Scalars['Boolean']>;
  deleteCertificationTagConnection?: Maybe<CertificationTagConnection>;
  deleteLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  forgotPassword?: Maybe<Scalars['Boolean']>;
  inviteCollaborator?: Maybe<User>;
  inviteCollaborators?: Maybe<Array<Maybe<User>>>;
  /** @deprecated Use `inviteCollaborator`. */
  inviteCustomer?: Maybe<Customer>;
  inviteProjectCollaboratorViaEmail?: Maybe<User>;
  inviteVendorCompaniesToProjectByAdmin?: Maybe<Scalars['Boolean']>;
  /** @deprecated Use `inviteCollaborator`. */
  inviteVendorMember?: Maybe<VendorMember>;
  inviteVendorMemberByAdmin?: Maybe<VendorMember>;
  markMilestoneAsCompleted?: Maybe<MarkMilestoneCompleteResponse>;
  markNotificationAsRead?: Maybe<Notification>;
  markNotificationsInProjectAsRead?: Maybe<Array<Maybe<Notification>>>;
  onboardBiotech?: Maybe<Biotech>;
  payVendor?: Maybe<Milestone>;
  refreshJWT?: Maybe<AuthResponse>;
  removeAttachment?: Maybe<ProjectAttachment>;
  removeCompanyAttachment?: Maybe<CompanyAttachment>;
  removeMeetingEvent?: Maybe<MeetingEvent>;
  removeProjectCollaborator?: Maybe<User>;
  resendInvitation?: Maybe<User>;
  resendVendorMemberInvitationByAdmin?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<Scalars['Boolean']>;
  sendMessage?: Maybe<Message>;
  signInUser: AuthResponse;
  signUpUser: AuthResponse;
  skipCda?: Maybe<Scalars['Boolean']>;
  submitCroInterest?: Maybe<Scalars['Boolean']>;
  subscribeEmailUpdates?: Maybe<Scalars['Boolean']>;
  updateBiotech?: Maybe<Biotech>;
  updateCustomer: Customer;
  updateMeetingEvent?: Maybe<MeetingEvent>;
  updateQuote?: Maybe<Quote>;
  updateUserInfo?: Maybe<User>;
  updateVendorCompany?: Maybe<VendorCompany>;
  updateVendorCompanyCertificationTags?: Maybe<VendorCompany>;
  updateVendorCompanyLabSpecializations?: Maybe<VendorCompany>;
  updateVendorMember?: Maybe<VendorMember>;
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


export type MutationAddProjectCollaboratorArgs = {
  project_connection_id: Scalars['String'];
  user_id: Scalars['String'];
};


export type MutationCreateAdminArgs = {
  email: Scalars['String'];
  encrypted_password?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};


export type MutationCreateCertificationTagArgs = {
  full_name: Scalars['String'];
};


export type MutationCreateCertificationTagConnectionArgs = {
  certification_tag_id?: InputMaybe<Scalars['String']>;
  vendor_company_id?: InputMaybe<Scalars['String']>;
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


export type MutationCreateLabSpecializationConnectionArgs = {
  lab_specialization_id?: InputMaybe<Scalars['String']>;
  vendor_company_id?: InputMaybe<Scalars['String']>;
};


export type MutationCreateMeetingEventArgs = {
  attendees: Array<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  end_time: Scalars['String'];
  project_connection_id: Scalars['String'];
  start_time: Scalars['String'];
  timezone: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreateProjectRequestArgs = {
  existing_vendor_contact_description?: InputMaybe<Scalars['String']>;
  in_contact_with_vendor: Scalars['Boolean'];
  max_budget?: InputMaybe<Scalars['Int']>;
  objective_description: Scalars['String'];
  preparation_description?: InputMaybe<Scalars['String']>;
  project_challenge_description?: InputMaybe<Scalars['String']>;
  project_deadline_requirement?: InputMaybe<Scalars['String']>;
  project_start_time_requirement?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  vendor_location_requirement?: InputMaybe<Scalars['String']>;
  vendor_requirement: Scalars['String'];
  vendor_search_timeframe: Scalars['String'];
};


export type MutationCreateProjectRequestCommentArgs = {
  content: Scalars['String'];
  project_request_id: Scalars['String'];
};


export type MutationCreateQuoteArgs = {
  amount: Scalars['Int'];
  milestones?: InputMaybe<Array<CreateMilestoneInput>>;
  project_connection_id: Scalars['String'];
  send_to_biotech?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  skip_cda?: InputMaybe<Scalars['Boolean']>;
  vendor_type?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};


export type MutationDeclineQuoteArgs = {
  id: Scalars['String'];
};


export type MutationDeclinedProjectConnectionArgs = {
  id: Scalars['String'];
};


export type MutationDeleteAdminArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCertificationTagConnectionArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteLabSpecializationConnectionArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type MutationForgotPasswordArgs = {
  email?: InputMaybe<Scalars['String']>;
};


export type MutationInviteCollaboratorArgs = {
  custom_message?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
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
};


export type MutationInviteVendorCompaniesToProjectByAdminArgs = {
  project_request_id: Scalars['String'];
  vendor_company_ids: Array<InputMaybe<Scalars['String']>>;
};


export type MutationInviteVendorMemberArgs = {
  custom_message?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
};


export type MutationInviteVendorMemberByAdminArgs = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  vendor_company_id: Scalars['String'];
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
  twitter_url?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};


export type MutationPayVendorArgs = {
  id: Scalars['String'];
};


export type MutationRemoveAttachmentArgs = {
  id: Scalars['String'];
};


export type MutationRemoveCompanyAttachmentArgs = {
  id: Scalars['String'];
};


export type MutationRemoveMeetingEventArgs = {
  meeting_event_id: Scalars['String'];
};


export type MutationRemoveProjectCollaboratorArgs = {
  project_connection_id: Scalars['String'];
  user_id: Scalars['String'];
};


export type MutationResendInvitationArgs = {
  user_id: Scalars['String'];
};


export type MutationResendVendorMemberInvitationByAdminArgs = {
  user_id: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  new_password?: InputMaybe<Scalars['String']>;
  reset_token?: InputMaybe<Scalars['String']>;
};


export type MutationSendMessageArgs = {
  content: Scalars['String'];
  project_connection_id: Scalars['String'];
};


export type MutationSignInUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpUserArgs = {
  company_name: Scalars['String'];
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSubmitCroInterestArgs = {
  company_name: Scalars['String'];
  company_type: Scalars['String'];
  email: Scalars['String'];
  first_name: Scalars['String'];
  interest: Scalars['String'];
  last_name: Scalars['String'];
  service: Scalars['String'];
};


export type MutationSubscribeEmailUpdatesArgs = {
  email: Scalars['String'];
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
  twitter_url?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCustomerArgs = {
  has_setup_profile?: InputMaybe<Scalars['Boolean']>;
  job_title?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateMeetingEventArgs = {
  attendees: Array<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  end_time: Scalars['String'];
  meeting_event_id: Scalars['String'];
  start_time: Scalars['String'];
  timezone: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdateQuoteArgs = {
  amount: Scalars['Int'];
  id: Scalars['String'];
  milestones: Array<UpdateMilestoneInput>;
  send_to_biotech?: InputMaybe<Scalars['Boolean']>;
};


export type MutationUpdateUserInfoArgs = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
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
  is_primary_member?: InputMaybe<Scalars['Boolean']>;
  phone?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
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
};


export type MutationWithdrawProjectRequestArgs = {
  project_request_id: Scalars['String'];
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
  unsubscribed_has_new_message?: Maybe<Scalars['Boolean']>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
  vendor_member_connections?: Maybe<Array<Maybe<VendorMemberConnection>>>;
  vendor_status?: Maybe<Scalars['String']>;
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
  max_budget: Scalars['Int'];
  objective_description: Scalars['String'];
  preparation_description?: Maybe<Scalars['String']>;
  project_challenge_description?: Maybe<Scalars['String']>;
  project_connections?: Maybe<Array<Maybe<ProjectConnection>>>;
  project_deadline_requirement?: Maybe<Scalars['String']>;
  project_request_comments?: Maybe<Array<Maybe<ProjectRequestComment>>>;
  project_start_time_requirement?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  title: Scalars['String'];
  updated_at?: Maybe<Scalars['Date']>;
  vendor_location_requirement?: Maybe<Scalars['String']>;
  vendor_requirement: Scalars['String'];
  vendor_search_timeframe: Scalars['String'];
};

export type ProjectRequestComment = {
  __typename?: 'ProjectRequestComment';
  content?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['String']>;
  biotech?: Maybe<Biotech>;
  certification_tag_connection?: Maybe<CertificationTagConnection>;
  certification_tag_connections?: Maybe<Array<Maybe<CertificationTagConnection>>>;
  collaborators?: Maybe<Array<Maybe<User>>>;
  customer?: Maybe<Customer>;
  lab_specialization_connection?: Maybe<LabSpecializationConnection>;
  lab_specialization_connections?: Maybe<Array<Maybe<LabSpecializationConnection>>>;
  meetingEvents?: Maybe<Array<Maybe<MeetingEvent>>>;
  meetingFormAttendees?: Maybe<Array<Maybe<User>>>;
  milestone?: Maybe<Milestone>;
  milestoneCheckoutUrl?: Maybe<Scalars['String']>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
  projectConnection?: Maybe<ProjectConnection>;
  projectConnections?: Maybe<Array<Maybe<ProjectConnection>>>;
  projectRequest?: Maybe<ProjectRequest>;
  projectRequests?: Maybe<Array<Maybe<ProjectRequest>>>;
  quote?: Maybe<Quote>;
  searchCertificationTags?: Maybe<Array<Maybe<CertificationTag>>>;
  searchLabSpecializations?: Maybe<Array<Maybe<LabSpecialization>>>;
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


export type QueryCertification_Tag_ConnectionArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryCertification_Tag_ConnectionsArgs = {
  vendor_company_id?: InputMaybe<Scalars['String']>;
};


export type QueryLab_Specialization_ConnectionArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryLab_Specialization_ConnectionsArgs = {
  vendor_company_id?: InputMaybe<Scalars['String']>;
};


export type QueryMeetingEventsArgs = {
  status?: InputMaybe<Scalars['String']>;
};


export type QueryMeetingFormAttendeesArgs = {
  project_connection_id: Scalars['String'];
};


export type QueryMilestoneArgs = {
  id: Scalars['String'];
};


export type QueryMilestoneCheckoutUrlArgs = {
  cancel_url: Scalars['String'];
  id: Scalars['String'];
  success_url: Scalars['String'];
};


export type QueryNotificationsArgs = {
  unread_only?: InputMaybe<Scalars['Boolean']>;
};


export type QueryProjectConnectionArgs = {
  id: Scalars['String'];
};


export type QueryProjectRequestArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryProjectRequestsArgs = {
  status?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryQuoteArgs = {
  id?: InputMaybe<Scalars['String']>;
  project_connection_id?: InputMaybe<Scalars['String']>;
};


export type QuerySearchCertificationTagsArgs = {
  search_content?: InputMaybe<Scalars['String']>;
};


export type QuerySearchLabSpecializationsArgs = {
  search_content?: InputMaybe<Scalars['String']>;
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
  amount?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  milestones?: Maybe<Array<Maybe<Milestone>>>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']>;
  short_id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
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

export type Subscription = {
  __typename?: 'Subscription';
  cdaSignedAt?: Maybe<Scalars['String']>;
  cdaUrl?: Maybe<Scalars['String']>;
  newMessage?: Maybe<Message>;
};


export type SubscriptionNewMessageArgs = {
  chat_id: Scalars['String'];
};

export type UpdateMilestoneInput = {
  amount: Scalars['Int'];
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
  can_be_removed?: Maybe<Scalars['Boolean']>;
  cda_signed_at?: Maybe<Scalars['Date']>;
  cda_url?: Maybe<Scalars['String']>;
  company_name?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  customer?: Maybe<Customer>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  full_name?: Maybe<Scalars['String']>;
  has_completed_onboarding?: Maybe<Scalars['Boolean']>;
  has_setup_profile?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
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
  lab_specializations?: Maybe<Array<Maybe<LabSpecialization>>>;
  legal_name?: Maybe<Scalars['String']>;
  linkedin_url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  primary_members?: Maybe<Array<Maybe<VendorMember>>>;
  principal_investigator_name?: Maybe<Scalars['String']>;
  project_connections?: Maybe<Array<Maybe<ProjectConnection>>>;
  skip_cda?: Maybe<Scalars['Boolean']>;
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
  is_primary_member?: Maybe<Scalars['Boolean']>;
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
  Admin: ResolverTypeWrapper<Admin>;
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  Biotech: ResolverTypeWrapper<Biotech>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CertificationTag: ResolverTypeWrapper<CertificationTag>;
  CertificationTagConnection: ResolverTypeWrapper<CertificationTagConnection>;
  Chat: ResolverTypeWrapper<Chat>;
  CompanyAttachment: ResolverTypeWrapper<CompanyAttachment>;
  CompanyAttachmentUploadResult: ResolverTypeWrapper<CompanyAttachmentUploadResult>;
  CreateMilestoneInput: CreateMilestoneInput;
  Customer: ResolverTypeWrapper<Customer>;
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  InviteCollaboratorInput: InviteCollaboratorInput;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LabSpecialization: ResolverTypeWrapper<LabSpecialization>;
  LabSpecializationConnection: ResolverTypeWrapper<LabSpecializationConnection>;
  MarkMilestoneCompleteResponse: ResolverTypeWrapper<MarkMilestoneCompleteResponse>;
  MeetingEvent: ResolverTypeWrapper<MeetingEvent>;
  Message: ResolverTypeWrapper<Message>;
  Milestone: ResolverTypeWrapper<Milestone>;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<Notification>;
  ProjectAttachment: ResolverTypeWrapper<ProjectAttachment>;
  ProjectConnection: ResolverTypeWrapper<ProjectConnection>;
  ProjectRequest: ResolverTypeWrapper<ProjectRequest>;
  ProjectRequestComment: ResolverTypeWrapper<ProjectRequestComment>;
  Query: ResolverTypeWrapper<{}>;
  Quote: ResolverTypeWrapper<Quote>;
  String: ResolverTypeWrapper<Scalars['String']>;
  StripeAccountCapabilities: ResolverTypeWrapper<StripeAccountCapabilities>;
  StripeAccountData: ResolverTypeWrapper<StripeAccountData>;
  StripeAccountRequirementError: ResolverTypeWrapper<StripeAccountRequirementError>;
  StripeAccountRequirements: ResolverTypeWrapper<StripeAccountRequirements>;
  StripeExternalAccount: ResolverTypeWrapper<StripeExternalAccount>;
  StripeExternalAccountData: ResolverTypeWrapper<StripeExternalAccountData>;
  Subscription: ResolverTypeWrapper<{}>;
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
  Admin: Admin;
  AuthResponse: AuthResponse;
  Biotech: Biotech;
  Boolean: Scalars['Boolean'];
  CertificationTag: CertificationTag;
  CertificationTagConnection: CertificationTagConnection;
  Chat: Chat;
  CompanyAttachment: CompanyAttachment;
  CompanyAttachmentUploadResult: CompanyAttachmentUploadResult;
  CreateMilestoneInput: CreateMilestoneInput;
  Customer: Customer;
  CustomerConnection: CustomerConnection;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  InviteCollaboratorInput: InviteCollaboratorInput;
  JSON: Scalars['JSON'];
  LabSpecialization: LabSpecialization;
  LabSpecializationConnection: LabSpecializationConnection;
  MarkMilestoneCompleteResponse: MarkMilestoneCompleteResponse;
  MeetingEvent: MeetingEvent;
  Message: Message;
  Milestone: Milestone;
  Mutation: {};
  Notification: Notification;
  ProjectAttachment: ProjectAttachment;
  ProjectConnection: ProjectConnection;
  ProjectRequest: ProjectRequest;
  ProjectRequestComment: ProjectRequestComment;
  Query: {};
  Quote: Quote;
  String: Scalars['String'];
  StripeAccountCapabilities: StripeAccountCapabilities;
  StripeAccountData: StripeAccountData;
  StripeAccountRequirementError: StripeAccountRequirementError;
  StripeAccountRequirements: StripeAccountRequirements;
  StripeExternalAccount: StripeExternalAccount;
  StripeExternalAccountData: StripeExternalAccountData;
  Subscription: {};
  UpdateMilestoneInput: UpdateMilestoneInput;
  Upload: Scalars['Upload'];
  UploadResult: UploadResult;
  User: User;
  VendorCompany: VendorCompany;
  VendorMember: VendorMember;
  VendorMemberConnection: VendorMemberConnection;
}>;

export type AdminResolvers<ContextType = any, ParentType extends ResolversParentTypes['Admin'] = ResolversParentTypes['Admin']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  encrypted_password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  access_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refresh_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BiotechResolvers<ContextType = any, ParentType extends ResolversParentTypes['Biotech'] = ResolversParentTypes['Biotech']> = ResolversObject<{
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  biotech_extra_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  skip_cda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripe_customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitter_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  upload_limit?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  upload_used?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zipcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  lab_specialization?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType>;
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
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  guests?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meeting_link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_pin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_request?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType>;
  start_time?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  timezone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MilestoneResolvers<ContextType = any, ParentType extends ResolversParentTypes['Milestone'] = ResolversParentTypes['Milestone']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payment_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_attachments?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectAttachment']>>>, ParentType, ContextType>;
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
  addProjectCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationAddProjectCollaboratorArgs, 'project_connection_id' | 'user_id'>>;
  createAdmin?: Resolver<Maybe<ResolversTypes['Admin']>, ParentType, ContextType, RequireFields<MutationCreateAdminArgs, 'email' | 'username'>>;
  createCda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagArgs, 'full_name'>>;
  createCertificationTagConnection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, Partial<MutationCreateCertificationTagConnectionArgs>>;
  createChat?: Resolver<Maybe<ResolversTypes['Chat']>, ParentType, ContextType, RequireFields<MutationCreateChatArgs, 'project_connection_id'>>;
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'company_name' | 'user_id'>>;
  createLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationArgs, 'full_name'>>;
  createLabSpecializationConnection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, Partial<MutationCreateLabSpecializationConnectionArgs>>;
  createMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationCreateMeetingEventArgs, 'attendees' | 'end_time' | 'project_connection_id' | 'start_time' | 'timezone' | 'title'>>;
  createProjectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestArgs, 'in_contact_with_vendor' | 'objective_description' | 'title' | 'vendor_requirement' | 'vendor_search_timeframe'>>;
  createProjectRequestComment?: Resolver<Maybe<ResolversTypes['ProjectRequestComment']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestCommentArgs, 'content' | 'project_request_id'>>;
  createQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationCreateQuoteArgs, 'amount' | 'project_connection_id'>>;
  createVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, RequireFields<MutationCreateVendorCompanyArgs, 'name'>>;
  declineQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationDeclineQuoteArgs, 'id'>>;
  declinedProjectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<MutationDeclinedProjectConnectionArgs, 'id'>>;
  deleteAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteAdminArgs, 'id'>>;
  deleteCertificationTagConnection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, Partial<MutationDeleteCertificationTagConnectionArgs>>;
  deleteLabSpecializationConnection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, Partial<MutationDeleteLabSpecializationConnectionArgs>>;
  forgotPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationForgotPasswordArgs>>;
  inviteCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInviteCollaboratorArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteCollaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<MutationInviteCollaboratorsArgs, 'collaborators'>>;
  inviteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationInviteCustomerArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteProjectCollaboratorViaEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInviteProjectCollaboratorViaEmailArgs, 'email' | 'first_name' | 'last_name' | 'project_connection_id'>>;
  inviteVendorCompaniesToProjectByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationInviteVendorCompaniesToProjectByAdminArgs, 'project_request_id' | 'vendor_company_ids'>>;
  inviteVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteVendorMemberByAdmin?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberByAdminArgs, 'email' | 'first_name' | 'last_name' | 'vendor_company_id'>>;
  markMilestoneAsCompleted?: Resolver<Maybe<ResolversTypes['MarkMilestoneCompleteResponse']>, ParentType, ContextType, RequireFields<MutationMarkMilestoneAsCompletedArgs, 'id'>>;
  markNotificationAsRead?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationMarkNotificationAsReadArgs, 'id'>>;
  markNotificationsInProjectAsRead?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, RequireFields<MutationMarkNotificationsInProjectAsReadArgs, 'project_connection_id'>>;
  onboardBiotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationOnboardBiotechArgs>>;
  payVendor?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<MutationPayVendorArgs, 'id'>>;
  refreshJWT?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType>;
  removeAttachment?: Resolver<Maybe<ResolversTypes['ProjectAttachment']>, ParentType, ContextType, RequireFields<MutationRemoveAttachmentArgs, 'id'>>;
  removeCompanyAttachment?: Resolver<Maybe<ResolversTypes['CompanyAttachment']>, ParentType, ContextType, RequireFields<MutationRemoveCompanyAttachmentArgs, 'id'>>;
  removeMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationRemoveMeetingEventArgs, 'meeting_event_id'>>;
  removeProjectCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRemoveProjectCollaboratorArgs, 'project_connection_id' | 'user_id'>>;
  resendInvitation?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationResendInvitationArgs, 'user_id'>>;
  resendVendorMemberInvitationByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationResendVendorMemberInvitationByAdminArgs, 'user_id'>>;
  resetPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationResetPasswordArgs>>;
  sendMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'content' | 'project_connection_id'>>;
  signInUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignInUserArgs, 'email' | 'password'>>;
  signUpUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignUpUserArgs, 'company_name' | 'email' | 'first_name' | 'last_name' | 'password'>>;
  skipCda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  submitCroInterest?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubmitCroInterestArgs, 'company_name' | 'company_type' | 'email' | 'first_name' | 'interest' | 'last_name' | 'service'>>;
  subscribeEmailUpdates?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubscribeEmailUpdatesArgs, 'email'>>;
  updateBiotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationUpdateBiotechArgs>>;
  updateCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, Partial<MutationUpdateCustomerArgs>>;
  updateMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationUpdateMeetingEventArgs, 'attendees' | 'end_time' | 'meeting_event_id' | 'start_time' | 'timezone' | 'title'>>;
  updateQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationUpdateQuoteArgs, 'amount' | 'id' | 'milestones'>>;
  updateUserInfo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserInfoArgs, 'email' | 'first_name' | 'last_name'>>;
  updateVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyArgs>>;
  updateVendorCompanyCertificationTags?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyCertificationTagsArgs>>;
  updateVendorCompanyLabSpecializations?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyLabSpecializationsArgs>>;
  updateVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, Partial<MutationUpdateVendorMemberArgs>>;
  uploadCompanyAttachment?: Resolver<Maybe<ResolversTypes['CompanyAttachmentUploadResult']>, ParentType, ContextType, RequireFields<MutationUploadCompanyAttachmentArgs, 'file' | 'vendor_company_id'>>;
  uploadContract?: Resolver<Maybe<ResolversTypes['UploadResult']>, ParentType, ContextType, RequireFields<MutationUploadContractArgs, 'file' | 'project_connection_id'>>;
  uploadDocuments?: Resolver<Maybe<Array<Maybe<ResolversTypes['UploadResult']>>>, ParentType, ContextType, RequireFields<MutationUploadDocumentsArgs, 'files' | 'project_connection_id'>>;
  verifyMilestoneAsCompleted?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<MutationVerifyMilestoneAsCompletedArgs, 'id'>>;
  withdrawProjectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationWithdrawProjectRequestArgs, 'project_request_id'>>;
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
  unsubscribed_has_new_message?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_member_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMemberConnection']>>>, ParentType, ContextType>;
  vendor_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  max_budget?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  objective_description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preparation_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_challenge_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType>;
  project_deadline_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type ProjectRequestCommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectRequestComment'] = ResolversParentTypes['ProjectRequestComment']> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_request?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType>;
  project_request_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _dummy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  certification_tag_connection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, Partial<QueryCertification_Tag_ConnectionArgs>>;
  certification_tag_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['CertificationTagConnection']>>>, ParentType, ContextType, Partial<QueryCertification_Tag_ConnectionsArgs>>;
  collaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  lab_specialization_connection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, Partial<QueryLab_Specialization_ConnectionArgs>>;
  lab_specialization_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['LabSpecializationConnection']>>>, ParentType, ContextType, Partial<QueryLab_Specialization_ConnectionsArgs>>;
  meetingEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingEvent']>>>, ParentType, ContextType, Partial<QueryMeetingEventsArgs>>;
  meetingFormAttendees?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QueryMeetingFormAttendeesArgs, 'project_connection_id'>>;
  milestone?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<QueryMilestoneArgs, 'id'>>;
  milestoneCheckoutUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryMilestoneCheckoutUrlArgs, 'cancel_url' | 'id' | 'success_url'>>;
  notifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, Partial<QueryNotificationsArgs>>;
  projectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<QueryProjectConnectionArgs, 'id'>>;
  projectConnections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType>;
  projectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, Partial<QueryProjectRequestArgs>>;
  projectRequests?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequest']>>>, ParentType, ContextType, Partial<QueryProjectRequestsArgs>>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, Partial<QueryQuoteArgs>>;
  searchCertificationTags?: Resolver<Maybe<Array<Maybe<ResolversTypes['CertificationTag']>>>, ParentType, ContextType, Partial<QuerySearchCertificationTagsArgs>>;
  searchLabSpecializations?: Resolver<Maybe<Array<Maybe<ResolversTypes['LabSpecialization']>>>, ParentType, ContextType, Partial<QuerySearchLabSpecializationsArgs>>;
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
  amount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  milestones?: Resolver<Maybe<Array<Maybe<ResolversTypes['Milestone']>>>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  short_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  cdaSignedAt?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "cdaSignedAt", ParentType, ContextType>;
  cdaUrl?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "cdaUrl", ParentType, ContextType>;
  newMessage?: SubscriptionResolver<Maybe<ResolversTypes['Message']>, "newMessage", ParentType, ContextType, RequireFields<SubscriptionNewMessageArgs, 'chat_id'>>;
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
  can_be_removed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  cda_signed_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  cda_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  full_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_completed_onboarding?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_setup_profile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType>;
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
  lab_specializations?: Resolver<Maybe<Array<Maybe<ResolversTypes['LabSpecialization']>>>, ParentType, ContextType>;
  legal_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  linkedin_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  primary_members?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMember']>>>, ParentType, ContextType>;
  principal_investigator_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType>;
  skip_cda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
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
  is_primary_member?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
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
  Admin?: AdminResolvers<ContextType>;
  AuthResponse?: AuthResponseResolvers<ContextType>;
  Biotech?: BiotechResolvers<ContextType>;
  CertificationTag?: CertificationTagResolvers<ContextType>;
  CertificationTagConnection?: CertificationTagConnectionResolvers<ContextType>;
  Chat?: ChatResolvers<ContextType>;
  CompanyAttachment?: CompanyAttachmentResolvers<ContextType>;
  CompanyAttachmentUploadResult?: CompanyAttachmentUploadResultResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  CustomerConnection?: CustomerConnectionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  LabSpecialization?: LabSpecializationResolvers<ContextType>;
  LabSpecializationConnection?: LabSpecializationConnectionResolvers<ContextType>;
  MarkMilestoneCompleteResponse?: MarkMilestoneCompleteResponseResolvers<ContextType>;
  MeetingEvent?: MeetingEventResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Milestone?: MilestoneResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  ProjectAttachment?: ProjectAttachmentResolvers<ContextType>;
  ProjectConnection?: ProjectConnectionResolvers<ContextType>;
  ProjectRequest?: ProjectRequestResolvers<ContextType>;
  ProjectRequestComment?: ProjectRequestCommentResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Quote?: QuoteResolvers<ContextType>;
  StripeAccountCapabilities?: StripeAccountCapabilitiesResolvers<ContextType>;
  StripeAccountData?: StripeAccountDataResolvers<ContextType>;
  StripeAccountRequirementError?: StripeAccountRequirementErrorResolvers<ContextType>;
  StripeAccountRequirements?: StripeAccountRequirementsResolvers<ContextType>;
  StripeExternalAccount?: StripeExternalAccountResolvers<ContextType>;
  StripeExternalAccountData?: StripeExternalAccountDataResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadResult?: UploadResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VendorCompany?: VendorCompanyResolvers<ContextType>;
  VendorMember?: VendorMemberResolvers<ContextType>;
  VendorMemberConnection?: VendorMemberConnectionResolvers<ContextType>;
}>;

