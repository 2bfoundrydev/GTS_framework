## 07 — Observability (logging + optional events)

### Goal

Add minimal observability for MVP flows:
- server-side error logs for create/delete/upload/download
- optional product events (if analytics enabled)

### Scope (MVP)

- Logging:
  - log request failures with context (user id if available, route, operation)
  - include correlation id if existing logger supports it
- Events (optional):
  - `note_created`
  - `link_created`
  - `file_uploaded`
  - `file_deleted`

### Acceptance criteria

- Errors in server routes are visible in logs with enough context to debug
- (Optional) events are emitted only when analytics is configured

