## PersonalHub Roadmap (MVP)

This file is the **high-level feature map** for building PersonalHub end-to-end.

PersonalHub MVP goal: one authenticated user can **create, browse, and delete**:
- Notes (title required, body optional)
- Links (URL required, title/description optional)
- Files (upload to S3-compatible storage; safe download; delete)

### Feature flags (MVP)

PersonalHub MVP does **not** use SaaS billing/trials/onboarding.

- Set:
  - `NEXT_PUBLIC_ENABLE_BILLING=false`
  - `NEXT_PUBLIC_ENABLE_TRIALS=false`
  - `NEXT_PUBLIC_ENABLE_ONBOARDING=false`

### Implementation order (do in sequence)

1. **[01 - Database schema + RLS for PersonalHub](./roadmap/01-db-schema-and-rls.md)**
2. **[02 - Hub navigation + routes (Notes/Links/Files)](./roadmap/02-hub-navigation-and-routes.md)**
3. **[03 - Notes MVP (create/list/detail/delete)](./roadmap/03-notes-mvp.md)**
4. **[04 - Links MVP (create/list/detail/delete)](./roadmap/04-links-mvp.md)**
5. **[05 - Files MVP (upload/list/download/delete)](./roadmap/05-files-mvp.md)**
6. **[06 - Validation + security hardening](./roadmap/06-validation-and-security.md)**
7. **[07 - Observability (logging + optional events)](./roadmap/07-observability.md)**
8. **[08 - MVP smoke tests + deploy checklist](./roadmap/08-smoke-tests-and-deploy.md)**

### How to work (spec-driven)

For each roadmap item:
- Create a spec in `specs/<feature-id>/`
- Generate UI preview route `/preview/<feature-id>` with mock data
- Get human approval in preview
- Then implement + tests (no guessing beyond spec)

