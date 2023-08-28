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
  addReviewQuestion?: Maybe<ReviewQuestion>;
  addReviewQuestionOption?: Maybe<ReviewQuestionOption>;
  addReviewQuestionSet?: Maybe<ReviewQuestionSet>;
  createAdmin?: Maybe<Admin>;
  createCertificationTag?: Maybe<CertificationTag>;
  createCertificationTagConnection?: Maybe<CertificationTagConnection>;
  createLabSpecialization?: Maybe<LabSpecialization>;
  createLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  createVendorCompany?: Maybe<VendorCompany>;
  deleteAdmin?: Maybe<Scalars['Boolean']>;
  deleteCertificationTag?: Maybe<Scalars['Boolean']>;
  deleteCertificationTagConnection?: Maybe<CertificationTagConnection>;
  deleteLabSpecialization?: Maybe<Scalars['Boolean']>;
  deleteLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  duplicateQuestionSet?: Maybe<ReviewQuestionSet>;
  inviteVendorCompaniesToProjectByAdmin?: Maybe<Scalars['Boolean']>;
  inviteVendorCompanyToProjectByBiotech?: Maybe<Scalars['Boolean']>;
  inviteVendorMemberByAdmin?: Maybe<VendorMember>;
  payVendor?: Maybe<Milestone>;
  purgeTestDataByUser?: Maybe<Scalars['Boolean']>;
  removeReviewQuestion?: Maybe<ReviewQuestion>;
  removeReviewQuestionOption?: Maybe<ReviewQuestionOption>;
  removeReviewQuestionSet?: Maybe<ReviewQuestionSet>;
  resendVendorMemberInvitationByAdmin?: Maybe<Scalars['Boolean']>;
  unregisterBiotechAccount?: Maybe<Scalars['Boolean']>;
  updateBiotechInviteVendor?: Maybe<BiotechInviteVendor>;
  updateCertificationTag?: Maybe<CertificationTag>;
  updateLabSpecialization?: Maybe<LabSpecialization>;
  updateReviewQuestion?: Maybe<ReviewQuestion>;
  updateVendorMemberByAdmin?: Maybe<Scalars['Boolean']>;
};


export type MutationAddReviewQuestionArgs = {
  question_text: Scalars['String'];
  question_type: Scalars['String'];
  review_question_set_id: Scalars['String'];
};


export type MutationAddReviewQuestionOptionArgs = {
  option_text: Scalars['String'];
  review_question_id: Scalars['String'];
};


