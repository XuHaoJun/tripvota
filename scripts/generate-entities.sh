#!/bin/bash
# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Navigate to project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
# Change to the entity package directory
cd "$PROJECT_ROOT/rust-workspace/packages/entity"
# Run the command
~/.cargo/bin/sea-orm-cli generate entity --output-dir ./src/ --with-serde both -l --model-extra-attributes 'serde(rename_all = "camelCase")' --database-url postgres://postgres:test@localhost:5432/tripvota