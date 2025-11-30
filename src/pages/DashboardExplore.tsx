import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Settings,
  MapPin,
  MessageSquare,
  Star,
  Users2,
} from 'lucide-react';

type Mode = 'talents' | 'projects';

const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

const talentData = [
  { id: 1, name: 'Alex Chen', role: 'React Dev', match: 94, img: avatar(12) },
  { id: 2, name: 'Maria Rodriguez', role: 'UX Researcher', match: 92, img: avatar(45) },
  { id: 3, name: 'James Kim', role: 'Full Stack Dev', match: 95, img: avatar(33) },
  { id: 4, name: 'Emily Davis', role: 'Marketing Lead', match: 89, img: avatar(23) },
  { id: 5, name: 'David Park', role: 'Data Scientist', match: 91, img: avatar(54) },
  { id: 6, name: 'Neesh Khan', role: 'Frontend Dev', match: 92, img: avatar(60) },
];

const projectData = [
  { id: 1, name: 'EcoPay', stage: 'Seed Round', lookingFor: 'CTO', img: 'https://dummyimage.com/120x120/1f2937/ffffff&text=E' },
  { id: 2, name: 'DevFlow', stage: 'Seed Round', lookingFor: 'CTO', img: 'https://dummyimage.com/120x120/111827/ffffff&text=D' },
  { id: 3, name: 'HealthAI', stage: 'Seed Round', lookingFor: 'CTO', img: 'https://dummyimage.com/120x120/0f172a/ffffff&text=H' },
  { id: 4, name: 'EcoPay', stage: 'Seed Round', lookingFor: 'CTO', img: 'https://dummyimage.com/120x120/1f2937/ffffff&text=E' },
  { id: 5, name: 'DevFlow', stage: 'Seed Round', lookingFor: 'CTO', img: 'https://dummyimage.com/120x120/111827/ffffff&text=D' },
  { id: 6, name: 'HealthAI', stage: 'Seed Round', lookingFor: 'CTO', img: 'https://dummyimage.com/120x120/0f172a/ffffff&text=H' },
];

const talentTags = ['Remote', 'Dev', 'Design', 'Marketing', 'Senior Level'];
const projectTags = ['Idea Stage', 'MVP', 'Funded', 'Equity', 'Co-founder needed'];

const GradientHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="relative h-24 rounded-t-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
    {children}
  </div>
);

const TogglePill: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
      active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {label}
  </button>
);

