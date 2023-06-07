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
  cda_pandadoc_file_id?: Maybe<Scalars['String']>;
  cda_pandadoc_signer?: Maybe<Scalars['String']>;
  cda_signed_at?: Maybe<Scalars['Date']>;
  chats?: Maybe<Array<Maybe<Chat>>>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  has_active_subscription?: Maybe<Scalars['Boolean']>;
  has_setup_profile?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  legal_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  number_of_reqs_allowed_without_subscription?: Maybe<Scalars['Int']>;
  skip_cda?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  stripe_customer_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  upload_limit?: Maybe<Scalars['Float']>;
  upload_used?: Maybe<Scalars['Float']>;
  website?: Maybe<Scalars['String']>;
  zipcode?: Maybe<Scalars['String']>;
};

export type Chat = {
  __typename?: 'Chat';
  id?: Maybe<Scalars['String']>;
  messages?: Maybe<Array<Maybe<Message>>>;
};

export type CreateMilestoneInput = {
  amount: Scalars['Int'];
  description: Scalars['String'];
  due_at: Scalars['Date'];
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
  due_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptProjectConnection?: Maybe<ProjectConnection>;
  addProjectCollaborator?: Maybe<User>;
  createAdmin?: Maybe<Admin>;
  createCda?: Maybe<Scalars['Boolean']>;
  createChat?: Maybe<Chat>;
  createCustomer: Customer;
  createMeetingEvent?: Maybe<MeetingEvent>;
  createProjectRequest?: Maybe<ProjectRequest>;
  createProjectRequestComment?: Maybe<ProjectRequestComment>;
  createQuote?: Maybe<Quote>;
  createVendorCompany?: Maybe<VendorCompany>;
  declinedProjectConnection?: Maybe<ProjectConnection>;
  deleteAdmin?: Maybe<Scalars['Boolean']>;
  forgotPassword?: Maybe<Scalars['Boolean']>;
  inviteCollaborator?: Maybe<User>;
  /** @deprecated Use `inviteCollaborator`. */
  inviteCustomer?: Maybe<Customer>;
  inviteProjectCollaboratorViaEmail?: Maybe<User>;
  inviteVendorCompaniesToProjectByAdmin?: Maybe<Scalars['Boolean']>;
  /** @deprecated Use `inviteCollaborator`. */
  inviteVendorMember?: Maybe<VendorMember>;
  inviteVendorMemberByAdmin?: Maybe<VendorMember>;
  markNotificationAsRead?: Maybe<Notification>;
  markNotificationsInProjectAsRead?: Maybe<Array<Maybe<Notification>>>;
  onboardBiotech?: Maybe<Biotech>;
  onboardVendorCompany?: Maybe<VendorCompany>;
  refreshJWT?: Maybe<AuthResponse>;
  removeAttachment?: Maybe<ProjectAttachment>;
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
  updateVendorMember?: Maybe<VendorMember>;
  uploadContract?: Maybe<UploadResult>;
  uploadDocuments?: Maybe<Array<Maybe<UploadResult>>>;
  withdrawProjectRequest?: Maybe<ProjectRequest>;
};


export type MutationAcceptProjectConnectionArgs = {
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


export type MutationCreateChatArgs = {
  project_connection_id: Scalars['String'];
};


export type MutationCreateCustomerArgs = {
  company_name: Scalars['String'];
  job_title?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  user_id: Scalars['String'];
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
};


export type MutationCreateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  website?: InputMaybe<Scalars['String']>;
};


export type MutationDeclinedProjectConnectionArgs = {
  id: Scalars['String'];
};


export type MutationDeleteAdminArgs = {
  id: Scalars['String'];
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
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  legal_name?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};


export type MutationOnboardVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']>;
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  legal_name?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};


