import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserMatches } from '../services/matching';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  is_active: boolean;
  otherUser: {
    id: string;
    first_name: string;
    last_name: string;
    activity?: string;
    location?: string;
    avatar_url?: string;
  };
}

const MatchesPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'people' | 'projects'>('people');
  const [peopleMatches, setPeopleMatches] = useState<Match[]>([]);
  const [projectMatches, setProjectMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const matches = await getUserMatches(user.id);
      setPeopleMatches(matches);
      setProjectMatches([]);
    } catch (error) {
      console.error('Erreur chargement matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F3' }}>
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement de vos matches...
          </h2>
        </div>
      </div>
    );
  }

  const currentMatches = activeTab === 'people' ? peopleMatches : projectMatches;

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
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-neutral-600 hover:text-neutral-900">
                <span>🔍</span>
                <span>Découvrir</span>
              </button>
              <button 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: '#F0E4D3',
                  color: '#D9A299'
                }}
              >
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Vos connexions et projets collaboratifs
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'people'
                ? 'text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            style={{
              backgroundColor: activeTab === 'people' ? '#F0E4D3' : 'transparent'
            }}
          >
            <Users className="w-4 h-4" />
            <span>Personnes ({peopleMatches.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'projects'
                ? 'text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            style={{
              backgroundColor: activeTab === 'projects' ? '#F0E4D3' : 'transparent'
            }}
          >
            <Briefcase className="w-4 h-4" />
            <span>Projets ({projectMatches.length})</span>
          </button>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F0E4D3' }}>
            <Users className="w-12 h-12" style={{ color: '#D9A299' }} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Aucun match pour le moment
          </h2>

          {/* Description */}
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            Continuez à swiper pour découvrir de nouveaux collaborateurs !
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#D9A299' }}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Actualisation...' : 'Actualiser'}</span>
            </button>
            <button
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 border-2 hover:opacity-80"
              style={{ 
                borderColor: '#DCC5B2',
                color: '#D9A299',
                backgroundColor: 'transparent'
              }}
            >
              Découvrir des profils
            </button>
          </div>

          {/* Encouragement Section */}
          <div className="mt-16 p-6 rounded-2xl" style={{ backgroundColor: '#F0E4D3' }}>
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Soyez patient !
            </h3>
            <p className="text-neutral-700 text-sm">
              Plus vous swipez, plus vous avez de chances de trouver des matches. Les premiers utilisateurs arrivent !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;