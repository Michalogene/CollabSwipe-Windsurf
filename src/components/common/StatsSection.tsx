import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* Left: Kanban mockup */}
          <div className="w-full">
            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                CollabSwipe
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Column: To Do */}
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">To Do</div>
                  <div className="bg-gray-100/50 rounded-xl p-3 h-[300px]">
                    <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                      <div className="text-sm font-medium text-gray-900">UI Design - Alexa</div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <img src="https://i.pravatar.cc/40?img=47" className="h-5 w-5 rounded-full" alt="Alexa" />
                        <span>Alexa</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                      <div className="text-sm font-medium text-gray-900">API Setup - Roy</div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <img src="https://i.pravatar.cc/40?img=22" className="h-5 w-5 rounded-full" alt="Roy" />
                        <span>Roy</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3">
                      <div className="text-sm font-medium text-gray-900">User Testing - +3 more</div>
                      <div className="mt-2 flex -space-x-2">
                        <img src="https://i.pravatar.cc/40?img=36" className="h-5 w-5 rounded-full ring-2 ring-white" alt="1" />
                        <img src="https://i.pravatar.cc/40?img=12" className="h-5 w-5 rounded-full ring-2 ring-white" alt="2" />
                        <img src="https://i.pravatar.cc/40?img=5" className="h-5 w-5 rounded-full ring-2 ring-white" alt="3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column: In Progress */}
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-4">In Progress</div>
                  <div className="bg-gray-100/50 rounded-xl p-3 h-[300px]">
                    <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                      <div className="text-sm font-medium text-gray-900">Frontend Dev - Neesh</div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <img src="https://i.pravatar.cc/40?img=60" className="h-5 w-5 rounded-full" alt="Neesh" />
                        <span>Neesh</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3">
                      <div className="text-sm font-medium text-gray-900">Content Strategy</div>
                      <div className="mt-2 flex -space-x-2">
                        <img src="https://i.pravatar.cc/40?img=14" className="h-5 w-5 rounded-full ring-2 ring-white" alt="A" />
                        <img src="https://i.pravatar.cc/40?img=52" className="h-5 w-5 rounded-full ring-2 ring-white" alt="B" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column: Done */}
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-gray-500 mb-4">Done</div>
                  <div className="bg-gray-100/50 rounded-xl p-3 h-[300px]">
                    <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
                      <div className="text-sm font-medium text-gray-900">Wireframing</div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <img src="https://i.pravatar.cc/40?img=7" className="h-5 w-5 rounded-full" alt="X" />
                        <span>Alex</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3">
                      <div className="text-sm font-medium text-gray-900">Database Config</div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <img src="https://i.pravatar.cc/40?img=9" className="h-5 w-5 rounded-full" alt="Y" />
                        <span>Ana</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy + Stats */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-12">Launch projects faster</h2>

            <div className="divide-y divide-gray-100">
              {/* Item 1 */}
              <div className="py-6 flex items-start gap-6">
                <div className="min-w-[120px] text-5xl font-light text-gray-900">150+</div>
                <div>
                  <div className="font-semibold text-gray-900">Skill Sets</div>
                  <p className="mt-1 text-gray-500">From developers to designers. Find the exact expertise you need across dozens of industries.</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="py-6 flex items-start gap-6">
                <div className="min-w-[120px] text-5xl font-light text-gray-900">&lt; 5 min</div>
                <div>
                  <div className="font-semibold text-gray-900">Average Match Time</div>
                  <p className="mt-1 text-gray-500">Forget waiting days for cold emails. Start chatting with interested peers almost instantly.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="py-6 flex items-start gap-6">
                <div className="min-w-[120px] text-5xl font-light text-gray-900">100%</div>
                <div>
                  <div className="font-semibold text-gray-900">Verified Humans</div>
                  <p className="mt-1 text-gray-500">No bots, no fake profiles. A vetted community ensuring genuine, high-quality collaboration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
