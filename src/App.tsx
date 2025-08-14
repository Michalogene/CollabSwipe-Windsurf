import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DiscoverPage from './pages/DiscoverPage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding and profile setup
    if (user) {
      const onboardingComplete = localStorage.getItem(`onboarding_${user.id}`);
      const profileComplete = localStorage.getItem(`profile_${user.id}`);
      setHasCompletedOnboarding(!!onboardingComplete);
      setHasCompletedProfile(!!profileComplete);
      
      console.log('User state:', {
        user: user.id,
        onboardingComplete: !!onboardingComplete,
        profileComplete: !!profileComplete,
        hasProfile: !!profile
      });
    } else {
      setHasCompletedOnboarding(false);
      setHasCompletedProfile(false);
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/discover" />} />
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/discover" />} />
      
      {/* Protected routes */}
      {user && (
        <>
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute requireProfile={false}>
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/setup" 
            element={
              <ProtectedRoute requireProfile={false}>
                <ProfileSetupPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/*" element={
            <ProtectedRoute requireProfile={true}>
              <Layout>
                <Routes>
                  <Route path="/discover" element={<DiscoverPage />} />
                  <Route path="/matches" element={<MatchesPage />} />
                  <Route path="/messages" element={<ChatPage />} />
                  <Route path="/messages/:id" element={<ChatPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="*" element={<Navigate to="/discover" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </>
      )}
      
      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to={user ? "/discover" : "/"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;