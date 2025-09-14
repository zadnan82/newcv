import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Trash, FileText, Settings, RefreshCw } from 'lucide-react';
import useResumeStore from '../../stores/resumeStore';
import useAuthStore from '../../stores/authStore';
import { useTranslation } from 'react-i18next';

const ResumeDashboard = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    resumes, 
    fetchResumes, 
    setCurrentResume, 
    deleteResume, 
    loading, 
    error 
  } = useResumeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
   
  useEffect(() => {
    const loadResumes = async () => {
      try {
        setIsLoading(true);
        //console.log("Fetching resumes from API...");
        // Always fetch resumes from the server to ensure we have the latest data
        await fetchResumes();
        setLastRefreshTime(new Date());
      } catch (err) {
        console.error('Error fetching resumes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResumes();
  }, []); // Empty dependency array means this runs once on component mount
   
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await fetchResumes();
      setLastRefreshTime(new Date());
    } catch (err) {
      console.error('Error refreshing resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (resume) => {
    
    // Set the current resume in the store
    setCurrentResume(resume);
    navigate(`/edit-resume/${resume.id}`);
  };

  const handleCreateNew = () => {
    // Clear current resume before creating new
    setCurrentResume(null);
    navigate('/new-resume');
  };

  const handleView = (resume) => {
    setCurrentResume(resume);
    navigate(`/resume/${resume.id}`);
  };

  const handleCustomize = (resume) => {
    if (!resume || !resume.id) {
      console.error("No resume ID available for customization");
      return;
    }
    
    setCurrentResume(resume);
    navigate('/resume-customizer', { 
      state: { resumeId: resume.id } 
    });
  };

  const handleDelete = async (resumeId) => {
    if (window.confirm(t('resumeDashboard.confirmDelete', 'Are you sure you want to delete this resume?'))) {
      try {
        setIsLoading(true);
        await deleteResume(resumeId);
        // Force fetch after deletion to ensure our list is up to date
        await fetchResumes();
        setLastRefreshTime(new Date());
      } catch (err) {
        console.error('Error deleting resume:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };
 
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    
    // Use the user's locale from i18n for date formatting
    const locale = localStorage.getItem('i18nextLng') || 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };
 
  const formatTime = (date) => {
    if (!date) return '';
    
    const locale = localStorage.getItem('i18nextLng') || 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mb-3"></div>
          <p className="text-sm">{t('resumeDashboard.loading', 'Loading your resumes...')}</p>
        </div>
      </div>
    );
  }
 
  if (!resumes || resumes.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 right-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-lg relative z-10">
          <div className={`text-center p-6 rounded-xl shadow-md backdrop-blur-sm border border-white/10 ${darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/80 text-gray-800'}`}>
            <FileText size={48} className="mx-auto mb-4 text-purple-500" />
            <h1 className="text-xl font-bold mb-3">{t('resumeDashboard.noResumes.title', 'You don\'t have any resumes yet')}</h1>
            <p className="mb-6 text-sm">{t('resumeDashboard.noResumes.description', 'Create your first professional resume and take the next step in your career journey!')}</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 rounded-md text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102 flex items-center gap-2 mx-auto"
            >
              <Plus size={16} /> {t('resumeDashboard.buttons.startBuilding', 'Start Building Your Resume')}
            </button>
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
        <div className="absolute -bottom-48 right-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('resumeDashboard.title', 'My Resumes')}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:shadow-md hover:shadow-purple-500/20 transition-all duration-300"
              title={t('common.refresh', 'Refresh')}
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102"
            >
              <Plus size={14} /> {t('resumeDashboard.buttons.createNew', 'Create New Resume')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div 
              key={resume.id} 
              className={`rounded-xl overflow-hidden shadow-md backdrop-blur-sm border border-white/10 ${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              }`}
            >
              <div className="p-3">
                <h2 className={`text-base font-semibold mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {resume.title || t('resumeDashboard.defaultTitle', "My Resume")}
                </h2>
                
                {/* Resume summary */}
                <div className="mb-3">
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {resume.personal_info?.full_name || t('resumeDashboard.unnamed', "Unnamed Resume")}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('resumeDashboard.lastUpdated', 'Last updated')}: {formatDate(resume.updated_at)}
                  </p>
                </div>
                
                {/* Resume preview thumbnail */}
                <div className={`h-24 mb-3 flex items-center justify-center rounded-md ${
                  darkMode ? 'bg-gray-700/50' : 'bg-gray-100/70'
                }`}>
                  <div className="text-center">
                    <FileText size={20} className={darkMode ? 'text-gray-500 mx-auto mb-1' : 'text-gray-400 mx-auto mb-1'} />
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('resumeDashboard.preview', 'Resume Preview')}
                    </p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => handleView(resume)}
                    className="group flex flex-col items-center justify-center gap-1 p-1.5 rounded-md bg-gradient-to-r from-blue-600/10 to-blue-600/5 hover:from-blue-600/20 hover:to-blue-600/10 transition-all duration-300"
                    title={t('resumeDashboard.buttons.view', 'View')}
                  >
                    <Eye size={14} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} group-hover:scale-110 transition-transform`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('resumeDashboard.buttons.view', 'View')}
                    </span>
                  </button>
                  <button
                    onClick={() => handleEdit(resume)}
                    className="group flex flex-col items-center justify-center gap-1 p-1.5 rounded-md bg-gradient-to-r from-green-600/10 to-green-600/5 hover:from-green-600/20 hover:to-green-600/10 transition-all duration-300"
                    title={t('resumeDashboard.buttons.edit', 'Edit')}
                  >
                    <Edit size={14} className={`${darkMode ? 'text-green-400' : 'text-green-600'} group-hover:scale-110 transition-transform`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('resumeDashboard.buttons.edit', 'Edit')}
                    </span>
                  </button>
                  <button
                    onClick={() => handleCustomize(resume)}
                    className="group flex flex-col items-center justify-center gap-1 p-1.5 rounded-md bg-gradient-to-r from-purple-600/10 to-purple-600/5 hover:from-purple-600/20 hover:to-purple-600/10 transition-all duration-300"
                    title={t('resumeDashboard.buttons.customize', 'Customize')}
                  >
                    <Settings size={14} className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} group-hover:scale-110 transition-transform`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('resumeDashboard.buttons.customize', 'Customize')}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="group flex flex-col items-center justify-center gap-1 p-1.5 rounded-md bg-gradient-to-r from-red-600/10 to-red-600/5 hover:from-red-600/20 hover:to-red-600/10 transition-all duration-300"
                    title={t('resumeDashboard.buttons.delete', 'Delete')}
                  >
                    <Trash size={14} className={`${darkMode ? 'text-red-400' : 'text-red-600'} group-hover:scale-110 transition-transform`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('resumeDashboard.buttons.delete', 'Delete')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('common.lastRefresh', 'Last refreshed')}: {formatTime(lastRefreshTime)}
        </p>
      </div>
    </div>
  );
};

export default ResumeDashboard;