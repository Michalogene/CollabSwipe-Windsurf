import React from 'react';
import { Calendar } from 'lucide-react';
import { WizardData } from './types';

interface StepDetailsProps {
  data: WizardData;
  onChange: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}

const StepDetails: React.FC<StepDetailsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Project Creation - Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            value={data.detailedDescription}
            onChange={(e) => onChange('detailedDescription', e.target.value)}
            placeholder="Describe your project in detail, including technologies envisioned, context, etc."
            className="w-full bg-gray-50 text-gray-900 rounded-[1.75rem] px-5 py-4 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E89E92]/60 resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Main Objectives</label>
          <textarea
            value={data.objectives}
            onChange={(e) => onChange('objectives', e.target.value)}
            placeholder="List the main and secondary objectives of your project. For example:
- Develop a functional MVP
- Reach 1000 users
- Validate the concept on the market."
            className="w-full bg-gray-50 text-gray-900 rounded-[1.75rem] px-5 py-4 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E89E92]/60 resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
          <div className="relative">
            <input
              type="date"
              value={data.deadline}
              onChange={(e) => onChange('deadline', e.target.value)}
              className="w-full bg-gray-50 text-gray-900 rounded-full px-5 py-3 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E89E92]/60"
            />
            <Calendar className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDetails;

