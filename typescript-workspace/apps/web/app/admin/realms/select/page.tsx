'use client';

import { useEffect, useState } from 'react';

import { useQuery, useMutation } from '@connectrpc/connect-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAtomValue } from 'jotai';

import { AuthService } from '@workspace/proto-gen/src/auth_pb';
import { Button } from '@workspace/ui/components/button';

import { accessTokenAtom, parsedJwtAtom, useAdminAuthFetch } from '@/hooks/admin/use-admin-auth-fetch';

export default function SelectRealmPage() {
  const router = useRouter();
  const accessToken = useAtomValue(accessTokenAtom);
  const parsedJwt = useAtomValue(parsedJwtAtom);
  const { setTokens, getRefreshToken } = useAdminAuthFetch();
  const [error, setError] = useState<string | null>(null);
  const [selectedRealmId, setSelectedRealmId] = useState<string | null>(null);

  const { data: realmsData, isLoading } = useQuery(AuthService.method.listRealms, {}, { enabled: !!accessToken });
  const { mutateAsync: refreshToken, isPending: isRefreshPending } = useMutation(AuthService.method.refreshToken);

  // Handle F5 refresh - check parsedJwt for realm_id
  useEffect(() => {
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }

    // If JWT contains realm_id, redirect to dashboard
    if (parsedJwt && typeof parsedJwt === 'object' && 'realm_id' in parsedJwt && parsedJwt.realm_id) {
      router.push('/admin/dashboard');
    }
  }, [accessToken, parsedJwt, router]);

  async function handleSelectRealm(realmId: string) {
    setError(null);
    setSelectedRealmId(realmId);

    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      setError('No refresh token available');
      toast.error('No refresh token available');
      return;
    }

    try {
      const refreshResponse = await refreshToken({
        refreshToken: refreshTokenValue,
        realmId: realmId,
      });

      if (refreshResponse.success) {
        setTokens(refreshResponse.accessToken, refreshResponse.refreshToken);
        toast.success('Realm selected successfully');
        router.push('/admin/dashboard');
      } else {
        setError('Failed to refresh token');
        toast.error('Failed to refresh token');
      }
    } catch (e: unknown) {
      console.error('Failed to refresh token:', e);
      setError('Failed to refresh token');
      toast.error('Failed to refresh token');
    } finally {
      setSelectedRealmId(null);
    }
  }

  if (!accessToken) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="container">Loading...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="container">Loading realms...</div>
      </div>
    );
  }

  const realms = realmsData?.realms || [];

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="container">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Select a Realm</h1>
            <p className="text-muted-foreground text-sm">Choose which realm you want to access</p>
          </div>

          {error && <div className="text-destructive rounded-md bg-destructive/10 p-4 text-sm">{error}</div>}

          {realms.length === 0 ? (
            <div className="rounded-md bg-muted p-4 text-center text-sm">
              No realms available. Please contact your administrator.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {realms.map((realm) => (
                <div
                  key={realm.id}
                  className="flex cursor-pointer flex-col rounded-lg border p-4 transition-colors hover:bg-accent"
                  onClick={() => handleSelectRealm(realm.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{realm.displayName}</h3>
                      <p className="text-muted-foreground text-sm">{realm.name}</p>
                      {realm.description && (
                        <p className="text-muted-foreground mt-2 text-xs">{realm.description}</p>
                      )}
                    </div>
                    {selectedRealmId === realm.id && isRefreshPending && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                  </div>
                  <Button
                    className="mt-4 w-full"
                    disabled={isRefreshPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRealm(realm.id);
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

