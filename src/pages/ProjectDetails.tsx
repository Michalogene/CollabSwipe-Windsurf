import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  MapPin,
  Banknote,
  Signal,
  Settings,
  ChevronDown,
  Compass,
  MessageSquare,
  Briefcase,
  Star,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getProjectById, Project } from '../services/projects';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Helper pour générer des avatars
const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

interface Founder {
  name: string;
  role: string;
  avatar: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('ID du projet manquant');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: projectError } = await getProjectById(id);

        if (projectError || !data) {
          setError('Projet non trouvé');
          console.error('Erreur chargement projet:', projectError);
        } else {
          setProject(data);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement du projet');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const isActive = (path: string) => location.pathname === path;

  // Données formatées pour l'affichage
  const projectData = project
    ? {
        id: project.id,
        name: project.title,
        tagline: project.description?.substring(0, 50) + '...' || 'Innovative project',
        logo: project.title?.[0] || 'P',
        equity: project.collaboration_type || '5% Equity',
        location: 'Remote-First', // À adapter selon les données réelles
        salary: '$80k Salary', // À adapter selon les données réelles
        stage: project.collaboration_type || 'Pre-Seed',
        mission: project.description || 'No description available.',
        techStack: project.required_skills || [],
        founders: project.creator
          ? [
              {
                name: `${project.creator.first_name} ${project.creator.last_name}`,
                role: project.creator.activity || 'Founder',
                avatar: project.creator.avatar_url || avatar(12),
              },
            ]
          : [],
      }
    : null;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="xl" />
        </div>
      </div>
    );
  }

  if (error || !project || !projectData) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h2>
            <p className="text-gray-600 mb-6">{error || 'Le projet demandé n\'existe pas.'}</p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'exploration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar Fixe */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-100 flex flex-col z-10">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CollabSwipe</span>
          </div>
        </div>

        {/* Dropdown Talent Mode */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
            Mode
          </div>
          <div className="relative">
            <button className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-900">Talent Mode</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation Principale */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <Link
            to="/discover"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive('/discover')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Explore</span>
          </Link>

          <Link
            to="/messages"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all relative"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </Link>

          <Link
            to="/projects"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Briefcase className="h-4 w-4" />
            <span>My Projects</span>
          </Link>

          <Link
            to="/favorites"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </Link>

        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src={avatar(64)}
              alt="Profile"
              className="h-9 w-9 rounded-full ring-2 ring-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'Sarah Lee'}
              </div>
              <div className="text-xs text-gray-500 truncate">Product Lead</div>
            </div>
            <Link
              to="/profile"
              className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-500" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 ml-64 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Back Navigation */}
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Explore</span>
          </Link>

          {/* Header Card */}
          <div className="bg-white rounded-[1.5rem] shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Logo */}
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-3xl">{projectData.logo}</span>
                </div>
                {/* Text Details */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{projectData.name}</h1>
                  <p className="text-lg text-gray-600">{projectData.tagline}</p>
                </div>
              </div>
              {/* Apply Now Button */}
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                Apply Now
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center divide-x divide-gray-100">
              <div className="flex items-center gap-3 px-6 flex-1">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{projectData.equity}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 flex-1">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{projectData.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 flex-1">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{projectData.salary}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 flex-1">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Signal className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{projectData.stage}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Mission (Span 2) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">The Mission</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{projectData.mission}</p>

                {/* Dashboard Mockup */}
                <div className="mt-8 bg-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                      <div className="flex gap-2">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                          <div className="h-6 bg-gray-300 rounded w-16"></div>
                        </div>
                      ))}
                    </div>

                    {/* Chart Area */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                      <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
                      <div className="flex items-end gap-2 h-32">
                        {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 p-3">
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Tech Stack & Founders (Span 1) */}
            <div className="space-y-6">
              {/* Tech Stack Card */}
              <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Tech Stack</h3>
                <div className="flex flex-col items-center gap-6">
                  {projectData.techStack.length > 0 ? (
                    projectData.techStack.slice(0, 3).map((tech, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center border-2 border-blue-200">
                          <span className="text-2xl">
                            {tech === 'React' ? '⚛️' : tech === 'Python' ? '🐍' : '💻'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{tech}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center border-2 border-blue-200">
                          <span className="text-2xl">⚛️</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">React</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-yellow-50 flex items-center justify-center border-2 border-yellow-200">
                          <span className="text-2xl">🐍</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Python</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center border-2 border-orange-200">
                          <span className="text-sm font-bold text-orange-600">AWS</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">AWS</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Founders Card */}
              <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Founders</h3>
                <div className="space-y-4">
                  {projectData.founders.length > 0 ? (
                    projectData.founders.map((founder, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={founder.avatar}
                          alt={founder.name}
                          className="h-12 w-12 rounded-full ring-2 ring-gray-100"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{founder.name}</div>
                          <div className="text-sm text-gray-500">{founder.role}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">Aucun fondateur renseigné</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
