'use client';

import { useState } from 'react';

import { TransportProvider } from '@connectrpc/connect-query';
import { createConnectTransport } from '@connectrpc/connect-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function RpcClientProvider({
  children,
  apiBaseUrl = 'https://localhost:3030',
}: {
  children: React.ReactNode;
  apiBaseUrl?: string;
}): React.ReactNode {
  const [queryClient] = useState(() => new QueryClient());
  const [transport] = useState(() =>
    createConnectTransport({
      baseUrl: apiBaseUrl,
    }),
  );
  return (
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransportProvider>
  );
}
