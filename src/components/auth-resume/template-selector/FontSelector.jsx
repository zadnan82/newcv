import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
 
const FontSelector = ({ value, onChange, isDarkMode = false }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); 
  const fontOptions = [
    { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif', sample: t('resume.customizer.font.samples.professional') },
    { name: 'Arial', value: 'Arial, Helvetica, sans-serif', sample: t('resume.customizer.font.samples.modern') },
    { name: 'Times New Roman', value: 'Times New Roman, Times, serif', sample: t('resume.customizer.font.samples.traditional') },
    { name: 'Georgia', value: 'Georgia, Times, serif', sample: t('resume.customizer.font.samples.refined') },
    { name: 'Courier', value: 'Courier, monospace', sample: t('resume.customizer.font.samples.monospaced') },
    { name: 'Verdana', value: 'Verdana, Geneva, sans-serif', sample: t('resume.customizer.font.samples.legible') },
    { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif', sample: t('resume.customizer.font.samples.clean') },
    { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif', sample: t('resume.customizer.font.samples.contemporary') }
  ]; 
  const currentFont = fontOptions.find(font => font.value === value) || { name: t('resume.customizer.font.samples.custom'), value };

  return (
    <div className="mb-3">
      <h4 className={`mb-1.5 text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {t('resume.customizer.font.title')}
      </h4>
      
      {/* Font preview */}
      <div 
        className={`flex items-center p-1.5 rounded cursor-pointer 
          ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white/80 backdrop-blur-sm border border-gray-300'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span 
          className={`flex-1 truncate text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
          style={{ fontFamily: value }}
        >
          {currentFont.name}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} 
            transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Font dropdown */}
      {isOpen && (
        <div className={`mt-1 rounded-md shadow-lg overflow-hidden
          ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white/90 backdrop-blur-sm border border-gray-200'}`}
        >
          <div className="max-h-48 overflow-y-auto py-1">
            {fontOptions.map((font) => (
              <div
                key={font.value}
                className={`px-2 py-1.5 cursor-pointer text-xs
                  ${value === font.value 
                    ? (isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-900') 
                    : (isDarkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-800')}
                `}
                onClick={() => {
                  onChange(font.value);
                  setIsOpen(false);
                }}
              >
                <div className="font-medium" style={{ fontFamily: font.value }}>
                  {font.name}
                </div>
                <div className="text-xs mt-0.5 opacity-75" style={{ fontFamily: font.value }}>
                  {font.sample}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;