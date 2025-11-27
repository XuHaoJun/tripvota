# Implementation Plan: Dev Bot Management Frontend (List & Detail with GraphQL)

**Branch**: `002-dev-bot-crud` | **Date**: 2025-01-27 | **Spec**: `/specs/002-dev-bot-crud/spec.md`
**Input**: Create frontend bot directory at `@bot`, use GraphQL for list and detail pages (based on Refine but only list and detail, NOT update/create/delete). Refine uses Ant Design data table. Learn PostGraphile v5 GraphQL with `@graphile/simplify-inflection` design. Pass `authFetch` to GraphQLClient. Only list page uses Ant Design combined with shadcn, other pages use shadcn first. Backend uses PostGraphile (ONLY for list and detail pages, other CRUD operations use ConnectRPC at Rust, which forwards GraphQL endpoint to PostGraphile endpoint).

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a frontend bot management interface with GraphQL-powered list and detail views using Refine framework. The list page will use Ant Design data table combined with shadcn components, while detail and other pages prioritize shadcn. PostGraphile v5 with `@graphile/simplify-inflection` will provide GraphQL API for read operations (list and detail), while create/update/delete operations will use ConnectRPC through Rust backend. Authentication will be handled by passing `authFetch` to GraphQLClient.

## Technical Context

