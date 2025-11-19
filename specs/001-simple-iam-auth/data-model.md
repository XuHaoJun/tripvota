# Data Model: Simple IAM / Auth

## Entities

### Account (`accounts`)

Represents a registered identity in the system. Existing table in `docs/sql/mvp.sql`.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, Default uuidv7() | Unique identifier. |
| `username` | TEXT | Not Null, Unique | Unique username. |
| `email` | TEXT | Not Null, Unique | Unique email address. |
| `password_hash` | TEXT | Nullable | Bcrypt/Argon2 hash. Nullable for federated, but required for local auth. |
| `email_verified` | BOOLEAN | Default false | Verification status. |
| `is_active` | BOOLEAN | Default true | Account status. |
| `created_at` | TIMESTAMPTZ | Default now() | Creation timestamp. |
| `updated_at` | TIMESTAMPTZ | Default now() | Update timestamp. |
| `last_login_at`| TIMESTAMPTZ | Nullable | Last successful login. |

## Migrations

- **Existing Schema**: The `accounts` table is already defined in `docs/sql/mvp.sql` (and likely `rust-workspace/packages/migration`).
- **Action**: Ensure the migration for `accounts` is applied. If not present in `packages/migration`, it needs to be added based on `mvp.sql`.

## Domain Logic

- **Registration**:
  - Input: `email`, `username`, `password`.
  - Action: Insert into `accounts` with hashed password. `email_verified` = false.
- **Login**:
  - Input: `email` (or `username`), `password`.
  - Action: Find account by email/username. Verify `password_hash`.
  - Update: `last_login_at`.
