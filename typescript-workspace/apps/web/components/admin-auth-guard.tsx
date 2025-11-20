'use client';

import { useEffect, useRef } from 'react';

import { useAtomValue } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';

import { accessTokenAtom } from '@/atoms/admin/auth';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const accessToken = useAtomValue(accessTokenAtom);
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);

  // Allow login and register pages to render immediately
  const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/register');
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirectedRef.current) {
      return;
    }

    // If user has a token, don't redirect
    if (isAuthenticated) {
      return;
    }

    // Only redirect if not authenticated and not on auth page
    if (!isAuthPage) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname, isAuthPage]);

  if (!isAuthenticated && !isAuthPage) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
