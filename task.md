# Task: Fix Project Creator Permissions & RLS

The project creator must be a member and admin of their project to create tasks. The previous frontend-only fix apparently failed, likely due to Row Level Security (RLS) blocking the "self-add" action.

## Checklist
- [ ] Analyze RLS policies in `supabase/setup_v2.sql` for `project_members` and `tasks`. <!-- id: 0 -->
- [ ] Determine if "Self-Repair" (Insert into `project_members`) is blocked by RLS. <!-- id: 1 -->
- [ ] Create a robust solution:
    -   [ ] **Option A (SQL)**: Create a `SECURITY DEFINER` function or Policy change to allow creators to add themselves.
    -   [ ] **Option B (Edge Case)**: Fix the existing frontend logic if it's just a bug (e.g. wrong role name).
- [ ] Verify functionality (if possible via code or mocking). <!-- id: 2 -->
- [ ] Update `walkthrough.md` and notify user. <!-- id: 3 -->
