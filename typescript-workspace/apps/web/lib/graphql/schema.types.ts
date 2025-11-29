export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigInt: { input: any; output: any };
  Cursor: { input: any; output: any };
  Date: { input: any; output: any };
  Datetime: { input: any; output: any };
  JSON: { input: any; output: any };
  UUID: { input: any; output: any };
};

export type Account = Node & {
  /** Reads and enables pagination through a set of `AccountRealmRole`. */
  accountRealmRoles: AccountRealmRoleConnection;
  createdAt: Scalars['Datetime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  /** Reads and enables pagination through a set of `FederatedIdentity`. */
  federatedIdentities: FederatedIdentityConnection;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['Datetime']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  passwordHash?: Maybe<Scalars['String']['output']>;
  rowId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  username: Scalars['String']['output'];
};

export type AccountAccountRealmRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AccountRealmRoleCondition>;
  filter?: InputMaybe<AccountRealmRoleFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountRealmRoleOrderBy>>;
};

export type AccountFederatedIdentitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<FederatedIdentityCondition>;
  filter?: InputMaybe<FederatedIdentityFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FederatedIdentityOrderBy>>;
};

/** A condition to be used against `Account` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AccountCondition = {
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `lastLoginAt` field. */
  lastLoginAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `username` field. */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Account` values. */
export type AccountConnection = {
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: Array<Maybe<AccountEdge>>;
  /** A list of `Account` objects. */
  nodes: Array<Maybe<Account>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Account` edge in the connection. */
export type AccountEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Account` at the end of the edge. */
  node?: Maybe<Account>;
};

/** A filter to be used against `Account` object types. All fields are combined with a logical ‘and.’ */
export type AccountFilter = {
  /** Filter by the object’s `accountRealmRoles` relation. */
  accountRealmRoles?: InputMaybe<AccountToManyAccountRealmRoleFilter>;
  /** Some related `accountRealmRoles` exist. */
  accountRealmRolesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccountFilter>>;
  /** Filter by the object’s `email` field. */
  email?: InputMaybe<StringFilter>;
  /** Filter by the object’s `federatedIdentities` relation. */
  federatedIdentities?: InputMaybe<AccountToManyFederatedIdentityFilter>;
  /** Some related `federatedIdentities` exist. */
  federatedIdentitiesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `lastLoginAt` field. */
  lastLoginAt?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<AccountFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccountFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `username` field. */
  username?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Account` */
export type AccountInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email: Scalars['String']['input'];
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastLoginAt?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  passwordHash?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  username: Scalars['String']['input'];
};

/** Methods to use when ordering `Account`. */
export type AccountOrderBy =
  | 'EMAIL_ASC'
  | 'EMAIL_DESC'
  | 'LAST_LOGIN_AT_ASC'
  | 'LAST_LOGIN_AT_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC'
  | 'USERNAME_ASC'
  | 'USERNAME_DESC';

/** Represents an update to a `Account`. Fields that are set will be updated. */
export type AccountPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastLoginAt?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  passwordHash?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type AccountRealmRole = Node & {
  /** Reads a single `Account` that is related to this `AccountRealmRole`. */
  account?: Maybe<Account>;
  accountId: Scalars['UUID']['output'];
  grantedAt: Scalars['Datetime']['output'];
  grantedBy?: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `Account` that is related to this `AccountRealmRole`. */
  granted_by?: Maybe<Account>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Realm` that is related to this `AccountRealmRole`. */
  realm?: Maybe<Realm>;
  realmId: Scalars['UUID']['output'];
  /** Reads a single `Role` that is related to this `AccountRealmRole`. */
  role?: Maybe<Role>;
  roleId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `AccountRealmRole` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type AccountRealmRoleCondition = {
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `realmId` field. */
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `roleId` field. */
  roleId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `AccountRealmRole` values. */
export type AccountRealmRoleConnection = {
  /** A list of edges which contains the `AccountRealmRole` and cursor to aid in pagination. */
  edges: Array<Maybe<AccountRealmRoleEdge>>;
  /** A list of `AccountRealmRole` objects. */
  nodes: Array<Maybe<AccountRealmRole>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `AccountRealmRole` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `AccountRealmRole` edge in the connection. */
export type AccountRealmRoleEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `AccountRealmRole` at the end of the edge. */
  node?: Maybe<AccountRealmRole>;
};

/** A filter to be used against `AccountRealmRole` object types. All fields are combined with a logical ‘and.’ */
export type AccountRealmRoleFilter = {
  /** Filter by the object’s `account` relation. */
  account?: InputMaybe<AccountFilter>;
  /** Filter by the object’s `accountId` field. */
  accountId?: InputMaybe<UuidFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AccountRealmRoleFilter>>;
  /** Filter by the object’s `granted_by` relation. */
  granted_by?: InputMaybe<AccountFilter>;
  /** A related `granted_by` exists. */
  granted_byExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<AccountRealmRoleFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AccountRealmRoleFilter>>;
  /** Filter by the object’s `realm` relation. */
  realm?: InputMaybe<RealmFilter>;
  /** Filter by the object’s `realmId` field. */
  realmId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `role` relation. */
  role?: InputMaybe<RoleFilter>;
  /** Filter by the object’s `roleId` field. */
  roleId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `AccountRealmRole` */
export type AccountRealmRoleInput = {
  accountId: Scalars['UUID']['input'];
  grantedAt?: InputMaybe<Scalars['Datetime']['input']>;
  grantedBy?: InputMaybe<Scalars['UUID']['input']>;
  realmId: Scalars['UUID']['input'];
  roleId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `AccountRealmRole`. */
export type AccountRealmRoleOrderBy =
  | 'ACCOUNT_ID_ASC'
  | 'ACCOUNT_ID_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'REALM_ID_ASC'
  | 'REALM_ID_DESC'
  | 'ROLE_ID_ASC'
  | 'ROLE_ID_DESC';

/** Represents an update to a `AccountRealmRole`. Fields that are set will be updated. */
export type AccountRealmRolePatch = {
  accountId?: InputMaybe<Scalars['UUID']['input']>;
  grantedAt?: InputMaybe<Scalars['Datetime']['input']>;
  grantedBy?: InputMaybe<Scalars['UUID']['input']>;
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  roleId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A filter to be used against many `AccountRealmRole` object types. All fields are combined with a logical ‘and.’ */
export type AccountToManyAccountRealmRoleFilter = {
  /** Every related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AccountRealmRoleFilter>;
  /** No related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AccountRealmRoleFilter>;
  /** Some related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AccountRealmRoleFilter>;
};

/** A filter to be used against many `FederatedIdentity` object types. All fields are combined with a logical ‘and.’ */
export type AccountToManyFederatedIdentityFilter = {
  /** Every related `FederatedIdentity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<FederatedIdentityFilter>;
  /** No related `FederatedIdentity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<FederatedIdentityFilter>;
  /** Some related `FederatedIdentity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<FederatedIdentityFilter>;
};

export type Bot = Node & {
  /** Reads a single `ChannelBridge` that is related to this `Bot`. */
  apiChannelBridge?: Maybe<ChannelBridge>;
  apiChannelBridgeId?: Maybe<Scalars['UUID']['output']>;
  capabilities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  /** Reads a single `ChannelBridge` that is related to this `Bot`. */
  oauthChannelBridge?: Maybe<ChannelBridge>;
  oauthChannelBridgeId?: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `Realm` that is related to this `Bot`. */
  realm?: Maybe<Realm>;
  realmId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
};

/** A condition to be used against `Bot` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type BotCondition = {
  /** Checks for equality with the object’s `realmId` field. */
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Bot` values. */
export type BotConnection = {
  /** A list of edges which contains the `Bot` and cursor to aid in pagination. */
  edges: Array<Maybe<BotEdge>>;
  /** A list of `Bot` objects. */
  nodes: Array<Maybe<Bot>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Bot` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Bot` edge in the connection. */
export type BotEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Bot` at the end of the edge. */
  node?: Maybe<Bot>;
};

/** A filter to be used against `Bot` object types. All fields are combined with a logical ‘and.’ */
export type BotFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<BotFilter>>;
  /** Filter by the object’s `apiChannelBridge` relation. */
  apiChannelBridge?: InputMaybe<ChannelBridgeFilter>;
  /** A related `apiChannelBridge` exists. */
  apiChannelBridgeExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<BotFilter>;
  /** Filter by the object’s `oauthChannelBridge` relation. */
  oauthChannelBridge?: InputMaybe<ChannelBridgeFilter>;
  /** A related `oauthChannelBridge` exists. */
  oauthChannelBridgeExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<BotFilter>>;
  /** Filter by the object’s `realm` relation. */
  realm?: InputMaybe<RealmFilter>;
  /** Filter by the object’s `realmId` field. */
  realmId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Bot` */
export type BotInput = {
  apiChannelBridgeId?: InputMaybe<Scalars['UUID']['input']>;
  capabilities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  oauthChannelBridgeId?: InputMaybe<Scalars['UUID']['input']>;
  realmId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Bot`. */
export type BotOrderBy =
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'REALM_ID_ASC'
  | 'REALM_ID_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC';

