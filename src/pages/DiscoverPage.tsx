import React, { useState, useEffect } from 'react';
import { Heart, X, User, MapPin, Briefcase, Star, MessageCircle, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDiscoverProjects } from '../services/projects';
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
  views?: number;
  collaborators?: number;
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

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
        setCurrentIndex(0);
      } else {
        // Mock profiles data for now
        setProfiles([]);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    setTimeout(() => {
      const currentData = activeTab === 'projects' ? projects : profiles;
      if (currentIndex < currentData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // Reset to first item
      }
      setSwipeDirection(null);
    }, 300);
  };

  const currentData = activeTab === 'projects' ? projects : profiles;
  const currentItem = currentData[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement...
          </h2>
          <p className="text-neutral-500">
            Découverte de nouvelles opportunités
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Découvrir</h1>
          <p className="text-neutral-600">Trouvez votre prochaine collaboration</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'profiles'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profils
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'projects'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Rocket className="w-4 h-4 inline mr-2" />
            Projets
          </button>
        </div>

        {/* Card Container */}
        <div className="relative h-[600px] mb-8">
          {currentData.length > 0 ? (
            <div
              className={`absolute inset-0 bg-white rounded-2xl shadow-card overflow-hidden transition-transform duration-300 ${
                swipeDirection === 'left' ? '-translate-x-full opacity-0' :
                swipeDirection === 'right' ? 'translate-x-full opacity-0' : ''
              }`}
            >
              {activeTab === 'projects' && currentItem ? (
                <ProjectCard project={currentItem as Project} />
              ) : activeTab === 'profiles' && currentItem ? (
                <ProfileCard profile={currentItem as Profile} />
              ) : null}
            </div>
          ) : (
            <div className="absolute inset-0 bg-white rounded-2xl shadow-card flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'projects' ? (
                    <Rocket className="w-8 h-8 text-neutral-400" />
                  ) : (
                    <User className="w-8 h-8 text-neutral-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Aucun {activeTab === 'projects' ? 'projet' : 'profil'} disponible
                </h3>
                <p className="text-neutral-500 text-sm">
                  Revenez plus tard pour découvrir de nouvelles opportunités
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {currentData.length > 0 && (
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-200 border-2 border-red-100 hover:border-red-200"
            >
              <X className="w-8 h-8 text-red-500" />
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-200 border-2 border-green-100 hover:border-green-200"
            >
              <Heart className="w-8 h-8 text-green-500" />
            </button>
          </div>
        )}

        {/* Counter */}
        {currentData.length > 0 && (
          <div className="text-center mt-6">
            <p className="text-sm text-neutral-500">
              {currentIndex + 1} / {currentData.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <h2 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2">
          {project.title}
        </h2>
        {project.creator && (
          <div className="flex items-center text-sm text-neutral-600">
            <User className="w-4 h-4 mr-1" />
            <span>Par {project.creator.first_name} {project.creator.last_name}</span>
            {project.creator.activity && (
              <>
                <span className="mx-2">•</span>
                <span>{project.creator.activity}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-neutral-800 mb-2">Description</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Skills */}
          {project.required_skills && project.required_skills.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">Compétences recherchées</h3>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collaboration Type */}
          {project.collaboration_type && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">Type de collaboration</h3>
              <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                {project.collaboration_type}
              </span>
            </div>
          )}

          {/* Deadline */}
          {project.deadline && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">Échéance</h3>
              <p className="text-neutral-600 text-sm">
                {new Date(project.deadline).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-neutral-100">
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
          <span>Créé le {new Date(project.created_at).toLocaleDateString()}</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
            {project.status === 'active' ? 'Actif' : project.status}
          </span>
        </div>
        <Button className="w-full" icon={MessageCircle}>
          Contacter le créateur
        </Button>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<{ profile: Profile }> = ({ profile }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 text-center border-b border-neutral-100">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-white">
            {profile.first_name[0]}{profile.last_name[0]}
          </span>
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-1">
          {profile.first_name} {profile.last_name}
        </h2>
        <p className="text-neutral-600">{profile.activity}</p>
        {profile.location && (
          <div className="flex items-center justify-center text-sm text-neutral-500 mt-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{profile.location}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {/* Bio */}
          {profile.bio && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">À propos</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collaboration Types */}
          {profile.collaboration_types && profile.collaboration_types.length > 0 && (
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">Types de collaboration</h3>
              <div className="flex flex-wrap gap-2">
                {profile.collaboration_types.map((type) => (
                  <span key={type} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-neutral-100">
        <Button className="w-full" icon={MessageCircle}>
          Envoyer un message
        </Button>
      </div>
    </div>
  );
};

export default DiscoverPage;