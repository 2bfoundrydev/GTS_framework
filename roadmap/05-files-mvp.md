## 05 — Files MVP (upload / list / download / delete)

### Goal

Deliver an end-to-end file flow for a single authenticated user:
- upload to S3-compatible storage
- store metadata in DB
- list files (newest first)
- safe download/open
- delete (DB + object)

### Storage requirements

- **Backend:** S3-compatible (AWS S3 / Cloudflare R2 / MinIO)
- **No secrets in client**: storage credentials stay server-side only
- Download must be controlled:
  - presigned URL with short TTL, **or**
  - authenticated download endpoint that streams the object

### Scope (MVP)

- Upload UI:
  - file picker
  - progress/loading indicator (basic)
  - error states (too large, network error, unsupported type if configured)
- DB record creation in `files` table with:
  - original_name, mime_type, size_bytes, storage_provider, storage_key, created_at
- List UI:
  - filename, size, uploaded time, mime type
  - download/open action
  - delete action (with confirmation)

### Security

- Enforce auth on upload/download/delete endpoints
- Ensure user can download/delete only their own files (DB check + RLS)
- Never expose storage keys in a way that allows guessing other users’ objects

### Acceptance criteria

- Upload works end-to-end (object stored + DB record created)
- User sees uploaded file in list immediately (newest first)
- Download/open works via safe mechanism
- Delete removes record and object

### Tests (minimum)

- Unit test for server-side validation (file size/type rules)
- Integration-like test for “create file record” logic (mock storage)
- UI smoke test for empty + non-empty list

