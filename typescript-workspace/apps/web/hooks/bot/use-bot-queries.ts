import gql from 'graphql-tag';
import type { DocumentNode } from 'graphql';
import type { GetBotsQuery, GetBotsQueryVariables, GetBotQuery, GetBotQueryVariables } from '@/lib/graphql/types';

export const BOTS_QUERY: DocumentNode = gql`
  query GetBots(
    $first: Int
    $after: Cursor
    $filter: BotFilter
    $orderBy: [BotOrderBy!]
  ) {
    bots(
      first: $first
      after: $after
      filter: $filter
      orderBy: $orderBy
    ) {
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
  query GetBot($rowId: UUID!) {
    bot(rowId: $rowId) {
      id
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

