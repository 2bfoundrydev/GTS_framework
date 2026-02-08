## Contract — RLS policies (PersonalHub)

This contract describes the access control rules enforced at the database level.

### General rule

For Notes, Links, and Files:
- A user can only access rows where `user_id = auth.uid()`.

### Policies (per table)

For each of:
- `public.notes`
- `public.links`
- `public.files`

The system enforces:

- SELECT: allowed only when `auth.uid() = user_id`
- INSERT: allowed only when `auth.uid() = user_id`
- UPDATE: allowed only when `auth.uid() = user_id`
- DELETE: allowed only when `auth.uid() = user_id`

### Non-goals (this feature)

- Admin/service role bypass policies
- Sharing, multi-user access, or role-based permissions

