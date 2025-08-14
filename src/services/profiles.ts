import { supabase } from './supabase';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  activity?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  skills: string[];
  collaboration_types: string[];
  availability?: string;
  project_interests?: string;
  portfolio_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export const getUserProfile = async (userId: string) => {
  try {
    console.log('🔍 Recherche du profil pour:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
    
    if (error) {
      console.error('❌ Erreur requête profil:', error);
      return { profile: null, error, needsCreation: false };
    }
    
    const profile = data && data.length > 0 ? data[0] : null;
    
    if (!profile) {
      console.log('⚠️ Aucun profil trouvé pour l\'utilisateur:', userId);
      return { profile: null, error: null, needsCreation: true };
    }
    
    console.log('✅ Profil trouvé:', profile.first_name, profile.last_name);
    return { profile, error: null, needsCreation: false };
    
  } catch (error) {
    console.error('❌ Erreur complète:', error);
    return { profile: null, error, needsCreation: false };
  }
};

export const createUserProfile = async (userId: string, profileData: {
  email: string;
  firstName?: string;
  lastName?: string;
  activity?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  collaborationTypes?: string[];
  portfolioLinks?: Record<string, string>;
  availability?: string;
  projectInterests?: string;
  avatarUrl?: string;
}) => {
  try {
    console.log('📝 Création du profil pour:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: profileData.email,
        first_name: profileData.firstName || '',
        last_name: profileData.lastName || '',
        activity: profileData.activity || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        skills: profileData.skills || [],
        collaboration_types: profileData.collaborationTypes || [],
        portfolio_links: profileData.portfolioLinks || {},
        availability: profileData.availability || '',
        project_interests: profileData.projectInterests || '',
        avatar_url: profileData.avatarUrl || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erreur création profil:', error);
      return { profile: null, error };
    }
    
    console.log('✅ Profil créé avec succès');
    return { profile: data, error: null };
    
  } catch (error) {
    console.error('❌ Erreur complète création:', error);
    return { profile: null, error };
  }
};

// FONCTION DE SAUVEGARDE CORRIGÉE - VERSION COMPLÈTE
export const saveProfileToSupabase = async (userData: any, formData: any) => {
  try {
    console.log('🔍 DEBUG - User data:', userData);
    console.log('🔍 DEBUG - Form data reçue:', formData);
    
    // Préparer les données avec les BONS noms de champs Supabase
    const dataForSupabase = {
      id: userData.id,
      email: userData.email,
      // Champs de base
      first_name: formData.firstName || formData.first_name || '',
      last_name: formData.lastName || formData.last_name || '',
      activity: formData.activity || '',
      bio: formData.bio || '',
      location: formData.location || '',
      // Arrays
      skills: Array.isArray(formData.skills) ? formData.skills : [],
      collaboration_types: Array.isArray(formData.collaborationTypes) ? formData.collaborationTypes : 
                          Array.isArray(formData.collaboration_types) ? formData.collaboration_types : [],
      // Autres champs
      availability: formData.availability || '',
      project_interests: formData.projectInterests || formData.project_interests || '',
      portfolio_links: formData.portfolioLinks || formData.portfolio_links || {},
      avatar_url: formData.avatarUrl || formData.avatar_url || '',
      updated_at: new Date().toISOString()
    };
    
    console.log('🎯 DEBUG - Données finales pour Supabase:', dataForSupabase);
    
    // UPSERT avec gestion d'erreur
    const { data, error } = await supabase
      .from('profiles')
      .upsert(dataForSupabase, {
        onConflict: 'id'
      })
      .select();
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    console.log('✅ Sauvegarde réussie:', data);
    
    // Vérification immédiate
    const { data: verification } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.id)
      .single();
    
    console.log('🔍 Vérification en base:', verification);
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Erreur sauvegarde complète:', error);
    return { success: false, error: error.message };
  }
};

export const ensureUserProfile = async (user: any) => {
  try {
    console.log('🔄 Vérification/création du profil pour:', user.email);
    
    // Vérifier si le profil existe
    const { profile, needsCreation, error } = await getUserProfile(user.id);
    
    if (error) {
      console.error('❌ Erreur lors de la vérification du profil:', error);
      return null;
    }
    
    if (needsCreation) {
      console.log('📝 Création du profil manquant...');
      
      // Créer le profil basique si il n'existe pas
      const basicProfileData = {
        email: user.email,
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || ''
      };
      
      const { profile: newProfile, error: createError } = await createUserProfile(user.id, basicProfileData);
      
      if (createError) {
        console.error('❌ Impossible de créer le profil:', createError);
        return null;
      }
      
      return newProfile;
    }
    
    return profile;
  } catch (error) {
    console.error('❌ Erreur dans ensureUserProfile:', error);
    return null;
  }
};

export const createProfile = async (profileData: Partial<Profile>) => {
  try {
    console.log('Création profil:', profileData);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: profileData.id,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur création profil:', error);
      return { data: null, error };
    }
    
    console.log('Profil créé:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    console.log('Mise à jour profil:', userId, updates);
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur mise à jour profil:', error);
      return { data: null, error };
    }
    
    console.log('Profil mis à jour:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur:', error);
    return { data: null, error };
  }
};

// Fonction de compatibilité - utilise la nouvelle logique
export const getProfile = async (userId: string) => {
  const { profile, error } = await getUserProfile(userId);
  return { data: profile, error };
};

export const getProfilesForDiscovery = async (currentUserId: string, limit = 10) => {
  try {
    console.log('Chargement profils pour découverte, utilisateur:', currentUserId);
    
    // Récupérer les profils déjà swipés pour les exclure
    const { data: swipedProfiles } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', currentUserId);
    
    const swipedIds = swipedProfiles?.map(s => s.swiped_id) || [];
    
    // Récupérer les profils non swipés
    let query = supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId) // Exclure son propre profil
      .limit(limit);
    
    // Exclure les profils déjà swipés
    if (swipedIds.length > 0) {
      query = query.not('id', 'in', `(${swipedIds.join(',')})`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur chargement profils:', error);
      return [];
    }
    
    console.log(`${data?.length || 0} profils trouvés pour la découverte`);
    return data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

export const searchProfiles = async (query: string, currentUserId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId)
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,activity.ilike.%${query}%`)
      .limit(20);
    
    if (error) {
      console.error('Erreur recherche profils:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};