#!/bin/bash
# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Navigate to project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root
cd "$PROJECT_ROOT"

# Build the Docker image
echo "Building server Docker image..."
docker build . -t xuhaojun/tripvota-server -f ./docker/server.Dockerfile

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✓ Successfully built image: xuhaojun/tripvota-server"
else
    echo "✗ Failed to build Docker image"
    exit 1
fi