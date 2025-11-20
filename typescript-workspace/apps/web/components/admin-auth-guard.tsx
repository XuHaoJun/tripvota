'use client';

import { useEffect } from 'react';

import { useAtomValue } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';

import { accessTokenAtom } from '@/atoms/admin/auth';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const accessToken = useAtomValue(accessTokenAtom);
  const router = useRouter();
  const pathname = usePathname();

  // Allow login and register pages to render immediately
  const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/register');
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (!isAuthenticated && !isAuthPage) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname, isAuthPage]);

  if (!isAuthenticated && !isAuthPage) {
    return null; // Redirect logic handles this
  }

  return <>{children}</>;
}
