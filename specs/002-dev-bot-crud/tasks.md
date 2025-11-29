# Tasks: Dev Bot Management Frontend (GraphQL List & Detail)

**Input**: Design documents from `/specs/002-dev-bot-crud/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are OPTIONAL per Constitution. Only complex logic (GraphQL query transformations, filter building) will be tested if needed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Frontend: `typescript-workspace/apps/web/`
- Pages: `app/admin/bot/`
- Hooks: `hooks/bot/`
- Components: `components/bot/`
- GraphQL: `lib/graphql/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Install frontend dependencies in `typescript-workspace/apps/web/package.json`: `@refinedev/core`, `@refinedev/antd`, `@refinedev/react-router`, `graphql-request`, `graphql-tag`, `antd`, `@xuhaojun/refine-postgraphile`
- [ ] T002 [P] Install codegen dependencies in `typescript-workspace/apps/web/package.json`: `@graphql-codegen/cli`, `@graphql-codegen/typescript`, `@graphql-codegen/typescript-operations`, `@graphql-codegen/import-types-preset`, `graphql-config`
- [ ] T003 [P] Create directory structure: `typescript-workspace/apps/web/app/admin/bot/`, `typescript-workspace/apps/web/hooks/bot/`, `typescript-workspace/apps/web/components/bot/`, `typescript-workspace/apps/web/lib/graphql/`
- [ ] T004 [P] Configure GraphQL codegen in `typescript-workspace/apps/web/graphql.config.ts` with schema endpoint, document scanning, and two-file generation (schema.types.ts and types.ts)
- [ ] T005 Add codegen scripts to `typescript-workspace/apps/web/package.json`: `"codegen": "graphql-codegen"` and `"codegen:watch": "graphql-codegen --watch"`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create GraphQL client with auth in `typescript-workspace/apps/web/lib/graphql/client.ts` using request middleware to inject Authorization header from authFetch
- [ ] T007 [P] Create PostGraphile data provider wrapper in `typescript-workspace/apps/web/lib/refine/postgraphile-data-provider.ts` implementing only `getList` and `getOne` methods
- [ ] T008 [P] Create GraphQL query definitions in `typescript-workspace/apps/web/hooks/bot/use-bot-queries.ts` with `BOTS_QUERY` and `BOT_QUERY` using `gql` from `graphql-tag`
- [ ] T009 Run `pnpm codegen` to generate TypeScript types in `typescript-workspace/apps/web/lib/graphql/schema.types.ts` and `typescript-workspace/apps/web/lib/graphql/types.ts`
- [ ] T010 Verify PostGraphile server is running and accessible at configured GraphQL endpoint

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Bot List (Priority: P1) 🎯 MVP

**Goal**: Display a list of all bots in the current user's realm with key information (name, status, creation date) using GraphQL and Refine framework

**Independent Test**: Navigate to `/admin/bot` and verify that all bots in the current realm are displayed in a list format with display name, status (active/inactive), and creation date. Verify empty state when no bots exist.

### Implementation for User Story 1

- [ ] T011 [US1] Create bot list page component in `typescript-workspace/apps/web/app/admin/bot/page.tsx` using Refine `List` component with Ant Design `Table`
- [ ] T012 [US1] Create Refine hook for bot list in `typescript-workspace/apps/web/hooks/bot/use-bot-list.ts` using `useTable` from `@refinedev/antd` with PostGraphile data provider
- [ ] T013 [US1] Configure Refine provider in `typescript-workspace/apps/web/app/admin/bot/layout.tsx` or parent layout with PostGraphile data provider and bots resource
- [ ] T014 [US1] Implement Ant Design table columns in `typescript-workspace/apps/web/app/admin/bot/page.tsx` for display name, status (with visual distinction), and creation date
- [ ] T015 [US1] Add empty state component in `typescript-workspace/apps/web/app/admin/bot/page.tsx` showing message when no bots exist
- [ ] T016 [US1] Implement loading overlay in `typescript-workspace/apps/web/app/admin/bot/page.tsx` that shows over previous content during data fetch/refresh
- [ ] T017 [US1] Add pagination support using Refine's pagination with PostGraphile connection-based pagination (first/after cursor)
- [ ] T018 [US1] Implement search functionality in `typescript-workspace/apps/web/app/admin/bot/page.tsx` allowing search by bot name and display name using BotFilter
- [ ] T019 [US1] Implement filter functionality in `typescript-workspace/apps/web/app/admin/bot/page.tsx` allowing filter by status (active/inactive), realm, and channel bridge using BotFilter
- [ ] T020 [US1] Create helper function in `typescript-workspace/apps/web/lib/refine/postgraphile-data-provider.ts` to convert Refine filters to PostGraphile BotFilter format
- [ ] T021 [US1] Create helper function in `typescript-workspace/apps/web/lib/refine/postgraphile-data-provider.ts` to convert Refine sorters to BotOrderBy enum values

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can view bot list with search, filter, and pagination.

