import React from 'react';
import { useTranslation } from 'react-i18next';

const ResumeTitle = ({ title, onChange, darkMode }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`mb-6 p-4 rounded-2xl border ${
      darkMode 
        ? 'border-gray-600 bg-gray-800/50' 
        : 'border-purple-500/10 bg-purple-500/5'
    } transition-all duration-300 hover:shadow-lg ${
      darkMode 
        ? 'hover:shadow-purple-500/5' 
        : 'hover:shadow-purple-500/10'
    } hover:-translate-y-0.5`}>
      <label 
        htmlFor="resume-title" 
        className={`block mb-2 text-sm font-medium ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        {t('resume.title.section', 'Resume Title')}
        <span className="text-red-500 ml-1">*</span>
      </label>
      
      <input
        type="text"
        id="resume-title"
        value={title || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('resume.title.placeholder', 'Enter a title for your resume')}
        className={`w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-purple-500/50 transition-all ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        }`}
        required
      />
      
      <p className={`mt-2 text-xs ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {t('resume.title.description', 'Give your resume a title to help you identify it later. This will not appear on your resume.')}
      </p>
    </div>
  );
};

export default ResumeTitle;