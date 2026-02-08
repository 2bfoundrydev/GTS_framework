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

- **SELECT**: `"Users can read own <entity>"` — allowed only when `auth.uid() = user_id`
- **INSERT**: `"Users can create own <entity>"` — allowed only when `auth.uid() = user_id`
- **UPDATE**: `"Users can update own <entity>"` — allowed only when `auth.uid() = user_id`
- **DELETE**: `"Users can delete own <entity>"` — allowed only when `auth.uid() = user_id`

### Implementation notes

- Policy names follow pattern: `"Users can {action} own {entity}"`
- All policies implemented in `supabase/migrations/20260208000001_personalhub_rls.sql`

### Non-goals (this feature)

- Admin/service role bypass policies
- Sharing, multi-user access, or role-based permissions

