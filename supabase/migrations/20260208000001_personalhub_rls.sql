-- PersonalHub RLS Policies (Notes, Links, Files)
-- Feature: 001-personalhub-db-rls
-- Enforce private access: user can only access their own records

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- NOTES TABLE POLICIES
-- ============================================================================

-- Users can read their own notes
CREATE POLICY "Users can read own notes" ON public.notes
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own notes
CREATE POLICY "Users can create own notes" ON public.notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY "Users can update own notes" ON public.notes
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes" ON public.notes
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- LINKS TABLE POLICIES
-- ============================================================================

-- Users can read their own links
CREATE POLICY "Users can read own links" ON public.links
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own links
CREATE POLICY "Users can create own links" ON public.links
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own links
CREATE POLICY "Users can update own links" ON public.links
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own links
CREATE POLICY "Users can delete own links" ON public.links
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- FILES TABLE POLICIES
-- ============================================================================

-- Users can read their own files
CREATE POLICY "Users can read own files" ON public.files
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own files
CREATE POLICY "Users can create own files" ON public.files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own files
CREATE POLICY "Users can update own files" ON public.files
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own files
CREATE POLICY "Users can delete own files" ON public.files
    FOR DELETE USING (auth.uid() = user_id);
