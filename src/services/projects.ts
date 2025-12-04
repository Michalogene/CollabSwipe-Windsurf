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
}

export const createProject = async (projectData: Partial<Project>) => {
  try {
    console.log('🚀 Création projet:', projectData);
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        creator_id: projectData.creator_id,
        title: projectData.title,
        description: projectData.description,
        required_skills: projectData.required_skills || [],
        collaboration_type: projectData.collaboration_type,
        status: 'active', // Publié par défaut
        deadline: projectData.deadline,
        media_urls: projectData.media_urls || [],
        created_at: new Date().toISOString(),
        ...projectData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur création projet:', error);
      return { data: null, error };
    }
    
    console.log('✅ Projet créé avec succès:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  try {
    console.log('Mise à jour projet:', projectId, updates);
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur mise à jour projet:', error);
      return { data: null, error };
    }
    
    console.log('Projet mis à jour:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const getUserProjects = async (userId: string) => {
  try {
    console.log('Chargement projets pour utilisateur:', userId);
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles(*)
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur chargement projets utilisateur:', error);
      return [];
    }
    
    console.log(`${data?.length || 0} projets trouvés`);
    return data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const getDiscoverProjects = async (currentUserId: string, limit = 20) => {
  try {
    console.log('Chargement projets pour découverte, utilisateur:', currentUserId);
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles(*)
      `)
      .neq('creator_id', currentUserId) // Exclure ses propres projets
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Erreur chargement projets découverte:', error);
      return [];
    }
    
    console.log(`${data?.length || 0} projets trouvés pour la découverte:`, data);
    return data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const searchProjects = async (query: string, currentUserId: string) => {
  try {
    console.log('Recherche projets avec query:', query, 'pour utilisateur:', currentUserId);
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles(*)
      `)
      .neq('creator_id', currentUserId)
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);
    
    if (error) {
      console.error('Erreur recherche projets:', error);
      return [];
    }
    
    console.log(`${data?.length || 0} projets trouvés pour la recherche:`, data);
    return data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const expressInterestInProject = async (projectId: string, userId: string, message?: string) => {
  try {
    console.log('Expression intérêt projet:', { projectId, userId, message });
    
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
      console.error('Erreur expression intérêt:', error);
      return { data: null, error };
    }
    
    console.log('Intérêt exprimé:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    console.log('Chargement projet par ID:', projectId);
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles(*)
      `)
      .eq('id', projectId)
      .single();
    
    if (error) {
      console.error('Erreur chargement projet:', error);
      return { data: null, error };
    }
    
    console.log('Projet trouvé:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
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