/** Represents an update to a `Bot`. Fields that are set will be updated. */
export type BotPatch = {
  apiChannelBridgeId?: InputMaybe<Scalars['UUID']['input']>;
  capabilities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  oauthChannelBridgeId?: InputMaybe<Scalars['UUID']['input']>;
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ChannelBridge = Node & {
  accessToken?: Maybe<Scalars['String']['output']>;
  apiEndpoint?: Maybe<Scalars['String']['output']>;
  apiVersion?: Maybe<Scalars['String']['output']>;
  bridgeType: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  oauthScopes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  rowId: Scalars['UUID']['output'];
  thirdId: Scalars['String']['output'];
  thirdProviderType: Scalars['String']['output'];
  thirdSecret: Scalars['String']['output'];
  tokenExpiry?: Maybe<Scalars['Datetime']['output']>;
  updatedAt: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `ChannelBridge` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ChannelBridgeCondition = {
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `thirdId` field. */
  thirdId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `thirdProviderType` field. */
  thirdProviderType?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `ChannelBridge` values. */
export type ChannelBridgeConnection = {
  /** A list of edges which contains the `ChannelBridge` and cursor to aid in pagination. */
  edges: Array<Maybe<ChannelBridgeEdge>>;
  /** A list of `ChannelBridge` objects. */
  nodes: Array<Maybe<ChannelBridge>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ChannelBridge` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ChannelBridge` edge in the connection. */
export type ChannelBridgeEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ChannelBridge` at the end of the edge. */
  node?: Maybe<ChannelBridge>;
};

/** A filter to be used against `ChannelBridge` object types. All fields are combined with a logical ‘and.’ */
export type ChannelBridgeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ChannelBridgeFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<ChannelBridgeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ChannelBridgeFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `thirdId` field. */
  thirdId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `thirdProviderType` field. */
  thirdProviderType?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `ChannelBridge` */
export type ChannelBridgeInput = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  apiEndpoint?: InputMaybe<Scalars['String']['input']>;
  apiVersion?: InputMaybe<Scalars['String']['input']>;
  bridgeType: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  oauthScopes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  thirdId: Scalars['String']['input'];
  thirdProviderType: Scalars['String']['input'];
  thirdSecret: Scalars['String']['input'];
  tokenExpiry?: InputMaybe<Scalars['Datetime']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `ChannelBridge`. */
export type ChannelBridgeOrderBy =
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC'
  | 'THIRD_ID_ASC'
  | 'THIRD_ID_DESC'
  | 'THIRD_PROVIDER_TYPE_ASC'
  | 'THIRD_PROVIDER_TYPE_DESC';

/** Represents an update to a `ChannelBridge`. Fields that are set will be updated. */
export type ChannelBridgePatch = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  apiEndpoint?: InputMaybe<Scalars['String']['input']>;
  apiVersion?: InputMaybe<Scalars['String']['input']>;
  bridgeType?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  oauthScopes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  thirdId?: InputMaybe<Scalars['String']['input']>;
  thirdProviderType?: InputMaybe<Scalars['String']['input']>;
  thirdSecret?: InputMaybe<Scalars['String']['input']>;
  tokenExpiry?: InputMaybe<Scalars['Datetime']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type Chat = Node & {
  /** Reads and enables pagination through a set of `ChatParticipant`. */
  chatParticipants: ChatParticipantConnection;
  createdAt: Scalars['Datetime']['output'];
  createdBy: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  isMain: Scalars['Boolean']['output'];
  /** Reads and enables pagination through a set of `Message`. */
  messages: MessageConnection;
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Reads a single `Profile` that is related to this `Chat`. */
  profile?: Maybe<Profile>;
  rowId: Scalars['UUID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Trip` that is related to this `Chat`. */
  trip?: Maybe<Trip>;
  tripId?: Maybe<Scalars['UUID']['output']>;
};

export type ChatChatParticipantsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChatParticipantCondition>;
  filter?: InputMaybe<ChatParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatParticipantOrderBy>>;
};

export type ChatMessagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MessageCondition>;
  filter?: InputMaybe<MessageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MessageOrderBy>>;
};

/** A condition to be used against `Chat` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ChatCondition = {
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Chat` values. */
export type ChatConnection = {
  /** A list of edges which contains the `Chat` and cursor to aid in pagination. */
  edges: Array<Maybe<ChatEdge>>;
  /** A list of `Chat` objects. */
  nodes: Array<Maybe<Chat>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Chat` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Chat` edge in the connection. */
export type ChatEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Chat` at the end of the edge. */
  node?: Maybe<Chat>;
};

/** A filter to be used against `Chat` object types. All fields are combined with a logical ‘and.’ */
export type ChatFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ChatFilter>>;
  /** Filter by the object’s `chatParticipants` relation. */
  chatParticipants?: InputMaybe<ChatToManyChatParticipantFilter>;
  /** Some related `chatParticipants` exist. */
  chatParticipantsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `messages` relation. */
  messages?: InputMaybe<ChatToManyMessageFilter>;
  /** Some related `messages` exist. */
  messagesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<ChatFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ChatFilter>>;
  /** Filter by the object’s `profile` relation. */
  profile?: InputMaybe<ProfileFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `trip` relation. */
  trip?: InputMaybe<TripFilter>;
  /** A related `trip` exists. */
  tripExists?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An input for mutations affecting `Chat` */
export type ChatInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdBy: Scalars['UUID']['input'];
  isMain?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  tripId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Methods to use when ordering `Chat`. */
export type ChatOrderBy = 'NATURAL' | 'PRIMARY_KEY_ASC' | 'PRIMARY_KEY_DESC' | 'ROW_ID_ASC' | 'ROW_ID_DESC';

export type ChatParticipant = Node & {
  /** Reads a single `Chat` that is related to this `ChatParticipant`. */
  chat?: Maybe<Chat>;
  chatId: Scalars['UUID']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  joinedAt: Scalars['Datetime']['output'];
  /** Reads a single `Profile` that is related to this `ChatParticipant`. */
  profile?: Maybe<Profile>;
  profileId: Scalars['UUID']['output'];
  role: Scalars['String']['output'];
};

/**
 * A condition to be used against `ChatParticipant` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ChatParticipantCondition = {
  /** Checks for equality with the object’s `chatId` field. */
  chatId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `profileId` field. */
  profileId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `ChatParticipant` values. */
export type ChatParticipantConnection = {
  /** A list of edges which contains the `ChatParticipant` and cursor to aid in pagination. */
  edges: Array<Maybe<ChatParticipantEdge>>;
  /** A list of `ChatParticipant` objects. */
  nodes: Array<Maybe<ChatParticipant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ChatParticipant` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ChatParticipant` edge in the connection. */
export type ChatParticipantEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ChatParticipant` at the end of the edge. */
  node?: Maybe<ChatParticipant>;
};

/** A filter to be used against `ChatParticipant` object types. All fields are combined with a logical ‘and.’ */
export type ChatParticipantFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ChatParticipantFilter>>;
  /** Filter by the object’s `chat` relation. */
  chat?: InputMaybe<ChatFilter>;
  /** Filter by the object’s `chatId` field. */
  chatId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ChatParticipantFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ChatParticipantFilter>>;
  /** Filter by the object’s `profile` relation. */
  profile?: InputMaybe<ProfileFilter>;
  /** Filter by the object’s `profileId` field. */
  profileId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `ChatParticipant` */
export type ChatParticipantInput = {
  chatId: Scalars['UUID']['input'];
  joinedAt?: InputMaybe<Scalars['Datetime']['input']>;
  profileId: Scalars['UUID']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `ChatParticipant`. */
export type ChatParticipantOrderBy =
  | 'CHAT_ID_ASC'
  | 'CHAT_ID_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'PROFILE_ID_ASC'
  | 'PROFILE_ID_DESC';

/** Represents an update to a `ChatParticipant`. Fields that are set will be updated. */
export type ChatParticipantPatch = {
  chatId?: InputMaybe<Scalars['UUID']['input']>;
  joinedAt?: InputMaybe<Scalars['Datetime']['input']>;
  profileId?: InputMaybe<Scalars['UUID']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an update to a `Chat`. Fields that are set will be updated. */
export type ChatPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdBy?: InputMaybe<Scalars['UUID']['input']>;
  isMain?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  tripId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A filter to be used against many `ChatParticipant` object types. All fields are combined with a logical ‘and.’ */
export type ChatToManyChatParticipantFilter = {
  /** Every related `ChatParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ChatParticipantFilter>;
  /** No related `ChatParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ChatParticipantFilter>;
  /** Some related `ChatParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ChatParticipantFilter>;
};

/** A filter to be used against many `Message` object types. All fields are combined with a logical ‘and.’ */
export type ChatToManyMessageFilter = {
  /** Every related `Message` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<MessageFilter>;
  /** No related `Message` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<MessageFilter>;
  /** Some related `Message` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<MessageFilter>;
};

/** All input for the create `Account` mutation. */
export type CreateAccountInput = {
  /** The `Account` to be created by this mutation. */
  account: AccountInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `Account` mutation. */
export type CreateAccountPayload = {
  /** The `Account` that was created by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Account` mutation. */
export type CreateAccountPayloadAccountEdgeArgs = {
  orderBy?: Array<AccountOrderBy>;
};

/** All input for the create `AccountRealmRole` mutation. */
export type CreateAccountRealmRoleInput = {
  /** The `AccountRealmRole` to be created by this mutation. */
  accountRealmRole: AccountRealmRoleInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `AccountRealmRole` mutation. */
export type CreateAccountRealmRolePayload = {
  /** The `AccountRealmRole` that was created by this mutation. */
  accountRealmRole?: Maybe<AccountRealmRole>;
  /** An edge for our `AccountRealmRole`. May be used by Relay 1. */
  accountRealmRoleEdge?: Maybe<AccountRealmRoleEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `AccountRealmRole` mutation. */
export type CreateAccountRealmRolePayloadAccountRealmRoleEdgeArgs = {
  orderBy?: Array<AccountRealmRoleOrderBy>;
};

/** All input for the create `Bot` mutation. */
export type CreateBotInput = {
  /** The `Bot` to be created by this mutation. */
  bot: BotInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `Bot` mutation. */
export type CreateBotPayload = {
  /** The `Bot` that was created by this mutation. */
  bot?: Maybe<Bot>;
  /** An edge for our `Bot`. May be used by Relay 1. */
  botEdge?: Maybe<BotEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Bot` mutation. */
export type CreateBotPayloadBotEdgeArgs = {
  orderBy?: Array<BotOrderBy>;
};

/** All input for the create `ChannelBridge` mutation. */
export type CreateChannelBridgeInput = {
  /** The `ChannelBridge` to be created by this mutation. */
  channelBridge: ChannelBridgeInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `ChannelBridge` mutation. */
export type CreateChannelBridgePayload = {
  /** The `ChannelBridge` that was created by this mutation. */
  channelBridge?: Maybe<ChannelBridge>;
  /** An edge for our `ChannelBridge`. May be used by Relay 1. */
  channelBridgeEdge?: Maybe<ChannelBridgeEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `ChannelBridge` mutation. */
export type CreateChannelBridgePayloadChannelBridgeEdgeArgs = {
  orderBy?: Array<ChannelBridgeOrderBy>;
};

/** All input for the create `Chat` mutation. */
export type CreateChatInput = {
  /** The `Chat` to be created by this mutation. */
  chat: ChatInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** All input for the create `ChatParticipant` mutation. */
export type CreateChatParticipantInput = {
  /** The `ChatParticipant` to be created by this mutation. */
  chatParticipant: ChatParticipantInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `ChatParticipant` mutation. */
export type CreateChatParticipantPayload = {
  /** The `ChatParticipant` that was created by this mutation. */
  chatParticipant?: Maybe<ChatParticipant>;
  /** An edge for our `ChatParticipant`. May be used by Relay 1. */
  chatParticipantEdge?: Maybe<ChatParticipantEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `ChatParticipant` mutation. */
export type CreateChatParticipantPayloadChatParticipantEdgeArgs = {
  orderBy?: Array<ChatParticipantOrderBy>;
};

/** The output of our create `Chat` mutation. */
export type CreateChatPayload = {
  /** The `Chat` that was created by this mutation. */
  chat?: Maybe<Chat>;
  /** An edge for our `Chat`. May be used by Relay 1. */
  chatEdge?: Maybe<ChatEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Chat` mutation. */
export type CreateChatPayloadChatEdgeArgs = {
  orderBy?: Array<ChatOrderBy>;
};

/** All input for the create `FederatedIdentity` mutation. */
export type CreateFederatedIdentityInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `FederatedIdentity` to be created by this mutation. */
  federatedIdentity: FederatedIdentityInput;
};

/** The output of our create `FederatedIdentity` mutation. */
export type CreateFederatedIdentityPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `FederatedIdentity` that was created by this mutation. */
  federatedIdentity?: Maybe<FederatedIdentity>;
  /** An edge for our `FederatedIdentity`. May be used by Relay 1. */
  federatedIdentityEdge?: Maybe<FederatedIdentityEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `FederatedIdentity` mutation. */
export type CreateFederatedIdentityPayloadFederatedIdentityEdgeArgs = {
  orderBy?: Array<FederatedIdentityOrderBy>;
};

/** All input for the create `IdentityProvider` mutation. */
export type CreateIdentityProviderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `IdentityProvider` to be created by this mutation. */
  identityProvider: IdentityProviderInput;
};

/** The output of our create `IdentityProvider` mutation. */
export type CreateIdentityProviderPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `IdentityProvider` that was created by this mutation. */
  identityProvider?: Maybe<IdentityProvider>;
  /** An edge for our `IdentityProvider`. May be used by Relay 1. */
  identityProviderEdge?: Maybe<IdentityProviderEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `IdentityProvider` mutation. */
export type CreateIdentityProviderPayloadIdentityProviderEdgeArgs = {
  orderBy?: Array<IdentityProviderOrderBy>;
};

/** All input for the create `Message` mutation. */
export type CreateMessageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Message` to be created by this mutation. */
  message: MessageInput;
};

/** The output of our create `Message` mutation. */
export type CreateMessagePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Message` that was created by this mutation. */
  message?: Maybe<Message>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessageEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Message` mutation. */
export type CreateMessagePayloadMessageEdgeArgs = {
  orderBy?: Array<MessageOrderBy>;
};

/** All input for the create `Permission` mutation. */
export type CreatePermissionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Permission` to be created by this mutation. */
  permission: PermissionInput;
};

/** The output of our create `Permission` mutation. */
export type CreatePermissionPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Permission` that was created by this mutation. */
  permission?: Maybe<Permission>;
  /** An edge for our `Permission`. May be used by Relay 1. */
  permissionEdge?: Maybe<PermissionEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Permission` mutation. */
export type CreatePermissionPayloadPermissionEdgeArgs = {
  orderBy?: Array<PermissionOrderBy>;
};

/** All input for the create `Profile` mutation. */
export type CreateProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Profile` to be created by this mutation. */
  profile: ProfileInput;
};

/** The output of our create `Profile` mutation. */
export type CreateProfilePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Profile` that was created by this mutation. */
  profile?: Maybe<Profile>;
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfileEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Profile` mutation. */
export type CreateProfilePayloadProfileEdgeArgs = {
  orderBy?: Array<ProfileOrderBy>;
};

/** All input for the create `Realm` mutation. */
export type CreateRealmInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Realm` to be created by this mutation. */
  realm: RealmInput;
};

/** The output of our create `Realm` mutation. */
export type CreateRealmPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Realm` that was created by this mutation. */
  realm?: Maybe<Realm>;
  /** An edge for our `Realm`. May be used by Relay 1. */
  realmEdge?: Maybe<RealmEdge>;
};

/** The output of our create `Realm` mutation. */
export type CreateRealmPayloadRealmEdgeArgs = {
  orderBy?: Array<RealmOrderBy>;
};

/** All input for the create `Role` mutation. */
export type CreateRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Role` to be created by this mutation. */
  role: RoleInput;
};

/** The output of our create `Role` mutation. */
export type CreateRolePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Role` that was created by this mutation. */
  role?: Maybe<Role>;
  /** An edge for our `Role`. May be used by Relay 1. */
  roleEdge?: Maybe<RoleEdge>;
};

/** The output of our create `Role` mutation. */
export type CreateRolePayloadRoleEdgeArgs = {
  orderBy?: Array<RoleOrderBy>;
};

/** All input for the create `SeaqlMigration` mutation. */
export type CreateSeaqlMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `SeaqlMigration` to be created by this mutation. */
  seaqlMigration: SeaqlMigrationInput;
};

/** The output of our create `SeaqlMigration` mutation. */
export type CreateSeaqlMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `SeaqlMigration` that was created by this mutation. */
  seaqlMigration?: Maybe<SeaqlMigration>;
  /** An edge for our `SeaqlMigration`. May be used by Relay 1. */
  seaqlMigrationEdge?: Maybe<SeaqlMigrationEdge>;
};

/** The output of our create `SeaqlMigration` mutation. */
export type CreateSeaqlMigrationPayloadSeaqlMigrationEdgeArgs = {
  orderBy?: Array<SeaqlMigrationOrderBy>;
};

/** All input for the create `TripCard` mutation. */
export type CreateTripCardInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `TripCard` to be created by this mutation. */
  tripCard: TripCardInput;
};

/** The output of our create `TripCard` mutation. */
export type CreateTripCardPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCard` that was created by this mutation. */
  tripCard?: Maybe<TripCard>;
  /** An edge for our `TripCard`. May be used by Relay 1. */
  tripCardEdge?: Maybe<TripCardEdge>;
};

/** The output of our create `TripCard` mutation. */
export type CreateTripCardPayloadTripCardEdgeArgs = {
  orderBy?: Array<TripCardOrderBy>;
};

/** All input for the create `TripCardRichText` mutation. */
export type CreateTripCardRichTextInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `TripCardRichText` to be created by this mutation. */
  tripCardRichText: TripCardRichTextInput;
};

/** The output of our create `TripCardRichText` mutation. */
export type CreateTripCardRichTextPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCardRichText` that was created by this mutation. */
  tripCardRichText?: Maybe<TripCardRichText>;
  /** An edge for our `TripCardRichText`. May be used by Relay 1. */
  tripCardRichTextEdge?: Maybe<TripCardRichTextEdge>;
};

/** The output of our create `TripCardRichText` mutation. */
export type CreateTripCardRichTextPayloadTripCardRichTextEdgeArgs = {
  orderBy?: Array<TripCardRichTextOrderBy>;
};

/** All input for the create `TripCardVote` mutation. */
export type CreateTripCardVoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `TripCardVote` to be created by this mutation. */
  tripCardVote: TripCardVoteInput;
};

/** The output of our create `TripCardVote` mutation. */
export type CreateTripCardVotePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCardVote` that was created by this mutation. */
  tripCardVote?: Maybe<TripCardVote>;
  /** An edge for our `TripCardVote`. May be used by Relay 1. */
  tripCardVoteEdge?: Maybe<TripCardVoteEdge>;
};

/** The output of our create `TripCardVote` mutation. */
export type CreateTripCardVotePayloadTripCardVoteEdgeArgs = {
  orderBy?: Array<TripCardVoteOrderBy>;
};

/** All input for the create `Trip` mutation. */
export type CreateTripInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Trip` to be created by this mutation. */
  trip: TripInput;
};

/** All input for the create `TripParticipant` mutation. */
export type CreateTripParticipantInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `TripParticipant` to be created by this mutation. */
  tripParticipant: TripParticipantInput;
};

/** The output of our create `TripParticipant` mutation. */
export type CreateTripParticipantPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripParticipant` that was created by this mutation. */
  tripParticipant?: Maybe<TripParticipant>;
  /** An edge for our `TripParticipant`. May be used by Relay 1. */
  tripParticipantEdge?: Maybe<TripParticipantEdge>;
};

/** The output of our create `TripParticipant` mutation. */
export type CreateTripParticipantPayloadTripParticipantEdgeArgs = {
  orderBy?: Array<TripParticipantOrderBy>;
};

/** The output of our create `Trip` mutation. */
export type CreateTripPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Trip` that was created by this mutation. */
  trip?: Maybe<Trip>;
  /** An edge for our `Trip`. May be used by Relay 1. */
  tripEdge?: Maybe<TripEdge>;
};

/** The output of our create `Trip` mutation. */
export type CreateTripPayloadTripEdgeArgs = {
  orderBy?: Array<TripOrderBy>;
};

/** A filter to be used against Date fields. All fields are combined with a logical ‘and.’ */
export type DateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Date']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Date']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Date']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Date']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Date']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Date']['input']>>;
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']['input']>>;
};

/** All input for the `deleteAccountByEmail` mutation. */
export type DeleteAccountByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
};

/** All input for the `deleteAccountById` mutation. */
export type DeleteAccountByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Account` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteAccountByUsername` mutation. */
export type DeleteAccountByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

/** All input for the `deleteAccount` mutation. */
export type DeleteAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayload = {
  /** The `Account` that was deleted by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedAccountId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayloadAccountEdgeArgs = {
  orderBy?: Array<AccountOrderBy>;
};

/** All input for the `deleteAccountRealmRoleById` mutation. */
export type DeleteAccountRealmRoleByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `AccountRealmRole` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteAccountRealmRole` mutation. */
export type DeleteAccountRealmRoleInput = {
  accountId: Scalars['UUID']['input'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  realmId: Scalars['UUID']['input'];
  roleId: Scalars['UUID']['input'];
};

/** The output of our delete `AccountRealmRole` mutation. */
export type DeleteAccountRealmRolePayload = {
  /** The `AccountRealmRole` that was deleted by this mutation. */
  accountRealmRole?: Maybe<AccountRealmRole>;
  /** An edge for our `AccountRealmRole`. May be used by Relay 1. */
  accountRealmRoleEdge?: Maybe<AccountRealmRoleEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedAccountRealmRoleId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `AccountRealmRole` mutation. */
export type DeleteAccountRealmRolePayloadAccountRealmRoleEdgeArgs = {
  orderBy?: Array<AccountRealmRoleOrderBy>;
};

/** All input for the `deleteBotById` mutation. */
export type DeleteBotByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Bot` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteBot` mutation. */
export type DeleteBotInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Bot` mutation. */
export type DeleteBotPayload = {
  /** The `Bot` that was deleted by this mutation. */
  bot?: Maybe<Bot>;
  /** An edge for our `Bot`. May be used by Relay 1. */
  botEdge?: Maybe<BotEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedBotId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Bot` mutation. */
export type DeleteBotPayloadBotEdgeArgs = {
  orderBy?: Array<BotOrderBy>;
};

/** All input for the `deleteChannelBridgeById` mutation. */
export type DeleteChannelBridgeByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ChannelBridge` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteChannelBridge` mutation. */
export type DeleteChannelBridgeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `ChannelBridge` mutation. */
export type DeleteChannelBridgePayload = {
  /** The `ChannelBridge` that was deleted by this mutation. */
  channelBridge?: Maybe<ChannelBridge>;
  /** An edge for our `ChannelBridge`. May be used by Relay 1. */
  channelBridgeEdge?: Maybe<ChannelBridgeEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedChannelBridgeId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `ChannelBridge` mutation. */
export type DeleteChannelBridgePayloadChannelBridgeEdgeArgs = {
  orderBy?: Array<ChannelBridgeOrderBy>;
};

/** All input for the `deleteChatById` mutation. */
export type DeleteChatByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Chat` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteChat` mutation. */
export type DeleteChatInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `deleteChatParticipantById` mutation. */
export type DeleteChatParticipantByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ChatParticipant` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteChatParticipant` mutation. */
export type DeleteChatParticipantInput = {
  chatId: Scalars['UUID']['input'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  profileId: Scalars['UUID']['input'];
};

/** The output of our delete `ChatParticipant` mutation. */
export type DeleteChatParticipantPayload = {
  /** The `ChatParticipant` that was deleted by this mutation. */
  chatParticipant?: Maybe<ChatParticipant>;
  /** An edge for our `ChatParticipant`. May be used by Relay 1. */
  chatParticipantEdge?: Maybe<ChatParticipantEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedChatParticipantId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `ChatParticipant` mutation. */
export type DeleteChatParticipantPayloadChatParticipantEdgeArgs = {
  orderBy?: Array<ChatParticipantOrderBy>;
};

/** The output of our delete `Chat` mutation. */
export type DeleteChatPayload = {
  /** The `Chat` that was deleted by this mutation. */
  chat?: Maybe<Chat>;
  /** An edge for our `Chat`. May be used by Relay 1. */
  chatEdge?: Maybe<ChatEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedChatId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Chat` mutation. */
export type DeleteChatPayloadChatEdgeArgs = {
  orderBy?: Array<ChatOrderBy>;
};

/** All input for the `deleteFederatedIdentityById` mutation. */
export type DeleteFederatedIdentityByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `FederatedIdentity` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteFederatedIdentity` mutation. */
export type DeleteFederatedIdentityInput = {
  accountId: Scalars['UUID']['input'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  identityProviderId: Scalars['UUID']['input'];
};

/** The output of our delete `FederatedIdentity` mutation. */
export type DeleteFederatedIdentityPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedFederatedIdentityId?: Maybe<Scalars['ID']['output']>;
  /** The `FederatedIdentity` that was deleted by this mutation. */
  federatedIdentity?: Maybe<FederatedIdentity>;
  /** An edge for our `FederatedIdentity`. May be used by Relay 1. */
  federatedIdentityEdge?: Maybe<FederatedIdentityEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `FederatedIdentity` mutation. */
export type DeleteFederatedIdentityPayloadFederatedIdentityEdgeArgs = {
  orderBy?: Array<FederatedIdentityOrderBy>;
};

/** All input for the `deleteIdentityProviderById` mutation. */
export type DeleteIdentityProviderByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `IdentityProvider` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteIdentityProvider` mutation. */
export type DeleteIdentityProviderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `IdentityProvider` mutation. */
export type DeleteIdentityProviderPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedIdentityProviderId?: Maybe<Scalars['ID']['output']>;
  /** The `IdentityProvider` that was deleted by this mutation. */
  identityProvider?: Maybe<IdentityProvider>;
  /** An edge for our `IdentityProvider`. May be used by Relay 1. */
  identityProviderEdge?: Maybe<IdentityProviderEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `IdentityProvider` mutation. */
export type DeleteIdentityProviderPayloadIdentityProviderEdgeArgs = {
  orderBy?: Array<IdentityProviderOrderBy>;
};

/** All input for the `deleteMessageById` mutation. */
export type DeleteMessageByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Message` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteMessageByRowIdAndCreatedAt` mutation. */
export type DeleteMessageByRowIdAndCreatedAtInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['Datetime']['input'];
  rowId: Scalars['UUID']['input'];
};

/** All input for the `deleteMessage` mutation. */
export type DeleteMessageInput = {
  chatId: Scalars['UUID']['input'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['Datetime']['input'];
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Message` mutation. */
export type DeleteMessagePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedMessageId?: Maybe<Scalars['ID']['output']>;
  /** The `Message` that was deleted by this mutation. */
  message?: Maybe<Message>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessageEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Message` mutation. */
export type DeleteMessagePayloadMessageEdgeArgs = {
  orderBy?: Array<MessageOrderBy>;
};

/** All input for the `deletePermissionById` mutation. */
export type DeletePermissionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Permission` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deletePermission` mutation. */
export type DeletePermissionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Permission` mutation. */
export type DeletePermissionPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPermissionId?: Maybe<Scalars['ID']['output']>;
  /** The `Permission` that was deleted by this mutation. */
  permission?: Maybe<Permission>;
  /** An edge for our `Permission`. May be used by Relay 1. */
  permissionEdge?: Maybe<PermissionEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Permission` mutation. */
export type DeletePermissionPayloadPermissionEdgeArgs = {
  orderBy?: Array<PermissionOrderBy>;
};

/** All input for the `deleteProfileById` mutation. */
export type DeleteProfileByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Profile` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteProfile` mutation. */
export type DeleteProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Profile` mutation. */
export type DeleteProfilePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedProfileId?: Maybe<Scalars['ID']['output']>;
  /** The `Profile` that was deleted by this mutation. */
  profile?: Maybe<Profile>;
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfileEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Profile` mutation. */
export type DeleteProfilePayloadProfileEdgeArgs = {
  orderBy?: Array<ProfileOrderBy>;
};

/** All input for the `deleteRealmById` mutation. */
export type DeleteRealmByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Realm` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteRealmByName` mutation. */
export type DeleteRealmByNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** All input for the `deleteRealm` mutation. */
export type DeleteRealmInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Realm` mutation. */
export type DeleteRealmPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedRealmId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Realm` that was deleted by this mutation. */
  realm?: Maybe<Realm>;
  /** An edge for our `Realm`. May be used by Relay 1. */
  realmEdge?: Maybe<RealmEdge>;
};

/** The output of our delete `Realm` mutation. */
export type DeleteRealmPayloadRealmEdgeArgs = {
  orderBy?: Array<RealmOrderBy>;
};

/** All input for the `deleteRoleById` mutation. */
export type DeleteRoleByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Role` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteRole` mutation. */
export type DeleteRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Role` mutation. */
export type DeleteRolePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedRoleId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Role` that was deleted by this mutation. */
  role?: Maybe<Role>;
  /** An edge for our `Role`. May be used by Relay 1. */
  roleEdge?: Maybe<RoleEdge>;
};

/** The output of our delete `Role` mutation. */
export type DeleteRolePayloadRoleEdgeArgs = {
  orderBy?: Array<RoleOrderBy>;
};

/** All input for the `deleteSeaqlMigrationById` mutation. */
export type DeleteSeaqlMigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `SeaqlMigration` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteSeaqlMigration` mutation. */
export type DeleteSeaqlMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['String']['input'];
};

/** The output of our delete `SeaqlMigration` mutation. */
export type DeleteSeaqlMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedSeaqlMigrationId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `SeaqlMigration` that was deleted by this mutation. */
  seaqlMigration?: Maybe<SeaqlMigration>;
  /** An edge for our `SeaqlMigration`. May be used by Relay 1. */
  seaqlMigrationEdge?: Maybe<SeaqlMigrationEdge>;
};

/** The output of our delete `SeaqlMigration` mutation. */
export type DeleteSeaqlMigrationPayloadSeaqlMigrationEdgeArgs = {
  orderBy?: Array<SeaqlMigrationOrderBy>;
};

/** All input for the `deleteTripById` mutation. */
export type DeleteTripByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Trip` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteTripCardById` mutation. */
export type DeleteTripCardByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TripCard` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteTripCard` mutation. */
export type DeleteTripCardInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `TripCard` mutation. */
export type DeleteTripCardPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedTripCardId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCard` that was deleted by this mutation. */
  tripCard?: Maybe<TripCard>;
  /** An edge for our `TripCard`. May be used by Relay 1. */
  tripCardEdge?: Maybe<TripCardEdge>;
};

/** The output of our delete `TripCard` mutation. */
export type DeleteTripCardPayloadTripCardEdgeArgs = {
  orderBy?: Array<TripCardOrderBy>;
};

/** All input for the `deleteTripCardRichTextById` mutation. */
export type DeleteTripCardRichTextByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TripCardRichText` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteTripCardRichText` mutation. */
export type DeleteTripCardRichTextInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  tripCardId: Scalars['UUID']['input'];
};

/** The output of our delete `TripCardRichText` mutation. */
export type DeleteTripCardRichTextPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedTripCardRichTextId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCardRichText` that was deleted by this mutation. */
  tripCardRichText?: Maybe<TripCardRichText>;
  /** An edge for our `TripCardRichText`. May be used by Relay 1. */
  tripCardRichTextEdge?: Maybe<TripCardRichTextEdge>;
};

/** The output of our delete `TripCardRichText` mutation. */
export type DeleteTripCardRichTextPayloadTripCardRichTextEdgeArgs = {
  orderBy?: Array<TripCardRichTextOrderBy>;
};

/** All input for the `deleteTripCardVoteById` mutation. */
export type DeleteTripCardVoteByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TripCardVote` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteTripCardVote` mutation. */
export type DeleteTripCardVoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  profileId: Scalars['UUID']['input'];
  tripCardId: Scalars['UUID']['input'];
};

/** The output of our delete `TripCardVote` mutation. */
export type DeleteTripCardVotePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedTripCardVoteId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCardVote` that was deleted by this mutation. */
  tripCardVote?: Maybe<TripCardVote>;
  /** An edge for our `TripCardVote`. May be used by Relay 1. */
  tripCardVoteEdge?: Maybe<TripCardVoteEdge>;
};

/** The output of our delete `TripCardVote` mutation. */
export type DeleteTripCardVotePayloadTripCardVoteEdgeArgs = {
  orderBy?: Array<TripCardVoteOrderBy>;
};

/** All input for the `deleteTrip` mutation. */
export type DeleteTripInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `deleteTripParticipantById` mutation. */
export type DeleteTripParticipantByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TripParticipant` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteTripParticipant` mutation. */
export type DeleteTripParticipantInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  profileId: Scalars['UUID']['input'];
  tripId: Scalars['UUID']['input'];
};

/** The output of our delete `TripParticipant` mutation. */
export type DeleteTripParticipantPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedTripParticipantId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripParticipant` that was deleted by this mutation. */
  tripParticipant?: Maybe<TripParticipant>;
  /** An edge for our `TripParticipant`. May be used by Relay 1. */
  tripParticipantEdge?: Maybe<TripParticipantEdge>;
};

/** The output of our delete `TripParticipant` mutation. */
export type DeleteTripParticipantPayloadTripParticipantEdgeArgs = {
  orderBy?: Array<TripParticipantOrderBy>;
};

/** The output of our delete `Trip` mutation. */
export type DeleteTripPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedTripId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Trip` that was deleted by this mutation. */
  trip?: Maybe<Trip>;
  /** An edge for our `Trip`. May be used by Relay 1. */
  tripEdge?: Maybe<TripEdge>;
};

/** The output of our delete `Trip` mutation. */
export type DeleteTripPayloadTripEdgeArgs = {
  orderBy?: Array<TripOrderBy>;
};

export type FederatedIdentity = Node & {
  accessToken?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Account` that is related to this `FederatedIdentity`. */
  account?: Maybe<Account>;
  accountId: Scalars['UUID']['output'];
  externalUserId: Scalars['String']['output'];
  externalUsername?: Maybe<Scalars['String']['output']>;
  firstLoginAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `IdentityProvider` that is related to this `FederatedIdentity`. */
  identityProvider?: Maybe<IdentityProvider>;
  identityProviderId: Scalars['UUID']['output'];
  lastLoginAt: Scalars['Datetime']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  tokenExpiry?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `FederatedIdentity` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type FederatedIdentityCondition = {
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `externalUserId` field. */
  externalUserId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `FederatedIdentity` values. */
export type FederatedIdentityConnection = {
  /** A list of edges which contains the `FederatedIdentity` and cursor to aid in pagination. */
  edges: Array<Maybe<FederatedIdentityEdge>>;
  /** A list of `FederatedIdentity` objects. */
  nodes: Array<Maybe<FederatedIdentity>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FederatedIdentity` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `FederatedIdentity` edge in the connection. */
export type FederatedIdentityEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `FederatedIdentity` at the end of the edge. */
  node?: Maybe<FederatedIdentity>;
};

/** A filter to be used against `FederatedIdentity` object types. All fields are combined with a logical ‘and.’ */
export type FederatedIdentityFilter = {
  /** Filter by the object’s `account` relation. */
  account?: InputMaybe<AccountFilter>;
  /** Filter by the object’s `accountId` field. */
  accountId?: InputMaybe<UuidFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<FederatedIdentityFilter>>;
  /** Filter by the object’s `externalUserId` field. */
  externalUserId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `identityProvider` relation. */
  identityProvider?: InputMaybe<IdentityProviderFilter>;
  /** Filter by the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<FederatedIdentityFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<FederatedIdentityFilter>>;
};

/** An input for mutations affecting `FederatedIdentity` */
export type FederatedIdentityInput = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  accountId: Scalars['UUID']['input'];
  externalUserId: Scalars['String']['input'];
  externalUsername?: InputMaybe<Scalars['String']['input']>;
  firstLoginAt?: InputMaybe<Scalars['Datetime']['input']>;
  identityProviderId: Scalars['UUID']['input'];
  lastLoginAt?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  tokenExpiry?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `FederatedIdentity`. */
export type FederatedIdentityOrderBy =
  | 'ACCOUNT_ID_ASC'
  | 'ACCOUNT_ID_DESC'
  | 'EXTERNAL_USER_ID_ASC'
  | 'EXTERNAL_USER_ID_DESC'
  | 'IDENTITY_PROVIDER_ID_ASC'
  | 'IDENTITY_PROVIDER_ID_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

/** Represents an update to a `FederatedIdentity`. Fields that are set will be updated. */
export type FederatedIdentityPatch = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  accountId?: InputMaybe<Scalars['UUID']['input']>;
  externalUserId?: InputMaybe<Scalars['String']['input']>;
  externalUsername?: InputMaybe<Scalars['String']['input']>;
  firstLoginAt?: InputMaybe<Scalars['Datetime']['input']>;
  identityProviderId?: InputMaybe<Scalars['UUID']['input']>;
  lastLoginAt?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  tokenExpiry?: InputMaybe<Scalars['Datetime']['input']>;
};

export type IdentityProvider = Node & {
  alias: Scalars['String']['output'];
  authorizationUrl?: Maybe<Scalars['String']['output']>;
  clientId?: Maybe<Scalars['String']['output']>;
  clientSecret?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Datetime']['output'];
  defaultScopes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  displayName: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `FederatedIdentity`. */
  federatedIdentities: FederatedIdentityConnection;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  providerType: Scalars['String']['output'];
  /** Reads a single `Realm` that is related to this `IdentityProvider`. */
  realm?: Maybe<Realm>;
  realmId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  samlCertificate?: Maybe<Scalars['String']['output']>;
  samlEntityId?: Maybe<Scalars['String']['output']>;
  samlSsoUrl?: Maybe<Scalars['String']['output']>;
  tokenUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Datetime']['output'];
  userInfoUrl?: Maybe<Scalars['String']['output']>;
};

export type IdentityProviderFederatedIdentitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<FederatedIdentityCondition>;
  filter?: InputMaybe<FederatedIdentityFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FederatedIdentityOrderBy>>;
};

/**
 * A condition to be used against `IdentityProvider` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type IdentityProviderCondition = {
  /** Checks for equality with the object’s `alias` field. */
  alias?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `realmId` field. */
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `IdentityProvider` values. */
export type IdentityProviderConnection = {
  /** A list of edges which contains the `IdentityProvider` and cursor to aid in pagination. */
  edges: Array<Maybe<IdentityProviderEdge>>;
  /** A list of `IdentityProvider` objects. */
  nodes: Array<Maybe<IdentityProvider>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `IdentityProvider` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `IdentityProvider` edge in the connection. */
export type IdentityProviderEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `IdentityProvider` at the end of the edge. */
  node?: Maybe<IdentityProvider>;
};

/** A filter to be used against `IdentityProvider` object types. All fields are combined with a logical ‘and.’ */
export type IdentityProviderFilter = {
  /** Filter by the object’s `alias` field. */
  alias?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<IdentityProviderFilter>>;
  /** Filter by the object’s `federatedIdentities` relation. */
  federatedIdentities?: InputMaybe<IdentityProviderToManyFederatedIdentityFilter>;
  /** Some related `federatedIdentities` exist. */
  federatedIdentitiesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<IdentityProviderFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<IdentityProviderFilter>>;
  /** Filter by the object’s `realm` relation. */
  realm?: InputMaybe<RealmFilter>;
  /** Filter by the object’s `realmId` field. */
  realmId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `IdentityProvider` */
export type IdentityProviderInput = {
  alias: Scalars['String']['input'];
  authorizationUrl?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['String']['input']>;
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  defaultScopes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  displayName: Scalars['String']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  providerType: Scalars['String']['input'];
  realmId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  samlCertificate?: InputMaybe<Scalars['String']['input']>;
  samlEntityId?: InputMaybe<Scalars['String']['input']>;
  samlSsoUrl?: InputMaybe<Scalars['String']['input']>;
  tokenUrl?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userInfoUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `IdentityProvider`. */
export type IdentityProviderOrderBy =
  | 'ALIAS_ASC'
  | 'ALIAS_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'REALM_ID_ASC'
  | 'REALM_ID_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC';

/** Represents an update to a `IdentityProvider`. Fields that are set will be updated. */
export type IdentityProviderPatch = {
  alias?: InputMaybe<Scalars['String']['input']>;
  authorizationUrl?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['String']['input']>;
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  defaultScopes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  providerType?: InputMaybe<Scalars['String']['input']>;
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  samlCertificate?: InputMaybe<Scalars['String']['input']>;
  samlEntityId?: InputMaybe<Scalars['String']['input']>;
  samlSsoUrl?: InputMaybe<Scalars['String']['input']>;
  tokenUrl?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userInfoUrl?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against many `FederatedIdentity` object types. All fields are combined with a logical ‘and.’ */
export type IdentityProviderToManyFederatedIdentityFilter = {
  /** Every related `FederatedIdentity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<FederatedIdentityFilter>;
  /** No related `FederatedIdentity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<FederatedIdentityFilter>;
  /** Some related `FederatedIdentity` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<FederatedIdentityFilter>;
};

export type Message = Node & {
  /** Reads a single `Chat` that is related to this `Message`. */
  chat?: Maybe<Chat>;
  chatId: Scalars['UUID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  rowId: Scalars['UUID']['output'];
  senderRole: Scalars['String']['output'];
};

/** A condition to be used against `Message` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MessageCondition = {
  /** Checks for equality with the object’s `chatId` field. */
  chatId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Message` values. */
export type MessageConnection = {
  /** A list of edges which contains the `Message` and cursor to aid in pagination. */
  edges: Array<Maybe<MessageEdge>>;
  /** A list of `Message` objects. */
  nodes: Array<Maybe<Message>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Message` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Message` edge in the connection. */
export type MessageEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Message` at the end of the edge. */
  node?: Maybe<Message>;
};

/** A filter to be used against `Message` object types. All fields are combined with a logical ‘and.’ */
export type MessageFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MessageFilter>>;
  /** Filter by the object’s `chat` relation. */
  chat?: InputMaybe<ChatFilter>;
  /** Filter by the object’s `chatId` field. */
  chatId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MessageFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MessageFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Message` */
export type MessageInput = {
  chatId: Scalars['UUID']['input'];
  content: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  senderRole: Scalars['String']['input'];
};

/** Methods to use when ordering `Message`. */
export type MessageOrderBy =
  | 'CHAT_ID_ASC'
  | 'CHAT_ID_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC';

/** Represents an update to a `Message`. Fields that are set will be updated. */
export type MessagePatch = {
  chatId?: InputMaybe<Scalars['UUID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  senderRole?: InputMaybe<Scalars['String']['input']>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  /** Creates a single `Account`. */
  createAccount?: Maybe<CreateAccountPayload>;
  /** Creates a single `AccountRealmRole`. */
  createAccountRealmRole?: Maybe<CreateAccountRealmRolePayload>;
  /** Creates a single `Bot`. */
  createBot?: Maybe<CreateBotPayload>;
  /** Creates a single `ChannelBridge`. */
  createChannelBridge?: Maybe<CreateChannelBridgePayload>;
  /** Creates a single `Chat`. */
  createChat?: Maybe<CreateChatPayload>;
  /** Creates a single `ChatParticipant`. */
  createChatParticipant?: Maybe<CreateChatParticipantPayload>;
  /** Creates a single `FederatedIdentity`. */
  createFederatedIdentity?: Maybe<CreateFederatedIdentityPayload>;
  /** Creates a single `IdentityProvider`. */
  createIdentityProvider?: Maybe<CreateIdentityProviderPayload>;
  /** Creates a single `Message`. */
  createMessage?: Maybe<CreateMessagePayload>;
  /** Creates a single `Permission`. */
  createPermission?: Maybe<CreatePermissionPayload>;
  /** Creates a single `Profile`. */
  createProfile?: Maybe<CreateProfilePayload>;
  /** Creates a single `Realm`. */
  createRealm?: Maybe<CreateRealmPayload>;
  /** Creates a single `Role`. */
  createRole?: Maybe<CreateRolePayload>;
  /** Creates a single `SeaqlMigration`. */
  createSeaqlMigration?: Maybe<CreateSeaqlMigrationPayload>;
  /** Creates a single `Trip`. */
  createTrip?: Maybe<CreateTripPayload>;
  /** Creates a single `TripCard`. */
  createTripCard?: Maybe<CreateTripCardPayload>;
  /** Creates a single `TripCardRichText`. */
  createTripCardRichText?: Maybe<CreateTripCardRichTextPayload>;
  /** Creates a single `TripCardVote`. */
  createTripCardVote?: Maybe<CreateTripCardVotePayload>;
  /** Creates a single `TripParticipant`. */
  createTripParticipant?: Maybe<CreateTripParticipantPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountByEmail?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccountById?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountByUsername?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `AccountRealmRole` using a unique key. */
  deleteAccountRealmRole?: Maybe<DeleteAccountRealmRolePayload>;
  /** Deletes a single `AccountRealmRole` using its globally unique id. */
  deleteAccountRealmRoleById?: Maybe<DeleteAccountRealmRolePayload>;
  /** Deletes a single `Bot` using a unique key. */
  deleteBot?: Maybe<DeleteBotPayload>;
  /** Deletes a single `Bot` using its globally unique id. */
  deleteBotById?: Maybe<DeleteBotPayload>;
  /** Deletes a single `ChannelBridge` using a unique key. */
  deleteChannelBridge?: Maybe<DeleteChannelBridgePayload>;
  /** Deletes a single `ChannelBridge` using its globally unique id. */
  deleteChannelBridgeById?: Maybe<DeleteChannelBridgePayload>;
  /** Deletes a single `Chat` using a unique key. */
  deleteChat?: Maybe<DeleteChatPayload>;
  /** Deletes a single `Chat` using its globally unique id. */
  deleteChatById?: Maybe<DeleteChatPayload>;
  /** Deletes a single `ChatParticipant` using a unique key. */
  deleteChatParticipant?: Maybe<DeleteChatParticipantPayload>;
  /** Deletes a single `ChatParticipant` using its globally unique id. */
  deleteChatParticipantById?: Maybe<DeleteChatParticipantPayload>;
  /** Deletes a single `FederatedIdentity` using a unique key. */
  deleteFederatedIdentity?: Maybe<DeleteFederatedIdentityPayload>;
  /** Deletes a single `FederatedIdentity` using its globally unique id. */
  deleteFederatedIdentityById?: Maybe<DeleteFederatedIdentityPayload>;
  /** Deletes a single `IdentityProvider` using a unique key. */
  deleteIdentityProvider?: Maybe<DeleteIdentityProviderPayload>;
  /** Deletes a single `IdentityProvider` using its globally unique id. */
  deleteIdentityProviderById?: Maybe<DeleteIdentityProviderPayload>;
  /** Deletes a single `Message` using a unique key. */
  deleteMessage?: Maybe<DeleteMessagePayload>;
  /** Deletes a single `Message` using its globally unique id. */
  deleteMessageById?: Maybe<DeleteMessagePayload>;
  /** Deletes a single `Message` using a unique key. */
  deleteMessageByRowIdAndCreatedAt?: Maybe<DeleteMessagePayload>;
  /** Deletes a single `Permission` using a unique key. */
  deletePermission?: Maybe<DeletePermissionPayload>;
  /** Deletes a single `Permission` using its globally unique id. */
  deletePermissionById?: Maybe<DeletePermissionPayload>;
  /** Deletes a single `Profile` using a unique key. */
  deleteProfile?: Maybe<DeleteProfilePayload>;
  /** Deletes a single `Profile` using its globally unique id. */
  deleteProfileById?: Maybe<DeleteProfilePayload>;
  /** Deletes a single `Realm` using a unique key. */
  deleteRealm?: Maybe<DeleteRealmPayload>;
  /** Deletes a single `Realm` using its globally unique id. */
  deleteRealmById?: Maybe<DeleteRealmPayload>;
  /** Deletes a single `Realm` using a unique key. */
  deleteRealmByName?: Maybe<DeleteRealmPayload>;
  /** Deletes a single `Role` using a unique key. */
  deleteRole?: Maybe<DeleteRolePayload>;
  /** Deletes a single `Role` using its globally unique id. */
  deleteRoleById?: Maybe<DeleteRolePayload>;
  /** Deletes a single `SeaqlMigration` using a unique key. */
  deleteSeaqlMigration?: Maybe<DeleteSeaqlMigrationPayload>;
  /** Deletes a single `SeaqlMigration` using its globally unique id. */
  deleteSeaqlMigrationById?: Maybe<DeleteSeaqlMigrationPayload>;
  /** Deletes a single `Trip` using a unique key. */
  deleteTrip?: Maybe<DeleteTripPayload>;
  /** Deletes a single `Trip` using its globally unique id. */
  deleteTripById?: Maybe<DeleteTripPayload>;
  /** Deletes a single `TripCard` using a unique key. */
  deleteTripCard?: Maybe<DeleteTripCardPayload>;
  /** Deletes a single `TripCard` using its globally unique id. */
  deleteTripCardById?: Maybe<DeleteTripCardPayload>;
  /** Deletes a single `TripCardRichText` using a unique key. */
  deleteTripCardRichText?: Maybe<DeleteTripCardRichTextPayload>;
  /** Deletes a single `TripCardRichText` using its globally unique id. */
  deleteTripCardRichTextById?: Maybe<DeleteTripCardRichTextPayload>;
  /** Deletes a single `TripCardVote` using a unique key. */
  deleteTripCardVote?: Maybe<DeleteTripCardVotePayload>;
  /** Deletes a single `TripCardVote` using its globally unique id. */
  deleteTripCardVoteById?: Maybe<DeleteTripCardVotePayload>;
  /** Deletes a single `TripParticipant` using a unique key. */
  deleteTripParticipant?: Maybe<DeleteTripParticipantPayload>;
  /** Deletes a single `TripParticipant` using its globally unique id. */
  deleteTripParticipantById?: Maybe<DeleteTripParticipantPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccount?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountByEmail?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using its globally unique id and a patch. */
  updateAccountById?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountByUsername?: Maybe<UpdateAccountPayload>;
  /** Updates a single `AccountRealmRole` using a unique key and a patch. */
  updateAccountRealmRole?: Maybe<UpdateAccountRealmRolePayload>;
  /** Updates a single `AccountRealmRole` using its globally unique id and a patch. */
  updateAccountRealmRoleById?: Maybe<UpdateAccountRealmRolePayload>;
  /** Updates a single `Bot` using a unique key and a patch. */
  updateBot?: Maybe<UpdateBotPayload>;
  /** Updates a single `Bot` using its globally unique id and a patch. */
  updateBotById?: Maybe<UpdateBotPayload>;
  /** Updates a single `ChannelBridge` using a unique key and a patch. */
  updateChannelBridge?: Maybe<UpdateChannelBridgePayload>;
  /** Updates a single `ChannelBridge` using its globally unique id and a patch. */
  updateChannelBridgeById?: Maybe<UpdateChannelBridgePayload>;
  /** Updates a single `Chat` using a unique key and a patch. */
  updateChat?: Maybe<UpdateChatPayload>;
  /** Updates a single `Chat` using its globally unique id and a patch. */
  updateChatById?: Maybe<UpdateChatPayload>;
  /** Updates a single `ChatParticipant` using a unique key and a patch. */
  updateChatParticipant?: Maybe<UpdateChatParticipantPayload>;
  /** Updates a single `ChatParticipant` using its globally unique id and a patch. */
  updateChatParticipantById?: Maybe<UpdateChatParticipantPayload>;
  /** Updates a single `FederatedIdentity` using a unique key and a patch. */
  updateFederatedIdentity?: Maybe<UpdateFederatedIdentityPayload>;
  /** Updates a single `FederatedIdentity` using its globally unique id and a patch. */
  updateFederatedIdentityById?: Maybe<UpdateFederatedIdentityPayload>;
  /** Updates a single `IdentityProvider` using a unique key and a patch. */
  updateIdentityProvider?: Maybe<UpdateIdentityProviderPayload>;
  /** Updates a single `IdentityProvider` using its globally unique id and a patch. */
  updateIdentityProviderById?: Maybe<UpdateIdentityProviderPayload>;
  /** Updates a single `Message` using a unique key and a patch. */
  updateMessage?: Maybe<UpdateMessagePayload>;
  /** Updates a single `Message` using its globally unique id and a patch. */
  updateMessageById?: Maybe<UpdateMessagePayload>;
  /** Updates a single `Message` using a unique key and a patch. */
  updateMessageByRowIdAndCreatedAt?: Maybe<UpdateMessagePayload>;
  /** Updates a single `Permission` using a unique key and a patch. */
  updatePermission?: Maybe<UpdatePermissionPayload>;
  /** Updates a single `Permission` using its globally unique id and a patch. */
  updatePermissionById?: Maybe<UpdatePermissionPayload>;
  /** Updates a single `Profile` using a unique key and a patch. */
  updateProfile?: Maybe<UpdateProfilePayload>;
  /** Updates a single `Profile` using its globally unique id and a patch. */
  updateProfileById?: Maybe<UpdateProfilePayload>;
  /** Updates a single `Realm` using a unique key and a patch. */
  updateRealm?: Maybe<UpdateRealmPayload>;
  /** Updates a single `Realm` using its globally unique id and a patch. */
  updateRealmById?: Maybe<UpdateRealmPayload>;
  /** Updates a single `Realm` using a unique key and a patch. */
  updateRealmByName?: Maybe<UpdateRealmPayload>;
  /** Updates a single `Role` using a unique key and a patch. */
  updateRole?: Maybe<UpdateRolePayload>;
  /** Updates a single `Role` using its globally unique id and a patch. */
  updateRoleById?: Maybe<UpdateRolePayload>;
  /** Updates a single `SeaqlMigration` using a unique key and a patch. */
  updateSeaqlMigration?: Maybe<UpdateSeaqlMigrationPayload>;
  /** Updates a single `SeaqlMigration` using its globally unique id and a patch. */
  updateSeaqlMigrationById?: Maybe<UpdateSeaqlMigrationPayload>;
  /** Updates a single `Trip` using a unique key and a patch. */
  updateTrip?: Maybe<UpdateTripPayload>;
  /** Updates a single `Trip` using its globally unique id and a patch. */
  updateTripById?: Maybe<UpdateTripPayload>;
  /** Updates a single `TripCard` using a unique key and a patch. */
  updateTripCard?: Maybe<UpdateTripCardPayload>;
  /** Updates a single `TripCard` using its globally unique id and a patch. */
  updateTripCardById?: Maybe<UpdateTripCardPayload>;
  /** Updates a single `TripCardRichText` using a unique key and a patch. */
  updateTripCardRichText?: Maybe<UpdateTripCardRichTextPayload>;
  /** Updates a single `TripCardRichText` using its globally unique id and a patch. */
  updateTripCardRichTextById?: Maybe<UpdateTripCardRichTextPayload>;
  /** Updates a single `TripCardVote` using a unique key and a patch. */
  updateTripCardVote?: Maybe<UpdateTripCardVotePayload>;
  /** Updates a single `TripCardVote` using its globally unique id and a patch. */
  updateTripCardVoteById?: Maybe<UpdateTripCardVotePayload>;
  /** Updates a single `TripParticipant` using a unique key and a patch. */
  updateTripParticipant?: Maybe<UpdateTripParticipantPayload>;
  /** Updates a single `TripParticipant` using its globally unique id and a patch. */
  updateTripParticipantById?: Maybe<UpdateTripParticipantPayload>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAccountRealmRoleArgs = {
  input: CreateAccountRealmRoleInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateBotArgs = {
  input: CreateBotInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateChannelBridgeArgs = {
  input: CreateChannelBridgeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateChatArgs = {
  input: CreateChatInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateChatParticipantArgs = {
  input: CreateChatParticipantInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateFederatedIdentityArgs = {
  input: CreateFederatedIdentityInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateIdentityProviderArgs = {
  input: CreateIdentityProviderInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePermissionArgs = {
  input: CreatePermissionInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateRealmArgs = {
  input: CreateRealmInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSeaqlMigrationArgs = {
  input: CreateSeaqlMigrationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTripArgs = {
  input: CreateTripInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTripCardArgs = {
  input: CreateTripCardInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTripCardRichTextArgs = {
  input: CreateTripCardRichTextInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTripCardVoteArgs = {
  input: CreateTripCardVoteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTripParticipantArgs = {
  input: CreateTripParticipantInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByEmailArgs = {
  input: DeleteAccountByEmailInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByIdArgs = {
  input: DeleteAccountByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByUsernameArgs = {
  input: DeleteAccountByUsernameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountRealmRoleArgs = {
  input: DeleteAccountRealmRoleInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountRealmRoleByIdArgs = {
  input: DeleteAccountRealmRoleByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteBotArgs = {
  input: DeleteBotInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteBotByIdArgs = {
  input: DeleteBotByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChannelBridgeArgs = {
  input: DeleteChannelBridgeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChannelBridgeByIdArgs = {
  input: DeleteChannelBridgeByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChatArgs = {
  input: DeleteChatInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChatByIdArgs = {
  input: DeleteChatByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChatParticipantArgs = {
  input: DeleteChatParticipantInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChatParticipantByIdArgs = {
  input: DeleteChatParticipantByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFederatedIdentityArgs = {
  input: DeleteFederatedIdentityInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFederatedIdentityByIdArgs = {
  input: DeleteFederatedIdentityByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteIdentityProviderArgs = {
  input: DeleteIdentityProviderInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteIdentityProviderByIdArgs = {
  input: DeleteIdentityProviderByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMessageArgs = {
  input: DeleteMessageInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMessageByIdArgs = {
  input: DeleteMessageByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMessageByRowIdAndCreatedAtArgs = {
  input: DeleteMessageByRowIdAndCreatedAtInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionArgs = {
  input: DeletePermissionInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionByIdArgs = {
  input: DeletePermissionByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProfileArgs = {
  input: DeleteProfileInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProfileByIdArgs = {
  input: DeleteProfileByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRealmArgs = {
  input: DeleteRealmInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRealmByIdArgs = {
  input: DeleteRealmByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRealmByNameArgs = {
  input: DeleteRealmByNameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoleArgs = {
  input: DeleteRoleInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoleByIdArgs = {
  input: DeleteRoleByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeaqlMigrationArgs = {
  input: DeleteSeaqlMigrationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSeaqlMigrationByIdArgs = {
  input: DeleteSeaqlMigrationByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripArgs = {
  input: DeleteTripInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripByIdArgs = {
  input: DeleteTripByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripCardArgs = {
  input: DeleteTripCardInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripCardByIdArgs = {
  input: DeleteTripCardByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripCardRichTextArgs = {
  input: DeleteTripCardRichTextInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripCardRichTextByIdArgs = {
  input: DeleteTripCardRichTextByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripCardVoteArgs = {
  input: DeleteTripCardVoteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripCardVoteByIdArgs = {
  input: DeleteTripCardVoteByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripParticipantArgs = {
  input: DeleteTripParticipantInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTripParticipantByIdArgs = {
  input: DeleteTripParticipantByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByEmailArgs = {
  input: UpdateAccountByEmailInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByIdArgs = {
  input: UpdateAccountByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByUsernameArgs = {
  input: UpdateAccountByUsernameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountRealmRoleArgs = {
  input: UpdateAccountRealmRoleInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountRealmRoleByIdArgs = {
  input: UpdateAccountRealmRoleByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateBotArgs = {
  input: UpdateBotInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateBotByIdArgs = {
  input: UpdateBotByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChannelBridgeArgs = {
  input: UpdateChannelBridgeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChannelBridgeByIdArgs = {
  input: UpdateChannelBridgeByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChatArgs = {
  input: UpdateChatInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChatByIdArgs = {
  input: UpdateChatByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChatParticipantArgs = {
  input: UpdateChatParticipantInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChatParticipantByIdArgs = {
  input: UpdateChatParticipantByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFederatedIdentityArgs = {
  input: UpdateFederatedIdentityInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFederatedIdentityByIdArgs = {
  input: UpdateFederatedIdentityByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateIdentityProviderArgs = {
  input: UpdateIdentityProviderInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateIdentityProviderByIdArgs = {
  input: UpdateIdentityProviderByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMessageArgs = {
  input: UpdateMessageInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMessageByIdArgs = {
  input: UpdateMessageByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMessageByRowIdAndCreatedAtArgs = {
  input: UpdateMessageByRowIdAndCreatedAtInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionArgs = {
  input: UpdatePermissionInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionByIdArgs = {
  input: UpdatePermissionByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileByIdArgs = {
  input: UpdateProfileByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRealmArgs = {
  input: UpdateRealmInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRealmByIdArgs = {
  input: UpdateRealmByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRealmByNameArgs = {
  input: UpdateRealmByNameInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoleByIdArgs = {
  input: UpdateRoleByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeaqlMigrationArgs = {
  input: UpdateSeaqlMigrationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSeaqlMigrationByIdArgs = {
  input: UpdateSeaqlMigrationByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripArgs = {
  input: UpdateTripInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripByIdArgs = {
  input: UpdateTripByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripCardArgs = {
  input: UpdateTripCardInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripCardByIdArgs = {
  input: UpdateTripCardByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripCardRichTextArgs = {
  input: UpdateTripCardRichTextInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripCardRichTextByIdArgs = {
  input: UpdateTripCardRichTextByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripCardVoteArgs = {
  input: UpdateTripCardVoteInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripCardVoteByIdArgs = {
  input: UpdateTripCardVoteByIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripParticipantArgs = {
  input: UpdateTripParticipantInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTripParticipantByIdArgs = {
  input: UpdateTripParticipantByIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type Permission = Node & {
  actions: Array<Maybe<Scalars['String']['output']>>;
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Realm` that is related to this `Permission`. */
  realm?: Maybe<Realm>;
  realmId: Scalars['UUID']['output'];
  resourceType: Scalars['String']['output'];
  /** Reads a single `Role` that is related to this `Permission`. */
  role?: Maybe<Role>;
  roleId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `Permission` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PermissionCondition = {
  /** Checks for equality with the object’s `realmId` field. */
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `resourceType` field. */
  resourceType?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `roleId` field. */
  roleId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Permission` values. */
export type PermissionConnection = {
  /** A list of edges which contains the `Permission` and cursor to aid in pagination. */
  edges: Array<Maybe<PermissionEdge>>;
  /** A list of `Permission` objects. */
  nodes: Array<Maybe<Permission>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Permission` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Permission` edge in the connection. */
export type PermissionEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Permission` at the end of the edge. */
  node?: Maybe<Permission>;
};

/** A filter to be used against `Permission` object types. All fields are combined with a logical ‘and.’ */
export type PermissionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PermissionFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<PermissionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PermissionFilter>>;
  /** Filter by the object’s `realm` relation. */
  realm?: InputMaybe<RealmFilter>;
  /** Filter by the object’s `realmId` field. */
  realmId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `resourceType` field. */
  resourceType?: InputMaybe<StringFilter>;
  /** Filter by the object’s `role` relation. */
  role?: InputMaybe<RoleFilter>;
  /** Filter by the object’s `roleId` field. */
  roleId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Permission` */
export type PermissionInput = {
  actions: Array<InputMaybe<Scalars['String']['input']>>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  realmId: Scalars['UUID']['input'];
  resourceType: Scalars['String']['input'];
  roleId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Methods to use when ordering `Permission`. */
export type PermissionOrderBy =
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'REALM_ID_ASC'
  | 'REALM_ID_DESC'
  | 'RESOURCE_TYPE_ASC'
  | 'RESOURCE_TYPE_DESC'
  | 'ROLE_ID_ASC'
  | 'ROLE_ID_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC';

/** Represents an update to a `Permission`. Fields that are set will be updated. */
export type PermissionPatch = {
  actions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  resourceType?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

export type Profile = Node & {
  /** Reads a single `ChannelBridge` that is related to this `Profile`. */
  channelBridge?: Maybe<ChannelBridge>;
  channelBridgeId?: Maybe<Scalars['UUID']['output']>;
  /** Reads and enables pagination through a set of `ChatParticipant`. */
  chatParticipants: ChatParticipantConnection;
  createdAt: Scalars['Datetime']['output'];
  email: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  phone: Scalars['String']['output'];
  /** Reads a single `Realm` that is related to this `Profile`. */
  realm?: Maybe<Realm>;
  realmId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  thirdId?: Maybe<Scalars['String']['output']>;
  thirdProviderType?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `TripCardVote`. */
  tripCardVotes: TripCardVoteConnection;
  /** Reads and enables pagination through a set of `TripCard`. */
  tripCardsByCreatedBy: TripCardConnection;
  /** Reads and enables pagination through a set of `TripParticipant`. */
  tripParticipants: TripParticipantConnection;
  username: Scalars['String']['output'];
};

export type ProfileChatParticipantsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChatParticipantCondition>;
  filter?: InputMaybe<ChatParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatParticipantOrderBy>>;
};

export type ProfileTripCardVotesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCardVoteCondition>;
  filter?: InputMaybe<TripCardVoteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripCardVoteOrderBy>>;
};

export type ProfileTripCardsByCreatedByArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCardCondition>;
  filter?: InputMaybe<TripCardFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripCardOrderBy>>;
};

export type ProfileTripParticipantsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripParticipantCondition>;
  filter?: InputMaybe<TripParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripParticipantOrderBy>>;
};

/** A condition to be used against `Profile` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProfileCondition = {
  /** Checks for equality with the object’s `realmId` field. */
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Profile` values. */
export type ProfileConnection = {
  /** A list of edges which contains the `Profile` and cursor to aid in pagination. */
  edges: Array<Maybe<ProfileEdge>>;
  /** A list of `Profile` objects. */
  nodes: Array<Maybe<Profile>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Profile` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Profile` edge in the connection. */
export type ProfileEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Profile` at the end of the edge. */
  node?: Maybe<Profile>;
};

/** A filter to be used against `Profile` object types. All fields are combined with a logical ‘and.’ */
export type ProfileFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProfileFilter>>;
  /** Filter by the object’s `channelBridge` relation. */
  channelBridge?: InputMaybe<ChannelBridgeFilter>;
  /** A related `channelBridge` exists. */
  channelBridgeExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `chatParticipants` relation. */
  chatParticipants?: InputMaybe<ProfileToManyChatParticipantFilter>;
  /** Some related `chatParticipants` exist. */
  chatParticipantsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<ProfileFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProfileFilter>>;
  /** Filter by the object’s `realm` relation. */
  realm?: InputMaybe<RealmFilter>;
  /** Filter by the object’s `realmId` field. */
  realmId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `tripCardVotes` relation. */
  tripCardVotes?: InputMaybe<ProfileToManyTripCardVoteFilter>;
  /** Some related `tripCardVotes` exist. */
  tripCardVotesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `tripCardsByCreatedBy` relation. */
  tripCardsByCreatedBy?: InputMaybe<ProfileToManyTripCardFilter>;
  /** Some related `tripCardsByCreatedBy` exist. */
  tripCardsByCreatedByExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `tripParticipants` relation. */
  tripParticipants?: InputMaybe<ProfileToManyTripParticipantFilter>;
  /** Some related `tripParticipants` exist. */
  tripParticipantsExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An input for mutations affecting `Profile` */
export type ProfileInput = {
  channelBridgeId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  phone: Scalars['String']['input'];
  realmId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  thirdId?: InputMaybe<Scalars['String']['input']>;
  thirdProviderType?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

/** Methods to use when ordering `Profile`. */
export type ProfileOrderBy =
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'REALM_ID_ASC'
  | 'REALM_ID_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC';

/** Represents an update to a `Profile`. Fields that are set will be updated. */
export type ProfilePatch = {
  channelBridgeId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  thirdId?: InputMaybe<Scalars['String']['input']>;
  thirdProviderType?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against many `ChatParticipant` object types. All fields are combined with a logical ‘and.’ */
export type ProfileToManyChatParticipantFilter = {
  /** Every related `ChatParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ChatParticipantFilter>;
  /** No related `ChatParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ChatParticipantFilter>;
  /** Some related `ChatParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ChatParticipantFilter>;
};

/** A filter to be used against many `TripCard` object types. All fields are combined with a logical ‘and.’ */
export type ProfileToManyTripCardFilter = {
  /** Every related `TripCard` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TripCardFilter>;
  /** No related `TripCard` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TripCardFilter>;
  /** Some related `TripCard` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TripCardFilter>;
};

/** A filter to be used against many `TripCardVote` object types. All fields are combined with a logical ‘and.’ */
export type ProfileToManyTripCardVoteFilter = {
  /** Every related `TripCardVote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TripCardVoteFilter>;
  /** No related `TripCardVote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TripCardVoteFilter>;
  /** Some related `TripCardVote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TripCardVoteFilter>;
};

/** A filter to be used against many `TripParticipant` object types. All fields are combined with a logical ‘and.’ */
export type ProfileToManyTripParticipantFilter = {
  /** Every related `TripParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TripParticipantFilter>;
  /** No related `TripParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TripParticipantFilter>;
  /** Some related `TripParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TripParticipantFilter>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  /** Get a single `Account`. */
  account?: Maybe<Account>;
  /** Get a single `Account`. */
  accountByEmail?: Maybe<Account>;
  /** Reads a single `Account` using its globally unique `ID`. */
  accountById?: Maybe<Account>;
  /** Get a single `Account`. */
  accountByUsername?: Maybe<Account>;
  /** Get a single `AccountRealmRole`. */
  accountRealmRole?: Maybe<AccountRealmRole>;
  /** Reads a single `AccountRealmRole` using its globally unique `ID`. */
  accountRealmRoleById?: Maybe<AccountRealmRole>;
  /** Reads and enables pagination through a set of `AccountRealmRole`. */
  accountRealmRoles?: Maybe<AccountRealmRoleConnection>;
  /** Reads and enables pagination through a set of `Account`. */
  accounts?: Maybe<AccountConnection>;
  /** Get a single `Bot`. */
  bot?: Maybe<Bot>;
  /** Reads a single `Bot` using its globally unique `ID`. */
  botById?: Maybe<Bot>;
  /** Reads and enables pagination through a set of `Bot`. */
  bots?: Maybe<BotConnection>;
  /** Get a single `ChannelBridge`. */
  channelBridge?: Maybe<ChannelBridge>;
  /** Reads a single `ChannelBridge` using its globally unique `ID`. */
  channelBridgeById?: Maybe<ChannelBridge>;
  /** Reads and enables pagination through a set of `ChannelBridge`. */
  channelBridges?: Maybe<ChannelBridgeConnection>;
  /** Get a single `Chat`. */
  chat?: Maybe<Chat>;
  /** Reads a single `Chat` using its globally unique `ID`. */
  chatById?: Maybe<Chat>;
  /** Get a single `ChatParticipant`. */
  chatParticipant?: Maybe<ChatParticipant>;
  /** Reads a single `ChatParticipant` using its globally unique `ID`. */
  chatParticipantById?: Maybe<ChatParticipant>;
  /** Reads and enables pagination through a set of `ChatParticipant`. */
  chatParticipants?: Maybe<ChatParticipantConnection>;
  /** Reads and enables pagination through a set of `Chat`. */
  chats?: Maybe<ChatConnection>;
  /** Reads and enables pagination through a set of `FederatedIdentity`. */
  federatedIdentities?: Maybe<FederatedIdentityConnection>;
  /** Get a single `FederatedIdentity`. */
  federatedIdentity?: Maybe<FederatedIdentity>;
  /** Reads a single `FederatedIdentity` using its globally unique `ID`. */
  federatedIdentityById?: Maybe<FederatedIdentity>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  id: Scalars['ID']['output'];
  /** Get a single `IdentityProvider`. */
  identityProvider?: Maybe<IdentityProvider>;
  /** Reads a single `IdentityProvider` using its globally unique `ID`. */
  identityProviderById?: Maybe<IdentityProvider>;
  /** Reads and enables pagination through a set of `IdentityProvider`. */
  identityProviders?: Maybe<IdentityProviderConnection>;
  /** Get a single `Message`. */
  message?: Maybe<Message>;
  /** Reads a single `Message` using its globally unique `ID`. */
  messageById?: Maybe<Message>;
  /** Get a single `Message`. */
  messageByRowIdAndCreatedAt?: Maybe<Message>;
  /** Reads and enables pagination through a set of `Message`. */
  messages?: Maybe<MessageConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Get a single `Permission`. */
  permission?: Maybe<Permission>;
  /** Reads a single `Permission` using its globally unique `ID`. */
  permissionById?: Maybe<Permission>;
  /** Reads and enables pagination through a set of `Permission`. */
  permissions?: Maybe<PermissionConnection>;
  /** Get a single `Profile`. */
  profile?: Maybe<Profile>;
  /** Reads a single `Profile` using its globally unique `ID`. */
  profileById?: Maybe<Profile>;
  /** Reads and enables pagination through a set of `Profile`. */
  profiles?: Maybe<ProfileConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Get a single `Realm`. */
  realm?: Maybe<Realm>;
  /** Reads a single `Realm` using its globally unique `ID`. */
  realmById?: Maybe<Realm>;
  /** Get a single `Realm`. */
  realmByName?: Maybe<Realm>;
  /** Reads and enables pagination through a set of `Realm`. */
  realms?: Maybe<RealmConnection>;
  /** Get a single `Role`. */
  role?: Maybe<Role>;
  /** Reads a single `Role` using its globally unique `ID`. */
  roleById?: Maybe<Role>;
  /** Reads and enables pagination through a set of `Role`. */
  roles?: Maybe<RoleConnection>;
  /** Get a single `SeaqlMigration`. */
  seaqlMigration?: Maybe<SeaqlMigration>;
  /** Reads a single `SeaqlMigration` using its globally unique `ID`. */
  seaqlMigrationById?: Maybe<SeaqlMigration>;
  /** Reads and enables pagination through a set of `SeaqlMigration`. */
  seaqlMigrations?: Maybe<SeaqlMigrationConnection>;
  /** Get a single `Trip`. */
  trip?: Maybe<Trip>;
  /** Reads a single `Trip` using its globally unique `ID`. */
  tripById?: Maybe<Trip>;
  /** Get a single `TripCard`. */
  tripCard?: Maybe<TripCard>;
  /** Reads a single `TripCard` using its globally unique `ID`. */
  tripCardById?: Maybe<TripCard>;
  /** Get a single `TripCardRichText`. */
  tripCardRichText?: Maybe<TripCardRichText>;
  /** Reads a single `TripCardRichText` using its globally unique `ID`. */
  tripCardRichTextById?: Maybe<TripCardRichText>;
  /** Reads and enables pagination through a set of `TripCardRichText`. */
  tripCardRichTexts?: Maybe<TripCardRichTextConnection>;
  /** Get a single `TripCardVote`. */
  tripCardVote?: Maybe<TripCardVote>;
  /** Reads a single `TripCardVote` using its globally unique `ID`. */
  tripCardVoteById?: Maybe<TripCardVote>;
  /** Reads and enables pagination through a set of `TripCardVote`. */
  tripCardVotes?: Maybe<TripCardVoteConnection>;
  /** Reads and enables pagination through a set of `TripCard`. */
  tripCards?: Maybe<TripCardConnection>;
  /** Get a single `TripParticipant`. */
  tripParticipant?: Maybe<TripParticipant>;
  /** Reads a single `TripParticipant` using its globally unique `ID`. */
  tripParticipantById?: Maybe<TripParticipant>;
  /** Reads and enables pagination through a set of `TripParticipant`. */
  tripParticipants?: Maybe<TripParticipantConnection>;
  /** Reads and enables pagination through a set of `Trip`. */
  trips?: Maybe<TripConnection>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountByEmailArgs = {
  email: Scalars['String']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountByUsernameArgs = {
  username: Scalars['String']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountRealmRoleArgs = {
  accountId: Scalars['UUID']['input'];
  realmId: Scalars['UUID']['input'];
  roleId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountRealmRoleByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountRealmRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AccountRealmRoleCondition>;
  filter?: InputMaybe<AccountRealmRoleFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountRealmRoleOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAccountsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AccountCondition>;
  filter?: InputMaybe<AccountFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryBotArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryBotByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryBotsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<BotCondition>;
  filter?: InputMaybe<BotFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BotOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryChannelBridgeArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryChannelBridgeByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryChannelBridgesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChannelBridgeCondition>;
  filter?: InputMaybe<ChannelBridgeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChannelBridgeOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryChatArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryChatByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryChatParticipantArgs = {
  chatId: Scalars['UUID']['input'];
  profileId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryChatParticipantByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryChatParticipantsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChatParticipantCondition>;
  filter?: InputMaybe<ChatParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatParticipantOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryChatsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChatCondition>;
  filter?: InputMaybe<ChatFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryFederatedIdentitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<FederatedIdentityCondition>;
  filter?: InputMaybe<FederatedIdentityFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FederatedIdentityOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryFederatedIdentityArgs = {
  accountId: Scalars['UUID']['input'];
  identityProviderId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryFederatedIdentityByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryIdentityProviderArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryIdentityProviderByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryIdentityProvidersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<IdentityProviderCondition>;
  filter?: InputMaybe<IdentityProviderFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<IdentityProviderOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryMessageArgs = {
  chatId: Scalars['UUID']['input'];
  createdAt: Scalars['Datetime']['input'];
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryMessageByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryMessageByRowIdAndCreatedAtArgs = {
  createdAt: Scalars['Datetime']['input'];
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryMessagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MessageCondition>;
  filter?: InputMaybe<MessageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MessageOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPermissionArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPermissionByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPermissionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PermissionCondition>;
  filter?: InputMaybe<PermissionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryProfileArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryProfileByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProfileCondition>;
  filter?: InputMaybe<ProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProfileOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryRealmArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryRealmByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryRealmByNameArgs = {
  name: Scalars['String']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryRealmsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<RealmCondition>;
  filter?: InputMaybe<RealmFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RealmOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryRoleArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryRoleByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<RoleCondition>;
  filter?: InputMaybe<RoleFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RoleOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QuerySeaqlMigrationArgs = {
  version: Scalars['String']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QuerySeaqlMigrationByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QuerySeaqlMigrationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SeaqlMigrationCondition>;
  filter?: InputMaybe<SeaqlMigrationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SeaqlMigrationOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTripArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardArgs = {
  rowId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardRichTextArgs = {
  tripCardId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardRichTextByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardRichTextsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCardRichTextCondition>;
  filter?: InputMaybe<TripCardRichTextFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripCardRichTextOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardVoteArgs = {
  profileId: Scalars['UUID']['input'];
  tripCardId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardVoteByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardVotesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCardVoteCondition>;
  filter?: InputMaybe<TripCardVoteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripCardVoteOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTripCardsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCardCondition>;
  filter?: InputMaybe<TripCardFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripCardOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTripParticipantArgs = {
  profileId: Scalars['UUID']['input'];
  tripId: Scalars['UUID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripParticipantByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryTripParticipantsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripParticipantCondition>;
  filter?: InputMaybe<TripParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripParticipantOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryTripsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCondition>;
  filter?: InputMaybe<TripFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripOrderBy>>;
};

export type Realm = Node & {
  /** Reads and enables pagination through a set of `AccountRealmRole`. */
  accountRealmRoles: AccountRealmRoleConnection;
  /** Reads and enables pagination through a set of `Bot`. */
  bots: BotConnection;
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `IdentityProvider`. */
  identityProviders: IdentityProviderConnection;
  isActive: Scalars['Boolean']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Permission`. */
  permissions: PermissionConnection;
  /** Reads and enables pagination through a set of `Profile`. */
  profiles: ProfileConnection;
  /** Reads and enables pagination through a set of `Role`. */
  roles: RoleConnection;
  rowId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `Trip`. */
  trips: TripConnection;
  updatedAt: Scalars['Datetime']['output'];
};

export type RealmAccountRealmRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AccountRealmRoleCondition>;
  filter?: InputMaybe<AccountRealmRoleFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountRealmRoleOrderBy>>;
};

export type RealmBotsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<BotCondition>;
  filter?: InputMaybe<BotFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BotOrderBy>>;
};

export type RealmIdentityProvidersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<IdentityProviderCondition>;
  filter?: InputMaybe<IdentityProviderFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<IdentityProviderOrderBy>>;
};

export type RealmPermissionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PermissionCondition>;
  filter?: InputMaybe<PermissionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOrderBy>>;
};

export type RealmProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProfileCondition>;
  filter?: InputMaybe<ProfileFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProfileOrderBy>>;
};

export type RealmRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<RoleCondition>;
  filter?: InputMaybe<RoleFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RoleOrderBy>>;
};

export type RealmTripsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCondition>;
  filter?: InputMaybe<TripFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripOrderBy>>;
};

/** A condition to be used against `Realm` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type RealmCondition = {
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Realm` values. */
export type RealmConnection = {
  /** A list of edges which contains the `Realm` and cursor to aid in pagination. */
  edges: Array<Maybe<RealmEdge>>;
  /** A list of `Realm` objects. */
  nodes: Array<Maybe<Realm>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Realm` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Realm` edge in the connection. */
export type RealmEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Realm` at the end of the edge. */
  node?: Maybe<Realm>;
};

/** A filter to be used against `Realm` object types. All fields are combined with a logical ‘and.’ */
export type RealmFilter = {
  /** Filter by the object’s `accountRealmRoles` relation. */
  accountRealmRoles?: InputMaybe<RealmToManyAccountRealmRoleFilter>;
  /** Some related `accountRealmRoles` exist. */
  accountRealmRolesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<RealmFilter>>;
  /** Filter by the object’s `bots` relation. */
  bots?: InputMaybe<RealmToManyBotFilter>;
  /** Some related `bots` exist. */
  botsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `identityProviders` relation. */
  identityProviders?: InputMaybe<RealmToManyIdentityProviderFilter>;
  /** Some related `identityProviders` exist. */
  identityProvidersExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<RealmFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<RealmFilter>>;
  /** Filter by the object’s `permissions` relation. */
  permissions?: InputMaybe<RealmToManyPermissionFilter>;
  /** Some related `permissions` exist. */
  permissionsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `profiles` relation. */
  profiles?: InputMaybe<RealmToManyProfileFilter>;
  /** Some related `profiles` exist. */
  profilesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `roles` relation. */
  roles?: InputMaybe<RealmToManyRoleFilter>;
  /** Some related `roles` exist. */
  rolesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `trips` relation. */
  trips?: InputMaybe<RealmToManyTripFilter>;
  /** Some related `trips` exist. */
  tripsExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An input for mutations affecting `Realm` */
export type RealmInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Realm`. */
export type RealmOrderBy =
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC';

/** Represents an update to a `Realm`. Fields that are set will be updated. */
export type RealmPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `AccountRealmRole` object types. All fields are combined with a logical ‘and.’ */
export type RealmToManyAccountRealmRoleFilter = {
  /** Every related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AccountRealmRoleFilter>;
  /** No related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AccountRealmRoleFilter>;
  /** Some related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AccountRealmRoleFilter>;
};

/** A filter to be used against many `Bot` object types. All fields are combined with a logical ‘and.’ */
export type RealmToManyBotFilter = {
  /** Every related `Bot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<BotFilter>;
  /** No related `Bot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<BotFilter>;
  /** Some related `Bot` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<BotFilter>;
};

/** A filter to be used against many `IdentityProvider` object types. All fields are combined with a logical ‘and.’ */
export type RealmToManyIdentityProviderFilter = {
  /** Every related `IdentityProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<IdentityProviderFilter>;
  /** No related `IdentityProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<IdentityProviderFilter>;
  /** Some related `IdentityProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<IdentityProviderFilter>;
};

/** A filter to be used against many `Permission` object types. All fields are combined with a logical ‘and.’ */
export type RealmToManyPermissionFilter = {
  /** Every related `Permission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PermissionFilter>;
  /** No related `Permission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PermissionFilter>;
  /** Some related `Permission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PermissionFilter>;
};

/** A filter to be used against many `Profile` object types. All fields are combined with a logical ‘and.’ */
export type RealmToManyProfileFilter = {
  /** Every related `Profile` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProfileFilter>;
  /** No related `Profile` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProfileFilter>;
  /** Some related `Profile` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProfileFilter>;
};

/** A filter to be used against many `Role` object types. All fields are combined with a logical ‘and.’ */
export type RealmToManyRoleFilter = {
  /** Every related `Role` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<RoleFilter>;
  /** No related `Role` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<RoleFilter>;
  /** Some related `Role` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<RoleFilter>;
};

/** A filter to be used against many `Trip` object types. All fields are combined with a logical ‘and.’ */
export type RealmToManyTripFilter = {
  /** Every related `Trip` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TripFilter>;
  /** No related `Trip` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TripFilter>;
  /** Some related `Trip` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TripFilter>;
};

export type Role = Node & {
  /** Reads and enables pagination through a set of `AccountRealmRole`. */
  accountRealmRoles: AccountRealmRoleConnection;
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Permission`. */
  permissions: PermissionConnection;
  /** Reads a single `Realm` that is related to this `Role`. */
  realm?: Maybe<Realm>;
  realmId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
};

export type RoleAccountRealmRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AccountRealmRoleCondition>;
  filter?: InputMaybe<AccountRealmRoleFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountRealmRoleOrderBy>>;
};

export type RolePermissionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PermissionCondition>;
  filter?: InputMaybe<PermissionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PermissionOrderBy>>;
};

/** A condition to be used against `Role` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type RoleCondition = {
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `realmId` field. */
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Role` values. */
export type RoleConnection = {
  /** A list of edges which contains the `Role` and cursor to aid in pagination. */
  edges: Array<Maybe<RoleEdge>>;
  /** A list of `Role` objects. */
  nodes: Array<Maybe<Role>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Role` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Role` edge in the connection. */
export type RoleEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Role` at the end of the edge. */
  node?: Maybe<Role>;
};

/** A filter to be used against `Role` object types. All fields are combined with a logical ‘and.’ */
export type RoleFilter = {
  /** Filter by the object’s `accountRealmRoles` relation. */
  accountRealmRoles?: InputMaybe<RoleToManyAccountRealmRoleFilter>;
  /** Some related `accountRealmRoles` exist. */
  accountRealmRolesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<RoleFilter>>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<RoleFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<RoleFilter>>;
  /** Filter by the object’s `permissions` relation. */
  permissions?: InputMaybe<RoleToManyPermissionFilter>;
  /** Some related `permissions` exist. */
  permissionsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `realm` relation. */
  realm?: InputMaybe<RealmFilter>;
  /** Filter by the object’s `realmId` field. */
  realmId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Role` */
export type RoleInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  realmId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Methods to use when ordering `Role`. */
export type RoleOrderBy =
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'REALM_ID_ASC'
  | 'REALM_ID_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC';

/** Represents an update to a `Role`. Fields that are set will be updated. */
export type RolePatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A filter to be used against many `AccountRealmRole` object types. All fields are combined with a logical ‘and.’ */
export type RoleToManyAccountRealmRoleFilter = {
  /** Every related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AccountRealmRoleFilter>;
  /** No related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AccountRealmRoleFilter>;
  /** Some related `AccountRealmRole` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AccountRealmRoleFilter>;
};

/** A filter to be used against many `Permission` object types. All fields are combined with a logical ‘and.’ */
export type RoleToManyPermissionFilter = {
  /** Every related `Permission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PermissionFilter>;
  /** No related `Permission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PermissionFilter>;
  /** Some related `Permission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PermissionFilter>;
};

export type SeaqlMigration = Node & {
  appliedAt: Scalars['BigInt']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  version: Scalars['String']['output'];
};

/**
 * A condition to be used against `SeaqlMigration` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SeaqlMigrationCondition = {
  /** Checks for equality with the object’s `version` field. */
  version?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `SeaqlMigration` values. */
export type SeaqlMigrationConnection = {
  /** A list of edges which contains the `SeaqlMigration` and cursor to aid in pagination. */
  edges: Array<Maybe<SeaqlMigrationEdge>>;
  /** A list of `SeaqlMigration` objects. */
  nodes: Array<Maybe<SeaqlMigration>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SeaqlMigration` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `SeaqlMigration` edge in the connection. */
export type SeaqlMigrationEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SeaqlMigration` at the end of the edge. */
  node?: Maybe<SeaqlMigration>;
};

/** A filter to be used against `SeaqlMigration` object types. All fields are combined with a logical ‘and.’ */
export type SeaqlMigrationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SeaqlMigrationFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<SeaqlMigrationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SeaqlMigrationFilter>>;
  /** Filter by the object’s `version` field. */
  version?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `SeaqlMigration` */
export type SeaqlMigrationInput = {
  appliedAt: Scalars['BigInt']['input'];
  version: Scalars['String']['input'];
};

/** Methods to use when ordering `SeaqlMigration`. */
export type SeaqlMigrationOrderBy = 'NATURAL' | 'PRIMARY_KEY_ASC' | 'PRIMARY_KEY_DESC' | 'VERSION_ASC' | 'VERSION_DESC';

/** Represents an update to a `SeaqlMigration`. Fields that are set will be updated. */
export type SeaqlMigrationPatch = {
  appliedAt?: InputMaybe<Scalars['BigInt']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

export type Trip = Node & {
  createdAt: Scalars['Datetime']['output'];
  createdBy: Scalars['UUID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['Date']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Reads a single `Profile` that is related to this `Trip`. */
  profile?: Maybe<Profile>;
  /** Reads a single `Realm` that is related to this `Trip`. */
  realm?: Maybe<Realm>;
  realmId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  startDate?: Maybe<Scalars['Date']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `TripCard`. */
  tripCards: TripCardConnection;
  /** Reads and enables pagination through a set of `TripParticipant`. */
  tripParticipants: TripParticipantConnection;
  updatedAt: Scalars['Datetime']['output'];
};

export type TripTripCardsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCardCondition>;
  filter?: InputMaybe<TripCardFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripCardOrderBy>>;
};

export type TripTripParticipantsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripParticipantCondition>;
  filter?: InputMaybe<TripParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripParticipantOrderBy>>;
};

export type TripCard = Node & {
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Datetime']['output'];
  createdBy: Scalars['UUID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  displayOrder?: Maybe<Scalars['Int']['output']>;
  endTime?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Reads a single `Profile` that is related to this `TripCard`. */
  profile?: Maybe<Profile>;
  rowId: Scalars['UUID']['output'];
  startTime?: Maybe<Scalars['Datetime']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  /** Reads a single `Trip` that is related to this `TripCard`. */
  trip?: Maybe<Trip>;
  /** Reads a single `TripCardRichText` that is related to this `TripCard`. */
  tripCardRichText?: Maybe<TripCardRichText>;
  /** Reads and enables pagination through a set of `TripCardVote`. */
  tripCardVotes: TripCardVoteConnection;
  tripId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  voteCount: Scalars['Int']['output'];
  voteData?: Maybe<Scalars['JSON']['output']>;
};

export type TripCardTripCardVotesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TripCardVoteCondition>;
  filter?: InputMaybe<TripCardVoteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TripCardVoteOrderBy>>;
};

/**
 * A condition to be used against `TripCard` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TripCardCondition = {
  /** Checks for equality with the object’s `createdBy` field. */
  createdBy?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `startTime` field. */
  startTime?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `tripId` field. */
  tripId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `TripCard` values. */
export type TripCardConnection = {
  /** A list of edges which contains the `TripCard` and cursor to aid in pagination. */
  edges: Array<Maybe<TripCardEdge>>;
  /** A list of `TripCard` objects. */
  nodes: Array<Maybe<TripCard>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TripCard` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TripCard` edge in the connection. */
export type TripCardEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TripCard` at the end of the edge. */
  node?: Maybe<TripCard>;
};

/** A filter to be used against `TripCard` object types. All fields are combined with a logical ‘and.’ */
export type TripCardFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TripCardFilter>>;
  /** Filter by the object’s `createdBy` field. */
  createdBy?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TripCardFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TripCardFilter>>;
  /** Filter by the object’s `profile` relation. */
  profile?: InputMaybe<ProfileFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `startTime` field. */
  startTime?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<StringFilter>;
  /** Filter by the object’s `trip` relation. */
  trip?: InputMaybe<TripFilter>;
  /** Filter by the object’s `tripCardRichText` relation. */
  tripCardRichText?: InputMaybe<TripCardRichTextFilter>;
  /** A related `tripCardRichText` exists. */
  tripCardRichTextExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `tripCardVotes` relation. */
  tripCardVotes?: InputMaybe<TripCardToManyTripCardVoteFilter>;
  /** Some related `tripCardVotes` exist. */
  tripCardVotesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `tripId` field. */
  tripId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `TripCard` */
export type TripCardInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdBy: Scalars['UUID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  endTime?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  startTime?: InputMaybe<Scalars['Datetime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  tripId: Scalars['UUID']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  voteCount?: InputMaybe<Scalars['Int']['input']>;
  voteData?: InputMaybe<Scalars['JSON']['input']>;
};

/** Methods to use when ordering `TripCard`. */
export type TripCardOrderBy =
  | 'CREATED_BY_ASC'
  | 'CREATED_BY_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC'
  | 'START_TIME_ASC'
  | 'START_TIME_DESC'
  | 'STATUS_ASC'
  | 'STATUS_DESC'
  | 'TRIP_ID_ASC'
  | 'TRIP_ID_DESC';

/** Represents an update to a `TripCard`. Fields that are set will be updated. */
export type TripCardPatch = {
  category?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdBy?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  endTime?: InputMaybe<Scalars['Datetime']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  startTime?: InputMaybe<Scalars['Datetime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  tripId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  voteCount?: InputMaybe<Scalars['Int']['input']>;
  voteData?: InputMaybe<Scalars['JSON']['input']>;
};

export type TripCardRichText = Node & {
  content: Scalars['JSON']['output'];
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  lastEditedBy?: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `Profile` that is related to this `TripCardRichText`. */
  profile?: Maybe<Profile>;
  /** Reads a single `TripCard` that is related to this `TripCardRichText`. */
  tripCard?: Maybe<TripCard>;
  tripCardId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `TripCardRichText` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TripCardRichTextCondition = {
  /** Checks for equality with the object’s `tripCardId` field. */
  tripCardId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `TripCardRichText` values. */
export type TripCardRichTextConnection = {
  /** A list of edges which contains the `TripCardRichText` and cursor to aid in pagination. */
  edges: Array<Maybe<TripCardRichTextEdge>>;
  /** A list of `TripCardRichText` objects. */
  nodes: Array<Maybe<TripCardRichText>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TripCardRichText` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TripCardRichText` edge in the connection. */
export type TripCardRichTextEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TripCardRichText` at the end of the edge. */
  node?: Maybe<TripCardRichText>;
};

/** A filter to be used against `TripCardRichText` object types. All fields are combined with a logical ‘and.’ */
export type TripCardRichTextFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TripCardRichTextFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<TripCardRichTextFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TripCardRichTextFilter>>;
  /** Filter by the object’s `profile` relation. */
  profile?: InputMaybe<ProfileFilter>;
  /** A related `profile` exists. */
  profileExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `tripCard` relation. */
  tripCard?: InputMaybe<TripCardFilter>;
  /** Filter by the object’s `tripCardId` field. */
  tripCardId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `TripCardRichText` */
export type TripCardRichTextInput = {
  content: Scalars['JSON']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  lastEditedBy?: InputMaybe<Scalars['UUID']['input']>;
  tripCardId: Scalars['UUID']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `TripCardRichText`. */
export type TripCardRichTextOrderBy =
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'TRIP_CARD_ID_ASC'
  | 'TRIP_CARD_ID_DESC';

/** Represents an update to a `TripCardRichText`. Fields that are set will be updated. */
export type TripCardRichTextPatch = {
  content?: InputMaybe<Scalars['JSON']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  lastEditedBy?: InputMaybe<Scalars['UUID']['input']>;
  tripCardId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `TripCardVote` object types. All fields are combined with a logical ‘and.’ */
export type TripCardToManyTripCardVoteFilter = {
  /** Every related `TripCardVote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TripCardVoteFilter>;
  /** No related `TripCardVote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TripCardVoteFilter>;
  /** Some related `TripCardVote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TripCardVoteFilter>;
};

export type TripCardVote = Node & {
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Profile` that is related to this `TripCardVote`. */
  profile?: Maybe<Profile>;
  profileId: Scalars['UUID']['output'];
  /** Reads a single `TripCard` that is related to this `TripCardVote`. */
  tripCard?: Maybe<TripCard>;
  tripCardId: Scalars['UUID']['output'];
  voteType: Scalars['String']['output'];
};

/**
 * A condition to be used against `TripCardVote` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TripCardVoteCondition = {
  /** Checks for equality with the object’s `profileId` field. */
  profileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `tripCardId` field. */
  tripCardId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `TripCardVote` values. */
export type TripCardVoteConnection = {
  /** A list of edges which contains the `TripCardVote` and cursor to aid in pagination. */
  edges: Array<Maybe<TripCardVoteEdge>>;
  /** A list of `TripCardVote` objects. */
  nodes: Array<Maybe<TripCardVote>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TripCardVote` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TripCardVote` edge in the connection. */
export type TripCardVoteEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TripCardVote` at the end of the edge. */
  node?: Maybe<TripCardVote>;
};

/** A filter to be used against `TripCardVote` object types. All fields are combined with a logical ‘and.’ */
export type TripCardVoteFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TripCardVoteFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<TripCardVoteFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TripCardVoteFilter>>;
  /** Filter by the object’s `profile` relation. */
  profile?: InputMaybe<ProfileFilter>;
  /** Filter by the object’s `profileId` field. */
  profileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `tripCard` relation. */
  tripCard?: InputMaybe<TripCardFilter>;
  /** Filter by the object’s `tripCardId` field. */
  tripCardId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `TripCardVote` */
export type TripCardVoteInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  profileId: Scalars['UUID']['input'];
  tripCardId: Scalars['UUID']['input'];
  voteType?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `TripCardVote`. */
export type TripCardVoteOrderBy =
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'PROFILE_ID_ASC'
  | 'PROFILE_ID_DESC'
  | 'TRIP_CARD_ID_ASC'
  | 'TRIP_CARD_ID_DESC';

/** Represents an update to a `TripCardVote`. Fields that are set will be updated. */
export type TripCardVotePatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  profileId?: InputMaybe<Scalars['UUID']['input']>;
  tripCardId?: InputMaybe<Scalars['UUID']['input']>;
  voteType?: InputMaybe<Scalars['String']['input']>;
};

/** A condition to be used against `Trip` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TripCondition = {
  /** Checks for equality with the object’s `endDate` field. */
  endDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `realmId` field. */
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `startDate` field. */
  startDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Trip` values. */
export type TripConnection = {
  /** A list of edges which contains the `Trip` and cursor to aid in pagination. */
  edges: Array<Maybe<TripEdge>>;
  /** A list of `Trip` objects. */
  nodes: Array<Maybe<Trip>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Trip` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Trip` edge in the connection. */
export type TripEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Trip` at the end of the edge. */
  node?: Maybe<Trip>;
};

/** A filter to be used against `Trip` object types. All fields are combined with a logical ‘and.’ */
export type TripFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TripFilter>>;
  /** Filter by the object’s `endDate` field. */
  endDate?: InputMaybe<DateFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TripFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TripFilter>>;
  /** Filter by the object’s `profile` relation. */
  profile?: InputMaybe<ProfileFilter>;
  /** Filter by the object’s `realm` relation. */
  realm?: InputMaybe<RealmFilter>;
  /** Filter by the object’s `realmId` field. */
  realmId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `startDate` field. */
  startDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tripCards` relation. */
  tripCards?: InputMaybe<TripToManyTripCardFilter>;
  /** Some related `tripCards` exist. */
  tripCardsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `tripParticipants` relation. */
  tripParticipants?: InputMaybe<TripToManyTripParticipantFilter>;
  /** Some related `tripParticipants` exist. */
  tripParticipantsExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An input for mutations affecting `Trip` */
export type TripInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdBy: Scalars['UUID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  realmId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Trip`. */
export type TripOrderBy =
  | 'END_DATE_ASC'
  | 'END_DATE_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'REALM_ID_ASC'
  | 'REALM_ID_DESC'
  | 'ROW_ID_ASC'
  | 'ROW_ID_DESC'
  | 'START_DATE_ASC'
  | 'START_DATE_DESC'
  | 'STATUS_ASC'
  | 'STATUS_DESC';

export type TripParticipant = Node & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  joinedAt: Scalars['Datetime']['output'];
  /** Reads a single `Profile` that is related to this `TripParticipant`. */
  profile?: Maybe<Profile>;
  profileId: Scalars['UUID']['output'];
  role: Scalars['String']['output'];
  /** Reads a single `Trip` that is related to this `TripParticipant`. */
  trip?: Maybe<Trip>;
  tripId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `TripParticipant` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TripParticipantCondition = {
  /** Checks for equality with the object’s `profileId` field. */
  profileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `tripId` field. */
  tripId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `TripParticipant` values. */
export type TripParticipantConnection = {
  /** A list of edges which contains the `TripParticipant` and cursor to aid in pagination. */
  edges: Array<Maybe<TripParticipantEdge>>;
  /** A list of `TripParticipant` objects. */
  nodes: Array<Maybe<TripParticipant>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TripParticipant` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TripParticipant` edge in the connection. */
export type TripParticipantEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TripParticipant` at the end of the edge. */
  node?: Maybe<TripParticipant>;
};

/** A filter to be used against `TripParticipant` object types. All fields are combined with a logical ‘and.’ */
export type TripParticipantFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TripParticipantFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<TripParticipantFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TripParticipantFilter>>;
  /** Filter by the object’s `profile` relation. */
  profile?: InputMaybe<ProfileFilter>;
  /** Filter by the object’s `profileId` field. */
  profileId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `trip` relation. */
  trip?: InputMaybe<TripFilter>;
  /** Filter by the object’s `tripId` field. */
  tripId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `TripParticipant` */
export type TripParticipantInput = {
  joinedAt?: InputMaybe<Scalars['Datetime']['input']>;
  profileId: Scalars['UUID']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  tripId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `TripParticipant`. */
export type TripParticipantOrderBy =
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'PROFILE_ID_ASC'
  | 'PROFILE_ID_DESC'
  | 'TRIP_ID_ASC'
  | 'TRIP_ID_DESC';

/** Represents an update to a `TripParticipant`. Fields that are set will be updated. */
export type TripParticipantPatch = {
  joinedAt?: InputMaybe<Scalars['Datetime']['input']>;
  profileId?: InputMaybe<Scalars['UUID']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  tripId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Represents an update to a `Trip`. Fields that are set will be updated. */
export type TripPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdBy?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['Date']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  realmId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `TripCard` object types. All fields are combined with a logical ‘and.’ */
export type TripToManyTripCardFilter = {
  /** Every related `TripCard` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TripCardFilter>;
  /** No related `TripCard` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TripCardFilter>;
  /** Some related `TripCard` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TripCardFilter>;
};

/** A filter to be used against many `TripParticipant` object types. All fields are combined with a logical ‘and.’ */
export type TripToManyTripParticipantFilter = {
  /** Every related `TripParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TripParticipantFilter>;
  /** No related `TripParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TripParticipantFilter>;
  /** Some related `TripParticipant` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TripParticipantFilter>;
};

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

/** All input for the `updateAccountByEmail` mutation. */
export type UpdateAccountByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
};

/** All input for the `updateAccountById` mutation. */
export type UpdateAccountByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Account` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
};

/** All input for the `updateAccountByUsername` mutation. */
export type UpdateAccountByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
  username: Scalars['String']['input'];
};

/** All input for the `updateAccount` mutation. */
export type UpdateAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Account` being updated. */
  patch: AccountPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Account` mutation. */
export type UpdateAccountPayload = {
  /** The `Account` that was updated by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Account` mutation. */
export type UpdateAccountPayloadAccountEdgeArgs = {
  orderBy?: Array<AccountOrderBy>;
};

/** All input for the `updateAccountRealmRoleById` mutation. */
export type UpdateAccountRealmRoleByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `AccountRealmRole` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `AccountRealmRole` being updated. */
  patch: AccountRealmRolePatch;
};

/** All input for the `updateAccountRealmRole` mutation. */
export type UpdateAccountRealmRoleInput = {
  accountId: Scalars['UUID']['input'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `AccountRealmRole` being updated. */
  patch: AccountRealmRolePatch;
  realmId: Scalars['UUID']['input'];
  roleId: Scalars['UUID']['input'];
};

/** The output of our update `AccountRealmRole` mutation. */
export type UpdateAccountRealmRolePayload = {
  /** The `AccountRealmRole` that was updated by this mutation. */
  accountRealmRole?: Maybe<AccountRealmRole>;
  /** An edge for our `AccountRealmRole`. May be used by Relay 1. */
  accountRealmRoleEdge?: Maybe<AccountRealmRoleEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `AccountRealmRole` mutation. */
export type UpdateAccountRealmRolePayloadAccountRealmRoleEdgeArgs = {
  orderBy?: Array<AccountRealmRoleOrderBy>;
};

/** All input for the `updateBotById` mutation. */
export type UpdateBotByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Bot` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Bot` being updated. */
  patch: BotPatch;
};

/** All input for the `updateBot` mutation. */
export type UpdateBotInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Bot` being updated. */
  patch: BotPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Bot` mutation. */
export type UpdateBotPayload = {
  /** The `Bot` that was updated by this mutation. */
  bot?: Maybe<Bot>;
  /** An edge for our `Bot`. May be used by Relay 1. */
  botEdge?: Maybe<BotEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Bot` mutation. */
export type UpdateBotPayloadBotEdgeArgs = {
  orderBy?: Array<BotOrderBy>;
};

/** All input for the `updateChannelBridgeById` mutation. */
export type UpdateChannelBridgeByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ChannelBridge` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ChannelBridge` being updated. */
  patch: ChannelBridgePatch;
};

/** All input for the `updateChannelBridge` mutation. */
export type UpdateChannelBridgeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ChannelBridge` being updated. */
  patch: ChannelBridgePatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `ChannelBridge` mutation. */
export type UpdateChannelBridgePayload = {
  /** The `ChannelBridge` that was updated by this mutation. */
  channelBridge?: Maybe<ChannelBridge>;
  /** An edge for our `ChannelBridge`. May be used by Relay 1. */
  channelBridgeEdge?: Maybe<ChannelBridgeEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `ChannelBridge` mutation. */
export type UpdateChannelBridgePayloadChannelBridgeEdgeArgs = {
  orderBy?: Array<ChannelBridgeOrderBy>;
};

/** All input for the `updateChatById` mutation. */
export type UpdateChatByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Chat` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Chat` being updated. */
  patch: ChatPatch;
};

/** All input for the `updateChat` mutation. */
export type UpdateChatInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Chat` being updated. */
  patch: ChatPatch;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `updateChatParticipantById` mutation. */
export type UpdateChatParticipantByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ChatParticipant` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ChatParticipant` being updated. */
  patch: ChatParticipantPatch;
};

/** All input for the `updateChatParticipant` mutation. */
export type UpdateChatParticipantInput = {
  chatId: Scalars['UUID']['input'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ChatParticipant` being updated. */
  patch: ChatParticipantPatch;
  profileId: Scalars['UUID']['input'];
};

/** The output of our update `ChatParticipant` mutation. */
export type UpdateChatParticipantPayload = {
  /** The `ChatParticipant` that was updated by this mutation. */
  chatParticipant?: Maybe<ChatParticipant>;
  /** An edge for our `ChatParticipant`. May be used by Relay 1. */
  chatParticipantEdge?: Maybe<ChatParticipantEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `ChatParticipant` mutation. */
export type UpdateChatParticipantPayloadChatParticipantEdgeArgs = {
  orderBy?: Array<ChatParticipantOrderBy>;
};

/** The output of our update `Chat` mutation. */
export type UpdateChatPayload = {
  /** The `Chat` that was updated by this mutation. */
  chat?: Maybe<Chat>;
  /** An edge for our `Chat`. May be used by Relay 1. */
  chatEdge?: Maybe<ChatEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Chat` mutation. */
export type UpdateChatPayloadChatEdgeArgs = {
  orderBy?: Array<ChatOrderBy>;
};

/** All input for the `updateFederatedIdentityById` mutation. */
export type UpdateFederatedIdentityByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `FederatedIdentity` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `FederatedIdentity` being updated. */
  patch: FederatedIdentityPatch;
};

/** All input for the `updateFederatedIdentity` mutation. */
export type UpdateFederatedIdentityInput = {
  accountId: Scalars['UUID']['input'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  identityProviderId: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `FederatedIdentity` being updated. */
  patch: FederatedIdentityPatch;
};

/** The output of our update `FederatedIdentity` mutation. */
export type UpdateFederatedIdentityPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `FederatedIdentity` that was updated by this mutation. */
  federatedIdentity?: Maybe<FederatedIdentity>;
  /** An edge for our `FederatedIdentity`. May be used by Relay 1. */
  federatedIdentityEdge?: Maybe<FederatedIdentityEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `FederatedIdentity` mutation. */
export type UpdateFederatedIdentityPayloadFederatedIdentityEdgeArgs = {
  orderBy?: Array<FederatedIdentityOrderBy>;
};

/** All input for the `updateIdentityProviderById` mutation. */
export type UpdateIdentityProviderByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `IdentityProvider` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `IdentityProvider` being updated. */
  patch: IdentityProviderPatch;
};

/** All input for the `updateIdentityProvider` mutation. */
export type UpdateIdentityProviderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `IdentityProvider` being updated. */
  patch: IdentityProviderPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `IdentityProvider` mutation. */
export type UpdateIdentityProviderPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `IdentityProvider` that was updated by this mutation. */
  identityProvider?: Maybe<IdentityProvider>;
  /** An edge for our `IdentityProvider`. May be used by Relay 1. */
  identityProviderEdge?: Maybe<IdentityProviderEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `IdentityProvider` mutation. */
export type UpdateIdentityProviderPayloadIdentityProviderEdgeArgs = {
  orderBy?: Array<IdentityProviderOrderBy>;
};

/** All input for the `updateMessageById` mutation. */
export type UpdateMessageByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Message` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Message` being updated. */
  patch: MessagePatch;
};

/** All input for the `updateMessageByRowIdAndCreatedAt` mutation. */
export type UpdateMessageByRowIdAndCreatedAtInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['Datetime']['input'];
  /** An object where the defined keys will be set on the `Message` being updated. */
  patch: MessagePatch;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `updateMessage` mutation. */
export type UpdateMessageInput = {
  chatId: Scalars['UUID']['input'];
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['Datetime']['input'];
  /** An object where the defined keys will be set on the `Message` being updated. */
  patch: MessagePatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Message` mutation. */
export type UpdateMessagePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Message` that was updated by this mutation. */
  message?: Maybe<Message>;
  /** An edge for our `Message`. May be used by Relay 1. */
  messageEdge?: Maybe<MessageEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Message` mutation. */
export type UpdateMessagePayloadMessageEdgeArgs = {
  orderBy?: Array<MessageOrderBy>;
};

/** All input for the `updatePermissionById` mutation. */
export type UpdatePermissionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Permission` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Permission` being updated. */
  patch: PermissionPatch;
};

/** All input for the `updatePermission` mutation. */
export type UpdatePermissionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Permission` being updated. */
  patch: PermissionPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Permission` mutation. */
export type UpdatePermissionPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Permission` that was updated by this mutation. */
  permission?: Maybe<Permission>;
  /** An edge for our `Permission`. May be used by Relay 1. */
  permissionEdge?: Maybe<PermissionEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Permission` mutation. */
export type UpdatePermissionPayloadPermissionEdgeArgs = {
  orderBy?: Array<PermissionOrderBy>;
};

/** All input for the `updateProfileById` mutation. */
export type UpdateProfileByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Profile` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Profile` being updated. */
  patch: ProfilePatch;
};

/** All input for the `updateProfile` mutation. */
export type UpdateProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Profile` being updated. */
  patch: ProfilePatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Profile` mutation. */
export type UpdateProfilePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Profile` that was updated by this mutation. */
  profile?: Maybe<Profile>;
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfileEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Profile` mutation. */
export type UpdateProfilePayloadProfileEdgeArgs = {
  orderBy?: Array<ProfileOrderBy>;
};

/** All input for the `updateRealmById` mutation. */
export type UpdateRealmByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Realm` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Realm` being updated. */
  patch: RealmPatch;
};

/** All input for the `updateRealmByName` mutation. */
export type UpdateRealmByNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `Realm` being updated. */
  patch: RealmPatch;
};

/** All input for the `updateRealm` mutation. */
export type UpdateRealmInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Realm` being updated. */
  patch: RealmPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Realm` mutation. */
export type UpdateRealmPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Realm` that was updated by this mutation. */
  realm?: Maybe<Realm>;
  /** An edge for our `Realm`. May be used by Relay 1. */
  realmEdge?: Maybe<RealmEdge>;
};

/** The output of our update `Realm` mutation. */
export type UpdateRealmPayloadRealmEdgeArgs = {
  orderBy?: Array<RealmOrderBy>;
};

/** All input for the `updateRoleById` mutation. */
export type UpdateRoleByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Role` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Role` being updated. */
  patch: RolePatch;
};

/** All input for the `updateRole` mutation. */
export type UpdateRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Role` being updated. */
  patch: RolePatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Role` mutation. */
export type UpdateRolePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Role` that was updated by this mutation. */
  role?: Maybe<Role>;
  /** An edge for our `Role`. May be used by Relay 1. */
  roleEdge?: Maybe<RoleEdge>;
};

/** The output of our update `Role` mutation. */
export type UpdateRolePayloadRoleEdgeArgs = {
  orderBy?: Array<RoleOrderBy>;
};

/** All input for the `updateSeaqlMigrationById` mutation. */
export type UpdateSeaqlMigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `SeaqlMigration` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `SeaqlMigration` being updated. */
  patch: SeaqlMigrationPatch;
};

/** All input for the `updateSeaqlMigration` mutation. */
export type UpdateSeaqlMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `SeaqlMigration` being updated. */
  patch: SeaqlMigrationPatch;
  version: Scalars['String']['input'];
};

/** The output of our update `SeaqlMigration` mutation. */
export type UpdateSeaqlMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `SeaqlMigration` that was updated by this mutation. */
  seaqlMigration?: Maybe<SeaqlMigration>;
  /** An edge for our `SeaqlMigration`. May be used by Relay 1. */
  seaqlMigrationEdge?: Maybe<SeaqlMigrationEdge>;
};

/** The output of our update `SeaqlMigration` mutation. */
export type UpdateSeaqlMigrationPayloadSeaqlMigrationEdgeArgs = {
  orderBy?: Array<SeaqlMigrationOrderBy>;
};

/** All input for the `updateTripById` mutation. */
export type UpdateTripByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Trip` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Trip` being updated. */
  patch: TripPatch;
};

/** All input for the `updateTripCardById` mutation. */
export type UpdateTripCardByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TripCard` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `TripCard` being updated. */
  patch: TripCardPatch;
};

/** All input for the `updateTripCard` mutation. */
export type UpdateTripCardInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `TripCard` being updated. */
  patch: TripCardPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `TripCard` mutation. */
export type UpdateTripCardPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCard` that was updated by this mutation. */
  tripCard?: Maybe<TripCard>;
  /** An edge for our `TripCard`. May be used by Relay 1. */
  tripCardEdge?: Maybe<TripCardEdge>;
};

/** The output of our update `TripCard` mutation. */
export type UpdateTripCardPayloadTripCardEdgeArgs = {
  orderBy?: Array<TripCardOrderBy>;
};

/** All input for the `updateTripCardRichTextById` mutation. */
export type UpdateTripCardRichTextByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TripCardRichText` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `TripCardRichText` being updated. */
  patch: TripCardRichTextPatch;
};

/** All input for the `updateTripCardRichText` mutation. */
export type UpdateTripCardRichTextInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `TripCardRichText` being updated. */
  patch: TripCardRichTextPatch;
  tripCardId: Scalars['UUID']['input'];
};

/** The output of our update `TripCardRichText` mutation. */
export type UpdateTripCardRichTextPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCardRichText` that was updated by this mutation. */
  tripCardRichText?: Maybe<TripCardRichText>;
  /** An edge for our `TripCardRichText`. May be used by Relay 1. */
  tripCardRichTextEdge?: Maybe<TripCardRichTextEdge>;
};

/** The output of our update `TripCardRichText` mutation. */
export type UpdateTripCardRichTextPayloadTripCardRichTextEdgeArgs = {
  orderBy?: Array<TripCardRichTextOrderBy>;
};

/** All input for the `updateTripCardVoteById` mutation. */
export type UpdateTripCardVoteByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TripCardVote` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `TripCardVote` being updated. */
  patch: TripCardVotePatch;
};

/** All input for the `updateTripCardVote` mutation. */
export type UpdateTripCardVoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `TripCardVote` being updated. */
  patch: TripCardVotePatch;
  profileId: Scalars['UUID']['input'];
  tripCardId: Scalars['UUID']['input'];
};

/** The output of our update `TripCardVote` mutation. */
export type UpdateTripCardVotePayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripCardVote` that was updated by this mutation. */
  tripCardVote?: Maybe<TripCardVote>;
  /** An edge for our `TripCardVote`. May be used by Relay 1. */
  tripCardVoteEdge?: Maybe<TripCardVoteEdge>;
};

/** The output of our update `TripCardVote` mutation. */
export type UpdateTripCardVotePayloadTripCardVoteEdgeArgs = {
  orderBy?: Array<TripCardVoteOrderBy>;
};

/** All input for the `updateTrip` mutation. */
export type UpdateTripInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Trip` being updated. */
  patch: TripPatch;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `updateTripParticipantById` mutation. */
export type UpdateTripParticipantByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TripParticipant` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `TripParticipant` being updated. */
  patch: TripParticipantPatch;
};

/** All input for the `updateTripParticipant` mutation. */
export type UpdateTripParticipantInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `TripParticipant` being updated. */
  patch: TripParticipantPatch;
  profileId: Scalars['UUID']['input'];
  tripId: Scalars['UUID']['input'];
};

/** The output of our update `TripParticipant` mutation. */
export type UpdateTripParticipantPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TripParticipant` that was updated by this mutation. */
  tripParticipant?: Maybe<TripParticipant>;
  /** An edge for our `TripParticipant`. May be used by Relay 1. */
  tripParticipantEdge?: Maybe<TripParticipantEdge>;
};

/** The output of our update `TripParticipant` mutation. */
export type UpdateTripParticipantPayloadTripParticipantEdgeArgs = {
  orderBy?: Array<TripParticipantOrderBy>;
};

/** The output of our update `Trip` mutation. */
export type UpdateTripPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Trip` that was updated by this mutation. */
  trip?: Maybe<Trip>;
  /** An edge for our `Trip`. May be used by Relay 1. */
  tripEdge?: Maybe<TripEdge>;
};

/** The output of our update `Trip` mutation. */
export type UpdateTripPayloadTripEdgeArgs = {
  orderBy?: Array<TripOrderBy>;
};
