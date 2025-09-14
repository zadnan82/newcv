import React from 'react';
import { useTranslation } from 'react-i18next';

const Hobbies = ({ darkMode, data = [], onChange }) => {
  const { t } = useTranslation();
  const hobbies = data || [{
    name: ''
  }];

  const addHobby = () => {
    onChange([...hobbies, {
      name: ''
    }]);
  };

  const removeHobby = (index) => {
    if (hobbies.length > 1) {
      onChange(hobbies.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, value) => {
    const updatedHobbies = [...hobbies];
    updatedHobbies[index] = {
      name: value
    };
    onChange(updatedHobbies);
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
          {t('resume.hobbies.title', 'Hobbies & Interests')}
        </h3>
        <span className={`text-xs ${
          darkMode ? 'text-red-400' : 'text-red-500'
        }`}>
          {t('common.required_fields', '* Required fields')}
        </span>
      </div>
      
      <div className="space-y-3">
        {hobbies.map((hobby, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <RequiredLabel>{t('resume.hobbies.hobby', 'Hobby/Interest')}</RequiredLabel>
              <input
                type="text"
                value={hobby.name}
                onChange={(e) => handleChange(index, e.target.value)}
                className={inputClasses}
                placeholder={t('resume.hobbies.placeholder', 'e.g., Photography, Reading, Hiking')}
                required
                maxLength={50}
              />
            </div>
            {hobbies.length > 1 && (
              <button
                type="button"
                onClick={() => removeHobby(index)}
                className="text-xs text-red-400 hover:text-red-500 transition-colors mt-5"
              >
                {t('common.remove', 'Remove')}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addHobby}
        className="w-full mt-4 px-3 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
      >
        {t('resume.hobbies.add_button', 'Add Another Hobby')}
      </button>
    </div>
  );
};

export default Hobbies;