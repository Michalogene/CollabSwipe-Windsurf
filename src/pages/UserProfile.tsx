import React, { useMemo } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Share2,
  Edit3,
  Linkedin,
  Github,
  Twitter,
  Dribbble,
  Compass,
  MessageSquare,
  Briefcase,
  Star,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type UserProfileData = {
  id: string;
  name: string;
  role: string;
  location: string;
  views: string;
  matches: string;
  responseRate: string;
  avatar: string;
  about: string;
  skills: string[];
  featuredProjects: Array<{ id: string; title: string; subtitle: string }>;
  experiences: Array<{ id: string; title: string; date: string; location: string }>;
};

const avatar = (id: number) => `https://i.pravatar.cc/200?img=${id}`;

const mockUsers: Record<string, UserProfileData> = {
  sarah: {
    id: 'sarah',
    name: 'Sarah Khan',
    role: 'Senior Product Designer',
    location: 'Paris, Remote',
    views: '500+ Views',
    matches: '42 Matches',
    responseRate: '98% Response Rate',
    avatar: avatar(24),
    about:
      'Clean ipsum dolor sit amet, consectetur adipiscing elit. Clean company ous nem consmutarus ques, and reincipenturs.',
    skills: ['Figma', 'React', 'UX Research'],
    featuredProjects: [
      {
        id: 'p1',
        title: 'Build bra your Project Invoicing',
        subtitle: 'Dashboard UI',
      },
      {
        id: 'p2',
        title: 'Convsae your Project Invoicing',
        subtitle: 'Analytics UI',
      },
    ],
    experiences: [
      {
        id: 'e1',
        title: 'Lead Designer at TechFlow',
        date: 'Jun 13, 2024 · Remote',
        location: 'Remote',
      },
      {
        id: 'e2',
        title: 'Lead Designer at TechFlow',
        date: 'May 14, 2024 · Remote',
        location: 'Remote',
      },
      {
        id: 'e3',
        title: 'Lead Designer at TechFlow',
        date: 'Apr 02, 2024 · Remote',
        location: 'Remote',
      },
    ],
  },
};

const UserProfile: React.FC = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const userData = useMemo(() => {
    if (id && mockUsers[id]) return mockUsers[id];
    // Fallback to current user mock
    return mockUsers['sarah'];
  }, [id]);

  const isCurrentUser = !id;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
              isActive('/discover') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
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
              7
            </span>
          </Link>

          <Link
            to="/projects"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive('/projects') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>My Projects</span>
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive('/favorites') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </Link>
        </nav>

        {/* Active Collaborations */}
        <div className="mt-4 px-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium px-2">
            Active Collaborations
          </div>
          <div className="flex -space-x-3 px-2">
            {[47, 32, 18].map((id) => (
              <img
                key={id}
                src={avatar(id)}
                alt="Collaborator"
                className="h-10 w-10 rounded-full ring-2 ring-white border-2 border-white shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-90 transition-opacity"
            >
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
            </button>
            <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Header Profile Card */}
          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden">
            <div className="relative">
              <div className="h-36 lg:h-40 bg-gradient-to-r from-slate-900 via-blue-900 to-orange-400" />
              <div className="absolute left-8 -bottom-16">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            </div>

            <div className="pt-20 px-8 pb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {userData.location}
                  </span>
                </div>
                <div className="text-lg text-gray-700">{userData.role}</div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>{userData.views}</span>
                  <span className="h-4 w-px bg-gray-200" />
                  <span>{userData.matches}</span>
                  <span className="h-4 w-px bg-gray-200" />
                  <span>{userData.responseRate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isCurrentUser ? (
                  <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
                    Connect
                  </button>
                )}
                <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column */}
            <div className="space-y-4 lg:col-span-1">
              {/* About Me */}
              <div className="bg-white rounded-[2rem] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{userData.about}</p>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-[2rem] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div className="bg-white rounded-[2rem] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Socials</h3>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'li', icon: Linkedin, color: 'bg-blue-100 text-blue-700' },
                    { id: 'dr', icon: Dribbble, color: 'bg-pink-100 text-pink-600' },
                    { id: 'gh', icon: Github, color: 'bg-gray-100 text-gray-800' },
                    { id: 'tw', icon: Twitter, color: 'bg-sky-100 text-sky-600' },
                  ].map((social) => (
                    <button
                      key={social.id}
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${social.color} hover:opacity-90 transition-opacity`}
                    >
                      <social.icon className="h-6 w-6" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 lg:col-span-2">
              {/* Featured Projects */}
              <div className="bg-white rounded-[2rem] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.featuredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-2xl bg-slate-900 text-white p-4 h-36 flex flex-col justify-between overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-70" />
                      <div className="relative z-10">
                        <div className="text-xs text-slate-300">{project.subtitle}</div>
                        <div className="text-lg font-semibold leading-snug mt-1">
                          {project.title}
                        </div>
                      </div>
                      <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
                        <span>Dashboard</span>
                        <span>Analytics</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-[2rem] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                <div className="relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-200" />
                  <div className="space-y-6">
                    {userData.experiences.map((exp, idx) => (
                      <div key={exp.id} className="pl-10 relative">
                        <div className="absolute left-2 top-1.5 h-3 w-3 rounded-full bg-blue-500 border-4 border-white shadow" />
                        <div className="text-base font-semibold text-gray-900">{exp.title}</div>
                        <div className="text-sm text-gray-500">{exp.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

