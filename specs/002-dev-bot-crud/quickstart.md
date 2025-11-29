# Quickstart: Bot Management Frontend (GraphQL List & Detail)

This guide covers setting up the bot management frontend with GraphQL-powered list and detail views using Refine framework.

## Prerequisites

- PostGraphile server running at `http://localhost:5000` (already configured at `typescript-workspace/apps/postgraphile`)
- Next.js app at `typescript-workspace/apps/web`
- Authentication system with `authFetch` hook (`@workspace/fetch-ext`)

## Step 1: Install Dependencies

```bash
cd typescript-workspace/apps/web
pnpm add @refinedev/core @refinedev/antd @refinedev/react-router graphql-request graphql-tag antd @xuhaojun/refine-postgraphile
pnpm add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/import-types-preset graphql-config
```

**Note**: If `@xuhaojun/refine-postgraphile` is not available, we'll use patterns from `learn-projects/refine-postgraphile` to create a custom data provider wrapper.

## Step 2: Configure GraphQL Code Generation

Create `typescript-workspace/apps/web/graphql.config.ts`:

```typescript
import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5000/graphql",
  extensions: {
    codegen: {
      hooks: {
        afterOneFileWrite: ["prettier --write"],
      },
      generates: {
        "lib/graphql/schema.types.ts": {
          plugins: ["typescript"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
          },
        },
        "lib/graphql/types.ts": {
          preset: "import-types",
          documents: ["app/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
          plugins: ["typescript-operations"],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
            preResolveTypes: false,
            useTypeImports: true,
          },
          presetConfig: {
            typesPath: "./schema.types",
          },
        },
      },
    },
  },
};

export default config;
```

Add codegen script to `package.json`:

```json
{
  "scripts": {
    "codegen": "graphql-codegen",
    "codegen:watch": "graphql-codegen --watch"
  }
}
```

**Note**: The codegen will:
- Generate `lib/graphql/schema.types.ts` with all PostGraphile schema types (Bot, BotConnection, BotFilter, etc.)
- Generate `lib/graphql/types.ts` with TypeScript types for your GraphQL queries/mutations
- Scan for GraphQL documents (queries/mutations) in your app, hooks, and components directories

## Step 3: Configure GraphQL Client with Auth

Create `typescript-workspace/apps/web/lib/graphql/client.ts`:

```typescript
import { GraphQLClient } from 'graphql-request';
import { useAdminAuthFetch } from '@/hooks/admin/use-admin-auth-fetch';

/**
 * Creates a GraphQL client configured with authentication
 * Uses request middleware to inject Authorization header from authFetch
 */
export function createGraphQLClient(authFetch: typeof fetch): GraphQLClient {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql';
  
  const client = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Intercept requests to add auth token
  // Note: graphql-request doesn't support custom fetch directly,
  // so we use request middleware to inject headers
  const originalRequest = client.request.bind(client);
  
  client.request = async (document, variables, requestHeaders) => {
    // Get token from authFetch (we'll need to extract it)
    // For now, use headers approach - update headers with token before request
    const token = localStorage.getItem('admin_access_token');
    
    const headers = {
      ...requestHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return originalRequest(document, variables, headers);
  };

  return client;
}

/**
 * Hook to get authenticated GraphQL client
 */
export function useGraphQLClient(): GraphQLClient {
  const { authFetch } = useAdminAuthFetch();
  // Note: This is a simplified approach
  // In practice, you may need to create client per request or use a different pattern
  const [client] = useState(() => {
    // Create client with auth fetch wrapper
    // Since graphql-request doesn't support custom fetch,
    // we'll use the header injection approach above
    return createGraphQLClient(authFetch);
  });
  
  return client;
}
```

**Alternative Approach**: If the above doesn't work well, create a wrapper that uses `authFetch` directly:

```typescript
import { GraphQLClient } from 'graphql-request';
import type { RequestDocument, Variables } from 'graphql-request';

export function createAuthenticatedGraphQLClient(authFetch: typeof fetch) {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql';
  
  return {
    request: async <T = any, V = Variables>(
      document: RequestDocument,
      variables?: V,
      requestHeaders?: HeadersInit
    ): Promise<T> => {
      const query = typeof document === 'string' ? document : document.loc?.source.body;
      if (!query) throw new Error('Invalid GraphQL document');

      const response = await authFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...requestHeaders,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL error');
      }

      return result.data;
    },
  };
}
```

## Step 4: Create GraphQL Queries

Create `typescript-workspace/apps/web/hooks/bot/use-bot-queries.ts`:

