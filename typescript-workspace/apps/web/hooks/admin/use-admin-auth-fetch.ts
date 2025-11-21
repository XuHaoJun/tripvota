import { createAuthFetch } from '@workspace/fetch-ext';

import { ADMIN_ACCESS_TOKEN_KEY, ADMIN_REFRESH_TOKEN_KEY } from '@/constants/auth';

// Create auth fetch hook factory with admin-specific configuration
const {
  useAuthFetch,
  useLocalStorageSync,
  isRefreshingAtom,
  accessTokenAtom,
  refreshTokenAtom,
  isLoadingAccessTokenFromLocalStorageAtom,
  accessTokenIsActiveAtom,
} = createAuthFetch({
  accessTokenKey: ADMIN_ACCESS_TOKEN_KEY,
  refreshTokenKey: ADMIN_REFRESH_TOKEN_KEY,
  loginPath: '/admin/login',
  redirectQueryParam: 'redirect',
  shouldRedirect: (path) => !path.includes('/login'),
});

// Export the hook for use in components
export const useAdminAuthFetch = useAuthFetch;

// Export atoms and sync hook
export {
  useLocalStorageSync,
  isRefreshingAtom,
  accessTokenAtom,
  refreshTokenAtom,
  isLoadingAccessTokenFromLocalStorageAtom,
  accessTokenIsActiveAtom,
};
