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

  // Render project cards
  const renderProjectCards = (projects: Project[]) => {
    return (
      <div className="grid gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl shadow-sm p-6 border hover:shadow-md transition-all duration-200"
            style={{ borderColor: '#F0E4D3' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-neutral-900">{project.title}</h3>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-700' :
                      project.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project.status === 'active' ? 'Actif' :
                     project.status === 'paused' ? 'En pause' :
                     project.status === 'completed' ? 'Terminé' :
                     'Annulé'}
                  </span>
                </div>
                <p className="text-neutral-600 mb-3 line-clamp-2">{project.description}</p>
                
                {activeTab === 'discover' && project.creator && (
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
              <div className="flex items-center space-x-2">
                {activeTab === 'my-projects' && (
                  <button
                    className="px-3 py-1 rounded-lg font-medium transition-all duration-200 border hover:opacity-80"
                    style={{ 
                      borderColor: '#DCC5B2',
                      color: '#D9A299',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Modifier
                  </button>
                )}
                <button
                  className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#D9A299' }}
                >
                  {activeTab === 'my-projects' ? 'Gérer' : 'Voir le projet'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (

    <div className="min-h-screen pt-16" style={{ backgroundColor: '#FAF7F3' }}>
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

        {/* Content */}
        {filteredProjects.length > 0 ? (
          renderProjectCards(filteredProjects)
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            {/* Icon */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F0E4D3' }}>
              <Plus className="w-12 h-12" style={{ color: '#D9A299' }} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              {activeTab === 'my-projects' ? 'Aucun projet pour le moment' : 'Aucun projet à découvrir'}
            </h2>

            {/* Description */}
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              {activeTab === 'my-projects' 
                ? 'Créez votre premier projet pour commencer à collaborer'
                : 'Il n\'y a pas encore de projets disponibles. Revenez plus tard !'
              }
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {activeTab === 'my-projects' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#D9A299' }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Créer mon premier projet</span>
                </button>
              )}
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
            {activeTab === 'my-projects' && (
              <div className="mt-16 p-6 rounded-2xl" style={{ backgroundColor: '#F0E4D3' }}>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Soyez patient ! Créez votre premier projet pour attirer des collaborateurs !
                </h3>
              </div>
            )}
          </div>
        )}
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