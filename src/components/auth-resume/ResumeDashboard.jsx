import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Trash, FileText, Settings, RefreshCw, HardDrive, Cloud, Calendar, User, Download } from 'lucide-react';
import useSessionStore from '../../stores/sessionStore';
import { useTranslation } from 'react-i18next';

const ResumeDashboard = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Use session store instead of resume store
  const { 
    localCVs, 
    loadLocalCVs,
    canSaveToCloud,
    listGoogleDriveCVs,
    deleteGoogleDriveCV,
    loadGoogleDriveCV,
    googleDriveConnected
  } = useSessionStore();
  
  const [allCVs, setAllCVs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

  const loadAllCVs = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const cvs = [];
    const seenIds = new Set(); // Track which CVs we've already added

    console.log('📋 Loading CVs from all sources...');

    // 1. Load Google Drive CVs FIRST (highest priority)
    if (canSaveToCloud()) {
      try {
        console.log('☁️ Loading Google Drive CVs...');
        const cloudCVs = await listGoogleDriveCVs();
        
        if (Array.isArray(cloudCVs)) {
          for (const file of cloudCVs) {
            const displayName = file.name
              .replace('.json', '')
              .replace(/^cv_/, '')
              .replace(/_\d{8}_\d{6}$/, '')
              .replace(/_/g, ' ');
              
            const cv = {
              id: `cloud_${file.file_id}`, // Prefix with cloud_
              source: 'cloud',
              title: displayName || t('cloud.google_drive'),
              updated_at: file.last_modified,
              personal_info: { 
                full_name: displayName || t('common.untitled')
              },
              sourceIcon: Cloud,
              sourceLabel: t('cloud.google_drive'),
              sourceColor: 'text-blue-500',
              sourceBgColor: 'bg-blue-500',
              cloudFile: file,
              originalCloudId: file.file_id // Store the actual file ID
            };
            
            cvs.push(cv);
            seenIds.add(file.file_id); // Track this file ID
          }
          console.log(`☁️ Loaded ${cloudCVs.length} Google Drive CVs`);
        }
      } catch (error) {
        console.error('❌ Error loading Google Drive CVs:', error);
        setError('Failed to load some CVs from Google Drive');
      }
    }

    // 2. Load local CVs (but skip if they're actually cloud CVs)
    try {
      const localCVs = JSON.parse(localStorage.getItem('local_cvs') || '[]');
      for (const cv of localCVs) {
        // Skip if this is actually a cloud CV that we already loaded
        if (cv._original_cloud_id && seenIds.has(cv._original_cloud_id)) {
          console.log('⏭️ Skipping duplicate cloud CV from local storage');
          continue;
        }
        
        cvs.push({
          ...cv,
          source: 'local',
          id: cv.id || `local_${Date.now()}`,
          sourceIcon: HardDrive,
          sourceLabel: t('cloud.local_storage'),
          sourceColor: 'text-green-500',
          sourceBgColor: 'bg-green-500'
        });
      }
      console.log(`📱 Loaded ${localCVs.length} local CVs`);
    } catch (error) {
      console.error('Error loading local CVs:', error);
    }

    // 3. Load current draft ONLY if it's not a duplicate of existing CVs
    try {
      const currentDraft = localStorage.getItem('cv_draft');
      if (currentDraft) {
        const parsed = JSON.parse(currentDraft);
        
        // Check if this draft is actually editing an existing CV
        const isEditingExisting = parsed._original_cloud_id || parsed._original_local_id;
        
        if (!isEditingExisting && (parsed.personal_info?.full_name || parsed.title)) {
          cvs.push({
            ...parsed,
            id: 'current_draft',
            source: 'draft',
            title: parsed.title || t('cloud.current_draft'),
            updated_at: new Date().toISOString(),
            sourceIcon: FileText,
            sourceLabel: t('cloud.current_draft'),
            sourceColor: 'text-purple-500',
            sourceBgColor: 'bg-purple-500'
          });
          console.log('📝 Loaded current draft');
        } else {
          console.log('⏭️ Skipping draft as it\'s editing an existing CV');
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }

    // Sort CVs by last modified (newest first)
    cvs.sort((a, b) => new Date(b.updated_at || b.lastModified || 0) - new Date(a.updated_at || a.lastModified || 0));

    setAllCVs(cvs);
    setLastRefreshTime(new Date());
    console.log(`✅ Loaded ${cvs.length} unique CVs`);

  } catch (err) {
    console.error('❌ Error loading CVs:', err);
    setError('Failed to load CVs');
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    loadAllCVs();
  }, []);

  const handleRefresh = async () => {
    await loadAllCVs();
  };

  const handleCreateNew = () => {
    navigate('/new-resume');
  };

 const handleEdit = async (cv) => {
  try {
    if (cv.source === 'cloud') {
      console.log('📥 Loading cloud CV for editing:', cv.originalCloudId);
      setIsLoading(true);
      
      const fullCV = await loadGoogleDriveCV(cv.originalCloudId);
      
      if (fullCV) {
        const draftData = {
          ...fullCV,
          _edit_source: 'cloud',
          _original_cloud_id: cv.originalCloudId,
          _edit_timestamp: Date.now()
        };
        
        localStorage.setItem('cv_draft', JSON.stringify(draftData));
        
        navigate('/edit-resume', { 
          state: { 
            editSource: 'cloud',
            originalFileId: cv.originalCloudId
          } 
        });
      }
    } else {
      // Local/draft CV editing
      const draftData = {
        ...cv,
        _edit_source: cv.source,
        _original_local_id: cv.id,
        _edit_timestamp: Date.now()
      };
      
      localStorage.setItem('cv_draft', JSON.stringify(draftData));
      navigate('/edit-resume', { 
        state: { 
          editSource: cv.source,
          cvId: cv.id
        } 
      });
    }
  } catch (error) {
    console.error('❌ Error loading CV for editing:', error);
    alert('Failed to load CV for editing');
  } finally {
    setIsLoading(false);
  }
};

  const handleView = async (cv) => {
  try {
    if (cv.source === 'cloud') {
      // Generate encoded URL for cloud CVs
      setIsLoading(true);
      // FIX: Use originalCloudId instead of the prefixed id
      const fullCV = await loadGoogleDriveCV(cv.originalCloudId);
      
      if (fullCV) {
        // Create encoded public URL
        const { generatePublicURL } = await import('../../utils/cvEncoder');
        const publicURL = generatePublicURL(fullCV);
        window.open(publicURL, '_blank');
      }
    } else {
      // Generate encoded URL for local CVs
      const { generatePublicURL } = await import('../../utils/cvEncoder');
      const publicURL = generatePublicURL(cv);
      window.open(publicURL, '_blank');
    }
  } catch (error) {
    console.error('❌ Error viewing CV:', error);
    alert('Failed to view CV');
  } finally {
    setIsLoading(false);
  }
};

  const handleCustomize = async (cv) => {
    try {
      if (cv.source === 'cloud') {
        // Load full CV data from Google Drive first
        setIsLoading(true);
        const fullCV = await loadGoogleDriveCV(cv.originalCloudId);
        
        if (fullCV) {
          localStorage.setItem('cv_draft_for_customization', JSON.stringify(fullCV));
          navigate('/resume-customizer');
        }
      } else {
        localStorage.setItem('cv_draft_for_customization', JSON.stringify(cv));
        navigate('/resume-customizer');
      }
    } catch (error) {
      console.error('❌ Error loading CV for customization:', error);
      alert('Failed to load CV for customization');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cv) => {
      console.log('🗑️ Deleting CV:', {
    source: cv.source,
    id: cv.id,
    originalCloudId: cv.originalCloudId,
    title: cv.title
  });
  const confirmMessage = cv.source === 'cloud' 
    ? 'This will permanently delete the CV from your Google Drive. Are you sure?'
    : 'This will permanently delete the CV from this device. Are you sure?';
    
  if (!window.confirm(confirmMessage)) {
    return;
  }

  try {
    setIsLoading(true);
    
    if (cv.source === 'cloud') {
      // Delete from Google Drive - FIXED: use originalCloudId instead of id
      await deleteGoogleDriveCV(cv.originalCloudId);
    } else if (cv.source === 'local') {
      // Delete from local storage
      const localCVs = loadLocalCVs();
      const updatedCVs = localCVs.filter(localCV => localCV.id !== cv.id);
      localStorage.setItem('local_cvs', JSON.stringify(updatedCVs));
    } else if (cv.source === 'draft') {
      // Clear current draft
      localStorage.removeItem('cv_draft');
    }
    
    // Refresh the list
    await loadAllCVs();
    
  } catch (error) {
    console.error('❌ Error deleting CV:', error);
    alert('Failed to delete CV');
  } finally {
    setIsLoading(false);
  }
};

  const handleDownload = async (cv) => {
    try {
      let cvData = cv;
      
      if (cv.source === 'cloud') {
        setIsLoading(true);
        cvData = await loadGoogleDriveCV(cv.originalCloudId);
      }
      
      // Create and download JSON file
      const dataStr = JSON.stringify(cvData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${cvData.title || 'resume'}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
    } catch (error) {
      console.error('❌ Error downloading CV:', error);
      alert('Failed to download CV');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notSpecified');
    
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return t('common.notSpecified');
      
      const locale = localStorage.getItem('i18nextLng') || 'en-US';
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return t('common.notSpecified');
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    
    const locale = localStorage.getItem('i18nextLng') || 'en-US';
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-sm">{t('resumeDashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (!allCVs || allCVs.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-lg relative z-10">
          <div className={`text-center p-8 rounded-xl shadow-lg backdrop-blur-sm border ${
            darkMode ? 'bg-gray-800/90 text-white border-gray-700' : 'bg-white/90 text-gray-800 border-gray-200'
          }`}>
            <FileText size={64} className="mx-auto mb-4 text-purple-500" />
            <h1 className="text-2xl font-bold mb-3">{t('resumeDashboard.noResumes.title')}</h1>
            <p className="mb-6 text-gray-600">
              {t('resumeDashboard.noResumes.description')}
            </p>
            
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              {t('resumeDashboard.buttons.startBuilding')}
            </button>
            
            {!canSaveToCloud() && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="text-blue-700 mb-2">{t('cloud.tip_connect_google_drive')}</p>
                <button
                  onClick={() => navigate('/cloud-setup')}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {t('cloud.connect_google_drive')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('resumeDashboard.title')}
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('cloud.cvs_available')}: {allCVs.length} • {t('common.lastRefresh')} {formatTime(lastRefreshTime)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white'
              }`}
              title={t('common.refresh')}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Plus size={18} />
              {t('resumeDashboard.buttons.createNew')}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* CVs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allCVs.map((cv, index) => {
            const SourceIcon = cv.sourceIcon;
            
            return (
              <div 
                key={`${cv.source}-${cv.id}-${index}`}
                className={`rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl hover:scale-102 ${
                  darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
                }`}
              >
                {/* CV Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-base font-semibold truncate ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {cv.title || t('common.untitled')}
                    </h3>
                    <div className={`flex items-center text-xs ${cv.sourceColor}`}>
                      <SourceIcon size={14} />
                    </div>
                  </div>
             
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(cv.updated_at || cv.lastModified)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${cv.sourceBgColor} ${darkMode ? 'bg-opacity-20 text-white' : 'bg-opacity-10 text-gray-800'}`}>
                      {cv.sourceLabel}
                    </span>
                  </div>
                </div>
                
                {/* CV Preview */}
                <div className={`h-32 mx-4 mb-4 flex items-center justify-center rounded-lg ${
                  darkMode ? 'bg-gray-700/50' : 'bg-gray-100/70'
                }`}>
                  <div className="text-center">
                    <FileText size={24} className={`mx-auto mb-1 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('resumeDashboard.preview')}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-5 gap-1">
                    <button
                      onClick={() => handleView(cv)}
                      className="group flex flex-col items-center justify-center gap-1 p-2 rounded-md bg-gradient-to-r from-blue-600/10 to-blue-600/5 hover:from-blue-600/20 hover:to-blue-600/10 transition-all duration-300"
                      title={t('common.view')}
                    >
                      <Eye size={14} className="text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600">{t('common.view')}</span>
                    </button>
                    
                    <button
                      onClick={() => handleEdit(cv)}
                      className="group flex flex-col items-center justify-center gap-1 p-2 rounded-md bg-gradient-to-r from-green-600/10 to-green-600/5 hover:from-green-600/20 hover:to-green-600/10 transition-all duration-300"
                      title={t('common.edit')}
                    >
                      <Edit size={14} className="text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600">{t('common.edit')}</span>
                    </button>
                    
                    <button
                      onClick={() => handleCustomize(cv)}
                      className="group flex flex-col items-center justify-center gap-1 p-2 rounded-md bg-gradient-to-r from-purple-600/10 to-purple-600/5 hover:from-purple-600/20 hover:to-purple-600/10 transition-all duration-300"
                      title={t('resume.customizer.title')}
                    >
                      <Settings size={14} className="text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600">{t('resume.customizer.templates.styling')}</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownload(cv)}
                      className="group flex flex-col items-center justify-center gap-1 p-2 rounded-md bg-gradient-to-r from-indigo-600/10 to-indigo-600/5 hover:from-indigo-600/20 hover:to-indigo-600/10 transition-all duration-300"
                      title={t('common.download')}
                    >
                      <Download size={14} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600">{t('common.save')}</span>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(cv)}
                      className="group flex flex-col items-center justify-center gap-1 p-2 rounded-md bg-gradient-to-r from-red-600/10 to-red-600/5 hover:from-red-600/20 hover:to-red-600/10 transition-all duration-300"
                      title={t('common.delete')}
                    >
                      <Trash size={14} className="text-red-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600">{t('common.delete')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Connection Status */}
        <div className="mt-8 text-center">
          {canSaveToCloud() ? (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              <Cloud size={16} />
              <span className="text-sm">{t('cloud.google_drive_connected')}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                darkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <HardDrive size={16} />
                <span className="text-sm">{t('cloud.local_storage_only')}</span>
              </div>
              <div>
                <button
                  onClick={() => navigate('/cloud-setup')}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  {t('cloud.connect_google_drive_sync')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeDashboard;