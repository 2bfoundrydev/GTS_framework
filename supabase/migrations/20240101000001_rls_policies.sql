-- GTS Framework RLS Policies
-- This migration enables Row Level Security and creates policies for user data access

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile (except critical fields)
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Prevent users from changing is_deleted, deleted_at, reactivated_at directly
        AND is_deleted = (SELECT is_deleted FROM public.users WHERE id = auth.uid())
    );

-- Service role can do anything (for admin operations and triggers)
CREATE POLICY "Service role has full access to users"
    ON public.users
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- ============================================================================

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can insert/update/delete subscriptions
-- (This is managed by Stripe webhooks and API routes)
CREATE POLICY "Service role has full access to subscriptions"
    ON public.subscriptions
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- USER_TRIALS TABLE POLICIES
-- ============================================================================

-- Users can read their own trial status
CREATE POLICY "Users can read own trial"
    ON public.user_trials
    FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can manage trials (DB-driven via trigger)
CREATE POLICY "Service role has full access to trials"
    ON public.user_trials
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- USER_PREFERENCES TABLE POLICIES
-- ============================================================================

-- Users can read their own preferences
CREATE POLICY "Users can read own preferences"
    ON public.user_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
    ON public.user_preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can upsert their own preferences (for onboarding flow)
CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role has full access to preferences"
    ON public.user_preferences
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user has active subscription (can be used in policies)
CREATE OR REPLACE FUNCTION public.has_active_subscription(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.subscriptions
        WHERE user_id = check_user_id
        AND status IN ('active', 'trialing')
        AND current_period_end > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is in trial
CREATE OR REPLACE FUNCTION public.is_in_trial(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_trials
        WHERE user_id = check_user_id
        AND is_trial_used = FALSE
        AND trial_end_time > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.users IS 'User profiles with soft-delete functionality';
COMMENT ON TABLE public.subscriptions IS 'Stripe subscription records';
COMMENT ON TABLE public.user_trials IS 'Trial period tracking for users';
COMMENT ON TABLE public.user_preferences IS 'User preferences including onboarding state';

COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to initialize user data on signup';
COMMENT ON FUNCTION public.has_active_subscription(UUID) IS 'Check if user has active or trialing subscription';
COMMENT ON FUNCTION public.is_in_trial(UUID) IS 'Check if user is currently in trial period';
