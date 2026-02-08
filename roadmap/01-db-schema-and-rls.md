## 01 — Database schema + RLS (PersonalHub)

### Goal

Add a minimal PersonalHub data model in Supabase:
- `notes`
- `links`
- `files`

All records are scoped to the authenticated user and protected via RLS.

### Scope (MVP)

- Add new migration(s) under `supabase/migrations/`
- Create tables + indexes
- Enable RLS
- Add policies: user can read/write only their own rows

### Data model

#### notes
- `id` uuid (pk)
- `user_id` uuid (fk → `auth.users.id`)
- `title` text (required)
- `body` text (optional)
- `created_at` timestamptz default now()

Indexes:
- `(user_id, created_at desc)` for list by user

#### links
- `id` uuid (pk)
- `user_id` uuid (fk → `auth.users.id`)
- `url` text (required)
- `title` text (optional)
- `description` text (optional)
- `created_at` timestamptz default now()

Indexes:
- `(user_id, created_at desc)`

#### files
- `id` uuid (pk)
- `user_id` uuid (fk → `auth.users.id`)
- `original_name` text (required)
- `mime_type` text (required)
- `size_bytes` bigint (required)
- `storage_provider` text (required, e.g. `s3`)
- `storage_key` text (required)
- `created_at` timestamptz default now()

Indexes:
- `(user_id, created_at desc)`
- `storage_key` unique (optional but recommended)

### RLS policies (MVP)

Enable RLS on all three tables and add policies:
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

### Acceptance criteria

- Tables exist locally after `supabase start` / `supabase db reset`
- Authenticated user can CRUD only their own rows
- Another user cannot access rows (RLS enforced)

### Tests (minimum)

- SQL-level sanity check is acceptable for MVP (manual):
  - Create 2 users
  - Insert rows for each user
  - Verify cross-access fails

