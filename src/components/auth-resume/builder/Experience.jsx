import React from 'react';
import { useTranslation } from 'react-i18next';

const Experience = ({ darkMode, data = [], onChange }) => {
  const { t } = useTranslation();
  const formatDateForMonthInput = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in YYYY-MM format, return as is
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's in YYYY-MM-DD format, strip the day part
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString.substring(0, 7);
    }
    
    // Try to parse as date and format
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
    
    // If all else fails, return empty string
    return '';
  }; 
  const experiences = Array.isArray(data) && data.length > 0 ? data.map(exp => ({
        ...exp,
        company: exp.company || '',
        position: exp.position || '',
        location: exp.location || '',
        start_date: formatDateForMonthInput(exp.start_date),
        end_date: formatDateForMonthInput(exp.end_date),
        current: exp.current || false,
        description: exp.description || ''
      })) 
    : [{
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        current: false,
        description: ''
      }];
      
  const addExperience = () => {
    onChange([...experiences, {
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    }]);
  };

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      onChange(experiences.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => { 
    
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };

    // Special handling for "current" checkbox
    if (field === 'current' && value === true) {
      updatedExperiences[index].end_date = '';
    }

    // Log the data being sent back to parent for debugging 
    onChange(updatedExperiences);
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
      {experiences.map((exp, index) => (
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
              {t('resume.experience.title', 'Experience')} {index + 1}
            </h3>
            {experiences.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                {t('common.remove', 'Remove')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Required Fields */}
            <div className="col-span-2">
              <RequiredLabel>{t('resume.experience.company', 'Company Name')}</RequiredLabel>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.experience.company_placeholder', 'Company Name')}
                required
                maxLength={100}
              />
            </div>

            <div className="col-span-2">
              <RequiredLabel>{t('resume.experience.position', 'Position')}</RequiredLabel>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.experience.position_placeholder', 'Job Title')}
                required
                maxLength={100}
              />
            </div>

            <div>
              <RequiredLabel>{t('common.start_date', 'Start Date')}</RequiredLabel>
              <input
                type="month"
                value={exp.start_date || ''}
                onChange={(e) => { 
                  handleChange(index, 'start_date', e.target.value);
                }}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <OptionalLabel>{t('common.end_date', 'End Date')}</OptionalLabel>
              <div className="space-y-1">
                <input
                  type="month"
                  value={exp.end_date || ''}
                  onChange={(e) => {
                    console.log('End date changed to:', e.target.value);
                    handleChange(index, 'end_date', e.target.value);
                  }}
                  disabled={exp.current}
                  className={`${inputClasses} ${exp.current ? 'opacity-50' : ''}`}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-exp-${index}`}
                    checked={exp.current || false}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                    className="w-3 h-3 mr-1"
                  />
                  <label htmlFor={`current-exp-${index}`} className={`text-xs ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('resume.experience.current_work', 'I currently work here')}
                  </label>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="col-span-2">
              <OptionalLabel>{t('common.location', 'Location')}</OptionalLabel>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                className={inputClasses}
                placeholder={t('common.location_placeholder', 'City, Country')}
                maxLength={100}
              />
            </div>

            <div className="col-span-2">
              <OptionalLabel>{t('common.description', 'Description')}</OptionalLabel>
              <textarea
                value={exp.description || ''}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                rows="3"
                className={inputClasses}
                placeholder={t('resume.experience.description_placeholder', 'Describe your responsibilities and achievements...')}
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
        onClick={addExperience}
        className="w-full px-3 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
      >
        {t('resume.experience.add_button', 'Add Another Experience')}
      </button>
    </div>
  );
};

export default Experience;