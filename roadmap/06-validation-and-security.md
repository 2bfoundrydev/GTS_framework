## 06 — Validation + security hardening

### Goal

Make all MVP flows robust and safe:
- validate inputs consistently
- enforce access control everywhere
- prevent accidental data exposure

### Scope (MVP)

- Notes:
  - title/body max lengths
  - trimming + empty handling
- Links:
  - strict URL validation (`http`/`https`)
  - max lengths for optional fields
- Files:
  - max file size
  - optional allowlist/denylist for mime types
  - safe filenames (store original_name but do not trust it for paths)

### Access control

- UI: all PersonalHub pages require auth
- API routes (if used): verify session on server
- DB: RLS policies enforced for notes/links/files
- File download/delete: verify ownership by DB lookup (never by client input alone)

### Acceptance criteria

- Invalid inputs produce clear UI errors (no crashes)
- Unauthorized access attempts are blocked (client + server + RLS)
- No secrets (S3 keys, tokens) exposed to client bundles

### Tests (minimum)

- Validation unit tests (URL, lengths, file size)
- Authorization tests for server endpoints (unauthenticated requests rejected)

