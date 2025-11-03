-- ============================================================================
-- Base Tables
-- Database: PostgreSQL
-- Requires: PostGIS extension (for spatial data support)
-- ============================================================================

-- Enable PostGIS extension (if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Stores third-party integration credentials for messaging platforms (WeChat, Line, Slack, etc.)
CREATE TABLE channel_bridge (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    third_id TEXT NOT NULL,
    third_secret TEXT NOT NULL,
    third_provider_type TEXT NOT NULL CHECK (third_provider_type IN ('line')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Store additional metadata like webhook URLs, tokens, etc.
    metadata JSONB
);

-- Index for efficient lookup by third-party credentials
CREATE UNIQUE INDEX idx_channel_bridge_third_login ON channel_bridge (third_provider_type, third_id);

-- Stores user information (human or AI bot)
CREATE TABLE res_parter (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
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

-- Index for efficient lookup by third-party login
CREATE UNIQUE INDEX idx_res_parter_third_login ON res_parter (third_provider_type, third_id) WHERE third_id IS NOT NULL AND third_provider_type IS NOT NULL;

-- ============================================================================
-- Trip-related Tables
-- ============================================================================

-- Stores trip information for short-term travel collaboration
CREATE TABLE trips (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    created_by uuid NOT NULL REFERENCES res_parter(id),
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
CREATE INDEX idx_trips_status ON trips (status);
CREATE INDEX idx_trips_dates ON trips (start_date, end_date);

-- Junction table to link trips with multiple participants
CREATE TABLE trip_participants (
    trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    res_parter_id uuid NOT NULL REFERENCES res_parter(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('owner', 'participant', 'invited')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (trip_id, res_parter_id)
);

-- Index for efficient lookup of trips by user
CREATE INDEX idx_trip_participants_res_parter ON trip_participants (res_parter_id);
CREATE INDEX idx_trip_participants_trip ON trip_participants (trip_id);

-- Stores trip cards (events/ideas) that can be collected and scheduled on timeline
-- Supports the three modes: ideation, collection/browsing, and arrangement
CREATE TABLE trip_cards (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES res_parter(id),
    
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
    last_edited_by uuid REFERENCES res_parter(id),
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
    res_parter_id uuid NOT NULL REFERENCES res_parter(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL DEFAULT 'upvote' CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (trip_card_id, res_parter_id)
);

-- Index for efficient lookup of votes
CREATE INDEX idx_trip_card_votes_card ON trip_card_votes (trip_card_id);
CREATE INDEX idx_trip_card_votes_res_parter ON trip_card_votes (res_parter_id);

-- ============================================================================
-- Chat-related Tables
-- ============================================================================

-- Stores metadata for each distinct chat session
CREATE TABLE chats (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES res_parter(id),
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
    res_parter_id uuid NOT NULL REFERENCES res_parter(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('owner', 'participant')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (chat_id, res_parter_id)
);

-- Index for efficient lookup of chats by user
CREATE INDEX idx_chat_participants_res_parter ON chat_participants (res_parter_id);

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
