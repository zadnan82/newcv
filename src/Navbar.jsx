// src/Navbar.jsx - FIXED VERSION with proper structure and OneDrive support
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { Menu, X, Moon, Sun, FileText, LogOut, FileSignature, ChevronDown, Cloud, CloudOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from './assets/logo.png';
import logo2 from './assets/logo2.png';
import useSessionStore from './stores/sessionStore';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation(); 
  
  // Session store
  const { 
    isSessionActive, 
    connectedProviders,
    clearSession,
    initialize,
    googleDriveConnected,
    backendAvailable
  } = useSessionStore();
  
  // Local state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCloudStatus, setShowCloudStatus] = useState(false);
  
  // Refs
  const menuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const cloudStatusRef = useRef(null);
  
  const isRTL = i18n.dir() === 'rtl';

  // Language change handler
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    setShowLanguageMenu(false);
    setMobileMenuOpen(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
      if (cloudStatusRef.current && !cloudStatusRef.current.contains(event.target)) {
        setShowCloudStatus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Initialize session if needed
  useEffect(() => {
    if (backendAvailable && !isSessionActive) {
      initialize().catch(console.error);
    }
  }, [backendAvailable, isSessionActive, initialize]);

  // Listen for cloud connection changes
  useEffect(() => {
    const handleCloudConnected = () => {
      console.log('Cloud connection changed, refreshing navbar state');
    };

    window.addEventListener('cloudConnected', handleCloudConnected);
    return () => window.removeEventListener('cloudConnected', handleCloudConnected);
  }, []);

  // Navigation handlers
  const handleSignOut = async () => {
    try {
      await clearSession();
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCloudSetup = () => {
    navigate('/cloud-setup');
    setMobileMenuOpen(false);
    setShowCloudStatus(false);
  };

  const handleMyResumes = async () => {
    if (backendAvailable && !isSessionActive) {
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    }
    navigate('/my-resumes');
    setMobileMenuOpen(false);
  };

  const handleCoverLetters = async () => {
    if (backendAvailable && !isSessionActive) {
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    }
    navigate('/cover-letters');
    setMobileMenuOpen(false);
  };

  // Active route checker
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    
    if (path === '/cover-letter') {
      return location.pathname === '/cover-letter';
    }
    
    if (path === '/cover-letters') {
      return location.pathname.startsWith('/cover-letters');
    }
    
    return location.pathname.startsWith(path);
  };

  // Language configuration
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Cloud Status Indicator Component
  const CloudStatusIndicator = () => {
    if (!backendAvailable) return null;

    const cloudCount = connectedProviders?.length || 0;
    const hasProviders = cloudCount > 0;

    const getProviderIcon = () => {
      const hasGoogleDrive = connectedProviders?.includes('google_drive') || googleDriveConnected;
      const hasOneDrive = connectedProviders?.includes('onedrive');

      if (hasGoogleDrive && hasOneDrive) {
        return (
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.5 14.5L12 4L17.5 14.5H6.5ZM5.5 16.5H12L8.5 22L5.5 16.5ZM12 16.5H18.5L15 22L12 16.5Z" />
            </svg>
            <span className="text-xs">+</span>
            <span className="text-xs">☁️</span>
          </div>
        );
      } else if (hasGoogleDrive) {
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.5 14.5L12 4L17.5 14.5H6.5ZM5.5 16.5H12L8.5 22L5.5 16.5ZM12 16.5H18.5L15 22L12 16.5Z" />
          </svg>
        );
      } else if (hasOneDrive) {
        return <span className="text-xs">☁️</span>;
      } else if (hasProviders) {
        return <Cloud className="w-3 h-3" />;
      }
      return <CloudOff className="w-3 h-3" />;
    };

    const getStatusText = () => {
      const hasGoogleDrive = connectedProviders?.includes('google_drive') || googleDriveConnected;
      const hasOneDrive = connectedProviders?.includes('onedrive');

      if (hasGoogleDrive && hasOneDrive) {
        return t('cloud.multiple_providers', 'Multiple providers');
      } else if (hasGoogleDrive) {
        return t('cloud.google_drive', 'Google Drive');
      } else if (hasOneDrive) {
        return t('cloud.onedrive', 'OneDrive');
      } else if (hasProviders) {
        return t('cloud.connected_count', { count: cloudCount });
      }
      return t('cloud.no_cloud', 'No cloud');
    };

    const getStatusColor = () => {
      if (hasProviders || googleDriveConnected) {
        return darkMode ? 'text-green-400 hover:bg-green-800/20' : 'text-green-700 hover:bg-green-100';
      }
      return darkMode ? 'text-gray-400 hover:bg-gray-800/20' : 'text-gray-500 hover:bg-gray-100';
    };

    return (
      <div className="relative" ref={cloudStatusRef}>
        <button 
          onClick={() => setShowCloudStatus(!showCloudStatus)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor()}`}
          title={hasProviders || googleDriveConnected ? t('cloud.cloud_storage_connected') : t('cloud.no_cloud_storage_connected')}
        >
          {getProviderIcon()}
          <span className="hidden sm:inline">
            {getStatusText()}
          </span>
          <ChevronDown className="w-3 h-3" />
        </button>
        
        {showCloudStatus && (
          <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 py-2 w-64 rounded-lg shadow-xl z-20 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="px-3 py-1 border-b border-gray-200 dark:border-gray-700">
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('cloud.cloud_storage_status', 'Cloud Storage Status')}
              </p>
            </div>
            
            {(hasProviders || googleDriveConnected) ? (
              <>
                <div className="px-3 py-2">
                  <div className="space-y-2">
                    {(connectedProviders?.includes('google_drive') || googleDriveConnected) && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.5 14.5L12 4L17.5 14.5H6.5ZM5.5 16.5H12L8.5 22L5.5 16.5ZM12 16.5H18.5L15 22L12 16.5Z" />
                        </svg>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {t('cloud.google_drive_connected', 'Google Drive Connected')}
                        </span>
                      </div>
                    )}
                    
                    {connectedProviders?.includes('onedrive') && (
                      <div className="flex items-center">
                        <span className="text-sm mr-2">☁️</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {t('cloud.onedrive_connected', 'OneDrive Connected')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                    {t('cloud.cvs_sync_devices', 'CVs sync across devices')}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('cloud.automatic_backup_enabled', 'Automatic backup enabled')}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <button
                    onClick={handleCloudSetup}
                    className={`w-full text-left px-3 py-1 text-xs transition-colors ${
                      darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {t('cloud.manage_cloud_storage', 'Manage Cloud Storage')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-3 py-2">
                  <div className="flex items-center mb-2">
                    <CloudOff className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('cloud.no_cloud_storage', 'No Cloud Storage')}
                    </span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                    {t('cloud.cvs_saved_locally_only', 'CVs saved locally only')}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('cloud.connect_cloud_device_sync', 'Connect cloud for device sync')}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <button
                    onClick={handleCloudSetup}
                    className={`w-full text-left px-3 py-1 text-xs font-medium transition-colors ${
                      darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {t('cloud.connect_cloud_storage', 'Connect Cloud Storage')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${
      darkMode 
        ? 'bg-gray-900/95 text-white border-b border-gray-800' 
        : 'bg-white/95 text-gray-800 border-b border-gray-200'
      } transition-all duration-300`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between h-12">
          {/* Logo and brand */}
          <div className={`flex items-center ${isRTL ? 'order-2' : 'order-1'}`}>
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center space-x-1"
            >
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-7 w-auto" />
                <img src={logo2} alt="Logo" className={`h-7 w-auto ${isRTL ? 'mr-1' : 'ml-1'}`} />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation - centered */}
          <div className={`hidden md:flex md:items-center md:justify-center flex-1 ${isRTL ? 'order-1 mr-4 ml-4' : 'order-2 ml-4 mr-4'}`}>
            <div className="rounded-full px-1 py-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm flex items-center">
              <Link 
                to="/rc-public" 
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  isActive('/rc-public')
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/20' 
                    : darkMode
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-700 hover:bg-white/20 hover:text-gray-900'
                }`}
              >
                <FileText className="w-3 h-3" /> {t('revamp.browse', 'Browse')}
              </Link>

              <Link 
                to="/new-resume" 
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  isActive('/new-resume')
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/20' 
                    : darkMode
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-700 hover:bg-white/20 hover:text-gray-900'
                }`}
              >
                <FileSignature className="w-3 h-3" /> {t('resumeDashboard.buttons.createNew', 'Create Resume')}
              </Link>

              <Link 
                to="/cover-letter" 
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  isActive('/cover-letter')
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/20' 
                    : darkMode
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-700 hover:bg-white/20 hover:text-gray-900'
                }`}
              >
                <FileText className="w-3 h-3" /> {t('navigation.coverLetter', 'Cover Letter')}
              </Link>

              {backendAvailable && (
                <>
                  <button
                    onClick={handleMyResumes}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                      isActive('/my-resumes')
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/20' 
                        : darkMode
                          ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                          : 'text-gray-700 hover:bg-white/20 hover:text-gray-900'
                    }`}
                  >
                    <FileText className="w-3 h-3" /> {t('navigation.myResumes', 'My Resumes')}
                  </button>
                  
                  <button
                    onClick={handleCoverLetters}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                      isActive('/cover-letters')
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/20' 
                        : darkMode
                          ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                          : 'text-gray-700 hover:bg-white/20 hover:text-gray-900'
                    }`}
                  >
                    <FileSignature className="w-3 h-3" /> {t('navigation.coverLetters', 'Cover Letters')}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Right side controls */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1 sm:space-x-reverse sm:space-x-2 order-3' : 'space-x-1 sm:space-x-2 order-3'}`}>
            {/* Cloud Status Indicator */}
            <CloudStatusIndicator />

            {/* Language Dropdown */}
            <div className="relative" ref={languageMenuRef}>
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="text-sm">{currentLanguage.flag}</span>
                <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showLanguageMenu && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 py-1.5 w-40 rounded-lg shadow-xl z-20 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="max-h-64 overflow-y-auto">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center px-3 py-1.5 text-xs w-full ${isRTL ? 'text-right' : 'text-left'} transition-colors ${
                          lang.code === i18n.language
                            ? darkMode
                              ? 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 text-white font-medium'
                              : 'bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 text-blue-700 font-medium'
                            : darkMode
                              ? 'text-gray-300 hover:bg-white/10'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <span className={isRTL ? 'ml-2 text-sm' : 'mr-2 text-sm'}>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Dark Mode Toggle Button */}
            <button 
              onClick={toggleDarkMode}
              aria-label={darkMode ? t('app.theme.light', 'Light Mode') : t('app.theme.dark', 'Dark Mode')}
              className={`p-1.5 rounded-full transition-colors focus:outline-none ${
                darkMode 
                  ? 'text-yellow-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Clear Session Button for Desktop */}
            {backendAvailable && isSessionActive && (
              <button
                onClick={handleSignOut}
                className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  darkMode
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                }`}
                title={t('cloud.clear_session_cloud_connections', 'Clear session and cloud connections')}
              >
                <LogOut className="w-3 h-3" /> {t('cloud.clear_session', 'Clear Session')}
              </button>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full focus:outline-none transition-colors"
              aria-label={t('navigation.toggleMenu', 'Toggle Menu')}
              ref={menuRef}
            >
              {mobileMenuOpen ? 
                <X className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-800'}`} /> : 
                <Menu className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="px-3 py-3 space-y-2">
          <Link 
            to="/rc-public" 
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm w-full rounded-lg transition-colors ${
              isActive('/rc-public')
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white' 
                : darkMode
                  ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                  : 'text-gray-800 hover:bg-white/20 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" /> {t('revamp.browse', 'Browse')}
          </Link>

          <Link 
            to="/new-resume"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm w-full rounded-lg transition-colors ${
              isActive('/new-resume')
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white' 
                : darkMode
                  ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                  : 'text-gray-800 hover:bg-white/20 hover:text-gray-900'
            }`}
          >
            <FileSignature className="w-4 h-4" /> {t('resumeDashboard.buttons.createNew', 'Create Resume')}
          </Link>

          <Link 
            to="/cover-letter"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm w-full rounded-lg transition-colors ${
              isActive('/cover-letter')
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white' 
                : darkMode
                  ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                  : 'text-gray-800 hover:bg-white/20 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" /> {t('navigation.coverLetter', 'Cover Letter')}
          </Link>

          {backendAvailable && (
            <>
              <button
                onClick={handleMyResumes}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm w-full rounded-lg transition-colors ${
                  isActive('/my-resumes')
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white' 
                    : darkMode
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-800 hover:bg-white/20 hover:text-gray-900'
                }`}
              >
                <FileSignature className="w-4 h-4" /> {t('navigation.coverLetters', 'Cover Letters')}
              </button>

              <button
                onClick={handleCloudSetup}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm w-full rounded-lg transition-colors ${
                  isActive('/cloud-setup')
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white' 
                    : darkMode
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-800 hover:bg-white/20 hover:text-gray-900'
                }`}
              >
                <Cloud className="w-4 h-4" /> {t('cloud.cloud_storage', 'Cloud Storage')}
              </button>
              
              {isSessionActive && (
                <button
                  onClick={handleSignOut}
                  className={`w-full ${isRTL ? 'text-right' : 'text-left'} flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                  }`}
                >
                  <LogOut className="w-4 h-4" /> {t('cloud.clear_session', 'Clear Session')}
                </button>
              )}
            </>
          )}
          
          {/* Language options in mobile menu */}
          <div className={`pt-3 pb-2 px-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className={`mb-2 font-medium text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('language.title', 'Select Language')}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    lang.code === i18n.language
                      ? darkMode
                        ? 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 text-white font-medium'
                        : 'bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 text-blue-700 font-medium'
                      : darkMode
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-700 hover:bg-white/20'
                    }`}
                >
                  <span className={isRTL ? 'ml-1.5 text-sm' : 'mr-1.5 text-sm'}>{lang.flag}</span>
                  <span className="truncate">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 