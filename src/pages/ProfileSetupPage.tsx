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
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">Parlons de vous</h2>
              <p className="text-lg text-neutral-600">Commençons par les informations de base</p>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: '#F0E4D3' }}
                >
                  {profileData.avatarUrl ? (
                    <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-neutral-400" />
                  )}
                </div>
                <button 
                  className="absolute -bottom-2 -right-2 w-8 h-8 text-white rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#D9A299' }}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-neutral-600">Ajouter une photo de profil</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => updateProfileData('firstName', e.target.value)}
                    placeholder="Prénom"
                    className="w-full px-4 py-4 rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      focusRingColor: '#D9A299'
                    }}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => updateProfileData('lastName', e.target.value)}
                    placeholder="Nom"
                    className="w-full px-4 py-4 rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      focusRingColor: '#D9A299'
                    }}
                    required
                  />
                </div>
              </div>

              <input
                type="text"
                value={profileData.activity}
                onChange={(e) => updateProfileData('activity', e.target.value)}
                placeholder="Votre activité (ex: Designer freelance, Développeur React...)"
                className="w-full px-4 py-4 rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{ 
                  backgroundColor: '#F0E4D3',
                  focusRingColor: '#D9A299'
                }}
                required
              />

              <input
                type="text"
                value={profileData.location}
                onChange={(e) => updateProfileData('location', e.target.value)}
                placeholder="Localisation (ville, région...)"
                className="w-full px-4 py-4 rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{ 
                  backgroundColor: '#F0E4D3',
                  focusRingColor: '#D9A299'
                }}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">Vos compétences & expertises</h2>
              <p className="text-lg text-neutral-600">Sélectionnez jusqu'à 10 compétences qui vous définissent le mieux</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Rechercher une compétence..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{ 
                  backgroundColor: '#F0E4D3',
                  focusRingColor: '#D9A299'
                }}
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-6">
              {filteredSkills.map(({ category, skills }) => (
                <div key={category}>
                  <h4 className="font-semibold text-neutral-900 mb-4 text-lg">{category}</h4>
                  <div className="flex flex-wrap gap-3">
                    {skills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        disabled={profileData.skills.length >= 10 && !profileData.skills.includes(skill)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          profileData.skills.includes(skill)
                            ? 'text-white'
                            : profileData.skills.length >= 10
                            ? 'text-neutral-400 cursor-not-allowed'
                            : 'text-neutral-700 hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: profileData.skills.includes(skill) ? '#D9A299' : '#F0E4D3'
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-neutral-600">
              {profileData.skills.length}/10 compétences sélectionnées
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">Recherche de collaboration</h2>
              <p className="text-lg text-neutral-600">Aidez-nous à vous connecter avec les bonnes personnes</p>
            </div>

            <div>
              <label className="block text-lg font-semibold text-neutral-900 mb-4">
                Types de collaboration recherchés
              </label>
              <div className="grid grid-cols-2 gap-3">
                {COLLABORATION_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleCollaborationType(type)}
                    className={`p-4 rounded-xl text-sm font-medium text-center transition-all duration-200 ${
                      profileData.collaborationTypes.includes(type)
                        ? 'text-white'
                        : 'text-neutral-700 hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: profileData.collaborationTypes.includes(type) ? '#D9A299' : '#F0E4D3'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-neutral-900 mb-4">
                Disponibilité
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Temps plein', 'Temps partiel', 'Ponctuel'].map(option => (
                  <button
                    key={option}
                    onClick={() => updateProfileData('availability', option)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      profileData.availability === option
                        ? 'text-white'
                        : 'text-neutral-700 hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: profileData.availability === option ? '#D9A299' : '#F0E4D3'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-neutral-900 mb-4">
                Domaines de projets qui vous intéressent
              </label>
              <textarea
                value={profileData.projectInterests}
                onChange={(e) => updateProfileData('projectInterests', e.target.value)}
                placeholder="Ex: applications mobiles, contenu créatif, projets associatifs, startups tech..."
                className="w-full px-4 py-4 rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none"
                style={{ 
                  backgroundColor: '#F0E4D3',
                  focusRingColor: '#D9A299'
                }}
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">Présentation & Portfolio</h2>
              <p className="text-lg text-neutral-600">Dernière étape pour finaliser votre profil</p>
            </div>

            <div>
              <label className="block text-lg font-semibold text-neutral-900 mb-4">
                Parlez-vous ! (500 caractères max)
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => updateProfileData('bio', e.target.value.substring(0, 500))}
                placeholder="Vos passions, motivations, ce qui vous anime dans la collaboration..."
                className="w-full px-4 py-4 rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none"
                style={{ 
                  backgroundColor: '#F0E4D3',
                  focusRingColor: '#D9A299'
                }}
                rows={6}
                maxLength={500}
              />
              <div className="text-right text-sm text-neutral-500 mt-2">
                {profileData.bio.length}/500 caractères
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-neutral-900 mb-4">
                Liens portfolio (optionnel)
              </label>
              <div className="space-y-4">
                {['GitHub', 'LinkedIn', 'Behance', 'Site web'].map(platform => (
                  <input
                    key={platform}
                    type="text"
                    value={profileData.portfolioLinks[platform] || ''}
                    onChange={(e) => updateProfileData('portfolioLinks', {...profileData.portfolioLinks, [platform]: e.target.value})}
                    placeholder={`Votre profil ${platform}`}
                    className="w-full px-4 py-4 rounded-xl border-0 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      focusRingColor: '#D9A299'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FAF7F3' }}>
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-600">Étape {currentStep} sur 4</span>
            <span className="text-sm text-neutral-500">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full rounded-full h-3" style={{ backgroundColor: '#F0E4D3' }}>
            <div 
              className="h-3 rounded-full transition-all duration-500"
              style={{ 
                backgroundColor: '#D9A299',
                width: `${(currentStep / 4) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-lg p-12 animate-slide-in">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
              {error}
            </div>
          )}

          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                currentStep === 1
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              style={{
                backgroundColor: currentStep === 1 ? 'transparent' : '#F0E4D3'
              }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Précédent</span>
            </button>

            <button
              onClick={handleNext}
              disabled={
                loading ||
                (currentStep === 1 && (!profileData.firstName || !profileData.lastName || !profileData.activity || !profileData.location)) ||
                (currentStep === 2 && profileData.skills.length === 0) ||
                (currentStep === 3 && (profileData.collaborationTypes.length === 0 || !profileData.availability))
              }
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{ backgroundColor: '#D9A299' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === 4 ? 'Terminer' : 'Continuer'}</span>
                  {currentStep !== 4 && <ChevronRight className="w-5 h-5" />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;