# Walkthrough - Fixing Project Permissions (Critical)

To permanently resolve the "Task Creation" and "Permission" issues for project creators, a database-level fix is required.

## 1. Run the SQL Fix Script
The issue is that existing projects may not have the creator listed as an 'owner' in the members table. RLS policies block them from adding themselves via the UI in some cases.

**Action Required**:
1.  Go to your **Supabase Dashboard** > **SQL Editor**.
2.  Open the file generated at: `supabase/fix_permissions.sql` (or copy the content below).
3.  **Run** the script.

```sql
-- 1. Backfill Missing Members
INSERT INTO public.project_members (project_id, user_id, role)
SELECT 
    p.id, p.creator_id, 'owner'
FROM public.projects p
WHERE NOT EXISTS (
    SELECT 1 FROM public.project_members pm 
    WHERE pm.project_id = p.id AND pm.user_id = p.creator_id
);

-- 2. Force Trigger Update
-- (See full file for trigger logic)
```

## 2. Verify in Application
1.  Navigate to **My Projects** > **Workspace**.
2.  Try to create a Task.
3.  **If an error persists**: You will now see a banner "Permissions Issue Detected". Click the **"Repair Permissions"** button. This attempts a final self-correction.

## Changes Made
- **Database**: Created `supabase/fix_permissions.sql` to backfill ownership.
- **Frontend**: Added robust "Repair Permissions" UI in `ProjectWorkspace.tsx` that appears if the automatic check fails.
