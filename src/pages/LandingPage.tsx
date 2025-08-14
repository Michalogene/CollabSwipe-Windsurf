import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Lightbulb, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900">ColabSwipe</span>
            </div>
            <Link to="/auth">
              <Button variant="primary" size="sm">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 animate-slide-in">
              Trouvez Votre Prochain{' '}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Collab'
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              Des projets pros aux passions créatives, connectez-vous avec qui vous inspire
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <Link to="/auth">
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  Commencer l'aventure
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Découvrir la plateforme
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-2xl shadow-card p-8 max-w-md mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Sarah, Designer UX</h3>
                  <p className="text-neutral-600">Recherche développeur React</p>
                </div>
              </div>
              <div className="flex space-x-2 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">UI Design</span>
                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">Figma</span>
                <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">Startup</span>
              </div>
              <p className="text-neutral-600 text-sm mb-6">
                Passionnée par l'innovation, je cherche un développeur pour créer une app révolutionnaire...
              </p>
              <div className="flex justify-center space-x-4">
                <button className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors">
                  ❌
                </button>
                <button className="w-12 h-12 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors">
                  ⭐
                </button>
                <button className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                  ❤️
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
                  className="text-center p-8 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
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
      <section className="py-20 px-4 bg-neutral-50">
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
                    <CheckCircle className="w-6 h-6 text-secondary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/auth">
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    Rejoindre maintenant
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900">Nouveaux Matches</h3>
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-sm">3</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Marc', role: 'Développeur Full-stack', match: '92%' },
                    { name: 'Julie', role: 'Designer graphique', match: '87%' },
                    { name: 'Thomas', role: 'Chef de projet', match: '94%' }
                  ].map((person, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{person.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{person.name}</p>
                        <p className="text-sm text-neutral-600">{person.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-secondary-600">{person.match}</p>
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à transformer vos idées en réalité ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers de créateurs qui collaborent déjà sur ColabSwipe
          </p>
          <Link to="/auth">
            <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
              Créer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
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