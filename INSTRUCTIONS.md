# PersonalHub - Project Context & Architecture Guide

**Version:** 1.0  
**Last Updated:** 2026-02-08

---

## Project Context (PersonalHub)

**PersonalHub** is a lightweight personal web service: a single place to store and manage three kinds of personal information:

- **Notes**: short text entries (decisions, ideas, summaries, snippets)
- **Links**: saved URLs with minimal metadata (find + reuse later)
- **Files**: uploaded files stored in an external storage backend (S3-compatible)

**Primary goal:** replace scattered personal knowledge (folders, chats, bookmarks, ad-hoc docs) with one consistent interface and a simple, reliable data model.

**Target user (MVP):** a single authenticated user (private by default). Multi-user is a possible later evolution, but not in MVP scope.

### MVP scope (must work)

#### Notes (MVP)
- Create note: **title required**, body optional
- List notes (newest first)
- View note details
- Delete note (with confirmation)
- Basic validation + empty/loading/error states

#### Links (MVP)
- Save link: **URL required**, title optional, description optional
- List links (newest first)
- View link details (clickable URL)
- Delete link (with confirmation)
- Basic validation (valid URL) + empty/loading/error states

#### Files (MVP)
- Upload file to **pluggable S3-compatible** storage (AWS S3 / Cloudflare R2 / MinIO)
- List files (newest first) with: filename, size, upload time, mime type
- Download/open via **safe link** (presigned URL with short TTL or authenticated download endpoint)
- Delete file record and storage object (with confirmation)
- Basic upload error handling (too large, unsupported type if configured)

### Explicitly out of scope (MVP)
- Full-text search
- Tags/folders/collections
- Editing notes/links (create + delete only)
- Sharing / multi-user permissions
- File versioning
- Rich text / markdown editor
- Automated link preview scraping (unless trivial)

### Security rules (MVP)
- All data is private by default
- User can access **only their own** notes/links/files (RLS enforced)
- No storage secrets in client/UI
- Validate inputs (URL format, text length limits, filenames)

### Observability (MVP)
- Log server-side errors for create/delete/upload/download flows
- (Optional) Track events:
  - `note_created`, `link_created`, `file_uploaded`, `file_deleted`
- Keep request correlation if supported by the existing logging setup

### Spec-driven workflow (required)
1. Create a feature spec (single source of truth)
2. Run design step to generate:
   - `specs/<feature-id>/ui.md`
   - `/preview/<feature-id>` mock-only UI route
3. Human review in preview route
4. Only after UI approval: plan → implement → tests

**Rules:**
- No scope expansion beyond the spec
- Resolve ambiguities by updating the spec (do not guess in code)
- Tests must cover acceptance criteria

---

## Tech Stack (current repo baseline)

- **Frontend/Backend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 with custom theme + TailAdmin UI components (copy-on-demand)
- **Database/Auth:** Supabase (Postgres + Auth + Realtime)
  - Local development via Supabase CLI + Docker
  - Migrations tracked in `supabase/migrations/`
- **File storage (MVP):** S3-compatible object storage (AWS S3 / Cloudflare R2 / MinIO) via server-side credentials
- **Analytics:** PostHog (optional)
- **Logging:** Pino (structured JSON logging)

---

## Product UX (MVP)

PersonalHub uses a simple navigation model optimized for speed and clarity:

- **Hub page** with three sections/tabs:
  - Notes
  - Links
  - Files
- Each section supports:
  - list view (newest first)
  - create/upload action
  - detail view
  - delete action (with confirmation)
- Consistent UI states across the app:
  - empty
  - loading
  - error
  - normal/success

---

## Conceptual Data Model (PersonalHub)

All records are scoped to the authenticated user.

### Note
- `id`
- `user_id`
- `title` (required)
- `body` (optional)
- `created_at`

### Link
- `id`
- `user_id`
- `url` (required)
- `title` (optional)
- `description` (optional)
- `created_at`

### File
- `id`
- `user_id`
- `original_name`
- `mime_type`
- `size_bytes`
- `storage_provider` (e.g., `s3`)
- `storage_key` (object key/path)
- `created_at`

**Access rule:** user can only read/write their own records (RLS).

---

## Repository Map

