import { GraphQLResolveInfo } from 'graphql';
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
};

export type Biotech = {
  __typename?: 'Biotech';
  about?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  cda_pandadoc_file_id?: Maybe<Scalars['String']>;
  cda_signed_at?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  has_setup_profile?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  number_of_reqs_allowed_without_subscription?: Maybe<Scalars['Int']>;
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
  updated_at?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type Customer = {
  __typename?: 'Customer';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  customer_connections?: Maybe<Array<Maybe<CustomerConnection>>>;
  has_setup_profile?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  job_title?: Maybe<Scalars['String']>;
  project_requests?: Maybe<Array<Maybe<ProjectRequest>>>;
  team?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']>;
};

export type CustomerConnection = {
  __typename?: 'CustomerConnection';
  created_at?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
  customer_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCda?: Maybe<Scalars['String']>;
  createCustomer: Customer;
  createProjectRequest?: Maybe<ProjectRequest>;
  createProjectRequestComment?: Maybe<ProjectRequestComment>;
  forgotPassword?: Maybe<Scalars['Boolean']>;
  inviteCustomer?: Maybe<Customer>;
  inviteVendorMember?: Maybe<Customer>;
  refreshJWT?: Maybe<User>;
  resetPassword?: Maybe<Scalars['Boolean']>;
  signInUser: User;
  signUpUser: User;
  updateBiotech?: Maybe<Biotech>;
  updateCustomer: Customer;
  updateVendorCompany?: Maybe<VendorCompany>;
  updateVendorMember?: Maybe<VendorMember>;
};


export type MutationCreateCustomerArgs = {
  company_name: Scalars['String'];
  job_title?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
  user_id: Scalars['String'];
};


export type MutationCreateProjectRequestArgs = {
  existing_vendor_contact_description?: InputMaybe<Scalars['String']>;
  in_contact_with_vendor: Scalars['Boolean'];
  max_budget: Scalars['Int'];
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


export type MutationForgotPasswordArgs = {
  email?: InputMaybe<Scalars['String']>;
};


export type MutationInviteCustomerArgs = {
  custom_message?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
};


export type MutationInviteVendorMemberArgs = {
  custom_message?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  new_password?: InputMaybe<Scalars['String']>;
  reset_token?: InputMaybe<Scalars['String']>;
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


export type MutationUpdateBiotechArgs = {
  about?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  has_setup_profile?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCustomerArgs = {
  has_setup_profile?: InputMaybe<Scalars['Boolean']>;
  job_title?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateVendorCompanyArgs = {
  address?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateVendorMemberArgs = {
  department?: InputMaybe<Scalars['String']>;
  is_primary_member?: InputMaybe<Scalars['Boolean']>;
  phone?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  created_at?: Maybe<Scalars['String']>;
  customer_connections?: Maybe<Array<Maybe<CustomerConnection>>>;
  final_contract_uploaded_at?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  project_request?: Maybe<ProjectRequest>;
  project_request_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
  vendor_member_connections?: Maybe<Array<Maybe<VendorMemberConnection>>>;
  vendor_status?: Maybe<Scalars['String']>;
};

export type ProjectRequest = {
  __typename?: 'ProjectRequest';
  created_at?: Maybe<Scalars['String']>;
  creator_company?: Maybe<Scalars['String']>;
  creator_email?: Maybe<Scalars['String']>;
  creator_job?: Maybe<Scalars['String']>;
  creator_name?: Maybe<Scalars['String']>;
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
  updated_at?: Maybe<Scalars['String']>;
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
  biotech?: Maybe<Biotech>;
  cdaUrl?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
  stripePricingTableId?: Maybe<Scalars['String']>;
  subscription?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  vendorCompany?: Maybe<VendorCompany>;
  vendorMember?: Maybe<VendorMember>;
};

export type Subscription = {
  __typename?: 'Subscription';
  biotech?: Maybe<Biotech>;
  biotech_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  stripe_customer_id?: Maybe<Scalars['String']>;
  stripe_subscription_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  created_at?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
};

export type VendorCompany = {
  __typename?: 'VendorCompany';
  address?: Maybe<Scalars['String']>;
  cda_pandadoc_file_id?: Maybe<Scalars['String']>;
  cda_signed_at?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  project_connections?: Maybe<Array<Maybe<ProjectConnection>>>;
  updated_at?: Maybe<Scalars['String']>;
  vendor_members?: Maybe<Array<Maybe<VendorMember>>>;
  website?: Maybe<Scalars['String']>;
};

export type VendorMember = {
  __typename?: 'VendorMember';
  created_at?: Maybe<Scalars['String']>;
  department?: Maybe<Scalars['String']>;
  is_primary_member?: Maybe<Scalars['Boolean']>;
  phone?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  user_id?: Maybe<User>;
  vendor_company?: Maybe<VendorCompany>;
  vendor_company_id?: Maybe<Scalars['String']>;
  vendor_member_connections?: Maybe<Array<Maybe<VendorMemberConnection>>>;
};

export type VendorMemberConnection = {
  __typename?: 'VendorMemberConnection';
  created_at?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  project_connection?: Maybe<ProjectConnection>;
  project_connection_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
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
  Biotech: ResolverTypeWrapper<Biotech>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Customer: ResolverTypeWrapper<Customer>;
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  ProjectConnection: ResolverTypeWrapper<ProjectConnection>;
  ProjectRequest: ResolverTypeWrapper<ProjectRequest>;
  ProjectRequestComment: ResolverTypeWrapper<ProjectRequestComment>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  VendorCompany: ResolverTypeWrapper<VendorCompany>;
  VendorMember: ResolverTypeWrapper<VendorMember>;
  VendorMemberConnection: ResolverTypeWrapper<VendorMemberConnection>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Biotech: Biotech;
  Boolean: Scalars['Boolean'];
  Customer: Customer;
  CustomerConnection: CustomerConnection;
  Int: Scalars['Int'];
  Mutation: {};
  ProjectConnection: ProjectConnection;
  ProjectRequest: ProjectRequest;
  ProjectRequestComment: ProjectRequestComment;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  User: User;
  VendorCompany: VendorCompany;
  VendorMember: VendorMember;
  VendorMemberConnection: VendorMemberConnection;
}>;

export type BiotechResolvers<ContextType = any, ParentType extends ResolversParentTypes['Biotech'] = ResolversParentTypes['Biotech']> = ResolversObject<{
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_pandadoc_file_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_signed_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Customer']>>>, ParentType, ContextType>;
  has_setup_profile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  number_of_reqs_allowed_without_subscription?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  subscriptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Subscription']>>>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  biotech_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customer_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomerConnection']>>>, ParentType, ContextType>;
  has_setup_profile?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  job_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_requests?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectRequest']>>>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomerConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerConnection'] = ResolversParentTypes['CustomerConnection']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createCda?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'company_name' | 'user_id'>>;
  createProjectRequest?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestArgs, 'in_contact_with_vendor' | 'max_budget' | 'objective_description' | 'title' | 'vendor_requirement' | 'vendor_search_timeframe'>>;
  createProjectRequestComment?: Resolver<Maybe<ResolversTypes['ProjectRequestComment']>, ParentType, ContextType, RequireFields<MutationCreateProjectRequestCommentArgs, 'content' | 'project_request_id'>>;
  forgotPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationForgotPasswordArgs>>;
  inviteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationInviteCustomerArgs, 'email' | 'first_name' | 'last_name'>>;
  inviteVendorMember?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationInviteVendorMemberArgs, 'email' | 'first_name' | 'last_name'>>;
  refreshJWT?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  resetPassword?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationResetPasswordArgs>>;
  signInUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSignInUserArgs, 'email' | 'password'>>;
  signUpUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSignUpUserArgs, 'company_name' | 'email' | 'first_name' | 'last_name' | 'password'>>;
  updateBiotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType, Partial<MutationUpdateBiotechArgs>>;
  updateCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, Partial<MutationUpdateCustomerArgs>>;
  updateVendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType, Partial<MutationUpdateVendorCompanyArgs>>;
  updateVendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType, Partial<MutationUpdateVendorMemberArgs>>;
}>;

export type ProjectConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectConnection'] = ResolversParentTypes['ProjectConnection']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customer_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomerConnection']>>>, ParentType, ContextType>;
  final_contract_uploaded_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_request?: Resolver<Maybe<ResolversTypes['ProjectRequest']>, ParentType, ContextType>;
  project_request_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_member_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMemberConnection']>>>, ParentType, ContextType>;
  vendor_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProjectRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectRequest'] = ResolversParentTypes['ProjectRequest']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creator_company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creator_email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creator_job?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creator_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  biotech?: Resolver<Maybe<ResolversTypes['Biotech']>, ParentType, ContextType>;
  cdaUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  stripePricingTableId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subscription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  vendorCompany?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendorMember?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  biotech?: SubscriptionResolver<Maybe<ResolversTypes['Biotech']>, "biotech", ParentType, ContextType>;
  biotech_id?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "biotech_id", ParentType, ContextType>;
  created_at?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "created_at", ParentType, ContextType>;
  id?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "id", ParentType, ContextType>;
  status?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "status", ParentType, ContextType>;
  stripe_customer_id?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "stripe_customer_id", ParentType, ContextType>;
  stripe_subscription_id?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "stripe_subscription_id", ParentType, ContextType>;
  updated_at?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "updated_at", ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorCompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorCompany'] = ResolversParentTypes['VendorCompany']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_pandadoc_file_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cda_signed_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProjectConnection']>>>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_members?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMember']>>>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorMember'] = ResolversParentTypes['VendorMember']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_primary_member?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  vendor_company?: Resolver<Maybe<ResolversTypes['VendorCompany']>, ParentType, ContextType>;
  vendor_company_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_member_connections?: Resolver<Maybe<Array<Maybe<ResolversTypes['VendorMemberConnection']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VendorMemberConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['VendorMemberConnection'] = ResolversParentTypes['VendorMemberConnection']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project_connection?: Resolver<Maybe<ResolversTypes['ProjectConnection']>, ParentType, ContextType>;
  project_connection_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vendor_member?: Resolver<Maybe<ResolversTypes['VendorMember']>, ParentType, ContextType>;
  vendor_member_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Biotech?: BiotechResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  CustomerConnection?: CustomerConnectionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  ProjectConnection?: ProjectConnectionResolvers<ContextType>;
  ProjectRequest?: ProjectRequestResolvers<ContextType>;
  ProjectRequestComment?: ProjectRequestCommentResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VendorCompany?: VendorCompanyResolvers<ContextType>;
  VendorMember?: VendorMemberResolvers<ContextType>;
  VendorMemberConnection?: VendorMemberConnectionResolvers<ContextType>;
}>;

