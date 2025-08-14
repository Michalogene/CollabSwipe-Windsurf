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
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isLogin) {
        // CONNEXION - utilisateur existant
        console.log('🔑 Mode CONNEXION');
        result = await signIn(formData.email, formData.password);
        
        if (result.success) {
          if (result.hasProfile) {
            console.log('✅ Utilisateur avec profil → /discover');
            navigate('/discover');
          } else {
            console.log('⚠️ Utilisateur sans profil → /profile/setup');
            navigate('/profile/setup');
          }
        } else {
          setError(result.error || 'Identifiants incorrects');
        }
        
      } else {
        // INSCRIPTION - nouvel utilisateur
        console.log('📝 Mode INSCRIPTION');
        
        // Validation pour l'inscription
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
          console.log('✅ Inscription réussie → /onboarding');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to home */}
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-card p-8 animate-slide-in">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
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
          <Button
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={loading}
            loading={loading}
            className="w-full mb-6"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
            Continuer avec Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">ou</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange('firstName', value)}
                  placeholder="Prénom"
                  icon={User}
                  required={!isLogin}
                />
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange('lastName', value)}
                  placeholder="Nom"
                  icon={User}
                  required={!isLogin}
                />
              </div>
            )}

            <Input
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="votre@email.com"
              icon={Mail}
              required
            />

            <Input
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Mot de passe"
              icon={Lock}
              required
            />

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              className="w-full"
            >
              {isLogin ? 'Se connecter' : 'Créer mon compte'}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', firstName: '', lastName: '' });
              }}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
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

          {/* Debug info */}
          <div className="mt-6 p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600">
            <strong>Mode:</strong> {isLogin ? 'CONNEXION (récupère profil existant)' : 'INSCRIPTION (création nouveau profil)'}
          </div>
        </div>

        {/* Terms */}
        <p className="mt-6 text-center text-sm text-neutral-500">
          En continuant, vous acceptez nos{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700">
            Conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700">
            Politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;