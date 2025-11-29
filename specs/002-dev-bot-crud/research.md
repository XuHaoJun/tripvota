# Research: Dev Bot Management Frontend (GraphQL List & Detail)

## 1. GraphQLClient Custom Fetch Support

### Decision: Use GraphQLClient with request middleware or wrapper for authFetch
**Rationale**: `graphql-request` GraphQLClient constructor accepts a `RequestInit`-like configuration object, but doesn't directly support a custom fetch function in the constructor. However, we can use the `requestConfig` property to intercept requests, or create a wrapper around the client that uses authFetch.

**Alternatives Considered**:
- Direct fetch parameter: Not supported in GraphQLClient constructor
- Request middleware: Can modify headers but doesn't replace fetch
- Wrapper approach: Create a custom fetch wrapper that uses authFetch

**Implementation Notes**:
- Option 1: Use `requestConfig.requestMiddleware` to inject Authorization header from authFetch token
- Option 2: Create a wrapper function that uses authFetch to make requests, then pass to GraphQLClient
- Option 3: Extend GraphQLClient class to override the request method
- **Recommended**: Option 1 - Use request middleware to set headers from authFetch token, as it's the simplest and most maintainable approach

**Source**: 
- `graphql-request` library uses native `fetch` internally
- Can be configured via `RequestInit` but fetch function itself is not replaceable
- Request middleware pattern is used in `learn-projects/refine-postgraphile/packages/postgraphile/src/utils/graphql.ts`

## 2. PostGraphile v5 with @graphile/simplify-inflection

### Decision: Use simplified inflection naming for cleaner GraphQL API
**Rationale**: The `@graphile/simplify-inflection` preset simplifies PostGraphile's default naming conventions, making the API more intuitive. With this preset:
- Table `bots` becomes GraphQL type `Bot`
- Connection query: `bots` (instead of `allBotsConnection`)
- Single record query: `bot(id: UUID!)` (instead of `botById`)
- Relation fields: `realm` (instead of `realmByRealmId`)

**Naming Transformations**:
- Connection queries: `bots(first: Int, after: Cursor, filter: BotFilter, orderBy: [BotOrderBy!])` → returns `BotConnection`
- Single queries: `bot(id: UUID!)` → returns `Bot`
- Types: `Bot`, `BotConnection`, `BotFilter`, `BotOrderBy`, `BotInput`

**Implementation Notes**:
- PostGraphile is already configured with `PgSimplifyInflectionPreset` at `typescript-workspace/apps/postgraphile/graphile.config.ts`
- GraphQL queries should use simplified names: `bots` for list, `bot` for detail
- Connection structure: `{ edges: { node: Bot }[], pageInfo: PageInfo, totalCount: Int }`

**Source**: 
- `learn-projects/refine-postgraphile/examples/data-provider-postgraphile/postgraphile-backend/graphile.config.ts`
- `learn-projects/refine-postgraphile/specs/001-postgraphile-refine-integration/research.md`

## 3. Refine Data Provider for PostGraphile (List & Detail Only)

### Decision: Use @xuhaojun/refine-postgraphile data provider, but only call getList and getOne methods
**Rationale**: The Refine PostGraphile data provider supports all CRUD operations, but we can simply not use the create/update/delete methods. Refine's architecture allows selective use of data provider methods.

**Alternatives Considered**:
- Custom data provider: Would require reimplementing getList and getOne logic
- Wrapper data provider: Unnecessary complexity for MVP
- Use full data provider: Simplest approach, just don't call create/update/delete

**Implementation Notes**:
- Install: `@xuhaojun/refine-postgraphile` package (or use patterns from learn-projects)
- Configure with GraphQLClient instance
- Use `useTable` hook for list page (calls `getList` internally)
- Use `useShow` or custom hook for detail page (calls `getOne`)
- For create/update/delete: Use ConnectRPC directly, not through Refine

**Source**:
- `learn-projects/refine-postgraphile/packages/postgraphile/src/dataProvider/index.ts`
- `learn-projects/refine-postgraphile/examples/data-provider-postgraphile/src/App.tsx`

## 4. Ant Design + shadcn Integration

### Decision: Use Ant Design Table for list, shadcn components for everything else
**Rationale**: Ant Design Table provides robust data table features (sorting, filtering, pagination) that integrate well with Refine's `useTable` hook. For other pages, shadcn provides consistent design system components.

**Styling Considerations**:
- Ant Design uses CSS-in-JS and has its own design tokens
- shadcn uses Tailwind CSS with CSS variables
- Need to ensure both can coexist without style conflicts
- Use Ant Design's `ConfigProvider` to customize theme if needed

**Implementation Notes**:
- List page: Use `@refinedev/antd` `List` and `Table` components
- Wrap Ant Design components in shadcn-styled containers for consistency
- Detail/Create/Edit pages: Use shadcn `Card`, `Button`, `Input`, etc.
- Consider using Ant Design's `ConfigProvider` to match shadcn color scheme

**Source**:
- `learn-projects/refine-postgraphile/examples/data-provider-postgraphile/src/pages/categories/list.tsx`
- Existing shadcn setup at `typescript-workspace/apps/web/components.json`

## 5. Refine Testing Approach

### Decision: Integration tests for GraphQL queries, unit tests for complex logic
**Rationale**: Following Constitution principle II (Testing Standards for Complex Logic Only), we should test:
- GraphQL query generation logic (if custom)
- Complex filtering/sorting transformations
- Integration with PostGraphile API

**Testing Strategy**:
- **Skip**: Trivial component rendering tests
- **Include**: GraphQL query integration tests (verify queries work against PostGraphile)
- **Include**: Complex business logic (filter transformations, pagination logic)
- **Consider**: E2E tests for critical user flows (list view, detail view)

