import type {
  DataProvider,
  GetListResponse,
  GetOneResponse,
  GetManyResponse,
  CreateResponse,
  UpdateResponse,
  DeleteOneResponse,
  GetListParams,
  GetOneParams,
  GetManyParams,
  CreateParams,
  UpdateParams,
  DeleteOneParams,
  BaseRecord,
} from '@refinedev/core';
import { dataProvider as postgraphileDataProvider } from '@xuhaojun/refine-postgraphile';
import { GraphQLClient } from 'graphql-request';

import { useGraphQLClient } from '@/lib/graphql/client';

/**
 * Creates a PostGraphile data provider for Refine
 * Only implements getList and getOne methods (read operations)
 * Create/update/delete operations throw errors (use ConnectRPC instead)
 *
 * The GraphQLClient is already configured with authFetch via requestConfig.fetch
 */
export function createPostGraphileDataProvider(graphqlClient: GraphQLClient): DataProvider {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql';

  // Use the existing PostGraphile data provider with the authenticated GraphQLClient
  const fullProvider = postgraphileDataProvider(graphqlClient, {
    namingConvention: 'simplified',
  });

  // Return a full DataProvider that implements all methods
  // Only getList and getOne are functional; others throw errors
  return {
    getList: fullProvider.getList.bind(fullProvider),
    getOne: fullProvider.getOne.bind(fullProvider),
    getMany: async <TData extends BaseRecord = BaseRecord>(params: GetManyParams): Promise<GetManyResponse<TData>> => {
      // Use getOne for each ID
      const promises = params.ids.map((id) =>
        fullProvider.getOne<TData>({
          resource: params.resource,
          id,
          meta: params.meta,
        }),
      );
      const results = await Promise.all(promises);
      return {
        data: results.map((r) => r.data),
      };
    },
    create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
      params: CreateParams<TVariables>,
    ): Promise<CreateResponse<TData>> => {
      throw new Error('Create operation is not supported via GraphQL. Use ConnectRPC instead.');
    },
    createMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: any): Promise<any> => {
      throw new Error('CreateMany operation is not supported via GraphQL. Use ConnectRPC instead.');
    },
    update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
      params: UpdateParams<TVariables>,
    ): Promise<UpdateResponse<TData>> => {
      throw new Error('Update operation is not supported via GraphQL. Use ConnectRPC instead.');
    },
    updateMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(params: any): Promise<any> => {
      throw new Error('UpdateMany operation is not supported via GraphQL. Use ConnectRPC instead.');
    },
    deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>(
      params: DeleteOneParams<TVariables>,
    ): Promise<DeleteOneResponse<TData>> => {
      throw new Error('DeleteOne operation is not supported via GraphQL. Use ConnectRPC instead.');
    },
    deleteMany: async <TData extends BaseRecord = BaseRecord>(params: any): Promise<any> => {
      throw new Error('DeleteMany operation is not supported via GraphQL. Use ConnectRPC instead.');
    },
    getApiUrl: () => {
      return endpoint;
    },
    custom: async <TData extends BaseRecord = BaseRecord, TQuery = unknown, TPayload = unknown>(
      params: any,
    ): Promise<any> => {
      throw new Error('Custom operation is not supported via GraphQL.');
    },
  };
}

/**
 * Hook to get PostGraphile data provider
 */
export function usePostGraphileDataProvider(): DataProvider {
  const client = useGraphQLClient();
  return createPostGraphileDataProvider(client);
}
