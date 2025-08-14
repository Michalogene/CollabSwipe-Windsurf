import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Heart, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const slides = [
    {
      icon: Users,
      title: 'Trouvez Votre Prochain Collab\'',
      description: 'Des projets pros aux passions créatives, connectez-vous avec qui vous inspire',
      color: 'from-primary-400 to-primary-600'
    },
    {
      icon: Heart,
      title: 'Échangez Compétences & Idées',
      description: 'Apprenez, enseignez, créez ensemble dans un écosystème bienveillant',
      color: 'from-secondary-400 to-secondary-600'
    },
    {
      icon: Rocket,
      title: 'Swipez. Matchez. Créez.',
      description: 'L\'outil le plus simple pour transformer vos idées en réalité',
      color: 'from-accent-400 to-accent-600'
    }
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      if (user) {
        localStorage.setItem(`onboarding_${user.id}`, 'completed');
      }
      navigate('/profile/setup');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (user) {
      localStorage.setItem(`onboarding_${user.id}`, 'completed');
    }
    navigate('/profile/setup');
  };

  const currentSlide = slides[currentStep];
  const Icon = currentSlide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Skip Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSkip}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Passer
          </button>
        </div>

        {/* Slide Content */}
        <div className="bg-white rounded-2xl shadow-card p-8 text-center animate-slide-in">
          {/* Icon */}
          <div className={`w-24 h-24 bg-gradient-to-br ${currentSlide.color} rounded-3xl flex items-center justify-center mx-auto mb-8`}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            {currentSlide.title}
          </h1>
          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
            {currentSlide.description}
          </p>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-primary-500 w-8'
                    : index < currentStep
                    ? 'bg-primary-300'
                    : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`p-3 rounded-xl transition-all duration-200 ${
                currentStep === 0
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <Button
              onClick={handleNext}
              icon={currentStep === slides.length - 1 ? undefined : ChevronRight}
              iconPosition="right"
              className="px-8"
            >
              {currentStep === slides.length - 1 ? 'Commencer' : 'Suivant'}
            </Button>
          </div>
        </div>

        {/* Step Counter */}
        <div className="text-center mt-4 text-sm text-neutral-500">
          Étape {currentStep + 1} sur {slides.length}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;