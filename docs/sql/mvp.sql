-- ============================================================================
-- Base Tables
-- Database: PostgreSQL
-- Requires: PostGIS extension (for spatial data support)
-- ============================================================================

-- Enable PostGIS extension (if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- Account and Realm Management
-- ============================================================================

-- System accounts (our platform users who manage realms)
-- Supports multiple authentication methods via federated identities
CREATE TABLE accounts (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    
    -- Local password authentication (nullable for federated-only accounts)
    password_hash TEXT,
    
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ,
    
    -- Store additional metadata like preferences, locale, etc.
    metadata JSONB
);

-- Identity providers configuration (realm-level)
-- Defines available authentication methods for each realm (SSO, OAuth, OIDC, SAML, etc.)
CREATE TABLE identity_providers (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    realm_id uuid NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    
    -- Provider type: 'google', 'line', 'github', 'saml', 'oidc', 'local', etc.
    provider_type TEXT NOT NULL CHECK (provider_type IN ('local', 'google', 'line', 'github', 'facebook', 'apple', 'saml', 'oidc')),
    alias TEXT NOT NULL, -- Unique alias for this provider within the realm
    display_name TEXT NOT NULL,
    
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- OAuth/OIDC configuration
    client_id TEXT,
    client_secret TEXT,
    authorization_url TEXT,
    token_url TEXT,
    user_info_url TEXT,
    
    -- SAML configuration
    saml_entity_id TEXT,
    saml_sso_url TEXT,
    saml_certificate TEXT,
    
    -- Default scopes for OAuth/OIDC
    default_scopes TEXT[],
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Store additional configuration like attribute mappings, etc.
    metadata JSONB,
    
    UNIQUE (realm_id, alias)
);

-- Federated identities (links accounts to external identity providers)
-- Allows one account to authenticate through multiple providers
CREATE TABLE federated_identities (
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    identity_provider_id uuid NOT NULL REFERENCES identity_providers(id) ON DELETE CASCADE,
    
    -- External user identifier from the identity provider
    external_user_id TEXT NOT NULL,
    external_username TEXT,
    
    -- Tokens from OAuth/OIDC providers
    access_token TEXT,
    refresh_token TEXT,
    token_expiry TIMESTAMPTZ,
    
    first_login_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Store additional data from the provider (profile info, claims, etc.)
    metadata JSONB,
    
    PRIMARY KEY (account_id, identity_provider_id),
    UNIQUE (identity_provider_id, external_user_id)
);

-- Realms (isolation boundaries for bots, trips, and profiles)
CREATE TABLE realms (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by uuid NOT NULL REFERENCES accounts(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB
);

-- Realm-scoped roles (e.g., 'admin', 'manager', 'viewer', 'bot-manager')
CREATE TABLE roles (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    realm_id uuid NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (realm_id, name)
);

-- Assign roles to accounts within realms
CREATE TABLE account_realm_roles (
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    realm_id uuid NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    granted_by uuid REFERENCES accounts(id),
    PRIMARY KEY (account_id, realm_id, role_id)
);

-- Permission definitions (resource-level permissions)
CREATE TABLE permissions (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    realm_id uuid NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('bot', 'trip', 'profile', 'chat', 'realm')),
    actions TEXT[] NOT NULL, -- e.g., ['read', 'write', 'delete', 'manage']
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (realm_id, role_id, resource_type)
);

-- Indexes for accounts and realms
CREATE INDEX idx_accounts_email ON accounts (email);
CREATE INDEX idx_accounts_username ON accounts (username);
CREATE INDEX idx_accounts_last_login ON accounts (last_login_at);
CREATE INDEX idx_identity_providers_realm ON identity_providers (realm_id);
CREATE INDEX idx_identity_providers_enabled ON identity_providers (realm_id, is_enabled) WHERE is_enabled = true;
CREATE INDEX idx_federated_identities_account ON federated_identities (account_id);
CREATE INDEX idx_federated_identities_provider ON federated_identities (identity_provider_id);
CREATE INDEX idx_federated_identities_external_user ON federated_identities (identity_provider_id, external_user_id);
CREATE INDEX idx_realms_created_by ON realms (created_by);
CREATE INDEX idx_roles_realm ON roles (realm_id);
CREATE INDEX idx_account_realm_roles_account ON account_realm_roles (account_id);
CREATE INDEX idx_account_realm_roles_realm ON account_realm_roles (realm_id);
CREATE INDEX idx_permissions_realm_role ON permissions (realm_id, role_id);

-- ============================================================================
-- Channel Bridge Tables
-- ============================================================================

-- Stores third-party integration credentials for messaging platforms (WeChat, Line, Slack, etc.)
-- Supports both OAuth and API authentication types
CREATE TABLE channel_bridge (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    
    -- Bridge type: 'oauth' or 'api'
    bridge_type TEXT NOT NULL CHECK (bridge_type IN ('oauth', 'api')),
    
    -- Provider information
    third_provider_type TEXT NOT NULL CHECK (third_provider_type IN ('line')),
    
    -- Common fields for both OAuth and API
    third_id TEXT NOT NULL, -- Client ID for OAuth, API Key ID for API
    third_secret TEXT NOT NULL, -- Client Secret for OAuth, API Secret for API
    
    -- OAuth-specific fields (NULL for API type)
    access_token TEXT NULL,
    refresh_token TEXT NULL,
    token_expiry TIMESTAMPTZ NULL,
    oauth_scopes TEXT[] NULL, -- Array of OAuth scopes
    
    -- API-specific fields (NULL for OAuth type)
    api_endpoint TEXT NULL, -- Base API endpoint URL
    api_version TEXT NULL, -- API version
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Store additional metadata like webhook URLs, tokens, etc.
    metadata JSONB
);

-- Index for efficient lookup by third-party credentials
CREATE UNIQUE INDEX idx_channel_bridge_third_login ON channel_bridge (third_provider_type, third_id);

-- Index for OAuth token expiry queries
CREATE INDEX idx_channel_bridge_oauth_expiry ON channel_bridge (token_expiry) 
    WHERE bridge_type = 'oauth' AND token_expiry IS NOT NULL;

-- Stores bot configuration with both API and OAuth channel bridges
CREATE TABLE bots (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    
    -- Realm scoping
    realm_id uuid NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    
    -- Bot identification
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    
    -- Bot can have both API and OAuth bridges for different purposes
    -- For example: OAuth for user-facing interactions, API for backend operations
    api_channel_bridge_id uuid REFERENCES channel_bridge(id),
    oauth_channel_bridge_id uuid REFERENCES channel_bridge(id),
    
    -- Bot status
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Bot capabilities/configuration
    capabilities TEXT[], -- e.g., ['chat', 'recommendations', 'booking']
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Store additional metadata like model config, prompts, etc.
    metadata JSONB,
    
    -- At least one channel bridge must be configured
    CHECK (api_channel_bridge_id IS NOT NULL OR oauth_channel_bridge_id IS NOT NULL)
);

-- Indexes for bots
CREATE INDEX idx_bots_realm ON bots (realm_id);
CREATE INDEX idx_bots_api_bridge ON bots (api_channel_bridge_id) WHERE api_channel_bridge_id IS NOT NULL;
CREATE INDEX idx_bots_oauth_bridge ON bots (oauth_channel_bridge_id) WHERE oauth_channel_bridge_id IS NOT NULL;
CREATE INDEX idx_bots_active ON bots (is_active) WHERE is_active = true;

-- Stores user information (human or AI bot)
-- Profiles represent third-party system users (e.g., LINE users), scoped to realms
CREATE TABLE profiles (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    
    -- Realm scoping
    realm_id uuid NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    third_id TEXT,
    third_provider_type TEXT,
    channel_bridge_id uuid REFERENCES channel_bridge(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Store other metadata like user preferences, etc.
    metadata JSONB
);

-- Indexes for profiles
CREATE INDEX idx_profiles_realm ON profiles (realm_id);
-- Index for efficient lookup by third-party login (now realm-scoped)
CREATE UNIQUE INDEX idx_profiles_third_login ON profiles (realm_id, third_provider_type, third_id) WHERE third_id IS NOT NULL AND third_provider_type IS NOT NULL;

-- ============================================================================
-- Trip-related Tables
-- ============================================================================

-- Stores trip information for short-term travel collaboration
CREATE TABLE trips (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    realm_id uuid NOT NULL REFERENCES realms(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    destination TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Store additional metadata like budget, preferences, etc.
    metadata JSONB
);

-- Index for efficient lookup of trips by status and dates
CREATE INDEX idx_trips_realm ON trips (realm_id);
CREATE INDEX idx_trips_status ON trips (status);
CREATE INDEX idx_trips_dates ON trips (start_date, end_date);

-- Junction table to link trips with multiple participants
CREATE TABLE trip_participants (
    trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('owner', 'participant', 'invited')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (trip_id, profile_id)
);

-- Index for efficient lookup of trips by user
CREATE INDEX idx_trip_participants_profile ON trip_participants (profile_id);
CREATE INDEX idx_trip_participants_trip ON trip_participants (trip_id);

-- Stores trip cards (events/ideas) that can be collected and scheduled on timeline
-- Supports the three modes: ideation, collection/browsing, and arrangement
CREATE TABLE trip_cards (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES profiles(id),
    
    -- Basic card information
    title TEXT NOT NULL,
    description TEXT,
    category TEXT, -- e.g., 'activity', 'restaurant', 'attraction', 'accommodation', 'transport'
    
    -- Location information (PostGIS geography point: longitude, latitude)
    position GEOGRAPHY(POINT, 4326),
    
    -- Scheduling information (null when in draft pool, set when scheduled)
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    
    -- Card state: 'draft' (in pool), 'scheduled' (on timeline), 'completed', 'cancelled'
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'completed', 'cancelled')),
    
    -- Ordering support (for drag-and-drop in pool and timeline)
    display_order INTEGER DEFAULT 0,
    
    -- Voting support
    vote_count INTEGER NOT NULL DEFAULT 0,
    vote_data JSONB, -- Store detailed voting information
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Store additional metadata like location, cost, AI suggestions, etc.
    metadata JSONB
);

-- Stores rich text content associated with a trip card (one-to-one)
CREATE TABLE trip_card_rich_text (
    trip_card_id uuid PRIMARY KEY REFERENCES trip_cards(id) ON DELETE CASCADE,
    content JSONB NOT NULL,
    last_edited_by uuid REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient lookup of cards by trip and status
CREATE INDEX idx_trip_cards_trip_status ON trip_cards (trip_id, status);
CREATE INDEX idx_trip_cards_trip_date ON trip_cards (trip_id, start_time);
CREATE INDEX idx_trip_cards_created_by ON trip_cards (created_by);
CREATE INDEX idx_trip_cards_category ON trip_cards (category) WHERE category IS NOT NULL;
-- Spatial index for location-based queries (PostGIS)
CREATE INDEX idx_trip_cards_position ON trip_cards USING GIST (position) WHERE position IS NOT NULL;

-- Stores votes for trip cards (for voting functionality)
CREATE TABLE trip_card_votes (
    trip_card_id uuid NOT NULL REFERENCES trip_cards(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL DEFAULT 'upvote' CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (trip_card_id, profile_id)
);

-- Index for efficient lookup of votes
CREATE INDEX idx_trip_card_votes_card ON trip_card_votes (trip_card_id);
CREATE INDEX idx_trip_card_votes_profile ON trip_card_votes (profile_id);

-- ============================================================================
-- Chat-related Tables
-- ============================================================================

-- Stores metadata for each distinct chat session
CREATE TABLE chats (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES profiles(id),
    title TEXT, -- e.g., "Chat about PostgreSQL"
    is_main BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Store other metadata like temperature, model used, etc.
    metadata JSONB
);

CREATE INDEX idx_chats_trip_id ON chats (trip_id) WHERE trip_id IS NOT NULL;
CREATE UNIQUE INDEX idx_chats_trip_main ON chats (trip_id) WHERE trip_id IS NOT NULL AND is_main;

-- Junction table to link chats with multiple users
CREATE TABLE chat_participants (
    chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('owner', 'participant')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (chat_id, profile_id)
);

-- Index for efficient lookup of chats by user
CREATE INDEX idx_chat_participants_profile ON chat_participants (profile_id);

-- Stores every single message
CREATE TABLE messages (
    id uuid DEFAULT uuidv7(),
    chat_id uuid NOT NULL REFERENCES chats(id),
    -- 'user' or 'assistant'
    sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Store things like token count, tool calls, etc.
    metadata JSONB,
    
    -- Ensure id is unique (must include partition key for partitioned tables)
    UNIQUE (id, created_at),
    
    -- This composite key is critical for partitioning
    PRIMARY KEY (chat_id, id, created_at)
) PARTITION BY RANGE (created_at);

-- Create this index on the MAIN partitioned table.
-- It will be automatically created on all partitions.
CREATE INDEX idx_messages_chat_timestamp ON messages (chat_id, created_at DESC);
