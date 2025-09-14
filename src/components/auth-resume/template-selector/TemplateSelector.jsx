import React from 'react';
import { useTranslation } from 'react-i18next';
import { templates } from '../web-templates/registry';

// Helper function to handle image paths in development and production
const getImageUrl = (path) => {
  if (!path) return '';
  
  // For development, we might need to adjust the path further
  // but for this implementation, we'll use the path as is since we're using absolute paths
  return path;
};

const TemplateSelector = ({ 
  selectedTemplate, 
  onSelectTemplate, 
  isDarkMode = false 
}) => {
  const { t } = useTranslation();
  const templatesList = Object.entries(templates);
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('resume.customizer.templates.title')}
        </h4>
        
        <div className={`text-xs ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          {templates[selectedTemplate]?.name || ''}
        </div>
      </div>
      
      {/* Template grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {templatesList.map(([id, template]) => (
          <div
            key={id}
            className={`cursor-pointer rounded-md overflow-hidden transition-all duration-200
              ${selectedTemplate === id
                ? (isDarkMode 
                    ? 'ring-2 ring-purple-500 transform scale-[1.02]' 
                    : 'ring-2 ring-purple-500 transform scale-[1.02]')
                : 'hover:shadow-sm'}
            `}
            onClick={() => onSelectTemplate(id)}
          >
            <div 
              className="w-full h-28 bg-cover bg-center" 
              style={{ 
                backgroundImage: template.previewImage ? `url(${getImageUrl(template.previewImage)})` : 'none',
                backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
              }}
            >
              {/* Overlay for selected template */}
              {selectedTemplate === id && (
                <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                  <div className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium px-2 py-0.5 rounded-full`}>
                    {t('resume.customizer.templates.selected')}
                  </div>
                </div>
              )}
            </div>
            
            <div className={`p-1.5 ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm border-t border-gray-200'}`}>
              <div className={`text-xs font-medium 
                ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
              >
                {template.name}
              </div>
              
              <div className="flex justify-end mt-0.5">
                {selectedTemplate === id && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-3 w-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show message if no templates available */}
      {templatesList.length === 0 && (
        <div className={`text-center py-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {t('resume.customizer.templates.noTemplatesFound')}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;