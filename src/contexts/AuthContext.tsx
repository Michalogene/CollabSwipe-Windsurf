import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from '../services/auth';
import { ensureUserProfile, Profile } from '../services/profiles';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  hasProfile: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; hasProfile?: boolean; error?: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fonction pour récupérer le profil utilisateur
  const fetchUserProfile = async (userId: string) => {
    if (!userId) return null;
    
    try {
      console.log('🔍 Récupération du profil pour:', userId);
      setProfileLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      if (error) {
        console.error('❌ Erreur récupération profil:', error);
        return null;
      }
      
      const profile = data && data.length > 0 ? data[0] : null;
      
      if (!profile) {
        console.log('ℹ️ Aucun profil trouvé (nouvel utilisateur)');
        return null;
      }
      
      console.log('✅ Profil récupéré:', profile);
      return profile;
      
    } catch (error) {
      console.error('❌ Erreur complète récupération profil:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('🔄 Actualisation du profil...');
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
    }
  };

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur session:', error);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Session trouvée pour:', session.user.email);
          setUser(session.user);
          
          // Récupérer le profil automatiquement
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          console.log('ℹ️ Aucune session active');
          setUser(null);
          setProfile(null);
        }
        
      } catch (err) {
        console.error('❌ Erreur complète session:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        // Récupérer le profil automatiquement
        const userProfile = await fetchUserProfile(session.user.id);
        setProfile(userProfile);
        
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    return result;
  };

  const handleSignUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const result = await signUpWithEmail(email, password, firstName, lastName);
    return result;
  };

  const handleSignOut = async () => {
    const result = await signOut();
    return result;
  };

  const handleSignInWithGoogle = async () => {
    const result = await signInWithGoogle();
    return result;
  };

  const value = {
    user,
    profile,
    loading,
    profileLoading,
    hasProfile: !!profile,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}