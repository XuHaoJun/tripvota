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
export const accessTokenAtom = atom<string | null>(null);
export const refreshTokenAtom = atom<string | null>(null);
export const isRefreshingAtom = isRefreshingAtomFromFetch;

export const accessTokenIsActiveAtom = atom((get) => {
  const accessToken = get(accessTokenAtom);
  const isRefreshing = get(isRefreshingAtom);
  return Boolean(accessToken) && !isRefreshing;
});

export function useLocalStorageSync() {
  // useLocalStorage from usehooks-ts handles storage events automatically
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(ADMIN_ACCESS_TOKEN_KEY, null);
  const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(ADMIN_REFRESH_TOKEN_KEY, null);
  const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);

  // Sync useLocalStorage state to atoms
  const setAccessTokenAtom = useSetAtom(accessTokenAtom);
  const setRefreshTokenAtom = useSetAtom(refreshTokenAtom);

  // Read atom values to detect changes
  const currentAccessToken = useAtomValue(accessTokenAtom);
  const currentRefreshToken = useAtomValue(refreshTokenAtom);
  const currentIsRefreshing = useAtomValue(isRefreshingAtom);

  // Track if we're updating from atom to prevent loops
  const updatingFromAtomRef = useRef({ accessToken: false, refreshToken: false, isRefreshing: false });

  // Sync localStorage -> atoms (when localStorage changes from another tab via storage event)
  // useLocalStorage already handles the storage event, so we just sync its state to atoms
  useEffect(() => {
    if (!updatingFromAtomRef.current.accessToken) {
      setAccessTokenAtom(accessToken);
    }
  }, [accessToken, setAccessTokenAtom]);

  useEffect(() => {
    if (!updatingFromAtomRef.current.refreshToken) {
      setRefreshTokenAtom(refreshToken);
    }
  }, [refreshToken, setRefreshTokenAtom]);

  useEffect(() => {
    if (currentIsRefreshing !== isRefreshing) {
      setIsRefreshing(Boolean(currentIsRefreshing));
    }
    setTimeout(() => {
      updatingFromAtomRef.current.isRefreshing = false;
    }, 0);
  }, [currentIsRefreshing, isRefreshing, setIsRefreshing]);

  // Sync atoms -> localStorage (when atom changes in current tab)
  useEffect(() => {
    if (currentAccessToken !== accessToken) {
      updatingFromAtomRef.current.accessToken = true;
      setAccessToken(currentAccessToken);
      // Reset flag after a tick to allow next sync
      setTimeout(() => {
        updatingFromAtomRef.current.accessToken = false;
      }, 0);
    }
  }, [currentAccessToken, accessToken, setAccessToken]);

  useEffect(() => {
    if (currentRefreshToken !== refreshToken) {
      updatingFromAtomRef.current.refreshToken = true;
      setRefreshToken(currentRefreshToken);
      // Reset flag after a tick to allow next sync
      setTimeout(() => {
        updatingFromAtomRef.current.refreshToken = false;
      }, 0);
    }
  }, [currentRefreshToken, refreshToken, setRefreshToken]);
}
