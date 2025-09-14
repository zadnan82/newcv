import React from 'react';
import { useTranslation } from 'react-i18next';

const Skills = ({ darkMode, data = [], onChange }) => {
  const { t } = useTranslation();
  const skills = data || [{
    name: '',
    level: t('resume.skills.intermediate', 'Intermediate')
  }];
  const skillLevels = [
    t('resume.skills.beginner', 'Beginner'),
    t('resume.skills.intermediate', 'Intermediate'),
    t('resume.skills.advanced', 'Advanced'),
    t('resume.skills.expert', 'Expert')
  ];

  const addSkill = () => {
    onChange([...skills, {
      name: '',
      level: t('resume.skills.intermediate', 'Intermediate')
    }]);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      onChange(skills.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    onChange(updatedSkills);
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
          {t('resume.skills.title', 'Skills')}
        </h3>
        <span className={`text-xs ${
          darkMode ? 'text-red-400' : 'text-red-500'
        }`}>
          {t('common.required_fields', '* Required fields')}
        </span>
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-2 p-2 rounded-xl ${
              darkMode ? 'bg-gray-700/30' : 'bg-white/50'
            } border ${
              darkMode ? 'border-gray-600/50' : 'border-purple-500/5'
            } transition-all duration-200 hover:shadow-sm`}
          >
            <div className="flex-1">
              <RequiredLabel>{t('resume.skills.name', 'Skill Name')}</RequiredLabel>
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className={inputClasses}
                placeholder={t('resume.skills.name_placeholder', 'e.g., JavaScript, Project Management')}
                required
                maxLength={50}
              />
            </div>
            
            <div className="w-1/3">
              <OptionalLabel>{t('resume.skills.level', 'Skill Level')}</OptionalLabel>
              <select
                value={skill.level}
                onChange={(e) => handleChange(index, 'level', e.target.value)}
                className={inputClasses}
              >
                {skillLevels.map(level => (
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

            {skills.length > 1 && (
              <button
                type="button"
                onClick={() => removeSkill(index)}
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
        onClick={addSkill}
        className="w-full px-3 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
      >
        {t('resume.skills.add_button', 'Add Another Skill')}
      </button>
    </div>
  );
};

export default Skills;