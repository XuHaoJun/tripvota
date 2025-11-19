# Implementation Plan: Simple IAM / Auth

**Branch**: `001-simple-iam-auth` | **Date**: 2025-11-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-simple-iam-auth/spec.md`

## Summary

Implement local authentication (Email/Password) using the existing Keycloak-inspired schema (`accounts` table).
**Backend**: Rust (`axum`, `sea-orm`) with `argon2` hashing and JWT (Access + Refresh tokens).
**Frontend**: Next.js admin routes (`/admin/register`, `/admin/login`).
**Transport**: Custom ConnectRPC transport using `ofetch` for interceptors (Bearer token injection & 401 retry logic).
**Data**: Existing `accounts` table in PostgreSQL.

## Technical Context

**Language/Version**: Rust (Backend), TypeScript/Node.js (Frontend)
**Primary Dependencies**: 
- Backend: `axum`, `axum-connect`, `sea-orm`, `argon2`, `jsonwebtoken`
- Frontend: `next`, `react`, `@connectrpc/connect`, `ofetch`
**Storage**: PostgreSQL (Existing schema `mvp.sql`)
**Testing**: `cargo test` (Backend integration), manual verification (Frontend MVP)
**Target Platform**: Web / Docker containers
**Project Type**: Monorepo (Web + Server)
**Performance Goals**: Standard web responsiveness.
**Constraints**: MVP complexity. Use existing `accounts` table. Local auth only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **MVP Mindset**: Reusing existing schema. Standard JWT flow.
- [x] **Code Quality**: Consistent patterns.
- [x] **User Experience**: Seamless token refresh handling via `ofetch` interceptors.

## Project Structure

### Documentation (this feature)

```text
specs/001-simple-iam-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (Proposed Proto)
└── tasks.md             # Phase 2 output (Tasks)
```

### Source Code (repository root)

```text
rust-workspace/
├── apps/
│   └── server/
│       ├── Cargo.toml       # Add auth dependencies
│       └── src/
│           ├── main.rs      # Register AuthRouter
│           └── auth.rs      # NEW: Auth implementation (Login/Refresh)
├── packages/
│   ├── entity/              # Generated entities (incl. accounts)
│   └── migration/           # Ensure mvp.sql migrations exist
└── ...

typescript-workspace/
├── apps/
│   └── web/
│       ├── app/
│       │   └── admin/
│       │       ├── login/   # Login Page
│       │       └── register/# Register Page
│       └── lib/
│           └── api-client.ts # NEW: Custom transport with ofetch
└── packages/
    └── rpc-client/          # Regenerated client
    
share/
└── proto/
    └── auth.proto           # Auth Service Definition (incl. RefreshToken)
```

**Structure Decision**: Monorepo structure. Backend logic in `auth.rs`. Frontend transport logic in `lib/api-client.ts`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Custom Transport | Need to handle 401 retry & token injection automatically. | Standard fetch doesn't support robust interceptors easily. |