**Implementation Notes**:
- Use Vitest for unit/integration tests (if needed)
- Mock GraphQLClient for unit tests
- Use real PostGraphile endpoint for integration tests (if test environment available)
- Focus on testing data transformation logic, not UI rendering

**Source**: Constitution principle II, existing test patterns in codebase

## 6. PostGraphile GraphQL Schema for Bots

### Decision: Use PostGraphile's auto-generated schema with introspection
**Rationale**: PostGraphile automatically generates GraphQL schema from PostgreSQL tables. We can use GraphiQL or schema introspection to discover exact field names and types.

**Expected GraphQL Types** (with simplify-inflection):
```graphql
type Bot {
  id: UUID!
  realmId: UUID!
  name: String!
  displayName: String!
  description: String
  apiChannelBridgeId: UUID
  oauthChannelBridgeId: UUID
  isActive: Boolean!
  capabilities: [String!]
  metadata: JSON
  createdAt: Datetime!
  updatedAt: Datetime!
  realm: Realm
  apiChannelBridge: ChannelBridge
  oauthChannelBridge: ChannelBridge
}

type BotConnection {
  edges: [BotEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type BotEdge {
  node: Bot!
  cursor: Cursor!
}

input BotFilter {
  id: UUIDFilter
  realmId: UUIDFilter
  name: StringFilter
  isActive: BooleanFilter
  # ... other field filters
  and: [BotFilter!]
  or: [BotFilter!]
  not: BotFilter
}

enum BotOrderBy {
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  # ... other fields
}
```

**Query Examples**:
```graphql
# List query
query GetBots($first: Int, $after: Cursor, $filter: BotFilter, $orderBy: [BotOrderBy!]) {
  bots(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
    edges {
      node {
        id
        name
        displayName
        isActive
        createdAt
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}

# Detail query
query GetBot($id: UUID!) {
  bot(id: $id) {
    id
    name
    displayName
    description
    isActive
    capabilities
    metadata
    createdAt
    updatedAt
    realm {
      id
      name
    }
    apiChannelBridge {
      id
      name
    }
    oauthChannelBridge {
      id
      name
    }
  }
}
```

**Implementation Notes**:
- Use GraphiQL at `http://localhost:5000` to explore schema
- Generate TypeScript types from GraphQL schema (using codegen if needed)
- Field names use camelCase (PostGraphile convention)
- Timestamps are `Datetime!` type
- Arrays are `[Type!]` (non-nullable items)
- JSONB maps to `JSON` scalar type

**Source**:
- `docs/sql/mvp.sql` - bots table schema
- PostGraphile GraphiQL endpoint (when server is running)
- `learn-projects/refine-postgraphile/examples/data-provider-postgraphile/src/pages/categories/queries.tsx`

## 7. GraphQL Code Generation Setup

### Decision: Use `@graphql-codegen/cli` with TypeScript plugins to generate types from PostGraphile schema and query documents
**Rationale**: Type-safe GraphQL operations require generated TypeScript types that match the PostGraphile schema. Code generation ensures type safety and prevents runtime errors from schema mismatches.

**Codegen Configuration Pattern**:
- **Two-file generation approach**:
  1. `lib/graphql/schema.types.ts` - All GraphQL schema types (Bot, BotConnection, BotFilter, etc.) generated from PostGraphile schema introspection
  2. `lib/graphql/types.ts` - TypeScript types for specific queries/mutations (GetBotsQuery, GetBotsQueryVariables, etc.) generated from GraphQL documents in codebase

**Configuration**:
- Use `graphql.config.ts` with `@graphql-codegen/cli`
- Schema source: PostGraphile GraphQL endpoint (`http://localhost:5000/graphql`)
- Document scanning: `app/**/*.{ts,tsx}`, `hooks/**/*.{ts,tsx}`, `components/**/*.{ts,tsx}`
- Plugins:
  - `@graphql-codegen/typescript` - Generate schema types
  - `@graphql-codegen/typescript-operations` - Generate operation types
  - `@graphql-codegen/import-types-preset` - Import types from schema.types.ts

**Workflow**:
1. Write GraphQL queries using `gql` from `graphql-tag` in `.ts`/`.tsx` files
2. Run `pnpm codegen` to generate types
3. Import generated types: `import type { GetBotsQuery, GetBotsQueryVariables } from '@/lib/graphql/types'`
4. Use types for type-safe GraphQL operations

**Implementation Notes**:
- Run codegen after creating/updating GraphQL queries
- Run codegen after PostGraphile schema changes (restart PostGraphile first)
- Generated files should be committed to git (they're source of truth for types)
- Use `codegen:watch` during development for automatic regeneration

**Source**:
- `learn-projects/refine-postgraphile/examples/data-provider-postgraphile/graphql.config.ts`
- `learn-projects/refine-postgraphile/examples/data-provider-postgraphile/src/graphql/schema.types.ts` (generated)
- `learn-projects/refine-postgraphile/examples/data-provider-postgraphile/src/graphql/types.ts` (generated)

## Summary of Key Decisions

1. **GraphQLClient Auth**: Use request middleware to inject Authorization header from authFetch token
2. **PostGraphile Naming**: Use simplified inflection (already configured) - `bots` for list, `bot` for detail
3. **Refine Usage**: Use full data provider but only call `getList` and `getOne` methods
4. **UI Components**: Ant Design Table for list, shadcn for all other pages
5. **Testing**: Integration tests for GraphQL, unit tests for complex logic only
6. **Schema Discovery**: Use PostGraphile GraphiQL/introspection to get exact field names and types
7. **Type Generation**: Use `graphql-codegen` to generate TypeScript types from PostGraphile schema and query documents (two-file pattern: schema.types.ts and types.ts)

