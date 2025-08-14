import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Upload, MapPin, Calendar, Users, Target, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createProject } from '../../services/projects';
import Button from '../common/Button';
import Input from '../common/Input';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    type: '',
    required_skills: [] as string[],
    collaboration_type: '',
    deadline: '',
    location: '',
    language: 'Français',
    experience_level: '',
    current_phase: '',
    n_collaborators: 1
  });

  const PROJECT_TYPES = [
    'Application Web',
    'Application Mobile',
    'Site Web',
    'E-commerce',
    'SaaS',
    'Startup',
    'Projet Associatif',
    'Contenu Créatif',
    'Marketing Digital',
    'Autre'
  ];

  const COLLABORATION_TYPES = [
    'Co-fondateur',
    'Freelance rémunéré',
    'Partenariat',
    'Bénévolat',
    'Échange de compétences',
    'Stage/Alternance'
  ];

  const EXPERIENCE_LEVELS = [
    'Débutant',
    'Intermédiaire',
    'Expérimenté',
    'Expert',
    'Peu importe'
  ];

  const PROJECT_PHASES = [
    'Idée/Concept',
    'Planification',
    'Développement',
    'Test/Beta',
    'Lancement',
    'Croissance'
  ];

  const SKILLS_OPTIONS = [
    'JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'PHP',
    'UI Design', 'UX Design', 'Figma', 'Photoshop', 'Illustrator',
    'Marketing', 'SEO', 'Copywriting', 'Réseaux Sociaux',
    'Gestion de Projet', 'Business Development', 'Finance'
  ];

  const updateField = (field: string, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    const newSkills = projectData.required_skills.includes(skill)
      ? projectData.required_skills.filter(s => s !== skill)
      : [...projectData.required_skills, skill];
    updateField('required_skills', newSkills);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const result = await createProject({
        creator_id: user.id,
        title: projectData.title,
        description: projectData.description,
        required_skills: projectData.required_skills,
        collaboration_type: projectData.collaboration_type,
        deadline: projectData.deadline || null,
        media_urls: []
      });

      if (result.error) {
        setError('Erreur lors de la création du projet');
        console.error('Erreur création:', result.error);
      } else {
        console.log('✅ Projet créé avec succès');
        onProjectCreated();
        onClose();
        resetForm();
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setProjectData({
      title: '',
      description: '',
      type: '',
      required_skills: [],
      collaboration_type: '',
      deadline: '',
      location: '',
      language: 'Français',
      experience_level: '',
      current_phase: '',
      n_collaborators: 1
    });
    setError('');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return projectData.title && projectData.description && projectData.type;
      case 2:
        return projectData.required_skills.length > 0 && 
               projectData.collaboration_type && 
               projectData.experience_level && 
               projectData.current_phase;
      case 3:
        return true; // Étape optionnelle
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Informations Générales
              </h3>
              <p className="text-neutral-600">
                Présentez votre projet en quelques mots
              </p>
            </div>

            <Input
              label="Titre du projet *"
              value={projectData.title}
              onChange={(value) => updateField('title', value)}
              placeholder="Ex: Application de gestion de tâches collaborative"
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description du projet *
              </label>
              <textarea
                value={projectData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Décrivez votre projet, ses objectifs, et ce que vous souhaitez accomplir..."
                className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-primary-500 focus:outline-none resize-none"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Type de projet *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('type', type)}
                    className={`p-3 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
                      projectData.type === type
                        ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                        : 'bg-neutral-50 text-neutral-700 border-2 border-transparent hover:bg-neutral-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Profil du Collaborateur
              </h3>
              <p className="text-neutral-600">
                Définissez le profil idéal de votre collaborateur
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Compétences requises * (sélectionnez jusqu'à 5)
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {SKILLS_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    disabled={projectData.required_skills.length >= 5 && !projectData.required_skills.includes(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      projectData.required_skills.includes(skill)
                        ? 'bg-primary-500 text-white'
                        : projectData.required_skills.length >= 5
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                {projectData.required_skills.length}/5 compétences sélectionnées
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Type de collaboration *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLLABORATION_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('collaboration_type', type)}
                    className={`p-3 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
                      projectData.collaboration_type === type
                        ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                        : 'bg-neutral-50 text-neutral-700 border-2 border-transparent hover:bg-neutral-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Niveau d'expérience *
                </label>
                <select
                  value={projectData.experience_level}
                  onChange={(e) => updateField('experience_level', e.target.value)}
                  className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phase actuelle *
                </label>
                <select
                  value={projectData.current_phase}
                  onChange={(e) => updateField('current_phase', e.target.value)}
                  className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {PROJECT_PHASES.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nombre de collaborateurs recherchés
              </label>
              <select
                value={projectData.n_collaborators}
                onChange={(e) => updateField('n_collaborators', parseInt(e.target.value))}
                className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num} collaborateur{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Détails Supplémentaires
              </h3>
              <p className="text-neutral-600">
                Informations optionnelles pour enrichir votre projet
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date limite (optionnel)"
                type="date"
                value={projectData.deadline}
                onChange={(value) => updateField('deadline', value)}
                icon={Calendar}
              />

              <Input
                label="Localisation (optionnel)"
                value={projectData.location}
                onChange={(value) => updateField('location', value)}
                placeholder="Paris, Remote, etc."
                icon={MapPin}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Langue du projet
              </label>
              <select
                value={projectData.language}
                onChange={(e) => updateField('language', e.target.value)}
                className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="Français">Français</option>
                <option value="Anglais">Anglais</option>
                <option value="Espagnol">Espagnol</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-semibold text-primary-800 mb-2">
                🎉 Prêt à publier !
              </h4>
              <p className="text-primary-700 text-sm">
                Votre projet sera immédiatement visible sur la page "Découvrir" 
                et les utilisateurs pourront exprimer leur intérêt.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-neutral-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Créer un Projet</h2>
              <p className="text-sm text-neutral-500">Étape {currentStep} sur 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600">
                Progression
              </span>
              <span className="text-sm text-neutral-500">
                {Math.round((currentStep / 3) * 100)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-neutral-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentStep === 1
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Précédent</span>
            </button>

            <Button
              onClick={handleNext}
              loading={loading && currentStep === 3}
              disabled={!isStepValid()}
              icon={currentStep === 3 ? Target : ChevronRight}
              iconPosition="right"
            >
              {currentStep === 3 ? 'Publier le Projet' : 'Continuer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;