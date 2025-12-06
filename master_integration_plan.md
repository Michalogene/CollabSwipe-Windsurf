# Master Integration Plan

## Goal Description
Finalize the backend architecture and provide a step-by-step guide to connect the existing React frontend to Supabase. This plan covers database schema, storage, security (RLS), and a specific implementation roadmap.

## User Review Required
> [!IMPORTANT]
> **Database Changes**: The existing `projects` table uses arrays (`required_skills`, `media_urls`) but the frontend code (`CreateProjectWizard.tsx`) expects separate tables (`project_skills`, `project_media`). This plan aligns the backend with the **frontend's expectation** by adding these new tables.

> [!WARNING]
> **Data Security**: RLS policies are critical. This plan enforces strict rules: users can only edit their own data, and only project members can edit project tasks.

## PHASE 1: Backend Architecture Finalization (The Blueprint)

### 1. Database Schema Proposal

#### Core Identity & Profiles
- **`profiles`** (Extends Auth)
    - `id` (UUID, PK, FK -> auth.users)
    - `email`, `first_name`, `last_name`, `avatar_url` (Text)
    - `role` (Text or Enum: 'freelancer', 'client', 'admin')
    - `bio`, `location` (Text)
    - `skills` (Text[] - specific to user profile)
    - `created_at`, `updated_at`

#### Project Management
- **`projects`**
    - `id` (UUID, PK)
    - `creator_id` (UUID, FK -> profiles.id)
    - `title`, `description` (Text)
    - `status` (Enum: 'active', 'paused', 'completed', 'cancelled')
    - `collaboration_type` (Text)
    - `deadline` (Date)
    - `created_at`

- **`project_skills`** (For filtering and detailed requirements)
    - `id` (UUID, PK)
    - `project_id` (UUID, FK -> projects.id)
    - `skill_name` (Text)
    - `level` (Text: 'Beginner', 'Intermediate', 'Expert')
    - `people_needed` (Int)

- **`project_media`** (For gallery/attachments)
    - `id` (UUID, PK)
    - `project_id` (UUID, FK -> projects.id)
    - `url` (Text)
    - `type` (Text: 'image', 'video')
    - `is_cover` (Boolean)

- **`project_members`** (Official team members)
    - `id` (UUID, PK)
    - `project_id` (UUID, FK -> projects.id)
    - `user_id` (UUID, FK -> profiles.id)
    - `role` (Text: 'owner', 'admin', 'member')
    - `joined_at` (Timestamp)

#### Interaction & Networking
- **`swipes`** (Matching logic)
    - `id`, `swiper_id`, `swiped_id`, `action` ('like', 'pass'), `project_id` (optional, if swiping on projects)

- **`matches`** (Successful connections)
    - `id`, `user1_id`, `user2_id`, `project_id` (optional context)

- **`chats`** (or `conversations`)
    - `id`, `created_at`

- **`messages`**
    - `id`, `chat_id`, `sender_id`, `content`, `read_at`

#### Workspace & Task Management (New)
- **`tasks`**
    - `id` (UUID, PK)
    - `project_id` (UUID, FK -> projects.id)
    - `title`, `description` (Text)
    - `status` (Text: 'todo', 'in_progress', 'done')
    - `priority` (Enum: 'High', 'Medium', 'Low')
    - `assignee_id` (UUID, FK -> profiles.id, nullable)
    - `due_date` (Date)
    - `tag` (Text)
    - `position` (Int - for ordering in columns)

- **`task_comments`**
    - `id` (UUID, PK)
    - `task_id` (UUID, FK -> tasks.id)
    - `author_id` (UUID, FK -> profiles.id)
    - `content` (Text)
    - `created_at`

### 2. Storage Bucket Strategy
- **`avatars`**
    - Public: Yes
    - Policy: Everyone can read. Authenticated users can upload if filename starts with their `user_id/`.
- **`project-assets`** (Matches frontend code)
    - Public: Yes
    - Policy: Everyone can read. Project `creator_id` (or members) can upload.
