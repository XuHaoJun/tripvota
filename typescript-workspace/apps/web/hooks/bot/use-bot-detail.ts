import { useQuery } from '@tanstack/react-query';

import { useGraphQLClient } from '@/lib/graphql/client';
import type { GetBotQuery, GetBotQueryVariables } from '@/lib/graphql/types';

import { BOT_QUERY } from './use-bot-queries';

/**
 * Hook for fetching a single bot by ID using GraphQL
 * Includes network error handling and retry logic
 */
export function useBotDetail(botId: string | undefined) {
  const client = useGraphQLClient();

  return useQuery<GetBotQuery['bot'], Error>({
    queryKey: ['bot', botId],
    queryFn: async () => {
      if (!botId) {
        throw new Error('Bot ID is required');
      }

      try {
        const variables: GetBotQueryVariables = {
          rowId: botId,
        };

        const data = await client.request<GetBotQuery>(BOT_QUERY, variables);
        return data.bot;
      } catch (error) {
        // Enhance error messages for network errors
        if (error instanceof Error) {
          if (error.message.includes('fetch') || error.message.includes('network')) {
            throw new Error('Network error: Please check your connection and try again');
          }
          if (error.message.includes('401') || error.message.includes('403')) {
            throw new Error('Access denied: You may not have permission to view this bot');
          }
          if (error.message.includes('404')) {
            throw new Error('Bot not found');
          }
        }
        throw error;
      }
    },
    enabled: !!botId,
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
