// src/components/auth-resume/template-selector/ResumeCustomizer.jsx - Fixed Complete Version

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  
import { useTranslation } from 'react-i18next';
import { ChevronDown, FileText, Cloud, HardDrive, Calendar, User, RefreshCw, Search, Grid, List } from 'lucide-react';
import TemplateSelector from './TemplateSelector'; 
import TemplateRenderer from './TemplateRenderer';
import ColorSelector from './ColorSelector';
import FontSelector from './FontSelector';
import HeadersStyleSelector from './HeadersStyleSelector';
import SkillLevelToggle from './SkillLevelToggle';   
import useSessionStore from '../../../stores/sessionStore';  
import { exportToDocx } from '../view-cv/js/Exportdocx';
import SaveConfirmationModal from './SaveConfirmationModal';
import API_BASE_URL from '../../../config';
import PublicCVManager from './PublicCVManager';
import CustomizationManager from './CustomizationManager'; 

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return windowSize;
};

const addGlobalStyles = () => {
  const styleId = 'resume-customizer-animations';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.innerHTML = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fade-out {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(10px); }
      }
      
      .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
      }
      
      .animate-fade-out {
        animation: fade-out 0.3s ease-in forwards;
      }
    `;
    document.head.appendChild(styleElement);
  }
}; 
addGlobalStyles();

// Enhanced CV Selection Modal (Inline since import might be failing)
const CVSelectionModal = ({ 
  isOpen, 
  onClose, 
  availableCVs, 
  selectedCV, 
  onSelectCV, 
  isLoading, 
  onRefresh,
  isDarkMode
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
 
       const  title= t('cloud.select_cv_to_customize');  
       const subtitle= t('cloud.choose_cv_to_customize'); 
  if (!isOpen) return null;

  const groupedCVs = availableCVs.reduce((groups, cv) => {
    const source = cv.source;
    if (!groups[source]) groups[source] = [];
    groups[source].push(cv);
    return groups;
  }, {});

  const filteredGroupedCVs = {};
  Object.keys(groupedCVs).forEach(source => {
    const filtered = groupedCVs[source].filter(cv => 
      (cv.title || cv.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cv.personal_info?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      filteredGroupedCVs[source] = filtered;
    }
  });

   
const getSourceLabel = (source, provider = null) => {
  switch (source) {
    case 'draft': return t('cloud.current_work_session');
    case 'local': return t('cloud.saved_locally');
    case 'cloud': 
      // Show specific provider for cloud CVs
      if (provider === 'onedrive') {
        return t('cloud.onedrive') || 'OneDrive';
      } else if (provider === 'google_drive') {
        return t('cloud.google_drive') || 'Google Drive';
      } else if (provider === 'dropbox') {
        return t('cloud.dropbox') || 'Dropbox';
      } else {
        return t('cloud.cloud_storage') || 'Cloud Storage';
      }
    case 'api': return t('cloud.my_saved_cvs');
    default: return t('cloud.unknown_source');
  }
};

// 2. UPDATE the getSourceIcon function to support multiple providers:
const getSourceIcon = (source, provider = null) => {
  switch (source) {
    case 'draft': return <FileText className="w-4 h-4 text-purple-500" />;
    case 'local': return <HardDrive className="w-4 h-4 text-green-500" />;
    case 'cloud': 
      // Different icons for different providers
      if (provider === 'onedrive') {
        return <Cloud className="w-4 h-4 text-purple-500" />; // Purple for OneDrive
      } else if (provider === 'google_drive') {
        return <Cloud className="w-4 h-4 text-blue-500" />; // Blue for Google Drive
        } else if (provider === 'dropbox') {
        return <Cloud className="w-4 h-4 text-yellow-500" />; // Blue for Google Drive
      } else {
        return <Cloud className="w-4 h-4 text-blue-500" />; // Default blue
      }
    case 'api': return <User className="w-4 h-4 text-orange-500" />;
    default: return <FileText className="w-4 h-4 text-gray-500" />;
  }
};
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getCVPreview = (cv) => {
    const name = cv.personal_info?.full_name || cv.content?.personal_info?.full_name || t('cloud.no_name');
    const title = cv.personal_info?.title || cv.content?.personal_info?.title || '';
    const email = cv.personal_info?.email || cv.content?.personal_info?.email || '';
    
    return { name, title, email };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl max-h-[80vh] rounded-2xl ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      } shadow-2xl flex flex-col`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {subtitle}. {t('cloud.found_cvs', { count: availableCVs.length })}.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={t('common.refresh')}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder={t('cloud.search_cv_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            
            <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' 
                  ? 'bg-purple-500 text-white' 
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' 
                  ? 'bg-purple-500 text-white' 
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CVs List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t('common.loading')}...</p>
              </div>
            </div>
          ) : Object.keys(filteredGroupedCVs).length === 0 ? (
            <div className="text-center py-12">
              <FileText className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {searchTerm ? t('cloud.no_cvs_match_search') : t('cloud.no_cvs_found')}
              </p>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {searchTerm ? t('cloud.try_different_search') : t('cloud.create_cv_first')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(filteredGroupedCVs).map(([source, cvs]) => (
                <div key={source}>
                  <div className="flex items-center gap-2 mb-3">
                    {getSourceIcon(source)}
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {getSourceLabel(source)}
                    </h3>
                    {/* <span className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {cvs.length} {t('cloud.cvs_count', { count: cvs.length } )}
                    </span> */}
                  </div>

                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' 
                    : 'space-y-2'
                  }>
                    {cvs.map((cv, index) => {
                      const preview = getCVPreview(cv);
                      const isSelected = selectedCV?.id === cv.id && selectedCV?.source === cv.source;
                      
                      return (
                        <button
                          key={`${cv.source}-${cv.id || index}`}
                          onClick={() => onSelectCV(cv)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : isDarkMode
                              ? 'border-gray-700 bg-gray-750 hover:border-gray-600 hover:bg-gray-700'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium truncate ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {cv.title || cv.name || t('cloud.cv_number', { number: index + 1 })}
                              </h4>
                              {preview.name && (
                                <p className={`text-sm truncate ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {preview.name}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <div className="ml-2">
                                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>

                         <div className="space-y-1">
  {preview.title && (
    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {preview.title}
    </p>
  )}
  
  <div className="flex items-center justify-between text-xs">
    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
      {source === 'cloud' && cv.modifiedTime && (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(cv.modifiedTime)}
        </div>
      )}
      {source === 'draft' && t('cloud.current_editing_session')}
      {source === 'local' && t('cloud.saved_on_device')}
      {source === 'api' && `ID: ${cv.id}`}
    </span>
    
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
      source === 'cloud' && cv.provider === 'onedrive' 
        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
      source === 'cloud' && cv.provider === 'google_drive' 
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
          source === 'cloud' && cv.provider === 'dropbox' 
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
      source === 'cloud' 
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
      source === 'draft' 
        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
      source === 'local' 
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    }`}>
      {getSourceIcon(source, cv.provider)}
      <span className="ml-1">
        {source === 'cloud' && cv.provider === 'onedrive' ? 'OneDrive' :
         source === 'cloud' && cv.provider === 'google_drive' ? 'Google Drive' :
         source === 'cloud' && cv.provider === 'dropbox' ? 'Dropbox' :
         source === 'cloud' ? t('cloud.cloud') : 
         source === 'draft' ? t('cloud.draft') : 
         source === 'local' ? t('cloud.local') : 
         t('cloud.saved')}
      </span>
    </div>
  </div>
</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
  {selectedCV ? (
    <>
      {t('cloud.selected')}: <strong>{selectedCV.title || selectedCV.name || t('common.untitled')}</strong>
      {' '}{t('cloud.from')}{' '}
      <strong>
        {selectedCV.source === 'cloud' && selectedCV.provider 
          ? getSourceLabel(selectedCV.source, selectedCV.provider)
          : getSourceLabel(selectedCV.source)
        }
      </strong>
    </>
  ) : (
    t('cloud.no_cv_selected')
  )}
</p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={onClose}
                disabled={!selectedCV}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCV
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {t('cloud.select_this_cv')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact CV Selector
const CompactCVSelector = ({ 
  selectedCV, 
  availableCVs,
  onOpenModal, 
  isDarkMode 
}) => {
  const { t } = useTranslation();

  const getSourceIcon = (source, provider = null) => {
    switch (source) {
      case 'draft': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'local': return <HardDrive className="w-4 h-4 text-green-500" />;
      case 'cloud': 
        if (provider === 'onedrive') {
          return <Cloud className="w-4 h-4 text-purple-500" />;
        } else if (provider === 'google_drive') {
          return <Cloud className="w-4 h-4 text-blue-500" />;
           } else if (provider === 'dropbox') {
          return <Cloud className="w-4 h-4 text-blue-500" />;
        } else {
          return <Cloud className="w-4 h-4 text-blue-500" />;
        }
      case 'api': return <User className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceLabel = (source, provider = null) => {
    switch (source) {
      case 'draft': return t('cloud.draft');
      case 'local': return t('cloud.local');
      case 'cloud': 
        if (provider === 'onedrive') {
          return 'OneDrive';
        } else if (provider === 'google_drive') {
          return 'Google Drive';
           } else if (provider === 'dropbox') {
          return 'Dropbox';
        } else {
          return t('cloud.cloud');
        }
      case 'api': return t('cloud.saved');
      default: return t('cloud.unknown_source');
    }
  };

  if (!selectedCV) {
    return (
      <button
        onClick={onOpenModal}
        className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <FileText className="w-4 h-4 mr-2" />
        <span className="text-sm">{t('cloud.select_cv')} ({availableCVs.length} {t('cloud.available')})</span>
      </button>
    );
  }

  return (
    <button
      onClick={onOpenModal}
      className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors min-w-0 max-w-xs ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' 
          : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center min-w-0">
        {getSourceIcon(selectedCV.source, selectedCV.provider)}
        <div className="ml-2 min-w-0">
          <div className="text-sm font-medium truncate">
            {selectedCV.title || selectedCV.name || t('common.untitled')}
          </div>
          {/* Show provider info for cloud CVs */}
          {selectedCV.source === 'cloud' && selectedCV.provider && (
            <div className="text-xs text-gray-500 truncate">
              {getSourceLabel(selectedCV.source, selectedCV.provider)}
            </div>
          )}
        </div>
      </div>
      <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
    </button>
  );
};

export const ResumeCustomizer = ({ darkMode = false, formData: propFormData }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate(); 
  const resumeId = location.state?.resumeId; 
  
  // Stores 
  const { currentResume, loading, fetchResume } = useSessionStore();  
  const { 
  listGoogleDriveCVs,
  loadGoogleDriveCV,
  canSaveToCloud,
  sessionToken,
  // ADD THESE for multi-provider support:
  listAllCloudCVs,        // Lists from all connected providers
  listCVsFromProvider,    // Lists from specific provider
  loadCVFromProvider,     // Loads from specific provider
  connectedProviders,     // Array of connected providers
  getProviderStatus       // Get status of specific provider
} = useSessionStore();
  
  const { width } = useWindowSize();
  const isMobile = width < 768;  
  const [resumeData, setResumeData] = useState(null);
  const [availableCVs, setAvailableCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [isLoadingCVs, setIsLoadingCVs] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('stockholm');
  const [customSettings, setCustomSettings] = useState({
    accentColor: '#6366f1',
    fontFamily: 'Helvetica, Arial, sans-serif',
    lineSpacing: 1.5,
    headingsUppercase: false,
    hideSkillLevel: false
  });
  const [previewScale, setPreviewScale] = useState(isMobile ? 0.5 : 0.7);
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);  
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [activeTab, setActiveTab] = useState('templates');
  const resumeRef = useRef(null); 
  const isDarkMode = darkMode;
  const isRTL = i18n.dir() === 'rtl';
  
  // Helper function to apply customization settings
  const applyCustomizationSettings = (data) => {
    if (data && data.customization) {
      setSelectedTemplate(data.customization.template || 'stockholm');
      setCustomSettings({
        accentColor: data.customization.accent_color || '#6366f1',
        fontFamily: data.customization.font_family || 'Helvetica, Arial, sans-serif',
        lineSpacing: data.customization.line_spacing || 1.5,
        headingsUppercase: data.customization.headings_uppercase || false,
        hideSkillLevel: data.customization.hide_skill_level || false
      });
    }
  };



  const detectCVProvider = (cv) => {
  // Check if CV has provider metadata
  if (cv._metadata?.provider) {
    return cv._metadata.provider;
  }
  
  // Check if CV has original provider info
  if (cv._original_provider) {
    return cv._original_provider;
  }
  
  // Check source type with enhanced Dropbox detection
  if (cv.source === 'cloud' && cv.cloudFile) {
    // Enhanced provider detection
    if (cv.cloudFile.provider) {
      return cv.cloudFile.provider;
    }
    
    // File ID pattern detection for Dropbox
    if (cv.cloudFile.file_id && cv.cloudFile.file_id.startsWith('id:')) {
      return 'dropbox';
    }
    
    // File name pattern for Dropbox
    if (cv.cloudFile.name && cv.cloudFile.name.includes('.dropbox')) {
      return 'dropbox';
    }
  }
  
  return 'google_drive'; // Default fallback
};

// Helper to load CV content based on provider
// Helper to load CV content based on provider - MAKE DROPBOX LIKE OTHERS
const loadCVContentByProvider = async (file, provider = null) => {
  try {
    console.log(`📥 Loading CV content:`, {
      name: file.name,
      id: file.file_id,
      provider: provider || 'auto-detect'
    });
    
    // Use the session store methods for ALL providers
    const storeState = useSessionStore.getState();
    
    // METHOD 1: First try using the generic provider method (like Google Drive/OneDrive)
    if (storeState.loadCVFromProvider) {
      console.log(`🔄 Using loadCVFromProvider for ${provider}`);
      const fileContent = await storeState.loadCVFromProvider(provider, file.file_id);
      console.log(`✅ Successfully loaded via loadCVFromProvider:`, {
        hasContent: !!fileContent,
        provider: provider
      });
      return { fileContent, provider };
    }
    
    // METHOD 2: If generic method not available, use specific methods
    console.log(`🔄 Using specific method for ${provider}`);
    
    if (provider === 'google_drive') {
      const fileContent = await loadGoogleDriveCV(file.file_id);
      return { fileContent, provider };
      
    } else if (provider === 'onedrive') {
      // Use the same approach as Google Drive
      const fileContent = await loadOneDriveCVDirect(file.file_id);
      return { fileContent, provider };
      
    } else if (provider === 'dropbox') {
      // MAKE DROPBOX WORK EXACTLY LIKE ONEDRIVE
      const fileContent = await loadDropboxCV(file.file_id);
      return { fileContent, provider };
      
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
  } catch (error) {
    console.error(`❌ Failed to load CV content from ${provider}:`, error);
    throw error;
  }
};


const loadDropboxCV = async (fileId) => {
  try {
    console.log('📄 Loading Dropbox CV like OneDrive...');
    
    const token = sessionToken || useSessionStore.getState().sessionToken;
    
    if (!token) {
      throw new Error('No session token found');
    }
    
    // Clean the fileId like other providers do
    let cleanFileId = fileId;
    if (cleanFileId.startsWith('/')) {
      cleanFileId = cleanFileId.substring(1);
    }
    
    const encodedFileId = encodeURIComponent(cleanFileId);
    
    const response = await fetch(`http://localhost:8000/api/dropbox/load/${encodedFileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Dropbox API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Dropbox API error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    // CRITICAL: Return the EXACT SAME structure as Google Drive/OneDrive
    console.log('🔍 Dropbox raw result:', result);
    
    if (result.success && result.cv_data) {
      console.log('✅ Dropbox CV loaded successfully - returning cv_data directly');
      // Return the cv_data directly, just like other providers
      return result.cv_data;
    } else {
      console.error('❌ Dropbox response format unexpected:', result);
      throw new Error(result.error || 'Unexpected response format from Dropbox');
    }
  } catch (error) {
    console.error('❌ Dropbox load failed:', error);
    throw error;
  }
};

// Direct OneDrive loading function for ResumeCustomizer
const loadOneDriveCVDirect = async (fileId) => {
  try {
    const token = sessionToken || useSessionStore.getState().sessionToken;
    
    if (!token) {
      throw new Error('No session token available');
    }
    
    const response = await fetch(`http://localhost:8000/api/onedrive/load/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const result = await response.json();
    
    // RETURN THE SAME STRUCTURE AS DROPBOX
    if (result.success && result.cv_data) {
      return result.cv_data; // Return cv_data directly
    } else {
      throw new Error(result.error || 'Failed to load CV from OneDrive');
    }
  } catch (error) {
    console.error('❌ OneDrive direct load failed:', error);
    throw error;
  }
};


const loadAvailableCVs = async () => {
  setIsLoadingCVs(true);
  const cvs = [];

  try {
    console.log('🔍 Loading available CVs from all sources...');

    // 1. Check for draft from NewResumeBuilder (unchanged)
    const draftData = localStorage.getItem('cv_draft_for_customization');
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData);
        console.log('📝 Found draft from CV builder:', parsed.title || 'Untitled');
        
        const hasContent = parsed.personal_info?.full_name || 
                          (parsed.experiences && parsed.experiences.length > 0) ||
                          (parsed.educations && parsed.educations.length > 0) ||
                          (parsed.skills && parsed.skills.length > 0);
        
        if (hasContent) {
          cvs.push({
            id: 'draft-customization',
            source: 'draft',
            title: parsed.title || t('cloud.draft_from_builder'),
            name: t('cloud.current_editing_session'),
            content: parsed,
            personal_info: parsed.personal_info,
            priority: 1
          });
          console.log('✅ Added draft CV with content');
        }
      } catch (error) {
        console.error('Error parsing draft data:', error);
      }
    }

    // 2. Check for local CVs (unchanged)
    const localStorageKeys = [
      'cv_draft',
      'resumeFormData',
      'local_cvs'
    ];

    for (const key of localStorageKeys.slice(0, 2)) {
      const localCV = localStorage.getItem(key);
      if (localCV) {
        try {
          const parsed = JSON.parse(localCV);
          console.log('💾 Found local CV from key:', key, 'Title:', parsed.title || 'Untitled');
          
          const hasContent = parsed.personal_info?.full_name || 
                            (parsed.experiences && parsed.experiences.length > 0) ||
                            (parsed.educations && parsed.educations.length > 0) ||
                            (parsed.skills && parsed.skills.length > 0);
          
          if (hasContent) {
            const isDuplicate = cvs.some(existingCV => 
              existingCV.source === 'draft' && 
              existingCV.content?.personal_info?.full_name === parsed.personal_info?.full_name
            );
            
            if (!isDuplicate) {
              cvs.push({
                id: `local-draft-${Date.now()}`,
                source: 'local',
                title: parsed.title || t('cloud.local_draft'),
                name: t('cloud.saved_on_device'),
                content: parsed,
                personal_info: parsed.personal_info,
                priority: 3,
                storageKey: key
              });
              
              console.log('✅ Added local CV with content');
              break;
            }
          }
        } catch (error) {
          console.error('Error parsing local CV from key:', key, error);
        }
      }
    }

    // 3. Load from ALL connected cloud providers - UPDATED SECTION
    // 3. Load from ALL connected cloud providers - SIMPLIFIED VERSION
if (canSaveToCloud()) {
  try {
    console.log('☁️ Loading CVs from all connected cloud providers...');
    
    const storeState = useSessionStore.getState();
    const providers = storeState.connectedProviders || [];
    
    console.log('☁️ Connected providers:', providers);
    
    for (const provider of providers) {
      try {
        console.log(`☁️ Loading CVs from ${provider}...`);
        
        let cloudFiles;
        
        // USE THE SAME PATTERN FOR ALL PROVIDERS
        if (storeState.listCVsFromProvider) {
          cloudFiles = await storeState.listCVsFromProvider(provider);
        } else {
          // Fallback for individual methods
          if (provider === 'google_drive') {
            cloudFiles = await listGoogleDriveCVs();
          } else {
            console.warn(`⚠️ No list method available for ${provider}`);
            continue;
          }
        }
        
        console.log(`📁 Found ${cloudFiles?.length || 0} files from ${provider}`);
        
        if (cloudFiles && Array.isArray(cloudFiles)) {
          for (const file of cloudFiles) {
            try {
              // USE THE SAME LOADING METHOD FOR ALL PROVIDERS
              const { fileContent } = await loadCVContentByProvider(file, provider);
              
              if (!fileContent) {
                console.log(`⚠️ Skipping empty file from ${provider}: ${file.name}`);
                continue;
              }
              
              // USE THE SAME STRUCTURE FOR ALL PROVIDERS
              cvs.push({
                id: file.file_id,
                source: 'cloud',
                title: file.name?.replace('.json', '') || `CV from ${provider}`,
                name: file.name || 'Untitled',
                content: fileContent, // Use the content directly
                modifiedTime: file.last_modified,
                personal_info: fileContent.personal_info,
                priority: 2,
                provider: provider,
                cloudFile: file
              });
              
              console.log(`✅ Added CV from ${provider}: ${file.name}`);
              
            } catch (fileError) {
              console.error(`❌ Error processing ${provider} file:`, fileError);
            }
          }
        }
      } catch (providerError) {
        console.error(`❌ Error loading from ${provider}:`, providerError);
      }
    }
  } catch (error) {
    console.error('❌ Error loading from cloud providers:', error);
  }
}
    // 4. Add current resume from API if exists (unchanged)
    if (currentResume && currentResume.id) {
      console.log('🌐 Found API resume:', currentResume.title || currentResume.id);
      
      const isDuplicate = cvs.some(cv => 
        cv.id === currentResume.id || 
        (cv.content?.personal_info?.full_name === currentResume.personal_info?.full_name &&
         cv.source !== 'api')
      );
      
      if (!isDuplicate) {
        cvs.push({
          id: currentResume.id,
          source: 'api',
          title: currentResume.title || t('cloud.resume_id', { id: currentResume.id }),
          name: t('cloud.from_database'),
          content: currentResume,
          personal_info: currentResume.personal_info,
          priority: 2
        });
        console.log('✅ Added API resume to list');
      } else {
        console.log('⚠️ API resume already exists in list, skipping duplicate');
      }
    }

    // Sort and finalize
    const validCVs = cvs.filter(cv => cv.content && typeof cv.content === 'object');
    validCVs.sort((a, b) => a.priority - b.priority);

    console.log(`✅ Loaded ${validCVs.length} valid CVs total from all sources`);
    
    // Enhanced debug log with provider info
    console.group('📋 Loaded CVs Summary');
    validCVs.forEach((cv, index) => {
      console.log(`CV ${index + 1}:`, {
        source: cv.source,
        provider: cv.provider || 'N/A',
        title: cv.title,
        id: cv.id,
        hasContent: !!cv.content,
        personalInfoName: cv.content?.personal_info?.full_name || 'No name'
      });
    });
    console.groupEnd();

    setAvailableCVs(validCVs);

    // Auto-select the highest priority CV if none selected
    if (validCVs.length > 0 && !selectedCV) {
      const priorityCV = validCVs.find(cv => cv.content);
      if (priorityCV) {
        console.log('🎯 Auto-selecting CV:', priorityCV.title, 'from', priorityCV.provider || priorityCV.source);
        handleSelectCV(priorityCV);
      }
    }

  } catch (error) {
    console.error('❌ Error loading available CVs:', error);
    setLocalError(t('cloud.failed_load_cvs'));
  } finally {
    setIsLoadingCVs(false);
  }
};

 
  // Handle CV selection - COMPLETE ENHANCED VERSION
const handleSelectCV = (cv) => {
   console.group('🔍 CV SELECTION DEBUG');
  console.log('📋 Selected CV:', cv);
  console.log('🏷️ Title:', cv.title);
  console.log('📦 Source:', cv.source);
  console.log('☁️ Provider:', cv.provider);
  console.log('🆔 ID:', cv.id);
  console.log('📊 Has content?', !!cv.content);
  console.log('📝 Content type:', typeof cv.content);
  
  if (cv.content) {
    console.log('Content keys:', Object.keys(cv.content));
    console.log('Personal info:', cv.content.personal_info);
    console.log('Sections count:', {
      experiences: cv.content.experiences?.length || 0,
      educations: cv.content.educations?.length || 0,
      skills: cv.content.skills?.length || 0,
      languages: cv.content.languages?.length || 0,
      hobbies: cv.content.hobbies?.length || 0,
      courses: cv.content.courses?.length || 0
    });
    
    // Check for empty sections
    const emptySections = [];
    const sections = ['experiences', 'educations', 'skills', 'languages', 'hobbies', 'courses', 'internships', 'referrals', 'custom_sections', 'extracurriculars'];
    sections.forEach(section => {
      if (!cv.content[section] || cv.content[section].length === 0) {
        emptySections.push(section);
      }
    });
    
    if (emptySections.length > 0) {
      console.log('Empty sections:', emptySections);
    }
    
    // Check personal info completeness
    const personalInfo = cv.content.personal_info || {};
    const personalInfoFields = ['full_name', 'email', 'mobile', 'address', 'title', 'summary'];
    const filledPersonalFields = personalInfoFields.filter(field => personalInfo[field] && personalInfo[field].trim() !== '');
    const emptyPersonalFields = personalInfoFields.filter(field => !personalInfo[field] || personalInfo[field].trim() === '');
    
    console.log('Personal info completeness:', {
      filled: filledPersonalFields,
      empty: emptyPersonalFields,
      completeness: `${filledPersonalFields.length}/${personalInfoFields.length} fields filled`
    });
    
    // Check customization data
    if (cv.content.customization) {
      console.log('Has customization settings:', cv.content.customization);
    } else {
      console.log('No customization settings found');
    }
    
    // Storage info for local CVs
    if (cv.source === 'local' && cv.storageKey) {
      console.log('Local storage info:', {
        storageKey: cv.storageKey,
        rawData: localStorage.getItem(cv.storageKey) ? 'Found' : 'Not found'
      });
    }
  } else {
    console.error('❌ CV has no content!');
  }
  console.groupEnd();
  
  // Validate CV content before proceeding
  if (!cv.content || typeof cv.content !== 'object') {
    console.error('❌ Invalid CV content structure');
    setLocalError('Selected CV has invalid or missing content. Please try another CV.');
    return;
  }
  
  // Check if CV is completely empty
  const hasAnyContent = cv.content.personal_info?.full_name ||
                       (cv.content.experiences && cv.content.experiences.length > 0) ||
                       (cv.content.educations && cv.content.educations.length > 0) ||
                       (cv.content.skills && cv.content.skills.length > 0) ||
                       (cv.content.languages && cv.content.languages.length > 0) ||
                       (cv.content.hobbies && cv.content.hobbies.length > 0) ||
                       (cv.content.courses && cv.content.courses.length > 0);
  
  if (!hasAnyContent) {
    console.warn('⚠️ CV appears to be completely empty');
    setLocalError('Selected CV appears to be empty. Please check the CV content or try another CV.');
    setShowCVModal(true); // Keep modal open
    return;
  }
  
  // Set the selected CV and resume data
  setSelectedCV(cv);
  setResumeData(cv.content);
  
  // Apply customization settings if they exist
  try {
    applyCustomizationSettings(cv.content);
    console.log('✅ Applied customization settings successfully');
  } catch (error) {
    console.error('❌ Error applying customization settings:', error);
    // Don't fail the whole selection for customization errors
  }
  
  // Clear any previous errors and close modal
  setLocalError(null);
  setShowCVModal(false);
  
  console.log('✅ CV selection completed successfully');
};
 
  // Enhanced initialization
  useEffect(() => {
    console.log('🔧 ResumeCustomizer: Initializing with enhanced CV selection...');
    
    const initializeData = async () => {
      if (resumeId) {
        // If we have a resumeId, fetch from API first
        console.log('📋 Fetching resume with ID:', resumeId);
        try {
          await fetchResume(resumeId);
        } catch (error) {
          console.error('❌ Failed to fetch from API:', error);
        }
      }
      
      // Always load available CVs for selection
      await loadAvailableCVs();
    };
    
    initializeData();
  }, [resumeId, fetchResume]);

  // Apply settings when currentResume is loaded
  useEffect(() => {
    if (currentResume && !resumeData) {
      const apiCV = {
        id: currentResume.id,
        source: 'api',
        title: currentResume.title || t('cloud.resume_id', { id: currentResume.id }),
        name: t('cloud.from_database'),
        content: currentResume,
        personal_info: currentResume.personal_info
      };
      handleSelectCV(apiCV);
    }
  }, [currentResume, resumeData, t]);
  
  useEffect(() => {
    setSidebarVisible(!isMobile);
  }, [isMobile]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) { 
        useSessionStore.setState(state => ({
          ...state,
          loading: false
        }));
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading]);

  const updateSetting = (key, value) => {
    setCustomSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
 
  const zoomIn = () => {
    setPreviewScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const zoomOut = () => {
    setPreviewScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleExport = (format) => {
    setPendingAction(format);
    setShowSaveConfirmation(true);
  };

  // Enhanced save function
  const handleSaveAndContinue = async () => {
    try {
      setIsExporting(true);
      console.log('💾 Saving customizations...');
      
      const updatedData = {
        ...resumeData,
        customization: {
          template: selectedTemplate,
          accent_color: customSettings.accentColor,
          font_family: customSettings.fontFamily,
          line_spacing: customSettings.lineSpacing,
          headings_uppercase: customSettings.headingsUppercase,
          hide_skill_level: customSettings.hideSkillLevel
        }
      };

      let saveSuccess = false;
      let saveMessage = '';

      // Try to save locally
      try {
        console.log('💾 Saving locally...');
        localStorage.setItem('cv_draft', JSON.stringify(updatedData));
        saveSuccess = true;
        saveMessage = t('cloud.customizations_saved_locally');
      } catch (localError) {
        console.error('❌ Local save failed:', localError);
        throw new Error(t('cloud.failed_save_customizations'));
      }

      // If we have a resumeId, also try to save via API
      if (resumeId && token) {
        try {
          console.log('🌐 Saving customizations via API...');
          const url = `${API_BASE_URL}/resume/${resumeId}/customization`;
          
          const customizationData = {
            template: selectedTemplate,
            accent_color: customSettings.accentColor || '#6366f1',
            font_family: customSettings.fontFamily || 'Helvetica, Arial, sans-serif',
            line_spacing: customSettings.lineSpacing || 1.5,
            headings_uppercase: customSettings.headingsUppercase || false,
            hide_skill_level: customSettings.hideSkillLevel || false
          };
          
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(customizationData)
          });
      
          if (!response.ok) {
            console.warn('⚠️ API save failed, but local save succeeded');
          }
        } catch (apiError) {
          console.warn('⚠️ API save failed, but local save succeeded:', apiError);
        }
      }
      
      // Success notification
      const successToast = document.createElement('div');
      successToast.className = `fixed bottom-4 ${isRTL ? 'left-4' : 'right-4'} p-4 rounded-md ${isDarkMode ? 'bg-green-800' : 'bg-green-600'} text-white shadow-lg z-50 animate-fade-in`;
      successToast.innerHTML = '✓ ' + saveMessage;
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        successToast.classList.add('animate-fade-out');
        setTimeout(() => document.body.removeChild(successToast), 500);
      }, 3000);
      
      // Close modal and continue
      setShowSaveConfirmation(false);
      continueWithAction();
    } catch (error) {
      console.error('❌ Error saving customizations:', error);
      alert(t('resume.customizer.saveCustomizations.error'));
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleContinueWithoutSaving = () => {
    setShowSaveConfirmation(false);
    continueWithAction();
  };
  
  const continueWithAction = () => {
    if (pendingAction === 'PDF') {
      navigate(`/resume/${currentResume?.id || 'preview'}`, { 
        state: { resumeData, customSettings, selectedTemplate } 
      });
    } else if (pendingAction === 'DOCX') {
      exportToDocx(resumeData || currentResume);
    }
    
    setPendingAction(null);
  };

  const handleBackToNewResumeBuilder = () => {
    console.log('🔙 Returning to NewResumeBuilder...');
    
    const updatedData = {
      ...resumeData,
      customization: {
        template: selectedTemplate,
        accent_color: customSettings.accentColor,
        font_family: customSettings.fontFamily,
        line_spacing: customSettings.lineSpacing,
        headings_uppercase: customSettings.headingsUppercase,
        hide_skill_level: customSettings.hideSkillLevel
      }
    };
    
    localStorage.setItem('cv_draft', JSON.stringify(updatedData));
    localStorage.removeItem('cv_draft_for_customization');
    navigate('/new-resume');
  };
     
  if (loading || isLoadingCVs) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-black'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent mb-3"></div>
          <p className="text-sm">
            {isLoadingCVs ? t('cloud.searching_cvs') : t('resume.customizer.loading')}
          </p>
        </div>
      </div>
    );
  }
    
  if (localError) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-black'}`}>
        <div className={`text-center max-w-md p-5 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
          <div className={`mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full ${isDarkMode ? 'bg-red-900' : 'bg-red-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-2">{t('common.error')}</h2>
          <p className="mb-4 text-sm">{localError}</p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={handleBackToNewResumeBuilder}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {t('cloud.back_to_cv_builder')}
            </button>
            <button 
              onClick={() => navigate('/my-resumes')}
              className="px-4 py-1.5 rounded-full bg-gray-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {t('resume.customizer.goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show CV selection immediately if no CV data and we have CVs available
  if (!resumeData && availableCVs.length > 0 && !showCVModal) {
    setShowCVModal(true);
  }
    
  if (!resumeData && availableCVs.length === 0) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-black'}`}>
        <div className={`text-center max-w-md p-5 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
          <div className={`mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-2">{t('cloud.no_cvs_found')}</h2>
          <p className="mb-4 text-sm">{t('cloud.create_cv_to_customize')}</p>
          <button 
            onClick={() => navigate('/new-resume')}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {t('cloud.create_new_cv')}
          </button>
        </div>
      </div>
    );
  }
   
  return (
    <>
      <div 
        className={`flex flex-col h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Background Elements */}
        {!isDarkMode && (
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          </div>
        )}
           
<header className={`relative z-10 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
  {/* Mobile Header */}
  <div className="block md:hidden">
    <div className="flex items-center justify-between p-4">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
          aria-label="Toggle sidebar"
        >
          {sidebarVisible ? (
            <i className="fas fa-times text-lg"></i>
          ) : (
            <i className="fas fa-bars text-lg"></i>
          )}
        </button>
        <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('resume.customizer.title') || 'Resume Studio'}
        </h1>
      </div>

      {/* Right: Export Actions */}
      <div className="flex items-center gap-2">
        <button
          className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center"
          onClick={() => handleExport('DOCX')}
          disabled={isExporting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          DOCX
        </button>
        
        <button
          className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center"
          onClick={() => handleExport('PDF')}
          disabled={isExporting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF
        </button>
      </div>
    </div>

    {/* Mobile CV Selector Row with Preview Controls */}
    <div className="px-4 pb-4">
      <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CompactCVSelector
              selectedCV={selectedCV}
              availableCVs={availableCVs}
              onOpenModal={() => setShowCVModal(true)}
              isDarkMode={isDarkMode}
            />
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            {/* Preview Controls */}
            <div className={`inline-flex items-center rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} overflow-hidden`}>
              <button 
                onClick={zoomOut}
                className={`p-2 ${isDarkMode ? 'hover:bg-gray-600 text-gray-300 bg-gray-700' : 'hover:bg-gray-100 text-gray-700 bg-white'} transition-colors border-r ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                disabled={previewScale <= 0.5}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
              <div className={`px-3 py-2 text-xs font-medium flex items-center justify-center min-w-[50px] ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'}`}>
                {Math.round(previewScale * 100)}%
              </div>
              <button 
                onClick={zoomIn}
                className={`p-2 ${isDarkMode ? 'hover:bg-gray-600 text-gray-300 bg-gray-700' : 'hover:bg-gray-100 text-gray-700 bg-white'} transition-colors border-l ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                disabled={previewScale >= 1.5}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
            </div>

            {availableCVs.length > 1 && (
              <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                {availableCVs.length} CVs
              </span>
            )}
            <button
              onClick={loadAvailableCVs}
              disabled={isLoadingCVs}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
              } border`}
              title={t('cloud.refresh_cv_list')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={isLoadingCVs ? 'animate-spin' : ''}>
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Desktop Header */}
  <div className="hidden md:block">
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className={`p-2.5 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            aria-label="Toggle sidebar"
          >
            {sidebarVisible ? (
              <i className="fas fa-times text-lg"></i>
            ) : (
              <i className="fas fa-bars text-lg"></i>
            )}
          </button>
          
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Export Actions */}
          <div className="flex items-center gap-3">
           
            <button
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center transform hover:scale-105"
              onClick={() => handleExport('DOCX')}
              disabled={isExporting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
                DOCX
            </button>
            
            <button
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center transform hover:scale-105"
              onClick={() => handleExport('PDF')}
              disabled={isExporting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
             PDF
            </button>
          </div>
        </div>

        {/* Center Section - CV Selector */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'} shadow-inner`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                  <i className={`fas fa-file-alt ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <CompactCVSelector
                    selectedCV={selectedCV}
                    availableCVs={availableCVs}
                    onOpenModal={() => setShowCVModal(true)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                {availableCVs.length > 1 && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                    <i className={`fas fa-database text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {availableCVs.length} {t('cloud.available') || 'Available'}
                    </span>
                  </div>
                )}
                <button
                  onClick={loadAvailableCVs}
                  disabled={isLoadingCVs}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  } shadow-sm hover:shadow-md`}
                  title={t('cloud.refresh_cv_list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={isLoadingCVs ? 'animate-spin' : ''}>
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Preview Controls */}
        <div className="flex items-center gap-4">
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
          
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('CoverLetter.preview.title') || 'Preview'}:
            </span>
            <div className={`inline-flex items-center rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} overflow-hidden shadow-sm`}>
              <button 
                onClick={zoomOut}
                className={`px-4 py-2.5 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                disabled={previewScale <= 0.5}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
              <div className={`px-4 py-2.5 text-sm font-medium flex items-center justify-center min-w-[100px] ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                {Math.round(previewScale * 100)}%
              </div>
              <button 
                onClick={zoomIn}
                className={`px-4 py-2.5 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                disabled={previewScale >= 1.5}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
        
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside 
            className={`
              ${isRTL 
                ? (sidebarVisible ? 'translate-x-0' : 'translate-x-full') 
                : (sidebarVisible ? 'translate-x-0' : '-translate-x-full')}
              transition-transform duration-300 ease-in-out
              md:translate-x-0
              w-full md:w-64 lg:w-72
              flex flex-col
              ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}
              shadow-lg md:shadow-md
              z-20 md:z-auto
              absolute md:relative
              h-[calc(100%-3rem)] md:h-auto
              overflow-hidden
              ${isRTL ? 'right-0' : 'left-0'}
            `}
          >
            {/* Tab navigation */}
            <div className={`flex w-full border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors 
                  ${activeTab === 'templates' 
                    ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
                `}
                onClick={() => setActiveTab('templates')}
              >
                {t('resume.customizer.templates.templates')}
              </button>
              <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors 
                  ${activeTab === 'styling' 
                    ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
                `}
                onClick={() => setActiveTab('styling')}
              >
                {t('resume.customizer.templates.styling')}
              </button>
              <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors 
                  ${activeTab === 'sharing' 
                    ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
                `}
                onClick={() => setActiveTab('sharing')}
              >
                {t('resume.customizer.templates.sharing')}
              </button>
            </div>
            
            {/* Tab content with scrollable area */}
            <div className="flex-1 overflow-y-auto p-3">
              {/* Templates Tab */}
              {activeTab === 'templates' && (
                <div>
                  <TemplateSelector 
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
              
               {/* Styling Tab */}
              {activeTab === 'styling' && (
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('resume.customizer.templates.styles') || 'Styling Options'}
                  </h3>
                  
                  {/* Color selector */}
                  <div className="mb-4">
                    <ColorSelector
                      value={customSettings.accentColor}
                      onChange={(color) => updateSetting('accentColor', color)}
                      isDarkMode={isDarkMode}
                      isRTL={isRTL}
                    />
                  </div>
                  
                  {/* Font selector */}
                  <div className="mb-4">
                    <FontSelector 
                      value={customSettings.fontFamily}
                      onChange={(font) => updateSetting('fontFamily', font)}
                      isDarkMode={isDarkMode}
                      isRTL={isRTL}
                    />
                  </div>
                  
                  {/* Line spacing */}
                  <div className="mb-4">
                    <h4 className={`mb-1 text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {t('resume.customizer.spacing.title') || 'Line Spacing'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('resume.customizer.spacing.compact') || 'Compact'}
                      </span>
                      <input
                        type="range"
                        min="1.2"
                        max="2"
                        step="0.1"
                        value={customSettings.lineSpacing}
                        onChange={(e) => updateSetting('lineSpacing', parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('resume.customizer.spacing.spacious') || 'Spacious'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Headers style selector */}
                  <div className="mb-4">
                    <HeadersStyleSelector
                      value={customSettings.headingsUppercase}
                      onChange={(value) => updateSetting('headingsUppercase', value)}
                      isDarkMode={isDarkMode}
                      isRTL={isRTL}
                    />
                  </div>
                  
                  {/* Skill level display toggle */}
                  <div className="mb-4">
                    <SkillLevelToggle
                      value={customSettings.hideSkillLevel}
                      onChange={(value) => updateSetting('hideSkillLevel', value)}
                      isDarkMode={isDarkMode}
                      isRTL={isRTL}
                    />
                  </div>
                </div>
              )}
              
              {/* Sharing Tab */}
              {activeTab === 'sharing' && (
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('resume.customizer.templates.sharing') || 'Sharing Options'}
                  </h3>
                  
                  {/* Save customizations */}
                  <div className="mb-4">
  <CustomizationManager 
    selectedTemplate={selectedTemplate}
    customSettings={customSettings}
    isDarkMode={isDarkMode}
    onUpdatePreview={(changes) => {
      // This updates the preview when user clicks "Apply"
      console.log('Applied customizations:', changes);
    }}
  />
</div>
                
{/* Replace existing PublicToggle with PublicCVManager */}
<div className="mb-4">
  <PublicCVManager 
    formData={resumeData}
    selectedTemplate={selectedTemplate}
    customSettings={customSettings}
    isDarkMode={isDarkMode}
    onPublishSuccess={(url) => {
      console.log("CV published successfully:", url);
      // Optional: show a toast notification
    }}
  />
</div>
                  
                  
                </div>
              )}
            </div>
            
            {/* Mobile only - close sidebar button */}
            {isMobile && sidebarVisible && (
              <div className={`p-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={toggleSidebar}
                  className={`w-full py-1.5 rounded-md text-xs transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {t('resume.customizer.closeOptions') || 'Close Options'}
                </button>
              </div>
            )}
          </aside>
          
          {/* Resume preview area */}
          <main className={`flex-1 overflow-auto p-3 relative z-10 ${isDarkMode ? 'bg-gray-900' : 'bg-transparent'} transition-colors duration-200`}>
            <div className="mx-auto max-w-4xl">
              <div 
                style={{ transform: `scale(${previewScale})` }}
                className="origin-top rounded-lg shadow-xl overflow-hidden transition-transform duration-200"
                ref={resumeRef}
              >
                <TemplateRenderer
                  templateId={selectedTemplate}
                  formData={resumeData || currentResume}
                  customSettings={customSettings}
                  darkMode={isDarkMode}
                  isRTL={isRTL} 
                  scale={1} // Scale is handled by the container
                />
              </div>
            </div>
          </main>
        </div>
        
        {/* Save confirmation modal */}
        <SaveConfirmationModal
          isOpen={showSaveConfirmation}
          onClose={() => setShowSaveConfirmation(false)}
          onSave={handleSaveAndContinue}
          onContinue={handleContinueWithoutSaving}
          isDarkMode={isDarkMode}
          isRTL={isRTL}
        />
      </div>

      {/* Enhanced CV Selection Modal */}
      <CVSelectionModal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
        availableCVs={availableCVs}
        selectedCV={selectedCV}
        onSelectCV={handleSelectCV}
        isLoading={isLoadingCVs}
        onRefresh={loadAvailableCVs}
        isDarkMode={isDarkMode} 
      />
    </>
  );
};

export default ResumeCustomizer;