```
GTS_framework/
├── app/                          # Next.js App Router
│   ├── api/                      # API route handlers
│   │   ├── stripe/               # (legacy template) Stripe endpoints (disabled for PersonalHub MVP)
│   │   └── user/                 # User management (delete account)
│   ├── auth/callback/            # OAuth callback handler
│   ├── dashboard/                # Protected dashboard page
│   ├── profile/                  # User profile + subscription management
│   ├── login/, signup/, etc.     # Auth pages
│   └── layout.tsx                # Root layout with AuthProvider + ProtectedRoute
│
├── components/                   # React components
│   ├── ui/                       # TailAdmin UI components (button, dropdown, modal)
│   ├── task/kanban/              # Example Kanban board feature
│   ├── AccountManagement.tsx     # User account deletion UI
│   ├── SubscriptionStatus.tsx    # Subscription display component
│   ├── StripeBuyButton.tsx       # Stripe checkout button
│   └── ...
│
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx           # Supabase auth + session management
│   ├── ProtectedRoute.tsx        # Route guard (redirects unauthenticated users)
│   └── PostHogContext.tsx        # Analytics context (optional)
│
├── hooks/                        # Custom React hooks
│   ├── useSubscription.ts        # Fetch + sync user subscription from Supabase
│   ├── useTrialStatus.ts         # Check if user is in 48-hour trial
│   └── useModal.ts               # Modal state management
│
├── utils/                        # Utility functions
│   ├── supabase/                 # Supabase clients (client.ts, server.ts)
│   ├── supabase-admin.ts         # Admin client (bypasses RLS, for API routes)
│   ├── features.ts               # Feature flag configuration (BILLING, TRIALS, ONBOARDING)
│   ├── env.ts                    # Environment variable validation
│   ├── logger.ts                 # Pino structured logging
│   ├── cors.ts                   # CORS middleware for API routes
│   └── analytics.ts              # PostHog event tracking helpers
│
├── supabase/                     # Supabase CLI project
│   ├── config.toml               # Supabase local config
│   ├── migrations/               # Database schema + RLS policies
│   │   ├── 20240101000000_init_core_schema.sql
│   │   └── 20240101000001_rls_policies.sql
│   └── README.md                 # Local Supabase setup guide
│
├── docs/                         # Comprehensive documentation
│   ├── INDEX.md                  # Documentation index
│   ├── quickstart.md             # 5-step setup + smoke tests
│   ├── feature-flags.md          # Feature flag details + use cases
│   ├── core-implementation.md    # Architecture decisions
│   ├── supabase.md               # Database management guide
│   └── technical-debt.md         # Known improvements
│
├── types/                        # TypeScript type definitions
├── icons/                        # SVG icons (loaded via @svgr/webpack)
├── public/                       # Static assets
└── .cursor/                      # Cursor IDE rules, skills, notepads
```

---

## Core Flows (Mental Model)

> **Important (PersonalHub):** This repo started from a SaaS template, so billing/trials/Stripe flows still exist in code,
> but **PersonalHub MVP does not use them**. Keep these flags disabled unless explicitly requested:
>
> - `NEXT_PUBLIC_ENABLE_BILLING=false`
> - `NEXT_PUBLIC_ENABLE_TRIALS=false`
> - `NEXT_PUBLIC_ENABLE_ONBOARDING=false`

### 1. Authentication Flow

**Tech:** Supabase Auth (email/password + OAuth providers)

**Flow:**
1. User signs up → Supabase creates record in `auth.users`
2. Trigger `handle_new_user()` fires → creates rows in:
   - `public.users` (profile + soft-delete fields)
   - `public.user_trials` (48-hour trial: `trial_end_time = NOW() + 48 hours`)
   - `public.user_preferences` (`has_completed_onboarding = false`)
3. OAuth flow: user redirected to `/auth/callback` → exchanges code for session → redirects to `/dashboard`

**Key Files:**
- Auth logic: [`contexts/AuthContext.tsx`](contexts/AuthContext.tsx)
- OAuth callback: [`app/auth/callback/route.ts`](app/auth/callback/route.ts)
- Trigger: [`supabase/migrations/20240101000000_init_core_schema.sql`](supabase/migrations/20240101000000_init_core_schema.sql) (lines 125-154)

---

### 2. Route Protection

**Component:** `ProtectedRoute` ([`contexts/ProtectedRoute.tsx`](contexts/ProtectedRoute.tsx))

