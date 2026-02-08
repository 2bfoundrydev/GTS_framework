# Tasks: PersonalHub database schema + RLS

**Input**: Design documents from `specs/001-personalhub-db-rls/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not included (not explicitly requested in the feature specification). Verification is handled via manual checks in `quickstart.md`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure the feature workspace and context artifacts are present and committed.

- [x] T001 Create feature checklist directory `specs/001-personalhub-db-rls/checklists/` (already exists)
- [x] T002 Commit Cursor agent context update `.cursor/rules/specify-rules.mdc`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema + RLS migrations that all user stories depend on

**⚠️ CRITICAL**: No story work can be considered complete until these migrations exist and are applied locally.

- [x] T003 Create schema migration `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T004 Create RLS migration `supabase/migrations/20260208000001_personalhub_rls.sql`
- [x] T005 Apply migrations locally via `supabase db reset` (verify no SQL errors) — **Manual step**: run when Docker is available
- [x] T006 Update quickstart verification steps if needed: `specs/001-personalhub-db-rls/quickstart.md`

**Checkpoint**: Foundation ready — user story verification can proceed.

---

## Phase 3: User Story 1 — Private data model exists (Priority: P1) 🎯 MVP

**Goal**: Notes/Links/Files tables exist and are private to the owner via RLS.

**Independent Test**: Apply migrations and validate that User A can access only their own rows and User B cannot access User A’s rows.

- [x] T007 [US1] Add `public.notes` table + index in `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T008 [US1] Add `public.links` table + index in `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T009 [US1] Add `public.files` table + indexes in `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T010 [US1] Enable RLS for notes/links/files in `supabase/migrations/20260208000001_personalhub_rls.sql`
- [x] T011 [US1] Add SELECT policies for notes/links/files in `supabase/migrations/20260208000001_personalhub_rls.sql`
- [x] T012 [US1] Add INSERT policies for notes/links/files in `supabase/migrations/20260208000001_personalhub_rls.sql`
- [x] T013 [US1] Add UPDATE policies for notes/links/files in `supabase/migrations/20260208000001_personalhub_rls.sql`
- [x] T014 [US1] Add DELETE policies for notes/links/files in `supabase/migrations/20260208000001_personalhub_rls.sql`
- [x] T015 [US1] Run manual RLS verification steps documented in `specs/001-personalhub-db-rls/quickstart.md` — **Manual step**

**Checkpoint**: Cross-user read/update/delete is blocked; owner CRUD is allowed.

---

## Phase 4: User Story 2 — Newest-first listing is supported (Priority: P2)

**Goal**: Efficient newest-first list queries are supported for each entity.

**Independent Test**: Create multiple records for a user and confirm list queries ordered by `created_at desc` use the intended index shape.

- [x] T016 [US2] Ensure `(user_id, created_at desc)` index exists on `public.notes` in `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T017 [US2] Ensure `(user_id, created_at desc)` index exists on `public.links` in `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T018 [US2] Ensure `(user_id, created_at desc)` index exists on `public.files` in `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T019 [US2] Document the intended list query shape (filter by `user_id`, order by `created_at desc`) in `specs/001-personalhub-db-rls/contracts/db-tables.md`

---

## Phase 5: User Story 3 — User removal cleans up owned data (Priority: P3)

**Goal**: Removing a user account removes (or makes inaccessible) previously owned Notes/Links/Files.

**Independent Test**: Remove a user account and confirm their associated records are removed or no longer accessible.

- [x] T020 [US3] Ensure `user_id` foreign keys reference `public.users(id)` with `ON DELETE CASCADE` in `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T021 [US3] Add optional uniqueness constraint for `files.storage_key` (recommended) in `supabase/migrations/20260208000000_personalhub_schema.sql`
- [x] T022 [US3] Extend `specs/001-personalhub-db-rls/quickstart.md` with an account-deletion verification step (user removed → records gone/inaccessible)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ensure docs/contracts reflect final decisions.

- [x] T023 [P] Update `specs/001-personalhub-db-rls/contracts/rls-policies.md` if the final policies differ
- [x] T024 Run full local verification from `specs/001-personalhub-db-rls/quickstart.md` — **Manual step** (requires Docker)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: can start immediately
- **Phase 2 (Foundational)**: depends on Phase 1, blocks all user stories
- **Phase 3+ (User Stories)**: depend on Phase 2 being applied locally at least once
- **Phase 6 (Polish)**: depends on Phases 3–5 complete

### User Story Dependencies

- **US1 (P1)**: depends on Phase 2 migrations existing and applied
- **US2 (P2)**: depends on schema indexes (Phase 2 / US1 schema tasks)
- **US3 (P3)**: depends on foreign keys + cascade semantics in schema

---

## Parallel Example

After Phase 2 exists, these can be done in parallel (different files):

- Task: "Update `specs/001-personalhub-db-rls/contracts/db-tables.md` with final index details"
- Task: "Update `specs/001-personalhub-db-rls/contracts/rls-policies.md` with final policy names"

---

## Implementation Strategy

1. Create migrations (schema + RLS).
2. Apply locally with `supabase db reset`.
3. Verify privacy (US1), then list support (US2), then deletion cleanup semantics (US3).
4. Update contracts + quickstart.

