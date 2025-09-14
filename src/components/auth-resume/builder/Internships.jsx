import React from 'react';
import { useTranslation } from 'react-i18next';

const Internships = ({ darkMode, data = [], onChange }) => {
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
  const internships = Array.isArray(data) && data.length > 0 ? data.map(intern => ({
        ...intern,
        company: intern.company || '',
        position: intern.position || '',
        location: intern.location || '',
        start_date: formatDateForMonthInput(intern.start_date),
        end_date: formatDateForMonthInput(intern.end_date),
        current: intern.current || false,
        description: intern.description || ''
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

  const addInternship = () => {
    onChange([...internships, {
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    }]);
  };

  const removeInternship = (index) => {
    if (internships.length > 1) {
      onChange(internships.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => { 
    
    const updatedInternships = [...internships];
    updatedInternships[index] = {
      ...updatedInternships[index],
      [field]: value
    };

    // Special handling for "current" checkbox
    if (field === 'current' && value === true) {
      updatedInternships[index].end_date = '';
    }

    // Log the data being sent back to parent for debugging 
    onChange(updatedInternships);
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
      {internships.map((internship, index) => (
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
              {t('resume.internships.title', 'Internship')} {index + 1}
            </h3>
            {internships.length > 1 && (
              <button
                type="button"
                onClick={() => removeInternship(index)}
                className="text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                {t('common.remove', 'Remove')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <RequiredLabel>{t('common.company', 'Company')}</RequiredLabel>
              <input
                type="text"
                value={internship.company || ''}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className={inputClasses}
                placeholder={t('common.company_placeholder', 'Company Name')}
                required
                maxLength={100}
              />
            </div>

            <div className="col-span-2">
              <RequiredLabel>{t('resume.internships.position', 'Position')}</RequiredLabel>
              <input
                type="text"
                value={internship.position || ''}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.internships.position_placeholder', 'Internship Position')}
                required
                maxLength={100}
              />
            </div>

            <div className="col-span-2">
              <OptionalLabel>{t('common.location', 'Location')}</OptionalLabel>
              <input
                type="text"
                value={internship.location || ''}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                className={inputClasses}
                placeholder={t('common.location_placeholder', 'City, Country')}
                maxLength={100}
              />
            </div>

            <div>
              <RequiredLabel>{t('common.start_date', 'Start Date')}</RequiredLabel>
              <input
                type="month"
                value={internship.start_date || ''}
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
                  value={internship.end_date || ''}
                  onChange={(e) => {
                    console.log('End date changed to:', e.target.value);
                    handleChange(index, 'end_date', e.target.value);
                  }}
                  disabled={internship.current}
                  className={`${inputClasses} ${internship.current ? 'opacity-50' : ''}`}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-internship-${index}`}
                    checked={internship.current || false}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                    className="w-3 h-3 mr-1"
                  />
                  <label htmlFor={`current-internship-${index}`} className={`text-xs ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('resume.internships.current_work', 'I am currently working here')}
                  </label>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <OptionalLabel>{t('common.description', 'Description')}</OptionalLabel>
              <textarea
                value={internship.description || ''}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                rows="3"
                className={inputClasses}
                placeholder={t('resume.internships.description_placeholder', 'Describe your responsibilities and achievements...')}
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
        onClick={addInternship}
        className="w-full px-3 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
      >
        {t('resume.internships.add_button', 'Add Another Internship')}
      </button>
    </div>
  );
};

export default Internships;