# Research: Dev Bot Management (Frontend + Backend)

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

## 8. ConnectRPC Service Implementation Pattern

### Decision: Follow AuthService pattern for BotService handlers
**Rationale**: Consistency with existing codebase patterns, proven approach for authentication and error handling. The AuthService implementation provides a clear template for how to structure ConnectRPC handlers.

**Implementation Notes**:
- Create `rust-workspace/apps/server/src/bot/mod.rs` declaring bot module
- Create `rust-workspace/apps/server/src/bot/service.rs` with BotService handlers
- Register endpoints in `main.rs` using `.rpc(BotService::create_bot(create_bot))` pattern
- Use `State<AppState>` extractor for database connection and JWT secret
- Use `Headers` extractor (from auth service) for JWT token extraction
- Follow error handling pattern from `error.rs` (Error enum with RpcIntoError trait)
- Handler signature: `async fn create_bot(State(state): State<AppState>, headers: Headers, request: CreateBotRequest) -> Result<CreateBotResponse, Error>`

**Source**: 
- `rust-workspace/apps/server/src/auth/service.rs` - AuthService implementation pattern
- `rust-workspace/apps/server/src/main.rs` - Service registration pattern (lines 60-64)
- `rust-workspace/apps/server/src/error.rs` - Error handling pattern

## 9. Realm ID Extraction from JWT Token

### Decision: Extract realm_id from authenticated user's account via account_realm_roles relationship
**Rationale**: JWT token contains account_id (sub claim), but not realm_id directly. Need to query account_realm_roles table to get user's realm(s). For MVP, assume single realm per user or use first realm found.

**Alternatives Considered**:
- Add realm_id to JWT claims: Requires JWT schema update and token refresh
- Pass realm_id in request: Less secure, requires frontend to know realm
- Query account_realm_roles: Most flexible, supports multi-realm future

**Implementation Notes**:
- Extract account_id from JWT using existing `extract_account_id_from_headers` pattern from auth service
- Query: `account_realm_roles::Entity::find().filter(account_realm_roles::Column::AccountId.eq(account_id)).one(&conn)`
- For MVP: Use first realm found (or require exactly one realm per user)
- Validate user has access to realm before bot operations
- Future: Support multiple realms per user, allow realm selection

**Query Pattern**:
```rust
let realm_role = account_realm_roles::Entity::find()
    .filter(account_realm_roles::Column::AccountId.eq(account_id))
    .one(&state.conn)
    .await?;
let realm_id = realm_role.ok_or(Error::Forbidden)?.realm_id;
```

**Source**:
- `rust-workspace/apps/server/src/auth/service.rs` - `extract_account_id_from_headers` function (lines 212-235)
- `rust-workspace/packages/entity/src/account_realm_roles.rs` - AccountRealmRoles entity
- `rust-workspace/packages/entity/src/accounts.rs` - Account entity

## 10. SeaORM Database Operations for Bots

### Decision: Use SeaORM ActiveModel pattern for bot and channel_bridge operations
**Rationale**: Consistent with existing codebase (AuthService uses SeaORM), type-safe database operations, automatic timestamp handling, and relationship management. SeaORM 2.0.0-rc provides improved API patterns.

**Implementation Notes**:
- Use `bots::ActiveModel` for create/update operations
- Use `bots::Entity::find()` for queries with filters
- Use `channel_bridge::ActiveModel` for bridge creation
- Use `Set()` for field values, `..Default::default()` for unspecified fields
- Use `Uuid::now_v7()` for generating IDs (matches database default)
- Use `Utc::now().into()` for timestamps (DateTimeWithTimeZone)
- All operations accept either `&DbConn` or `&DatabaseTransaction`

**Create Pattern (Option 1 - Using insert)**:
```rust
let new_bot = bots::ActiveModel {
    id: Set(Uuid::now_v7()),
    realm_id: Set(realm_id),
    name: Set(request.name.clone()),
    display_name: Set(request.display_name.clone()),
    description: Set(request.description.clone()),
    api_channel_bridge_id: Set(api_bridge_id),
    oauth_channel_bridge_id: Set(oauth_bridge_id),
    is_active: Set(request.is_active),
    capabilities: Set(request.capabilities.clone()),
    created_at: Set(Utc::now().into()),
    updated_at: Set(Utc::now().into()),
    ..Default::default()
};
let res = bots::Entity::insert(new_bot).exec(&state.conn).await?;
let bot_id = res.last_insert_id;
```

**Create Pattern (Option 2 - Using save)**:
```rust
let new_bot = bots::ActiveModel {
    id: Set(Uuid::now_v7()),
    realm_id: Set(realm_id),
    name: Set(request.name.clone()),
    // ... other fields
    ..Default::default()
};
let bot = new_bot.save(&state.conn).await?; // Returns ActiveModel
```

**Update Pattern**:
```rust
let mut bot: bots::ActiveModel = bots::Entity::find_by_id(bot_id)
    .one(&state.conn)
    .await?
    .ok_or(DbErr::Custom("Bot not found".to_owned()))?
    .into();

bot.name = Set(new_name);
bot.display_name = Set(new_display_name);
let updated_bot = bot.update(&state.conn).await?; // Returns Model
```