---

## Phase 4: User Story 2 - Create New Bot (Priority: P1)

**Goal**: Allow users to create new bots with required configuration (name, display name, at least one channel bridge) using ConnectRPC

**Independent Test**: Click "Create Bot" button, fill in required fields (name, display name, at least one channel bridge), submit form, and verify bot appears in the list.

### Implementation for User Story 2

- [ ] T022 [US2] Create bot create page component in `typescript-workspace/apps/web/app/admin/bot/create/page.tsx` using shadcn components (Card, Form, Input, Button)
- [ ] T023 [US2] Create bot create form component in `typescript-workspace/apps/web/components/bot/bot-create-form.tsx` with fields: name, display name, description, capabilities (free-form), API channel bridge selector, OAuth channel bridge selector
- [ ] T024 [US2] Implement inline channel bridge creation in `typescript-workspace/apps/web/components/bot/bot-create-form.tsx` allowing users to create new channel bridges during bot creation
- [ ] T025 [US2] Add form validation in `typescript-workspace/apps/web/components/bot/bot-create-form.tsx` requiring name, display name, and at least one channel bridge (API or OAuth)
- [ ] T026 [US2] Create ConnectRPC hook for bot creation in `typescript-workspace/apps/web/hooks/bot/use-bot-create.ts` using existing ConnectRPC client infrastructure
- [ ] T027 [US2] Implement form submission handler in `typescript-workspace/apps/web/components/bot/bot-create-form.tsx` calling ConnectRPC create endpoint
- [ ] T028 [US2] Add success message and redirect to bot list or detail page after successful creation in `typescript-workspace/apps/web/components/bot/bot-create-form.tsx`
- [ ] T029 [US2] Display validation errors in `typescript-workspace/apps/web/components/bot/bot-create-form.tsx` for invalid or missing required fields
- [ ] T030 [US2] Implement duplicate name validation in `typescript-workspace/apps/web/components/bot/bot-create-form.tsx` checking for duplicate bot names within the same realm before submission

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can view bot list and create new bots.

---

## Phase 5: User Story 3 - View Bot Details (Priority: P2)

**Goal**: Display detailed information about a specific bot including all attributes and relations using GraphQL

**Independent Test**: Click on a bot from the list and verify all bot attributes are displayed in a readable format.

### Implementation for User Story 3

- [ ] T031 [US3] Create bot detail page component in `typescript-workspace/apps/web/app/admin/bot/[id]/page.tsx` using shadcn Card components
- [ ] T032 [US3] Create GraphQL hook for bot detail in `typescript-workspace/apps/web/hooks/bot/use-bot-detail.ts` using `BOT_QUERY` with generated types
- [ ] T033 [US3] Implement bot detail card component in `typescript-workspace/apps/web/components/bot/bot-detail-card.tsx` displaying all bot fields: name, display name, description, status, channel bridges, capabilities, metadata (read-only), timestamps
- [ ] T034 [US3] Display realm information in `typescript-workspace/apps/web/components/bot/bot-detail-card.tsx` showing which realm the bot belongs to
- [ ] T035 [US3] Display channel bridge information in `typescript-workspace/apps/web/components/bot/bot-detail-card.tsx` showing API and OAuth channel bridges with their details
- [ ] T036 [US3] Handle empty optional fields in `typescript-workspace/apps/web/components/bot/bot-detail-card.tsx` showing "Not set" or empty state rather than hiding fields
- [ ] T037 [US3] Implement loading overlay in `typescript-workspace/apps/web/app/admin/bot/[id]/page.tsx` that shows over previous content during data fetch/refresh
- [ ] T038 [US3] Add error handling in `typescript-workspace/apps/web/app/admin/bot/[id]/page.tsx` for bot not found or fetch errors

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can view bot list, create bots, and view bot details.

