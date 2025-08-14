import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Camera, Search, MapPin, User, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveProfileToSupabase } from '../services/profiles';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ProfileSetupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // État qui contient TOUTES les données du formulaire
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    activity: '',
    location: '',
    bio: '',
    skills: [] as string[],
    collaborationTypes: [] as string[],
    availability: '',
    projectInterests: '',
    portfolioLinks: {} as Record<string, string>,
    avatarUrl: ''
  });

  // Fonction pour mettre à jour l'état
  const updateProfileData = (field: string, value: any) => {
    console.log(`📝 Mise à jour ${field}:`, value);
    setProfileData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('🔄 Nouvel état profileData:', newData);
      return newData;
    });
  };

  const WEB_SKILLS_DATA = {
    "Design Web & UI/UX": [
      "UI Design", "UX Design", "Web Design", "Design d'applications mobiles", 
      "Design d'interfaces", "Design d'icônes", "Design d'animations web", "Prototypage"
    ],
    "Développement Front-end": [
      "HTML", "CSS", "JavaScript", "React", "Angular", "Vue.js"
    ],
    "Développement Back-end": [
      "Node.js", "PHP", "Python", "Ruby on Rails"
    ],
    "Développement Autres": [
      "Développement Full-stack", "WordPress", "Drupal", "Shopify", "WooCommerce"
    ],
    "Contenu Web": [
      "Rédaction web", "Copywriting", "SEO", "Marketing de contenu", "Traduction web"
    ],
    "Multimédia Web": [
      "Photographie web", "Vidéo web", "Montage vidéo", "Animation web", "Audio", "Podcast"
    ],
    "Gestion de projet web": [
      "Gestion de projet web", "Gestion de communauté", "Stratégie digitale", 
      "Marketing digital", "Analyse web", "Gestion de réseaux sociaux", 
      "Publicité en ligne", "E-mailing"
    ],
    "Autres compétences web": [
      "Cybersécurité web", "Tests web", "Accessibilité web", "Maintenance web", 
      "Hébergement web", "Serveurs web", "Marketing d'affiliation", "Influence web"
    ]
  };

  const COLLABORATION_TYPES = [
    'Co-fondateur',
    'Partenaire sur projet ponctuel',
    'Freelance rémunéré',
    'Bénévolat/Aide gratuite',
    'Échange de compétences',
    'Mentor/Mentoré',
    'Conseil et avis',
    'Brainstorming/Idéation',
    'Networking simple'
  ];

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
    console.log('🚀 Début sauvegarde avec les données:', profileData);
    
    if (!user) {
      console.error('❌ Pas d\'utilisateur');
      setError('Utilisateur non connecté');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Appeler la fonction de sauvegarde corrigée
    const result = await saveProfileToSupabase(user, profileData);
    
    if (result.success) {
      console.log('✅ Profil sauvegardé avec succès!');
      // Mark profile setup as complete
      if (user) {
        localStorage.setItem(`profile_${user.id}`, 'completed');
      }
      navigate('/discover');
    } else {
      console.error('❌ Erreur sauvegarde:', result.error);
      setError(result.error || 'Erreur lors de la sauvegarde');
    }
    
    setLoading(false);
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = profileData.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    updateProfileData('skills', newSkills);
  };

  const toggleCollaborationType = (type: string) => {
    const currentTypes = profileData.collaborationTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    updateProfileData('collaborationTypes', newTypes);
  };

  const [skillSearch, setSkillSearch] = useState('');

  const filteredSkills = Object.entries(WEB_SKILLS_DATA).map(([category, skills]) => ({
    category,
    skills: skills.filter(skill => 
      skill.toLowerCase().includes(skillSearch.toLowerCase())
    )
  })).filter(group => group.skills.length > 0);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Parlons de vous</h2>
              <p className="text-neutral-600">Commençons par les informations de base</p>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.avatarUrl ? (
                    <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-neutral-400" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-neutral-500">Ajouter une photo de profil</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                value={profileData.firstName}
                onChange={(value) => updateProfileData('firstName', value)}
                placeholder="Prénom"
                icon={User}
                required
              />
              <Input
                value={profileData.lastName}
                onChange={(value) => updateProfileData('lastName', value)}
                placeholder="Nom"
                icon={User}
                required
              />
            </div>

            <Input
              value={profileData.activity}
              onChange={(value) => updateProfileData('activity', value)}
              placeholder="Votre activité (ex: Designer freelance, Développeur React...)"
              icon={Briefcase}
              required
            />

            <Input
              value={profileData.location}
              onChange={(value) => updateProfileData('location', value)}
              placeholder="Localisation (ville, région...)"
              icon={MapPin}
              required
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Vos compétences & expertises</h2>
              <p className="text-neutral-600">Sélectionnez jusqu'à 10 compétences qui vous définissent le mieux</p>
            </div>

            <Input
              value={skillSearch}
              onChange={setSkillSearch}
              placeholder="Rechercher une compétence..."
              icon={Search}
            />

            <div className="max-h-64 overflow-y-auto space-y-4">
              {filteredSkills.map(({ category, skills }) => (
                <div key={category}>
                  <h4 className="font-medium text-neutral-700 mb-2">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        disabled={profileData.skills.length >= 10 && !profileData.skills.includes(skill)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                          profileData.skills.includes(skill)
                            ? 'bg-primary-500 text-white'
                            : profileData.skills.length >= 10
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-neutral-500">
              {profileData.skills.length}/10 compétences sélectionnées
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Recherche de collaboration</h2>
              <p className="text-neutral-600">Aidez-nous à vous connecter avec les bonnes personnes</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Types de collaboration recherchés
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLLABORATION_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleCollaborationType(type)}
                    className={`p-3 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
                      profileData.collaborationTypes.includes(type)
                        ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                        : 'bg-neutral-50 text-neutral-700 border-2 border-transparent hover:bg-neutral-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Disponibilité
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Temps plein', 'Temps partiel', 'Ponctuel'].map(option => (
                  <button
                    key={option}
                    onClick={() => updateProfileData('availability', option)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      profileData.availability === option
                        ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                        : 'bg-neutral-50 text-neutral-700 border-2 border-transparent hover:bg-neutral-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Domaines de projets qui vous intéressent
              </label>
              <textarea
                value={profileData.projectInterests}
                onChange={(e) => updateProfileData('projectInterests', e.target.value)}
                placeholder="Ex: applications mobiles, contenu créatif, projets associatifs, startups tech..."
                className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-primary-500 focus:outline-none resize-none"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Présentation & Portfolio</h2>
              <p className="text-neutral-600">Dernière étape pour finaliser votre profil</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Parlez-vous ! (500 caractères max)
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => updateProfileData('bio', e.target.value.substring(0, 500))}
                placeholder="Vos passions, motivations, ce qui vous anime dans la collaboration..."
                className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-primary-500 focus:outline-none resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-sm text-neutral-500 mt-1">
                {profileData.bio.length}/500 caractères
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Liens portfolio (optionnel)
              </label>
              <div className="space-y-3">
                {['GitHub', 'LinkedIn', 'Behance', 'Site web'].map(platform => (
                  <Input
                    key={platform}
                    value={profileData.portfolioLinks[platform] || ''}
                    onChange={(value) => updateProfileData('portfolioLinks', {...profileData.portfolioLinks, [platform]: value})}
                    placeholder={`Votre profil ${platform}`}
                  />
                ))}
              </div>
            </div>

            {/* Bouton de test debug */}
            <button 
              onClick={() => {
                console.log('🧪 TEST - État actuel profileData:', profileData);
                console.log('🧪 TEST - User:', user);
                // Test de sauvegarde immédiate
                if (user) {
                  saveProfileToSupabase(user, profileData);
                }
              }}
              style={{ background: 'orange', color: 'white', padding: '10px', margin: '10px', borderRadius: '8px' }}
            >
              🧪 TEST SAUVEGARDE
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Étape {currentStep} sur 4</span>
            <span className="text-sm text-neutral-500">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-card p-8 animate-slide-in">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-200">
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
              loading={loading && currentStep === 4}
              disabled={
                (currentStep === 1 && (!profileData.firstName || !profileData.lastName || !profileData.activity || !profileData.location)) ||
                (currentStep === 2 && profileData.skills.length === 0) ||
                (currentStep === 3 && (profileData.collaborationTypes.length === 0 || !profileData.availability))
              }
              icon={currentStep === 4 ? undefined : ChevronRight}
              iconPosition="right"
            >
              {currentStep === 4 ? 'Terminer' : 'Continuer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;