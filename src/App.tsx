import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import UserProfile from './pages/UserProfile';
import ProjectWorkspace from './pages/ProjectWorkspace';
import MyProjectsList from './pages/MyProjectsList';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import DashboardExplore from './pages/DashboardExplore';
import ProjectDetails from './pages/ProjectDetails';
import ProjectCanvas from './pages/ProjectCanvas';
import FavoritesPage from './pages/FavoritesPage';

function AppContent() {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    // Check if user has completed onboarding and profile setup
    if (user) {
      const onboardingComplete = localStorage.getItem(`onboarding_${user.id}`);
      const profileComplete = localStorage.getItem(`profile_${user.id}`);
      console.log('User state:', {
        user: user.id,
        onboardingComplete: !!onboardingComplete,
        profileComplete: !!profileComplete,
        hasProfile: !!profile
      });
    } else {
      // no-op
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
          {/* Dashboard Explore - Sans Layout (a sa propre sidebar) */}
          <Route 
            path="/discover" 
            element={
              <ProtectedRoute requireProfile={true}>
                <DashboardExplore />
              </ProtectedRoute>
            } 
          />
          {/* Chat/Messages - Sans Layout (a sa propre sidebar) */}
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute requireProfile={true}>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages/:id" 
            element={
              <ProtectedRoute requireProfile={true}>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          {/* Project Details - Sans Layout (a sa propre sidebar) */}
          <Route 
            path="/project/:id" 
            element={
              <ProtectedRoute requireProfile={true}>
                <ProjectDetails />
              </ProtectedRoute>
            } 
          />
          {/* My Projects - Liste */}
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute requireProfile={true}>
                <MyProjectsList />
              </ProtectedRoute>
            } 
          />
          {/* Project Workspace */}
          <Route 
            path="/projects/:id/workspace" 
            element={
              <ProtectedRoute requireProfile={true}>
                <ProjectWorkspace />
              </ProtectedRoute>
            } 
          />
          {/* Project Canvas - Sans Layout (fullscreen canvas) */}
          <Route 
            path="/canvas/:id" 
            element={
              <ProtectedRoute requireProfile={true}>
                <ProjectCanvas />
              </ProtectedRoute>
            } 
          />
          {/* User Profile - Sans Layout (a sa propre sidebar) */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requireProfile={true}>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:id" 
            element={
              <ProtectedRoute requireProfile={true}>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          {/* Favorites - Sans Layout (a sa propre sidebar) */}
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute requireProfile={true}>
                <FavoritesPage />
              </ProtectedRoute>
            } 
          />
          {/* Autres routes protégées avec Layout */}
          <Route path="/*" element={
            <ProtectedRoute requireProfile={true}>
              <Layout>
                <Routes>
                  <Route path="/matches" element={<MatchesPage />} />
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