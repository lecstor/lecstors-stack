// DO NOT EDIT - automatically generated with graphql-code-generator
/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
import EmailModel from './db/models/user/email.model';
import UserModel from './db/models/user/user.model';
import { Context } from './api/graphql/context';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };


/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['Boolean']>;
  auth?: Maybe<Auth>;
  group: Group;
  groupsTrees: Array<Array<Group>>;
  currentUser?: Maybe<User>;
  user?: Maybe<User>;
  tokens: Array<EmailVerificationToken>;
};


export type QueryGroupArgs = {
  groupId: Scalars['String'];
};


export type QueryGroupsTreesArgs = {
  groupIds: Array<Scalars['String']>;
};


export type QueryUserArgs = {
  userId: Scalars['String'];
};


export type QueryTokensArgs = {
  email: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['Boolean']>;
  addMember?: Maybe<Scalars['Int']>;
  createUser?: Maybe<User>;
  login?: Maybe<Auth>;
  verifyEmail?: Maybe<Auth>;
  deleteUser?: Maybe<Auth>;
  logout?: Maybe<Auth>;
};


export type MutationAddMemberArgs = {
  groupId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationCreateUserArgs = {
  firstname: Scalars['String'];
  surname: Scalars['String'];
  email: Scalars['String'];
  groupId: Scalars['String'];
};


export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  _?: Maybe<Scalars['Boolean']>;
};

export type Credentials = {
  __typename?: 'Credentials';
  id?: Maybe<Scalars['String']>;
  providerId?: Maybe<Scalars['String']>;
  secret?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type Auth = {
  __typename?: 'Auth';
  user?: Maybe<User>;
};

export type Group = {
  __typename?: 'Group';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  group?: Maybe<Group>;
  primaryGroupId?: Maybe<Scalars['String']>;
  primaryGroup?: Maybe<Group>;
  isPrimary?: Maybe<Scalars['Boolean']>;
  privileges?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  members?: Maybe<Array<Maybe<User>>>;
};

export type Email = {
  __typename?: 'Email';
  email: Scalars['String'];
  verified: Scalars['Boolean'];
  userId: Scalars['String'];
  verificationTokens: Array<EmailVerificationToken>;
};

export type EmailVerificationToken = {
  __typename?: 'EmailVerificationToken';
  id?: Maybe<Scalars['String']>;
  emailId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  email?: Maybe<Email>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emails: Array<Email>;
  credentials?: Maybe<Array<Maybe<Credentials>>>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Subscription: ResolverTypeWrapper<{}>;
  Credentials: ResolverTypeWrapper<Credentials>;
  Auth: ResolverTypeWrapper<Omit<Auth, 'user'> & { user?: Maybe<ResolversTypes['User']> }>;
  Group: ResolverTypeWrapper<Omit<Group, 'group' | 'primaryGroup' | 'members'> & { group?: Maybe<ResolversTypes['Group']>, primaryGroup?: Maybe<ResolversTypes['Group']>, members?: Maybe<Array<Maybe<ResolversTypes['User']>>> }>;
  Email: ResolverTypeWrapper<EmailModel>;
  EmailVerificationToken: ResolverTypeWrapper<Omit<EmailVerificationToken, 'email'> & { email?: Maybe<ResolversTypes['Email']> }>;
  User: ResolverTypeWrapper<UserModel>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  Mutation: {};
  Int: Scalars['Int'];
  Subscription: {};
  Credentials: Credentials;
  Auth: Omit<Auth, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  Group: Omit<Group, 'group' | 'primaryGroup' | 'members'> & { group?: Maybe<ResolversParentTypes['Group']>, primaryGroup?: Maybe<ResolversParentTypes['Group']>, members?: Maybe<Array<Maybe<ResolversParentTypes['User']>>> };
  Email: EmailModel;
  EmailVerificationToken: Omit<EmailVerificationToken, 'email'> & { email?: Maybe<ResolversParentTypes['Email']> };
  User: UserModel;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  auth?: Resolver<Maybe<ResolversTypes['Auth']>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<QueryGroupArgs, 'groupId'>>;
  groupsTrees?: Resolver<Array<Array<ResolversTypes['Group']>>, ParentType, ContextType, RequireFields<QueryGroupsTreesArgs, 'groupIds'>>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'userId'>>;
  tokens?: Resolver<Array<ResolversTypes['EmailVerificationToken']>, ParentType, ContextType, RequireFields<QueryTokensArgs, 'email'>>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  addMember?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationAddMemberArgs, 'groupId' | 'userId'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'firstname' | 'surname' | 'email' | 'groupId'>>;
  login?: Resolver<Maybe<ResolversTypes['Auth']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'username' | 'password'>>;
  verifyEmail?: Resolver<Maybe<ResolversTypes['Auth']>, ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'token'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['Auth']>, ParentType, ContextType>;
  logout?: Resolver<Maybe<ResolversTypes['Auth']>, ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  _?: SubscriptionResolver<Maybe<ResolversTypes['Boolean']>, "_", ParentType, ContextType>;
}>;

export type CredentialsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Credentials'] = ResolversParentTypes['Credentials']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  providerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secret?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type AuthResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Auth'] = ResolversParentTypes['Auth']> = ResolversObject<{
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type GroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  groupId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  primaryGroupId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  primaryGroup?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  isPrimary?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  privileges?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type EmailResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Email'] = ResolversParentTypes['Email']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verificationTokens?: Resolver<Array<ResolversTypes['EmailVerificationToken']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type EmailVerificationTokenResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EmailVerificationToken'] = ResolversParentTypes['EmailVerificationToken']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['Email']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  surname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emails?: Resolver<Array<ResolversTypes['Email']>, ParentType, ContextType>;
  credentials?: Resolver<Maybe<Array<Maybe<ResolversTypes['Credentials']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Credentials?: CredentialsResolvers<ContextType>;
  Auth?: AuthResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  Email?: EmailResolvers<ContextType>;
  EmailVerificationToken?: EmailVerificationTokenResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
