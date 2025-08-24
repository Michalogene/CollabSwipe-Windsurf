import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDiscoverProjects, Project } from '../services/projects';
import { getProfilesForDiscovery, Profile } from '../services/profiles';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

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
        console.log('📊 Projets chargés pour découverte:', data);
        setProjects(data);
      } else {
        const data = await getProfilesForDiscovery(user.id);
        console.log('👥 Profils chargés pour découverte:', data);
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

  // Render project cards
  const renderProjects = () => {
    if (projects.length === 0) {
      return (
        <div className="text-center py-16">
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Plus de projets pour le moment
          </h1>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Il n'y a pas encore d'autres projets dans votre région. Soyez patient, de nouveaux projets sont créés chaque jour !
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#D9A299' }}
          >
            {refreshing ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Découvrir des projets</h1>
            <p className="text-neutral-600">{projects.length} projet{projects.length > 1 ? 's' : ''} disponible{projects.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 hover:opacity-80 disabled:opacity-50"
            style={{ 
              borderColor: '#DCC5B2',
              color: '#D9A299',
              backgroundColor: 'transparent'
            }}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>

        <div className="grid gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-sm p-6 border hover:shadow-md transition-all duration-200"
              style={{ borderColor: '#F0E4D3' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{project.title}</h3>
                  <p className="text-neutral-600 mb-3 line-clamp-2">{project.description}</p>
                  
                  {project.creator && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: '#DCC5B2' }}
                      >
                        {project.creator.first_name[0]}{project.creator.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {project.creator.first_name} {project.creator.last_name}
                        </p>
                        {project.creator.activity && (
                          <p className="text-xs text-neutral-500">{project.creator.activity}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  {project.collaboration_type && (
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#F0E4D3', color: '#D9A299' }}
                    >
                      {project.collaboration_type}
                    </span>
                  )}
                  {project.deadline && (
                    <span className="text-xs text-neutral-500">
                      Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
              
              {project.required_skills && project.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.required_skills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#F0E4D3', color: '#D9A299' }}
                    >
                      {skill}
                    </span>
                  ))}
                  {project.required_skills.length > 5 && (
                    <span className="text-xs text-neutral-500">
                      +{project.required_skills.length - 5} autres
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                </span>
                <button
                  className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#D9A299' }}
                >
                  Voir le projet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render profile cards (existing empty state)
  const renderProfiles = () => {
    return (
      <div className="text-center py-16">
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
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          Plus de profils pour le moment
        </h1>
        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Il n'y a pas encore d'autres utilisateurs dans votre région. Soyez patient, de nouveaux collaborateurs s'inscrivent chaque jour !
        </p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#D9A299' }}
        >
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#FAF7F3' }}>
      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex space-x-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'profiles'
                ? 'text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            style={{
              backgroundColor: activeTab === 'profiles' ? '#F0E4D3' : 'transparent'
            }}
          >
            <Users className="w-4 h-4" />
            <span>Profils ({profiles.length})</span>
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
            <Rocket className="w-4 h-4" />
            <span>Projets ({projects.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'projects' ? renderProjects() : renderProfiles()}
    </div>
  );
};

export default DiscoverPage;