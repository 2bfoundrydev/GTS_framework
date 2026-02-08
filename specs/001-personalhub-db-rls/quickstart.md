## Phase 1 — Quickstart (local verification)

This quickstart verifies that the schema and RLS policies behave correctly after implementation.

### Prerequisites

- Docker running
- Supabase CLI installed

### Steps

1) Start Supabase locally:

```bash
supabase start
```

2) Reset DB to apply migrations:

```bash
supabase db reset
```

3) Create two test users (User A, User B) using the app signup flow (recommended), or via Supabase Studio.

4) As User A:
- Create at least one record in each table:
  - note
  - link
  - file (metadata only is acceptable for this feature)
- Verify list queries (newest-first) return User A’s rows.

5) As User B:
- Attempt to read/update/delete User A’s rows.
- Expected: access is blocked by RLS.

### Pass criteria

- User A can CRUD only their own rows
- User B cannot access User A’s rows (read/update/delete)

