'use client';

import { useEffect } from 'react';

import { useAtomValue } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';

import { isAuthenticatedAtom, isAuthLoadingAtom } from '@/atoms/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isLoading = useAtomValue(isAuthLoadingAtom);
  const router = useRouter();
  const pathname = usePathname();

  // Allow login and register pages to render immediately
  const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/register');

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthPage) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname, isAuthPage]);

  // Don't block auth pages with loading state
  if (isLoading && !isAuthPage) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated && !isAuthPage) {
    return null; // Or redirect logic handles this
  }

  return <>{children}</>;
}
