'use client';

import { useState } from 'react';

import { TransportProvider } from '@connectrpc/connect-query';
import { ConnectTransportOptions, createConnectTransport } from '@connectrpc/connect-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function RpcClientProvider({
  children,
  connectTransportOptions,
}: {
  children: React.ReactNode;
  connectTransportOptions: ConnectTransportOptions;
}): React.ReactNode {
  const [queryClient] = useState(() => new QueryClient());
  const [transport] = useState(() =>
    createConnectTransport({
      ...connectTransportOptions,
    }),
  );
  return (
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransportProvider>
  );
}
