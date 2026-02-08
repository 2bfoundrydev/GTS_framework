## Phase 0 — Research & Decisions

This feature adds PersonalHub tables + RLS. The repo already contains Supabase CLI migrations and established RLS patterns.

### Decision 1 — Foreign key target for `user_id`

- **Decision**: Reference `public.users(id)` with `ON DELETE CASCADE` for all new PersonalHub tables.
- **Rationale**: The template already maintains `public.users` (mirrors `auth.users`) and other tables reference it. Cascading from `public.users` matches existing patterns and supports cleanup when a user is deleted.
- **Alternatives considered**:
  - Reference `auth.users(id)` directly: works, but is less consistent with the existing template tables.

### Decision 2 — Migration layout

- **Decision**: Create two migrations:
  - one for schema + indexes
  - one for enabling RLS + policies
- **Rationale**: Mirrors existing migration split (`init_core_schema` vs `rls_policies`) and keeps changes reviewable.
- **Alternatives considered**:
  - Single migration: simpler, but mixes schema and policy changes.

### Decision 3 — Primary keys & timestamps

- **Decision**: Use UUID primary keys (`uuid_generate_v4()`), and include `created_at` (`timestamptz default now()`).
- **Rationale**: Consistent with existing template tables.
- **Alternatives considered**:
  - `gen_random_uuid()` (pgcrypto): not currently used by the template.

### Decision 4 — Index strategy

- **Decision**: Add `(user_id, created_at desc)` indexes for notes/links/files.
- **Rationale**: Directly supports newest-first list pages for a single user.

### Decision 5 — RLS policy shape

- **Decision**: For each table:
  - SELECT: `auth.uid() = user_id`
  - INSERT: `auth.uid() = user_id`
  - UPDATE: `auth.uid() = user_id`
  - DELETE: `auth.uid() = user_id`
- **Rationale**: Minimal, testable, and matches MVP privacy rules.

