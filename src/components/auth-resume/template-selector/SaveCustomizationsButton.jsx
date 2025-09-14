import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import API_BASE_URL from '../../../config'; // Adjust path as needed
import useAuthStore from '../../../stores/authStore'; // Adjust path as needed

const SaveCustomizationsButton = ({ 
  resumeId, 
  selectedTemplate, // IMPORTANT: Get the template directly as a prop
  customSettings, 
  isDarkMode = false,
  onSaveSuccess = () => {}
}) => {
  const { t, i18n } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();
  const logPayload = (payload) => {
    console.log('Saving customization with payload:', payload);
    console.log('Template being saved:', payload.template);
    console.log('Language being saved:', payload.language);
  };
  
  const handleSaveCustomizations = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Get current app language (strip any region code, e.g. 'en-US' -> 'en')
      const currentAppLang = i18n.language?.split('-')[0] || 'en';
      
      // Create the payload with the template from props and current app language
      const payload = {
        template: selectedTemplate, // Use the direct template prop
        accent_color: customSettings.accentColor || '#6366f1',
        font_family: customSettings.fontFamily || 'Helvetica, Arial, sans-serif',
        line_spacing: customSettings.lineSpacing || 1.5,
        headings_uppercase: customSettings.headingsUppercase || false,
        hide_skill_level: customSettings.hideSkillLevel || false,
        language: currentAppLang // Use the current app language
      };
      
      // Log what we're sending to help debug
      logPayload(payload);
      
      // Make an API call to update the resume customization
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}/customization`, {
        method: 'PUT', // or 'PATCH' depending on your API
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save customizations');
      }
      
      const data = await response.json();
      console.log('Saved customizations:', data);
      
      // Call the success callback
      onSaveSuccess(data);
      
      // Show a brief "Saved" message
      setError('✓ Customizations saved!');
      setTimeout(() => setError(null), 3000);
      
    } catch (err) {
      console.error('Error saving customizations:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="mb-4">
      <div className={`p-3 border rounded-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-300'}`}>
        <h4 className={`mb-1.5 text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('resume.customizer.saveCustomizations.title')}
        </h4>
        
        {/* Debug display to show what template and language are being saved */}
        <div className={`mb-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="mb-0.5">   {t('prod1.sections.current_template')} <strong>{selectedTemplate}</strong></p>
          <p> {t('prod1.sections.current_language')} <strong>{i18n.language?.split('-')[0] || 'en'}</strong></p>
        </div>
        
        <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('resume.customizer.saveCustomizations.description')}
        </p>
        
        {error && (
          <div className={`mb-2 text-xs ${error.startsWith('✓') ? 'text-green-500' : 'text-red-500'}`}>
            {error}
          </div>
        )}
        
        <button
          onClick={handleSaveCustomizations}
          disabled={isSaving}
          className={`w-full py-1.5 px-3 rounded-full text-xs font-medium transition-colors ${
            isSaving
              ? (isDarkMode ? 'bg-gray-700 cursor-wait' : 'bg-gray-300 cursor-wait') 
              : (isDarkMode ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-md' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-md hover:shadow-purple-500/20')
          } text-white`}
        >
          {isSaving 
            ? t('common.saving', 'Saving...') 
            : t('resume.customizer.saveCustomizations.title')
          }
        </button>
      </div>
    </div>
  );
};

export default SaveCustomizationsButton;