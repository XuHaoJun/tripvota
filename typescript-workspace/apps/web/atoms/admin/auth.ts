/**
 * Re-export atoms and hooks from the auth fetch module.
 * This file serves as a convenience export point for admin auth state.
 */

export interface LocalStorageAuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export {
  useLocalStorageSync,
  isRefreshingAtom,
  accessTokenAtom,
  refreshTokenAtom,
  isLoadingAccessTokenFromLocalStorageAtom,
  accessTokenIsActiveAtom,
} from '@/hooks/admin/use-admin-auth-fetch';
