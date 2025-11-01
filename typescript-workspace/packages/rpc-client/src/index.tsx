import { useState } from 'react';

import { TransportProvider } from '@connectrpc/connect-query';
import { createConnectTransport } from '@connectrpc/connect-web';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function RpcClientProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [queryClient] = useState(() => new QueryClient());
  const [transport] = useState(() =>
    createConnectTransport({
      baseUrl: 'https://localhost:3030',
    }),
  );
  return (
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransportProvider>
  );
}
