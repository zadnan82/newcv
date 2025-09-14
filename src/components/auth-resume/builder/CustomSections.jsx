import React from 'react';
import { useTranslation } from 'react-i18next';

const CustomSections = ({ darkMode, data = [], onChange }) => {
  const { t } = useTranslation();
  const sections = data || [{
    title: '',
    content: ''
  }];
  const addSection = () => {
    onChange([...sections, {
      title: '',
      content: ''
    }]);
  };
  const removeSection = (index) => {
    if (sections.length > 1) {
      onChange(sections.filter((_, i) => i !== index));
    }
  };
  const handleChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    onChange(updatedSections);
  };
  const RequiredLabel = ({ children }) => (
    <label className={`block text-xs font-medium mb-1 ${
      darkMode ? 'text-white' : 'text-gray-800'
    }`}>
      {children} <span className="text-red-500">*</span>
    </label>
  );
  const OptionalLabel = ({ children }) => (
    <label className={`block text-xs font-medium mb-1 ${
      darkMode ? 'text-gray-400' : 'text-gray-600'
    }`}>
      {children}
    </label>
  );
  const inputClasses = `w-full px-2 py-1.5 text-sm rounded-md border focus:ring-2 focus:ring-purple-500/50 transition-all ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300'
  }`;

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-2xl border ${
            darkMode 
              ? 'border-gray-600 bg-gray-800/50' 
              : 'border-purple-500/10 bg-purple-500/5'
          } space-y-3 transition-all duration-300 hover:shadow-lg ${
            darkMode 
              ? 'hover:shadow-purple-500/5' 
              : 'hover:shadow-purple-500/10'
          } hover:-translate-y-0.5`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className={`text-sm font-semibold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t('resume.custom_sections.title', 'Custom Section')} {index + 1}
            </h3>
            {sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                {t('common.remove', 'Remove')}
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <RequiredLabel>{t('resume.custom_sections.section_title', 'Section Title')}</RequiredLabel>
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.custom_sections.title_placeholder', 'e.g., Projects, Achievements, Publications')}
                required
                maxLength={100}
              />
            </div>

            <div>
              <OptionalLabel>{t('resume.custom_sections.content', 'Content')}</OptionalLabel>
              <textarea
                value={section.content}
                onChange={(e) => handleChange(index, 'content', e.target.value)}
                rows="3"
                className={inputClasses}
                placeholder={t('resume.custom_sections.content_placeholder', 'Section content...')}
                maxLength={2000}
              />
              <div className={`text-xs mt-0.5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('common.max_chars', 'Maximum {{count}} characters', { count: 2000 })}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="w-full px-3 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
      >
        {t('resume.custom_sections.add_button', 'Add Another Section')}
      </button>
    </div>
  );
};

export default CustomSections;