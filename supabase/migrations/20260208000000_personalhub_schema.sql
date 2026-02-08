-- PersonalHub Schema (Notes, Links, Files)
-- Feature: 001-personalhub-db-rls
-- This migration creates PersonalHub tables for personal knowledge storage

-- ============================================================================
-- NOTES TABLE
-- ============================================================================
-- Short text entries owned by user

CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Content
    title TEXT NOT NULL,
    body TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for newest-first list queries
CREATE INDEX IF NOT EXISTS idx_notes_user_created 
    ON public.notes(user_id, created_at DESC);

COMMENT ON TABLE public.notes IS 'User-owned notes for personal knowledge capture';
COMMENT ON COLUMN public.notes.title IS 'Note title (required)';
COMMENT ON COLUMN public.notes.body IS 'Note body content (optional)';

-- ============================================================================
-- LINKS TABLE
-- ============================================================================
-- Saved URLs owned by user

CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Content
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for newest-first list queries
CREATE INDEX IF NOT EXISTS idx_links_user_created 
    ON public.links(user_id, created_at DESC);

COMMENT ON TABLE public.links IS 'User-owned bookmarks and saved links';
COMMENT ON COLUMN public.links.url IS 'URL (required)';
COMMENT ON COLUMN public.links.title IS 'Link title (optional)';
COMMENT ON COLUMN public.links.description IS 'Link description (optional)';

-- ============================================================================
-- FILES TABLE
-- ============================================================================
-- File metadata records for objects stored in external storage

CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- File metadata
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    
    -- Storage reference
    storage_provider TEXT NOT NULL, -- e.g., 's3'
    storage_key TEXT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for newest-first list queries
CREATE INDEX IF NOT EXISTS idx_files_user_created 
    ON public.files(user_id, created_at DESC);

-- Optional uniqueness constraint for storage_key (recommended)
CREATE UNIQUE INDEX IF NOT EXISTS idx_files_storage_key 
    ON public.files(storage_key);

COMMENT ON TABLE public.files IS 'Metadata for user-owned files stored externally';
COMMENT ON COLUMN public.files.original_name IS 'Original filename';
COMMENT ON COLUMN public.files.storage_key IS 'Object key/path in external storage';
