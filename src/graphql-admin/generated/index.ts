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
  activatePerk?: Maybe<Perk>;
  createAdmin?: Maybe<Admin>;
  createCertificationTag?: Maybe<CertificationTag>;
  createCertificationTagConnection?: Maybe<CertificationTagConnection>;
  createLabSpecialization?: Maybe<LabSpecialization>;
  createLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  createPerk?: Maybe<Perk>;
  createPerkCategory?: Maybe<PerkCategory>;
  createVendorCompany?: Maybe<VendorCompany>;
  deactivatePerk?: Maybe<Perk>;
  deleteAdmin?: Maybe<Scalars['Boolean']>;
  deleteCertificationTag?: Maybe<Scalars['Boolean']>;
  deleteCertificationTagConnection?: Maybe<CertificationTagConnection>;
  deleteLabSpecialization?: Maybe<Scalars['Boolean']>;
  deleteLabSpecializationConnection?: Maybe<LabSpecializationConnection>;
  deletePerk?: Maybe<Perk>;
  deletePerkCategory?: Maybe<Scalars['Boolean']>;
  inviteVendorCompaniesToProjectByAdmin?: Maybe<Scalars['Boolean']>;
  inviteVendorCompanyToProjectByBiotech?: Maybe<Scalars['Boolean']>;
  inviteVendorMemberByAdmin?: Maybe<VendorMember>;
  payVendor?: Maybe<Milestone>;
  purgeTestDataByUser?: Maybe<Scalars['Boolean']>;
  resendVendorMemberInvitationByAdmin?: Maybe<Scalars['Boolean']>;
  unregisterBiotechAccount?: Maybe<Scalars['Boolean']>;
  updateBiotechInviteVendor?: Maybe<BiotechInviteVendor>;
  updateCertificationTag?: Maybe<CertificationTag>;
  updateLabSpecialization?: Maybe<LabSpecialization>;
  updatePerk?: Maybe<Perk>;
  updatePerkCategory?: Maybe<PerkCategory>;
  updateVendorMemberByAdmin?: Maybe<Scalars['Boolean']>;
};


export type MutationActivatePerkArgs = {
  id: Scalars['String'];
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


export type MutationCreateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  invited_by?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  skip_cda?: InputMaybe<Scalars['Boolean']>;
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


export type MutationUpdatePerkArgs = {
  description: Scalars['String'];
  expired_at?: InputMaybe<Scalars['Date']>;
  external_url?: InputMaybe<Scalars['String']>;
  how_to_redeem: Scalars['String'];
  id: Scalars['String'];
  image: Scalars['Upload'];
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


export type MutationUpdateVendorMemberByAdminArgs = {
  department?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  user_id: Scalars['String'];
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

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['String']>;
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
  Perk: ResolverTypeWrapper<Perk>;
  PerkCategory: ResolverTypeWrapper<PerkCategory>;
  Query: ResolverTypeWrapper<{}>;
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
  Perk: Perk;
  PerkCategory: PerkCategory;
  Query: {};
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
  activatePerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationActivatePerkArgs, 'id'>>;
  createAdmin?: Resolver<Maybe<ResolversTypes['Admin']>, ParentType, ContextType, RequireFields<MutationCreateAdminArgs, 'email' | 'username'>>;
  createCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagArgs, 'full_name'>>;
  createCertificationTagConnection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, RequireFields<MutationCreateCertificationTagConnectionArgs, 'certification_tag_id' | 'vendor_company_id'>>;
  createLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationArgs, 'full_name'>>;
  createLabSpecializationConnection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, RequireFields<MutationCreateLabSpecializationConnectionArgs, 'lab_specialization_id' | 'vendor_company_id'>>;
  createPerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationCreatePerkArgs, 'description' | 'how_to_redeem' | 'image' | 'is_active' | 'perk_category_id' | 'reward_description' | 'terms' | 'title'>>;
  createPerkCategory?: Resolver<Maybe<ResolversTypes['PerkCategory']>, ParentType, ContextType, RequireFields<MutationCreatePerkCategoryArgs, 'description' | 'name'>>;
  createVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, RequireFields<MutationCreateVendorCompanyArgs, 'name'>>;
  deactivatePerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationDeactivatePerkArgs, 'id'>>;
  deleteAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteAdminArgs, 'id'>>;
  deleteCertificationTag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteCertificationTagArgs, 'id'>>;
  deleteCertificationTagConnection?: Resolver<Maybe<ResolversTypes['CertificationTagConnection']>, ParentType, ContextType, RequireFields<MutationDeleteCertificationTagConnectionArgs, 'id'>>;
  deleteLabSpecialization?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteLabSpecializationArgs, 'id'>>;
  deleteLabSpecializationConnection?: Resolver<Maybe<ResolversTypes['LabSpecializationConnection']>, ParentType, ContextType, RequireFields<MutationDeleteLabSpecializationConnectionArgs, 'id'>>;
  deletePerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationDeletePerkArgs, 'id'>>;
  deletePerkCategory?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeletePerkCategoryArgs, 'id'>>;
  inviteVendorCompaniesToProjectByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationInviteVendorCompaniesToProjectByAdminArgs, 'project_request_id' | 'vendor_company_ids'>>;
  inviteVendorCompanyToProjectByBiotech?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationInviteVendorCompanyToProjectByBiotechArgs, 'biotech_invite_vendor_id' | 'vendor_type'>>;
  inviteVendorMemberByAdmin?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberByAdminArgs, 'email' | 'first_name' | 'last_name' | 'role' | 'vendor_company_id'>>;
  payVendor?: Resolver<Maybe<ResolversTypes['Milestone']>, ParentType, ContextType, RequireFields<MutationPayVendorArgs, 'id'>>;
  purgeTestDataByUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationPurgeTestDataByUserArgs, 'user_id'>>;
  resendVendorMemberInvitationByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationResendVendorMemberInvitationByAdminArgs, 'user_id'>>;
  unregisterBiotechAccount?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUnregisterBiotechAccountArgs, 'biotech_id'>>;
  updateBiotechInviteVendor?: Resolver<Maybe<ResolversTypes['BiotechInviteVendor']>, ParentType, ContextType, RequireFields<MutationUpdateBiotechInviteVendorArgs, 'company_name' | 'email' | 'first_name' | 'id' | 'last_name' | 'website'>>;
  updateCertificationTag?: Resolver<Maybe<ResolversTypes['CertificationTag']>, ParentType, ContextType, RequireFields<MutationUpdateCertificationTagArgs, 'full_name' | 'id'>>;
  updateLabSpecialization?: Resolver<Maybe<ResolversTypes['LabSpecialization']>, ParentType, ContextType, RequireFields<MutationUpdateLabSpecializationArgs, 'full_name' | 'id'>>;
  updatePerk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType, RequireFields<MutationUpdatePerkArgs, 'description' | 'how_to_redeem' | 'id' | 'image' | 'is_active' | 'perk_category_id' | 'reward_description' | 'terms' | 'title'>>;
  updatePerkCategory?: Resolver<Maybe<ResolversTypes['PerkCategory']>, ParentType, ContextType, RequireFields<MutationUpdatePerkCategoryArgs, 'description' | 'id' | 'name'>>;
  updateVendorMemberByAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateVendorMemberByAdminArgs, 'user_id'>>;
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

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _dummy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  Perk?: PerkResolvers<ContextType>;
  PerkCategory?: PerkCategoryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  VendorCompany?: VendorCompanyResolvers<ContextType>;
  VendorMember?: VendorMemberResolvers<ContextType>;
}>;

