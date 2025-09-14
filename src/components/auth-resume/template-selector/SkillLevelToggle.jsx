import React from 'react';
import { useTranslation } from 'react-i18next';

 
const SkillLevelToggle = ({ value, onChange, isDarkMode = false }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-3">
      <h4 className={`mb-1.5 text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {t('resume.customizer.skills.title')}
      </h4>
      
      <div className="flex items-center">
        <label className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={value}
              onChange={() => onChange(!value)}
            />
            <div className={`block w-8 h-5 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} ${value ? 'bg-purple-500' : ''}`}></div>
            <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition transform ${value ? 'translate-x-3' : ''}`}></div>
          </div>
          <span className={`ml-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {value ? t('resume.customizer.skills.hide') : t('resume.customizer.skills.show')}
          </span>
        </label>
      </div>
      
      <div className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {t('resume.customizer.skills.description')}
      </div>
    </div>
  );
};

export default SkillLevelToggle;