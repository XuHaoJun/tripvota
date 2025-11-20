import { AuthFetchBuilder } from '@workspace/fetch-ext';

import { ADMIN_ACCESS_TOKEN_KEY, ADMIN_REFRESH_TOKEN_KEY } from '@/constants/auth';

// Shared auth fetch builder instance
const authFetchBuilder = new AuthFetchBuilder()
  .withAccessTokenKey(ADMIN_ACCESS_TOKEN_KEY)
  .withRefreshTokenKey(ADMIN_REFRESH_TOKEN_KEY)
  .withLoginPath('/admin/login')
  .withRedirectQueryParam('redirect')
  .withShouldRedirect((path) => !path.includes('/login'));

// Export the hook for use in components
export const useAdminAuthFetch = authFetchBuilder.build();
