import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
        
        if (result.success) {
          if (result.hasProfile) {
            navigate('/discover');
          } else {
            navigate('/profile/setup');
          }
        } else {
          setError(result.error || 'Identifiants incorrects');
        }
        
      } else {
        if (!formData.firstName || !formData.lastName) {
          setError('Prénom et nom requis pour l\'inscription');
          setLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          setLoading(false);
          return;
        }
        
        result = await signUp(
          formData.email, 
          formData.password, 
          formData.firstName, 
          formData.lastName
        );
        
        if (result.success) {
          navigate('/onboarding');
        } else {
          setError(result.error || 'Erreur lors de l\'inscription');
        }
      }

    } catch (err) {
      console.error('❌ Erreur auth:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Une erreur est survenue avec Google');
    } finally {
      setLoading(false);
    }
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Jeanne Dubois",
      role: "Développeuse Front-end",
      text: "Grâce à ColabSwipe, j'ai trouvé le partenaire idéal pour mon projet en un temps record. La plateforme est intuitive et efficace.",
      avatar: "JD"
    },
    {
      name: "Marc Dupont",
      role: "Entrepreneur Tech",
      text: "La fonctionnalité de matching est bluffante ! J'ai pu collaborer avec des personnes aux compétences complémentaires que je n'aurais jamais trouvées ailleurs.",
      avatar: "MD"
    },
    {
      name: "Sophie Leclerc",
      role: "Designer graphique",
      text: "ColabSwipe a transformé ma manière de réseauter. C'est un outil indispensable pour tout créatif cherchant à élargir son horizon.",
      avatar: "SL"
    },
    {
      name: "Lucas Martin",
      role: "Product Manager",
      text: "Une interface léchée et une expérience utilisateur au top. ColabSwipe facilite vraiment la mise en relation entre professionnels.",
      avatar: "LM"
    },
    {
      name: "Emma Rodriguez",
      role: "UX Designer",
      text: "J'ai lancé trois projets collaboratifs grâce à cette plateforme. Les connexions sont de qualité et les échanges enrichissants.",
      avatar: "ER"
    },
    {
      name: "Thomas Leroy",
      role: "Développeur Full-stack",
      text: "Enfin une plateforme qui comprend les besoins des créateurs ! Le système de matching par compétences est révolutionnaire.",
      avatar: "TL"
    }
  ];

  const leftColumnTestimonials = testimonials.slice(0, 3);
  const rightColumnTestimonials = testimonials.slice(3, 6);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAF7F3' }}>
      {/* Left Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back to home */}
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#D9A299' }}
              >
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">ColabSwipe</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                {isLogin ? 'Bon retour !' : 'Rejoignez ColabSwipe'}
              </h1>
              <p className="text-neutral-600">
                {isLogin 
                  ? 'Connectez-vous à votre compte' 
                  : 'Créez votre compte et commencez à collaborer'
                }
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Google Auth */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors mb-6 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">ou</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Prénom"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: '#D9A299' }}
                    required={!isLogin}
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Nom"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: '#D9A299' }}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="michelangelopeiterfumo@gmail.com"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRingColor: '#D9A299' }}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRingColor: '#D9A299' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#D9A299' }}
              >
                {loading ? (isLogin ? 'Connexion...' : 'Inscription...') : (isLogin ? 'Se connecter' : 'Créer mon compte')}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ email: '', password: '', firstName: '', lastName: '' });
                }}
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {isLogin 
                  ? "Pas encore de compte ? S'inscrire" 
                  : 'Déjà un compte ? Se connecter'
                }
              </button>
            </div>

            {/* Forgot Password */}
            {isLogin && (
              <div className="mt-4 text-center">
                <button className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
                  Mot de passe oublié ?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Animated Testimonials */}
      <div className="hidden lg:flex w-1/2 p-8 overflow-hidden">
        <div className="flex space-x-6 w-full">
          {/* Left Column - Scrolling Down */}
          <div className="flex-1 space-y-6">
            <div className="animate-scroll-down">
              {[...leftColumnTestimonials, ...leftColumnTestimonials].map((testimonial, index) => (
                <div
                  key={`left-${index}`}
                  className="bg-white rounded-2xl p-6 shadow-sm mb-6"
                  style={{ border: '1px solid #F0E4D3' }}
                >
                  <p className="text-neutral-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: '#DCC5B2' }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{testimonial.name}</p>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Scrolling Up */}
          <div className="flex-1 space-y-6">
            <div className="animate-scroll-up">
              {[...rightColumnTestimonials, ...rightColumnTestimonials].map((testimonial, index) => (
                <div
                  key={`right-${index}`}
                  className="bg-white rounded-2xl p-6 shadow-sm mb-6"
                  style={{ border: '1px solid #F0E4D3' }}
                >
                  <p className="text-neutral-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: '#DCC5B2' }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{testimonial.name}</p>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0%);
          }
        }

        @keyframes scrollUp {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-scroll-down {
          animation: scrollDown 20s linear infinite;
        }

        .animate-scroll-up {
          animation: scrollUp 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;