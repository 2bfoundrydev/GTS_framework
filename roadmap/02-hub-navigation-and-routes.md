## 02 — Hub navigation + routes (Notes / Links / Files)

### Goal

Create the PersonalHub MVP navigation model:
- A single “Hub” entry point
- Three sections: Notes, Links, Files
- List pages + detail pages + create/upload entry points
- Consistent empty/loading/error states

### Scope (MVP)

- Add routes/pages for:
  - Notes list + note detail
  - Links list + link detail
  - Files list + file detail (or list + inline actions if simpler)
- Add a shared navigation UI (tabs or sidebar) to switch sections
- Ensure routes are protected (auth required)

### UX requirements

- Each section supports:
  - list view (newest first)
  - create/upload action
  - detail view
  - delete action (with confirmation)
- UI states:
  - empty: clear call to action
  - loading: consistent spinner/skeleton
  - error: user-friendly message + retry

### Acceptance criteria

- User can navigate between Notes/Links/Files from a single hub UI
- All pages require auth (redirect unauthenticated users)
- Empty state for each section is present and consistent

### Tests (minimum)

- Render smoke tests for hub navigation components
- Basic route protection behavior verified

