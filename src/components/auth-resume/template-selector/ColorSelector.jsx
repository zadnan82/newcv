import React from 'react';
import { useTranslation } from 'react-i18next';

export const ColorSelector = ({ value, onChange, isDarkMode }) => {
  const { t } = useTranslation();
  const colors = [
    '#000000', // Black
    '#6366f1', // Indigo (matching Home)
    '#8b5cf6', // Violet (matching Home)
    '#ec4899', // Pink (matching Home)
    '#3b82f6', // Blue (matching Home)
    '#2e4053', // Dark Gray
    '#10b981', // Emerald
    '#f97316', // Orange
    '#5d6d7e', // Medium Gray
    '#ef4444'  // Red
  ];
  
  return (
    <div className="mb-3">
      <h4 className={`mb-1.5 text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {t('resume.customizer.color.title')}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {colors.map(color => (
          <div
            key={color}
            onClick={() => onChange(color)}
            className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-sm"
            style={{
              backgroundColor: color,
              border: `2px solid ${value === color ? (isDarkMode ? '#8b5cf6' : '#6366f1') : 'transparent'}`,
              transform: value === color ? 'scale(1.1)' : 'scale(1)',
            }}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;