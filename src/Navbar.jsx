import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { Menu, X, Moon, Sun, User, FileText, Settings, LogOut, FileSignature, ChevronDown, Shield, MessageSquare, LogIn, Cloud, CloudOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from './assets/logo.png';
import logo2 from './assets/logo2.png';
import useSessionStore from './stores/sessionStore'; // Updated import

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation(); 
  
  // Updated to use session store instead of auth store
  const { 
    isSessionActive, 
    hasConnectedProviders, 
    connectedProviders,
    clearSession,
    initialize 
  } = useSessionStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCloudStatus, setShowCloudStatus] = useState(false);
  const menuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const cloudStatusRef = useRef(null);
  const isRTL = i18n.dir() === 'rtl';

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    setShowLanguageMenu(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  
    // Click outside to close menus
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
      if (cloudStatusRef.current && !cloudStatusRef.current.contains(event.target)) {
        setShowCloudStatus(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location]);

  // Initialize session if not active
  useEffect(() => {
    if (!isSessionActive) {
      initialize().catch(console.error);
    }
  }, [isSessionActive, initialize]);

  // Listen for cloud connection changes
  useEffect(() => {
    const handleCloudConnected = (event) => {
      // Refresh the navbar when cloud connections change
      console.log('Cloud connection changed, refreshing navbar state');
    };

    window.addEventListener('cloudConnected', handleCloudConnected);
    return () => window.removeEventListener('cloudConnected', handleCloudConnected);
  }, []);

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
    if (!isSessionActive) {
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    }
    
    if (hasConnectedProviders()) {
      navigate('/my-resumes');
    } else {
      navigate('/cloud-setup');
    }
    setMobileMenuOpen(false);
  };

  const handleCoverLetters = async () => {
    if (!isSessionActive) {
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    }
    
    if (hasConnectedProviders()) {
      navigate('/cover-letters');
    } else {
      navigate('/cloud-setup');
    }
    setMobileMenuOpen(false);
  };
 
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
 
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

  // Cloud status indicator component
  const CloudStatusIndicator = () => {
    if (!isSessionActive) return null;

    const cloudCount = connectedProviders.length;
    const hasProviders = hasConnectedProviders();

    return (
      <div className="relative" ref={cloudStatusRef}>
        <button 
          onClick={() => setShowCloudStatus(!showCloudStatus)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
            hasProviders
              ? darkMode 
                ? 'hover:bg-green-800/20 text-green-400' 
                : 'hover:bg-green-100 text-green-700'
              : darkMode
                ? 'hover:bg-red-800/20 text-red-400'
                : 'hover:bg-red-100 text-red-600'
          }`}
          title={hasProviders ? `${cloudCount} cloud provider${cloudCount !== 1 ? 's' : ''} connected` : 'No cloud providers connected'}
        >
          {hasProviders ? (
            <Cloud className="w-3 h-3" />
          ) : (
            <CloudOff className="w-3 h-3" />
          )}
          <span className="hidden sm:inline">
            {hasProviders ? `${cloudCount}` : 'No Cloud'}
          </span>
          <ChevronDown className="w-3 h-3" />
        </button>
        
        {/* Cloud status dropdown */}
        {showCloudStatus && (
          <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 py-2 w-48 rounded-lg shadow-xl z-20 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="px-3 py-1 border-b border-gray-200 dark:border-gray-700">
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cloud Storage Status
              </p>
            </div>
            
            {hasProviders ? (
              <>
                <div className="px-3 py-2">
                  <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} mb-2`}>
                    ✓ {cloudCount} provider{cloudCount !== 1 ? 's' : ''} connected:
                  </p>
                  {connectedProviders.map(provider => (
                    <div key={provider} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                      • {provider.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <button
                    onClick={handleCloudSetup}
                    className={`w-full text-left px-3 py-1 text-xs transition-colors ${
                      darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    Manage Cloud Storage
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-3 py-2">
                  <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-600'} mb-2`}>
                    ⚠ No cloud storage connected
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                    Connect your cloud storage to save and access your CVs.
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <button
                    onClick={handleCloudSetup}
                    className={`w-full text-left px-3 py-1 text-xs font-medium transition-colors ${
                      darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    Connect Cloud Storage
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
              {/* Always show these public links */}
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
                <FileText className="w-3 h-3" /> {t('revamp.browse')}
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
                <FileSignature className="w-3 h-3" /> {t('resumeDashboard.buttons.createNew')}
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
                <FileText className="w-3 h-3" /> {t('navigation.coverLetter')}
              </Link>

              {/* Show these only when session is active */}
              {isSessionActive && (
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
                    <FileText className="w-3 h-3" /> {t('navigation.myResumes')}
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
              
              {/* Language dropdown menu */}
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
              aria-label={darkMode ? t('app.theme.light') : t('app.theme.dark')}
              className={`p-1.5 rounded-full transition-colors focus:outline-none ${
                darkMode 
                  ? 'text-yellow-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Clear Session Button for Desktop (replaces Sign Out) */}
            {isSessionActive && (
              <button
                onClick={handleSignOut}
                className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  darkMode
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                }`}
                title="Clear current session and cloud connections"
              >
                <LogOut className="w-3 h-3" /> Clear Session
              </button>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full focus:outline-none transition-colors"
              aria-label={t('navigation.toggleMenu')}
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

      {/* Mobile menu - slide down animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="px-3 py-3 space-y-2">
          {/* Always show public links */}
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
            <FileText className="w-4 h-4" /> {t('revamp.browse')}
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
            <FileSignature className="w-4 h-4" /> {t('resumeDashboard.buttons.createNew')}
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
            <FileText className="w-4 h-4" /> {t('navigation.coverLetter')}
          </Link>

          {/* Show session-dependent links */}
          {isSessionActive && (
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
                <FileText className="w-4 h-4" /> {t('navigation.myResumes')}
              </button>
              
              <button
                onClick={handleCoverLetters}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm w-full rounded-lg transition-colors ${
                  isActive('/cover-letters')
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white' 
                    : darkMode
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-800 hover:bg-white/20 hover:text-gray-900'
                }`}
              >
                <FileSignature className="w-4 h-4" /> {t('navigation.coverLetters', 'Cover Letters')}
              </button>

              {/* Cloud Storage Management */}
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
                <Cloud className="w-4 h-4" /> Cloud Storage
              </button>
              
              <button
                onClick={handleSignOut}
                className={`w-full ${isRTL ? 'text-right' : 'text-left'} flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                }`}
              >
                <LogOut className="w-4 h-4" /> Clear Session
              </button>
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