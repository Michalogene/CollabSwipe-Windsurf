# Implementation Plan - Fix Task Creation & Visibility

User reports tasks are not saving in Project Workspace. This is likely due to Row Level Security (RLS) policies requiring the user to be a `project_member`, and some creators might be missing from this table for existing projects.

## Root Cause Analysis
- **RLS Policy**: `tasks` table only allows `INSERT` if `auth.uid()` is in `project_members`.
- **Missing Member**: Projects created before the `auto_add_creator_as_member` trigger was active (or mock data) have creators who are NOT members.
- **Result**: Creator cannot create tasks.

## Proposed Changes

### Service Layer
#### [MODIFY] [src/services/projects.ts](file:///c:/Users/Miche/OneDrive/Documents/CollabSwipe Final/CollabSwipe Antigravity/CollabSwipe-Windsurf/src/services/projects.ts)
- Add `addProjectMember(projectId, userId, role)`: To allow adding users (specifically the creator) to the project.
- Add `checkProjectMembership(projectId, userId)`: Helper to check if a user is a member.

### UI Components
#### [MODIFY] [src/pages/ProjectWorkspace.tsx](file:///c:/Users/Miche/OneDrive/Documents/CollabSwipe Final/CollabSwipe Antigravity/CollabSwipe-Windsurf/src/pages/ProjectWorkspace.tsx)
- **Self-Repair Logic**: In `loadData`, check if the current user is the `creator`. If so, verify they are in `project_members`. If not, auto-add them.
- **Error Handling**: Add visual feedback (toast/alert) if `createTask` fails.
- **Real-time**: Ensure `project_id` is correctly passed to `createTask`.

### Database (Critical)
#### [NEW] [supabase/fix_permissions.sql](file:///c:/Users/Miche/OneDrive/Documents/CollabSwipe Final/CollabSwipe Antigravity/CollabSwipe-Windsurf/supabase/fix_permissions.sql)
- **Backfill Script**: Insert into `project_members` (role='owner') for every project where `creator_id` is not present in `project_members`.
- **Trigger Check**: Re-apply the `auto_add_creator_as_member` trigger to ensure future consistency.

### UI Components
#### [MODIFY] [src/pages/ProjectWorkspace.tsx](file:///c:/Users/Miche/OneDrive/Documents/CollabSwipe Final/CollabSwipe Antigravity/CollabSwipe-Windsurf/src/pages/ProjectWorkspace.tsx)
- Enhance "Self-Repair": If silent fix fails, show a prominent "Initialize Project Workspace" button for the creator, which retries the membership addition with feedback.
- Ensure `role` 'owner' is used.

## Verification Plan
1.  **Run SQL**: User runs the provided SQL in Supabase Dashboard.
2.  **Verify Frontend**: Open Project Workspace. Creator should immediately be able to create tasks without error.

