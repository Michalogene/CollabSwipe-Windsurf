import { supabase } from './supabase';
import { createUserProfile } from './profiles';

// CONNEXION - pour utilisateurs existants
export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log('🔑 CONNEXION - Tentative pour:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erreur connexion:', error);
      
      // Messages d'erreur en français
      let errorMessage = error.message;
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Veuillez confirmer votre email';
      }
      
      return { 
        success: false, 
        error: errorMessage,
        hasProfile: false 
      };
    }

    console.log('✅ CONNEXION réussie pour:', data.user.email);
    
    // Vérifier si le profil existe
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id);

    const hasProfile = profiles && profiles.length > 0;
    console.log('👤 Profil existant:', hasProfile ? 'OUI' : 'NON');

    return { 
      success: true, 
      user: data.user, 
      hasProfile,
      error: null 
    };

  } catch (error) {
    console.error('❌ Erreur complète connexion:', error);
    return { 
      success: false, 
      error: 'Erreur de connexion', 
      hasProfile: false 
    };
  }
};

// INSCRIPTION - pour nouveaux utilisateurs
export const signUpWithEmail = async (email: string, password: string, firstName?: string, lastName?: string) => {
  try {
    console.log('📝 INSCRIPTION - Tentative pour:', email, { firstName, lastName });
    
    // 1. Créer le compte utilisateur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (authError) {
      console.error('❌ Erreur création compte:', authError);
      
      // Messages d'erreur en français
      let errorMessage = authError.message;
      if (errorMessage.includes('User already registered')) {
        errorMessage = 'Un compte existe déjà avec cet email';
      } else if (errorMessage.includes('Password should be at least 6 characters')) {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (errorMessage.includes('Invalid email')) {
        errorMessage = 'Format d\'email invalide';
      }
      
      return { 
        success: false, 
        error: errorMessage,
        isNewUser: true 
      };
    }

    console.log('✅ INSCRIPTION réussie pour:', authData.user?.email);

    // 2. Créer le profil basique manuellement (ne pas compter sur le trigger)
    if (authData.user && authData.user.id) {
      console.log('📝 Création manuelle du profil basique...');
      
      // Attendre un petit délai pour être sûr que l'utilisateur est bien créé
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { profile, error: profileError } = await createUserProfile(authData.user.id, {
        email: email,
        firstName: firstName || '',
        lastName: lastName || '',
        skills: [],
        collaborationTypes: [],
        portfolioLinks: {}
      });

      if (profileError) {
        console.error('⚠️ Erreur création profil basique:', profileError);
        // Continuer même si le profil n'est pas créé, on le créera plus tard
      } else {
        console.log('✅ Profil basique créé avec succès');
      }
    }

    return { 
      success: true, 
      user: authData.user, 
      isNewUser: true,
      needsProfile: true,
      error: null 
    };

  } catch (error) {
    console.error('❌ Erreur complète inscription:', error);
    return { 
      success: false, 
      error: 'Erreur d\'inscription', 
      isNewUser: true 
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`
      }
    });
    return { data, error };
  } catch (error) {
    console.error('Erreur Google auth:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    console.log('🚪 Déconnexion...');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log('✅ Déconnexion réussie');
    return { error: null };
  } catch (error) {
    console.error('❌ Erreur déconnexion:', error);
    return { error };
  }
};