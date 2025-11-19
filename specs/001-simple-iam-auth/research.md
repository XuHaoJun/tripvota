# Research: Simple IAM / Auth

## Key Decisions

### 1. Authentication Method
- **Decision**: Email and Password based authentication.
- **Rationale**: User explicitly requested "simple IAM or basic auth". Email/password is the standard MVP approach.
- **Alternatives**: OAuth (Google/GitHub) - deferred for MVP simplicity.

### 2. Password Security
- **Decision**: Use `argon2` crate for password hashing.
- **Rationale**: Industry standard for password hashing in Rust. Secure against GPU cracking.
- **Implementation**: `argon2::Argon2` with random salt.

### 3. Session Management
- **Decision**: JWT (Access Token) + Refresh Token.
- **Storage**:
  - **Access Token**: Stored in `localStorage` (Frontend) for Bearer Auth header.
  - **Refresh Token**: Stored in `localStorage` (Frontend).
- **Frontend Logic**:
  - Use `ofetch` instead of native `fetch` for ConnectRPC transport.
  - **Interceptors**:
    - `onRequest`: Inject `Authorization: Bearer <token>`.
    - `onResponseError`: If 401, attempt `RefreshToken` RPC once, update tokens, and retry original request.
- **Backend**:
  - `Login` returns both tokens.
  - `RefreshToken` endpoint verifies refresh token and issues new pair.
  - Protected routes verify Bearer token.
- **Crates**: `jsonwebtoken` for Rust.

### 4. API Protocol
- **Decision**: ConnectRPC (via `axum-connect`).
- **Transport**: Custom `connect-web` transport using `ofetch` adapter.
- **Rationale**: Matches existing project architecture (`share/proto`, `rust-workspace/apps/server/src/main.rs` uses `axum-connect`).
- **Service**: Define `AuthService` in `share/proto/auth.proto`.

### 5. Frontend Routing
- **Decision**: Next.js Middleware for protected routes.
- **Rationale**:
  - Admin routes prefixed with `/admin` as requested.
  - Middleware allows intercepting requests to `/admin/*` and redirecting to login if no valid cookie is present.
  - Root page (`/`) remains accessible to all.

### 6. Database Schema
- **Decision**: Use existing `accounts` table from `docs/sql/mvp.sql`.
- **Rationale**: Codebase already defines a Keycloak-inspired schema. We should reuse it instead of creating a parallel `users` table.
- **Fields Used**: `id`, `email`, `username`, `password_hash`, `created_at`, `updated_at`.
- **Global Scope**: `accounts` are global (not realm-scoped in the table definition), which fits the simple auth requirement.
- **ORM**: `sea-orm` entities need to be generated for `accounts`.

### 7. Architecture Integration
- **Backend**: New `auth.rs` module in `apps/server/src`.
- **Frontend**: New `app/admin/register/page.tsx` and `app/admin/login/page.tsx`.
- **Entities**: Use `packages/entity/src` (need to run generation script).

## Unknowns & Clarifications Resolved

- **Existing Auth?**: Checked codebase, no existing auth system found in `main.rs`.
- **Library Availability**: `sea-orm`, `axum`, `tokio` are present. Need to add `argon2`, `jsonwebtoken`, `axum-extra` to `apps/server/Cargo.toml`.

