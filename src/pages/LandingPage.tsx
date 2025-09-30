import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Lightbulb, Rocket, ArrowRight, CheckCircle, X, Star } from 'lucide-react';
import Button from '../components/common/Button';
import TestimonialsSection from '../components/ui/TestimonialsSection';

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F3' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b" style={{ backgroundColor: 'rgba(250, 247, 243, 0.9)', borderColor: '#F0E4D3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D9A299' }}>
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900">ColabSwipe</span>
            </div>
            <Link to="/auth">
              <button 
                className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#D9A299' }}
              >
                Se connecter
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 animate-slide-in">
              Trouvez Votre Prochain{' '}
              <span style={{ color: '#D9A299' }}>
                Collab'
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              Des projets pros aux passions créatives, connectez-vous avec qui vous inspire
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <Link to="/auth">
                <button 
                  className="px-8 py-4 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                  style={{ backgroundColor: '#D9A299' }}
                >
                  <span>Commencer l'aventure</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button 
                className="px-8 py-4 rounded-xl font-medium transition-all duration-200 border-2 hover:opacity-80"
                style={{ 
                  borderColor: '#DCC5B2',
                  color: '#D9A299',
                  backgroundColor: 'transparent'
                }}
              >
                Découvrir la plateforme
              </button>
            </div>
          </div>

          {/* Hero Visual - Profile Card */}
          <div className="mt-16 relative animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border" style={{ borderColor: '#F0E4D3' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D9A299' }}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Sarah, Designer UX</h3>
                  <p className="text-neutral-600">Recherche développeur React</p>
                </div>
              </div>
              <div className="flex space-x-2 mb-4">
                <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#F0E4D3', color: '#D9A299' }}>UI Design</span>
                <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#F0E4D3', color: '#D9A299' }}>Figma</span>
                <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#F0E4D3', color: '#D9A299' }}>Startup</span>
              </div>
              <p className="text-neutral-600 text-sm mb-6">
                Passionnée par l'innovation, je cherche un développeur pour créer une app révolutionnaire...
              </p>
              <div className="flex justify-center space-x-4">
                <button className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors">
                  <X className="w-6 h-6 text-red-500" />
                </button>
                <button className="w-12 h-12 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors">
                  <Star className="w-6 h-6 text-yellow-500" />
                </button>
                <button className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                  <Heart className="w-6 h-6 text-green-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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


      {/* Dynamic Testimonials Section */}
      <TestimonialsSection />

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

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#D9A299' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à transformer vos idées en réalité ?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Rejoignez des milliers de créateurs qui collaborent déjà sur ColabSwipe
          </p>
          <Link to="/auth">
            <button 
              className="px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:opacity-90 flex items-center space-x-2 mx-auto"
              style={{ 
                backgroundColor: 'white',
                color: '#D9A299'
              }}
            >
              <span>Créer mon compte gratuitement</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D9A299' }}>
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ColabSwipe</span>
            </div>
            <div className="flex items-center space-x-6 text-neutral-400">
              <a href="#" className="hover:text-white transition-colors">À propos</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-500">
            <p>&copy; 2024 ColabSwipe. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;