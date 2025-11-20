import { useEffect } from 'react';

import { createConnectQueryKey, useQuery } from '@connectrpc/connect-query';
import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { AuthService } from '@workspace/proto-gen/src/auth_pb';

import { accessTokenIsActiveAtom } from '@/atoms/admin/auth';

export function useMe(): ReturnType<
  typeof useQuery<typeof AuthService.method.me.input, typeof AuthService.method.me.output>
> {
  const enabled = useAtomValue(accessTokenIsActiveAtom);
  const queryClient = useQueryClient();

  // Clear query result when enabled changes from true to false
  useEffect(() => {
    if (enabled === false) {
      queryClient.removeQueries({
        queryKey: createConnectQueryKey({
          schema: AuthService.method.me,
          cardinality: 'finite',
        }),
      });
    }
  }, [enabled, queryClient]);

  return useQuery(AuthService.method.me, {}, { enabled, refetchOnWindowFocus: false, refetchOnMount: false });
}
