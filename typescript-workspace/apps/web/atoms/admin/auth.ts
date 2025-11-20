import { useEffect, useRef } from 'react';

import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useLocalStorage } from 'usehooks-ts';

import { Account } from '@workspace/proto-gen/src/auth_pb';

import { ADMIN_ACCESS_TOKEN_KEY, ADMIN_REFRESH_TOKEN_KEY } from '@/constants/auth';

export const accountAtom = atom<Account | null>(null);

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

/**
 * React hook that bridges useLocalStorage from usehooks-ts with Jotai atoms.
 * This hook:
 * 1. Uses useLocalStorage to manage localStorage state (handles storage events automatically)
 * 2. Syncs the localStorage value with the Jotai atom
 * 3. Updates localStorage when the atom changes
 *
 * useLocalStorage from usehooks-ts already handles:
 * - Cross-tab synchronization via storage events
 * - SSR safety
 * - Error handling
 *
 * @example
 * ```tsx
 * // In a component (e.g., AdminLayout):
 * import { useLocalStorageSync } from '@/atoms/admin/auth';
 *
 * function AdminLayout({ children }) {
 *   // This enables cross-tab sync automatically via useLocalStorage
 *   useLocalStorageSync();
 *   return <>{children}</>;
 * }
 * ```
 */
export function useLocalStorageSync() {
  // useLocalStorage from usehooks-ts handles storage events automatically
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(ADMIN_ACCESS_TOKEN_KEY, null);
  const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(ADMIN_REFRESH_TOKEN_KEY, null);

  // Sync useLocalStorage state to atoms
  const setAccessTokenAtom = useSetAtom(accessTokenAtom);
  const setRefreshTokenAtom = useSetAtom(refreshTokenAtom);

  // Read atom values to detect changes
  const currentAccessToken = useAtomValue(accessTokenAtom);
  const currentRefreshToken = useAtomValue(refreshTokenAtom);

  // Track if we're updating from atom to prevent loops
  const updatingFromAtomRef = useRef({ accessToken: false, refreshToken: false });

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
