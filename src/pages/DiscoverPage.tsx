import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDiscoverProjects } from '../services/projects';
import { getProfilesForDiscovery } from '../services/profiles';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

interface Project {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  collaboration_type?: string;
  deadline?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_at: string;
  creator?: {
    first_name: string;
    last_name: string;
    activity?: string;
  };
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  activity: string;
  bio: string;
  location: string;
  skills: string[];
  collaboration_types: string[];
  avatar_url?: string;
}

const DiscoverPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profiles' | 'projects'>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const data = await getDiscoverProjects(user.id);
        setProjects(data);
      } else {
        const data = await getProfilesForDiscovery(user.id);
        setProfiles(data);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F3' }}>
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement...
          </h2>
        </div>
      </div>
    );
  }

  const currentData = activeTab === 'projects' ? projects : profiles;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F3' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b" style={{ borderColor: '#F0E4D3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D9A299' }}>
                <span className="text-white font-bold">♥</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">ColabSwipe</span>
            </div>
            
            <nav className="flex space-x-8">
              <button 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: '#F0E4D3',
                  color: '#D9A299'
                }}
              >
                <span>🔍</span>
                <span>Découvrir</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-neutral-600 hover:text-neutral-900">
                <span>♥</span>
                <span>Matches</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-neutral-600 hover:text-neutral-900">
                <span>💬</span>
                <span>Messages</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-neutral-600 hover:text-neutral-900">
                <span>📁</span>
                <span>Projets</span>
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-neutral-600 hover:text-neutral-900">
                <span>🔔</span>
              </button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCC5B2' }}>
                <span className="text-sm font-medium">M</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Empty State */}
        <div className="text-center">
          {/* Refresh Icon */}
          <div className="mb-8">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#D9A299' }}
            >
              <RefreshCw className={`w-8 h-8 text-white ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Plus de profils pour le moment
          </h1>

          {/* Description */}
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Il n'y a pas encore d'autres utilisateurs dans votre région. Soyez patient, de nouveaux collaborateurs s'inscrivent chaque jour !
          </p>

          {/* Action Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#D9A299' }}
          >
            {refreshing ? 'Actualisation...' : 'Actualiser'}
          </button>

          {/* Invitation Section */}
          <div className="mt-16 p-6 rounded-2xl" style={{ backgroundColor: '#F0E4D3' }}>
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Vous êtes parmi les premiers !
            </h3>
            <p className="text-neutral-700 mb-4">
              Invitez vos contacts à rejoindre ColabSwipe pour commencer à collaborer.
            </p>
            <button
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200 border-2 hover:opacity-80"
              style={{ 
                borderColor: '#DCC5B2',
                color: '#D9A299',
                backgroundColor: 'transparent'
              }}
            >
              Inviter des contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;