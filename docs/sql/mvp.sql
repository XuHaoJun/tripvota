-- Stores user information (human or AI bot)
CREATE TABLE users (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stores metadata for each distinct chat session
CREATE TABLE conversations (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(id),
    title TEXT, -- e.g., "Chat about PostgreSQL"
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Store other metadata like temperature, model used, etc.
    metadata JSONB
);

-- Stores every single message
CREATE TABLE messages (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    conversation_id uuid NOT NULL REFERENCES conversations(id),
    -- 'user' or 'assistant'
    sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Store things like token count, tool calls, etc.
    metadata JSONB,
    
    -- This composite key is critical for partitioning
    PRIMARY KEY (conversation_id, message_id, created_at)
) PARTITION BY RANGE (created_at);

-- Create this index on the MAIN partitioned table.
-- It will be automatically created on all partitions.
CREATE INDEX idx_messages_conversation_timestamp ON messages (conversation_id, created_at DESC);