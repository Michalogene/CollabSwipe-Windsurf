import React, { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { WizardMedia } from './types';

interface StepMediaProps {
  media: WizardMedia[];
  onFilesSelected: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}

const StepMedia: React.FC<StepMediaProps> = ({ media, onFilesSelected, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Project Creation</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">Add your visuals</h3>
          <p className="text-sm text-gray-500">
            Add mockups, logos or diagrams to make your project attractive.
          </p>
        </div>

        <div
          className="rounded-3xl border-2 border-dashed border-[#E89E92]/50 bg-[#FDEDE9] text-center py-12 px-4 cursor-pointer transition hover:bg-[#fde1da]"
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            className="hidden"
            multiple
            onChange={(e) => onFilesSelected(e.target.files)}
          />
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-white border border-[#E89E92]/30 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#E89E92]" />
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-lg">Drag and drop your files here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, PDF accepted (Max 10 MB)</p>
            </div>
          </div>
        </div>

        {media.length > 0 && (
          <div className="space-y-3">
            {media.map((item, index) => (
              <div
                key={`${item.file.name}-${index}`}
                className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    {item.file.type.startsWith('image') ? (
                      <img
                        src={item.preview}
                        alt={item.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                        PDF
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDEDE9] text-[#E89E92]">
                      Cover
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-gray-400 hover:text-gray-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepMedia;

