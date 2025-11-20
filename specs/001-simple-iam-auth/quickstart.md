# Quickstart: Simple IAM / Auth Feature

## Prerequisites

- Docker (for PostgreSQL)
- Rust Toolchain
- Node.js / PNPM

## Running the Feature

1.  **Start Database**:
    ```bash
    docker compose up -d postgres
    ```

2.  **Run Migrations**:
    ```bash
    cd rust-workspace
    cargo run --package migration up
    ```

3.  **Regenerate Entities** (if needed, usually done by script):
    ```bash
    # From root
    ./scripts/generate-entities.sh
    ```

4.  **Start Backend**:
    ```bash
    cd rust-workspace/apps/server
    cargo run
    ```

5.  **Start Frontend**:
    ```bash
    cd typescript-workspace
    pnpm dev --filter web
    ```

6.  **Verify**:
    -   Navigate to `http://localhost:3000/admin/register`.
    -   Create an account.
    -   You should be redirected or able to login at `http://localhost:3000/admin/login`.

