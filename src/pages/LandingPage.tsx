import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, Compass } from 'lucide-react';
import cloudBackground from '../assets/cloud.png';
import FeaturesSection from '../components/common/FeaturesSection';
import HowItWorksSection from '../components/common/HowItWorksSection';
import ComparisonSection from '../components/common/ComparisonSection';
import StatsSection from '../components/common/StatsSection';
import FooterSection from '../components/common/FooterSection';

const LandingPage: React.FC = () => {

  const navItems = ['Pricing', 'Enterprise', 'Careers', 'Blog'];
  const heroFilters = [
    { label: 'Découvrir', active: true },
    { label: 'Matches', active: false },
    { label: 'Messages', active: false },
    { label: 'Projets', active: false }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F3' }}>
      <div
        className="relative"
        style={{
          backgroundImage: `url(${cloudBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(26, 51, 97, 0.35) 0%, rgba(250, 247, 243, 0.85) 85%)',
            pointerEvents: 'none'
          }}
        />
        <div className="relative z-10 px-4">
          {/* Header */}
          <header className="max-w-7xl mx-auto py-8">
            <div className="flex items-center gap-10 text-white drop-shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <span
                  className="text-2xl font-semibold tracking-wide"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                >
                  CollabSwipe
                </span>
              </div>
              <nav
                className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wide text-white/90"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
              >
                {navItems.map((item) => (
                  <a key={item} href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </header>

          {/* Hero Section */}
          <section className="pt-8 pb-20">
            <div className="max-w-4xl mx-auto text-center text-white drop-shadow-sm">
              <h1
                className="mt-4 text-4xl md:text-6xl lg:text-[4.5rem] font-semibold leading-tight uppercase tracking-wide"
                style={{ fontFamily: '"Libre Caslon Text", Georgia, "Times New Roman", serif' }}
              >
                <span>#1 Tool To</span>
                <br />
                <span>Find A Team</span>
              </h1>

              <div className="mt-6 h-px w-24 bg-white/70 mx-auto" />
              <p
                className="mt-6 text-lg md:text-xl text-white/90"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
              >
                Get access to projects made for you or find your team.
              </p>
              <div className="mt-8 flex justify-center">
                <Link to="/auth">
                  <button className="px-10 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl shadow-blue-900/40 hover:translate-y-0.5 transition-transform">
                    Start for Free
                  </button>
                </Link>
              </div>
            </div>

            {/* Mocked dashboard */}
            <div className="mt-14 max-w-5xl mx-auto">
              <div className="bg-white/20 border border-white/40 rounded-[32px] p-6 md:p-10 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-48 flex flex-col items-center lg:items-stretch text-white/90">
                    <div className="w-16 h-16 rounded-2xl bg-white/30 border border-white/40 flex items-center justify-center mb-6">
                      <Compass className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      {heroFilters.map((item) => (
                        <button
                          key={item.label}
                          className={`w-full rounded-full py-2 px-4 text-sm font-semibold tracking-wide transition ${
                            item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {item.label.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                      <span className="inline-flex h-3 w-3 rounded-full border border-white bg-blue-500 shadow-blue-900/50 shadow-inner" />
                      Projets
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="bg-white/10 rounded-2xl border border-white/30 px-4 py-3 flex items-center justify-between">
                      <div className="flex gap-3">
                        <button
                          className="px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        >
                          Projets
                        </button>
                        <button
                          className="px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition text-white/80 hover:text-white"
                        >
                          Personnes
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <span className="p-2 rounded-full bg-white/10 border border-white/30">
                          <Search className="w-4 h-4" />
                        </span>
                        <span className="p-2 rounded-full bg-white/10 border border-white/30">
                          <Menu className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-28 rounded-2xl bg-white/30 border border-white/50 shadow-inner shadow-white/30 backdrop-blur-md"
                        />
                      ))}
                    </div>
                    <div className="flex justify-center gap-3 pt-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={`h-3 w-3 rounded-full border border-white ${index === 0 ? 'bg-blue-500 shadow-blue-900/40 shadow-lg' : 'bg-white/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <FeaturesSection />
      <HowItWorksSection />
      <ComparisonSection />
      <StatsSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;