---

## Phase 6: User Story 4 - Update Existing Bot (Priority: P2)

**Goal**: Allow users to update bot configuration (name, display name, description, status, channel bridges, capabilities) using ConnectRPC

**Independent Test**: Open a bot for editing, change one or more fields, submit, and verify changes are saved and reflected in the bot list/details.

### Implementation for User Story 4

- [ ] T039 [US4] Create bot edit page component in `typescript-workspace/apps/web/app/admin/bot/edit/[id]/page.tsx` using shadcn components
- [ ] T040 [US4] Create bot edit form component in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` pre-filled with current bot values from GraphQL query
- [ ] T041 [US4] Implement form fields in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` for editable fields: name, display name, description, status toggle, channel bridges (select from existing only), capabilities (free-form)
- [ ] T042 [US4] Display metadata field as read-only in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` (not editable through UI)
- [ ] T043 [US4] Restrict channel bridge selection in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` to existing channel bridges only (no inline creation during edit)
- [ ] T044 [US4] Add validation in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` preventing save if all channel bridges are removed (at least one must remain)
- [ ] T045 [US4] Create ConnectRPC hook for bot update in `typescript-workspace/apps/web/hooks/bot/use-bot-update.ts` using existing ConnectRPC client infrastructure
- [ ] T046 [US4] Implement concurrent edit detection in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` comparing `updated_at` timestamp from initial load with current value before save
- [ ] T047 [US4] Add warning dialog in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` if bot was modified since user loaded it for editing (before accepting save)
- [ ] T048 [US4] Implement form submission handler in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` calling ConnectRPC update endpoint with last-write-wins strategy
- [ ] T049 [US4] Add success message and update UI after successful update in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx`
- [ ] T050 [US4] Implement duplicate name validation in `typescript-workspace/apps/web/components/bot/bot-edit-form.tsx` checking for duplicate bot names within the same realm (excluding current bot)
- [ ] T051 [US4] Ensure status changes are immediately reflected in bot list after update

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently. Users can view, create, view details, and update bots.

---

## Phase 7: User Story 5 - Delete Bot (Priority: P3)

**Goal**: Allow users to delete bots that are no longer needed using ConnectRPC

**Independent Test**: Select a bot for deletion, confirm the action, and verify the bot is removed from the list.

### Implementation for User Story 5

- [ ] T052 [US5] Add delete button to bot detail page in `typescript-workspace/apps/web/app/admin/bot/[id]/page.tsx`
- [ ] T053 [US5] Add delete action to bot list page in `typescript-workspace/apps/web/app/admin/bot/page.tsx` (table row action)
- [ ] T054 [US5] Create confirmation dialog component in `typescript-workspace/apps/web/components/bot/bot-delete-dialog.tsx` using shadcn Dialog component
- [ ] T055 [US5] Create ConnectRPC hook for bot deletion in `typescript-workspace/apps/web/hooks/bot/use-bot-delete.ts` using existing ConnectRPC client infrastructure
- [ ] T056 [US5] Implement delete handler in `typescript-workspace/apps/web/components/bot/bot-delete-dialog.tsx` calling ConnectRPC delete endpoint
- [ ] T057 [US5] Add success message and redirect to bot list after successful deletion in `typescript-workspace/apps/web/components/bot/bot-delete-dialog.tsx`
- [ ] T058 [US5] Handle deletion cancellation in `typescript-workspace/apps/web/components/bot/bot-delete-dialog.tsx` (no deletion occurs, remain on current page)
- [ ] T059 [US5] Add error handling in `typescript-workspace/apps/web/components/bot/bot-delete-dialog.tsx` for deletion failures (e.g., bot in use) with appropriate error messages

**Checkpoint**: All user stories should now be independently functional. Users can view, create, view details, update, and delete bots.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T060 [P] Add error handling and retry button for failed operations across all pages (list, detail, create, edit)
- [ ] T061 [P] Implement network error handling with user-friendly messages and retry functionality in `typescript-workspace/apps/web/hooks/bot/use-bot-list.ts` and other hooks
- [ ] T062 [P] Add permission checks and access denied messages for bot management operations
- [ ] T063 [P] Implement truncation for long bot names/descriptions in list view while showing full content in detail view
- [ ] T064 [P] Add Ant Design ConfigProvider in `typescript-workspace/apps/web/app/admin/bot/layout.tsx` to match shadcn color scheme for consistent styling
- [ ] T065 [P] Verify performance requirements: bot list loads within 2 seconds (SC-001) and supports 1000+ bots per realm (SC-007)
- [ ] T066 [P] Run `pnpm codegen` to ensure all GraphQL types are up to date
- [ ] T067 [P] Update documentation in `specs/002-dev-bot-crud/quickstart.md` with any implementation notes or deviations
- [ ] T068 Code cleanup and refactoring: ensure consistent error handling patterns across all components
- [ ] T069 Verify all acceptance scenarios from spec.md are met for each user story

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent from US1, uses ConnectRPC
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Uses GraphQL like US1, but independent
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Uses ConnectRPC like US2, but independent
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Uses ConnectRPC, independent

### Within Each User Story

- GraphQL queries must be defined before hooks that use them
- Hooks must be created before components that use them
- Components must be created before pages that use them
- Form validation before submission handlers
- Core implementation before error handling

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational tasks marked [P] can run in parallel (T007, T008)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- GraphQL query definitions (T008) and data provider (T007) can run in parallel
- Bot create form (T023) and ConnectRPC hook (T026) can run in parallel
- Bot detail card (T033) and GraphQL hook (T032) can run in parallel
- Bot edit form (T040) and ConnectRPC hook (T045) can run in parallel
- Delete dialog (T054) and ConnectRPC hook (T055) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch foundational tasks in parallel:
Task: "Create PostGraphile data provider wrapper in lib/refine/postgraphile-data-provider.ts"
Task: "Create GraphQL query definitions in hooks/bot/use-bot-queries.ts"

# After codegen, launch US1 implementation tasks in parallel:
Task: "Create bot list page component in app/admin/bot/page.tsx"
Task: "Create Refine hook for bot list in hooks/bot/use-bot-list.ts"
Task: "Create helper function to convert Refine filters to PostGraphile BotFilter format"
Task: "Create helper function to convert Refine sorters to BotOrderBy enum values"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T010) - **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (T011-T021)
4. **STOP and VALIDATE**: Test User Story 1 independently - navigate to `/admin/bot`, verify list displays, search, filter, pagination work
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (View List) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Create) → Test independently → Deploy/Demo
4. Add User Story 3 (View Details) → Test independently → Deploy/Demo
5. Add User Story 4 (Update) → Test independently → Deploy/Demo
6. Add User Story 5 (Delete) → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (View List) - GraphQL + Refine
   - Developer B: User Story 2 (Create) - ConnectRPC
   - Developer C: User Story 3 (View Details) - GraphQL
3. After P1 stories complete:
   - Developer A: User Story 4 (Update) - ConnectRPC
   - Developer B: User Story 5 (Delete) - ConnectRPC
   - Developer C: Polish & Cross-cutting
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- GraphQL types must be regenerated (`pnpm codegen`) after creating/updating queries
- PostGraphile server must be running before codegen and during development
- Use generated types from `lib/graphql/types.ts` for type-safe GraphQL operations
- List page uses Ant Design + shadcn, other pages use shadcn first
- Create/update/delete use ConnectRPC, not GraphQL mutations
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

