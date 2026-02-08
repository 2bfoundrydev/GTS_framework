# Feature Flags Configuration

This document describes the feature flags available in GTS Framework to control optional SaaS functionality.

## Available Feature Flags

### NEXT_PUBLIC_ENABLE_BILLING

**Default**: `true` (enabled by default)

Controls Stripe billing and subscription functionality.

**When enabled:**
- Users can subscribe via Stripe
- Subscription status is checked in dashboard
- Profile page shows subscription management
- Stripe webhooks process subscription events

**When disabled:**
- All billing UI is hidden
- No subscription checks are performed
- Users have full access without payment
- Stripe webhooks still work but subscriptions aren't required

**To disable:**
```bash
# In .env.local
NEXT_PUBLIC_ENABLE_BILLING=false
```

### NEXT_PUBLIC_ENABLE_TRIALS

**Default**: `true` (enabled by default)

Controls 48-hour trial periods for new users.

**When enabled:**
- New users automatically get a 48-hour trial
- Trial status is checked in dashboard
- Access is granted during trial period
- Trial info shows in profile

**When disabled:**
- No trials are created or checked
- Users must subscribe immediately (if billing enabled)
- Or have full access (if billing disabled)

**To disable:**
```bash
# In .env.local
NEXT_PUBLIC_ENABLE_TRIALS=false
```

### NEXT_PUBLIC_ENABLE_ONBOARDING

**Default**: `true` (enabled by default)

Controls onboarding tour and user preferences tracking.

**When enabled:**
- Onboarding tour shows for new users
- User preferences are tracked
- `has_completed_onboarding` flag is checked

**When disabled:**
- No onboarding tour
- Onboarding checks are skipped
- `user_preferences` table still exists but isn't required

**To disable:**
```bash
# In .env.local
NEXT_PUBLIC_ENABLE_ONBOARDING=false
```

## Common Configurations

### Full SaaS Mode (Default)
```bash
NEXT_PUBLIC_ENABLE_BILLING=true
NEXT_PUBLIC_ENABLE_TRIALS=true
NEXT_PUBLIC_ENABLE_ONBOARDING=true
```
**Use case**: Full-featured SaaS with payments, trials, and onboarding.

### Free App Mode
```bash
NEXT_PUBLIC_ENABLE_BILLING=false
NEXT_PUBLIC_ENABLE_TRIALS=false
NEXT_PUBLIC_ENABLE_ONBOARDING=false
```
**Use case**: Free app with no payment or trial restrictions.

### Freemium Mode
```bash
NEXT_PUBLIC_ENABLE_BILLING=true
NEXT_PUBLIC_ENABLE_TRIALS=false
NEXT_PUBLIC_ENABLE_ONBOARDING=true
```
**Use case**: Free access with optional paid upgrades (no forced trial).

### Trial-Only Mode
```bash
NEXT_PUBLIC_ENABLE_BILLING=false
NEXT_PUBLIC_ENABLE_TRIALS=true
NEXT_PUBLIC_ENABLE_ONBOARDING=true
```
**Use case**: Limited-time trial without payment (for testing or demos).

## Implementation Details

Feature flags are checked in:
- `utils/features.ts` - Central feature flag configuration
- `hooks/useSubscription.ts` - Returns null if billing disabled
- `hooks/useTrialStatus.ts` - Returns not-in-trial if trials disabled
- `contexts/AuthContext.tsx` - Skips subscription check if billing disabled
- `app/dashboard/page.tsx` - Conditional access checks
- `app/profile/page.tsx` - Conditional subscription UI

## Database Implications

Even with features disabled, the core tables (`users`, `subscriptions`, `user_trials`, `user_preferences`) still exist in the database. This allows you to:

1. Toggle features on/off without migrations
2. Preserve historical data
3. Re-enable features later without data loss

The application code simply doesn't query or display this data when features are disabled.

## Testing Different Modes

To quickly test different configurations:

```bash
# Test in free mode
NEXT_PUBLIC_ENABLE_BILLING=false npm run dev

# Test with trials only
NEXT_PUBLIC_ENABLE_BILLING=false NEXT_PUBLIC_ENABLE_TRIALS=true npm run dev
```

## Notes

- Feature flags are **client-side** (NEXT_PUBLIC prefix required)
- Changes require app restart to take effect
- Server-side code (API routes, webhooks) still works regardless of flags
- This allows backend billing to continue while frontend hides UI
