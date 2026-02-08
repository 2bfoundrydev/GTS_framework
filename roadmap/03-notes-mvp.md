## 03 — Notes MVP (create / list / detail / delete)

### Goal

Deliver a reliable notes CRUD flow for a single authenticated user.

### Scope (MVP)

- Create note
  - `title` required
  - `body` optional
- List notes (newest first)
- View note details
- Delete note (with confirmation)
- Error/empty/loading states

### UX / UI

- Notes list shows: title + created time (optional)
- Create note form:
  - title input (required)
  - body textarea (optional)
  - submit + cancel
- Delete confirmation modal with destructive styling

### Validation rules

- title: required, trimmed, reasonable max length (define in spec)
- body: optional, reasonable max length (define in spec)

### Data access

- Use Supabase client; RLS ensures user-only access.

### Acceptance criteria

- User can create a note and see it at top of list
- User can open note details page and see full content
- User can delete a note and it disappears from list
- All error states show a clear message and allow retry

### Tests (minimum)

- Create note form validation test
- Notes list rendering test (empty + non-empty)
- Delete confirmation flow test (UI-level)

