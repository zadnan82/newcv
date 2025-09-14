import React from 'react';
import { useTranslation } from 'react-i18next';

const Languages = ({ darkMode, data = [], onChange }) => {
  const { t } = useTranslation();
  const languages = data || [{
    language: '',
    proficiency: t('resume.languages.levels.beginner', 'Beginner')
  }];
  const proficiencyLevels = [
    t('resume.languages.levels.native', 'Native'),
    t('resume.languages.levels.fluent', 'Fluent'),
    t('resume.languages.levels.advanced', 'Advanced'),
    t('resume.languages.levels.intermediate', 'Intermediate'),
    t('resume.languages.levels.beginner', 'Beginner')
  ];

  const addLanguage = () => {
    onChange([...languages, {
      language: '',
      proficiency: t('resume.languages.levels.beginner', 'Beginner')
    }]);
  };

  const removeLanguage = (index) => {
    if (languages.length > 1) {
      onChange(languages.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value
    };
    onChange(updatedLanguages);
  };

  const RequiredLabel = ({ children }) => (
    <label className={`block text-xs font-medium mb-1 ${
      darkMode ? 'text-white' : 'text-gray-800'
    }`}>
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const inputClasses = `w-full px-2 py-1.5 text-sm rounded-md border focus:ring-2 focus:ring-purple-500/50 transition-all ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300'
  }`;

  return (
    <div className={`p-4 rounded-2xl border ${
      darkMode 
        ? 'border-gray-600 bg-gray-800/50' 
        : 'border-purple-500/10 bg-purple-500/5'
    } space-y-3 transition-all duration-300 hover:shadow-lg ${
      darkMode 
        ? 'hover:shadow-purple-500/5' 
        : 'hover:shadow-purple-500/10'
    } hover:-translate-y-0.5`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-sm font-semibold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {t('resume.languages.title', 'Languages')}
        </h3>
        <span className={`text-xs ${
          darkMode ? 'text-red-400' : 'text-red-500'
        }`}>
          {t('common.required_fields', '* Required fields')}
        </span>
      </div>

      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <RequiredLabel>{t('resume.languages.language', 'Language')}</RequiredLabel>
              <input
                type="text"
                value={lang.language}
                onChange={(e) => handleChange(index, 'language', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.languages.language_placeholder', 'e.g., English, Spanish')}
                required
                maxLength={50}
              />
            </div>

            <div className="flex-1">
              <RequiredLabel>{t('resume.languages.proficiency', 'Proficiency Level')}</RequiredLabel>
              <select
                value={lang.proficiency}
                onChange={(e) => handleChange(index, 'proficiency', e.target.value)}
                className={inputClasses}
                required
              >
                {proficiencyLevels.map((level) => (
                  <option 
                    key={level} 
                    value={level}
                    className={darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
                  >
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {languages.length > 1 && (
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="text-xs text-red-400 hover:text-red-500 transition-colors mb-1.5"
              >
                {t('common.remove', 'Remove')}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLanguage}
        className="w-full mt-4 px-3 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
      >
        {t('resume.languages.add_button', 'Add Another Language')}
      </button>
    </div>
  );
};

export default Languages;