const Chip: React.FC<{ label: string; selected?: boolean; onClick?: () => void }> = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-3 py-1 text-sm transition ${
      selected
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

const DashboardExplore: React.FC = () => {
  const [mode, setMode] = useState<Mode>('talents');
  const [selected, setSelected] = useState<string[]>([]);

  const tags = useMemo(() => (mode === 'talents' ? talentTags : projectTags), [mode]);
  const placeholder = mode === 'talents' ? 'Search for skills, roles, or keywords...' : 'Search for Fintech, AI, SaaS projects...';

  const toggleTag = (t: string) =>
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col">
        <div className="px-5 py-4">
          <div className="text-xl font-semibold">CollabSwipe</div>
        </div>
        <div className="px-4">
          <div className="text-xs text-gray-500 mb-2">Talent Mode</div>
          <div className="rounded-lg border border-gray-200 py-2 px-3 text-sm flex items-center justify-between">
            <span>Explore</span>
            <Users2 className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 bg-blue-50 text-blue-700 font-medium" href="#">
            <span className="h-2 w-2 rounded-full bg-blue-600" /> Explore
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 text-gray-700" href="#">
            <MessageSquare className="h-4 w-4" /> Messages
            <span className="ml-auto h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">3</span>
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 text-gray-700" href="#">
            <Star className="h-4 w-4" /> My Projects
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 text-gray-700" href="#">
            <Star className="h-4 w-4" /> Favorites
          </a>

          <div className="mt-6 px-1">
            <div className="text-xs text-gray-500 mb-2">Active Collaborations</div>
            <div className="flex -space-x-3">
              {[47, 32, 18].map((i) => (
                <img key={i} src={avatar(i)} className="h-8 w-8 rounded-full ring-2 ring-white" />
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto border-t border-gray-100 px-4 py-4 flex items-center gap-3">
          <img src={avatar(64)} className="h-9 w-9 rounded-full" />
          <div className="leading-tight">
            <div className="text-sm font-medium">Sarah Lee</div>
            <div className="text-xs text-gray-500">Product Lead</div>
          </div>
          <Settings className="ml-auto h-5 w-5 text-gray-500" />
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Mode switcher */}
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-sm p-1">
              <TogglePill active={mode === 'talents'} label="Talents" onClick={() => setMode('talents')} />
              <TogglePill active={mode === 'projects'} label="Projects" onClick={() => setMode('projects')} />
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 flex items-center gap-3">
            <div className="relative flex-1">
              <input
                placeholder={placeholder}
                className="w-full rounded-full bg-white border border-gray-200 shadow-sm py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button className="h-11 w-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Chip key={t} label={t} selected={selected.includes(t)} onClick={() => toggleTag(t)} />
            ))}
          </div>

          {/* Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mode === 'talents'
              ? talentData.map((t) => (
                  <div key={t.id} className="group relative rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <GradientHeader>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold shadow-sm">
                          {t.match}% Match
                        </span>
                      </div>
                    </GradientHeader>

                    <div className="px-4 pb-4">
                      <div className="-mt-8 flex items-center">
                        <img src={t.img} className="h-16 w-16 rounded-full ring-4 ring-white shadow-md" />
                      </div>
                      <div className="mt-3">
                        <div className="font-semibold text-gray-900">{t.name}</div>
                        <div className="mt-1 inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5">
                          {t.role}
                        </div>
                      </div>
                      <button className="mt-4 w-full rounded-xl bg-blue-600 text-white py-2.5 font-medium shadow-sm hover:bg-blue-700">
                        Connect
                      </button>
                    </div>

                    {/* Hover dark variant */}
                    <div className="pointer-events-none absolute inset-0 hidden group-hover:flex flex-col items-center justify-center bg-gray-900/95 text-white p-6 transition">
                      <div className="text-sm text-white/80">Stack</div>
                      <div className="mt-2 flex gap-2 flex-wrap justify-center">
                        {['React', 'Node', 'Figma', 'AWS', 'Python'].map((tech) => (
                          <span key={tech} className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              : projectData.map((p) => (
                  <div key={p.id} className="group relative rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <GradientHeader>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold shadow-sm">
                          {p.stage}
                        </span>
                      </div>
                    </GradientHeader>

                    <div className="px-4 pb-4">
                      <div className="-mt-8 flex items-center">
                        <img src={p.img} className="h-14 w-14 rounded-xl ring-4 ring-white shadow-md" />
                      </div>
                      <div className="mt-3">
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="mt-1 text-sm text-gray-600">Looking for: {p.lookingFor}</div>
                      </div>
                      <button className="mt-4 w-full rounded-xl bg-blue-600 text-white py-2.5 font-medium shadow-sm hover:bg-blue-700">
                        Apply
                      </button>
                    </div>

                    {/* Hover dark overlay */}
                    <div className="pointer-events-none absolute inset-0 hidden group-hover:flex flex-col items-center justify-center bg-gray-900/95 text-white p-6 transition text-center">
                      <div className="text-sm text-white/80">Recruiting</div>
                      <div className="mt-1 font-medium">Marketing, Dev</div>
                      <div className="mt-3 text-sm text-white/80">Stack</div>
                      <div className="mt-2 flex gap-2 flex-wrap justify-center">
                        {['Next.js', 'AWS', 'Postgres', 'Stripe'].map((tech) => (
                          <span key={tech} className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex -space-x-2">
                        {[68, 12, 24].map((i) => (
                          <img key={i} src={avatar(i)} className="h-7 w-7 rounded-full ring-2 ring-white" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardExplore;
