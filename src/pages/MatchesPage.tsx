import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Briefcase, Calendar, MapPin, RefreshCw } from 'lucide-react';
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
      // TODO: Charger les matches de projets quand cette fonctionnalité sera implémentée
      setProjectMatches([]);
    } catch (error) {
      console.error('Erreur chargement matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const newMatches = peopleMatches.filter(match => {
    const matchDate = new Date(match.created_at);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return matchDate > oneDayAgo;
  });

  const currentMatches = activeTab === 'people' ? peopleMatches : projectMatches;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Aujourd\'hui';
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement de vos matches...
          </h2>
          <p className="text-neutral-500">
            Recherche de vos connexions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Mes Matches</h1>
          <p className="text-neutral-600">Vos connexions et projets collaboratifs</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-neutral-200 rounded-xl p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'people'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Personnes ({peopleMatches.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'projects'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Projets ({projectMatches.length})</span>
          </button>
        </div>

        {/* New Matches Carousel */}
        {newMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-secondary-500 rounded-full mr-2 animate-pulse"></span>
              Nouveaux matches
            </h2>
            <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
              {newMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-center w-24">
                    <div className="relative mb-3">
                      {match.otherUser.avatar_url ? (
                        <img
                          src={match.otherUser.avatar_url}
                          alt={match.otherUser.first_name}
                          className="w-16 h-16 rounded-full object-cover mx-auto group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-200">
                          <span className="text-white font-semibold">
                            {match.otherUser.first_name[0]}{match.otherUser.last_name[0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        !
                      </div>
                    </div>
                    <p className="font-medium text-neutral-900 text-sm">{match.otherUser.first_name}</p>
                    <p className="text-xs text-neutral-500 mt-1">Nouveau</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matches Grid */}
        {currentMatches.length > 0 ? (
          <div className="grid gap-4">
            {currentMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {match.otherUser.avatar_url ? (
                      <img
                        src={match.otherUser.avatar_url}
                        alt={`${match.otherUser.first_name} ${match.otherUser.last_name}`}
                        className="w-16 h-16 rounded-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white font-semibold">
                          {match.otherUser.first_name[0]}{match.otherUser.last_name[0]}
                        </span>
                      </div>
                    )}
                    {newMatches.some(newMatch => newMatch.id === match.id) && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        !
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-lg">
                          {match.otherUser.first_name} {match.otherUser.last_name}
                        </h3>
                        {match.otherUser.activity && (
                          <p className="text-neutral-600">{match.otherUser.activity}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-neutral-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(match.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {match.otherUser.location && (
                      <div className="flex items-center text-sm text-neutral-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{match.otherUser.location}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button
                        variant={newMatches.some(newMatch => newMatch.id === match.id) ? 'primary' : 'outline'}
                        size="sm"
                        icon={MessageCircle}
                        className="flex-1"
                      >
                        {newMatches.some(newMatch => newMatch.id === match.id) ? 'Dire bonjour' : 'Continuer la conversation'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        Voir profil
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              Aucun match pour le moment
            </h3>
            <p className="text-neutral-500 mb-6">
              {activeTab === 'people' 
                ? "Continuez à swiper pour découvrir de nouveaux collaborateurs !"
                : "Explorez des projets pour trouver des opportunités de collaboration !"
              }
            </p>
            <div className="space-y-3">
              <Button onClick={loadMatches} icon={RefreshCw}>
                Actualiser
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/discover'}>
                Découvrir des profils
              </Button>
              {peopleMatches.length === 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-primary-800 mb-2">
                    🎉 Soyez patient !
                  </h3>
                  <p className="text-primary-700 text-sm">
                    Plus vous swipez, plus vous avez de chances de trouver des matches. Les premiers utilisateurs arrivent !
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;