# Implementation Plan: PersonalHub database schema + RLS

**Branch**: `001-personalhub-db-rls` | **Date**: 2026-02-08 | **Spec**: `specs/001-personalhub-db-rls/spec.md`
**Input**: Feature specification from `specs/001-personalhub-db-rls/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add three new PersonalHub entities (Notes, Links, Files) to the Supabase database, with RLS policies that ensure a user can only access their own records. Include indexes to support newest-first list views.

## Technical Context

**Language/Version**: TypeScript (Next.js 15 / React 19)
**Primary Dependencies**: Supabase (Auth + Postgres), Supabase CLI migrations
**Storage**: PostgreSQL (Supabase)
**Testing**: Manual SQL sanity checks for RLS (MVP); app tests added in later feature
**Target Platform**: Web application
**Project Type**: web
**Performance Goals**: Fast newest-first list queries for a single user
**Constraints**: Strict privacy (RLS), single-user MVP, no data leakage
**Scale/Scope**: Single user (MVP), small dataset (notes/links/files)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- No scope expansion beyond spec (schema + RLS + indexes only)
- No secrets exposed to client (this feature is DB-only)
- Requirements are testable (RLS can be validated with two users)
- No new dependencies required

**Status**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md # This file (/speckit.plan command output)
├── research.md # Phase 0 output (/speckit.plan command)
├── data-model.md # Phase 1 output (/speckit.plan command)
├── quickstart.md # Phase 1 output (/speckit.plan command)
├── contracts/ # Phase 1 output (/speckit.plan command)
└── tasks.md # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
supabase/
└── migrations/
    ├── 20240101000000_init_core_schema.sql
    ├── 20240101000001_rls_policies.sql
    ├── (new) 2026xxxxxx_personalhub_schema.sql
    └── (new) 2026xxxxxx_personalhub_rls.sql
```

**Structure Decision**: This is a Next.js web app repo using Supabase CLI migrations. All schema/RLS changes for this feature are implemented as new SQL migrations under `supabase/migrations/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
