import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  MessageSquare,
  Briefcase,
  Star,
  ChevronDown,
  Settings,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProjects, Project } from '../services/projects';
import LoadingSpinner from '../components/common/LoadingSpinner';

const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

type FilterType = 'all' | 'created' | 'joined';

// Helper to generate a consistent gradient based on project ID
const getGradient = (id: string) => {
  const gradients = [
    'from-blue-600 via-sky-500 to-cyan-400',
    'from-purple-500 via-fuchsia-500 to-orange-400',
    'from-emerald-500 via-teal-500 to-cyan-400',
    'from-blue-600 via-indigo-500 to-blue-400',
    'from-pink-500 via-rose-500 to-yellow-400',
    'from-indigo-500 via-purple-500 to-pink-400'
  ];
  const index = id.charCodeAt(0) % gradients.length;
  return gradients[index];
};

const MyProjectsList: React.FC = () => {
  const { profile, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserProjects(user.id);
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load your projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    // For now, we only have "Created by Me" available via getUserProjects
    // In the future, we can merge with "Member of" projects
    let filtered = projects;

    if (filter === 'created') {
      // All loaded projects are created by user for now
      filtered = projects;
    } else if (filter === 'joined') {
      // Placeholder for joined projects
      filtered = [];
    }

    return filtered;
  }, [filter, projects]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive('/discover') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive('/projects') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>My Projects</span>
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive('/favorites') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </Link>
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-90 transition-opacity"
            >
              <img
                src={profile?.avatar_url || avatar(64)}
                alt="Profile"
                className="h-9 w-9 rounded-full ring-2 ring-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">{profile?.activity || 'Member'}</div>
              </div>
            </button>
            <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">My Projects</h1>
            <button
              onClick={() => navigate('/projects/create')}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Project
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${filter === 'all'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('created')}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${filter === 'created'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              Created by Me
            </button>
            <button
              onClick={() => setFilter('joined')}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${filter === 'joined'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              Joined
            </button>
          </div>

          {/* Grid of Projects */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="mb-4 flex justify-center">
                <Briefcase className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-gray-500 mb-6">Get started by creating your first project.</p>
              <button
                onClick={() => navigate('/projects/create')}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-shadow hover:shadow-md"
                >
                  {/* Header gradient */}
                  <div className={`h-24 bg-gradient-to-r ${getGradient(project.id)} relative`}>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-blue-600`}
                      >
                        Owner
                      </span>
                      {project.status === 'paused' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/40 text-slate-800 border border-white/60 backdrop-blur-sm">
                          PAUSED
                        </span>
                      )}
                      {project.status === 'completed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/80 text-white backdrop-blur-sm">
                          DONE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 min-h-[3.5rem] line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[2.5rem]">
                      {project.description}
                    </p>

                    <button
                      onClick={() => navigate(`/projects/${project.id}/workspace`)}
                      className="w-full bg-blue-600 text-white rounded-lg py-2 mt-4 font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Workspace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyProjectsList;

