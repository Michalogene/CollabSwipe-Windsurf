import React from 'react';
import { AlertTriangle, Mic, Video, PhoneOff, ChevronsLeftRight } from 'lucide-react';

const ComparisonSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 font-sans">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            No crappy AI.
            <br />
            100% human beings.
          </h2>
          <p className="mt-4 text-xl font-medium text-emerald-500">
            AI recycles the past. Humans build the future.
          </p>
        </div>

        <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left (Bad) */}
            <div className="bg-gray-100 px-6 sm:px-10 py-10">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">Chat GPT</h3>
                <p className="mt-1 text-gray-500">Infinite error loops</p>
              </div>

              <div className="mt-6 mx-auto max-w-xl">
                <div className="relative bg-gray-900 rounded-2xl border border-gray-800 shadow-md p-6 h-72 md:h-80">
                  {/* top bar */}
                  <div className="absolute top-0 left-0 right-0 h-10 rounded-t-2xl bg-gray-800/70 border-b border-gray-700 flex items-center gap-2 px-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <div className="ml-3 h-6 w-48 rounded bg-gray-700" />
                  </div>

                  {/* center spinner */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full border-4 border-gray-700 border-t-gray-400 animate-spin" />
                  </div>

                  {/* floating errors */}
                  <div className="absolute left-6 bottom-16 sm:left-10">
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 text-red-600 border border-red-500/40 shadow-sm backdrop-blur px-3 py-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Error: Unable to generate response. System overloaded.</span>
                    </div>
                  </div>
                  <div className="absolute right-6 bottom-6 sm:right-10">
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 text-red-600 border border-red-500/40 shadow-sm backdrop-blur px-3 py-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Error: Unable to generate response. System overloaded.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right (Good) */}
            <div className="bg-slate-700 px-6 sm:px-10 py-10 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">CollabSwipe</h3>
                <p className="mt-1 text-gray-300">Instant matching, active collaboration, faster shipping.</p>
              </div>

              <div className="mt-6 mx-auto max-w-xl">
                <div className="relative bg-gray-900 rounded-2xl border border-gray-800 shadow-lg h-72 md:h-80 overflow-hidden">
                  {/* top bar */}
                  <div className="absolute top-0 left-0 right-0 h-10 rounded-t-2xl bg-gray-800/70 border-b border-gray-700 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="text-xs text-gray-300/70">Project: CollabCall</div>
                  </div>

                  {/* video grid */}
                  <div className="absolute inset-0 pt-10 pb-14 px-3">
                    <div className="h-full grid grid-cols-2 gap-2">
                      <img
                        src="https://i.pravatar.cc/320?img=68"
                        alt="Participant A"
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <img
                        src="https://i.pravatar.cc/320?img=12"
                        alt="Participant B"
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  </div>

                  {/* controls */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-3 bg-gray-800/70 backdrop-blur rounded-full px-3 py-2 shadow">
                    <button className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
                      <Mic className="h-5 w-5 text-gray-200" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
                      <Video className="h-5 w-5 text-gray-200" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center">
                      <PhoneOff className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider button */}
          <div className="z-10 md:absolute relative mx-auto -mt-6 md:m-0 left-1/2 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2">
            <div className="h-12 w-12 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center">
              <ChevronsLeftRight className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
