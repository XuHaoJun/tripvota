import { useEffect, useRef } from 'react';

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useLocalStorage } from 'usehooks-ts';

import { ADMIN_ACCESS_TOKEN_KEY, ADMIN_REFRESH_TOKEN_KEY } from '@/constants/auth';
import { isRefreshingAtom as isRefreshingAtomFromFetch } from '@/hooks/admin/use-admin-auth-fetch';

export interface LocalStorageAuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * Creates atoms that sync with localStorage using useLocalStorage from usehooks-ts.
 *
 * Why useLocalStorage from usehooks-ts?
 * - It already handles the storage event for cross-tab sync
 * - It handles SSR safely
 * - It's a well-tested library
 *
 * However, useLocalStorage is a React hook and can't be called at module level.
 * So we create atoms and bridge them with useLocalStorageSync hook.
 */

// Create atoms for each token
// Internal writable atoms
const accessTokenAtomBase = atom<string | null>(null);
const refreshTokenAtomBase = atom<string | null>(null);
// Export readonly atoms
export const accessTokenAtom = atom((get) => get(accessTokenAtomBase));
export const refreshTokenAtom = atom((get) => get(refreshTokenAtomBase));
export const isRefreshingAtom = isRefreshingAtomFromFetch;
export const isLoadingAccessTokenFromLocalStorageAtom = atom(true);

export const accessTokenIsActiveAtom = atom((get) => {
  const accessToken = get(accessTokenAtom);
  const isRefreshing = get(isRefreshingAtom);
  return Boolean(accessToken) && !isRefreshing;
});

export function useLocalStorageSync() {
  const [accessToken] = useLocalStorage<string | null>(ADMIN_ACCESS_TOKEN_KEY, null);
  const [refreshToken] = useLocalStorage<string | null>(ADMIN_REFRESH_TOKEN_KEY, null);
  const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);

  // Sync useLocalStorage state to atoms
  const setAccessTokenAtom = useSetAtom(accessTokenAtomBase);
  const setRefreshTokenAtom = useSetAtom(refreshTokenAtomBase);
  const setIsLoadingAccessTokenFromLocalStorageAtom = useSetAtom(isLoadingAccessTokenFromLocalStorageAtom);

  // Read atom values to detect changes
  const currentIsRefreshing = useAtomValue(isRefreshingAtom);

  // Track if we're updating from atom to prevent loops
  const updatingFromAtomRef = useRef({ isRefreshing: false });

  // Sync localStorage -> atoms (when localStorage changes from another tab via storage event)
  // useLocalStorage already handles the storage event, so we just sync its state to atoms
  // Note: Both accessTokenAtom and refreshTokenAtom are readonly and only sync FROM localStorage, not back to it
  useEffect(() => {
    setAccessTokenAtom(accessToken);
    setIsLoadingAccessTokenFromLocalStorageAtom(false);
  }, [accessToken, setAccessTokenAtom, setIsLoadingAccessTokenFromLocalStorageAtom]);

  useEffect(() => {
    setRefreshTokenAtom(refreshToken);
  }, [refreshToken, setRefreshTokenAtom]);

  useEffect(() => {
    if (currentIsRefreshing !== isRefreshing) {
      setIsRefreshing(Boolean(currentIsRefreshing));
    }
    setTimeout(() => {
      updatingFromAtomRef.current.isRefreshing = false;
    }, 0);
  }, [currentIsRefreshing, isRefreshing, setIsRefreshing]);
}
