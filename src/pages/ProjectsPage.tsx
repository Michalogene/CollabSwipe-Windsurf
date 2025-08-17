import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, Users, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProjects, getDiscoverProjects } from '../services/projects';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
  views?: number;
  collaborators?: number;
}

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-projects' | 'discover'>('my-projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [discoverProjects, setDiscoverProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user, activeTab]);

  const loadProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (activeTab === 'my-projects') {
        const data = await getUserProjects(user.id);
        setMyProjects(data);
      } else {
        const data = await getDiscoverProjects(user.id);
        setDiscoverProjectsList(data);
      }
    } catch (error) {
      console.error('Erreur chargement projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    loadProjects();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F3' }}>
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement des projets...
          </h2>
        </div>
      </div>
    );
  }

  const currentProjects = activeTab === 'my-projects' ? myProjects : discoverProjects;
  const filteredProjects = currentProjects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.required_skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-neutral-600 hover:text-neutral-900">
                <span>♥</span>
                <span>Matches</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-neutral-600 hover:text-neutral-900">
                <span>💬</span>
                <span>Messages</span>
              </button>
              <button 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: '#F0E4D3',
                  color: '#D9A299'
                }}
              >
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Projets</h1>
            <p className="text-neutral-600">Gérez vos projets et découvrez de nouvelles opportunités</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#D9A299' }}
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau projet</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'my-projects'
                ? 'text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            style={{
              backgroundColor: activeTab === 'my-projects' ? '#F0E4D3' : 'transparent'
            }}
          >
            Mes projets ({myProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'discover'
                ? 'text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            style={{
              backgroundColor: activeTab === 'discover' ? '#F0E4D3' : 'transparent'
            }}
          >
            Découvrir ({discoverProjects.length})
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher des projets..."
              icon={Search}
            />
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2 hover:opacity-80"
            style={{ 
              borderColor: '#DCC5B2',
              color: '#D9A299',
              backgroundColor: 'transparent'
            }}
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2 hover:opacity-80 disabled:opacity-50"
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

        {/* Empty State */}
        <div className="text-center py-16">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F0E4D3' }}>
            <Plus className="w-12 h-12" style={{ color: '#D9A299' }} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            Aucun projet pour le moment
          </h2>

          {/* Description */}
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            Créez votre premier projet pour commencer à collaborer
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#D9A299' }}
            >
              <Plus className="w-5 h-5" />
              <span>Créer mon premier projet</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 border-2 hover:opacity-80 disabled:opacity-50"
              style={{ 
                borderColor: '#DCC5B2',
                color: '#D9A299',
                backgroundColor: 'transparent'
              }}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Actualisation...' : 'Actualiser'}</span>
            </button>
          </div>

          {/* Encouragement Section */}
          <div className="mt-16 p-6 rounded-2xl" style={{ backgroundColor: '#F0E4D3' }}>
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Soyez patient ! Créez votre premier projet pour attirer des collaborateurs !
            </h3>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default ProjectsPage;