export type MutationAddReviewQuestionSetArgs = {
  name: Scalars['String'];
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


export type MutationCreateLabSpecializationArgs = {
  full_name: Scalars['String'];
  priority?: InputMaybe<Scalars['Int']>;
  short_name?: InputMaybe<Scalars['String']>;
};


export type MutationCreateLabSpecializationConnectionArgs = {
  lab_specialization_id: Scalars['String'];
  vendor_company_id: Scalars['String'];
};


export type MutationCreateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  invited_by?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  skip_cda?: InputMaybe<Scalars['Boolean']>;
  vendor_type?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
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


export type MutationDuplicateQuestionSetArgs = {
  name?: InputMaybe<Scalars['String']>;
  review_question_set_id: Scalars['String'];
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
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  role: Scalars['String'];
  vendor_company_id: Scalars['String'];
};


export type MutationPayVendorArgs = {
  id: Scalars['String'];
};


export type MutationPurgeTestDataByUserArgs = {
  user_id: Scalars['String'];
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


export type MutationResendVendorMemberInvitationByAdminArgs = {
  user_id: Scalars['String'];
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


export type MutationUpdateLabSpecializationArgs = {
  full_name: Scalars['String'];
  id: Scalars['String'];
  priority?: InputMaybe<Scalars['Int']>;
  short_name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateReviewQuestionArgs = {
  question_text: Scalars['String'];
  question_type: Scalars['String'];
  review_question_id: Scalars['String'];
};


export type MutationUpdateVendorMemberByAdminArgs = {
  department?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  user_id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['String']>;
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

export type VendorCompany = {
  __typename?: 'VendorCompany';
  address?: Maybe<Scalars['String']>;
  cda_pandadoc_file_id?: Maybe<Scalars['String']>;
  cda_signed_at?: Maybe<Scalars['Date']>;
  created_at?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invited_by?: Maybe<Scalars['String']>;
  is_on_marketplace?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  skip_cda?: Maybe<Scalars['Boolean']>;
  updated_at?: Maybe<Scalars['Date']>;
  vendor_type?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CertificationTag: ResolverTypeWrapper<CertificationTag>;
  CertificationTagConnection: ResolverTypeWrapper<CertificationTagConnection>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LabSpecialization: ResolverTypeWrapper<LabSpecialization>;
  LabSpecializationConnection: ResolverTypeWrapper<LabSpecializationConnection>;
  Milestone: ResolverTypeWrapper<Milestone>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  ReviewQuestion: ResolverTypeWrapper<ReviewQuestion>;
  ReviewQuestionOption: ResolverTypeWrapper<ReviewQuestionOption>;
  ReviewQuestionSet: ResolverTypeWrapper<ReviewQuestionSet>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  VendorCompany: ResolverTypeWrapper<VendorCompany>;
  VendorMember: ResolverTypeWrapper<VendorMember>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Admin: Admin;
  BiotechInviteVendor: BiotechInviteVendor;
  Boolean: Scalars['Boolean'];
  CertificationTag: CertificationTag;
  CertificationTagConnection: CertificationTagConnection;
  Date: Scalars['Date'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  LabSpecialization: LabSpecialization;
  LabSpecializationConnection: LabSpecializationConnection;
  Milestone: Milestone;
  Mutation: {};
  Query: {};
  ReviewQuestion: ReviewQuestion;
  ReviewQuestionOption: ReviewQuestionOption;
  ReviewQuestionSet: ReviewQuestionSet;
  String: Scalars['String'];
  Upload: Scalars['Upload'];
  User: User;
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
  addReviewQuestion?: Resolver<Maybe<ResolversTypes['ReviewQuestion']>, ParentType, ContextType, RequireFields<MutationAddReviewQuestionArgs, 'question_text' | 'question_type' | 'review_question_set_id'>>;
  addReviewQuestionOption?: Resolver<Maybe<ResolversTypes['ReviewQuestionOption']>, ParentType, ContextType, RequireFields<MutationAddReviewQuestionOptionArgs, 'option_text' | 'review_question_id'>>;
  addReviewQuestionSet?: Resolver<Maybe<ResolversTypes['ReviewQuestionSet']>, ParentType, ContextType, RequireFields<MutationAddReviewQuestionSetArgs, 'name'>>;
  createAdmin?: Resolver<Maybe<ResolversTypes['Admin']>, ParentType, ContextType, RequireFields<MutationCreateAdminArgs, 'email' | 'username'>>;
  createCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagArgs, 'full_name'>>;
  createCertificationTagConnection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagConnectionArgs, 'certification_tag_id' | 'vendor_company_id'>>;
  createLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationArgs, 'full_name'>>;
  createLabSpecializationConnection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationConnectionArgs, 'lab_specialization_id' | 'vendor_company_id'>>;
  createVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, RequireFields<MutationCreateVendorCompanyArgs, 'name'>>;
  deleteAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteAdminArgs, 'id'>>;
  deleteCertificationTag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteCertificationTagArgs, 'id'>>;
  deleteCertificationTagConnection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, RequireFields<MutationDeleteCertificationTagConnectionArgs, 'id'>>;
  deleteLabSpecialization?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteLabSpecializationArgs, 'id'>>;
  deleteLabSpecializationConnection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, RequireFields<MutationDeleteLabSpecializationConnectionArgs, 'id'>>;
  duplicateQuestionSet?: Resolver<Maybe<ResolversTypes['ReviewQuestionSet']>, ParentType, ContextType, RequireFields<MutationDuplicateQuestionSetArgs, 'review_question_set_id'>>;
  inviteVendorCompaniesToProjectByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationInviteVendorCompaniesToProjectByAdminArgs, 'project_request_id' | 'vendor_company_ids'>>;
  inviteVendorCompanyToProjectByBiotech?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationInviteVendorCompanyToProjectByBiotechArgs, 'biotech_invite_vendor_id' | 'vendor_type'>>;
  inviteVendorMemberByAdmin?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberByAdminArgs, 'email' | 'first_name' | 'last_name' | 'role' | 'vendor_company_id'>>;
  payVendor?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<MutationPayVendorArgs, 'id'>>;
  purgeTestDataByUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationPurgeTestDataByUserArgs, 'user_id'>>;
  removeReviewQuestion?: Resolver<Maybe<ResolversTypes['ReviewQuestion']>, ParentType, ContextType, RequireFields<MutationRemoveReviewQuestionArgs, 'review_question_id'>>;
  removeReviewQuestionOption?: Resolver<Maybe<ResolversTypes['ReviewQuestionOption']>, ParentType, ContextType, RequireFields<MutationRemoveReviewQuestionOptionArgs, 'review_question_option_id'>>;
  removeReviewQuestionSet?: Resolver<Maybe<ResolversTypes['ReviewQuestionSet']>, ParentType, ContextType, RequireFields<MutationRemoveReviewQuestionSetArgs, 'review_question_set_id'>>;
  resendVendorMemberInvitationByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationResendVendorMemberInvitationByAdminArgs, 'user_id'>>;
  unregisterBiotechAccount?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUnregisterBiotechAccountArgs, 'biotech_id'>>;
  updateBiotechInviteVendor?: Resolver<Maybe<ResolversTypes['BiotechInviteVendor']>, ParentType, ContextType, RequireFields<MutationUpdateBiotechInviteVendorArgs, 'company_name' | 'email' | 'first_name' | 'id' | 'last_name' | 'website'>>;
  updateCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationUpdateCertificationTagArgs, 'full_name' | 'id'>>;
  updateLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationUpdateLabSpecializationArgs, 'full_name' | 'id'>>;
  updateReviewQuestion?: Resolver<Maybe<ResolversTypes['ReviewQuestion']>, ParentType, ContextType, RequireFields<MutationUpdateReviewQuestionArgs, 'question_text' | 'question_type' | 'review_question_id'>>;
  updateVendorMemberByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateVendorMemberByAdminArgs, 'user_id'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _dummy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type VendorCompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorCompany'] = ResolversParentTypes['VendorCompany']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_pandadoc_file_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_signed_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  invited_by?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_on_marketplace?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  skip_cda?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  vendor_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Admin?: AdminResolvers<ContextType>;
  BiotechInviteVendor?: BiotechInviteVendorResolvers<ContextType>;
  CertificationTag?: CertificationTagResolvers<ContextType>;
  CertificationTagConnection?: CertificationTagConnectionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  LabSpecialization?: LabSpecializationResolvers<ContextType>;
  LabSpecializationConnection?: LabSpecializationConnectionResolvers<ContextType>;
  Milestone?: MilestoneResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReviewQuestion?: ReviewQuestionResolvers<ContextType>;
  ReviewQuestionOption?: ReviewQuestionOptionResolvers<ContextType>;
  ReviewQuestionSet?: ReviewQuestionSetResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  VendorCompany?: VendorCompanyResolvers<ContextType>;
  VendorMember?: VendorMemberResolvers<ContextType>;
}>;

