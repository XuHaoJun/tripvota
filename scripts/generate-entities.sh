#!/bin/bash
# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Navigate to project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Define path to server .env
ENV_FILE="$PROJECT_ROOT/rust-workspace/apps/server/.env"
DEFAULT_DB_URL="postgres://postgres:test@localhost:5432/tripvota"
DATABASE_URL=""

# Try to read DATABASE_URL from .env
if [ -f "$ENV_FILE" ]; then
    # Extract value of DATABASE_URL, handling potential quotes
    DATABASE_URL=$(grep "^DATABASE_URL=" "$ENV_FILE" | cut -d '=' -f2- | sed 's/^"//;s/"$//')
fi

# Fallback if empty
if [ -z "$DATABASE_URL" ]; then
    DATABASE_URL="$DEFAULT_DB_URL"
fi

# Change to the entity package directory
cd "$PROJECT_ROOT/rust-workspace/packages/entity"
# Run the command
~/.cargo/bin/sea-orm-cli generate entity --output-dir ./src/ --entity-format dense --with-serde both -l --model-extra-attributes 'serde(rename_all = "camelCase")' --database-url "$DATABASE_URL"
