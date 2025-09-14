import React from 'react';
import { useTranslation } from 'react-i18next';

 
const HeadersStyleSelector = ({ value, onChange, isDarkMode = false }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-3">
      <h4 className={`mb-1.5 text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {t('resume.customizer.headers.title')}
      </h4>
      
      <div className="flex space-x-1.5">
        <button
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors
            ${!value 
              ? (isDarkMode ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white') 
              : (isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-300')}
          `}
          onClick={() => onChange(false)}
        >
          <span style={{ textTransform: 'none' }}>{t('resume.customizer.headers.normal')}</span>
        </button>
        
        <button
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors
            ${value 
              ? (isDarkMode ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white') 
              : (isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-300')}
          `}
          onClick={() => onChange(true)}
        >
          <span style={{ textTransform: 'uppercase' }}>{t('resume.customizer.headers.uppercase')}</span>
        </button>
      </div>
      
      <div className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {t('resume.customizer.headers.description')}
      </div>
    </div>
  );
};

export default HeadersStyleSelector;