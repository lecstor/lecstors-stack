export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type AuthPayload = {
   __typename?: 'AuthPayload',
  user?: Maybe<User>,
  message?: Maybe<Scalars['String']>,
};

export type Credentials = {
   __typename?: 'Credentials',
  id?: Maybe<Scalars['String']>,
  providerId?: Maybe<Scalars['String']>,
  secret?: Maybe<Scalars['String']>,
  userId?: Maybe<Scalars['String']>,
};

export type CredentialsInput = {
  providerId?: Maybe<Scalars['String']>,
  secret?: Maybe<Scalars['String']>,
};

export type Email = {
   __typename?: 'Email',
  email?: Maybe<Scalars['String']>,
  verified?: Maybe<Scalars['Boolean']>,
  userId?: Maybe<Scalars['String']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createUser?: Maybe<User>,
  login?: Maybe<AuthPayload>,
  logout?: Maybe<Scalars['Boolean']>,
};


export type MutationCreateUserArgs = {
  firstname?: Maybe<Scalars['String']>,
  surname?: Maybe<Scalars['String']>,
  email: Scalars['String']
};


export type MutationLoginArgs = {
  username: Scalars['String'],
  password: Scalars['String']
};

export type Query = {
   __typename?: 'Query',
  currentUser?: Maybe<User>,
  user?: Maybe<User>,
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['String']>
};

export type User = {
   __typename?: 'User',
  id?: Maybe<Scalars['String']>,
  firstname?: Maybe<Scalars['String']>,
  surname?: Maybe<Scalars['String']>,
  emails?: Maybe<Array<Maybe<Email>>>,
  credentials?: Maybe<Array<Maybe<Credentials>>>,
};
