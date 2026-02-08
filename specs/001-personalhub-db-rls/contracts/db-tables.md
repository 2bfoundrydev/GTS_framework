## Contract — Database tables (PersonalHub)

This contract describes the database tables added/required by this feature.

### `public.notes`

- Owner-scoped via `user_id`
- Fields:
  - `id` (uuid, primary key)
  - `user_id` (uuid, required, references `public.users(id)`)
  - `title` (text, required)
  - `body` (text, optional)
  - `created_at` (timestamptz, required, default now)
- Indexes:
  - `idx_notes_user_created` on `(user_id, created_at desc)` — supports newest-first list queries
- **Query shape**: `WHERE user_id = <user> ORDER BY created_at DESC`

### `public.links`

- Owner-scoped via `user_id`
- Fields:
  - `id` (uuid, primary key)
  - `user_id` (uuid, required, references `public.users(id)`)
  - `url` (text, required)
  - `title` (text, optional)
  - `description` (text, optional)
  - `created_at` (timestamptz, required, default now)
- Indexes:
  - `idx_links_user_created` on `(user_id, created_at desc)` — supports newest-first list queries
- **Query shape**: `WHERE user_id = <user> ORDER BY created_at DESC`

### `public.files`

- Owner-scoped via `user_id`
- Fields:
  - `id` (uuid, primary key)
  - `user_id` (uuid, required, references `public.users(id)`)
  - `original_name` (text, required)
  - `mime_type` (text, required)
  - `size_bytes` (bigint, required)
  - `storage_provider` (text, required)
  - `storage_key` (text, required)
  - `created_at` (timestamptz, required, default now)
- Indexes:
  - `idx_files_user_created` on `(user_id, created_at desc)` — supports newest-first list queries
  - `idx_files_storage_key` unique on `storage_key` (recommended)
- **Query shape**: `WHERE user_id = <user> ORDER BY created_at DESC`

