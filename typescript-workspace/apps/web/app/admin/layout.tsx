'use client';

import Link from 'next/link';

import { authFetch } from '@workspace/fetch-ext';
import { RpcClientProvider } from '@workspace/rpc-client';

import { AuthGuard } from '@/components/auth-guard';
import { UserNav } from '@/components/user-nav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RpcClientProvider connectTransportOptions={{ baseUrl: 'http://localhost:3030', fetch: authFetch }}>
      <AuthGuard>
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
      </AuthGuard>
    </RpcClientProvider>
  );
}