**Behavior:**
- Wraps entire app in `app/layout.tsx`
- Checks if user is authenticated
- **Public routes (no redirect):**
  - `/`, `/login`, `/signup`, `/verify-email`, `/reset-password`, `/update-password`, `/test`
  - Any route starting with `/preview/`
- **Protected routes:** All others → redirect to `/login?redirect=<current_path>`

**Loading state:** Shows spinner only after 300ms delay (prevents flash on quick loads)

---

### 3. PersonalHub - Notes Flow (MVP)

**Pages/UX (target):**
- Notes list (newest first)
- Note details page
- Create note modal/page
- Delete note confirmation

**Rules:**
- `title` required, `body` optional
- Only owner can access (RLS)

---

### 4. PersonalHub - Links Flow (MVP)

**Pages/UX (target):**
- Links list (newest first)
- Link details page (clickable URL)
- Create link modal/page
- Delete link confirmation

**Rules:**
- `url` required, validate URL format
- `title`/`description` optional
- Only owner can access (RLS)

---

### 5. PersonalHub - Files Flow (MVP)

**Upload:**
- Client uploads via authenticated flow (no secrets exposed)
- File stored in S3-compatible backend (AWS S3 / Cloudflare R2 / MinIO)
- Store metadata in DB (name, mime, size, storage provider/key, timestamps)

**Download:**
- Use **presigned URLs** with short TTL **or** authenticated download endpoint that streams the object

**Delete:**
- Confirmation required
- Delete DB record and storage object

---

### 6. (Legacy template) Access Gating (SaaS Mode)

**When enabled** (`FEATURES.BILLING=true` or `FEATURES.TRIALS=true`):

Dashboard and other protected features require **either**:
- Active subscription (`subscriptions.status = 'active' or 'trialing'` AND `current_period_end > NOW()`)
- **OR** valid trial (`user_trials.is_trial_used = false` AND `trial_end_time > NOW()`)

**Implementation:**
- Dashboard checks access in [`app/dashboard/page.tsx`](app/dashboard/page.tsx) (lines 106-131)
- Uses hooks:
  - `useSubscription()` → fetches from `public.subscriptions` (respects `FEATURES.BILLING`)
  - `useTrialStatus()` → checks `public.user_trials` (respects `FEATURES.TRIALS`)
- If neither is valid → redirect to `/profile` (where user can subscribe)

**When disabled** (free app mode):
- Both hooks return "no restriction"
- All authenticated users have full access

---

### 7. (Legacy template) Billing & Subscriptions (Stripe)

**Flow:**
1. User clicks "Subscribe" → Stripe Checkout opens (via `StripeBuyButton` component)
2. User completes payment → Stripe redirects to `/profile?payment=success`
3. **Webhook fires:** `POST /api/stripe/webhook`
   - Event: `checkout.session.completed`
   - Handler creates row in `public.subscriptions` using `supabaseAdmin` (bypasses RLS)
   - Stores: `stripe_customer_id`, `stripe_subscription_id`, `status`, `current_period_end`, etc.
4. Client fetches updated subscription via `useSubscription()` hook

**Webhook Events Handled:**
- `checkout.session.completed` → create subscription
- `customer.subscription.created` → fallback creation
- `customer.subscription.updated` → update status/period
- `customer.subscription.deleted` → mark as canceled
- `customer.subscription.trial_will_end` → (logged, no action yet)

**Subscription Management:**
- Cancel: `POST /api/stripe/cancel` → sets `cancel_at_period_end = true`
- Reactivate: `POST /api/stripe/reactivate` → removes cancellation
- Sync: `POST /api/stripe/sync` → fetches latest data from Stripe API

**Key Files:**
- Webhook: [`app/api/stripe/webhook/route.ts`](app/api/stripe/webhook/route.ts)
- Cancel/Reactivate: [`app/api/stripe/cancel/route.ts`](app/api/stripe/cancel/route.ts), [`app/api/stripe/reactivate/route.ts`](app/api/stripe/reactivate/route.ts)
- Subscription hook: [`hooks/useSubscription.ts`](hooks/useSubscription.ts)
- UI: [`app/profile/page.tsx`](app/profile/page.tsx), [`components/StripeBuyButton.tsx`](components/StripeBuyButton.tsx)

---

### 8. (Legacy template) Trial System (DB-Driven)

