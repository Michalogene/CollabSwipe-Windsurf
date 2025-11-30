import React from 'react';
import { ArrowRight, Lock, Plus } from 'lucide-react';

const avatarUrls = [
  'https://i.pravatar.cc/100?img=12',
  'https://i.pravatar.cc/100?img=32',
  'https://i.pravatar.cc/100?img=5',
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 font-sans">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tight text-gray-900">
            Build a team or join a startup.
          </h2>
          <p className="mt-2 text-5xl font-bold tracking-tight text-gray-900/90">For free.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] flex flex-col">
            <div className="relative w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-4">
                  {avatarUrls.map((src, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <img src={src} alt={`Person ${i + 1}`} className="h-12 w-12 rounded-full ring-2 ring-white/60 object-cover" />
                      <span className="mt-2 text-xs text-white/90">
                        {i === 0 ? 'Developer' : i === 1 ? 'Designer' : 'PM'}
                      </span>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="ml-auto h-12 w-12 rounded-full border border-white/30 bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
                    aria-label="Add member"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="h-10 rounded-md bg-white/10" />
                  <div className="h-10 rounded-md bg-white/10" />
                  <div className="h-10 rounded-md bg-white/10 col-span-2" />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <h3 className="text-2xl font-bold">Build your dream team</h3>
              <p className="mt-2 text-white/90">
                Find the perfect co-founder, developer, or freelancer to turn your idea into reality.
              </p>
            </div>
          </div>

          <div className="h-full rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] flex flex-col">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Join exciting startups</h3>
              <p className="mt-2 text-gray-600">
                Browse active projects looking for your specific skills and hop on board.
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: 'New AI App',
                  body:
                    'Find AI cofounder, active AI and developer communities and start building together.',
                },
                {
                  title: 'Fintech Startup',
                  body:
                    'Join a regulated fintech startup to build next-gen payments experiences.',
                },
                {
                  title: 'E‑commerce Platform',
                  body:
                    'Ship features for high‑growth merchants using modern tooling.',
                },
              ].map((job, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{job.body}</p>
                  </div>
                  <button className="self-start bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1.5 text-sm font-medium shadow-sm">
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="h-full rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] flex items-center gap-6">
            <div className="flex-1">
              <span className="inline-flex items-center rounded-full bg-blue-600 text-white text-xs font-bold px-3 py-1">Free Forever</span>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">100% Free Matching</h3>
              <p className="mt-2 text-gray-600">No hidden fees. Connect and chat for free.</p>
            </div>
            <div className="shrink-0">
              <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 p-6">
                <Lock className="h-12 w-12 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="h-full rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-white border border-gray-200 shadow-sm px-4 py-2 text-sm font-medium text-gray-900">
                  Sign Up
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span className="inline-flex items-center rounded-full bg-white border border-gray-200 shadow-sm px-4 py-2 text-sm font-medium text-gray-900">
                  Swipe Profiles
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span className="inline-flex items-center rounded-full bg-white border border-gray-200 shadow-sm px-4 py-2 text-sm font-medium text-gray-900">
                  Match & Chat
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-bold text-gray-900">Start instantly</h3>
              <p className="mt-2 text-gray-600">Sign up and start swiping in under 2 minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
