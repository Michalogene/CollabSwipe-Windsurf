export type SkillLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type WizardSkill = {
  name: string;
  level: SkillLevel;
  people: number;
};

export type WizardMedia = {
  file: File;
  preview: string;
};

export type WizardData = {
  title: string;
  concept: string;
  category: string;
  status: '' | 'active' | 'paused' | 'completed' | 'cancelled';
  detailedDescription: string;
  objectives: string;
  deadline: string;
  skills: WizardSkill[];
  media: WizardMedia[];
};

export type Option = {
  label: string;
  value: string;
};

