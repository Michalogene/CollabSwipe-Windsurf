import React from 'react';
import { MousePointer } from 'lucide-react';

const ArrowCurve = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="hw-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
        <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
      </marker>
    </defs>
    <path
      d="M4 60 C 60 10, 140 10, 196 60"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd="url(#hw-arrow)"
      className="opacity-60"
    />
  </svg>
);

const HowItWorksSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 font-sans">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold tracking-tight text-gray-900">Build your network in 3 steps</h2>
          <p className="mt-4 text-xl text-gray-500">The easiest way to find your next co-founder, freelancer, or mentor instantly.</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <div className="w-full bg-gray-100 rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] aspect-[4/3]">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
                <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 border-b border-gray-200/60">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 p-3">
                        <div className="h-10 w-full rounded-md bg-gray-100" />
                        <div className="mt-3 h-2 w-3/4 rounded bg-gray-200" />
                        <div className="mt-1.5 h-2 w-1/2 rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-xl font-semibold text-gray-900"><span className="text-gray-400 mr-1">1</span>Discover Projects</h3>
              <p className="mt-2 text-gray-600 max-w-md">Browse through curated profiles that match your skills, industry, and professional goals.</p>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-full bg-gray-100 rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] relative aspect-[4/3]">
              <div className="absolute inset-0 pointer-events-none" />
              <div className="mx-auto max-w-[78%] bg-white rounded-2xl shadow-md border border-gray-200/70 p-5 relative">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="mt-2 h-2 w-36 bg-gray-100 rounded" />
                  </div>
                </div>
                <button className="mt-5 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium px-4 py-2 shadow-sm">
                  Connect
                </button>
                <MousePointer className="absolute -right-6 bottom-2 h-7 w-7 text-gray-800/80" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-xl font-semibold text-gray-900"><span className="text-gray-400 mr-1">2</span>Click to Connect</h3>
              <p className="mt-2 text-gray-600 max-w-md">See someone interesting? Simply click to show interest. No awkward cold emails.</p>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-full bg-gray-100 rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  </div>
                  <div className="text-xs text-gray-400">Chat</div>
                </div>
                <div className="p-4">
                  <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-white border border-blue-100 shadow-sm px-3 py-1 text-xs text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    New Match!
                  </div>
                  <div className="space-y-3">
                    <div className="max-w-[75%] rounded-2xl bg-gray-100 text-gray-800 px-3 py-2">Hey! Want to team up on this?</div>
                    <div className="max-w-[75%] rounded-2xl bg-blue-600 text-white px-3 py-2 ml-auto">Absolutely! Let’s chat details.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-xl font-semibold text-gray-900"><span className="text-gray-400 mr-1">3</span>Match & Collaborate</h3>
              <p className="mt-2 text-gray-600 max-w-md">It's a match! The chat opens instantly so you can break the ice and start building together.</p>
            </div>
          </div>

          <ArrowCurve className="hidden md:block absolute left-[30.5%] top-28 w-40 text-gray-300" />
          <ArrowCurve className="hidden md:block absolute left-[64%] top-28 w-40 text-gray-300" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
