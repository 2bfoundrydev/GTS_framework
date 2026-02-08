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
  - `(user_id, created_at desc)`

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
  - `(user_id, created_at desc)`

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
  - `(user_id, created_at desc)`
  - Optional: `storage_key` unique (recommended)

