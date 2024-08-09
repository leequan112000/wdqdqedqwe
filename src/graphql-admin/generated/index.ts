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

export type BiotechInviteVendor = {
  __typename?: 'BiotechInviteVendor';
  company_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type BiotechInvoice = {
  __typename?: 'BiotechInvoice';
  biotech_id?: Maybe<Scalars['String']>;
  biotech_invoice_attachment?: Maybe<BiotechInvoiceAttachment>;
  created_at?: Maybe<Scalars['Date']>;
  due_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  invoice_number?: Maybe<Scalars['String']>;
  paid_at?: Maybe<Scalars['Date']>;
  payment_status?: Maybe<Scalars['String']>;
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

export type CroDbSpecialty = {
  __typename?: 'CroDbSpecialty';
  definition?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CroDbSubspecialty = {
  __typename?: 'CroDbSubspecialty';
  definition?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  specialty_id?: Maybe<Scalars['String']>;
};

export type Customer = {
  __typename?: 'Customer';
  biotech_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['String']>;
  job_title?: Maybe<Scalars['String']>;
  team?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']>;
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

export type Milestone = {
  __typename?: 'Milestone';
  amount?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  payment_status?: Maybe<Scalars['String']>;
  short_id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  timeline?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vendor_payment_status?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  activatePerk?: Maybe<Perk>;
  addReviewQuestion?: Maybe<ReviewQuestion>;
  addReviewQuestionOption?: Maybe<ReviewQuestionOption>;
  addReviewQuestionSet?: Maybe<ReviewQuestionSet>;
  approveVendorSurvey?: Maybe<Scalars['Boolean']>;
  connectCustomerToProject?: Maybe<Scalars['Boolean']>;
  createAdmin?: Maybe<Admin>;
  createCertificationTag?: Maybe<CertificationTag>;
  createCertificationTagConnection?: Maybe<CertificationTagConnection>;
  createCroDbSpecialty?: Maybe<CroDbSpecialty>;
  createCroDbSubspecialty?: Maybe<CroDbSubspecialty>;
  createLabSpecialization?: Maybe<LabSpecialization>;
  createLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  createNews?: Maybe<News>;
  createPerk?: Maybe<Perk>;
  createPerkCategory?: Maybe<PerkCategory>;
  createProjectRequest?: Maybe<ProjectRequest>;
  createVendor?: Maybe<Vendor>;
  createVendorCompany?: Maybe<VendorCompany>;
  deactivatePerk?: Maybe<Perk>;
  deleteAdmin?: Maybe<Scalars['Boolean']>;
  deleteCertificationTag?: Maybe<Scalars['Boolean']>;
  deleteCertificationTagConnection?: Maybe<CertificationTagConnection>;
  deleteLabSpecialization?: Maybe<Scalars['Boolean']>;
  deleteLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  deletePerk?: Maybe<Perk>;
  deletePerkCategory?: Maybe<Scalars['Boolean']>;
  duplicateQuestionSet?: Maybe<ReviewQuestionSet>;
  inviteCustomerByAdmin?: Maybe<Customer>;
  inviteVendorCompaniesToProjectByAdmin?: Maybe<Scalars['Boolean']>;
  inviteVendorCompanyToProjectByBiotech?: Maybe<Scalars['Boolean']>;
  inviteVendorMemberByAdmin?: Maybe<VendorMember>;
  payVendor?: Maybe<Milestone>;
  publishNews?: Maybe<News>;
  purgeTestDataByUser?: Maybe<Scalars['Boolean']>;
  removeNews?: Maybe<News>;
  removeReviewQuestion?: Maybe<ReviewQuestion>;
  removeReviewQuestionOption?: Maybe<ReviewQuestionOption>;
  removeReviewQuestionSet?: Maybe<ReviewQuestionSet>;
  resendCustomerInvitationByAdmin?: Maybe<Scalars['Boolean']>;
  resendVendorMemberInvitationByAdmin?: Maybe<Scalars['Boolean']>;
  sendVendorSignUpLink?: Maybe<Scalars['Boolean']>;
  transferBiotechOwnershipByAdmin?: Maybe<Scalars['Boolean']>;
  transferVendorCompanyOwnershipByAdmin?: Maybe<Scalars['Boolean']>;
  unpublishNews?: Maybe<News>;
  unregisterBiotechAccount?: Maybe<Scalars['Boolean']>;
  updateBiotechInviteVendor?: Maybe<BiotechInviteVendor>;
  updateCertificationTag?: Maybe<CertificationTag>;
  updateCroDbSpecialty?: Maybe<CroDbSpecialty>;
  updateCroDbSubspecialty?: Maybe<CroDbSubspecialty>;
  updateCustomerByAdmin?: Maybe<Scalars['Boolean']>;
  updateLabSpecialization?: Maybe<LabSpecialization>;
  updateNews?: Maybe<News>;
  updatePerk?: Maybe<Perk>;
  updatePerkCategory?: Maybe<PerkCategory>;
  updateReviewQuestion?: Maybe<ReviewQuestion>;
  updateReviewQuestionOption?: Maybe<ReviewQuestionOption>;
  updateReviewQuestionSet?: Maybe<ReviewQuestionSet>;
  updateVendor?: Maybe<Vendor>;
  updateVendorMemberByAdmin?: Maybe<Scalars['Boolean']>;
  verifyBiotechInvoicePayment?: Maybe<BiotechInvoice>;
};


export type MutationActivatePerkArgs = {
  id: Scalars['String'];
};


export type MutationAddReviewQuestionArgs = {
  group_title?: InputMaybe<Scalars['String']>;
  is_required?: InputMaybe<Scalars['Boolean']>;
  ordinal: Scalars['Int'];
  question_text: Scalars['String'];
  question_type: Scalars['String'];
  review_question_set_id: Scalars['String'];
};


export type MutationAddReviewQuestionOptionArgs = {
  option_text: Scalars['String'];
  ordinal?: InputMaybe<Scalars['Int']>;
  review_question_id: Scalars['String'];
};


export type MutationAddReviewQuestionSetArgs = {
  name: Scalars['String'];
};


export type MutationApproveVendorSurveyArgs = {
  certifications: Array<Scalars['String']>;
  company_description: Scalars['String'];
  company_ipo_status: Scalars['String'];
  company_name: Scalars['String'];
  company_revenue: Scalars['String'];
  company_size: Scalars['String'];
  company_types: Array<Scalars['String']>;
  countries: Array<Scalars['String']>;
  id: Scalars['String'];
  logo_url: Scalars['String'];
  subspecialty_ids: Array<Scalars['String']>;
  website_url: Scalars['String'];
};


export type MutationConnectCustomerToProjectArgs = {
  customer_id: Scalars['String'];
  project_connection_id: Scalars['String'];
};


export type MutationCreateAdminArgs = {
  email: Scalars['String'];
  encrypted_password?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};


export type MutationCreateCertificationTagArgs = {
  full_name: Scalars['String'];
  priority?: InputMaybe<Scalars['Int']>;
  short_name?: InputMaybe<Scalars['String']>;
};


export type MutationCreateCertificationTagConnectionArgs = {
  certification_tag_id: Scalars['String'];
  vendor_company_id: Scalars['String'];
};


export type MutationCreateCroDbSpecialtyArgs = {
  definition?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationCreateCroDbSubspecialtyArgs = {
  definition?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  specialty_id: Scalars['String'];
};


export type MutationCreateLabSpecializationArgs = {
  full_name: Scalars['String'];
  priority?: InputMaybe<Scalars['Int']>;
  short_name?: InputMaybe<Scalars['String']>;
};


export type MutationCreateLabSpecializationConnectionArgs = {
  lab_specialization_id: Scalars['String'];
  vendor_company_id: Scalars['String'];
};


export type MutationCreateNewsArgs = {
  cover_img_url?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  is_featured?: InputMaybe<Scalars['Boolean']>;
  logo_url?: InputMaybe<Scalars['String']>;
  published_at?: InputMaybe<Scalars['Date']>;
  title: Scalars['String'];
  url?: InputMaybe<Scalars['String']>;
};


export type MutationCreatePerkArgs = {
  description: Scalars['String'];
  expired_at?: InputMaybe<Scalars['Date']>;
  external_url?: InputMaybe<Scalars['String']>;
  how_to_redeem: Scalars['String'];
  image: Scalars['Upload'];
  is_active: Scalars['Boolean'];
  perk_category_id: Scalars['String'];
  reward_description: Scalars['String'];
  terms: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreatePerkCategoryArgs = {
  description: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreateProjectRequestArgs = {
  objective_description?: InputMaybe<Scalars['String']>;
  preparation_description?: InputMaybe<Scalars['String']>;
  sourcing_session_id?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  vendor_requirement?: InputMaybe<Scalars['String']>;
};


export type MutationCreateVendorArgs = {
  company_name?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
};


export type MutationCreateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  invited_by?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  vendor_type?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};


export type MutationDeactivatePerkArgs = {
  id: Scalars['String'];
};


export type MutationDeleteAdminArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCertificationTagArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCertificationTagConnectionArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLabSpecializationArgs = {
  id: Scalars['String'];
};


export type MutationDeleteLabSpecializationConnectionArgs = {
  id: Scalars['String'];
};


export type MutationDeletePerkArgs = {
  id: Scalars['String'];
};


export type MutationDeletePerkCategoryArgs = {
  id: Scalars['String'];
};


export type MutationDuplicateQuestionSetArgs = {
  name?: InputMaybe<Scalars['String']>;
  review_question_set_id: Scalars['String'];
};


export type MutationInviteCustomerByAdminArgs = {
  biotech_id: Scalars['String'];
  country_code?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  phone_number?: InputMaybe<Scalars['String']>;
  role: Scalars['String'];
};


export type MutationInviteVendorCompaniesToProjectByAdminArgs = {
  project_request_id: Scalars['String'];
  vendor_company_ids: Array<InputMaybe<Scalars['String']>>;
};


export type MutationInviteVendorCompanyToProjectByBiotechArgs = {
  biotech_invite_vendor_id: Scalars['String'];
  vendor_type: Scalars['String'];
};


export type MutationInviteVendorMemberByAdminArgs = {
  country_code?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  phone_number?: InputMaybe<Scalars['String']>;
  role: Scalars['String'];
  vendor_company_id: Scalars['String'];
};


export type MutationPayVendorArgs = {
  id: Scalars['String'];
};


export type MutationPublishNewsArgs = {
  news_id: Scalars['String'];
};


export type MutationPurgeTestDataByUserArgs = {
  user_id: Scalars['String'];
};


export type MutationRemoveNewsArgs = {
  news_id: Scalars['String'];
};


export type MutationRemoveReviewQuestionArgs = {
  review_question_id: Scalars['String'];
};


export type MutationRemoveReviewQuestionOptionArgs = {
  review_question_option_id: Scalars['String'];
};


export type MutationRemoveReviewQuestionSetArgs = {
  review_question_set_id: Scalars['String'];
};


export type MutationResendCustomerInvitationByAdminArgs = {
  user_id: Scalars['String'];
};


export type MutationResendVendorMemberInvitationByAdminArgs = {
  user_id: Scalars['String'];
};


export type MutationSendVendorSignUpLinkArgs = {
  id: Scalars['String'];
};


export type MutationTransferBiotechOwnershipByAdminArgs = {
  biotech_id: Scalars['String'];
  user_id: Scalars['String'];
};


export type MutationTransferVendorCompanyOwnershipByAdminArgs = {
  user_id: Scalars['String'];
  vendor_company_id: Scalars['String'];
};


export type MutationUnpublishNewsArgs = {
  news_id: Scalars['String'];
};


export type MutationUnregisterBiotechAccountArgs = {
  biotech_id: Scalars['String'];
};


export type MutationUpdateBiotechInviteVendorArgs = {
  company_name: Scalars['String'];
  email: Scalars['String'];
  first_name: Scalars['String'];
  id: Scalars['String'];
  last_name: Scalars['String'];
  website: Scalars['String'];
};


export type MutationUpdateCertificationTagArgs = {
  full_name: Scalars['String'];
  id: Scalars['String'];
  priority?: InputMaybe<Scalars['Int']>;
  short_name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCroDbSpecialtyArgs = {
  definition?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateCroDbSubspecialtyArgs = {
  definition?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateCustomerByAdminArgs = {
  country_code?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  job_title?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  phone_number?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  user_id: Scalars['String'];
};


export type MutationUpdateLabSpecializationArgs = {
  full_name: Scalars['String'];
  id: Scalars['String'];
  priority?: InputMaybe<Scalars['Int']>;
  short_name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateNewsArgs = {
  cover_img_url?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  is_featured?: InputMaybe<Scalars['Boolean']>;
  logo_url?: InputMaybe<Scalars['String']>;
  news_id: Scalars['String'];
  published_at?: InputMaybe<Scalars['Date']>;
  title?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};


export type MutationUpdatePerkArgs = {
  description: Scalars['String'];
  expired_at?: InputMaybe<Scalars['Date']>;
  external_url?: InputMaybe<Scalars['String']>;
  how_to_redeem: Scalars['String'];
  id: Scalars['String'];
  image?: InputMaybe<Scalars['Upload']>;
  is_active: Scalars['Boolean'];
  perk_category_id: Scalars['String'];
  reward_description: Scalars['String'];
  terms: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdatePerkCategoryArgs = {
  description: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateReviewQuestionArgs = {
  group_title?: InputMaybe<Scalars['String']>;
  is_required?: InputMaybe<Scalars['Boolean']>;
  ordinal: Scalars['Int'];
  question_text: Scalars['String'];
  question_type: Scalars['String'];
  review_question_id: Scalars['String'];
};


export type MutationUpdateReviewQuestionOptionArgs = {
  option_text: Scalars['String'];
  ordinal: Scalars['Int'];
  review_question_option_id: Scalars['String'];
};


export type MutationUpdateReviewQuestionSetArgs = {
  name: Scalars['String'];
  review_question_set_id: Scalars['String'];
};


export type MutationUpdateVendorArgs = {
  company_name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
};


export type MutationUpdateVendorMemberByAdminArgs = {
  country_code?: InputMaybe<Scalars['String']>;
  department?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  phone_number?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  user_id: Scalars['String'];
};


export type MutationVerifyBiotechInvoicePaymentArgs = {
  invoice_id: Scalars['String'];
};

export type News = {
  __typename?: 'News';
  id?: Maybe<Scalars['String']>;
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

export type ProjectRequest = {
  __typename?: 'ProjectRequest';
  id: Scalars['String'];
  objective_description?: Maybe<Scalars['String']>;
  preparation_description?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vendor_requirement?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['String']>;
  biotechInvoice?: Maybe<BiotechInvoice>;
  paidBiotechInvoices?: Maybe<Array<Maybe<BiotechInvoice>>>;
  signedUrl?: Maybe<Scalars['String']>;
  vendorSurveyAttachmentSignedUrl?: Maybe<Scalars['String']>;
  verificationPendingBiotechInvoices?: Maybe<Array<Maybe<BiotechInvoice>>>;
};


export type QueryBiotechInvoiceArgs = {
  id: Scalars['String'];
};


export type QuerySignedUrlArgs = {
  key: Scalars['String'];
};


export type QueryVendorSurveyAttachmentSignedUrlArgs = {
  key: Scalars['String'];
};

export type ReviewQuestion = {
  __typename?: 'ReviewQuestion';
  id?: Maybe<Scalars['String']>;
  ordinal?: Maybe<Scalars['Int']>;
  question_text?: Maybe<Scalars['String']>;
  question_type?: Maybe<Scalars['String']>;
  review_question_set_id?: Maybe<Scalars['String']>;
};

export type ReviewQuestionOption = {
  __typename?: 'ReviewQuestionOption';
  id?: Maybe<Scalars['String']>;
  option_text?: Maybe<Scalars['String']>;
};

export type ReviewQuestionSet = {
  __typename?: 'ReviewQuestionSet';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  reset_password_token?: Maybe<Scalars['String']>;
};

export type Vendor = {
  __typename?: 'Vendor';
  id?: Maybe<Scalars['String']>;
};

export type VendorCompany = {
  __typename?: 'VendorCompany';
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invited_by?: Maybe<Scalars['String']>;
  is_on_marketplace?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_type?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
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
  vendor_company_id?: Maybe<Scalars['String']>;
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
  BiotechInviteVendor: ResolverTypeWrapper<BiotechInviteVendor>;
  BiotechInvoice: ResolverTypeWrapper<BiotechInvoice>;
  BiotechInvoiceAttachment: ResolverTypeWrapper<BiotechInvoiceAttachment>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CertificationTag: ResolverTypeWrapper<CertificationTag>;
  CertificationTagConnection: ResolverTypeWrapper<CertificationTagConnection>;
  CroDbSpecialty: ResolverTypeWrapper<CroDbSpecialty>;
  CroDbSubspecialty: ResolverTypeWrapper<CroDbSubspecialty>;
  Customer: ResolverTypeWrapper<Customer>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LabSpecialization: ResolverTypeWrapper<LabSpecialization>;
  LabSpecializationConnection: ResolverTypeWrapper<LabSpecializationConnection>;
  Milestone: ResolverTypeWrapper<Milestone>;
  Mutation: ResolverTypeWrapper<{}>;
  News: ResolverTypeWrapper<News>;
  Perk: ResolverTypeWrapper<Perk>;
  PerkCategory: ResolverTypeWrapper<PerkCategory>;
  ProjectRequest: ResolverTypeWrapper<ProjectRequest>;
  Query: ResolverTypeWrapper<{}>;
  ReviewQuestion: ResolverTypeWrapper<ReviewQuestion>;
  ReviewQuestionOption: ResolverTypeWrapper<ReviewQuestionOption>;
  ReviewQuestionSet: ResolverTypeWrapper<ReviewQuestionSet>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  Vendor: ResolverTypeWrapper<Vendor>;
  VendorCompany: ResolverTypeWrapper<VendorCompany>;
  VendorMember: ResolverTypeWrapper<VendorMember>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Admin: Admin;
  BiotechInviteVendor: BiotechInviteVendor;
  BiotechInvoice: BiotechInvoice;
  BiotechInvoiceAttachment: BiotechInvoiceAttachment;
  Boolean: Scalars['Boolean'];
  CertificationTag: CertificationTag;
  CertificationTagConnection: CertificationTagConnection;
  CroDbSpecialty: CroDbSpecialty;
  CroDbSubspecialty: CroDbSubspecialty;
  Customer: Customer;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  LabSpecialization: LabSpecialization;
  LabSpecializationConnection: LabSpecializationConnection;
  Milestone: Milestone;
  Mutation: {};
  News: News;
  Perk: Perk;
  PerkCategory: PerkCategory;
  ProjectRequest: ProjectRequest;
  Query: {};
  ReviewQuestion: ReviewQuestion;
  ReviewQuestionOption: ReviewQuestionOption;
  ReviewQuestionSet: ReviewQuestionSet;
  String: Scalars['String'];
  Upload: Scalars['Upload'];
  User: User;
  Vendor: Vendor;
  VendorCompany: VendorCompany;
  VendorMember: VendorMember;
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

export type BiotechInviteVendorResolvers<ContextType = any, ParentType extends ResolversParentTypes['BiotechInviteVendor'] = ResolversParentTypes['BiotechInviteVendor']> = ResolversObject<{
  company_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BiotechInvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['BiotechInvoice'] = ResolversParentTypes['BiotechInvoice']> = ResolversObject<{
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  biotech_invoice_attachment?: Resolver<Maybe<ResolversTypes['BiotechInvoiceAttachment']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  due_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invoice_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paid_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  payment_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type CroDbSpecialtyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbSpecialty'] = ResolversParentTypes['CroDbSpecialty']> = ResolversObject<{
  definition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CroDbSubspecialtyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CroDbSubspecialty'] = ResolversParentTypes['CroDbSubspecialty']> = ResolversObject<{
  definition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  specialty_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  job_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  lab_specialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType>;
  lab_specialization_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MilestoneResolvers<ContextType = any, ParentType extends ResolversParentTypes['Milestone'] = ResolversParentTypes['Milestone']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payment_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  short_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timeline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_payment_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  activatePerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationActivatePerkArgs, 'id'>>;
  addReviewQuestion?: Resolver<Maybe<ResolversTypes['ReviewQuestion']>, ParentType, ContextType, RequireFields<MutationAddReviewQuestionArgs, 'ordinal' | 'question_text' | 'question_type' | 'review_question_set_id'>>;
  addReviewQuestionOption?: Resolver<Maybe<ResolversTypes['ReviewQuestionOption']>, ParentType, ContextType, RequireFields<MutationAddReviewQuestionOptionArgs, 'option_text' | 'review_question_id'>>;
  addReviewQuestionSet?: Resolver<Maybe<ResolversTypes['ReviewQuestionSet']>, ParentType, ContextType, RequireFields<MutationAddReviewQuestionSetArgs, 'name'>>;
  approveVendorSurvey?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationApproveVendorSurveyArgs, 'certifications' | 'company_description' | 'company_ipo_status' | 'company_name' | 'company_revenue' | 'company_size' | 'company_types' | 'countries' | 'id' | 'logo_url' | 'subspecialty_ids' | 'website_url'>>;
  connectCustomerToProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationConnectCustomerToProjectArgs, 'customer_id' | 'project_connection_id'>>;
  createAdmin?: Resolver<Maybe<ResolversTypes['Admin']>, ParentType, ContextType, RequireFields<MutationCreateAdminArgs, 'email' | 'username'>>;
  createCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagArgs, 'full_name'>>;
  createCertificationTagConnection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagConnectionArgs, 'certification_tag_id' | 'vendor_company_id'>>;
  createCroDbSpecialty?: Resolver<Maybe<ResolversTypes['CroDbSpecialty']>, ParentType, ContextType, RequireFields<MutationCreateCroDbSpecialtyArgs, 'name'>>;
  createCroDbSubspecialty?: Resolver<Maybe<ResolversTypes['CroDbSubspecialty']>, ParentType, ContextType, RequireFields<MutationCreateCroDbSubspecialtyArgs, 'name' | 'specialty_id'>>;
  createLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationArgs, 'full_name'>>;
  createLabSpecializationConnection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationConnectionArgs, 'lab_specialization_id' | 'vendor_company_id'>>;
  createNews?: Resolver<Maybe<ResolversTypes['News']>, ParentType, ContextType, RequireFields<MutationCreateNewsArgs, 'title'>>;
  createPerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationCreatePerkArgs, 'description' | 'how_to_redeem' | 'image' | 'is_active' | 'perk_category_id' | 'reward_description' | 'terms' | 'title'>>;
  createPerkCategory?: Resolver<Maybe<ResolversTypes['PerkCategory']>, ParentType, ContextType, RequireFields<MutationCreatePerkCategoryArgs, 'description' | 'name'>>;
  createProjectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestArgs, 'title'>>;
  createVendor?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<MutationCreateVendorArgs, 'email'>>;
  createVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, RequireFields<MutationCreateVendorCompanyArgs, 'name'>>;
  deactivatePerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationDeactivatePerkArgs, 'id'>>;
  deleteAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteAdminArgs, 'id'>>;
  deleteCertificationTag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteCertificationTagArgs, 'id'>>;
  deleteCertificationTagConnection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, RequireFields<MutationDeleteCertificationTagConnectionArgs, 'id'>>;
  deleteLabSpecialization?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteLabSpecializationArgs, 'id'>>;
  deleteLabSpecializationConnection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, RequireFields<MutationDeleteLabSpecializationConnectionArgs, 'id'>>;
  deletePerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationDeletePerkArgs, 'id'>>;
  deletePerkCategory?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeletePerkCategoryArgs, 'id'>>;
  duplicateQuestionSet?: Resolver<Maybe<ResolversTypes['ReviewQuestionSet']>, ParentType, ContextType, RequireFields<MutationDuplicateQuestionSetArgs, 'review_question_set_id'>>;
  inviteCustomerByAdmin?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationInviteCustomerByAdminArgs, 'biotech_id' | 'email' | 'first_name' | 'last_name' | 'role'>>;
  inviteVendorCompaniesToProjectByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationInviteVendorCompaniesToProjectByAdminArgs, 'project_request_id' | 'vendor_company_ids'>>;
  inviteVendorCompanyToProjectByBiotech?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationInviteVendorCompanyToProjectByBiotechArgs, 'biotech_invite_vendor_id' | 'vendor_type'>>;
  inviteVendorMemberByAdmin?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberByAdminArgs, 'email' | 'first_name' | 'last_name' | 'role' | 'vendor_company_id'>>;
  payVendor?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<MutationPayVendorArgs, 'id'>>;
  publishNews?: Resolver<Maybe<ResolversTypes['News']>, ParentType, ContextType, RequireFields<MutationPublishNewsArgs, 'news_id'>>;
  purgeTestDataByUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationPurgeTestDataByUserArgs, 'user_id'>>;
  removeNews?: Resolver<Maybe<ResolversTypes['News']>, ParentType, ContextType, RequireFields<MutationRemoveNewsArgs, 'news_id'>>;
  removeReviewQuestion?: Resolver<Maybe<ResolversTypes['ReviewQuestion']>, ParentType, ContextType, RequireFields<MutationRemoveReviewQuestionArgs, 'review_question_id'>>;
  removeReviewQuestionOption?: Resolver<Maybe<ResolversTypes['ReviewQuestionOption']>, ParentType, ContextType, RequireFields<MutationRemoveReviewQuestionOptionArgs, 'review_question_option_id'>>;
  removeReviewQuestionSet?: Resolver<Maybe<ResolversTypes['ReviewQuestionSet']>, ParentType, ContextType, RequireFields<MutationRemoveReviewQuestionSetArgs, 'review_question_set_id'>>;
  resendCustomerInvitationByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationResendCustomerInvitationByAdminArgs, 'user_id'>>;
  resendVendorMemberInvitationByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationResendVendorMemberInvitationByAdminArgs, 'user_id'>>;
  sendVendorSignUpLink?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendVendorSignUpLinkArgs, 'id'>>;
  transferBiotechOwnershipByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationTransferBiotechOwnershipByAdminArgs, 'biotech_id' | 'user_id'>>;
  transferVendorCompanyOwnershipByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationTransferVendorCompanyOwnershipByAdminArgs, 'user_id' | 'vendor_company_id'>>;
  unpublishNews?: Resolver<Maybe<ResolversTypes['News']>, ParentType, ContextType, RequireFields<MutationUnpublishNewsArgs, 'news_id'>>;
  unregisterBiotechAccount?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUnregisterBiotechAccountArgs, 'biotech_id'>>;
  updateBiotechInviteVendor?: Resolver<Maybe<ResolversTypes['BiotechInviteVendor']>, ParentType, ContextType, RequireFields<MutationUpdateBiotechInviteVendorArgs, 'company_name' | 'email' | 'first_name' | 'id' | 'last_name' | 'website'>>;
  updateCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationUpdateCertificationTagArgs, 'full_name' | 'id'>>;
  updateCroDbSpecialty?: Resolver<Maybe<ResolversTypes['CroDbSpecialty']>, ParentType, ContextType, RequireFields<MutationUpdateCroDbSpecialtyArgs, 'id' | 'name'>>;
  updateCroDbSubspecialty?: Resolver<Maybe<ResolversTypes['CroDbSubspecialty']>, ParentType, ContextType, RequireFields<MutationUpdateCroDbSubspecialtyArgs, 'id' | 'name'>>;
  updateCustomerByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateCustomerByAdminArgs, 'user_id'>>;
  updateLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationUpdateLabSpecializationArgs, 'full_name' | 'id'>>;
  updateNews?: Resolver<Maybe<ResolversTypes['News']>, ParentType, ContextType, RequireFields<MutationUpdateNewsArgs, 'news_id'>>;
  updatePerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationUpdatePerkArgs, 'description' | 'how_to_redeem' | 'id' | 'is_active' | 'perk_category_id' | 'reward_description' | 'terms' | 'title'>>;
  updatePerkCategory?: Resolver<Maybe<ResolversTypes['PerkCategory']>, ParentType, ContextType, RequireFields<MutationUpdatePerkCategoryArgs, 'description' | 'id' | 'name'>>;
  updateReviewQuestion?: Resolver<Maybe<ResolversTypes['ReviewQuestion']>, ParentType, ContextType, RequireFields<MutationUpdateReviewQuestionArgs, 'ordinal' | 'question_text' | 'question_type' | 'review_question_id'>>;
  updateReviewQuestionOption?: Resolver<Maybe<ResolversTypes['ReviewQuestionOption']>, ParentType, ContextType, RequireFields<MutationUpdateReviewQuestionOptionArgs, 'option_text' | 'ordinal' | 'review_question_option_id'>>;
  updateReviewQuestionSet?: Resolver<Maybe<ResolversTypes['ReviewQuestionSet']>, ParentType, ContextType, RequireFields<MutationUpdateReviewQuestionSetArgs, 'name' | 'review_question_set_id'>>;
  updateVendor?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<MutationUpdateVendorArgs, 'id'>>;
  updateVendorMemberByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateVendorMemberByAdminArgs, 'user_id'>>;
  verifyBiotechInvoicePayment?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType, RequireFields<MutationVerifyBiotechInvoicePaymentArgs, 'invoice_id'>>;
}>;

export type NewsResolvers<ContextType = any, ParentType extends ResolversParentTypes['News'] = ResolversParentTypes['News']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type ProjectRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectRequest'] = ResolversParentTypes['ProjectRequest']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objective_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  preparation_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_requirement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _dummy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  biotechInvoice?: Resolver<Maybe<ResolversTypes['BiotechInvoice']>, ParentType, ContextType, RequireFields<QueryBiotechInvoiceArgs, 'id'>>;
  paidBiotechInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInvoice']>>>, ParentType, ContextType>;
  signedUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QuerySignedUrlArgs, 'key'>>;
  vendorSurveyAttachmentSignedUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryVendorSurveyAttachmentSignedUrlArgs, 'key'>>;
  verificationPendingBiotechInvoices?: Resolver<Maybe<Array<Maybe<ResolversTypes['BiotechInvoice']>>>, ParentType, ContextType>;
}>;

export type ReviewQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewQuestion'] = ResolversParentTypes['ReviewQuestion']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ordinal?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  question_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  question_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  review_question_set_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewQuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewQuestionOption'] = ResolversParentTypes['ReviewQuestionOption']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  option_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewQuestionSetResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReviewQuestionSet'] = ResolversParentTypes['ReviewQuestionSet']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reset_password_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vendor'] = ResolversParentTypes['Vendor']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorCompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorCompany'] = ResolversParentTypes['VendorCompany']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invited_by?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_on_marketplace?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Admin?: AdminResolvers<ContextType>;
  BiotechInviteVendor?: BiotechInviteVendorResolvers<ContextType>;
  BiotechInvoice?: BiotechInvoiceResolvers<ContextType>;
  BiotechInvoiceAttachment?: BiotechInvoiceAttachmentResolvers<ContextType>;
  CertificationTag?: CertificationTagResolvers<ContextType>;
  CertificationTagConnection?: CertificationTagConnectionResolvers<ContextType>;
  CroDbSpecialty?: CroDbSpecialtyResolvers<ContextType>;
  CroDbSubspecialty?: CroDbSubspecialtyResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  Date?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  LabSpecialization?: LabSpecializationResolvers<ContextType>;
  LabSpecializationConnection?: LabSpecializationConnectionResolvers<ContextType>;
  Milestone?: MilestoneResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  News?: NewsResolvers<ContextType>;
  Perk?: PerkResolvers<ContextType>;
  PerkCategory?: PerkCategoryResolvers<ContextType>;
  ProjectRequest?: ProjectRequestResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReviewQuestion?: ReviewQuestionResolvers<ContextType>;
  ReviewQuestionOption?: ReviewQuestionOptionResolvers<ContextType>;
  ReviewQuestionSet?: ReviewQuestionSetResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Vendor?: VendorResolvers<ContextType>;
  VendorCompany?: VendorCompanyResolvers<ContextType>;
  VendorMember?: VendorMemberResolvers<ContextType>;
}>;

