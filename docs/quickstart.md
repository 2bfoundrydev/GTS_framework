# Quick Start Guide - GTS Framework

This guide helps you get a working SaaS MVP running in 1-2 hours.

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local Supabase)
- A Supabase account (for production)
- A Stripe account (if using billing)

## Quick Setup (5 Steps)

### 1. Clone and Install

```bash
git clone <your-repo> my-mvp
cd my-mvp
npm install
```

### 2. Set Up Local Database

```bash
# Start Supabase locally (requires Docker)
supabase start

# This will output connection details - save them!
```

You'll see output like:
```
API URL: http://127.0.0.1:54321
anon key: eyJhbGc...
service_role key: eyJhbGc...
```

### 3. Configure Environment

Copy `.env.example` to `.env.local` and fill in the values from step 2:

```bash
cp .env.example .env.local
```

**Minimum required for local development:**
```bash
# From `supabase start` output
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Use localhost for local dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Optional - Stripe (only if NEXT_PUBLIC_ENABLE_BILLING=true):**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_BUTTON_ID=buy_btn_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe CLI or webhook endpoint)
```

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test Core Functionality

See **Smoke Test Checklist** below.

---

## Feature Flags (Optional Core)

Control which SaaS features are enabled. All default to `true`.

```bash
# In .env.local

# Enable/disable billing and subscriptions
NEXT_PUBLIC_ENABLE_BILLING=true

# Enable/disable trial periods
NEXT_PUBLIC_ENABLE_TRIALS=true

# Enable/disable onboarding tour
NEXT_PUBLIC_ENABLE_ONBOARDING=true
```

**Common configurations:**

| Mode | Billing | Trials | Onboarding | Use Case |
|------|---------|--------|------------|----------|
| **Full SaaS** | ✅ | ✅ | ✅ | Production SaaS with payments |
| **Free App** | ❌ | ❌ | ❌ | Completely free app |
| **Freemium** | ✅ | ❌ | ✅ | Optional paid upgrades |
| **Demo/Trial** | ❌ | ✅ | ✅ | Time-limited demo |

See [feature-flags.md](./feature-flags.md) for details.

---

## Smoke Test Checklist

Use this checklist to verify your setup is working:

### Core Authentication ✓

- [ ] **Sign up with email/password**
  - Go to `/login`
  - Click "Need an account? Sign up"
  - Enter email and password
  - Check for email verification (if enabled in Supabase)
  - ✅ Should redirect to dashboard or verification page

- [ ] **Sign in with email/password**
  - Go to `/login`
  - Enter credentials
  - ✅ Should redirect to dashboard

- [ ] **Sign out**
  - Click profile/logout button
  - ✅ Should redirect to login page

### Database & Triggers (if ENABLE_TRIALS=true) ✓

- [ ] **New user records created automatically**
  - Sign up a new user
  - Check Supabase Studio (http://127.0.0.1:54323)
  - ✅ Should see records in:
    - `public.users` (with user's email)
    - `public.user_trials` (with 48-hour trial)
    - `public.user_preferences` (with onboarding=false)

### Trial System (if ENABLE_TRIALS=true) ✓

- [ ] **Trial status shows on dashboard**
  - Sign in as new user
  - Go to `/dashboard`
  - ✅ Should see "Trial Period" indicator

- [ ] **Trial status shows on profile**
  - Go to `/profile`
  - ✅ Should see trial end date

### Billing & Subscriptions (if ENABLE_BILLING=true) ✓

- [ ] **Stripe Buy Button appears**
  - Go to `/profile` (as user without subscription)
  - ✅ Should see Stripe checkout button

- [ ] **Test Stripe checkout (test mode)**
  - Click Stripe button
  - Use test card: `4242 4242 4242 4242`
  - Complete checkout
  - ✅ Should redirect to `/profile?payment=success`

- [ ] **Subscription appears in database**
  - Check Supabase Studio → `subscriptions` table
  - ✅ Should see new subscription with status 'active' or 'trialing'

- [ ] **Webhook receives event (optional)**
  - Set up Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
  - Complete a test checkout
  - ✅ Should see webhook events in terminal

### Access Control ✓

- [ ] **Dashboard requires auth**
  - Sign out
  - Try to go to `/dashboard`
  - ✅ Should redirect to `/login`

- [ ] **Dashboard requires subscription/trial** (if billing or trials enabled)
  - Create user with expired trial and no subscription
  - Try to access `/dashboard`
  - ✅ Should redirect to `/profile`

### Profile & Settings ✓

- [ ] **Profile page loads**
  - Go to `/profile`
  - ✅ Should show account info and subscription status

- [ ] **Cancel subscription** (if have active subscription)
  - Go to `/profile`
  - Click "Cancel Subscription"
  - ✅ Should show cancellation confirmation

### Onboarding (if ENABLE_ONBOARDING=true) ✓

- [ ] **Onboarding tour shows for new users**
  - Sign in as user with `has_completed_onboarding=false`
  - ✅ Should see onboarding tour (if implemented)

---

## Production Deployment Checklist

Before deploying to production:

### Environment

- [ ] Set production Supabase URL and keys
- [ ] Set production Stripe keys (live mode)
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure `CORS_ALLOWED_ORIGINS` if needed

### Supabase

- [ ] Push migrations to production: `supabase db push`
- [ ] Enable Row Level Security on all tables
- [ ] Configure auth providers (Google OAuth if used)
- [ ] Set up email templates (for auth emails)
- [ ] Test auth flow in production

### Stripe

- [ ] Create production product and prices
- [ ] Create production payment link or buy button
- [ ] Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
- [ ] Configure webhook events (see below)
- [ ] Get webhook signing secret
- [ ] Test a real payment

### Required Stripe Webhook Events

Subscribe to these events in your Stripe webhook:

```
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
customer.subscription.trial_will_end
```

### Security

- [ ] Review RLS policies in Supabase
- [ ] Ensure `.env.local` is in `.gitignore`
- [ ] Never commit secrets to git
- [ ] Use environment variables for all keys
- [ ] Enable Supabase Auth rate limiting if needed

---

## Troubleshooting

### "Missing environment variable" error

**Solution**: Make sure all required variables in `.env.example` are set in `.env.local`

### Database tables don't exist

**Solution**: Run `supabase db reset` to recreate tables from migrations

### Stripe webhook not working locally

**Solution**: 
1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Copy webhook secret to `.env.local`

### "Port already in use"

**Solution**: 
```bash
supabase stop
lsof -ti:3000 | xargs kill -9  # Kill Next.js
lsof -ti:54321 | xargs kill -9  # Kill Supabase API
```

### Trial not appearing for new users

**Solution**: Check that:
1. `supabase start` ran successfully
2. Migrations ran (check Supabase Studio → Database → Migrations)
3. Trigger `handle_new_user` exists (check Functions tab)

### Can't access dashboard after signup

**Solution**: Check feature flags:
- If billing/trials disabled, you should have access
- If enabled, check `user_trials` table for active trial
- Check browser console for errors

---

## Next Steps

1. **Customize UI**: Edit components in `components/`
2. **Add domain logic**: Create your MVP features
3. **Configure feature flags**: Enable/disable billing, trials, onboarding
4. **Deploy**: See [Production Deployment Checklist](#production-deployment-checklist)
5. **Monitor**: Set up PostHog or other analytics

---

## Learn More

- [Documentation Index](./INDEX.md)
- [Feature Flags Documentation](./feature-flags.md)
- [Full README](../README.md)
