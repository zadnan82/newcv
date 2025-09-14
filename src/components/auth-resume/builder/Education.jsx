import React from 'react';
import { useTranslation } from 'react-i18next';
 
const formatDateForMonthInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    // If the date is already in YYYY-MM format, return as is
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's in YYYY-MM-DD format, strip the day part
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString.substring(0, 7);
    }
    
    // Try to parse as date and format
    const date = new Date(dateString);
    
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }
  
  // If all else fails, return empty string
  return '';
};
 
const Education = ({ darkMode, data = [], onChange }) => {
  const { t } = useTranslation(); 
  const educations = Array.isArray(data) && data.length > 0 ? data.map(edu => ({
        ...edu,
        institution: edu.institution || '',
        degree: edu.degree || '',
        field_of_study: edu.field_of_study || '',
        location: edu.location|| '',
        start_date: formatDateForMonthInput(edu.start_date),
        end_date: formatDateForMonthInput(edu.end_date),
        current: edu.current || false,
        gpa: edu.gpa ||''
      })) 
    : [{
        institution: '',
        degree: '',
        field_of_study: '',
        location: '',
        start_date: '',
        end_date: '',
        current: false,
        gpa: ''
      }];
  
  const addEducation = () => {
    onChange([...educations, {
      institution: '',
      degree: '',
      field_of_study: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      gpa: ''
    }]);
  };

  const removeEducation = (index) => {
    if (educations.length > 1) {
      onChange(educations.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value
    };

    if (field === 'current' && value === true) {
      updatedEducations[index].end_date = '';
    }
 
    onChange(updatedEducations);
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
      {educations.map((edu, index) => (
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
              {t('resume.education.title', 'Education')} {index + 1}
            </h3>
            {educations.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                {t('common.remove', 'Remove')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Required Fields */}
            <div className="col-span-2">
              <RequiredLabel>{t('resume.education.institution', 'Institution Name')}</RequiredLabel>
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => handleChange(index, 'institution', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.education.institution_placeholder', 'University/College Name')}
                required
                maxLength={100}
              />
            </div>

            <div>
              <RequiredLabel>{t('resume.education.degree', 'Degree')}</RequiredLabel>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.education.degree_placeholder', "e.g., Bachelor's, Master's")}
                required
                maxLength={100}
              />
            </div>

            <div>
              <RequiredLabel>{t('resume.education.field', 'Field of Study')}</RequiredLabel>
              <input
                type="text"
                value={edu.field_of_study || ''}
                onChange={(e) => handleChange(index, 'field_of_study', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.education.field_placeholder', 'e.g., Computer Science')}
                required
                maxLength={100}
              />
            </div>

            <div>
              <RequiredLabel>{t('common.start_date', 'Start Date')}</RequiredLabel>
              <input
                type="month"
                value={edu.start_date || ''}
                onChange={(e) => handleChange(index, 'start_date', e.target.value)}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <OptionalLabel>{t('common.end_date', 'End Date')}</OptionalLabel>
              <div className="space-y-1">
                <input
                  type="month"
                  value={edu.end_date || ''}
                  onChange={(e) => handleChange(index, 'end_date', e.target.value)}
                  disabled={edu.current}
                  className={`${inputClasses} ${edu.current ? 'opacity-50' : ''}`}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-edu-${index}`}
                    checked={edu.current || false}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                    className="w-3 h-3 mr-1"
                  />
                  <label htmlFor={`current-edu-${index}`} className={`text-xs ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('resume.education.currently_studying', 'Currently studying here')}
                  </label>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div>
              <OptionalLabel>{t('common.location', 'Location')}</OptionalLabel>
              <input
                type="text"
                value={edu.location || ''}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                className={inputClasses}
                placeholder={t('common.location_placeholder', 'City, Country')}
                maxLength={100}
              />
            </div>

            <div>
              <OptionalLabel>{t('resume.education.gpa', 'GPA')}</OptionalLabel>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.education.gpa_placeholder', 'e.g., 3.8/4.0')}
                maxLength={10}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full px-3 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
      >
        {t('resume.education.add_button', 'Add Another Education')}
      </button>
    </div>
  );
};

export default Education;