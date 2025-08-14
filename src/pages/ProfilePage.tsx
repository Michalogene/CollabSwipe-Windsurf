import React, { useState, useEffect } from 'react';
import { Edit, MapPin, Calendar, Briefcase, Link, Github, Linkedin, Globe, LogOut, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // État pour les données modifiables
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    activity: '',
    location: '',
    bio: '',
    skills: [] as string[],
    collaboration_types: [] as string[],
    availability: '',
    project_interests: '',
    portfolio_links: {} as Record<string, string>
  });

  // Charger les données du profil dans l'état d'édition
  useEffect(() => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        activity: profile.activity || '',
        location: profile.location || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        collaboration_types: profile.collaboration_types || [],
        availability: profile.availability || '',
        project_interests: profile.project_interests || '',
        portfolio_links: profile.portfolio_links || {}
      });
    }
  }, [profile]);

  const updateField = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    const newSkills = editData.skills.includes(skill)
      ? editData.skills.filter(s => s !== skill)
      : [...editData.skills, skill];
    updateField('skills', newSkills);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('💾 Sauvegarde des modifications profil...');
      
      const { data, error: saveError } = await supabase
        .from('profiles')
        .update({
          ...editData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      if (saveError) {
        console.error('❌ Erreur sauvegarde:', saveError);
        setError('Erreur lors de la sauvegarde');
        return;
      }

      console.log('✅ Profil mis à jour avec succès');
      setSuccess('Profil mis à jour avec succès !');
      setIsEditing(false);
      
      // Rafraîchir le profil dans le contexte
      await refreshProfile();

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      setError('Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurer les données originales
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        activity: profile.activity || '',
        location: profile.location || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        collaboration_types: profile.collaboration_types || [],
        availability: profile.availability || '',
        project_interests: profile.project_interests || '',
        portfolio_links: profile.portfolio_links || {}
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/auth');
    }
  };

  const getLinkIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'website':
        return Globe;
      default:
        return Link;
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement du profil...
          </h2>
        </div>
      </div>
    );
  }

  const skillsToShow = isEditing ? editData.skills : profile.skills || [];
  const collaborationToShow = isEditing ? editData.collaboration_types : profile.collaboration_types || [];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-neutral-100"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center border-4 border-neutral-100">
                  <span className="text-white font-bold text-3xl">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <p className="text-xl text-neutral-600 mb-2">{profile.activity}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      icon={Edit}
                      onClick={() => setIsEditing(true)}
                    >
                      Modifier profil
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        icon={X}
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="primary"
                        icon={Save}
                        onClick={handleSave}
                        loading={loading}
                      >
                        Sauvegarder
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">12</div>
                  <div className="text-sm text-neutral-600">Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">5</div>
                  <div className="text-sm text-neutral-600">Collaborations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">4.8</div>
                  <div className="text-sm text-neutral-600">Note moyenne</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            {isEditing && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Informations personnelles</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      value={editData.first_name}
                      onChange={(value) => updateField('first_name', value)}
                    />
                    <Input
                      label="Nom"
                      value={editData.last_name}
                      onChange={(value) => updateField('last_name', value)}
                    />
                  </div>
                  <Input
                    label="Activité"
                    value={editData.activity}
                    onChange={(value) => updateField('activity', value)}
                    placeholder="Votre activité professionnelle"
                  />
                  <Input
                    label="Localisation"
                    value={editData.location}
                    onChange={(value) => updateField('location', value)}
                    placeholder="Ville, région..."
                  />
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">À propos</h2>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Parlez-nous de vous, vos passions, vos motivations..."
                  className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-primary-500 focus:outline-none resize-none"
                  rows={4}
                  maxLength={500}
                />
              ) : (
                <p className="text-neutral-700 leading-relaxed">
                  {profile.bio || 'Aucune description disponible'}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Compétences</h2>
              {isEditing ? (
                <div>
                  <p className="text-sm text-neutral-600 mb-3">Cliquez sur les compétences pour les ajouter/retirer</p>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'React', 'Vue.js', 'Node.js', 'Python', 'UI Design', 'UX Design', 'Figma', 'Photoshop', 'Marketing', 'SEO', 'Copywriting'].map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                          editData.skills.includes(skill)
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skillsToShow.length > 0 ? skillsToShow.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  )) : (
                    <p className="text-neutral-500 italic">Aucune compétence définie</p>
                  )}
                </div>
              )}
            </div>

            {/* Project Interests */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Domaines d'intérêt</h2>
              {isEditing ? (
                <textarea
                  value={editData.project_interests}
                  onChange={(e) => updateField('project_interests', e.target.value)}
                  placeholder="Applications web, projets SaaS, startups tech..."
                  className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-primary-500 focus:outline-none resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-neutral-700">
                  {profile.project_interests || 'Aucun domaine d\'intérêt spécifié'}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collaboration Info */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Collaboration</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-600 mb-2">Types recherchés</h4>
                  {isEditing ? (
                    <select
                      value={editData.collaboration_types[0] || ''}
                      onChange={(e) => updateField('collaboration_types', e.target.value ? [e.target.value] : [])}
                      className="w-full p-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Co-fondateur">Co-fondateur</option>
                      <option value="Freelance rémunéré">Freelance rémunéré</option>
                      <option value="Échange de compétences">Échange de compétences</option>
                      <option value="Bénévolat">Bénévolat</option>
                      <option value="Partenariat">Partenariat</option>
                    </select>
                  ) : (
                    <div className="space-y-2">
                      {collaborationToShow.length > 0 ? collaborationToShow.map((type, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-sm text-neutral-700">{type}</span>
                        </div>
                      )) : (
                        <span className="text-sm text-neutral-500 italic">Non défini</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-600 mb-2">Disponibilité</h4>
                  {isEditing ? (
                    <select
                      value={editData.availability}
                      onChange={(e) => updateField('availability', e.target.value)}
                      className="w-full p-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Temps plein">Temps plein</option>
                      <option value="Temps partiel">Temps partiel</option>
                      <option value="Ponctuel">Ponctuel</option>
                      <option value="Week-ends">Week-ends</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-secondary-500" />
                      <span className="text-sm text-neutral-700">
                        {profile.availability || 'Non défini'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio Links */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Portfolio & Liens</h3>
              {isEditing ? (
                <div className="space-y-3">
                  {['GitHub', 'LinkedIn', 'Website'].map(platform => (
                    <Input
                      key={platform}
                      label={platform}
                      value={editData.portfolio_links[platform] || ''}
                      onChange={(value) => updateField('portfolio_links', {
                        ...editData.portfolio_links,
                        [platform]: value
                      })}
                      placeholder={`Votre profil ${platform}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(profile.portfolio_links || {}).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = getLinkIcon(platform);
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
                      >
                        <Icon className="w-5 h-5 text-neutral-600 group-hover:text-primary-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-neutral-900 capitalize">{platform}</div>
                          <div className="text-xs text-neutral-500 truncate">{url}</div>
                        </div>
                      </a>
                    );
                  })}
                  {Object.keys(profile.portfolio_links || {}).length === 0 && (
                    <p className="text-neutral-500 italic text-sm">Aucun lien ajouté</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  icon={LogOut}
                  className="w-full"
                >
                  Se déconnecter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;