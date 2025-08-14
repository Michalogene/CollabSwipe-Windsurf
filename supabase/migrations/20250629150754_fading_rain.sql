/*
  # Configuration Complète ColabSwipe

  1. Tables principales
    - `profiles` - Profils utilisateurs étendus
    - `swipes` - Actions de swipe
    - `matches` - Connexions mutuelles
    - `conversations` - Discussions
    - `messages` - Messages temps réel
    - `projects` - Projets collaboratifs
    - `project_interests` - Intérêts pour projets

  2. Sécurité
    - RLS activé sur toutes les tables
    - Policies pour chaque table
    - Storage buckets avec policies

  3. Fonctionnalités
    - Trigger auto-création profil
    - Realtime pour chat
    - Storage pour médias
*/

-- ===== SUPPRESSION ET RECRÉATION PROPRE =====
DROP TABLE IF EXISTS project_interests CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS swipes CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ===== TABLE PROFILES =====
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  activity TEXT,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  collaboration_types TEXT[] DEFAULT '{}',
  availability TEXT,
  project_interests TEXT,
  portfolio_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE SWIPES =====
CREATE TABLE swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('like', 'pass', 'super_like')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

-- ===== TABLE MATCHES =====
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user1_id, user2_id)
);

-- ===== TABLE CONVERSATIONS =====
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE MESSAGES =====
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- ===== TABLE PROJECTS =====
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  collaboration_type TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  deadline DATE,
  media_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLE PROJECT_INTERESTS =====
CREATE TABLE project_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- ===== ACTIVER RLS SUR TOUTES LES TABLES =====
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_interests ENABLE ROW LEVEL SECURITY;

-- ===== POLICIES POUR PROFILES =====
CREATE POLICY "Profiles publiquement lisibles" ON profiles 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Utilisateurs peuvent insérer leur profil" ON profiles 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Utilisateurs peuvent modifier leur profil" ON profiles 
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ===== POLICIES POUR SWIPES =====
CREATE POLICY "Utilisateurs peuvent créer leurs swipes" ON swipes 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = swiper_id);

CREATE POLICY "Utilisateurs peuvent voir swipes les concernant" ON swipes 
  FOR SELECT TO authenticated USING (auth.uid() = swiper_id OR auth.uid() = swiped_id);

-- ===== POLICIES POUR MATCHES =====
CREATE POLICY "Utilisateurs voient leurs matches" ON matches 
  FOR SELECT TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Système peut créer des matches" ON matches 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ===== POLICIES POUR CONVERSATIONS =====
CREATE POLICY "Utilisateurs voient leurs conversations" ON conversations 
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM matches m 
      WHERE m.id = match_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    )
  );

CREATE POLICY "Système peut créer des conversations" ON conversations 
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches m 
      WHERE m.id = match_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    )
  );

-- ===== POLICIES POUR MESSAGES =====
CREATE POLICY "Messages visibles aux participants" ON messages 
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations c
      JOIN matches m ON c.match_id = m.id
      WHERE c.id = conversation_id 
      AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    )
  );

CREATE POLICY "Utilisateurs peuvent envoyer des messages" ON messages 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- ===== POLICIES POUR PROJECTS =====
CREATE POLICY "Projets publiquement lisibles" ON projects 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Créateurs modifient leurs projets" ON projects 
  FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

CREATE POLICY "Utilisateurs créent leurs projets" ON projects 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

-- ===== POLICIES POUR PROJECT_INTERESTS =====
CREATE POLICY "Utilisateurs voient intérêts de leurs projets" ON project_interests 
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND creator_id = auth.uid())
  );

CREATE POLICY "Utilisateurs peuvent exprimer leur intérêt" ON project_interests 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ===== FONCTION TRIGGER POUR CRÉER LE PROFIL AUTO =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== TRIGGER SUR CRÉATION D'UTILISATEUR =====
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== CRÉER LES BUCKETS DE STORAGE =====
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('project-media', 'project-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ===== POLICIES POUR STORAGE =====
CREATE POLICY "Avatar images publiquement accessibles" ON storage.objects 
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Utilisateurs peuvent uploader leurs avatars" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Utilisateurs peuvent supprimer leurs avatars" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Project media publiquement accessible" ON storage.objects 
  FOR SELECT USING (bucket_id = 'project-media');

CREATE POLICY "Utilisateurs peuvent uploader project media" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'project-media');

-- ===== ACTIVER REALTIME =====
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE project_interests;