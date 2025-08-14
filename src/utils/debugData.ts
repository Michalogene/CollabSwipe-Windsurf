import { supabase } from '../services/supabase';

export const debugDatabaseContent = async () => {
  console.log('🔍 Vérification du contenu de la base de données...');
  
  try {
    // Compter les profils
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Compter les matches
    const { count: matchesCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true });
    
    // Compter les messages
    const { count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    
    // Compter les projets
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Statistiques de la base :
    - Profils: ${profilesCount || 0}
    - Matches: ${matchesCount || 0} 
    - Messages: ${messagesCount || 0}
    - Projets: ${projectsCount || 0}`);
    
    if (profilesCount === 0) {
      console.log('⚠️ Aucun profil dans la base - c\'est normal pour une nouvelle app');
    }
    
    // Vérifier la connexion utilisateur actuelle
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('👤 Utilisateur connecté:', user.email);
      
      // Vérifier son profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        console.log('✅ Profil utilisateur trouvé:', profile.first_name, profile.last_name);
      } else {
        console.log('❌ Aucun profil trouvé pour cet utilisateur');
      }
    } else {
      console.log('❌ Aucun utilisateur connecté');
    }
    
  } catch (error) {
    console.error('❌ Erreur debug:', error);
  }
};

export const testSupabaseConnection = async () => {
  console.log('🔗 Test de connexion Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur connexion Supabase:', error);
      return false;
    }
    
    console.log('✅ Connexion Supabase OK');
    return true;
  } catch (error) {
    console.error('❌ Erreur test connexion:', error);
    return false;
  }
};