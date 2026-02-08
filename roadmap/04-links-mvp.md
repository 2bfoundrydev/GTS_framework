## 04 — Links MVP (create / list / detail / delete)

### Goal

Deliver a reliable links CRUD flow for a single authenticated user.

### Scope (MVP)

- Create link:
  - `url` required
  - `title` optional
  - `description` optional
- List links (newest first)
- View link details (clickable URL)
- Delete link (with confirmation)
- Error/empty/loading states

### UX / UI

- Links list shows: title (fallback to URL) + created time (optional)
- Create link form:
  - URL input (required)
  - title input (optional)
  - description textarea (optional)
- Detail view includes:
  - clickable URL (opens in new tab)
  - copy-to-clipboard action (optional if trivial)

### Validation rules

- url: required; must be a valid absolute URL (`http`/`https`)
- title/description: optional with max length limits (define in spec)

### Data access

- Use Supabase client; RLS ensures user-only access.

### Acceptance criteria

- User can save a link and see it at top of list
- Detail view shows correct URL and opens it
- User can delete a link and it disappears from list
- Validation prevents invalid URLs

### Tests (minimum)

- URL validation test
- Links list rendering test (empty + non-empty)
- Delete confirmation flow test

