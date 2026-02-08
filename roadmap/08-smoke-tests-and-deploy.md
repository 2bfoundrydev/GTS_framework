## 08 — MVP smoke tests + deploy checklist

### Goal

Define a simple, repeatable way to confirm the MVP works end-to-end.

### Smoke test checklist (MVP)

- Auth
  - Sign up / sign in works
  - Protected routes redirect when logged out

- Notes
  - Create note (title required)
  - List shows newest first
  - Detail view works
  - Delete works with confirmation

- Links
  - Save link (URL required; invalid URL rejected)
  - List shows newest first
  - Detail view opens URL
  - Delete works with confirmation

- Files
  - Upload a small file successfully
  - List shows correct metadata (name/size/type/time)
  - Download/open works
  - Delete removes object and record

### Deploy checklist (MVP)

- Environment variables set (Supabase + storage provider)
- RLS verified in production
- Storage bucket configured (private by default)
- Download mechanism verified (presigned TTL or authenticated endpoint)

