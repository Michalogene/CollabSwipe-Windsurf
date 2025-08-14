import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, MapPin, Tag, Search, Filter, Eye, Edit, Trash2, RefreshCw, Rocket } from 'lucide-react';
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
    loadProjects(); // Recharger la liste des projets
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'completed':
        return 'Terminé';
      case 'paused':
        return 'En pause';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const currentProjects = activeTab === 'my-projects' ? myProjects : discoverProjects;
  const filteredProjects = currentProjects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.required_skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement des projets...
          </h2>
          <p className="text-neutral-500">
            {activeTab === 'my-projects' ? 'Récupération de vos projets' : 'Découverte de nouveaux projets'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Projets</h1>
            <p className="text-neutral-600">Gérez vos projets et découvrez de nouvelles opportunités</p>
          </div>
          <Button
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0"
          >
            Nouveau projet
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-neutral-200 rounded-xl p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'my-projects'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Mes projets ({myProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'discover'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
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
          <Button variant="outline" icon={Filter}>
            Filtres
          </Button>
          <Button variant="ghost" icon={RefreshCw} onClick={loadProjects}>
            Actualiser
          </Button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                        {project.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    
                    {activeTab === 'my-projects' && (
                      <div className="flex space-x-1 ml-2">
                        <button className="p-1 hover:bg-neutral-100 rounded transition-colors">
                          <Edit className="w-4 h-4 text-neutral-600" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Creator info for discover tab */}
                  {activeTab === 'discover' && project.creator && (
                    <div className="mb-3">
                      <p className="text-sm text-neutral-600">
                        Par {project.creator.first_name} {project.creator.last_name}
                      </p>
                      {project.creator.activity && (
                        <p className="text-xs text-neutral-500">{project.creator.activity}</p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Skills */}
                  {project.required_skills && project.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.required_skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {project.required_skills.length > 3 && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                          +{project.required_skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 text-xs text-neutral-500 mb-4">
                    {project.collaboration_type && (
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{project.collaboration_type}</span>
                      </div>
                    )}
                    {project.deadline && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Échéance: {formatDate(project.deadline)}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Créé le {formatDate(project.created_at)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{project.collaborators || 0} collaborateurs</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{project.views || 0} vues</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {activeTab === 'my-projects' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          Gérer
                        </Button>
                        <Button variant="primary" size="sm" className="flex-1">
                          Voir détails
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          En savoir plus
                        </Button>
                        <Button variant="primary" size="sm" className="flex-1">
                          Postuler
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              {searchQuery ? 'Aucun projet trouvé' : 'Aucun projet pour le moment'}
            </h3>
            <p className="text-neutral-500 mb-6">
              {searchQuery 
                ? 'Essayez avec d\'autres mots-clés'
                : activeTab === 'my-projects' 
                  ? 'Créez votre premier projet pour commencer à collaborer'
                  : 'Revenez plus tard pour découvrir de nouveaux projets'
              }
            </p>
            <div className="space-y-3">
              {activeTab === 'my-projects' && !searchQuery && (
                <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
                  Créer mon premier projet
                </Button>
              )}
              <Button variant="outline" onClick={loadProjects} icon={RefreshCw}>
                Actualiser
              </Button>
              {currentProjects.length === 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-primary-800 mb-2">
                    🎉 Soyez patient !
                  </h3>
                  <p className="text-primary-700 text-sm">
                    {activeTab === 'my-projects' 
                      ? "Créez votre premier projet pour attirer des collaborateurs !"
                      : "De nouveaux projets sont ajoutés régulièrement. Revenez bientôt !"
                    }
                  </p>
                </div>
              )}
            </div>
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