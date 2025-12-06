import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Settings,
  ChevronDown,
  Compass,
  MessageSquare,
  Briefcase,
  Star,
  Heart,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Helper pour générer des avatars
const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

type FilterType = 'all' | 'talents' | 'projects';

interface FavoriteItem {
  id: string;
  type: 'talent' | 'project';
  name: string;
  role?: string; // Pour les talents
  lookingFor?: string; // Pour les projets
  img: string;
  logo?: string; // Pour les projets (lettre initiale)
  logoColor?: string; // Couleur du logo pour les projets
}

const FavoritesPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState('date');
  const location = useLocation();
  const { profile } = useAuth();

  // Fonction helper pour vérifier si une route est active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Données mockées - Collection de favoris
  const favoriteItems: FavoriteItem[] = [
    // Talents
    {
      id: '1',
      type: 'talent',
      name: 'Alex Chen',
      role: 'Senior React Dev',
      img: avatar(12),
    },
    {
      id: '2',
      type: 'talent',
      name: 'Maria Rodriguez',
      role: 'Product Designer',
      img: avatar(45),
    },
    {
      id: '3',
      type: 'talent',
      name: 'James Kim',
      role: 'Full Stack Engineer',
      img: avatar(33),
    },
    {
      id: '4',
      type: 'talent',
      name: 'Sarah Johnson',
      role: 'UX Designer',
      img: avatar(28),
    },
    // Projects
    {
      id: '5',
      type: 'project',
      name: 'DevFlow',
      lookingFor: 'CTO',
      logo: 'D',
      logoColor: 'bg-blue-600',
    },
    {
      id: '6',
      type: 'project',
      name: 'HealthAI',
      lookingFor: 'ML Engineer',
      logo: 'h',
      logoColor: 'bg-purple-600',
    },
    {
      id: '7',
      type: 'project',
      name: 'FinTech Pro',
      lookingFor: 'Backend Dev',
      logo: 'F',
      logoColor: 'bg-green-600',
    },
    {
      id: '8',
      type: 'project',
      name: 'Design Studio',
      lookingFor: 'UI Designer',
      logo: 'D',
      logoColor: 'bg-pink-600',
    },
    // Plus de talents
    {
      id: '9',
      type: 'talent',
      name: 'David Lee',
      role: 'DevOps Engineer',
      img: avatar(47),
    },
    {
      id: '10',
      type: 'talent',
      name: 'Emma Wilson',
      role: 'Marketing Lead',
      img: avatar(52),
    },
    // Plus de projets
    {
      id: '11',
      type: 'project',
      name: 'CloudSync',
      lookingFor: 'Cloud Architect',
      logo: 'C',
      logoColor: 'bg-indigo-600',
    },
    {
      id: '12',
      type: 'project',
      name: 'DataViz',
      lookingFor: 'Data Scientist',
      logo: 'D',
      logoColor: 'bg-orange-600',
    },
  ];

  // Filtrer les items selon le filtre actif
  const filteredItems = useMemo(() => {
    if (filter === 'all') {
      return favoriteItems;
    } else if (filter === 'talents') {
      return favoriteItems.filter((item) => item.type === 'talent');
    } else {
      return favoriteItems.filter((item) => item.type === 'project');
    }
  }, [filter]);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Fixe */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-100 flex flex-col z-10">
        {/* Logo */}
        <div className="px-4 py-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive('/projects')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>My Projects</span>
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive('/favorites')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
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
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header avec Title, Tabs, et Sort */}
          <div className="flex items-center justify-between mb-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">Your Collection</h1>

            {/* Tab Switcher (Center) */}
            <div className="flex-1 flex justify-center">
              <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('talents')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === 'talents'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Talents
                </button>
                <button
                  onClick={() => setFilter('projects')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === 'projects'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Projects
                </button>
              </div>
            </div>

            {/* Sort Dropdown (Right) */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
              >
                <option value="date">Sort by: Date Added</option>
                <option value="name">Sort by: Name</option>
                <option value="recent">Sort by: Recently Active</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center relative"
              >
                {/* Heart Icon - Top Right */}
                <button className="absolute top-4 right-4 p-1 hover:opacity-80 transition-opacity">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                </button>

                {/* Card Content */}
                {item.type === 'talent' ? (
                  <>
                    {/* Avatar */}
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-20 w-20 rounded-full mb-4 ring-2 ring-gray-100"
                    />
                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                    {/* Role */}
                    <p className="text-sm text-gray-500 mb-4">{item.role}</p>
                  </>
                ) : (
                  <>
                    {/* Logo Square */}
                    <div
                      className={`h-20 w-20 ${item.logoColor || 'bg-blue-600'} rounded-xl flex items-center justify-center mb-4 shadow-sm`}
                    >
                      <span className="text-white text-2xl font-bold">
                        {item.logo || item.name[0]}
                      </span>
                    </div>
                    {/* Project Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                    {/* Looking For */}
                    <p className="text-sm text-gray-500 mb-4">
                      Looking for: {item.lookingFor}
                    </p>
                  </>
                )}

                {/* Input Field */}
                <input
                  type="text"
                  placeholder="Add private note..."
                  className="w-full mb-3 px-3 py-2 bg-gray-50 border border-gray-100 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
                />

                {/* Message Button */}
                <button className="w-full bg-blue-600 text-white rounded-lg py-2.5 px-4 text-sm font-medium hover:bg-blue-700 transition-colors">
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FavoritesPage;

