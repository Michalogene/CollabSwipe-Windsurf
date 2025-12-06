import { supabase } from './supabase';

export interface Project {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  required_skills: string[];
  collaboration_type?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  deadline?: string;
  media_urls: string[];
  created_at: string;
  updated_at: string;
  creator?: any;
  views?: number;
  collaborators?: number;
  members_count?: number;
}

// Helper to transform database response to Project type
const transformProject = (row: any): Project => {
  return {
    ...row,
    required_skills: row.project_skills?.map((s: any) => s.skill_name) || [],
    media_urls: row.project_media?.map((m: any) => m.url) || [],
    members_count: row.project_members ? row.project_members[0]?.count : 0,
    project_skills: undefined, // ensure we don't leak raw rows
    project_media: undefined   // ensure we don't leak raw rows
  };
};

// ... (skip unchanged createProject, updateProject, getUserProjects, getDiscoverProjects, searchProjects, expressInterestInProject) ...

export const getProjectById = async (projectId: string) => {
  try {
    console.log('🔍 Fetching project by ID:', projectId);

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles(*),
        project_skills(skill_name),
        project_media(url)
      `)
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('❌ Error loading project:', error);
      return { data: null, error };
    }

    console.log('✅ Project loaded:', data);
    return { data: transformProject(data), error: null };
  } catch (error) {
    console.error('❌ Exception in getProjectById:', error);
    return { data: null, error };
  }
};

export const createProject = async (projectData: Partial<Project>) => {
  try {
    console.log('🚀 Création projet:', projectData);

    // 1. Insert into projects table (without expanded fields)
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        creator_id: projectData.creator_id,
        title: projectData.title,
        description: projectData.description,
        collaboration_type: projectData.collaboration_type,
        status: 'active',
        deadline: projectData.deadline,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création projet:', error);
      return { data: null, error };
    }

    const projectId = project.id;
    const errors = [];

    // 2. Insert Skills
    if (projectData.required_skills && projectData.required_skills.length > 0) {
      const skillsInsert = projectData.required_skills.map(skill => ({
        project_id: projectId,
        skill_name: skill,
        level: 'General' // Default
      }));
      const { error: skillsError } = await supabase.from('project_skills').insert(skillsInsert);
      if (skillsError) errors.push(skillsError);
    }

    // 3. Insert Media
    if (projectData.media_urls && projectData.media_urls.length > 0) {
      const mediaInsert = projectData.media_urls.map((url, idx) => ({
        project_id: projectId,
        url: url,
        type: 'image', // default
        is_cover: idx === 0
      }));
      const { error: mediaError } = await supabase.from('project_media').insert(mediaInsert);
      if (mediaError) errors.push(mediaError);
    }

    if (errors.length > 0) console.error("Secondary insert errors", errors);

    // Return constructed project
    const fullProject = {
      ...project,
      required_skills: projectData.required_skills || [],
      media_urls: projectData.media_urls || []
    };

    console.log('✅ Projet créé avec succès:', fullProject);
    return { data: fullProject, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  try {
    console.log('Mise à jour projet:', projectId, updates);

    // Update main table
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: updates.title,
        description: updates.description,
        collaboration_type: updates.collaboration_type,
        status: updates.status,
        deadline: updates.deadline,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour projet:', error);
      return { data: null, error };
    }

    // TODO: logic to update skills/media if provided (complex difference check involved)
    // For now, only main fields are updated.

    console.log('Projet mis à jour:', data);
    return { data: { ...data, required_skills: updates.required_skills || [], media_urls: updates.media_urls || [] }, error: null }; // optimistic return
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const getUserProjects = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles(*),
        project_skills(skill_name),
        project_media(url)
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement projets utilisateur:', error);
      return [];
    }

    const transformed = data?.map(transformProject) || [];
    return transformed;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const getDiscoverProjects = async (currentUserId: string, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles(*),
        project_skills(skill_name),
        project_media(url)
      `)
      .neq('creator_id', currentUserId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur chargement projets découverte:', error);
      return [];
    }

    const transformed = data?.map(transformProject) || [];
    console.log(`${transformed.length} projets trouvés pour la découverte`);
    return transformed;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const searchProjects = async (query: string, currentUserId: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles(*),
        project_skills(skill_name),
        project_media(url)
      `)
      .neq('creator_id', currentUserId)
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error('Erreur recherche projets:', error);
      return [];
    }

    return data?.map(transformProject) || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const expressInterestInProject = async (projectId: string, userId: string, message?: string) => {
  try {
    const { data, error } = await supabase
      .from('project_interests')
      .insert({
        project_id: projectId,
        user_id: userId,
        message: message || '',
        status: 'interested'
      })
      .select()
      .single();

    if (error) {
      console.error('Error expressing interest:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const addProjectMember = async (projectId: string, userId: string, role: string = 'member') => {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role: role
      })
      .select()
      .single();

    if (error) {
      // Ignore unique violation (already a member)
      if (error.code === '23505') {
        return { data: null, error: null };
      }
      console.error('Erreur ajout membre:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const checkProjectMembership = async (projectId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Erreur vérification membre:', error);
    }

    return !!data;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};



export const getProjectInterests = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_interests')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement intérêts projet:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};