- **`task-attachments`**
    - Public: No (Private)
    - Policy: Only `project_members` of the linked project can read/write.

### 3. Row Level Security (RLS) Policies Design

**Rule of Thumb**: "Deny by default".

- **`profiles`**:
    - Select: Public (or Authenticated only)
    - Update: `auth.uid() = id`
- **`projects`**:
    - Select: Public
    - Insert: Authenticated
    - Update: `auth.uid() = creator_id` OR `auth.uid() IN (select user_id from project_members where role='admin')`
- **`project_skills` / `project_media`**:
    - View: Public
    - Modify: Check parent project permissions.
- **`tasks`**:
    - Select: `auth.uid() IN (member of project)` (or Public if project is public?) -> Typically private workspace.
    - Insert/Update: `auth.uid() IN (member of project)`
- **`messages`**:
    - Select/Insert: `auth.uid() IN (participants of conversation)`

---

## PHASE 2: Step-by-Step Integration Plan (The Roadmap)

### 1. Authentication & Profile Basis
**Goal**: User can sign up/login and edit their profile.
- **Backend**:
    - Ensure `profiles` table exists.
    - Deploy `handle_new_user` trigger for Auth sync.
    - Set RLS for profiles.
- **Frontend**:
    - `AuthContext`: Check `useAuth` hook integrates Supabase `onAuthStateChange`.
    - `ProfileSetupPage`: Bind form submit to `supabase.from('profiles').update()`.
    - `UserProfile`: Fetch data with `supabase.from('profiles').select()`.

### 2. Project Creation (The Wizard)
**Goal**: User can complete the wizard and data persists.
- **Backend**:
    - Create `projects`, `project_skills`, `project_media` tables.
    - Create `project-assets` storage bucket.
    - RLS: Allow creation by authenticated users.
- **Frontend**:
    - `CreateProjectWizard`:
        - Ensure upload logic uses `project-assets` bucket.
        - Ensure `insert` calls match the new schema (`project_skills`, etc.).
        - Add transaction logic (or verify if Supabase call structure handles partial failures gracefully).

### 3. Discover & Explore
**Goal**: Users can browse projects and filter.
- **Backend**:
    - Index `created_at`, `status` on `projects`.
    - Enable filtering by `project_skills`.
- **Frontend**:
    - `DashboardExplore`: Replace mock data with `supabase.from('projects').select('*, project_skills(*), project_media(*)')`.
    - Implement search/filter logic using Supabase modifiers (`.eq`, `.contains`).

### 4. Workspace & Task Board (Complex)
**Goal**: Drag & drop tasks, see live updates.
- **Backend**:
    - Create `tasks` table with `status` column.
    - Enable Realtime on `tasks` table.
- **Frontend**:
    - `ProjectWorkspace`:
        - Fetch tasks: `const { data } = await supabase.from('tasks').select('*').eq('project_id', pid)`.
        - Drag & Drop `onDragEnd`: Calls `supabase.from('tasks').update({ status: newStatus }).eq('id', taskId)`.
        - Realtime Subscription: Listen for `postgres_changes` on `tasks` to update UI when others move cards.

### 5. Chat & Realtime
**Goal**: Messaging between users.
- **Backend**:
    - Ensure `conversations` and `messages` tables.
    - Enable Realtime on `messages`.
- **Frontend**:
    - `ChatPage`:
        - Load list of conversations.
        - Subscribe to new messages: `.on('postgres_changes', ...)`.
        - Send message: `supabase.from('messages').insert()`.

### 6. Verification Plan
#### Automated Tests
- We will rely on manual verification via the browser for UI flows.
- Use `browser` tool to verify login flow.
#### Manual Verification
- **Profile**: Create account, upload avatar, save bio. Refresh page to verify persistence.
- **Project**: Create "Test Project", upload image. Check "My Projects" list.
- **Tasks**: Go to workspace, create task "Test Task". Drag to "Done". Refresh to verify state.