**Query Pattern**:
```rust
let bot = bots::Entity::find()
    .filter(bots::Column::Id.eq(bot_id))
    .filter(bots::Column::RealmId.eq(realm_id))
    .one(&state.conn)
    .await?;
```

**Delete Pattern**:
```rust
let bot = bots::Entity::find_by_id(bot_id)
    .one(&state.conn)
    .await?
    .ok_or(DbErr::Custom("Bot not found".to_owned()))?;
let result = bot.delete(&state.conn).await?; // Returns DeleteResult
```

**Source**:
- `rust-workspace/packages/entity/src/bots.rs` - Bot entity definition
- `rust-workspace/packages/entity/src/channel_bridge.rs` - ChannelBridge entity
- `rust-workspace/apps/server/src/auth/service.rs` - SeaORM usage examples (register function, lines 84-99)
- `learn-projects/sea-orm/examples/basic/src/mutation.rs` - ActiveModel patterns (lines 18-43)
- `learn-projects/sea-orm/examples/axum_example/api/src/service/mutation.rs` - CRUD patterns

## 11. Database Transactions for Bot Creation

### Decision: Use SeaORM transaction API for atomic bot + bridge creation
**Rationale**: Ensure all-or-nothing creation: if bridge creation fails, bot creation should rollback. Prevents orphaned records and maintains data consistency. SeaORM 2.0.0-rc provides two transaction patterns.

**Implementation Notes**:
- **Pattern 1**: Use `db.transaction()` with closure (automatic commit/rollback)
- **Pattern 2**: Use `db.begin().await?` and `txn.commit().await?` (manual control)
- Both patterns accept `&DatabaseTransaction` for all operations
- On error: transaction automatically rolls back when dropped (Pattern 2) or closure returns error (Pattern 1)
- All SeaORM operations work with `&DatabaseTransaction` same as `&DbConn`

**Transaction Pattern 1 (Closure-based - Recommended)**:
```rust
state.conn
    .transaction::<_, _, DbErr>(|txn| {
        Box::pin(async move {
            // Create API bridge if provided
            let api_bridge_id = if let Some(api_bridge) = &request.api_channel_bridge {
                let bridge = channel_bridge::ActiveModel {
                    id: Set(Uuid::now_v7()),
                    bridge_type: Set("api".to_string()),
                    third_provider_type: Set(api_bridge.third_provider_type.clone()),
                    // ... other fields
                    ..Default::default()
                };
                let res = channel_bridge::Entity::insert(bridge).exec(txn).await?;
                Some(res.last_insert_id)
            } else { None };

            // Create OAuth bridge if provided
            // ... similar pattern

            // Create bot with bridge IDs
            let bot = bots::ActiveModel {
                id: Set(Uuid::now_v7()),
                realm_id: Set(realm_id),
                api_channel_bridge_id: Set(api_bridge_id),
                // ... other fields
                ..Default::default()
            };
            let res = bots::Entity::insert(bot).exec(txn).await?;

            Ok(res.last_insert_id)
        })
    })
    .await?;
```

**Transaction Pattern 2 (Manual begin/commit)**:
```rust
let txn = state.conn.begin().await?;

// Create API bridge if provided
let api_bridge_id = if let Some(api_bridge) = &request.api_channel_bridge {
    let bridge = channel_bridge::ActiveModel { /* ... */ };
    let res = channel_bridge::Entity::insert(bridge).exec(&txn).await?;
    Some(res.last_insert_id)
} else { None };

// Create bot with bridge IDs
let bot = bots::ActiveModel { /* ... */ };
let res = bots::Entity::insert(bot).exec(&txn).await?;

txn.commit().await?; // Commit or drop for rollback
```

**Source**:
- `learn-projects/sea-orm/tests/transaction_tests.rs` - Transaction patterns (lines 26-227)
- `learn-projects/sea-orm/examples/basic/src/mutation.rs` - ActiveModel usage
- SeaORM 2.0.0-rc transaction API documentation

## 12. Bot Name Uniqueness Validation

### Decision: Query database before creation/update to check name uniqueness within realm
**Rationale**: Database constraint exists, but validate before attempting insert for better error messages. Allows returning user-friendly error instead of database constraint violation.

**Implementation Notes**:
- Query: `bots::Entity::find().filter(bots::Column::RealmId.eq(realm_id)).filter(bots::Column::Name.eq(name)).one(&conn)`
- For create: If found, return error "Bot name already exists in this realm"
- For update: Exclude current bot from uniqueness check: `.filter(bots::Column::Id.ne(bot_id))`
- Database also has unique constraint as backup (per schema)
- Check before transaction to avoid unnecessary work