export type MutationRemoveAttachmentArgs = {
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
  interest: Scalars['String'];
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
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  legal_name?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
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
  description?: InputMaybe<Scalars['String']>;
  legal_name?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateVendorMemberArgs = {
  department?: InputMaybe<Scalars['String']>;
  is_primary_member?: InputMaybe<Scalars['Boolean']>;
  phone?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUploadContractArgs = {
  file: Scalars['Upload'];
  project_connection_id: Scalars['String'];
};


export type MutationUploadDocumentsArgs = {
  files: Array<InputMaybe<Scalars['Upload']>>;
  project_connection_id: Scalars['String'];
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
  collaborators?: Maybe<Array<Maybe<User>>>;
  customer?: Maybe<Customer>;
  meetingEvents?: Maybe<Array<Maybe<MeetingEvent>>>;
  meetingFormAttendees?: Maybe<Array<Maybe<User>>>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
  projectConnection?: Maybe<ProjectConnection>;
  projectConnections?: Maybe<Array<Maybe<ProjectConnection>>>;
  projectRequest?: Maybe<ProjectRequest>;
  projectRequests?: Maybe<Array<Maybe<ProjectRequest>>>;
  quote?: Maybe<Quote>;
  stripePricingTableId?: Maybe<Scalars['String']>;
  upcomingMeetingEvents?: Maybe<Array<Maybe<MeetingEvent>>>;
  user?: Maybe<User>;
  vendorCompany?: Maybe<VendorCompany>;
  vendorMember?: Maybe<VendorMember>;
};


export type QueryMeetingEventsArgs = {
  status?: InputMaybe<Scalars['String']>;
};


export type QueryMeetingFormAttendeesArgs = {
  project_connection_id: Scalars['String'];
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
  project_connection_id: Scalars['String'];
};


export type QueryUpcomingMeetingEventsArgs = {
  project_connection_id?: InputMaybe<Scalars['String']>;
};

export type Quote = {
  __typename?: 'Quote';
  amount?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  milestones?: Maybe<Array<Maybe<Milestone>>>;
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
  description: Scalars['String'];
  due_at: Scalars['Date'];
  id?: InputMaybe<Scalars['String']>;
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
  chats?: Maybe<Array<Maybe<Chat>>>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legal_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  primary_members?: Maybe<Array<Maybe<VendorMember>>>;
  project_connections?: Maybe<Array<Maybe<ProjectConnection>>>;
  skip_cda?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_members?: Maybe<Array<Maybe<VendorMember>>>;
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
  Chat: ResolverTypeWrapper<Chat>;
  CreateMilestoneInput: CreateMilestoneInput;
  Customer: ResolverTypeWrapper<Customer>;
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
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
  Chat: Chat;
  CreateMilestoneInput: CreateMilestoneInput;
  Customer: Customer;
  CustomerConnection: CustomerConnection;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
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
  cda_pandadoc_file_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_pandadoc_signer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_signed_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  chats?: Resolver<Maybe<Array<Maybe<ResolversTypes['Chat']>>>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customer']>>>, ParentType, ContextType>;
  has_active_subscription?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_setup_profile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  legal_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  number_of_reqs_allowed_without_subscription?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  skip_cda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stripe_customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  upload_limit?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  upload_used?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zipcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChatResolvers<ContextType = any, ParentType extends ResolversParentTypes['Chat'] = ResolversParentTypes['Chat']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['Message']>>>, ParentType, ContextType>;
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
  due_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  acceptProjectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<MutationAcceptProjectConnectionArgs, 'id'>>;
  addProjectCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationAddProjectCollaboratorArgs, 'project_connection_id' | 'user_id'>>;
  createAdmin?: Resolver<Maybe<ResolversTypes['Admin']>, ParentType, ContextType, RequireFields<MutationCreateAdminArgs, 'email' | 'username'>>;
  createCda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createChat?: Resolver<Maybe<ResolversTypes['Chat']>, ParentType, ContextType, RequireFields<MutationCreateChatArgs, 'project_connection_id'>>;
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'company_name' | 'user_id'>>;
  createMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationCreateMeetingEventArgs, 'attendees' | 'end_time' | 'project_connection_id' | 'start_time' | 'timezone' | 'title'>>;
  createProjectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestArgs, 'in_contact_with_vendor' | 'objective_description' | 'title' | 'vendor_requirement' | 'vendor_search_timeframe'>>;
  createProjectRequestComment?: Resolver<Maybe<ResolversTypes['ProjectRequestComment']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestCommentArgs, 'content' | 'project_request_id'>>;
  createQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationCreateQuoteArgs, 'amount' | 'project_connection_id'>>;
  createVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, RequireFields<MutationCreateVendorCompanyArgs, 'name'>>;
  declinedProjectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<MutationDeclinedProjectConnectionArgs, 'id'>>;
  deleteAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteAdminArgs, 'id'>>;
  forgotPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationForgotPasswordArgs>>;
  inviteCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInviteCollaboratorArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationInviteCustomerArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteProjectCollaboratorViaEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInviteProjectCollaboratorViaEmailArgs, 'email' | 'first_name' | 'last_name' | 'project_connection_id'>>;
  inviteVendorCompaniesToProjectByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationInviteVendorCompaniesToProjectByAdminArgs, 'project_request_id' | 'vendor_company_ids'>>;
  inviteVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteVendorMemberByAdmin?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberByAdminArgs, 'email' | 'first_name' | 'last_name' | 'vendor_company_id'>>;
  markNotificationAsRead?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationMarkNotificationAsReadArgs, 'id'>>;
  markNotificationsInProjectAsRead?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, RequireFields<MutationMarkNotificationsInProjectAsReadArgs, 'project_connection_id'>>;
  onboardBiotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationOnboardBiotechArgs>>;
  onboardVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationOnboardVendorCompanyArgs>>;
  refreshJWT?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType>;
  removeAttachment?: Resolver<Maybe<ResolversTypes['ProjectAttachment']>, ParentType, ContextType, RequireFields<MutationRemoveAttachmentArgs, 'id'>>;
  removeMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationRemoveMeetingEventArgs, 'meeting_event_id'>>;
  removeProjectCollaborator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRemoveProjectCollaboratorArgs, 'project_connection_id' | 'user_id'>>;
  resendInvitation?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationResendInvitationArgs, 'user_id'>>;
  resendVendorMemberInvitationByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationResendVendorMemberInvitationByAdminArgs, 'user_id'>>;
  resetPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationResetPasswordArgs>>;
  sendMessage?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'content' | 'project_connection_id'>>;
  signInUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignInUserArgs, 'email' | 'password'>>;
  signUpUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignUpUserArgs, 'company_name' | 'email' | 'first_name' | 'last_name' | 'password'>>;
  skipCda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  submitCroInterest?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubmitCroInterestArgs, 'company_name' | 'company_type' | 'email' | 'interest' | 'service'>>;
  subscribeEmailUpdates?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSubscribeEmailUpdatesArgs, 'email'>>;
  updateBiotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationUpdateBiotechArgs>>;
  updateCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, Partial<MutationUpdateCustomerArgs>>;
  updateMeetingEvent?: Resolver<Maybe<ResolversTypes['MeetingEvent']>, ParentType, ContextType, RequireFields<MutationUpdateMeetingEventArgs, 'attendees' | 'end_time' | 'meeting_event_id' | 'start_time' | 'timezone' | 'title'>>;
  updateQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<MutationUpdateQuoteArgs, 'amount' | 'id' | 'milestones'>>;
  updateUserInfo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserInfoArgs, 'email' | 'first_name' | 'last_name'>>;
  updateVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyArgs>>;
  updateVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, Partial<MutationUpdateVendorMemberArgs>>;
  uploadContract?: Resolver<Maybe<ResolversTypes['UploadResult']>, ParentType, ContextType, RequireFields<MutationUploadContractArgs, 'file' | 'project_connection_id'>>;
  uploadDocuments?: Resolver<Maybe<Array<Maybe<ResolversTypes['UploadResult']>>>, ParentType, ContextType, RequireFields<MutationUploadDocumentsArgs, 'files' | 'project_connection_id'>>;
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
  collaborators?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  meetingEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingEvent']>>>, ParentType, ContextType, Partial<QueryMeetingEventsArgs>>;
  meetingFormAttendees?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QueryMeetingFormAttendeesArgs, 'project_connection_id'>>;
  notifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Notification']>>>, ParentType, ContextType, Partial<QueryNotificationsArgs>>;
  projectConnection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType, RequireFields<QueryProjectConnectionArgs, 'id'>>;
  projectConnections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType>;
  projectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, Partial<QueryProjectRequestArgs>>;
  projectRequests?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequest']>>>, ParentType, ContextType, Partial<QueryProjectRequestsArgs>>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<QueryQuoteArgs, 'project_connection_id'>>;
  stripePricingTableId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  upcomingMeetingEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['MeetingEvent']>>>, ParentType, ContextType, Partial<QueryUpcomingMeetingEventsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  vendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType>;
}>;

export type QuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quote'] = ResolversParentTypes['Quote']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  milestones?: Resolver<Maybe<Array<Maybe<ResolversTypes['Milestone']>>>, ParentType, ContextType>;
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
  chats?: Resolver<Maybe<Array<Maybe<ResolversTypes['Chat']>>>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  legal_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  primary_members?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMember']>>>, ParentType, ContextType>;
  project_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType>;
  skip_cda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_members?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMember']>>>, ParentType, ContextType>;
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
  Chat?: ChatResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  CustomerConnection?: CustomerConnectionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
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
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadResult?: UploadResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VendorCompany?: VendorCompanyResolvers<ContextType>;
  VendorMember?: VendorMemberResolvers<ContextType>;
  VendorMemberConnection?: VendorMemberConnectionResolvers<ContextType>;
}>;

