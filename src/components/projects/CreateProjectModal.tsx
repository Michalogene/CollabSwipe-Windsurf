import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Upload, Search, Plus, Minus } from 'lucide-react';
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
    concept: '',
    category: '',
    status: '',
    skills: [] as Array<{
      name: string;
      level: 'Débutant' | 'Intermédiaire' | 'Expert';
      people: number;
    }>,
    description: '',
    objectives: '',
    deadline: '',
    media: [] as string[]
  });

  const [skillSearch, setSkillSearch] = useState('');

  const CATEGORIES = [
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

  const STATUS_OPTIONS = [
    'Idée/Concept',
    'Planification',
    'Développement',
    'Test/Beta',
    'Lancement',
    'Croissance'
  ];

  const AVAILABLE_SKILLS = [
    'Node.js', 'React', 'UI/UX Design', 'JavaScript', 'Python', 'Vue.js', 
    'Angular', 'PHP', 'Design Graphique', 'Marketing', 'SEO', 'Copywriting',
    'Gestion de Projet', 'Business Development', 'Finance', 'Photoshop',
    'Figma', 'Illustrator', 'WordPress', 'Shopify'
  ];

  const updateField = (field: string, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skillName: string) => {
    if (!projectData.skills.find(s => s.name === skillName)) {
      const newSkill = {
        name: skillName,
        level: 'Débutant' as const,
        people: 1
      };
      updateField('skills', [...projectData.skills, newSkill]);
    }
    setSkillSearch('');
  };

  const updateSkill = (index: number, field: string, value: any) => {
    const updatedSkills = [...projectData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    updateField('skills', updatedSkills);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = projectData.skills.filter((_, i) => i !== index);
    updateField('skills', updatedSkills);
  };

  const handleNext = () => {
    if (currentStep < 4) {
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
        description: `${projectData.concept}\n\nObjectifs:\n${projectData.objectives}`,
        required_skills: projectData.skills.map(s => s.name),
        collaboration_type: projectData.category,
        deadline: projectData.deadline || null,
        media_urls: projectData.media
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
      concept: '',
      category: '',
      status: '',
      skills: [],
      description: '',
      objectives: '',
      deadline: '',
      media: []
    });
    setError('');
    setSkillSearch('');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return projectData.title && projectData.concept && projectData.category && projectData.status;
      case 2:
        return projectData.skills.length > 0;
      case 3:
        return projectData.description && projectData.objectives;
      case 4:
        return true; // Media is optional
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Titre du projet
                </label>
                <input
                  type="text"
                  value={projectData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Ex: Application de mise en relation"
                  className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Concept
                </label>
                <textarea
                  value={projectData.concept}
                  onChange={(e) => updateField('concept', e.target.value)}
                  placeholder="Décrivez votre projet en quelques lignes..."
                  rows={4}
                  className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={projectData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    État d'avancement
                  </label>
                  <select
                    value={projectData.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}
                  >
                    <option value="">Sélectionner un état</option>
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                De quelles compétences avez-vous besoin ?
              </h3>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Rechercher une compétence..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}
                />
                {skillSearch && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-neutral-200 rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
                    {AVAILABLE_SKILLS
                      .filter(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()))
                      .map(skill => (
                        <button
                          key={skill}
                          onClick={() => addSkill(skill)}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {projectData.skills.map((skill, index) => (
                  <div key={index} className="p-4 border border-neutral-200 rounded-lg" style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-neutral-900">{skill.name}</h4>
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {['Débutant', 'Intermédiaire', 'Expert'].map(level => (
                          <button
                            key={level}
                            onClick={() => updateSkill(index, 'level', level)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              skill.level === level
                                ? 'text-white'
                                : 'text-neutral-600 border border-neutral-300'
                            }`}
                            style={{
                              backgroundColor: skill.level === level ? '#D9A299' : 'transparent'
                            }}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-neutral-600">Personnes</span>
                        <button
                          onClick={() => updateSkill(index, 'people', Math.max(1, skill.people - 1))}
                          className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center">{skill.people}</span>
                        <button
                          onClick={() => updateSkill(index, 'people', skill.people + 1)}
                          className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description du projet
              </label>
              <textarea
                value={projectData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Décrivez en détail votre projet, les technologies envisagées, le contexte, etc."
                rows={4}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Objectifs
              </label>
              <textarea
                value={projectData.objectives}
                onChange={(e) => updateField('objectives', e.target.value)}
                placeholder="Listez les objectifs principaux et secondaires de votre projet. Par exemple :
- Développer un MVP fonctionnel
- Atteindre 1000 utilisateurs
- Valider le concept sur le marché"
                rows={6}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date limite
              </label>
              <input
                type="date"
                value={projectData.deadline}
                onChange={(e) => updateField('deadline', e.target.value)}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{ backgroundColor: '#F0E4D3', borderColor: '#DCC5B2' }}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-4">
                Média
              </label>
              
              <div 
                className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center"
                style={{ borderColor: '#DCC5B2' }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#F0E4D3' }}
                  >
                    <Upload className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-neutral-600 mb-2">Glissez-déposez vos fichiers ici</p>
                    <p className="text-sm text-neutral-500">ou cliquez pour sélectionner</p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Parcourir les fichiers
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="px-8 py-6 border-b" style={{ borderColor: '#F0E4D3' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Création de projet</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: '#F0E4D3' }}
              >
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: '#D9A299',
                    width: `${(currentStep / 4) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="px-8 py-6" style={{ backgroundColor: '#FAF7F3' }}>
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center px-8 py-6 border-t" style={{ borderColor: '#F0E4D3' }}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-neutral-400 cursor-not-allowed'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Précédent
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                !isStepValid() || loading
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:opacity-90'
              }`}
              style={{ backgroundColor: '#D9A299' }}
            >
              {loading ? 'Création...' : currentStep === 4 ? 'Publier le projet' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;