import { useMemo } from 'react';

import { GraphQLClient } from 'graphql-request';

import { useAdminAuthFetch } from '@/hooks/admin/use-admin-auth-fetch';

/**
 * Creates an authenticated GraphQL client that uses authFetch
 * Uses GraphQLClient from graphql-request with custom fetch in requestConfig
 */
export function createAuthenticatedGraphQLClient(authFetch: typeof fetch): GraphQLClient {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql';

  return new GraphQLClient(endpoint, {
    fetch: authFetch,
  });
}

/**
 * Hook to get authenticated GraphQL client
 * Creates a new client instance that uses authFetch for all requests
 */
export function useGraphQLClient(): GraphQLClient {
  const { authFetch } = useAdminAuthFetch();

  return useMemo(() => createAuthenticatedGraphQLClient(authFetch), [authFetch]);
}