**Design:** Trials are managed **entirely in the database** (not client-side), making them tamper-proof.

**Flow:**
1. User signs up → trigger creates `user_trials` row with `trial_end_time = NOW() + 48 hours`
2. Client calls `useTrialStatus()` → queries `public.user_trials`
3. Trial is valid if:
   - `is_trial_used = false`
   - `trial_end_time > NOW()`
   - User has no active subscription
4. When trial expires → `useTrialStatus()` returns `isInTrial = false` → user redirected to `/profile` to subscribe

**Key Files:**
- Trial hook: [`hooks/useTrialStatus.ts`](hooks/useTrialStatus.ts)
- Database trigger: [`supabase/migrations/20240101000000_init_core_schema.sql`](supabase/migrations/20240101000000_init_core_schema.sql) (lines 136-138)
- Helper function: [`supabase/migrations/20240101000001_rls_policies.sql`](supabase/migrations/20240101000001_rls_policies.sql) (lines 121-132)

---

### 9. (Legacy template) Onboarding

**Feature:** Track if user has completed onboarding tour (stored in `public.user_preferences.has_completed_onboarding`)

**When enabled** (`FEATURES.ONBOARDING=true`):
- Dashboard checks onboarding status on mount
- Can trigger onboarding tour UI (implementation TBD)
- User can update preference via Supabase client

**When disabled:**
- Check is skipped, always returns "completed"

---

## Feature Flags (Configuration)

**Location:** [`utils/features.ts`](utils/features.ts)

```typescript
export const FEATURES = {
  BILLING: process.env.NEXT_PUBLIC_ENABLE_BILLING !== 'false',      // default: true
  TRIALS: process.env.NEXT_PUBLIC_ENABLE_TRIALS !== 'false',        // default: true
  ONBOARDING: process.env.NEXT_PUBLIC_ENABLE_ONBOARDING !== 'false' // default: true
}
```

### Common Configurations

| Mode | BILLING | TRIALS | ONBOARDING | Use Case |
|------|---------|--------|------------|----------|
| **Full SaaS** | ✅ | ✅ | ✅ | Production SaaS with payments |
| **Free App** | ❌ | ❌ | ❌ | Completely free app |
| **Freemium** | ✅ | ❌ | ✅ | Optional paid upgrades (no trial) |
| **Demo Mode** | ❌ | ✅ | ✅ | Time-limited demo without payment |

**How Flags Work:**
- `useSubscription()` returns `null` if `BILLING=false` (no subscription checks)
- `useTrialStatus()` returns `isInTrial=false` if `TRIALS=false` (no trial checks)
- Dashboard access gating skips checks if both `BILLING` and `TRIALS` are `false`

**Detailed docs:** [`docs/feature-flags.md`](docs/feature-flags.md)

---

## Environment Variables

**Location:** `.env.local` (not committed, copy from `.env.example`)

### Required Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=            # API URL (local: http://127.0.0.1:54321)
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # Public anon key
SUPABASE_SERVICE_ROLE_KEY=           # Admin key (for API routes/webhooks)

# Stripe (currently REQUIRED by utils/env.ts validation)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # pk_test_... or pk_live_...
NEXT_PUBLIC_STRIPE_BUTTON_ID=        # buy_btn_... (Payment Link ID)
STRIPE_SECRET_KEY=                   # sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=               # whsec_... (from Stripe CLI or webhook endpoint)

