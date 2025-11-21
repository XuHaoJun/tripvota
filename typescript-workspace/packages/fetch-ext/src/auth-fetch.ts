import { useEffect, useRef } from 'react';

import { atom, useAtom, useAtomValue, useSetAtom, type Atom } from 'jotai';
import { useLocalStorage } from 'usehooks-ts';

export interface AuthFetchConfig {
  accessTokenKey?: string;
  refreshTokenKey?: string;
  refreshUrl?: string;
  loginPath?: string;
  redirectQueryParam?: string;
  shouldRedirect?: (path: string) => boolean;
}

export interface UseAuthFetchReturn {
  authFetch: typeof fetch;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
  isRefreshingAtom: ReturnType<typeof atom<boolean>>;
}

export interface CreateAuthFetchReturn {
  useAuthFetch: () => UseAuthFetchReturn;
  useLocalStorageSync: () => void;
  isRefreshingAtom: Atom<boolean>;
  accessTokenAtom: Atom<string | null>;
  refreshTokenAtom: Atom<string | null>;
  isLoadingAccessTokenFromLocalStorageAtom: Atom<boolean>;
  accessTokenIsActiveAtom: Atom<boolean>;
}

const DEFAULT_CONFIG: Required<AuthFetchConfig> = {
  accessTokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  refreshUrl: '/api/auth.AuthService/RefreshToken',
  loginPath: '/admin/login',
  redirectQueryParam: 'redirect',
  shouldRedirect: (path: string) => !path.includes('/login'),
};

/**
 * Creates an auth fetch hook factory with the given configuration.
 * Returns both the hook and a shared atom for tracking refresh state.
 */
export function createAuthFetch(config: AuthFetchConfig = {}): CreateAuthFetchReturn {
  const mergedConfig: Required<AuthFetchConfig> = {
    accessTokenKey: config.accessTokenKey ?? DEFAULT_CONFIG.accessTokenKey,
    refreshTokenKey: config.refreshTokenKey ?? DEFAULT_CONFIG.refreshTokenKey,
    refreshUrl: config.refreshUrl ?? DEFAULT_CONFIG.refreshUrl,
    loginPath: config.loginPath ?? DEFAULT_CONFIG.loginPath,
    redirectQueryParam: config.redirectQueryParam ?? DEFAULT_CONFIG.redirectQueryParam,
    shouldRedirect: config.shouldRedirect ?? DEFAULT_CONFIG.shouldRedirect,
  };

  const isRefreshingAtom = atom<boolean>(false);

  // Create atoms for token state
  // Internal writable atoms
  const accessTokenAtomBase = atom<string | null>(null);
  const refreshTokenAtomBase = atom<string | null>(null);
  // Export readonly atoms
  const accessTokenAtom = atom((get) => get(accessTokenAtomBase));
  const refreshTokenAtom = atom((get) => get(refreshTokenAtomBase));
  const isLoadingAccessTokenFromLocalStorageAtom = atom(true);

  const accessTokenIsActiveAtom = atom((get) => {
    const accessToken = get(accessTokenAtom);
    const isRefreshing = get(isRefreshingAtom);
    return Boolean(accessToken) && !isRefreshing;
  });

  /**
   * Hook that syncs localStorage state to atoms.
   * This enables cross-tab synchronization and makes token state available via atoms.
   *
   * Why useLocalStorage from usehooks-ts?
   * - It already handles the storage event for cross-tab sync
   * - It handles SSR safely
   * - It's a well-tested library
   */
  function useLocalStorageSync(): void {
    const [accessToken] = useLocalStorage<string | null>(mergedConfig.accessTokenKey, null);
    const [refreshToken] = useLocalStorage<string | null>(mergedConfig.refreshTokenKey, null);
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

  function useAuthFetch(): UseAuthFetchReturn {
    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>(
      mergedConfig.accessTokenKey,
      null,
    );
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>(
      mergedConfig.refreshTokenKey,
      null,
    );
    const [isRefreshing, setIsRefreshing] = useAtom(isRefreshingAtom);
    const isRefreshingRef = useRef(false);
    const refreshPromiseRef = useRef<Promise<void> | null>(null);

    const getAccessToken = () => {
      // Read directly from localStorage to get the latest value immediately
      // This ensures we have the token right after setTokens is called
      if (typeof window !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem(mergedConfig.accessTokenKey) || 'null');
        return stored ? stored : null;
      }
      return accessToken;
    };

    const getRefreshToken = () => {
      // Read directly from localStorage to get the latest value immediately
      // This ensures we have the token right after setTokens is called
      if (typeof window !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem(mergedConfig.refreshTokenKey) || 'null');
        return stored ? stored : null;
      }
      return refreshToken;
    };

    const setTokens = (access: string, refresh: string) => {
      setAccessToken(access);
      setRefreshToken(refresh);
    };

    const clearTokens = () => {
      removeAccessToken();
      removeRefreshToken();
    };

    const authFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = getAccessToken();

      // Clone headers to avoid mutation issues
      const headers = new Headers(init?.headers);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetch(input, { ...init, headers });

      if (response.status === 401) {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token, can't refresh.
          clearTokens();
          return response;
        }

        if (!isRefreshingRef.current) {
          isRefreshingRef.current = true;
          refreshPromiseRef.current = (async () => {
            try {
              setIsRefreshing(true);
              // Perform refresh
              const res = await fetch(mergedConfig.refreshUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              });

              if (!res.ok) throw new Error('Refresh request failed');

              const data = await res.json();
              // Assuming RefreshTokenResponse structure: { success, access_token, refresh_token }
              if (data.success && data.access_token) {
                setTokens(data.access_token, data.refresh_token || refreshToken);
              } else {
                throw new Error('Refresh logic failed');
              }
            } catch (e) {
              console.error('Token refresh failed', e);
              clearTokens();
              // Redirect to login if in browser
              if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (mergedConfig.shouldRedirect(currentPath)) {
                  const redirectUrl = `${mergedConfig.loginPath}?${mergedConfig.redirectQueryParam}=${encodeURIComponent(currentPath)}`;
                  window.location.href = redirectUrl;
                }
              }
              throw e;
            } finally {
              setIsRefreshing(false);
              isRefreshingRef.current = false;
              refreshPromiseRef.current = null;
            }
          })();
        }

        try {
          await refreshPromiseRef.current;
          // Retry with new token
          const newToken = getAccessToken();
          if (newToken) {
            headers.set('Authorization', `Bearer ${newToken}`);
            return fetch(input, { ...init, headers });
          }
        } catch (e) {
          // Refresh failed, return original 401 response
          return response;
        }
      }

      return response;
    };

    return {
      isRefreshingAtom: isRefreshingAtom,
      authFetch,
      getAccessToken,
      getRefreshToken,
      setTokens,
      clearTokens,
    };
  }

  return {
    useAuthFetch,
    useLocalStorageSync,
    isRefreshingAtom,
    accessTokenAtom,
    refreshTokenAtom,
    isLoadingAccessTokenFromLocalStorageAtom,
    accessTokenIsActiveAtom,
  };
}
