<!--
Sync Impact Report:
- Version change: 1.0.0 -> 1.1.0 (Expanded Tech Stack)
- Added Tech Stack Details:
  - Frontend: Next.js (App Router), TypeScript, Tailwind CSS
  - Shared: Protocol Buffers, Shared UI Package
  - Monorepo: pnpm, Turborepo
- Templates Checked:
  - .specify/templates/plan-template.md (✅ Compatible)
  - .specify/templates/spec-template.md (✅ Compatible)
  - .specify/templates/tasks-template.md (✅ Compatible)
-->

# TripVota Constitution

## Core Principles

### I. Code Quality

Code must be maintainable and readable. Prioritize clarity over cleverness. Follow standard idioms for the language (e.g., Rust idioms, `clippy` compliance). Comments should explain "why", not "what". Functions should be small and focused.

### II. Testing Standards (Complex Logic Only)

Focus testing efforts on complex business logic and critical paths. For this MVP, 100% coverage is NOT required. Do not write trivial tests for getters/setters or simple boilerplate. Integration tests for critical user flows are preferred over granular unit tests for simple components.

### III. User Experience Consistency

Maintain a consistent user experience across the application. Use shared components and patterns. UI/UX changes should be validated against existing patterns to ensure a cohesive look and feel. API responses (via Axum-Connect) must follow a consistent error handling and data structure strategy.

### IV. Performance Requirements (MVP)

Performance should be sufficient for a good user experience but do not prematurely optimize. Address performance bottlenecks only when they become apparent or impact the core user journey. Avoid over-engineering for hypothetical scale at this stage.

### V. MVP Mindset (No Overdesign)

This is a Minimum Viable Product. Implement only what is necessary to deliver value to the user. Avoid "nice-to-have" features or architectural abstractions that do not support immediate requirements. YAGNI (You Ain't Gonna Need It) applies strictly.

## Technology Stack

### Backend (Rust)

- **Language**: Rust (Edition 2024)
- **Web Framework**: Axum 0.8 with Axum-Connect (Protobuf/Connect-Web)
- **Database**: PostgreSQL with SeaORM
- **Runtime**: Tokio

### Frontend (TypeScript)

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm (Monorepo managed by Turborepo)

### Shared Infrastructure

- **API Contracts**: Protocol Buffers (`share/proto`) are the single source of truth.
- **UI Library**: Shared components in `packages/ui` (likely shadcn/ui based).
- **Generated Code**: `packages/proto-gen` contains generated TypeScript types/clients.

### Constraints

- **Database**: Use `sea-orm` for all database interactions to ensure type safety.
- **API**: Use `axum-connect` for API definitions to ensure contract safety between client and server.
- **Frontend**: Use shared UI components from `packages/ui` whenever possible to maintain consistency.

## Development Workflow

### Review Process

All code changes must be reviewed via Pull Request. Focus reviews on adherence to the MVP mindset and core principles. Ensure no unnecessary complexity is introduced.

### Quality Gates

- Code must compile without warnings.
- Tests (where applicable for complex logic) must pass.
- Linter (`clippy` for Rust, `eslint` for TS) checks must pass.

## Governance

This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan if necessary.

### Compliance

All PRs and reviews must verify compliance with these principles. Complexity must be justified.

**Version**: 1.1.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
