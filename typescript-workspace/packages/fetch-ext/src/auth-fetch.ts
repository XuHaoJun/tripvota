import { useCallback, useRef } from 'react';

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
}

export class AuthFetchBuilder {
  private config: Required<AuthFetchConfig> = {
    accessTokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    refreshUrl: '/api/auth.AuthService/RefreshToken',
    loginPath: '/admin/login',
    redirectQueryParam: 'redirect',
    shouldRedirect: (path: string) => !path.includes('/login'),
  };

  withAccessTokenKey(key: string): this {
    this.config.accessTokenKey = key;
    return this;
  }

  withRefreshTokenKey(key: string): this {
    this.config.refreshTokenKey = key;
    return this;
  }

  withRefreshUrl(url: string): this {
    this.config.refreshUrl = url;
    return this;
  }

  withLoginPath(path: string): this {
    this.config.loginPath = path;
    return this;
  }

  withRedirectQueryParam(param: string): this {
    this.config.redirectQueryParam = param;
    return this;
  }

  withShouldRedirect(fn: (path: string) => boolean): this {
    this.config.shouldRedirect = fn;
    return this;
  }

  build(): () => UseAuthFetchReturn {
    const config = this.config;

    return function useAuthFetch(): UseAuthFetchReturn {
      const isRefreshingRef = useRef(false);
      const refreshPromiseRef = useRef<Promise<void> | null>(null);

      const getAccessToken = useCallback(() => {
        return typeof window !== 'undefined' ? localStorage.getItem(config.accessTokenKey) : null;
      }, []);

      const getRefreshToken = useCallback(() => {
        return typeof window !== 'undefined' ? localStorage.getItem(config.refreshTokenKey) : null;
      }, []);

      const setTokens = useCallback((access: string, refresh: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(config.accessTokenKey, access);
          localStorage.setItem(config.refreshTokenKey, refresh);
        }
      }, []);

      const clearTokens = useCallback(() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(config.accessTokenKey);
          localStorage.removeItem(config.refreshTokenKey);
        }
      }, []);

      const authFetch = useCallback<typeof fetch>(
        async (input: RequestInfo | URL, init?: RequestInit) => {
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
                  // Perform refresh
                  const res = await fetch(config.refreshUrl, {
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
                    if (config.shouldRedirect(currentPath)) {
                      const redirectUrl = `${config.loginPath}?${config.redirectQueryParam}=${encodeURIComponent(currentPath)}`;
                      window.location.href = redirectUrl;
                    }
                  }
                  throw e;
                } finally {
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
        },
        [getAccessToken, getRefreshToken, setTokens, clearTokens],
      );

      return {
        authFetch,
        getAccessToken,
        getRefreshToken,
        setTokens,
        clearTokens,
      };
    };
  }
}
