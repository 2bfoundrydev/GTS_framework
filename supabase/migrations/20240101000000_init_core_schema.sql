-- GTS Framework Core Schema
-- This migration creates the essential tables for SaaS functionality:
-- users, subscriptions, user_trials, user_preferences

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Extends auth.users with profile and soft-delete functionality

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    
    -- Soft delete fields
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMPTZ,
    reactivated_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for soft-deleted users
CREATE INDEX IF NOT EXISTS idx_users_is_deleted ON public.users(is_deleted);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
-- Stores Stripe subscription data

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Stripe fields
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL, -- active, trialing, canceled, etc.
    price_id TEXT,
    
    -- Subscription details
    cancel_at_period_end BOOLEAN DEFAULT FALSE NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    
    -- Soft delete
    deleted_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);

-- ============================================================================
-- USER_TRIALS TABLE
-- ============================================================================
-- Manages trial periods for users

CREATE TABLE IF NOT EXISTS public.user_trials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Trial details
    trial_start_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    trial_end_time TIMESTAMPTZ NOT NULL,
    is_trial_used BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure one trial per user
    CONSTRAINT unique_user_trial UNIQUE(user_id)
);

-- Index for trial queries
CREATE INDEX IF NOT EXISTS idx_user_trials_user_id ON public.user_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_trials_is_trial_used ON public.user_trials(is_trial_used);

-- ============================================================================
-- USER_PREFERENCES TABLE
-- ============================================================================
-- Stores user preferences and onboarding state

CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Onboarding
    has_completed_onboarding BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Ensure one preferences record per user
    CONSTRAINT unique_user_preferences UNIQUE(user_id)
);

-- Index for user preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- ============================================================================
-- TRIGGER FUNCTION: handle_new_user
-- ============================================================================
-- Automatically creates related records when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table
    INSERT INTO public.users (id, email, created_at, updated_at, is_deleted)
    VALUES (NEW.id, NEW.email, NOW(), NOW(), FALSE);
    
    -- Insert into user_preferences (onboarding not completed)
    INSERT INTO public.user_preferences (user_id, has_completed_onboarding)
    VALUES (NEW.id, FALSE);
    
    -- Insert into user_trials (48-hour trial)
    INSERT INTO public.user_trials (user_id, trial_start_time, trial_end_time, is_trial_used)
    VALUES (NEW.id, NOW(), NOW() + INTERVAL '48 hours', FALSE);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: on_auth_user_created
-- ============================================================================
-- Fires after a new user is created in auth.users

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
-- Automatically updates the updated_at timestamp

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_trials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
