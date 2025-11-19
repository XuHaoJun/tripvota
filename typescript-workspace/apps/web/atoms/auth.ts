import { atom } from 'jotai';

import { Account } from '@workspace/proto-gen/src/auth_pb';

export const accountAtom = atom<Account | null>(null);
export const isAuthenticatedAtom = atom((get) => !!get(accountAtom));

// We don't need to store tokens in atoms because they are handled by localStorage/cookies
// and the fetch transport. But we might want to store loading state.
// Initialize to false since we're not doing any async auth check on mount
export const isAuthLoadingAtom = atom(false);
