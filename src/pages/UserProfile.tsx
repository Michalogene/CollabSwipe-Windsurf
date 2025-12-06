import React, { useEffect, useState } from 'react';
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
import { supabase } from '../services/supabase';

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
};

const avatar = (id: number) => `https://i.pravatar.cc/200?img=${id}`;

const UserProfile: React.FC = () => {
  const { profile: storedProfile } = useAuth();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [displayProfile, setDisplayProfile] = useState<UserProfileData | null>(null);
  const [editableProfile, setEditableProfile] = useState<UserProfileData | null>(null);

  const isActive = (path: string) => location.pathname.startsWith(path);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const targetId = id;
        let profileData: any = null;

        if (!targetId) {
          // Viewing own profile
          if (storedProfile) {
            profileData = storedProfile;
          }
        } else {
          // Fetching public profile
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', targetId)
            .single();
          if (data) profileData = data;
        }

        if (profileData) {
          // Fetch projects for this user
          const { data: projects } = await supabase
            .from('projects')
            .select('id, title, collaboration_type')
            .eq('creator_id', profileData.id)
            .limit(4);

          // Get matches count (real data)
          const { count: matchesCount } = await supabase
            .from('matches')
            .select('*', { count: 'exact', head: true })
            .or(`user1_id.eq.${profileData.id},user2_id.eq.${profileData.id}`);

          const mappedProfile: UserProfileData = {
            id: profileData.id,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'User',
            role: profileData.activity || 'Member',
            location: profileData.location || 'Remote',
            views: '0', // Not tracked yet
            matches: (matchesCount || 0).toString(),
            responseRate: 'N/A', // Not tracked yet
            avatar: profileData.avatar_url || avatar(0),
            about: profileData.bio || 'No bio yet.',
            skills: profileData.skills || [],
            featuredProjects: projects?.map((p: any) => ({
              id: p.id,
              title: p.title,
              subtitle: p.collaboration_type || 'Project'
            })) || [],
          };
          setDisplayProfile(mappedProfile);
          setEditableProfile(mappedProfile);
        }
      } catch (e) {
        console.error("Error fetching profile", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, storedProfile]);

  const handleFieldChange = (key: keyof UserProfileData, value: string | string[]) => {
    if (editableProfile) {
      setEditableProfile((prev) => ({ ...prev!, [key]: value } as UserProfileData));
    }
  };

  const handleSave = async () => {
    if (!editableProfile) return;
    try {
      const nameParts = editableProfile.name.split(' ');
      const updates = {
        first_name: nameParts[0],
        last_name: nameParts.slice(1).join(' '),
        activity: editableProfile.role,
        location: editableProfile.location,
        bio: editableProfile.about,
        skills: editableProfile.skills
      };

      const { error } = await supabase.from('profiles').update(updates).eq('id', editableProfile.id);
      if (!error) {
        setIsEditing(false);
        setDisplayProfile(editableProfile);
      }
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;
  if (!displayProfile || !editableProfile) return <div className="p-10 text-center">User not found. Please log in or check the URL.</div>;

  const isCurrentUser = !id || (storedProfile && id === storedProfile.id);

  return (
    <div className="flex min-h-screen bg-slate-50">
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive('/discover')
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive('/projects')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>My Projects</span>
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive('/favorites')
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
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-90 transition-opacity"
            >
              <img
                src={storedProfile?.avatar_url || avatar(64)}
                alt="Profile"
                className="h-9 w-9 rounded-full ring-2 ring-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {storedProfile?.first_name && storedProfile?.last_name
                    ? `${storedProfile.first_name} ${storedProfile.last_name}`
                    : 'User'}
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
                  src={displayProfile.avatar}
                  alt={displayProfile.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            </div>

            <div className="pt-20 px-8 pb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">{displayProfile.name}</h2>
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {displayProfile.location}
                  </span>
                </div>
                <div className="text-lg text-gray-700">{displayProfile.role}</div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{displayProfile.matches}</span>
                    <span className="text-xs">Matches</span>
                  </div>
                  <span className="h-8 w-px bg-gray-200" />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{displayProfile.views}</span>
                    <span className="text-xs">Views</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isCurrentUser ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
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
                <p className="text-sm text-gray-600 leading-relaxed">{displayProfile.about}</p>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-[2rem] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {displayProfile.skills.map((skill) => (
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
                {displayProfile.featuredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayProfile.featuredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-2xl bg-slate-900 text-white p-4 h-36 flex flex-col justify-between overflow-hidden relative cursor-pointer"
                        onClick={() => navigate(`/project/${project.id}`)}
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
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No projects yet.
                  </div>
                )}
              </div>

              {/* Experience Section Removed */}
            </div>
          </div>
        </div>
      </main >

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  value={editableProfile.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <input
                  value={editableProfile.role}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input
                  value={editableProfile.location}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">About</label>
              <textarea
                value={editableProfile.about}
                onChange={(e) => handleFieldChange('about', e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
              <input
                value={editableProfile.skills.join(', ')}
                onChange={(e) =>
                  handleFieldChange(
                    'skills',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
