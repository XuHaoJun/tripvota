# Build stage
FROM node:24.11.1-bookworm AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

WORKDIR /workspace

# Copy package files for dependency installation
COPY typescript-workspace/package.json typescript-workspace/pnpm-lock.yaml typescript-workspace/pnpm-workspace.yaml ./typescript-workspace/
COPY typescript-workspace/turbo.json ./typescript-workspace/

# Copy workspace packages (needed for dependencies)
COPY typescript-workspace/packages ./typescript-workspace/packages

# Copy the web app package.json
COPY typescript-workspace/apps/web/package.json ./typescript-workspace/apps/web/

# Install dependencies
WORKDIR /workspace/typescript-workspace
RUN pnpm install --frozen-lockfile

# Copy source code
COPY typescript-workspace/apps/web ./apps/web
COPY typescript-workspace/packages ./packages

# Build the Next.js app with standalone output
WORKDIR /workspace/typescript-workspace/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Runtime stage
FROM node:24.11.1-bookworm

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1001 appuser

WORKDIR /app

# Copy standalone output from builder
COPY --from=builder --chown=appuser:appuser /workspace/typescript-workspace/apps/web/.next/standalone ./
COPY --from=builder --chown=appuser:appuser /workspace/typescript-workspace/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=appuser:appuser /workspace/typescript-workspace/apps/web/public ./apps/web/public

USER appuser

WORKDIR /app/apps/web

# Expose the port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Run the production server
CMD ["node", "server.js"]