# App Config
NEXT_PUBLIC_APP_URL=                 # http://localhost:3000 (local) or production domain

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=             # PostHog project key (if using analytics)
NEXT_PUBLIC_POSTHOG_HOST=            # https://app.posthog.com
```

### Important Caveat for Agents

**Current behavior:** [`utils/env.ts`](utils/env.ts) treats **all Stripe variables as required**, even if `FEATURES.BILLING=false`.

**Workaround for free app mode:**
- Either provide dummy Stripe values (e.g., `pk_test_dummy`, `sk_test_dummy`, etc.)
- Or modify `utils/env.ts` to make Stripe vars conditional based on `FEATURES.BILLING`

**Why this matters:** If you're building a free app and set `NEXT_PUBLIC_ENABLE_BILLING=false`, the app will still crash on startup without Stripe env vars unless you handle this.

---

## Supabase Database Schema

**Managed via:** Supabase CLI migrations in [`supabase/migrations/`](supabase/migrations/)

### Core Tables

1. **`public.users`**
   - Extends `auth.users` with profile fields
   - Supports soft-delete (`is_deleted`, `deleted_at`, `reactivated_at`)
   - RLS: Users can read/update their own profile

2. **`public.subscriptions`**
   - Stores Stripe subscription data
   - Key fields: `stripe_customer_id`, `stripe_subscription_id`, `status`, `current_period_end`
   - RLS: Users can read their own subscriptions; only service role can write (via webhooks)

3. **`public.user_trials`**
   - Manages 48-hour trial periods
   - Key fields: `trial_start_time`, `trial_end_time`, `is_trial_used`
   - Unique constraint: one trial per user
   - RLS: Users can read their own trial; service role manages (via trigger)

4. **`public.user_preferences`**
   - Stores user preferences (currently just onboarding status)
   - Key field: `has_completed_onboarding`
   - RLS: Users can read/update their own preferences

### Helper Functions (Postgres)

- `public.has_active_subscription(user_id UUID) → BOOLEAN`
- `public.is_in_trial(user_id UUID) → BOOLEAN`

### Triggers

- `on_auth_user_created` → fires `handle_new_user()` after insert into `auth.users`
  - Creates rows in `users`, `user_trials`, `user_preferences`

### Local Development

```bash
# Start local Supabase (requires Docker)
supabase start

# Reset database (rerun all migrations)
supabase db reset

# Create new migration
supabase migration new <name>

# Push migrations to production
supabase link --project-ref <ref>
supabase db push
```

**Full guide:** [`supabase/README.md`](supabase/README.md)

---

## Stripe Webhook Details

**Endpoint:** `POST /api/stripe/webhook`

**File:** [`app/api/stripe/webhook/route.ts`](app/api/stripe/webhook/route.ts)

**Behavior:**
1. Verifies Stripe signature using `STRIPE_WEBHOOK_SECRET`
2. Handles events:
   - `checkout.session.completed` → creates subscription in DB
   - `customer.subscription.updated` → updates subscription status/period
   - `customer.subscription.deleted` → marks subscription as canceled
3. Uses `supabaseAdmin` to write to `public.subscriptions` (bypasses RLS)
4. Prevents duplicate subscriptions (checks for existing active subscription before creating)

**Important Notes:**
- Webhook runs with **service role** permissions (admin client)
- All subscription writes go through webhook or admin API routes (users cannot modify their own subscriptions)
- Local testing: use Stripe CLI `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Events to subscribe in Stripe Dashboard:**
```
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
customer.subscription.trial_will_end
```

---

## UI & Styling Conventions

### Tailwind CSS v4

**Custom theme:** Defined in [`app/globals.css`](app/globals.css) via `@theme` directive

**Important:** Only use colors defined in the theme:
- **Brand colors:** `brand-25` through `brand-950` (primary blue)
- **Gray colors:** `gray-25` through `gray-950`, `gray-dark`
- **Status colors:** `success-*`, `error-*`, `warning-*`
- **Special:** `white`, `black`, `transparent`, `current`

**DO NOT use:**
- `primary`, `primary-dark`, `accent` (not defined)
- `slate-*` (use `gray-*` instead)
- Default Tailwind colors not in `@theme`

**Opacity syntax (v4):**
```tsx
// Correct
className="bg-brand-500/50"        // 50% opacity

// Incorrect (v3 syntax)
className="bg-brand-500 bg-opacity-50"
```

**Full guide:** [`.cursor/rules/tailwind-v4.mdc`](.cursor/rules/tailwind-v4.mdc)

### TailAdmin Components

**Approach:** Copy components on-demand from TailAdmin PRO library (not installed as dependency)

**Process:**
1. Copy component files preserving folder structure
2. Copy dependencies recursively (imports, icons, types)
3. Do NOT modify imports or simplify components
4. Use original import paths (e.g., `@/components/ui/dropdown/Dropdown`)

**SVG Icons:** Loaded via `@svgr/webpack` (configured in `next.config.ts`)

**Full guide:** [`.cursor/rules/tailadmin-integration.mdc`](.cursor/rules/tailadmin-integration.mdc)

---

## Where to Start

### For Humans (New Developers)

