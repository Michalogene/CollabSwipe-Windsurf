-- COLABSWIPE V2 SCHEMA - COMPLETE SETUP
-- Run this in the Supabase SQL Editor to initialize the new project.

-- ==========================================
-- 1. CLEANUP (For fresh install on new project, strictly optional but good safety)
-- ==========================================
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS project_media CASCADE;
DROP TABLE IF EXISTS project_interests CASCADE; -- Legacy table, replaced by project_members/applications? Keeping for now or removing?
-- The plan didn't explicitly mention removing project_interests, but project_members handles approved members.
-- We'll keep project_interests for "pending" applications if needed, or unify.
-- Let's stick to the Plan: profiles, projects, project_members, tasks, chats, etc.
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS swipes CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==========================================
-- 2. CORE IDENTITY & PROFILES
-- ==========================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('freelancer', 'client', 'admin')) DEFAULT 'freelancer',
    bio TEXT,
    location TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 3. PROJECTS
-- ==========================================
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'paused', 'completed', 'cancelled')) DEFAULT 'active',
    collaboration_type TEXT, -- e.g. 'Web App', 'SaaS'
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone" 
ON public.projects FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create projects" 
ON public.projects FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own projects" 
ON public.projects FOR UPDATE USING (auth.uid() = creator_id);

-- 3.1 PROJECT SKILLS
CREATE TABLE public.project_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Expert')) DEFAULT 'Intermediate',
    people_needed INTEGER DEFAULT 1
);

ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project skills are viewable by everyone" 
ON public.project_skills FOR SELECT USING (true);

CREATE POLICY "Creators can manage project skills" 
ON public.project_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- 3.2 PROJECT MEDIA
CREATE TABLE public.project_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    type TEXT CHECK (type IN ('image', 'video')) DEFAULT 'image',
    is_cover BOOLEAN DEFAULT false
);

ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project media is viewable by everyone" 
ON public.project_media FOR SELECT USING (true);

CREATE POLICY "Creators can manage project media" 
ON public.project_media FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- 3.3 PROJECT MEMBERS
CREATE TABLE public.project_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members viewable by everyone" 
ON public.project_members FOR SELECT USING (true);

-- Allow creators to add members (simplified for now)
CREATE POLICY "Creators can manage members" 
ON public.project_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND creator_id = auth.uid())
);

-- Use trigger to auto-add creator as owner?
CREATE OR REPLACE FUNCTION public.auto_add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.creator_id, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.auto_add_creator_as_member();

-- ==========================================
-- 4. WORKSPACE & TASKS (The Missing Piece)
-- ==========================================
CREATE TABLE public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
    priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    tag TEXT DEFAULT 'General',
    position INTEGER DEFAULT 0, -- For Kanban ordering
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Tasks strictly for members? Or public projects have public tasks? 
-- Let's make it: Visible to Members Only to start, or Public if project is public?
-- For now: Members Only.
CREATE POLICY "Members can view tasks" 
ON public.tasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.project_members WHERE project_id = tasks.project_id AND user_id = auth.uid())
);

CREATE POLICY "Members can create/update tasks" 
ON public.tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.project_members WHERE project_id = tasks.project_id AND user_id = auth.uid())
);

-- 4.1 TASK COMMENTS
CREATE TABLE public.task_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view comments" 
ON public.task_comments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id = task_comments.task_id AND pm.user_id = auth.uid()
    )
);

CREATE POLICY "Members add comments" 
ON public.task_comments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tasks t
        JOIN public.project_members pm ON pm.project_id = t.project_id
        WHERE t.id = task_comments.task_id AND pm.user_id = auth.uid()
    )
);

-- ==========================================
-- 5. SOCIAL (Swipes, Matches, Chat)
-- ==========================================
CREATE TABLE public.swipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    swiper_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    swiped_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- User swipe
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE, -- Project swipe (optional)
    action TEXT CHECK (action IN ('like', 'pass', 'super_like')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(swiper_id, swiped_id) -- Prevent double swipe on user
);

ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own swipes" 
ON public.swipes FOR SELECT USING (auth.uid() = swiper_id);

CREATE POLICY "Users create own swipes" 
ON public.swipes FOR INSERT WITH CHECK (auth.uid() = swiper_id);

-- Matches
CREATE TABLE public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their matches" 
ON public.matches FOR SELECT USING (
    auth.uid() = user1_id OR auth.uid() = user2_id
);

-- Conversations
CREATE TABLE public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Linking conversations to matches? Or participants table?
-- Let's use a participants table for flexibility (Group chat support)
CREATE TABLE public.conversation_participants (
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own conversations" 
ON public.conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
);

CREATE POLICY "View own participations"
ON public.conversation_participants FOR SELECT USING (user_id = auth.uid());

-- Messages
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View messages in own conversations" 
ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

CREATE POLICY "Send messages in own conversations" 
ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- ==========================================
-- 6. TRIGGERS & FUNCTIONS
-- ==========================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 7. STORAGE
-- ==========================================
-- Note: Buckets must be created via API or Dashboard usually, but SQL can do it if the extension is enabled.
-- We assume the storage schema exists.

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('project-assets', 'project-assets', true),
  ('task-attachments', 'task-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "User Upload Avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public Project Assets" ON storage.objects FOR SELECT USING (bucket_id = 'project-assets');
CREATE POLICY "Creator Upload Assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-assets' AND auth.role() = 'authenticated'); -- Simplified

-- ==========================================
-- 7.5 NOTIFICATIONS (Added to fix Realtime error)
-- ==========================================
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own notifications" 
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 8. REALTIME
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
