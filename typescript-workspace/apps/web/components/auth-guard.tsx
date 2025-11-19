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

  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated &&
      !pathname.startsWith('/admin/login') &&
      !pathname.startsWith('/admin/register')
    ) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/register')) {
    return null; // Or redirect logic handles this
  }

  return <>{children}</>;
}
