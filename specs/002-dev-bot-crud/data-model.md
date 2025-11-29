# Data Model: Bot Entity

## Database Schema

The `bots` table is defined in `docs/sql/mvp.sql`:

```sql
CREATE TABLE bots (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    realm_id uuid NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    api_channel_bridge_id uuid REFERENCES channel_bridge(id),
    oauth_channel_bridge_id uuid REFERENCES channel_bridge(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    capabilities TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB,
    CHECK (api_channel_bridge_id IS NOT NULL OR oauth_channel_bridge_id IS NOT NULL)
);
```

## GraphQL Type Mappings (PostGraphile with simplify-inflection)

PostGraphile v5 with `@graphile/simplify-inflection` generates the following GraphQL types from the `bots` table:

### Bot Type
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
  
  # Relations (simplified inflection)
  realm: Realm
  apiChannelBridge: ChannelBridge
  oauthChannelBridge: ChannelBridge
}
```

### BotConnection Type (for list queries)
```graphql
type BotConnection {
  edges: [BotEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type BotEdge {
  node: Bot!
  cursor: Cursor!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: Cursor
  endCursor: Cursor
}
```

### Filter Types
```graphql
input BotFilter {
  id: UUIDFilter
  realmId: UUIDFilter
  name: StringFilter
  displayName: StringFilter
  isActive: BooleanFilter
  createdAt: DatetimeFilter
  updatedAt: DatetimeFilter
  and: [BotFilter!]
  or: [BotFilter!]
  not: BotFilter
}

input UUIDFilter {
  equalTo: UUID
  notEqualTo: UUID
  in: [UUID!]
  notIn: [UUID!]
  isNull: Boolean
}

input StringFilter {
  equalTo: String
  notEqualTo: String
  in: [String!]
  notIn: [String!]
  isNull: Boolean
  startsWith: String
  endsWith: String
  contains: String
}

input BooleanFilter {
  equalTo: Boolean
  notEqualTo: Boolean
  isNull: Boolean
}

input DatetimeFilter {
  equalTo: Datetime
  notEqualTo: Datetime
  greaterThan: Datetime
  lessThan: Datetime
  greaterThanOrEqualTo: Datetime
  lessThanOrEqualTo: Datetime
  in: [Datetime!]
  notIn: [Datetime!]
  isNull: Boolean
}
```

### OrderBy Types
```graphql
enum BotOrderBy {
  ID_ASC
  ID_DESC
  REALM_ID_ASC
  REALM_ID_DESC
  NAME_ASC
  NAME_DESC
  DISPLAY_NAME_ASC
  DISPLAY_NAME_DESC
  IS_ACTIVE_ASC
  IS_ACTIVE_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
}
```

## Field Relationships

### Foreign Keys
- **realm_id** → `realms.id` (CASCADE DELETE)
  - Every bot belongs to exactly one realm
  - When realm is deleted, all bots in that realm are deleted
  
- **api_channel_bridge_id** → `channel_bridge.id` (nullable)
  - Optional reference to an API channel bridge
  
- **oauth_channel_bridge_id** → `channel_bridge.id` (nullable)
  - Optional reference to an OAuth channel bridge

### Validation Rules
- **At least one channel bridge required**: `CHECK (api_channel_bridge_id IS NOT NULL OR oauth_channel_bridge_id IS NOT NULL)`
  - A bot must have either an API bridge, OAuth bridge, or both
  - Cannot create a bot without at least one channel bridge

- **Name uniqueness**: Per spec FR-019, bot names must be unique within a realm
  - This is enforced at the application level (not database constraint)
  - Validation should check for duplicate names in the same realm before creation/update

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key, auto-generated with uuidv7() |
| `realm_id` | UUID | Yes | Foreign key to realms table |
| `name` | TEXT | Yes | Unique bot identifier within realm |
| `display_name` | TEXT | Yes | Human-readable bot name |
| `description` | TEXT | No | Optional bot description |
| `api_channel_bridge_id` | UUID | Conditional* | API channel bridge reference |
| `oauth_channel_bridge_id` | UUID | Conditional* | OAuth channel bridge reference |
| `is_active` | BOOLEAN | Yes | Bot active status (default: true) |
| `capabilities` | TEXT[] | No | Array of capability strings (free-form) |
| `created_at` | TIMESTAMPTZ | Yes | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Yes | Last update timestamp |
| `metadata` | JSONB | No | Additional configuration data |

*At least one of `api_channel_bridge_id` or `oauth_channel_bridge_id` must be set.

## State Transitions

### Bot Lifecycle
1. **Created**: Bot is created with at least one channel bridge
2. **Active**: `is_active = true` (default state)
3. **Inactive**: `is_active = false` (can be toggled without deletion)
4. **Deleted**: Bot is removed from database (CASCADE from realm deletion, or explicit delete)

### Update Scenarios
- **Name change**: Allowed (per spec clarification - bot name is editable)
- **Channel bridge update**: Allowed, but at least one must remain
- **Status toggle**: Allowed (active ↔ inactive)
- **Capabilities update**: Allowed (free-form text array)

## GraphQL Query Patterns

### List Query Pattern
```graphql
query GetBots($first: Int, $after: Cursor, $filter: BotFilter, $orderBy: [BotOrderBy!]) {
  bots(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
    edges {
      node {
        # Fields selected here
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
```

### Detail Query Pattern
```graphql
query GetBot($id: UUID!) {
  bot(id: $id) {
    # All fields including relations
  }
}
```

## Notes for Implementation

1. **Naming Convention**: PostGraphile with simplify-inflection converts snake_case to camelCase:
   - `realm_id` → `realmId`
   - `display_name` → `displayName`
   - `created_at` → `createdAt`

2. **Array Fields**: `capabilities` is a PostgreSQL TEXT[] array, which maps to GraphQL `[String!]`

3. **JSONB Fields**: `metadata` is JSONB, which maps to GraphQL `JSON` scalar type

4. **Timestamps**: `created_at` and `updated_at` are TIMESTAMPTZ, which map to GraphQL `Datetime` type

5. **Relations**: PostGraphile automatically generates relation fields:
   - `realm: Realm` (from `realm_id` foreign key)
   - `apiChannelBridge: ChannelBridge` (from `api_channel_bridge_id`)
   - `oauthChannelBridge: ChannelBridge` (from `oauth_channel_bridge_id`)

6. **Type Generation**: All GraphQL types (Bot, BotConnection, BotFilter, BotOrderBy, etc.) are automatically generated by `graphql-codegen` into `lib/graphql/schema.types.ts`. Query-specific types (GetBotsQuery, GetBotsQueryVariables, etc.) are generated into `lib/graphql/types.ts` based on GraphQL documents in the codebase. Run `pnpm codegen` to regenerate types after schema or query changes.

