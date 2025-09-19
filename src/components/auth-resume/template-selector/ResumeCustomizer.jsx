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
import useResumeStore from '../../../stores/resumeStore';
import useSessionStore from '../../../stores/sessionStore'; 
import SaveCustomizationsButton from './CustomizationManager'; 
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
  isDarkMode,
  title = "Select CV",
  subtitle = "Choose which CV you'd like to work with"
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');

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

  const getSourceLabel = (source) => {
    switch (source) {
      case 'draft': return 'Current Work Session';
      case 'local': return 'Saved Locally';
      case 'cloud': return 'Google Drive';
      case 'api': return 'My Saved CVs';
      default: return 'Unknown Source';
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'draft': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'local': return <HardDrive className="w-4 h-4 text-green-500" />;
      case 'cloud': return <Cloud className="w-4 h-4 text-blue-500" />;
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
    const name = cv.personal_info?.full_name || cv.content?.personal_info?.full_name || 'No name';
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
              {subtitle}. Found {availableCVs.length} CV{availableCVs.length !== 1 ? 's' : ''}.
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
              title="Refresh CV list"
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
                placeholder="Search by CV title or name..."
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
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading CVs...</p>
              </div>
            </div>
          ) : Object.keys(filteredGroupedCVs).length === 0 ? (
            <div className="text-center py-12">
              <FileText className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {searchTerm ? 'No CVs match your search' : 'No CVs found'}
              </p>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {searchTerm ? 'Try a different search term' : 'Create a CV first to work with it'}
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
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {cvs.length} CV{cvs.length !== 1 ? 's' : ''}
                    </span>
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
                                {cv.title || cv.name || `CV ${index + 1}`}
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
                                {source === 'draft' && 'Current editing session'}
                                {source === 'local' && 'Saved on this device'}
                                {source === 'api' && `ID: ${cv.id}`}
                              </span>
                              
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                source === 'cloud' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                source === 'draft' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                source === 'local' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                              }`}>
                                {getSourceIcon(source)}
                                <span className="ml-1">
                                  {source === 'cloud' ? 'Drive' : 
                                   source === 'draft' ? 'Draft' : 
                                   source === 'local' ? 'Local' : 'Saved'}
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
                  Selected: <strong>{selectedCV.title || selectedCV.name || 'Untitled CV'}</strong>
                  {' from '}
                  <strong>{getSourceLabel(selectedCV.source)}</strong>
                </>
              ) : (
                'No CV selected'
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
                Cancel
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
                Select This CV
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
  const getSourceIcon = (source) => {
    switch (source) {
      case 'draft': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'local': return <HardDrive className="w-4 h-4 text-green-500" />;
      case 'cloud': return <Cloud className="w-4 h-4 text-blue-500" />;
      case 'api': return <User className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case 'draft': return 'Draft';
      case 'local': return 'Local';
      case 'cloud': return 'Drive';
      case 'api': return 'Saved';
      default: return 'Unknown';
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
        <span className="text-sm">Select CV ({availableCVs.length} available)</span>
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
        {getSourceIcon(selectedCV.source)}
        <div className="ml-2 min-w-0">
          <div className="text-sm font-medium truncate">
            {selectedCV.title || selectedCV.name || 'Untitled CV'}
          </div>
          <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {getSourceLabel(selectedCV.source)} • {selectedCV.personal_info?.full_name || 'No name'}
          </div>
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
  const { token } = useAuthStore();
  const { currentResume, loading, fetchResume } = useResumeStore();  
  const { 
    listGoogleDriveCVs,
    loadGoogleDriveCV,  // Add this method
    canSaveToCloud,
    sessionToken  
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

  // Main function to load all available CVs
  const loadAvailableCVs = async () => {
    setIsLoadingCVs(true);
    const cvs = [];

    try {
      console.log('🔍 Loading available CVs from all sources...');

      // 1. Check for draft from NewResumeBuilder
      const draftData = localStorage.getItem('cv_draft_for_customization');
      if (draftData) {
        try {
          const parsed = JSON.parse(draftData);
          console.log('📝 Found draft from CV builder:', parsed.title || 'Untitled');
          cvs.push({
            id: 'draft-customization',
            source: 'draft',
            title: parsed.title || 'Draft from CV Builder',
            name: 'Current editing session',
            content: parsed,
            personal_info: parsed.personal_info,
            priority: 1
          });
        } catch (error) {
          console.error('Error parsing draft data:', error);
        }
      }

      // 2. Check for recent local CV
      const localCV = localStorage.getItem('cv_draft');
      if (localCV) {
        try {
          const parsed = JSON.parse(localCV);
          console.log('💾 Found local CV:', parsed.title || 'Untitled');
          cvs.push({
            id: 'local-draft-' + Date.now(),
            source: 'local',
            title: parsed.title || 'Local Draft',
            name: 'Saved on this device',
            content: parsed,
            personal_info: parsed.personal_info,
            priority: 3
          });
        } catch (error) {
          console.error('Error parsing local CV:', error);
        }
      }

      // 3. Load from Google Drive if connected - ENHANCED VERSION WITH BETTER LOGGING
      if (canSaveToCloud()) {
        try {
          console.log('☁️ Loading CVs from Google Drive...');
          console.log('☁️ Google Drive connection status:', canSaveToCloud());
          
          const cloudData = await listGoogleDriveCVs();
          console.log('☁️ Raw Google Drive response:', cloudData);
          console.log('☁️ Is cloudData an array?', Array.isArray(cloudData));
          console.log('☁️ cloudData length:', cloudData?.length);
          
          if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
            console.log(`📁 Processing ${cloudData.length} Google Drive files...`);
            
            // Process files in parallel with Promise.all
            const driveCVPromises = cloudData.map(async (file, index) => {
              try {
                console.log(`📥 Processing Google Drive file ${index + 1}/${cloudData.length}:`, {
                  name: file.name,
                  id: file.file_id,
                  size: file.size_bytes
                });
                
                // Use the correct sessionStore method that calls the right endpoint
                try {
                  const fileContent = await loadGoogleDriveCV(file.file_id);
                  console.log(`📥 File content loaded for ${file.name}:`, {
                    hasContent: !!fileContent,
                    contentType: typeof fileContent,
                    isSuccess: fileContent?.success !== false
                  });
                  
                  if (!fileContent || fileContent.error) {
                    console.log(`⚠️ Skipping Google Drive file: ${file.name} - invalid content or error`);
                    return null;
                  }
                  
                  // The sessionStore method should return the parsed CV data directly
                  let actualContent = fileContent;
                  
                  // If the response has a cv_data wrapper, extract it
                  if (fileContent.cv_data) {
                    actualContent = fileContent.cv_data;
                  }
                  
                  console.log(`✅ Successfully processed Google Drive file: ${file.name}`, {
                    hasPersonalInfo: !!actualContent?.personal_info,
                    title: actualContent?.title,
                    fullName: actualContent?.personal_info?.full_name
                  });
                  
                  return {
                    id: file.file_id,
                    source: 'cloud',
                    title: file.name?.replace('.json', '') || `Google Drive CV`,
                    name: file.name || 'Untitled',
                    content: actualContent,
                    modifiedTime: file.last_modified,
                    personal_info: actualContent.personal_info,
                    priority: 2
                  };
                } catch (loadError) {
                  console.error(`❌ Error loading content for ${file.name}:`, loadError);
                  return null;
                }
                
              } catch (fileError) {
                console.error(`❌ Error processing Google Drive file ${file.file_id}:`, fileError);
                return null;
              }
            });
            
            console.log(`🔄 Waiting for all ${driveCVPromises.length} Google Drive files to process...`);
            const driveCVs = await Promise.all(driveCVPromises);
            
            // Filter out null results and add to CVs array
            const validDriveCVs = driveCVs.filter(cv => cv !== null);
            console.log(`✅ Successfully processed ${validDriveCVs.length}/${cloudData.length} Google Drive CVs`);
            
            if (validDriveCVs.length > 0) {
              console.log('✅ Adding Google Drive CVs to list:', validDriveCVs.map(cv => ({
                title: cv.title,
                source: cv.source,
                hasContent: !!cv.content
              })));
              cvs.push(...validDriveCVs);
            } else {
              console.warn('⚠️ No valid Google Drive CVs found after processing');
            }
          } else {
            console.log('ℹ️ No Google Drive files found or invalid response structure');
          }
        } catch (error) {
          console.error('❌ Error loading from Google Drive:', error);
          console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
      } else {
        console.log('ℹ️ Google Drive not connected, skipping cloud CVs');
      }

      // 4. Add current resume from API if exists
      if (currentResume && currentResume.id) {
        console.log('🌐 Found API resume:', currentResume.title || currentResume.id);
        cvs.push({
          id: currentResume.id,
          source: 'api',
          title: currentResume.title || `Resume ${currentResume.id}`,
          name: 'From database',
          content: currentResume,
          personal_info: currentResume.personal_info,
          priority: 2
        });
      }

      // Sort by priority
      cvs.sort((a, b) => a.priority - b.priority);

      console.log(`✅ Loaded ${cvs.length} CVs total from all sources`);
      
      // Debug log
      console.group('📋 Loaded CVs Summary');
      cvs.forEach((cv, index) => {
        console.log(`CV ${index + 1}:`, {
          source: cv.source,
          title: cv.title,
          id: cv.id,
          hasContent: !!cv.content,
          contentType: typeof cv.content
        });
      });
      console.groupEnd();

      setAvailableCVs(cvs);

      // Auto-select the highest priority CV if none selected
      if (cvs.length > 0 && !selectedCV) {
        const priorityCV = cvs.find(cv => cv.content); // Find first CV with actual content
        if (priorityCV) {
          console.log('🎯 Auto-selecting CV:', priorityCV.title);
          handleSelectCV(priorityCV);
        }
      }

    } catch (error) {
      console.error('❌ Error loading available CVs:', error);
      setLocalError('Failed to load available CVs');
    } finally {
      setIsLoadingCVs(false);
    }
  };

  // Handle CV selection
  const handleSelectCV = (cv) => {
    console.log('✅ Selected CV:', cv.title, 'from', cv.source);
    setSelectedCV(cv);
    setResumeData(cv.content);
    applyCustomizationSettings(cv.content);
    setLocalError(null);
    setShowCVModal(false);
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
        title: currentResume.title || `Resume ${currentResume.id}`,
        name: 'From database',
        content: currentResume,
        personal_info: currentResume.personal_info
      };
      handleSelectCV(apiCV);
    }
  }, [currentResume, resumeData]);
  
  useEffect(() => {
    setSidebarVisible(!isMobile);
  }, [isMobile]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) { 
        useResumeStore.setState(state => ({
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
        saveMessage = 'Customizations saved locally!';
      } catch (localError) {
        console.error('❌ Local save failed:', localError);
        throw new Error('Failed to save customizations');
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
      alert(t('resume.customizer.saveConfirmation.error'));
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
            {isLoadingCVs ? 'Searching for your CVs...' : t('resume.customizer.loading')}
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
              Back to CV Builder
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
          <h2 className="text-lg font-bold mb-2">No CVs Found</h2>
          <p className="mb-4 text-sm">We couldn't find any CVs to customize. Create one first!</p>
          <button 
            onClick={() => navigate('/new-resume')}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            Create New CV
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
        
        {/* Enhanced Header with Clear CV Selection */}
        <header className={`relative z-10 px-3 py-2 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
          {/* Top Row - Actions */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className={`md:hidden p-1.5 rounded-md ${isRTL ? 'ml-2' : 'mr-2'} ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                {sidebarVisible ? 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                }
              </button>
              
              <button
                className={`py-1.5 px-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center ${isRTL ? 'ml-2' : 'mr-2'}`}
                onClick={() => handleExport('DOCX')}
                disabled={isExporting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                DOCX
              </button>
              
              <button
                className="py-1.5 px-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center"
                onClick={() => handleExport('PDF')}
                disabled={isExporting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
               PDF
              </button>
            </div>
            
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}> 
              {/* Preview controls */}
              <div className="flex items-center rounded-md">
                <button 
                  onClick={zoomOut}
                  className={`p-1 ${isRTL ? 'rounded-r-md' : 'rounded-l-md'} ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  disabled={previewScale <= 0.5}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className={`px-2 text-xs flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                  {Math.round(previewScale * 100)}%
                </span>
                <button 
                  onClick={zoomIn}
                  className={`p-1 ${isRTL ? 'rounded-l-md' : 'rounded-r-md'} ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  disabled={previewScale >= 1.5}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row - CV Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Customizing:
              </span>
              <CompactCVSelector
                selectedCV={selectedCV}
                availableCVs={availableCVs}
                onOpenModal={() => setShowCVModal(true)}
                isDarkMode={isDarkMode}
              />
            </div>
            
            {/* Additional info and refresh */}
            <div className="flex items-center gap-2">
              {availableCVs.length > 1 && (
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {availableCVs.length} CVs available
                </span>
              )}
              <button
                onClick={loadAvailableCVs}
                disabled={isLoadingCVs}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Refresh CV list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCVs ? 'animate-spin' : ''}`} />
              </button>
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
                {t('resume.customizer.templates.templates') || 'Templates'}
              </button>
              <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors 
                  ${activeTab === 'styling' 
                    ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
                `}
                onClick={() => setActiveTab('styling')}
              >
                {t('resume.customizer.templates.styling') || 'Styling'}
              </button>
              <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors 
                  ${activeTab === 'sharing' 
                    ? (isDarkMode ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-500 text-purple-600') 
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}
                `}
                onClick={() => setActiveTab('sharing')}
              >
                {t('resume.customizer.templates.sharing') || 'Sharing'}
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
        title="Select CV to Customize"
        subtitle="Choose which CV you'd like to customize"
      />
    </>
  );
};

export default ResumeCustomizer;