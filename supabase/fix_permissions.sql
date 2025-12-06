-- ==========================================
-- FIX PERMISSIONS SCRIPT
-- Run this in the Supabase SQL Editor to Ensure Project Creators are Owners
-- ==========================================

-- 1. Backfill Missing Members
-- Find projects where the creator is NOT in project_members
INSERT INTO public.project_members (project_id, user_id, role)
SELECT 
    p.id as project_id, 
    p.creator_id as user_id, 
    'owner' as role
FROM public.projects p
WHERE NOT EXISTS (
    SELECT 1 
    FROM public.project_members pm 
    WHERE pm.project_id = p.id AND pm.user_id = p.creator_id
);

-- 2. Ensure Trigger Exists (Idempotent check)
CREATE OR REPLACE FUNCTION public.auto_add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.creator_id, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_project_created ON public.projects;
CREATE TRIGGER on_project_created
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.auto_add_creator_as_member();

-- 3. Update Tasks RLS (Optional Robustness)
-- Ensure 'owner' and 'admin' can definitely manage everything
DROP POLICY IF EXISTS "Members can create/update tasks" ON public.tasks;
CREATE POLICY "Members can create/update tasks" 
ON public.tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.project_members WHERE project_id = tasks.project_id AND user_id = auth.uid())
);
