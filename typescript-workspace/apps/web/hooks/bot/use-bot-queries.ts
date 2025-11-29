import type { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const BOTS_QUERY: DocumentNode = gql`
  query GetBots($first: Int, $after: Cursor, $filter: BotFilter, $orderBy: [BotOrderBy!]) {
    bots(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
      edges {
        node {
          id
          realmId
          name
          displayName
          description
          isActive
          capabilities
          createdAt
          updatedAt
          apiChannelBridgeId
          oauthChannelBridgeId
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const BOT_QUERY: DocumentNode = gql`
  query GetBot($id: ID!) {
    botById(id: $id) {
      id
      rowId
      realmId
      name
      displayName
      description
      isActive
      capabilities
      metadata
      createdAt
      updatedAt
      apiChannelBridgeId
      oauthChannelBridgeId
      realm {
        id
        name
      }
      apiChannelBridge {
        id
        bridgeType
        thirdProviderType
      }
      oauthChannelBridge {
        id
        bridgeType
        thirdProviderType
      }
    }
  }
`;

export const BOT_BY_ROW_ID_QUERY: DocumentNode = gql`
  query GetBotByRowId($rowId: UUID!) {
    bot(rowId: $rowId) {
      id
      rowId
      realmId
      name
      displayName
      description
      isActive
      capabilities
      metadata
      createdAt
      updatedAt
      apiChannelBridgeId
      oauthChannelBridgeId
      realm {
        id
        name
      }
      apiChannelBridge {
        id
        bridgeType
        thirdProviderType
      }
      oauthChannelBridge {
        id
        bridgeType
        thirdProviderType
      }
    }
  }
`;
