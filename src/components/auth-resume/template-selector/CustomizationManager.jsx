import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Eye, Share2, Info } from 'lucide-react';

const CustomizationManager = ({ 
  selectedTemplate,
  customSettings,
  isDarkMode,
  onUpdatePreview 
}) => {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleApplyChanges = () => {
    setIsUpdating(true);
    
    if (onUpdatePreview) {
      onUpdatePreview({
        template: selectedTemplate,
        customSettings: customSettings
      });
    }
    
    try {
      const currentDraft = JSON.parse(localStorage.getItem('cv_draft') || '{}');
      const updatedDraft = {
        ...currentDraft,
        customization: {
          template: selectedTemplate,
          accent_color: customSettings.accentColor,
          font_family: customSettings.fontFamily,
          line_spacing: customSettings.lineSpacing,
          headings_uppercase: customSettings.headingsUppercase,
          hide_skill_level: customSettings.hideSkillLevel
        }
      };
      
      localStorage.setItem('cv_draft', JSON.stringify(updatedDraft));
      console.log('✅ Customizations applied to draft');
      
    } catch (error) {
      console.error('❌ Failed to update draft:', error);
    }
    
    setTimeout(() => setIsUpdating(false), 500);
  };

  return (
    <div className={`p-3 border rounded-md ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-300'
    }`}>
      <h4 className={`text-xs font-medium mb-2 flex items-center ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <Eye className="w-3 h-3 mr-1" />
        {t('cloud.preview_apply', 'Preview & Apply')}
      </h4>

      <p className={`text-xs mb-3 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {t('cloud.changes_previewed_live', 'Your changes are previewed live. Apply them to update your CV.')}
      </p>

      <button
        onClick={handleApplyChanges}
        disabled={isUpdating}
        className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center mb-3 ${
          isUpdating
            ? 'bg-gray-400 cursor-not-allowed text-gray-600'
            : isDarkMode
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/20 text-white'
        }`}
      >
        {isUpdating ? (
          <>
            <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
            {t('common.applying', 'Applying...')}
          </>
        ) : (
          <>
            <RefreshCw className="w-3 h-3 mr-2" />
            {t('cloud.apply_customizations', 'Apply Customizations')}
          </>
        )}
      </button>

      <div className={`p-2 rounded border text-xs ${
        isDarkMode
          ? 'bg-blue-900/20 border-blue-700 text-blue-300'
          : 'bg-blue-50 border-blue-200 text-blue-700'
      }`}>
        <div className="flex items-start">
          <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">{t('cloud.how_it_works', 'How it works')}:</p>
            <ul className="space-y-1 text-[0.65rem] opacity-90">
              <li>• {t('cloud.changes_previewed_instantly', 'Changes are previewed instantly')}</li>
              <li>• {t('cloud.click_apply_save', 'Click "Apply" to save to your CV')}</li>
              <li>• {t('cloud.use_publish_shareable', 'Use "Publish" to create shareable link')}</li>
              <li>• {t('cloud.published_links_styling', 'Published links include your styling')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationManager;