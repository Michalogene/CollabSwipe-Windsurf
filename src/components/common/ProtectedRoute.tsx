import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireProfile = true 
}) => {
  const { user, profile, loading, profileLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profileLoading) {
      if (!user) {
        // Pas connecté → page d'auth
        console.log('🔒 Utilisateur non connecté → /auth');
        navigate('/auth');
      } else if (requireProfile && !profile) {
        // Connecté mais pas de profil → setup
        console.log('👤 Utilisateur sans profil → /onboarding');
        navigate('/onboarding');
      }
    }
  }, [user, profile, loading, profileLoading, navigate, requireProfile]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement...
          </h2>
          <p className="text-neutral-500">
            {loading ? 'Vérification de la session' : 'Chargement du profil'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirection en cours
  }

  if (requireProfile && !profile) {
    return null; // Redirection vers setup
  }

  return <>{children}</>;
};

export default ProtectedRoute;