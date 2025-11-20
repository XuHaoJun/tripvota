'use client';

import Link from 'next/link';

import { RpcClientProvider } from '@workspace/rpc-client';

import { useLocalStorageSync } from '@/atoms/admin/auth';
import { AdminAuthGuard } from '@/components/admin-auth-guard';
import { UserNav } from '@/components/user-nav';
import { useAdminAuthFetch } from '@/hooks/admin/use-admin-auth-fetch';

function RpcClientProviderWithAuth({ children }: { children: React.ReactNode }) {
  const { authFetch } = useAdminAuthFetch();
  return (
    <RpcClientProvider
      connectTransportOptions={{
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3030',
        fetch: authFetch,
      }}
    >
      {children}
    </RpcClientProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useLocalStorageSync();
  return (
    <RpcClientProviderWithAuth>
      <AdminAuthGuard>
        <div className="flex min-h-screen flex-col">
          <header className="border-b">
            <div className="flex h-16 items-center px-4">
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard" className="font-bold">
                  Admin
                </Link>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
        </div>
      </AdminAuthGuard>
    </RpcClientProviderWithAuth>
  );
}
