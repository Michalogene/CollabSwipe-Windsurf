import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
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
      
      // Rafraîchir le profil dans le contexte
      await refreshProfile();

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      setError('Erreur inattendue');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/auth');
    }
  };

  const availableSkills = [
    'JavaScript', 'React', 'Vue.js', 'Node.js', 'Python', 'UI Design', 
    'UX Design', 'Figma', 'Photoshop', 'Marketing', 'SEO', 'Copywriting'
  ];

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F3' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">
            Chargement du profil...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FAF7F3' }}>
      <div className="max-w-4xl mx-auto">
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

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6" style={{ borderColor: '#F0E4D3', border: '1px solid' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCC5B2' }}>
                  <span className="text-white font-bold text-2xl">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </span>
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-neutral-600 mb-2">{profile.activity}</p>
              <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#D9A299' }}>12</div>
                  <div className="text-sm text-neutral-600">Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#D9A299' }}>5</div>
                  <div className="text-sm text-neutral-600">Collaborations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#D9A299' }}>4.8</div>
                  <div className="text-sm text-neutral-600">Note moyenne</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 border hover:opacity-80"
                style={{ 
                  borderColor: '#DCC5B2',
                  color: '#D9A299',
                  backgroundColor: 'transparent'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#D9A299' }}
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <div className="bg-white rounded-2xl shadow-sm p-6" style={{ borderColor: '#F0E4D3', border: '1px solid' }}>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Informations personnelles</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={editData.first_name}
                      onChange={(e) => updateField('first_name', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        backgroundColor: '#F0E4D3',
                        borderColor: '#DCC5B2',
                        focusRingColor: '#D9A299'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={editData.last_name}
                      onChange={(e) => updateField('last_name', e.target.value)}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        backgroundColor: '#F0E4D3',
                        borderColor: '#DCC5B2',
                        focusRingColor: '#D9A299'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Activité</label>
                  <input
                    type="text"
                    value={editData.activity}
                    onChange={(e) => updateField('activity', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      borderColor: '#DCC5B2',
                      focusRingColor: '#D9A299'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Localisation</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      borderColor: '#DCC5B2',
                      focusRingColor: '#D9A299'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* À propos */}
            <div className="bg-white rounded-2xl shadow-sm p-6" style={{ borderColor: '#F0E4D3', border: '1px solid' }}>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">À propos</h2>
              <textarea
                value={editData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Je souhaite développer de nombreuses plateformes et apps avec l'aide de l'IA mais j'ai besoin d'un collaborateur pour la backend, les erreurs, ou même pour des tests."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
                rows={4}
                style={{ 
                  backgroundColor: '#F0E4D3',
                  borderColor: '#DCC5B2',
                  focusRingColor: '#D9A299'
                }}
              />
            </div>

            {/* Compétences */}
            <div className="bg-white rounded-2xl shadow-sm p-6" style={{ borderColor: '#F0E4D3', border: '1px solid' }}>
              <h2 className="text-lg font-semibold text-neutral-900 mb-2">Compétences</h2>
              <p className="text-sm text-neutral-600 mb-4">Cliquez sur les compétences pour les ajouter/retirer</p>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      editData.skills.includes(skill)
                        ? 'text-white'
                        : 'text-neutral-700 hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: editData.skills.includes(skill) ? '#D9A299' : '#F0E4D3'
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Domaines d'intérêt */}
            <div className="bg-white rounded-2xl shadow-sm p-6" style={{ borderColor: '#F0E4D3', border: '1px solid' }}>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Domaines d'intérêt</h2>
              <textarea
                value={editData.project_interests}
                onChange={(e) => updateField('project_interests', e.target.value)}
                placeholder="apps mobiles, sites web, vidéos, photos"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
                rows={3}
                style={{ 
                  backgroundColor: '#F0E4D3',
                  borderColor: '#DCC5B2',
                  focusRingColor: '#D9A299'
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collaboration */}
            <div className="bg-white rounded-2xl shadow-sm p-6" style={{ borderColor: '#F0E4D3', border: '1px solid' }}>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Collaboration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Types recherchés</label>
                  <select
                    value={editData.collaboration_types[0] || ''}
                    onChange={(e) => updateField('collaboration_types', e.target.value ? [e.target.value] : [])}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      borderColor: '#DCC5B2',
                      focusRingColor: '#D9A299'
                    }}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Co-fondateur">Co-fondateur</option>
                    <option value="Freelance rémunéré">Freelance rémunéré</option>
                    <option value="Échange de compétences">Échange de compétences</option>
                    <option value="Bénévolat">Bénévolat</option>
                    <option value="Partenariat">Partenariat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Disponibilité</label>
                  <select
                    value={editData.availability}
                    onChange={(e) => updateField('availability', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      borderColor: '#DCC5B2',
                      focusRingColor: '#D9A299'
                    }}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Temps plein">Temps plein</option>
                    <option value="Temps partiel">Temps partiel</option>
                    <option value="Ponctuel">Ponctuel</option>
                    <option value="Week-ends">Week-ends</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Portfolio & Liens */}
            <div className="bg-white rounded-2xl shadow-sm p-6" style={{ borderColor: '#F0E4D3', border: '1px solid' }}>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Portfolio & Liens</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">GitHub</label>
                  <input
                    type="text"
                    value={editData.portfolio_links.GitHub || ''}
                    onChange={(e) => updateField('portfolio_links', {
                      ...editData.portfolio_links,
                      GitHub: e.target.value
                    })}
                    placeholder="Votre profil GitHub"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      borderColor: '#DCC5B2',
                      focusRingColor: '#D9A299'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">LinkedIn</label>
                  <input
                    type="text"
                    value={editData.portfolio_links.LinkedIn || ''}
                    onChange={(e) => updateField('portfolio_links', {
                      ...editData.portfolio_links,
                      LinkedIn: e.target.value
                    })}
                    placeholder="Votre profil LinkedIn"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      borderColor: '#DCC5B2',
                      focusRingColor: '#D9A299'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Website</label>
                  <input
                    type="text"
                    value={editData.portfolio_links.Website || ''}
                    onChange={(e) => updateField('portfolio_links', {
                      ...editData.portfolio_links,
                      Website: e.target.value
                    })}
                    placeholder="Votre profil Website"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      backgroundColor: '#F0E4D3',
                      borderColor: '#DCC5B2',
                      focusRingColor: '#D9A299'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6" style={{ borderColor: '#F0E4D3', border: '1px solid' }}>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Actions</h3>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border hover:opacity-80"
                style={{ 
                  borderColor: '#DCC5B2',
                  color: '#D9A299',
                  backgroundColor: 'transparent'
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;