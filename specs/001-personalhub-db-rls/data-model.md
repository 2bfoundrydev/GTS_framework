## Phase 1 — Data Model (PersonalHub)

### Entities

#### Note

- **Represents**: a short personal text entry
- **Owner**: `user_id` (authenticated user)
- **Attributes**:
  - `title` (required)
  - `body` (optional)
  - `created_at`

#### Link

- **Represents**: a saved URL for later reuse
- **Owner**: `user_id`
- **Attributes**:
  - `url` (required)
  - `title` (optional)
  - `description` (optional)
  - `created_at`

#### File

- **Represents**: a metadata record pointing to an object in external storage
- **Owner**: `user_id`
- **Attributes**:
  - `original_name`
  - `mime_type`
  - `size_bytes`
  - `storage_provider` (e.g., `s3`)
  - `storage_key`
  - `created_at`

### Relationships

- `notes.user_id` → `public.users.id`
- `links.user_id` → `public.users.id`
- `files.user_id` → `public.users.id`

All are `ON DELETE CASCADE`.

### Access Control (RLS)

All rows are private:
- a user can only access rows where `user_id = auth.uid()`.

