import { useTable } from '@refinedev/antd';
import type { CrudFilter, CrudSort } from '@refinedev/core';

import type { Bot } from '@/lib/graphql/schema.types';

import { BOTS_QUERY } from './use-bot-queries';

export interface UseBotListOptions {
  filters?: CrudFilter[];
  sorters?: CrudSort[];
  pagination?: {
    current?: number;
    pageSize?: number;
  };
}

/**
 * Hook for fetching bot list using Refine's useTable with PostGraphile data provider
 */
export function useBotList(options: UseBotListOptions = {}) {
  const { filters = [], sorters = [], pagination } = options;

  return useTable<Bot>({
    resource: 'bots',
    meta: {
      gqlQuery: BOTS_QUERY,
    },
    filters: {
      initial: filters,
    },
    sorters: {
      initial: sorters,
    },
    pagination: pagination || {
      pageSize: 20,
    },
  });
}