```typescript
import gql from 'graphql-tag';
import type { DocumentNode } from 'graphql';
// Types will be generated after running: pnpm codegen
import type { GetBotsQuery, GetBotsQueryVariables, GetBotQuery, GetBotQueryVariables } from '@/lib/graphql/types';

export const BOTS_QUERY: DocumentNode = gql`
  query GetBots(
    $first: Int
    $after: Cursor
    $filter: BotFilter
    $orderBy: [BotOrderBy!]
  ) {
    bots(
      first: $first
      after: $after
      filter: $filter
      orderBy: $orderBy
    ) {
      edges {
        node {
          id
          realmId
          name
          displayName
          description
          isActive
          capabilities
          createdAt
          updatedAt
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
`;

export const BOT_QUERY: DocumentNode = gql`
  query GetBot($id: UUID!) {
    bot(id: $id) {
      id
      realmId
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
        type
      }
      oauthChannelBridge {
        id
        name
        type
      }
    }
  }
`;
```

**Note**: After creating these queries, run `pnpm codegen` to generate TypeScript types. The generated types (`GetBotsQuery`, `GetBotsQueryVariables`, etc.) will be available in `lib/graphql/types.ts`.

## Step 5: Setup Refine Data Provider

Create `typescript-workspace/apps/web/lib/refine/postgraphile-data-provider.ts`:

```typescript
import type { DataProvider } from '@refinedev/core';
import { GraphQLClient } from 'graphql-request';
// Import or implement PostGraphile data provider
// For now, use patterns from learn-projects/refine-postgraphile

export function createPostGraphileDataProvider(
  client: GraphQLClient
): Pick<DataProvider, 'getList' | 'getOne'> {
  return {
    getList: async ({ resource, pagination, sorters, filters, meta }) => {
      // Use custom query from meta if provided
      const query = meta?.gqlQuery || BOTS_QUERY;
      
      // Build variables from pagination, sorters, filters
      const variables = {
        first: pagination?.pageSize || 10,
        after: pagination?.current ? String((pagination.current - 1) * (pagination.pageSize || 10)) : null,
        filter: buildFilter(filters),
        orderBy: buildOrderBy(sorters),
      };

      const response = await client.request(query, variables);
      
      // Parse PostGraphile connection response
      const connection = response.bots;
      const data = connection.edges.map((edge: any) => edge.node);
      
      return {
        data,
        total: connection.totalCount,
      };
    },
    
    getOne: async ({ resource, id, meta }) => {
      const query = meta?.gqlQuery || BOT_QUERY;
      const response = await client.request(query, { id });
      return {
        data: response.bot,
      };
    },
  };
}

// Helper functions (implement based on PostGraphile filter/sort patterns)
function buildFilter(filters?: any): any {
  // Convert Refine filters to PostGraphile filter format
  // See learn-projects/refine-postgraphile for examples
  return {};
}

function buildOrderBy(sorters?: any): string[] {
  // Convert Refine sorters to BotOrderBy enum values
  // Example: [{ field: 'createdAt', order: 'desc' }] -> ['CREATED_AT_DESC']
  return [];
}
```

## Step 6: Create Bot List Page

Create `typescript-workspace/apps/web/app/admin/bot/page.tsx`:

```typescript
'use client';

import { Refine } from '@refinedev/core';
import { List, useTable } from '@refinedev/antd';
import { Table } from 'antd';
import routerProvider from '@refinedev/react-router';
import { useGraphQLClient } from '@/lib/graphql/client';
import { createPostGraphileDataProvider } from '@/lib/refine/postgraphile-data-provider';
import { BOTS_QUERY } from '@/hooks/bot/use-bot-queries';

export default function BotListPage() {
  const client = useGraphQLClient();
  const dataProvider = createPostGraphileDataProvider(client);
  
  const { tableProps } = useTable({
    resource: 'bots',
    meta: {
      gqlQuery: BOTS_QUERY,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="displayName" title="Display Name" />
        <Table.Column dataIndex="isActive" title="Active" />
        <Table.Column dataIndex="createdAt" title="Created At" />
      </Table>
    </List>
  );
}
```

## Step 7: Create Bot Detail Page

Create `typescript-workspace/apps/web/app/admin/bot/[id]/page.tsx`:

```typescript
'use client';

import { useParams } from 'next/navigation';
import { useGraphQLClient } from '@/lib/graphql/client';
import { BOT_QUERY } from '@/hooks/bot/use-bot-queries';
import { Card, CardHeader, CardTitle, CardContent } from '@workspace/ui/components/card';

export default function BotDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const client = useGraphQLClient();
  
  // Use React Query or similar for data fetching
  const { data, isLoading } = useQuery({
    queryKey: ['bot', id],
    queryFn: () => client.request(BOT_QUERY, { id }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data?.bot) return <div>Bot not found</div>;

  const bot = data.bot;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{bot.displayName}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold">Name</dt>
              <dd>{bot.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">Status</dt>
              <dd>{bot.isActive ? 'Active' : 'Inactive'}</dd>
            </div>
            {/* Add more fields */}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Step 8: Configure Refine Provider (if using full Refine setup)

If using Refine's full routing and layout system, wrap your app:

```typescript
// In app/admin/bot/layout.tsx or similar
'use client';

import { Refine } from '@refinedev/core';
import { useGraphQLClient } from '@/lib/graphql/client';
import { createPostGraphileDataProvider } from '@/lib/refine/postgraphile-data-provider';

export default function BotLayout({ children }: { children: React.ReactNode }) {
  const client = useGraphQLClient();
  const dataProvider = createPostGraphileDataProvider(client);

  return (
    <Refine
      dataProvider={dataProvider}
      resources={[
        {
          name: 'bots',
          list: '/admin/bot',
          show: '/admin/bot/:id',
        },
      ]}
    >
      {children}
    </Refine>
  );
}
```

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
```

## Testing the Setup

1. Start PostGraphile server: `cd typescript-workspace/apps/postgraphile && npm run dev`
2. Generate GraphQL types: `cd typescript-workspace/apps/web && pnpm codegen`
3. Start Next.js app: `cd typescript-workspace/apps/web && pnpm dev`
4. Navigate to `/admin/bot` to see the list page
5. Click on a bot to see the detail page

**Note**: Run `pnpm codegen` whenever you:
- Add new GraphQL queries or mutations
- Update existing queries
- Change the PostGraphile schema (after restarting PostGraphile server)

## Implementation Notes

### Completed Implementation (2025-01-27)

All user stories have been implemented:

1. **User Story 1 - View Bot List**: ✅ Complete
   - GraphQL-powered list with PostGraphile data provider
   - Search by name/display name
   - Filter by status
   - Pagination with Ant Design Table
   - Loading states and empty states

2. **User Story 2 - Create New Bot**: ✅ Complete
   - Create form with validation
   - Channel bridge selection (API/OAuth)
   - Inline channel bridge creation UI (backend integration pending)
   - ConnectRPC hook structure ready (placeholder for backend)

3. **User Story 3 - View Bot Details**: ✅ Complete
   - GraphQL-powered detail view
   - All bot fields displayed
   - Realm and channel bridge information
   - Loading and error states with retry

4. **User Story 4 - Update Existing Bot**: ✅ Complete
   - Edit form pre-filled with current values
   - Concurrent edit detection
   - Status toggle
   - ConnectRPC hook structure ready (placeholder for backend)

5. **User Story 5 - Delete Bot**: ✅ Complete
   - Delete confirmation dialog
   - Delete actions on list and detail pages
   - ConnectRPC hook structure ready (placeholder for backend)

### Key Implementation Details

- **GraphQL Queries**: Located in `hooks/bot/use-bot-queries.ts`
- **GraphQL Hooks**: `use-bot-list.ts` (Refine), `use-bot-detail.ts` (React Query)
- **ConnectRPC Hooks**: `use-bot-create.ts`, `use-bot-update.ts`, `use-bot-delete.ts` (placeholders ready for backend)
- **Components**: All bot components in `components/bot/`
- **Pages**: List (`app/admin/bot/page.tsx`), Detail (`app/admin/bot/[id]/page.tsx`), Create (`app/admin/bot/create/page.tsx`), Edit (`app/admin/bot/edit/[id]/page.tsx`)
- **Error Handling**: Network error detection, retry logic, user-friendly error messages
- **Polish**: Text truncation in list view, consistent error handling patterns, Ant Design theme configuration

### Protobuf Definitions

The bot service protobuf definitions have been created:
- **Proto file**: `share/proto/bot.proto` and `specs/002-dev-bot-crud/contracts/bot.proto`
- **TypeScript types**: Generated in `typescript-workspace/packages/proto-gen/src/bot_pb.ts`
- **Service methods**: `BotService.method.createBot`, `BotService.method.updateBot`, `BotService.method.deleteBot`

The frontend hooks have been updated to use the actual `BotService` from `@workspace/proto-gen/src/bot_pb.ts`.

### Backend Integration Required

The following ConnectRPC services need to be implemented in the Rust backend:
- `BotService.createBot` - Create bot endpoint
- `BotService.updateBot` - Update bot endpoint  
- `BotService.deleteBot` - Delete bot endpoint

**Important Notes for Backend Implementation**:
1. **Realm ID**: The backend should extract `realm_id` from the authenticated user's JWT token or session context. The frontend passes an empty string for `realmId` in create requests - the backend must populate this from the auth context.
2. **Validation**: Backend must validate that at least one channel bridge (API or OAuth) is provided.
3. **Duplicate Name Check**: Backend should check for duplicate bot names within the same realm.
4. **Error Handling**: Return appropriate error messages for validation failures, permission issues, and "bot in use" scenarios.

### Next Steps

- [x] Create protobuf definitions for bot service (`share/proto/bot.proto`)
- [x] Generate TypeScript types from proto files
- [x] Update frontend hooks to use actual BotService from `@workspace/proto-gen`
- [ ] Implement backend ConnectRPC bot service endpoints in Rust
- [ ] Backend: Extract realm_id from authenticated user context
- [ ] Implement channel bridge fetching for create/edit forms (GraphQL or ConnectRPC)
- [ ] Add permission checks (if needed)
- [ ] Performance testing with 1000+ bots

