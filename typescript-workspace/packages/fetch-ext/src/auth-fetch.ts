const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REFRESH_URL = '/api/auth.AuthService/RefreshToken'; // Default path for ConnectRPC

export const getAccessToken = () => (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null);
export const getRefreshToken = () => (typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null);
export const setTokens = (access: string, refresh: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export const authFetch: typeof fetch = async (input, init) => {
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

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          // Perform refresh
          const res = await fetch(REFRESH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
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
            if (!currentPath.includes('/login')) {
              window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
            }
          }
          throw e;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
    }

    try {
      await refreshPromise;
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
