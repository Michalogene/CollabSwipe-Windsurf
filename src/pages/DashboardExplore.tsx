import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  Settings,
  ChevronDown,
  Compass,
  MessageSquare,
  Briefcase,
  Star,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'talents' | 'projects';

// Helper pour générer des avatars
const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

// Données des talents
const talentData = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'React Dev',
    match: 94,
    img: avatar(12),
    techStack: ['React', 'Node', 'Figma', 'Python', 'AWS'],
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    role: 'UX Researcher',
    match: 92,
    img: avatar(45),
    techStack: ['Figma', 'Sketch', 'Adobe XD', 'Miro', 'Notion'],
    gradient: 'from-purple-500 via-pink-500 to-orange-500',
  },
  {
    id: 3,
    name: 'James Kim',
    role: 'Full Stack Dev',
    match: 95,
    img: avatar(33),
    techStack: ['React', 'Node', 'PostgreSQL', 'AWS', 'Docker'],
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
  },
  {
    id: 4,
    name: 'Emily Davis',
    role: 'Marketing Lead',
    match: 89,
    img: avatar(23),
    techStack: ['HubSpot', 'Google Analytics', 'Figma', 'Canva', 'Mailchimp'],
    gradient: 'from-orange-500 via-pink-500 to-red-500',
  },
  {
    id: 5,
    name: 'David Park',
    role: 'Data Scientist',
    match: 91,
    img: avatar(54),
    techStack: ['Python', 'TensorFlow', 'AWS', 'Jupyter', 'PostgreSQL'],
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
  },
  {
    id: 6,
    name: 'Neesh Khan',
    role: 'Frontend Dev',
    match: 92,
    img: avatar(60),
    techStack: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Vercel'],
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
  },
  {
    id: 7,
    name: 'Sophie Martin',
    role: 'Product Designer',
    match: 88,
    img: avatar(47),
    techStack: ['Figma', 'Principle', 'After Effects', 'Sketch', 'Framer'],
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
  },
  {
    id: 8,
    name: 'Michael Brown',
    role: 'Backend Dev',
    match: 93,
    img: avatar(32),
    techStack: ['Node', 'Python', 'MongoDB', 'Redis', 'Kubernetes'],
    gradient: 'from-green-500 via-teal-500 to-cyan-500',
  },
];

// Icônes pour le tech stack (simplifiées - on utilisera des badges textuels)
const techIcons: Record<string, string> = {
  React: '⚛️',
  Node: '🟢',
  Figma: '🎨',
  Python: '🐍',
  AWS: '☁️',
  PostgreSQL: '🐘',
  TypeScript: '📘',
  Tailwind: '💨',
  Next: '▲',
  Docker: '🐳',
  MongoDB: '🍃',
  Redis: '🔴',
  Kubernetes: '☸️',
  TensorFlow: '🧠',
  Jupyter: '📓',
  HubSpot: '📊',
  'Google Analytics': '📈',
  Canva: '🎨',
  Mailchimp: '📧',
  Sketch: '✏️',
  'Adobe XD': '🎯',
  Miro: '🖼️',
  Notion: '📝',
  Principle: '🎬',
  'After Effects': '🎞️',
  Framer: '⚡',
  Vercel: '▲',
};

const DashboardExplore: React.FC = () => {
  const [mode, setMode] = useState<Mode>('talents');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Remote']);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { profile } = useAuth();

  const filters = ['Remote', 'Dev', 'Design', 'Marketing', 'Senior Level'];

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // Filtrer les talents selon la recherche et les filtres
  const filteredTalents = useMemo(() => {
    return talentData.filter((talent) => {
      const matchesSearch =
        searchQuery === '' ||
        talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.techStack.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) => {
          if (filter === 'Remote') return true; // Tous sont remote par défaut
          if (filter === 'Dev') return talent.role.toLowerCase().includes('dev');
          if (filter === 'Design') return talent.role.toLowerCase().includes('design');
          if (filter === 'Marketing') return talent.role.toLowerCase().includes('marketing');
          if (filter === 'Senior Level') return talent.match >= 90;
          return true;
        });

      return matchesSearch && matchesFilters;
    });
  }, [searchQuery, selectedFilters]);

  const isActive = (path: string) => location.pathname === path;

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
            <span className="ml-auto h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
              3
            </span>
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

          {/* Active Collaborations */}
          <div className="mt-8 px-1">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium px-2">
              Active Collaborations
            </div>
            <Link
              to="/matches"
              className="flex -space-x-3 px-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              {[47, 32, 18, 64].map((id) => (
                <img
                  key={id}
                  src={avatar(id)}
                  alt="Collaborator"
                  className="h-10 w-10 rounded-full ring-2 ring-white border-2 border-white shadow-sm hover:scale-110 transition-transform"
                />
              ))}
            </Link>
          </div>
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
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Toggle Talents/Projects */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-sm p-1">
              <button
                onClick={() => setMode('talents')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  mode === 'talents'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Talents
              </button>
              <button
                onClick={() => setMode('projects')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  mode === 'projects'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Projects
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for skills, roles, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-white border border-gray-200 shadow-sm py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
              />
            </div>
            <button className="h-11 w-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition-all ${
                  selectedFilters.includes(filter)
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter === 'Remote' && '• '}
                {filter}
              </button>
            ))}
          </div>

          {/* Talent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTalents.map((talent) => (
              <div
                key={talent.id}
                className="group relative rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Gradient Header */}
                <div
                  className={`relative h-24 rounded-t-2xl bg-gradient-to-r ${talent.gradient}`}
                >
                  {/* Match Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold shadow-sm">
                      {talent.match}% Match
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-4 pb-4 relative">
                  {/* Avatar */}
                  <div className="-mt-8 flex items-center">
                    <img
                      src={talent.img}
                      alt={talent.name}
                      className="h-16 w-16 rounded-full ring-4 ring-white shadow-md"
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-3">
                    <div className="font-semibold text-gray-900 text-base">{talent.name}</div>
                    <div className="mt-1.5 inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1">
                      {talent.role}
                    </div>
                  </div>

                  {/* Connect Button */}
                  <button className="mt-4 w-full rounded-xl bg-blue-600 text-white py-2.5 font-medium shadow-sm hover:bg-blue-700 transition-colors">
                    Connect
                  </button>
                </div>

                {/* Hover Overlay - Dark with Tech Stack */}
                <div className="pointer-events-none absolute inset-0 hidden group-hover:flex flex-col items-center justify-center bg-gray-800 text-white p-6 rounded-2xl transition-all duration-300 z-10">
                  <div className="grid grid-cols-3 gap-4 max-w-[180px]">
                    {talent.techStack.slice(0, 5).map((tech) => (
                      <div
                        key={tech}
                        className="flex flex-col items-center justify-center gap-1.5"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-lg backdrop-blur-sm">
                          {techIcons[tech] || '💻'}
                        </div>
                        <span className="text-[10px] text-gray-300 font-medium text-center leading-tight">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTalents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun talent trouvé</p>
              <p className="text-gray-400 text-sm mt-2">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardExplore;
