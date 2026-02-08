# Feature Specification: PersonalHub database schema + RLS

**Feature Branch**: `001-personalhub-db-rls`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "PersonalHub: database schema + RLS for notes, links, files"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Private data model exists (Priority: P1)

As an authenticated PersonalHub user, I want my notes/links/files data to be stored under my account and be private, so I can rely on PersonalHub as my single personal library.

**Why this priority**: PersonalHub is a personal service; without a correct private data model, no MVP functionality is safe or reliable.

**Independent Test**: Can be fully tested by applying the data model and verifying (a) the user can create/read their own records, and (b) cross-user access is blocked.

**Acceptance Scenarios**:

1. **Given** I am authenticated as User A, **When** I create Note/Link/File records, **Then** I can list and read only my own records.
2. **Given** records owned by User A exist, **When** I am authenticated as User B, **Then** I cannot read, update, or delete User A’s records.

---

### User Story 2 - Newest-first listing is supported (Priority: P2)

As an authenticated user, I want lists to be easy and fast to query (newest first), so the hub can reliably show my recent notes/links/files.

**Why this priority**: The MVP UI depends on “recent items” list views.

**Independent Test**: Can be tested by creating multiple records with different creation times and verifying list order and query shape (by user, newest-first).

**Acceptance Scenarios**:

1. **Given** I have created multiple notes/links/files over time, **When** I list my items, **Then** they are returned newest-first.

---

### User Story 3 - User removal cleans up owned data (Priority: P3)

As a user, I want my stored items to be tied to my account lifecycle, so personal data does not remain orphaned if my account is removed.

**Why this priority**: This reduces data retention surprises and keeps the system consistent.

**Independent Test**: Can be tested by removing a user account and verifying their associated records are removed or inaccessible.

**Acceptance Scenarios**:

1. **Given** a user account is removed, **When** the system evaluates owned notes/links/files, **Then** they are removed or no longer accessible.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- What happens when an unauthenticated client attempts to read or write rows?
- What happens when a client attempts to insert a row with `user_id` that is not their own?
- What happens when required fields are missing (e.g., note title, link url, file metadata)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a persistent data model for three entities: Notes, Links, and Files.
- **FR-002**: Each Note record MUST include an owner identifier, a required title, an optional body, and a creation timestamp.
- **FR-003**: Each Link record MUST include an owner identifier, a required URL, optional title/description, and a creation timestamp.
- **FR-004**: Each File record MUST include an owner identifier, original filename, MIME type, size in bytes, storage provider, storage key, and a creation timestamp.
- **FR-005**: System MUST restrict access so a user can only read, create, update, and delete their own Notes/Links/Files.
- **FR-006**: System MUST block attempts to create rows on behalf of another user (owner identifier mismatch).
- **FR-007**: System MUST support newest-first listing for each entity for a given user.
- **FR-008**: System MUST support safe deletion of user-owned records for each entity.
- **FR-009**: If a user account is removed, the system MUST ensure that previously owned Notes/Links/Files are removed or no longer accessible.

### Key Entities *(include if feature involves data)*

- **Note**: A short text entry owned by a user, identified by title and optional body.
- **Link**: A saved URL owned by a user, with optional descriptive fields.
- **File**: A file metadata record owned by a user, pointing to an object in external storage.

## Assumptions

- Notes/Links/Files are **private** and **single-user** in MVP (no sharing, no multi-user workspace semantics).
- Content search, tags, and editing flows are out of scope for this feature.
- File storage implementation (upload/download method) is handled in a later feature; this feature only establishes the metadata model and access rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An authenticated user can create at least 1 Note, 1 Link, and 1 File record and retrieve them via list and detail reads.
- **SC-002**: Cross-user access to Notes/Links/Files is blocked in 100% of tested cases (read/update/delete).
- **SC-003**: For a user with at least 10 records of each type, newest-first listing returns items in correct order.
