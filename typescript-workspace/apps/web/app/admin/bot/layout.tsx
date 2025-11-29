'use client';

import { Refine } from '@refinedev/core';
import { ConfigProvider, App as AntdApp } from 'antd';

import { usePostGraphileDataProvider } from '@/lib/refine/postgraphile-data-provider';

export default function BotLayout({ children }: { children: React.ReactNode }) {
  const dataProvider = usePostGraphileDataProvider();

  return (
    <ConfigProvider
      theme={{
        token: {
          // Match shadcn color scheme if needed
          colorPrimary: 'hsl(var(--primary))',
        },
      }}
    >
      <AntdApp>
        <Refine
          dataProvider={dataProvider}
          resources={[
            {
              name: 'bots',
              list: '/admin/bot',
              show: '/admin/bot/:id',
            },
          ]}
          options={{
            syncWithLocation: false, // Next.js handles routing
            warnWhenUnsavedChanges: true,
          }}
        >
          {children}
        </Refine>
      </AntdApp>
    </ConfigProvider>
  );
}
