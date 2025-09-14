import React from 'react';
import { useTranslation } from 'react-i18next';

const SaveConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onContinue, 
  isDarkMode 
}) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop/overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className={`relative z-10 p-4 rounded-lg shadow-xl max-w-sm w-full mx-4 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white/90 backdrop-blur-sm text-gray-800'
      }`}>
        <h3 className="text-sm font-medium mb-3">
          {t('resume.customizer.saveCustomizations.title', 'Save Customizations')}
        </h3>
        
        <p className="mb-4 text-xs">
          {t('resume.customizer.saveCustomizations.message', 'Would you like to save your customizations before continuing?')}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {t('common.cancel', 'Cancel')}
          </button>
          
          <button
            onClick={onContinue}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-sm hover:shadow-purple-500/20'
            } text-white`}
          >
            {t('resume.customizer.saveCustomizations.continue', 'Continue Without Saving')}
          </button>
          
          <button
            onClick={onSave}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              isDarkMode 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-sm hover:shadow-purple-500/20'
            } text-white`}
          >
            {t('resume.customizer.saveCustomizations.save', 'Save & Continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmationModal;