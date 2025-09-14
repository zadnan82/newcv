import React from 'react';
import { useTranslation } from 'react-i18next';

const Referrals = ({ darkMode, data = [], onChange }) => {
  const { t } = useTranslation();  
  let references = []; 
  if (Array.isArray(data)) {
    references = data.length > 0 ? data : [{ name: '', relation: '', phone: '', email: '' }];
  } 
  else if (data && typeof data === 'object' && Array.isArray(data.references)) {
    references = data.references.length > 0 ? data.references : [{ name: '', relation: '', phone: '', email: '' }];
  } 
  else {
    references = [{ name: '', relation: '', phone: '', email: '' }];
  }

  const addReference = () => {
    const newReferences = [...references, {
      name: '',
      relation: '',
      phone: '',
      email: ''
    }];
    
    // If we have the object structure, maintain it
    if (typeof data === 'object' && !Array.isArray(data)) {
      onChange({
        references: newReferences
      });
    } else {
      // Otherwise just return the array
      onChange(newReferences);
    }
  };

  const removeReference = (index) => {
    if (references.length > 1) {
      const newReferences = references.filter((_, i) => i !== index);
      
      // If we have the object structure, maintain it
      if (typeof data === 'object' && !Array.isArray(data)) {
        onChange({
          references: newReferences
        });
      } else {
        // Otherwise just return the array
        onChange(newReferences);
      }
    }
  };

  const handleChange = (index, field, value) => { 
    const newReferences = [...references];
    newReferences[index] = {
      ...newReferences[index],
      [field]: value
    };
    
    // If we have the object structure, maintain it
    if (typeof data === 'object' && !Array.isArray(data)) {
      onChange({
        references: newReferences
      });
    } else {
      // Otherwise just return the array
      onChange(newReferences);
    }
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
          {t('resume.references.title', 'References')}
        </h3>
      </div>

      {references.map((reference, index) => (
        <div 
          key={index} 
          className={`grid grid-cols-2 gap-3 p-4 rounded-xl ${
            darkMode 
              ? 'bg-gray-700/30' 
              : 'bg-white/50'
          } border ${
            darkMode 
              ? 'border-gray-600' 
              : 'border-purple-500/5'
          }`}
        >
          <div className="col-span-2">
            <RequiredLabel>{t('resume.references.name', 'Name')}</RequiredLabel>
            <input
              type="text"
              value={reference.name || ''}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className={inputClasses}
              placeholder={t('resume.references.name_placeholder', 'Reference Name')}
              required
              maxLength={100}
            />
          </div>

          <div className="col-span-2">
            <RequiredLabel>{t('resume.references.relation', 'Relation/Position')}</RequiredLabel>
            <input
              type="text"
              value={reference.relation || ''}
              onChange={(e) => handleChange(index, 'relation', e.target.value)}
              className={inputClasses}
              placeholder={t('resume.references.relation_placeholder', 'e.g., Former Manager, Professor')}
              required
              maxLength={50}
            />
          </div>

          <div>
            <OptionalLabel>{t('resume.references.phone', 'Phone')}</OptionalLabel>
            <input
              type="tel"
              value={reference.phone || ''}
              onChange={(e) => handleChange(index, 'phone', e.target.value)}
              className={inputClasses}
              placeholder={t('resume.references.phone_placeholder', 'Contact Number')}
              maxLength={20}
            />
          </div>

          <div>
          <RequiredLabel>{t('resume.references.email', 'Email')}</RequiredLabel>
            <input
              type="email"
              value={reference.email || ''}
              onChange={(e) => handleChange(index, 'email', e.target.value)}
              className={inputClasses}
              placeholder={t('resume.references.email_placeholder', 'Email Address')}
              maxLength={100}
            />
          </div>

          {references.length > 1 && (
            <div className="col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => removeReference(index)}
                className="text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                {t('common.remove', 'Remove')}
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addReference}
        className="w-full px-3 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
      >
        {t('resume.references.add_button', 'Add Another Reference')}
      </button>
    </div>
  );
};

export default Referrals;