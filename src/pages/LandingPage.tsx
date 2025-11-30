import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Lightbulb, Rocket, ArrowRight, CheckCircle, X, Star, Search, Menu, Compass } from 'lucide-react';
import cloudBackground from '../assets/cloud.png';
import FeaturesSection from '../components/common/FeaturesSection';
import HowItWorksSection from '../components/common/HowItWorksSection';
import ComparisonSection from '../components/common/ComparisonSection';
import StatsSection from '../components/common/StatsSection';
import FooterSection from '../components/common/FooterSection';

const LandingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    {
      icon: Users,
      title: 'Échangez Compétences & Idées',
      description: 'Apprenez, enseignez, créez ensemble dans un écosystème bienveillant'
    },
    {
      icon: Heart,
      title: 'Swipez. Matchez. Créez.',
      description: "L'outil le plus simple pour transformer vos idées en réalité"
    },
    {
      icon: Rocket,
      title: 'Projets Pros & Passions',
      description: 'De l\'entrepreneuriat aux hobbies créatifs, tous les projets ont leur place'
    }
  ];

  const benefits = [
    'Connectez-vous avec des profils vérifiés',
    'Découvrez des collaborateurs compatibles',
    'Échangez en temps réel via notre chat intégré',
    'Gérez tous vos projets en un seul endroit',
    'Accédez à une communauté bienveillante'
  ];

  const matches = [
    { name: 'Marc', role: 'Développeur Full-stack', match: '92%' },
    { name: 'Julie', role: 'Designer graphique', match: '87%' },
    { name: 'Thomas', role: 'Chef de projet', match: '94%' }
  ];

  const navItems = ['Pricing', 'Enterprise', 'Careers', 'Blog'];
  const heroFilters = [
    { label: 'Découvrir', active: true },
    { label: 'Matches', active: false },
    { label: 'Messages', active: false },
    { label: 'Projets', active: false }
  ];
  const heroTabs = ['Projets', 'Personnes'];
  const placeholderCards = Array.from({ length: 6 });

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
                        {heroTabs.map((tab, index) => (
                          <button
                            key={tab}
                            className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition ${
                              index === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'text-white/80 hover:text-white'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
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
                      {placeholderCards.map((_, index) => (
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
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              La collaboration n'a jamais été aussi simple
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Une plateforme conçue pour connecter tous les créateurs, peu importe leur domaine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in border"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    borderColor: '#F0E4D3'
                  }}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F0E4D3' }}>
                    <Icon className="w-8 h-8" style={{ color: '#D9A299' }} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#F0E4D3' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                Pourquoi choisir ColabSwipe ?
              </h2>
              <p className="text-xl text-neutral-600 mb-8">
                Rejoignez une communauté de créateurs passionnés et donnez vie à vos projets les plus ambitieux.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D9A299' }} />
                    <span className="text-neutral-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/auth">
                  <button 
                    className="px-8 py-4 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                    style={{ backgroundColor: '#D9A299' }}
                  >
                    <span>Rejoindre maintenant</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-6 border" style={{ borderColor: '#DCC5B2' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900">Nouveaux Matches</h3>
                  <span className="px-2 py-1 rounded-full text-sm text-white" style={{ backgroundColor: '#D9A299' }}>3</span>
                </div>
                <div className="space-y-3">
                  {matches.map((person, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#FAF7F3' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D9A299' }}>
                        <span className="text-white font-semibold">{person.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{person.name}</p>
                        <p className="text-sm text-neutral-600">{person.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: '#D9A299' }}>{person.match}</p>
                        <p className="text-xs text-neutral-500">match</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Choisissez votre plan
            </h2>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-neutral-900' : 'text-neutral-500'}`}>
                Mois
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                style={{ backgroundColor: billingCycle === 'yearly' ? '#D9A299' : '#DCC5B2' }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-medium ${billingCycle === 'yearly' ? 'text-neutral-900' : 'text-neutral-500'}`}>
                Année
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border" style={{ borderColor: '#F0E4D3' }}>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Gratuit</h3>
              <p className="text-neutral-600 mb-6">Pour démarrer et découvrir la plateforme.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-neutral-900">0€</span>
                <span className="text-neutral-600 ml-2">/ {billingCycle === 'monthly' ? 'mois' : 'année'}</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">Créer un profil</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">Découvrir des projets</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">30 swipes par jour</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">1 projet actif</span>
                </li>
              </ul>

              <Link to="/auth">
                <button 
                  className="w-full py-3 rounded-xl font-medium transition-all duration-200 border-2 hover:opacity-80"
                  style={{ 
                    borderColor: '#DCC5B2',
                    color: '#D9A299',
                    backgroundColor: 'transparent'
                  }}
                >
                  Commencer gratuitement
                </button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 relative" style={{ borderColor: '#D9A299' }}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: '#D9A299' }}>
                  Le plus populaire
                </span>
              </div>
              
              {billingCycle === 'yearly' && (
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  -25%
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2" style={{ color: '#D9A299' }}>Premium</h3>
              <p className="text-neutral-600 mb-6">Pour une expérience sans limite et des fonctionnalités exclusives.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-neutral-900">
                  {billingCycle === 'monthly' ? '9,99€' : '89,99€'}
                </span>
                <span className="text-neutral-600 ml-2">/ {billingCycle === 'monthly' ? 'mois' : 'année'}</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">Tous les avantages du plan gratuit</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">Assistant IA intégré</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">5 Super Likes / jour</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">Statistiques avancées</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">5 projets actifs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D9A299' }} />
                  <span className="text-neutral-700">Badge Premium</span>
                </li>
              </ul>

              <Link to="/auth">
                <button 
                  className="w-full py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#D9A299' }}
                >
                  Choisir le plan Premium
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default LandingPage;