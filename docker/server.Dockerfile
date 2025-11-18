# Build stage
FROM rust:1.91.1-slim-bookworm AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    protobuf-compiler \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Copy shared proto files (needed by build.rs)
COPY share ./share

# Copy Rust workspace
COPY rust-workspace/Cargo.toml rust-workspace/Cargo.lock ./rust-workspace/
COPY rust-workspace/packages ./rust-workspace/packages
COPY rust-workspace/apps ./rust-workspace/apps

# Build the server in release mode
WORKDIR /workspace/rust-workspace
RUN cargo build --release --bin server

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1001 appuser

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /workspace/rust-workspace/target/release/server /app/server

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

USER appuser

# Expose the port (changed from 127.0.0.1 to 0.0.0.0 for Docker)
EXPOSE 3030

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD timeout 2s bash -c ':> /dev/tcp/127.0.0.1/3030' || exit 1

# Run the server
CMD ["/app/server"]

