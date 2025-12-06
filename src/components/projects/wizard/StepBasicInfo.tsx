import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Option, WizardData } from './types';

interface StepBasicInfoProps {
  data: WizardData;
  categories: Option[];
  statusOptions: Option[];
  onChange: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

const PillSelect: React.FC<{
  label: string;
  value: string;
  options: Option[];
  onSelect: (value: string) => void;
}> = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="text-sm font-semibold text-gray-700 mb-2">{label}</div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-white text-gray-600 rounded-full px-5 py-3 shadow-sm border border-gray-100 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#E89E92]/50"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value ? options.find((o) => o.value === value)?.label : 'Select an option'}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-5 py-3 text-sm transition hover:bg-gray-50 ${
                value === option.value ? 'text-[#E89E92] font-semibold' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({
  data,
  categories,
  statusOptions,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Project Creation</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Ex: Relationship Application"
            className="w-full bg-gray-50 text-gray-900 rounded-full px-5 py-3 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E89E92]/60"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Concept</label>
          <textarea
            value={data.concept}
            onChange={(e) => onChange('concept', e.target.value)}
            placeholder="Describe your project in a few lines..."
            className="w-full bg-gray-50 text-gray-900 rounded-[1.75rem] px-5 py-4 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E89E92]/60 resize-none"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PillSelect
            label="Category"
            value={data.category}
            options={categories}
            onSelect={(value) => onChange('category', value)}
          />
          <PillSelect
            label="Progress Status"
            value={data.status}
            options={statusOptions}
            onSelect={(value) => onChange('status', value as WizardData['status'])}
          />
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;

