// src/Navbar.jsx - Updated for cloud storage system
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Cloud, 
  FileText, 
  Settings, 
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Loader2,
  LogOut,
  HardDrive
} from 'lucide-react';
import useSessionStore from './stores/sessionStore';
import cvatiLogo from './assets/cvlogo.png';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCloudDropdown, setShowCloudDropdown] = useState(false);

  // Session store for cloud-based system
  const {
    isSessionActive,
    hasConnectedProviders,
    connectedProviders,
    providersStatus,
    loading,
    disconnectProvider,
    setShowCloudSetup,
    checkCloudStatus
  } = useSessionStore();

  // Refresh cloud status periodically
  useEffect(() => {
    if (isSessionActive && hasConnectedProviders()) {
      const interval = setInterval(() => {
        checkCloudStatus();
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isSessionActive, hasConnectedProviders, checkCloudStatus]);

  const handleCloudSetup = () => {
    setShowCloudSetup(true);
    navigate('/cloud-setup');
    setIsMenuOpen(false);
    setShowCloudDropdown(false);
  };

  const handleMyResumes = () => {
    if (hasConnectedProviders()) {
      navigate('/my-resumes');
    } else {
      navigate('/cloud-setup');
    }
    setIsMenuOpen(false);
  };

  const handleCreateResume = () => {
    if (hasConnectedProviders()) {
      navigate('/new-resume');
    } else {
      navigate('/cloud-setup');
    }
    setIsMenuOpen(false);
  };

  const handleDisconnectProvider = async (provider) => {
    try {
      await disconnectProvider(provider);
      if (!hasConnectedProviders()) {
        navigate('/cloud-setup');
      }
    } catch (error) {
      console.error('Failed to disconnect provider:', error);
    }
    setShowCloudDropdown(false);
  };

  const getProviderIcon = (providerId) => {
    const icons = {
      'google_drive': '🗂️',
      'onedrive': '☁️',
      'dropbox': '📦',
      'box': '📁'
    };
    return icons[providerId] || '☁️';
  };

  const getProviderDisplayName = (providerId) => {
    const names = {
      'google_drive': 'Google Drive',
      'onedrive': 'OneDrive',
      'dropbox': 'Dropbox',
      'box': 'Box'
    };
    return names[providerId] || providerId;
  };

  const CloudStatusButton = () => {
    if (!isSessionActive) {
      return (
        <button
          onClick={handleCloudSetup}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Cloud className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Initialize</span>
        </button>
      );
    }

    if (loading) {
      return (
        <button
          disabled
          className={`flex items-center px-4 py-2 rounded-lg ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span className="hidden sm:inline">Connecting...</span>
        </button>
      );
    }

    if (!hasConnectedProviders()) {
      return (
        <button
          onClick={handleCloudSetup}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Connect Storage</span>
        </button>
      );
    }

    if (connectedProviders.length === 1) {
      const provider = connectedProviders[0];
      const status = providersStatus[provider];
      
      return (
        <button
          onClick={() => setShowCloudDropdown(!showCloudDropdown)}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors relative ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <span className="mr-2">{getProviderIcon(provider)}</span>
          <CheckCircle className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{getProviderDisplayName(provider)}</span>
          <ChevronDown className="w-4 h-4 ml-1" />
          
          {showCloudDropdown && (
            <div className={`absolute top-full right-0 mt-2 w-64 rounded-lg shadow-lg z-50 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getProviderIcon(provider)}</span>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {getProviderDisplayName(provider)}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        Connected • {status?.email || 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={handleMyResumes}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    My Resumes
                  </button>
                  
                  <button
                    onClick={handleCloudSetup}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Manage Storage
                  </button>
                  
                  <hr className={`my-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                  
                  <button
                    onClick={() => handleDisconnectProvider(provider)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      darkMode ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}
        </button>
      );
    }

    // Multiple providers connected
    return (
      <button
        onClick={() => setShowCloudDropdown(!showCloudDropdown)}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors relative ${
          darkMode 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        <HardDrive className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">{connectedProviders.length} Connected</span>
        <ChevronDown className="w-4 h-4 ml-1" />
        
        {showCloudDropdown && (
          <div className={`absolute top-full right-0 mt-2 w-72 rounded-lg shadow-lg z-50 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-4">
              <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Connected Storage
              </h3>
              
              {connectedProviders.map(provider => {
                const status = providersStatus[provider];
                return (
                  <div key={provider} className={`flex items-center justify-between p-2 rounded mb-2 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getProviderIcon(provider)}</span>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {getProviderDisplayName(provider)}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {status?.email || 'Connected'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisconnectProvider(provider)}
                      className={`p-1 rounded transition-colors ${
                        darkMode ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              
              <hr className={`my-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} />
              
              <div className="space-y-2">
                <button
                  onClick={handleMyResumes}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  My Resumes
                </button>
                
                <button
                  onClick={handleCloudSetup}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Manage Storage
                </button>
              </div>
            </div>
          </div>
        )}
      </button>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
    } backdrop-blur-sm border-b transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={cvatiLogo} alt="CVATI" className="h-8 w-auto" />
            <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 hidden sm:inline`}>
              CVATI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Navigation Links */}
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? darkMode ? 'text-purple-400' : 'text-purple-600'
                  : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('navigation.home', 'Home')}
            </Link>

            {hasConnectedProviders() && (
              <>
                <button
                  onClick={handleMyResumes}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/my-resumes' 
                      ? darkMode ? 'text-purple-400' : 'text-purple-600'
                      : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Resumes
                </button>

                <button
                  onClick={handleCreateResume}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    darkMode
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  Create Resume
                </button>
              </>
            )}

            {/* Privacy Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              Privacy-First
            </div>

            {/* Cloud Status */}
            <CloudStatusButton />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? darkMode ? 'text-purple-400' : 'text-purple-600'
                    : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('navigation.home', 'Home')}
              </Link>

              {hasConnectedProviders() && (
                <>
                  <button
                    onClick={handleMyResumes}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                      location.pathname === '/my-resumes' 
                        ? darkMode ? 'text-purple-400' : 'text-purple-600'
                        : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    My Resumes
                  </button>

                  <button
                    onClick={handleCreateResume}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      darkMode
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    Create Resume
                  </button>
                </>
              )}

              {/* Cloud Status in Mobile */}
              <div className="px-4">
                <CloudStatusButton />
              </div>

              {/* Privacy Badge in Mobile */}
              <div className="px-4">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  🔒 Privacy-First Platform
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close cloud dropdown */}
      {showCloudDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCloudDropdown(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;