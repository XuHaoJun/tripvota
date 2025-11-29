import type * as Types from './schema.types';

export type GetBotsQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['Cursor']['input']>;
  filter?: Types.InputMaybe<Types.BotFilter>;
  orderBy?: Types.InputMaybe<Array<Types.BotOrderBy> | Types.BotOrderBy>;
}>;

export type GetBotsQuery = {
  bots?: Types.Maybe<
    Pick<Types.BotConnection, 'totalCount'> & {
      edges: Array<
        Types.Maybe<{
          node?: Types.Maybe<
            Pick<
              Types.Bot,
              | 'id'
              | 'realmId'
              | 'name'
              | 'displayName'
              | 'description'
              | 'isActive'
              | 'capabilities'
              | 'createdAt'
              | 'updatedAt'
              | 'apiChannelBridgeId'
              | 'oauthChannelBridgeId'
            >
          >;
        }>
      >;
      pageInfo: Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>;
    }
  >;
};

export type GetBotQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type GetBotQuery = {
  botById?: Types.Maybe<
    Pick<
      Types.Bot,
      | 'id'
      | 'rowId'
      | 'realmId'
      | 'name'
      | 'displayName'
      | 'description'
      | 'isActive'
      | 'capabilities'
      | 'metadata'
      | 'createdAt'
      | 'updatedAt'
      | 'apiChannelBridgeId'
      | 'oauthChannelBridgeId'
    > & {
      realm?: Types.Maybe<Pick<Types.Realm, 'id' | 'name'>>;
      apiChannelBridge?: Types.Maybe<Pick<Types.ChannelBridge, 'id' | 'bridgeType' | 'thirdProviderType'>>;
      oauthChannelBridge?: Types.Maybe<Pick<Types.ChannelBridge, 'id' | 'bridgeType' | 'thirdProviderType'>>;
    }
  >;
};

export type GetBotByRowIdQueryVariables = Types.Exact<{
  rowId: Types.Scalars['UUID']['input'];
}>;

export type GetBotByRowIdQuery = {
  bot?: Types.Maybe<
    Pick<
      Types.Bot,
      | 'id'
      | 'rowId'
      | 'realmId'
      | 'name'
      | 'displayName'
      | 'description'
      | 'isActive'
      | 'capabilities'
      | 'metadata'
      | 'createdAt'
      | 'updatedAt'
      | 'apiChannelBridgeId'
      | 'oauthChannelBridgeId'
    > & {
      realm?: Types.Maybe<Pick<Types.Realm, 'id' | 'name'>>;
      apiChannelBridge?: Types.Maybe<Pick<Types.ChannelBridge, 'id' | 'bridgeType' | 'thirdProviderType'>>;
      oauthChannelBridge?: Types.Maybe<Pick<Types.ChannelBridge, 'id' | 'bridgeType' | 'thirdProviderType'>>;
    }
  >;
};
