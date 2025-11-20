# Implementation Plan: Simple IAM / Auth

**Branch**: `001-simple-iam-auth` | **Date**: 2025-11-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-simple-iam-auth/spec.md`

## Summary

Implement local authentication (Email/Password) using the existing Keycloak-inspired schema (`accounts` table).
**Backend**: Rust (`axum`, `sea-orm`) with `argon2` hashing and JWT (Access + Refresh tokens).
**Frontend**: Next.js admin routes (`/admin/register`, `/admin/login`) using shared `shadcn` components from `@workspace/ui`, `react-hook-form`, and `zod`.
**UI/UX**: Admin layout with top App Bar, User Avatar (with Tooltip), and Dropdown Menu for Logout.
**Transport**: Custom ConnectRPC transport using `ofetch` for interceptors (Bearer token injection & 401 retry logic).
**Data**: Existing `accounts` table in PostgreSQL.

## Technical Context

**Language/Version**: Rust (Backend), TypeScript/Node.js (Frontend)
**Primary Dependencies**:

- Backend: `axum`, `axum-connect`, `sea-orm`, `argon2`, `jsonwebtoken`
- Frontend: `next`, `react`, `@connectrpc/connect`, `@connectrpc/connect-query`, `ofetch`, `jotai`, `jotai-tanstack-query`, `zod`, `react-hook-form`, `@hookform/resolvers`
- UI Package: `@workspace/ui` (Shared `shadcn` components: `form`, `input`, `button`, `avatar`, `dropdown-menu`, `tooltip`, `popover`)
  **Styling**: Tailwind CSS (Primary), CSS files (Secondary/Fallback if needed).
  **Storage**: PostgreSQL (Existing schema `mvp.sql`)
  **Testing**: `cargo test` (Backend integration), manual verification (Frontend MVP)
  **Target Platform**: Web / Docker containers
  **Project Type**: Monorepo (Web + Server)
  **Performance Goals**: Standard web responsiveness.
  **Constraints**: MVP complexity. Use existing `accounts` table. Local auth only.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **MVP Mindset**: Reusing existing schema. Standard JWT flow.
- [x] **Code Quality**: Consistent patterns.
- [x] **User Experience**: Seamless token refresh handling via `ofetch` interceptors. Admin Layout improves usability.

## Project Structure

### Documentation (this feature)

```text
specs/001-simple-iam-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (Proposed Proto)
└── tasks.md             # Phase 2 output (Tasks)
```

### Source Code (repository root)

```text
rust-workspace/
├── apps/
│   └── server/
│       ├── Cargo.toml       # Add auth dependencies
│       └── src/
│           ├── main.rs      # Register AuthRouter
│           └── auth.rs      # NEW: Auth implementation (Login/Refresh)
├── packages/
│   ├── entity/              # Generated entities (incl. accounts)
│   └── migration/           # Ensure mvp.sql migrations exist
└── ...

typescript-workspace/
├── apps/
│   └── web/
│       ├── app/
│       │   └── admin/
│       │       ├── layout.tsx   # Admin Layout (AppBar + AuthGuard)
│       │       ├── login/       # Login Page
│       │       └── register/    # Register Page
│       ├── components/
│       │   └── user-nav.tsx     # NEW: Avatar + Dropdown + Tooltip
│       └── atoms/               # NEW: Jotai atoms (user state, etc.)
├── packages/
│   ├── ui/                      # Shared UI components
│   │   └── src/
│   │       └── components/
│   │           ├── form.tsx
│   │           ├── input.tsx
│   │           ├── avatar.tsx        # NEW/Check existence
│   │           ├── dropdown-menu.tsx # NEW/Check existence
│   │           ├── tooltip.tsx       # NEW/Check existence
│   │           └── ...
│   ├── fetch-ext/           # NEW: Custom transport (ofetch)
│   │   ├── src/
│   │   │   ├── auth-fetch.ts    # ofetch wrapper + Mutex (Promise) for 401 handling
│   │   │   └── index.ts
│   │   └── package.json
│   ├── proto-gen/           # Generation config
│   └── rpc-client/          # Regenerated client
```

**Structure Decision**: Monorepo structure. Backend logic in `auth.rs`. Frontend transport logic in `packages/fetch-ext`. UI components centralized in `packages/ui`. Global state managed by `jotai` in `apps/web/atoms`.

## Frontend Transport Strategy (`fetch-ext`)

**Blocking Logic**: Uses a shared Promise (mutex pattern) in `auth-fetch.ts` to pause all outgoing requests when a 401 occurs.

**Flow**:

1. Request fails with 401.
2. Check if refresh is in progress. If not, start it (assign Promise).
3. Await the refresh Promise.
4. Retry original request with new token.

**Integration**: `authFetch` is injected into `ConnectTransport` in `rpc-client`.

**State**:

- Component Level: `@connectrpc/connect-query` (`useQuery`, `useMutation`) for standard data fetching.
- Global Level: `jotai` atoms for global user state. `jotai-tanstack-query` integrates with `@connectrpc/connect-query` (via `createQueryOptions`) for atom-based server state synchronization(if do not know how to intergrate connect-query and jotai-tanstack-query you can see dir `learn-projects/connect-query-es`, maybe add new workspace package jotai-connect-query on needed if need large code intergate it).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation        | Why Needed                                                | Simpler Alternative Rejected Because                       |
| ---------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| Custom Transport | Need to handle 401 retry & token injection automatically. | Standard fetch doesn't support robust interceptors easily. |
