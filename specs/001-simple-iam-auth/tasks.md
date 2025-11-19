# Tasks: Simple IAM / Auth

## Feature Information

- **Feature**: Simple IAM / Auth
- **Branch**: `001-simple-iam-auth`
- **Specification**: [spec.md](spec.md)
- **Design**: [plan.md](plan.md)
- **Status**: Complete

## Implementation Strategy

- **MVP Scope**: User Registration (US1) and Login (US2).
- **Approach**:
  - **Setup**: Establish shared proto, dependencies, and project structure changes.
  - **Foundational**: Build the `fetch-ext` custom transport and basic UI components needed for forms.
  - **Incremental**: Implement US1 (Register) end-to-end, then US2 (Login) end-to-end.
  - **Parallel**: Backend RPCs and Frontend Pages can be built in parallel once the Proto and Types are generated.

## Dependencies

1. **Phase 1 (Setup)**: Blocks everything.
2. **Phase 2 (Foundational)**: Blocks all User Stories.
3. **Phase 3 (US1)**: Independent.
4. **Phase 4 (US2)**: Independent implementation, but logically follows US1 for testing.
5. **Phase 5 (US3)**: Depends on US2 (Auth state).
6. **Phase 6 (US4)**: Depends on US2 (User data for Avatar) and US3 (Logout logic).

---

## Phase 1: Setup

**Goal**: Initialize project structure, dependencies, and contracts.

- [x] T001 Define Protobuf contract in `share/proto/auth.proto`
- [x] T002 Regenerate Protobuf code (Run buf generate) for both workspaces
- [x] T003 Update `rust-workspace/apps/server/Cargo.toml` with auth dependencies (argon2, jsonwebtoken, axum-extra)
- [x] T004 Create `typescript-workspace/packages/fetch-ext/package.json` and init package
- [x] T005 Update `typescript-workspace/apps/web/package.json` to depend on `fetch-ext`
- [x] T006 Ensure `accounts` table migration exists in `rust-workspace/packages/migration` (verify vs `mvp.sql`)
- [x] T007 [P] Generate SeaORM entities in `rust-workspace/packages/entity`

## Phase 2: Foundational

**Goal**: Core infrastructure for Auth (Transport & UI).

- [x] T008 [P] Implement JWT utilities (sign/verify) in `rust-workspace/apps/server/src/auth/jwt.rs`
- [x] T009 [P] Implement Password hashing utilities in `rust-workspace/apps/server/src/auth/password.rs`
- [x] T010 Implement `authFetch` with 401 interceptor in `typescript-workspace/packages/fetch-ext/src/auth-fetch.ts`
- [x] T011 Export custom transport from `typescript-workspace/packages/fetch-ext/src/index.ts`
- [x] T012 [P] Create reusable `Form` component in `typescript-workspace/packages/ui/src/components/form.tsx`
- [x] T013 [P] Create reusable `Input` component in `typescript-workspace/packages/ui/src/components/input.tsx`
- [x] T014 Register `AuthRouter` (placeholder) in `rust-workspace/apps/server/src/main.rs`
- [x] T015 [P] Ensure UI components `avatar`, `dropdown-menu`, `tooltip` exist in `typescript-workspace/packages/ui/src/components/` (create if missing)

## Phase 3: User Story 1 - User Registration (P1)

**Goal**: Users can create a new account.
**Independent Test**: Navigate to `/admin/register`, submit form, verify DB entry.

- [x] T016 [US1] Implement `Register` RPC logic in `rust-workspace/apps/server/src/auth/service.rs`
- [x] T017 [P] [US1] Create Zod schema for registration in `typescript-workspace/apps/web/lib/schemas/auth.ts`
- [x] T018 [US1] Create Registration Page UI in `typescript-workspace/apps/web/app/admin/register/page.tsx`
- [x] T019 [US1] Integrate Register mutation using ConnectRPC in `typescript-workspace/apps/web/app/admin/register/page.tsx`

## Phase 4: User Story 2 - User Login (P1)

**Goal**: Users can log in and receive tokens.
**Independent Test**: Login with valid credentials -> receive JWT -> redirect.

- [x] T020 [US2] Implement `Login` RPC logic in `rust-workspace/apps/server/src/auth/service.rs`
- [x] T021 [US2] Implement `RefreshToken` RPC logic in `rust-workspace/apps/server/src/auth/service.rs`
- [x] T022 [P] [US2] Create Zod schema for login in `typescript-workspace/apps/web/lib/schemas/auth.ts`
- [x] T023 [US2] Define Auth Atoms (user, token) in `typescript-workspace/apps/web/atoms/auth.ts`
- [x] T024 [US2] Create Login Page UI in `typescript-workspace/apps/web/app/admin/login/page.tsx`
- [x] T025 [US2] Integrate Login mutation and state update in `typescript-workspace/apps/web/app/admin/login/page.tsx`

## Phase 5: User Story 3 - Protected Routes & Logout (P2)

**Goal**: Protect routes and allow logout.
**Independent Test**: Access `/admin/dashboard` unauthenticated (redirect). Authenticated (allow). Logout (redirect).

- [x] T026 [US3] Implement `Me` RPC logic in `rust-workspace/apps/server/src/auth/service.rs`
- [x] T027 [US3] Implement `Logout` RPC logic in `rust-workspace/apps/server/src/auth/service.rs`
- [x] T028 [US3] Create `AuthGuard` component in `typescript-workspace/apps/web/components/auth-guard.tsx`
- [x] T029 [US3] Apply `AuthGuard` to admin layout in `typescript-workspace/apps/web/app/admin/layout.tsx`

## Phase 6: User Story 4 - Admin Layout & Navigation (P2)

**Goal**: Persistent Admin AppBar with User Avatar and Menu.
**Independent Test**: Verify AppBar exists on admin pages. Hover avatar -> tooltip. Click avatar -> menu -> logout.

- [x] T030 [US4] Create `UserNav` component with Avatar, Tooltip, and Dropdown in `typescript-workspace/apps/web/components/user-nav.tsx`
- [x] T031 [US4] Integrate `UserNav` into Admin AppBar in `typescript-workspace/apps/web/app/admin/layout.tsx` (or dedicated `site-header.tsx`)
- [x] T032 [US4] Wire up "Logout" action in `UserNav` to the auth store/RPC

## Phase 7: Polish

**Goal**: Error handling and UX refinements.

- [x] T033 Add toast notifications for success/error in Register/Login pages
- [x] T034 Ensure proper error mapping from RPC errors to Form fields
- [x] T035 [US1] Add "Username" field to Registration form and schema logic