1. **Setup:** Follow [`docs/quickstart.md`](docs/quickstart.md) (5-step guide)
2. **Configure features:** Read [`docs/feature-flags.md`](docs/feature-flags.md)
3. **Understand architecture:** Read [`docs/core-implementation.md`](docs/core-implementation.md)
4. **Local database:** Read [`supabase/README.md`](supabase/README.md)

### For AI Agents

**Primary context sources:**
- **This file** (`INSTRUCTIONS.md`) — high-level architecture and flows
- **Cursor rules** (`.cursor/rules/*.mdc`) — coding conventions, patterns, constraints
  - [`project-overview.mdc`](.cursor/rules/project-overview.mdc) — stack, principles, file organization
  - [`core-behavior.mdc`](.cursor/rules/core-behavior.mdc) — editing rules, scope limits, commit policy
  - [`api-conventions.mdc`](.cursor/rules/api-conventions.mdc) — API route patterns, error handling, logging
  - [`supabase.mdc`](.cursor/rules/supabase.mdc) — Supabase client usage (client/server/admin)
  - [`react.mdc`](.cursor/rules/react.mdc) — React patterns (hooks, context, client/server components)
  - [`typescript.mdc`](.cursor/rules/typescript.mdc) — TypeScript strict mode, type patterns
- **Documentation** (`docs/`) — detailed guides for specific tasks

**When adding features:**
1. Check feature flags in `utils/features.ts` — respect them in your code
2. Use `supabaseAdmin` for admin operations in API routes (not regular client)
3. Use structured logging (`utils/logger.ts`) in API routes
4. Follow RLS policies — users should only access their own data (unless admin)
5. Test with feature flags enabled/disabled

**Common pitfalls to avoid:**
- Don't use Supabase client in API routes (use `supabaseAdmin` instead)
- Don't bypass RLS in client-side code (enforce it via database policies)
- Don't hardcode Stripe keys (use env vars)
- Don't use undefined Tailwind colors (check `app/globals.css` @theme)
- Don't create barrel exports (`index.ts` with `export *`) for TailAdmin components

---

## Quick Reference

### Access Control Summary

| Route | Auth Required | Subscription/Trial Required (if enabled) |
|-------|---------------|------------------------------------------|
| `/`, `/login`, `/signup` | ❌ | ❌ |
| `/dashboard` | ✅ | ✅ |
| `/profile` | ✅ | ❌ (place to subscribe if expired) |
| `/kanban` | ✅ | ✅ |
| API routes | Varies | ❌ (use service role) |

### Key Hooks

- `useAuth()` → user, session, signIn, signOut, isLoading, isSubscriber
- `useSubscription()` → subscription, isLoading, syncWithStripe, fetchSubscription
- `useTrialStatus()` → isInTrial, trialEndTime, isLoading

### Key Utilities

- `supabaseAdmin` → admin client for API routes/webhooks (bypasses RLS)
- `createClient()` (from `utils/supabase/client.ts`) → client-side Supabase client
- `createClient()` (from `utils/supabase/server.ts`) → server-side Supabase client (SSR)
- `FEATURES` → feature flag object (`BILLING`, `TRIALS`, `ONBOARDING`)

### Database Quick Commands

```bash
# Local dev
supabase start              # Start local stack
supabase db reset           # Reset + rerun migrations
supabase studio             # Open web UI (http://127.0.0.1:54323)

# Production
supabase link --project-ref <ref>
supabase db push            # Apply local migrations to remote
```

---

## Technical Debt & Future Work

See [`docs/technical-debt.md`](docs/technical-debt.md) for complete list.

**High priority:**
- Service layer extraction (move business logic out of API routes)
- Type-safe API responses (Zod schemas)
- Centralized error handling
- Auth + validation middleware composition

---

## Questions or Issues?

1. **Setup problems:** See [`docs/quickstart.md` - Troubleshooting](docs/quickstart.md#troubleshooting)
2. **Feature flags:** See [`docs/feature-flags.md`](docs/feature-flags.md)
3. **Database issues:** See [`supabase/README.md`](supabase/README.md)
4. **Stripe webhooks:** Test locally with `stripe listen --forward-to localhost:3000/api/stripe/webhook`
5. **Coding conventions:** Check `.cursor/rules/*.mdc` files

---

**Last Updated:** 2026-02-08  
**Template Version:** GTS Framework v1.0
