import React, { useMemo, useState } from 'react';
import { Minus, Plus, Search, X } from 'lucide-react';
import { SkillLevel, WizardSkill } from './types';

interface StepSkillsProps {
  skills: WizardSkill[];
  availableSkills: string[];
  onAddSkill: (name: string) => void;
  onUpdateSkill: (index: number, updates: Partial<WizardSkill>) => void;
  onRemoveSkill: (index: number) => void;
}

const levelOptions: SkillLevel[] = ['Beginner', 'Intermediate', 'Expert'];

const StepSkills: React.FC<StepSkillsProps> = ({
  skills,
  availableSkills,
  onAddSkill,
  onUpdateSkill,
  onRemoveSkill,
}) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return availableSkills.slice(0, 5);
    return availableSkills.filter((s) => s.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
  }, [search, availableSkills]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">What skills do you need?</h2>

      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a skill..."
            className="w-full bg-white rounded-full border border-gray-100 shadow-sm pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E89E92]/60"
          />
          {filtered.length > 0 && (
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
              {filtered.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    onAddSkill(skill);
                    setSearch('');
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {skills.length === 0 && (
            <div className="text-gray-500 text-sm text-center border border-dashed border-gray-200 rounded-2xl py-6 bg-white">
              Add a skill to get started.
            </div>
          )}

          {skills.map((skill, index) => (
            <div
              key={`${skill.name}-${index}`}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{skill.name}</h4>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {levelOptions.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onUpdateSkill(index, { level })}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                          skill.level === level
                            ? 'bg-[#E89E92] text-white border-transparent shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#E89E92]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">People</span>
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => onUpdateSkill(index, { people: Math.max(1, skill.people - 1) })}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-white border border-transparent hover:border-gray-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-gray-900 font-semibold">{skill.people}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateSkill(index, { people: skill.people + 1 })}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-white border border-transparent hover:border-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSkills;

