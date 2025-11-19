import { atom } from "jotai";
import { User } from "@workspace/proto-gen/src/auth_pb";

export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => !!get(userAtom));

// We don't need to store tokens in atoms because they are handled by localStorage/cookies
// and the fetch transport. But we might want to store loading state.
export const isAuthLoadingAtom = atom(true);

