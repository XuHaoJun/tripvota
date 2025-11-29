import { useQuery } from '@tanstack/react-query';

import { useGraphQLClient } from '@/lib/graphql/client';
import type {
  GetBotByRowIdQuery,
  GetBotByRowIdQueryVariables,
  GetBotQuery,
  GetBotQueryVariables,
} from '@/lib/graphql/types';
import { globalIdToRowId } from '@/lib/graphql/utils';

import { BOT_BY_ROW_ID_QUERY, BOT_QUERY } from './use-bot-queries';

/**
 * Hook for fetching a single bot by ID using GraphQL
 * Strategy: Try global ID first, fallback to rowId if not found
 * Includes network error handling and retry logic
 */
export function useBotDetail(id: string | undefined) {
  const client = useGraphQLClient();

  return useQuery<GetBotQuery['botById'] | GetBotByRowIdQuery['bot'], Error>({
    queryKey: ['bot', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Bot ID is required');
      }

      // Try global ID query first
      try {
        const variables: GetBotQueryVariables = {
          id,
        };

        const data = await client.request<GetBotQuery>(BOT_QUERY, variables);
        if (data.botById) {
          return data.botById;
        }
      } catch (error) {
        // If it's a 404 or "not found" error, try fallback to rowId
        if (error instanceof Error && (error.message.includes('404') || error.message.includes('not found'))) {
          // Try to extract rowId from global ID, or use id as rowId if it's already a UUID
          let rowId: string;
          try {
            const decoded = globalIdToRowId(id);
            rowId = Array.isArray(decoded) ? decoded[1] : id;
          } catch {
            // If decoding fails, assume id is already a rowId (UUID format)
            rowId = id;
          }

          // Fallback: Try querying by rowId
          try {
            const variables: GetBotByRowIdQueryVariables = {
              rowId,
            };
            const data = await client.request<GetBotByRowIdQuery>(BOT_BY_ROW_ID_QUERY, variables);
            if (data.bot) {
              return data.bot;
            }
          } catch (fallbackError) {
            // If fallback also fails, throw the original error
            throw error;
          }
        }

        // For other errors, enhance error messages
        if (error instanceof Error) {
          if (error.message.includes('fetch') || error.message.includes('network')) {
            throw new Error('Network error: Please check your connection and try again');
          }
          if (error.message.includes('401') || error.message.includes('403')) {
            throw new Error('Access denied: You may not have permission to view this bot');
          }
        }
        throw error;
      }

      throw new Error('Bot not found');
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (
        error instanceof Error &&
        (error.message.includes('401') || error.message.includes('403') || error.message.includes('404'))
      ) {
        return false;
      }
      // Retry up to 2 times for network errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
