import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="h-screen w-full overflow-hidden bg-white flex font-sans">
      {/* Left Panel */}
      <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center px-8 lg:px-16 py-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              CollabSwipe
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome back!</h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-3 bg-white text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.8 2.2-1.7 2.9l2.8 2.2c1.6-1.5 2.5-3.7 2.5-6 0-.6-.1-1.2-.2-1.7H12z" />
                <path fill="#34A853" d="M6.5 14.3l-.9.7-2.2 1.7C4.9 19.7 8.2 21.5 12 21.5c2.4 0 4.5-.8 6-2.2l-2.8-2.2c-.8.6-1.8 1-3.2 1-2.5 0-4.6-1.7-5.4-4z" />
                <path fill="#4A90E2" d="M3.4 7.8C2.7 9.3 2.7 11 3.4 12.5l2.2-1.7c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8L3.4 7.8z" />
                <path fill="#FBBC05" d="M12 4.5c1.3 0 2.5.4 3.4 1.2l2.5-2.5C16.5 1.9 14.4 1 12 1 8.2 1 4.9 2.8 2.9 5.4L5.1 7c.8-2.3 2.9-4 5.4-4z" />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-3 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="First name"
                  className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:ring-2 focus:ring-blue-500 focus:bg-white rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last name"
                  className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:ring-2 focus:ring-blue-500 focus:bg-white rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email"
                className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:ring-2 focus:ring-blue-500 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:ring-2 focus:ring-blue-500 focus:bg-white rounded-xl pl-10 pr-12 py-3 text-gray-900 placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
            >
              {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : 'Log in'}
            </button>
          </form>

          {/* Footer actions */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
            <button className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</button>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', firstName: '', lastName: '' });
              }}
              className="text-gray-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? 'No account yet? Sign up' : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-900 relative overflow-hidden items-center justify-center">
        {/* Decorative gradient blur */}
        <div className="absolute inset-0 opacity-60" />

        {/* Network mockup */}
        <div className="relative w-[480px] h-[320px]">
          {/* central card */}
          <div className="absolute inset-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-lg flex items-center justify-center text-white font-semibold">
              Team
            </div>
          </div>

          {/* avatars + lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 320" fill="none">
            <path d="M120 90 C200 120, 280 120, 360 90" stroke="white" strokeOpacity="0.35" strokeWidth="2" />
            <path d="M140 220 C220 180, 260 180, 340 220" stroke="white" strokeOpacity="0.35" strokeWidth="2" />
            <path d="M90 160 C180 150, 300 150, 390 160" stroke="white" strokeOpacity="0.35" strokeWidth="2" />
          </svg>

          {[
            { top: 50, left: 120, label: 'Dev' },
            { top: 60, left: 340, label: 'Designer' },
            { top: 220, left: 130, label: 'Dev' },
            { top: 220, left: 320, label: 'Marketing' },
            { top: 140, left: 60, label: 'Dev' },
            { top: 140, left: 380, label: 'Marketing' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{ top: item.top, left: item.left }}
            >
              <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 backdrop-blur-lg shadow-lg flex items-center justify-center text-white font-semibold">
                👤
              </div>
              <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-lg border border-white/30">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-12 text-white text-2xl font-bold text-center px-6">
          “Build your dream team for free.”
        </div>

        <div className="absolute bottom-6 right-8 h-10 w-10 rounded-full bg-white/20 rotate-12" />
      </div>
    </div>
  );
};

export default AuthPage;