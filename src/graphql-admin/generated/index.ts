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

export type Admin = {
  __typename?: 'Admin';
  created_at?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  encrypted_password?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  team?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type BiotechInviteVendor = {
  __typename?: 'BiotechInviteVendor';
  company_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type BiotechInvoice = {
  __typename?: 'BiotechInvoice';
  biotech_id?: Maybe<Scalars['String']['output']>;
  biotech_invoice_attachment?: Maybe<BiotechInvoiceAttachment>;
  created_at?: Maybe<Scalars['Date']['output']>;
  due_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invoice_number?: Maybe<Scalars['String']['output']>;
  paid_at?: Maybe<Scalars['Date']['output']>;
  payment_status?: Maybe<Scalars['String']['output']>;
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

export type CroDbSpecialty = {
  __typename?: 'CroDbSpecialty';
  definition?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type CroDbSubspecialty = {
  __typename?: 'CroDbSubspecialty';
  definition?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  specialty_id?: Maybe<Scalars['String']['output']>;
};

export type Customer = {
  __typename?: 'Customer';
  biotech_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  team?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
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

export type Milestone = {
  __typename?: 'Milestone';
  amount?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  payment_status?: Maybe<Scalars['String']['output']>;
  short_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  timeline?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  vendor_payment_status?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  activatePerk?: Maybe<Perk>;
  addReviewQuestion?: Maybe<ReviewQuestion>;
  addReviewQuestionOption?: Maybe<ReviewQuestionOption>;
  addReviewQuestionSet?: Maybe<ReviewQuestionSet>;
  approveVendorSurvey?: Maybe<Scalars['Boolean']['output']>;
  connectCustomerToProject?: Maybe<Scalars['Boolean']['output']>;
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
  createSourcererVendorProfileForOldVendor?: Maybe<Scalars['Boolean']['output']>;
  createVendor?: Maybe<Vendor>;
  createVendorCompany?: Maybe<VendorCompany>;
  createVendorFromSurvey?: Maybe<Scalars['Boolean']['output']>;
  deactivatePerk?: Maybe<Perk>;
  deleteAdmin?: Maybe<Scalars['Boolean']['output']>;
  deleteCertificationTag?: Maybe<Scalars['Boolean']['output']>;
  deleteCertificationTagConnection?: Maybe<CertificationTagConnection>;
  deleteLabSpecialization?: Maybe<Scalars['Boolean']['output']>;
  deleteLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  deletePerk?: Maybe<Perk>;
  deletePerkCategory?: Maybe<Scalars['Boolean']['output']>;
  duplicateQuestionSet?: Maybe<ReviewQuestionSet>;
  inviteCustomerByAdmin?: Maybe<Customer>;
  inviteVendorCompaniesToProjectByAdmin?: Maybe<Scalars['Boolean']['output']>;
  inviteVendorCompanyToProjectByBiotech?: Maybe<Scalars['Boolean']['output']>;
  inviteVendorMemberByAdmin?: Maybe<VendorMember>;
  payVendor?: Maybe<Milestone>;
  publishNews?: Maybe<News>;
  purgeTestDataByUser?: Maybe<Scalars['Boolean']['output']>;
  removeNews?: Maybe<News>;
  removeReviewQuestion?: Maybe<ReviewQuestion>;
  removeReviewQuestionOption?: Maybe<ReviewQuestionOption>;
  removeReviewQuestionSet?: Maybe<ReviewQuestionSet>;
  resendCustomerInvitationByAdmin?: Maybe<Scalars['Boolean']['output']>;
  resendVendorMemberInvitationByAdmin?: Maybe<Scalars['Boolean']['output']>;
  sendVendorSignUpLink?: Maybe<Scalars['Boolean']['output']>;
  transferBiotechOwnershipByAdmin?: Maybe<Scalars['Boolean']['output']>;
  transferVendorCompanyOwnershipByAdmin?: Maybe<Scalars['Boolean']['output']>;
  unpublishNews?: Maybe<News>;
  unregisterBiotechAccount?: Maybe<Scalars['Boolean']['output']>;
  updateBiotechInviteVendor?: Maybe<BiotechInviteVendor>;
  updateCertificationTag?: Maybe<CertificationTag>;
  updateCroDbSpecialty?: Maybe<CroDbSpecialty>;
  updateCroDbSubspecialty?: Maybe<CroDbSubspecialty>;
  updateCustomerByAdmin?: Maybe<Scalars['Boolean']['output']>;
  updateLabSpecialization?: Maybe<LabSpecialization>;
  updateNews?: Maybe<News>;
  updatePerk?: Maybe<Perk>;
  updatePerkCategory?: Maybe<PerkCategory>;
  updateReviewQuestion?: Maybe<ReviewQuestion>;
  updateReviewQuestionOption?: Maybe<ReviewQuestionOption>;
  updateReviewQuestionSet?: Maybe<ReviewQuestionSet>;
  updateVendor?: Maybe<Vendor>;
  updateVendorMemberByAdmin?: Maybe<Scalars['Boolean']['output']>;
  verifyBiotechInvoicePayment?: Maybe<BiotechInvoice>;
};


export type MutationActivatePerkArgs = {
  id: Scalars['String']['input'];
};


export type MutationAddReviewQuestionArgs = {
  group_title?: InputMaybe<Scalars['String']['input']>;
  is_required?: InputMaybe<Scalars['Boolean']['input']>;
  ordinal: Scalars['Int']['input'];
  question_text: Scalars['String']['input'];
  question_type: Scalars['String']['input'];
  review_question_set_id: Scalars['String']['input'];
};


export type MutationAddReviewQuestionOptionArgs = {
  option_text: Scalars['String']['input'];
  ordinal?: InputMaybe<Scalars['Int']['input']>;
  review_question_id: Scalars['String']['input'];
};


export type MutationAddReviewQuestionSetArgs = {
  name: Scalars['String']['input'];
};


export type MutationApproveVendorSurveyArgs = {
  certifications: Array<Scalars['String']['input']>;
  company_description: Scalars['String']['input'];
  company_ipo_status: Scalars['String']['input'];
  company_name: Scalars['String']['input'];
  company_revenue: Scalars['String']['input'];
  company_size: Scalars['String']['input'];
  company_types: Array<Scalars['String']['input']>;
  countries: Array<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  logo_url: Scalars['String']['input'];
  subspecialty_ids: Array<Scalars['String']['input']>;
  website_url: Scalars['String']['input'];
};


export type MutationConnectCustomerToProjectArgs = {
  customer_id: Scalars['String']['input'];
  project_connection_id: Scalars['String']['input'];
};


export type MutationCreateAdminArgs = {
  email: Scalars['String']['input'];
  encrypted_password?: InputMaybe<Scalars['String']['input']>;
  team?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};


export type MutationCreateCertificationTagArgs = {
  full_name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCertificationTagConnectionArgs = {
  certification_tag_id: Scalars['String']['input'];
  vendor_company_id: Scalars['String']['input'];
};


export type MutationCreateCroDbSpecialtyArgs = {
  definition?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationCreateCroDbSubspecialtyArgs = {
  definition?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  specialty_id: Scalars['String']['input'];
};


export type MutationCreateLabSpecializationArgs = {
  full_name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateLabSpecializationConnectionArgs = {
  lab_specialization_id: Scalars['String']['input'];
  vendor_company_id: Scalars['String']['input'];
};


export type MutationCreateNewsArgs = {
  cover_img_url?: InputMaybe<Scalars['String']['input']>;
  excerpt?: InputMaybe<Scalars['String']['input']>;
  is_featured?: InputMaybe<Scalars['Boolean']['input']>;
  logo_url?: InputMaybe<Scalars['String']['input']>;
  published_at?: InputMaybe<Scalars['Date']['input']>;
  title: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreatePerkArgs = {
  description: Scalars['String']['input'];
  expired_at?: InputMaybe<Scalars['Date']['input']>;
  external_url?: InputMaybe<Scalars['String']['input']>;
  how_to_redeem: Scalars['String']['input'];
  image: Scalars['Upload']['input'];
  is_active: Scalars['Boolean']['input'];
  perk_category_id: Scalars['String']['input'];
  reward_description: Scalars['String']['input'];
  terms: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreatePerkCategoryArgs = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateProjectRequestArgs = {
  objective_description?: InputMaybe<Scalars['String']['input']>;
  preparation_description?: InputMaybe<Scalars['String']['input']>;
  sourcing_session_id?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  vendor_requirement?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateSourcererVendorProfileForOldVendorArgs = {
  vendor_company_id: Scalars['String']['input'];
};


export type MutationCreateVendorArgs = {
  company_name?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
};


export type MutationCreateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  invited_by?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  vendor_type?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateVendorFromSurveyArgs = {
  survey_id: Scalars['String']['input'];
};


export type MutationDeactivatePerkArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteAdminArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCertificationTagArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCertificationTagConnectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteLabSpecializationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteLabSpecializationConnectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePerkArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePerkCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDuplicateQuestionSetArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  review_question_set_id: Scalars['String']['input'];
};


export type MutationInviteCustomerByAdminArgs = {
  biotech_id: Scalars['String']['input'];
  country_code?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  phone_number?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
};


export type MutationInviteVendorCompaniesToProjectByAdminArgs = {
  project_request_id: Scalars['String']['input'];
  vendor_company_ids: Array<InputMaybe<Scalars['String']['input']>>;
};


export type MutationInviteVendorCompanyToProjectByBiotechArgs = {
  biotech_invite_vendor_id: Scalars['String']['input'];
  vendor_type: Scalars['String']['input'];
};


export type MutationInviteVendorMemberByAdminArgs = {
  country_code?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  phone_number?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
  vendor_company_id: Scalars['String']['input'];
};


export type MutationPayVendorArgs = {
  id: Scalars['String']['input'];
};


export type MutationPublishNewsArgs = {
  news_id: Scalars['String']['input'];
};


export type MutationPurgeTestDataByUserArgs = {
  user_id: Scalars['String']['input'];
};


export type MutationRemoveNewsArgs = {
  news_id: Scalars['String']['input'];
};


export type MutationRemoveReviewQuestionArgs = {
  review_question_id: Scalars['String']['input'];
};


export type MutationRemoveReviewQuestionOptionArgs = {
  review_question_option_id: Scalars['String']['input'];
};


export type MutationRemoveReviewQuestionSetArgs = {
  review_question_set_id: Scalars['String']['input'];
};


export type MutationResendCustomerInvitationByAdminArgs = {
  user_id: Scalars['String']['input'];
};


export type MutationResendVendorMemberInvitationByAdminArgs = {
  user_id: Scalars['String']['input'];
};


export type MutationSendVendorSignUpLinkArgs = {
  id: Scalars['String']['input'];
};


export type MutationTransferBiotechOwnershipByAdminArgs = {
  biotech_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationTransferVendorCompanyOwnershipByAdminArgs = {
  user_id: Scalars['String']['input'];
  vendor_company_id: Scalars['String']['input'];
};


export type MutationUnpublishNewsArgs = {
  news_id: Scalars['String']['input'];
};


export type MutationUnregisterBiotechAccountArgs = {
  biotech_id: Scalars['String']['input'];
};


export type MutationUpdateBiotechInviteVendorArgs = {
  company_name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  id: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  website: Scalars['String']['input'];
};


export type MutationUpdateCertificationTagArgs = {
  full_name: Scalars['String']['input'];
  id: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCroDbSpecialtyArgs = {
  definition?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateCroDbSubspecialtyArgs = {
  definition?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateCustomerByAdminArgs = {
  country_code?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  job_title?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  team?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
};


export type MutationUpdateLabSpecializationArgs = {
  full_name: Scalars['String']['input'];
  id: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateNewsArgs = {
  cover_img_url?: InputMaybe<Scalars['String']['input']>;
  excerpt?: InputMaybe<Scalars['String']['input']>;
  is_featured?: InputMaybe<Scalars['Boolean']['input']>;
  logo_url?: InputMaybe<Scalars['String']['input']>;
  news_id: Scalars['String']['input'];
  published_at?: InputMaybe<Scalars['Date']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdatePerkArgs = {
  description: Scalars['String']['input'];
  expired_at?: InputMaybe<Scalars['Date']['input']>;
  external_url?: InputMaybe<Scalars['String']['input']>;
  how_to_redeem: Scalars['String']['input'];
  id: Scalars['String']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  is_active: Scalars['Boolean']['input'];
  perk_category_id: Scalars['String']['input'];
  reward_description: Scalars['String']['input'];
  terms: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationUpdatePerkCategoryArgs = {
  description: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateReviewQuestionArgs = {
  group_title?: InputMaybe<Scalars['String']['input']>;
  is_required?: InputMaybe<Scalars['Boolean']['input']>;
  ordinal: Scalars['Int']['input'];
  question_text: Scalars['String']['input'];
  question_type: Scalars['String']['input'];
  review_question_id: Scalars['String']['input'];
};


export type MutationUpdateReviewQuestionOptionArgs = {
  option_text: Scalars['String']['input'];
  ordinal: Scalars['Int']['input'];
  review_question_option_id: Scalars['String']['input'];
};


export type MutationUpdateReviewQuestionSetArgs = {
  name: Scalars['String']['input'];
  review_question_set_id: Scalars['String']['input'];
};


export type MutationUpdateVendorArgs = {
  company_name?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type MutationUpdateVendorMemberByAdminArgs = {
  country_code?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
};


export type MutationVerifyBiotechInvoicePaymentArgs = {
  invoice_id: Scalars['String']['input'];
};

export type News = {
  __typename?: 'News';
  id?: Maybe<Scalars['String']['output']>;
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

export type ProjectRequest = {
  __typename?: 'ProjectRequest';
  id: Scalars['String']['output'];
  objective_description?: Maybe<Scalars['String']['output']>;
  preparation_description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  vendor_requirement?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['String']['output']>;
  biotechInvoice?: Maybe<BiotechInvoice>;
  paidBiotechInvoices?: Maybe<Array<Maybe<BiotechInvoice>>>;
  signedUrl?: Maybe<Scalars['String']['output']>;
  vendorSurveyAttachmentSignedUrl?: Maybe<Scalars['String']['output']>;
  verificationPendingBiotechInvoices?: Maybe<Array<Maybe<BiotechInvoice>>>;
};


export type QueryBiotechInvoiceArgs = {
  id: Scalars['String']['input'];
};


export type QuerySignedUrlArgs = {
  key: Scalars['String']['input'];
};


export type QueryVendorSurveyAttachmentSignedUrlArgs = {
  key: Scalars['String']['input'];
};

export type ReviewQuestion = {
  __typename?: 'ReviewQuestion';
  id?: Maybe<Scalars['String']['output']>;
  ordinal?: Maybe<Scalars['Int']['output']>;
  question_text?: Maybe<Scalars['String']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  review_question_set_id?: Maybe<Scalars['String']['output']>;
};

export type ReviewQuestionOption = {
  __typename?: 'ReviewQuestionOption';
  id?: Maybe<Scalars['String']['output']>;
  option_text?: Maybe<Scalars['String']['output']>;
};

export type ReviewQuestionSet = {
  __typename?: 'ReviewQuestionSet';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  reset_password_token?: Maybe<Scalars['String']['output']>;
};

export type Vendor = {
  __typename?: 'Vendor';
  id?: Maybe<Scalars['String']['output']>;
};

export type VendorCompany = {
  __typename?: 'VendorCompany';
  address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invited_by?: Maybe<Scalars['String']['output']>;
  is_on_marketplace?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['Date']['output']>;
  vendor_type?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
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
  vendor_company_id?: Maybe<Scalars['String']['output']>;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CertificationTag: ResolverTypeWrapper<CertificationTag>;
  CertificationTagConnection: ResolverTypeWrapper<CertificationTagConnection>;
  CroDbSpecialty: ResolverTypeWrapper<CroDbSpecialty>;
  CroDbSubspecialty: ResolverTypeWrapper<CroDbSubspecialty>;
  Customer: ResolverTypeWrapper<Customer>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
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
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
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
  Boolean: Scalars['Boolean']['output'];
  CertificationTag: CertificationTag;
  CertificationTagConnection: CertificationTagConnection;
  CroDbSpecialty: CroDbSpecialty;
  CroDbSubspecialty: CroDbSubspecialty;
  Customer: Customer;
  Date: Scalars['Date']['output'];
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
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
  String: Scalars['String']['output'];
  Upload: Scalars['Upload']['output'];
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
  createSourcererVendorProfileForOldVendor?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateSourcererVendorProfileForOldVendorArgs, 'vendor_company_id'>>;
  createVendor?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<MutationCreateVendorArgs, 'email'>>;
  createVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, RequireFields<MutationCreateVendorCompanyArgs, 'name'>>;
  createVendorFromSurvey?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateVendorFromSurveyArgs, 'survey_id'>>;
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

