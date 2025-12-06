import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StepBasicInfo from '../components/projects/wizard/StepBasicInfo';
import StepDetails from '../components/projects/wizard/StepDetails';
import StepSkills from '../components/projects/wizard/StepSkills';
import StepMedia from '../components/projects/wizard/StepMedia';
import { Option, WizardData, WizardSkill } from '../components/projects/wizard/types';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const categories: Option[] = [
  { label: 'Web Application', value: 'web-app' },
  { label: 'Mobile Application', value: 'mobile-app' },
  { label: 'SaaS', value: 'saas' },
  { label: 'Marketplace', value: 'marketplace' },
  { label: 'Community', value: 'community' },
  { label: 'Creative/Content', value: 'content' },
  { label: 'Other', value: 'other' },
];

const statusOptions: Option[] = [
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const skillCatalog = [
  'Node.js',
  'React',
  'UI/UX Design',
  'TypeScript',
  'Python',
  'Product Management',
  'Data Science',
  'DevOps',
  'Marketing',
  'Business Development',
  'Mobile (Flutter)',
  'Mobile (React Native)',
];

const initialData: WizardData = {
  title: '',
  concept: '',
  category: '',
  status: '',
  detailedDescription: '',
  objectives: '',
  deadline: '',
  skills: [],
  media: [],
};

const CreateProjectWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => (step / 4) * 100, [step]);

  const updateField = <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSkill = (name: string) => {
    if (data.skills.find((s) => s.name === name)) return;
    const newSkill: WizardSkill = { name, level: 'Beginner', people: 1 };
    updateField('skills', [...data.skills, newSkill]);
  };

  const handleUpdateSkill = (index: number, updates: Partial<WizardSkill>) => {
    updateField(
      'skills',
      data.skills.map((skill, i) => (i === index ? { ...skill, ...updates } : skill)),
    );
  };

  const handleRemoveSkill = (index: number) => {
    updateField(
      'skills',
      data.skills.filter((_, i) => i !== index),
    );
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((file) => file.size <= 10 * 1024 * 1024);
    const mapped = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    updateField('media', [...data.media, ...mapped]);
  };

  const handleRemoveMedia = (index: number) => {
    const toRemove = data.media[index];
    if (toRemove) {
      URL.revokeObjectURL(toRemove.preview);
    }
    updateField(
      'media',
      data.media.filter((_, i) => i !== index),
    );
  };

  const isStepValid = () => {
    if (step === 1) {
      return Boolean(data.title && data.concept && data.category && data.status);
    }
    if (step === 2) {
      return Boolean(data.detailedDescription && data.objectives);
    }
    if (step === 3) {
      return data.skills.length > 0;
    }
    return true;
  };

  const buildDescription = () => {
    const parts = [
      data.concept,
      data.detailedDescription ? `\n\nDetails:\n${data.detailedDescription}` : '',
      data.objectives ? `\n\nObjectives:\n${data.objectives}` : '',
    ];
    return parts.join('');
  };

  const handlePublish = async () => {
    if (!user) {
      setError("Vous devez être connecté pour publier un projet.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const uploadedMedia: { url: string; type: string; isCover: boolean }[] = [];

      for (let i = 0; i < data.media.length; i += 1) {
        const item = data.media[i];
        const extension = item.file.name.split('.').pop();
        const path = `projects/${user.id}/${Date.now()}-${i}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from('project-assets')
          .upload(path, item.file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrl } = supabase.storage.from('project-assets').getPublicUrl(path);
        uploadedMedia.push({
          url: publicUrl.publicUrl,
          type: item.file.type || 'image',
          isCover: i === 0,
        });
      }

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          creator_id: user.id,
          title: data.title,
          description: buildDescription(),
          required_skills: data.skills.map((s) => `${s.name} (${s.level})`),
          collaboration_type: data.category,
          status: data.status || 'active',
          deadline: data.deadline || null,
          media_urls: uploadedMedia.map((m) => m.url),
        })
        .select()
        .single();

      if (projectError) throw projectError;

      if (data.skills.length) {
        const { error: skillError } = await supabase.from('project_skills').insert(
          data.skills.map((skill) => ({
            project_id: project.id,
            skill_name: skill.name,
            level: skill.level,
            people_needed: skill.people,
          })),
        );
        if (skillError) throw skillError;
      }

      if (uploadedMedia.length) {
        const { error: mediaError } = await supabase.from('project_media').insert(
          uploadedMedia.map((media) => ({
            project_id: project.id,
            url: media.url,
            type: media.type,
            is_cover: media.isCover,
          })),
        );
        if (mediaError) throw mediaError;
      }

      navigate('/projects');
    } catch (err) {
      console.error('Erreur publication projet', err);
      setError("Impossible de publier le projet pour le moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepBasicInfo
            data={data}
            categories={categories}
            statusOptions={statusOptions}
            onChange={updateField}
          />
        );
      case 2:
        return <StepDetails data={data} onChange={updateField} />;
      case 3:
        return (
          <StepSkills
            skills={data.skills}
            availableSkills={skillCatalog}
            onAddSkill={handleAddSkill}
            onUpdateSkill={handleUpdateSkill}
            onRemoveSkill={handleRemoveSkill}
          />
        );
      case 4:
        return (
          <StepMedia
            media={data.media}
            onFilesSelected={handleFilesSelected}
            onRemove={handleRemoveMedia}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-4 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl px-8 sm:px-12 py-10">
          <div className="mb-6">
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-[#E89E92] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-sm text-gray-500 mt-2 font-semibold">
              {progress.toFixed(0)}%
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          {renderStep()}

          <div className="flex items-center justify-between mt-10">
            <button
              type="button"
              onClick={() => (step === 1 ? navigate(-1) : setStep((s) => Math.max(1, s - 1)))}
              className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold bg-white shadow-sm hover:bg-gray-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={submitting || !isStepValid()}
              onClick={() => {
                if (step === 4) {
                  handlePublish();
                } else {
                  setStep((s) => Math.min(4, s + 1));
                }
              }}
              className={`px-6 py-3 rounded-full font-semibold text-white bg-[#E89E92] shadow-md hover:opacity-90 transition ${
                submitting || !isStepValid() ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Publishing...' : step === 4 ? 'Publish Project' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectWizard;