**Validation Pattern**:
```rust
// For create
let existing = bots::Entity::find()
    .filter(bots::Column::RealmId.eq(realm_id))
    .filter(bots::Column::Name.eq(&request.name))
    .one(&state.conn)
    .await?;

if existing.is_some() {
    return Err(Error::Anyhow(anyhow!("Bot name already exists in this realm")));
}

// For update
let existing = bots::Entity::find()
    .filter(bots::Column::RealmId.eq(realm_id))
    .filter(bots::Column::Name.eq(&request.name))
    .filter(bots::Column::Id.ne(bot_id))
    .one(&state.conn)
    .await?;
```

**Source**:
- `docs/sql/mvp.sql` - Database schema constraints (bot name uniqueness)
- `rust-workspace/packages/entity/src/bots.rs` - Bot entity columns

## 13. Channel Bridge Creation with Bot

### Decision: Create channel bridge records first, then bot with bridge IDs in transaction
**Rationale**: Bot requires bridge IDs (foreign keys), so bridges must exist before bot creation. Transaction ensures atomicity: if bot creation fails, bridges are rolled back.

**Implementation Notes**:
- Validate bridge_type is 'api' or 'oauth' (enforced by database CHECK constraint)
- Validate third_provider_type (currently only 'line' supported per schema)
- Create `channel_bridge::ActiveModel` with all required fields:
  - `bridge_type`: From request
  - `third_provider_type`: From request
  - `third_id`: From request
  - `third_secret`: From request
  - OAuth-specific: `access_token`, `refresh_token`, `token_expiry`, `oauth_scopes` (optional)
  - API-specific: `api_endpoint`, `api_version` (optional)
- Store created bridge IDs
- Create bot with bridge IDs
- All in single transaction for atomicity

**Bridge Creation Pattern**:
```rust
let api_bridge_id = if let Some(api_input) = &request.api_channel_bridge {
    let bridge = channel_bridge::ActiveModel {
        id: Set(Uuid::now_v7()),
        bridge_type: Set("api".to_string()),
        third_provider_type: Set(api_input.third_provider_type.clone()),
        third_id: Set(api_input.third_id.clone()),
        third_secret: Set(api_input.third_secret.clone()),
        api_endpoint: Set(api_input.api_endpoint.clone()),
        api_version: Set(api_input.api_version.clone()),
        created_at: Set(Utc::now().into()),
        updated_at: Set(Utc::now().into()),
        ..Default::default()
    };
    let res = channel_bridge::Entity::insert(bridge).exec(&txn).await?;
    Some(res.last_insert_id)
} else { None };
```

**Source**:
- `rust-workspace/packages/entity/src/channel_bridge.rs` - ChannelBridge entity definition
- `docs/sql/mvp.sql` - channel_bridge table schema (lines 166-194)

## 14. Protobuf Code Generation for Rust

### Decision: Use existing build.rs configuration - auto-detects proto files from share/proto
**Rationale**: build.rs already configured to glob all .proto files recursively from `share/proto` directory. No additional configuration needed.

**Implementation Notes**:
- Proto files in `share/proto/bot.proto` are automatically included in build
- Generated code appears in `OUT_DIR` as `bot.rs` during compilation
- Import in main.rs: `pub mod bot { include!(concat!(env!("OUT_DIR"), "/bot.rs")); }`
- Use generated types: `proto::bot::*` (CreateBotRequest, CreateBotResponse, etc.)
- Service registration: `BotService::create_bot(create_bot)`
- Rebuild required after proto changes: `cargo build` or `cargo run`

**Module Pattern**:
```rust
mod proto {
    pub mod bot {
        include!(concat!(env!("OUT_DIR"), "/bot.rs"));
    }
}
```

**Source**:
- `rust-workspace/apps/server/build.rs` - Proto generation configuration (line 10: `from_directory_recursive("../../../share/proto")`)
- `rust-workspace/apps/server/src/main.rs` - Proto module pattern (lines 28-36 for auth/hello)

## Summary of Key Decisions

### Frontend
1. **GraphQLClient Auth**: Use request middleware to inject Authorization header from authFetch token
2. **PostGraphile Naming**: Use simplified inflection (already configured) - `bots` for list, `bot` for detail
3. **Refine Usage**: Use full data provider but only call `getList` and `getOne` methods
4. **UI Components**: Ant Design Table for list, shadcn for all other pages
5. **Testing**: Integration tests for GraphQL, unit tests for complex logic only
6. **Schema Discovery**: Use PostGraphile GraphiQL/introspection to get exact field names and types
7. **Type Generation**: Use `graphql-codegen` to generate TypeScript types from PostGraphile schema and query documents (two-file pattern: schema.types.ts and types.ts)

### Backend
8. **ConnectRPC Pattern**: Follow AuthService implementation pattern for service handlers
9. **Realm Extraction**: Extract realm_id from account_realm_roles relationship (JWT contains account_id)
10. **SeaORM Operations**: Use ActiveModel pattern for type-safe database operations
11. **Transactions**: Use SeaORM transaction API for atomic bot + bridge creation
12. **Validation**: Query database for bot name uniqueness before insert/update
13. **Bridge Creation**: Create channel bridges first, then bot with bridge IDs in transaction
14. **Proto Generation**: Use existing build.rs configuration - auto-detects proto files from share/proto