**Language/Version**: TypeScript 5.9+, React 19.2+, Next.js 16.0+  
**Primary Dependencies**: 
- Frontend: `@refinedev/core`, `@refinedev/antd`, `@refinedev/react-router`, `graphql-request`, `graphql-tag`, `antd`, `@graphile/simplify-inflection`, `@xuhaojun/refine-postgraphile`
- Backend: PostGraphile v5 (already configured at `typescript-workspace/apps/postgraphile`), Rust with ConnectRPC
- UI: shadcn/ui components, Ant Design (for list page only)
**Storage**: PostgreSQL (bots table already exists in schema)  
**Testing**: NEEDS CLARIFICATION - Determine testing approach for Refine components and GraphQL integration  
**Target Platform**: Web browser (Next.js app router)  
**Project Type**: Web application (monorepo structure - frontend in `typescript-workspace/apps/web`)  
**Performance Goals**: 
- Bot list page loads within 2 seconds (per spec SC-001)
- Support managing 1000+ bots per realm without performance degradation (per spec SC-007)
**Constraints**: 
- GraphQLClient must accept custom fetch function (authFetch) - NEEDS CLARIFICATION
- PostGraphile must use `@graphile/simplify-inflection` for simplified naming
- Only list and detail pages use GraphQL/Refine; create/update/delete use ConnectRPC
- List page combines Ant Design with shadcn; other pages use shadcn first
**Scale/Scope**: 
- Single feature module: bot management pages
- 3-4 pages: list, detail, create (ConnectRPC), edit (ConnectRPC)
- Integration with existing auth system (`@workspace/fetch-ext`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality ✅
- Plan uses standard React/Next.js patterns
- Refine framework provides structured approach to data fetching
- GraphQL queries will be properly typed and organized

### II. Testing Standards (Complex Logic Only) ⚠️
- **NEEDS CLARIFICATION**: Determine testing approach for Refine components
- GraphQL query logic may need integration tests
- Complex business logic (filtering, pagination) should be tested

### III. User Experience Consistency ✅
- Using existing shadcn components for consistency
- Ant Design integration only for list page (as specified)
- Follows existing admin layout patterns (`/admin/layout.tsx`)

### IV. Performance Requirements (MVP) ✅
- Performance goals align with spec requirements (2s load time, 1000+ bots support)
- PostGraphile provides efficient GraphQL queries with connection-based pagination
- No premature optimization planned

### V. MVP Mindset (No Overdesign) ✅
- Only implementing list and detail with GraphQL (as specified)
- Create/update/delete use existing ConnectRPC infrastructure
- Minimal new dependencies (Refine, graphql-request, antd for list only)

**Gate Status**: ✅ PASS (with clarification needed on testing approach)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
typescript-workspace/apps/web/
├── app/
│   └── admin/
│       └── bot/
│           ├── page.tsx                    # List page (Refine + Ant Design + shadcn)
│           ├── [id]/
│           │   └── page.tsx                # Detail page (shadcn, GraphQL)
│           ├── create/
│           │   └── page.tsx                # Create page (shadcn, ConnectRPC)
│           └── edit/
│               └── [id]/
│                   └── page.tsx            # Edit page (shadcn, ConnectRPC)
├── components/
│   └── bot/                                # Bot-specific components (if needed)
│       ├── bot-list-table.tsx              # Ant Design table wrapper
│       └── bot-detail-card.tsx             # Detail view component
├── hooks/
│   └── bot/
│       ├── use-bot-list.ts                 # Refine hook for list
│       ├── use-bot-detail.ts               # GraphQL hook for detail
│       └── use-bot-queries.ts              # GraphQL queries (gql)
└── lib/
    └── graphql/
        ├── client.ts                       # GraphQLClient setup with authFetch
        └── fragments.ts                    # GraphQL fragments for bot

typescript-workspace/apps/postgraphile/
└── [Already configured - no changes needed]

rust-workspace/apps/server/
└── [ConnectRPC endpoints for create/update/delete - out of scope for this plan]
```

**Structure Decision**: 
- Frontend feature module in Next.js app router structure (`app/admin/bot/`)
- GraphQL client configuration in `lib/graphql/` following existing patterns
- Hooks directory for data fetching logic
- Components directory for reusable UI components
- PostGraphile backend already configured at `typescript-workspace/apps/postgraphile` - no changes needed

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. The implementation follows MVP principles:
- Reuses existing PostGraphile setup
- Uses established Refine patterns for data fetching
- Minimal new dependencies (only Refine and graphql-request)
- Leverages existing auth infrastructure (`authFetch`)

## Phase 0: Outline & Research

### Research Tasks

1. **GraphQLClient Custom Fetch Support**
   - Research: Does `graphql-request` GraphQLClient support custom fetch function?
   - Rationale: Need to pass `authFetch` for authentication
   - Source: Check `graphql-request` documentation and source code
   - Alternative: If not supported, use request middleware or wrapper

2. **PostGraphile v5 with @graphile/simplify-inflection**
   - Research: Understand simplified inflection naming conventions
   - Rationale: Must match PostGraphile schema naming for GraphQL queries
   - Source: Study `learn-projects/refine-postgraphile/examples/data-provider-postgraphile`
   - Learn: How `bots` table maps to GraphQL types (likely `Bot`, `BotConnection`, etc.)

3. **Refine Data Provider for PostGraphile (List & Detail Only)**
   - Research: How to configure Refine data provider to only support `getList` and `getOne`
   - Rationale: Create/update/delete will use ConnectRPC, not Refine
   - Source: Study `@xuhaojun/refine-postgraphile` package structure
   - Learn: Custom data provider implementation or configuration options

4. **Ant Design + shadcn Integration**
   - Research: Best practices for combining Ant Design Table with shadcn components
   - Rationale: List page must use both, other pages use shadcn only
   - Source: Check existing patterns in codebase
   - Learn: Styling compatibility and component composition

5. **Refine Testing Approach**
   - Research: Testing strategies for Refine components and GraphQL integration
   - Rationale: Constitution requires testing for complex logic
   - Source: Refine documentation, existing test patterns
   - Decision: Determine if integration tests or unit tests are appropriate

6. **PostGraphile GraphQL Schema for Bots**
   - Research: Generate or inspect PostGraphile schema for bots table
   - Rationale: Need exact field names and types for GraphQL queries
   - Source: PostGraphile GraphiQL endpoint, schema introspection
   - Learn: Connection-based pagination structure, filter types, orderBy options

### Research Output

All research findings will be documented in `research.md` with:
- Decision: [what was chosen]
- Rationale: [why chosen]
- Alternatives considered: [what else evaluated]
- Implementation notes: [how to implement]

## Phase 1: Design & Contracts

### Prerequisites
- ✅ `research.md` complete with all NEEDS CLARIFICATION resolved

### Design Artifacts

1. **data-model.md**
   - Extract from existing schema: `docs/sql/mvp.sql` bots table
   - Document GraphQL type mappings (PostGraphile generated types)
   - Field relationships: realm_id, api_channel_bridge_id, oauth_channel_bridge_id
   - Validation rules: at least one channel bridge required

2. **contracts/ (GraphQL Schema)**
   - Bot list query: Connection-based pagination with filters
   - Bot detail query: Single bot by ID
   - Document PostGraphile-generated types:
     - `Bot` type
     - `BotConnection` type
     - `BotFilter` type
     - `BotOrderBy` type
   - Note: Mutations NOT included (handled by ConnectRPC)

3. **quickstart.md**
   - Setup instructions for Refine + PostGraphile integration
   - GraphQLClient configuration with authFetch
   - Example GraphQL queries for bots list and detail
   - Component structure and routing setup

### Agent Context Update

After Phase 1 design complete:
- Run `.specify/scripts/bash/update-agent-context.sh cursor-agent`
- Add new technologies: Refine, PostGraphile GraphQL integration patterns
- Preserve manual additions between markers

### Phase 1 Output Checklist

- [x] `data-model.md` - Bot entity and GraphQL type mappings
- [x] `contracts/bot.graphql` - GraphQL queries for list and detail
- [x] `quickstart.md` - Setup and integration guide
- [x] Agent context updated with Refine/PostGraphile patterns
