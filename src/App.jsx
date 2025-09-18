// src/App.jsx - Redesigned for smooth local-first flow
import { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import Home from './Home';  
import CoverLetter from './components/auth-coverletter/CoverLetter';
import Navbar from './Navbar';
import Footer from './Footer'; 
import ResumePreview from './components/auth-resume/view-cv/ResumePreview';
import ResumeCustomizer from './components/auth-resume/template-selector/ResumeCustomizer';
import { Toaster } from 'react-hot-toast'; 
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsAndConditions from './components/legal/TermsAndConditions';
import DataDeletion from './components/legal/DataDeletion';
import Contact from './components/legal/Contact';
import CookiePolicy from './components/legal/CookiePolicy'; 
import CV from './CV';
import PublicCVView from './components/auth-resume/public-cv/PublicCVView';
import PublicResumeViewer from './components/auth-resume/public-cv/PublicResumeViewer';
import ResumeDashboard from './components/auth-resume/ResumeDashboard';
import NewResumeBuilder from './components/auth-resume/view-cv/NewResumeBuilder';
import EditResumeBuilder from './components/auth-resume/view-cv/EditResumeBuilder';
import CoverLetterDashboard from './components/auth-coverletter/CoverLetterDashboard';
import CoverLetterEditor from './components/auth-coverletter/CoverLetterEditor';
import CookieConsent from './components/legal/CookieConsent';
import FeedbackButton from './components/feedback/FeedbackButton'; 
import FeedbackPage from './components/feedback/FeedbackPage';
import RCPublic from './components/customizer-public/RCPublic';
import JobMatching from './components/job-matching/JobMatching'; 

// Import the unified store
import useSessionStore from './stores/sessionStore';
import CloudSetup from './components/clouds/CloudSetup';
import CloudCallback from './components/clouds/CloudCallback';
import CloudConnected from './components/clouds/CloudConnected';  

// ============ START OF HTTPS ENFORCEMENT ============
(() => { 
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    let [resource, config] = args;
    
    if (resource instanceof Request) {
      const originalRequest = resource;
      const url = new URL(originalRequest.url);
      
      if (url.hostname.includes('api.cvati.com')) {
        url.protocol = 'https:';
        console.log(`Upgraded Request URL to: ${url.toString()}`);
        
        resource = new Request(url.toString(), {
          method: originalRequest.method,
          headers: originalRequest.headers,
          body: originalRequest.body,
          mode: originalRequest.mode,
          credentials: originalRequest.credentials,
          cache: originalRequest.cache,
          redirect: originalRequest.redirect,
          referrer: originalRequest.referrer,
          integrity: originalRequest.integrity
        });
      }
    } else if (typeof resource === 'string') {
      if (resource.includes('api.cvati.com')) {
        try {
          if (resource.includes('://')) {
            const url = new URL(resource);
            url.protocol = 'https:';
            resource = url.toString();
          } 
          else if (resource.startsWith('api.cvati.com')) {
            resource = 'https://' + resource;
          }
          else if (resource.startsWith('/')) {
            resource = 'https://api.cvati.com' + resource;
          }
        } catch (e) {
          console.error('Error processing URL:', e);
        }
      }
    }
    
    return originalFetch.call(window, resource, config);
  };
  
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === 'string' && url.includes('api.cvati.com')) {
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      else if (!url.includes('://')) {
        if (url.startsWith('//')) {
          url = 'https:' + url;
        } else if (url.startsWith('api.cvati.com')) {
          url = 'https://' + url;
        }
      } 
    }
    return originalOpen.call(this, method, url, ...rest);
  };
})();

// Simple Loading Component
const AppLoading = ({ darkMode }) => (
  <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Loading CV Platform...
      </p>
    </div>
  </div>
);

// Main Layout Component
const MainLayout = ({ children, darkMode, toggleDarkMode }) => (
  <>
    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    <main className="pt-12">
      {children}
    </main>
    <Footer darkMode={darkMode} />
    <FeedbackButton darkMode={darkMode} />
  </>
);

function App() {
  const { i18n } = useTranslation();  
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme !== null) {
      return storedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }); 

  // Get session state
  const { 
    loading,
    initialize,
    showCloudUpgradeModal,
    hideCloudUpgrade,
    getUserExperience,
    userState // Add this to track initialization state
  } = useSessionStore();

  const [isInitialized, setIsInitialized] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
 
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
   
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en';
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);
   
  // Initialize app on load - ONLY ONCE, no dependencies
  useEffect(() => {
    if (!isInitialized) {
      console.log('🚀 App.jsx: Starting initialization...');
      setIsInitialized(true);
      
      // Call initialize directly from the store state, not from the hook
      useSessionStore.getState().initialize().catch(console.error);
    }
  }, [isInitialized]); // Remove 'initialize' from dependencies

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (localStorage.getItem('theme') === null) {
        setDarkMode(e.matches);
      }
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Show loading during initialization
  if (loading || !isInitialized) {
    return <AppLoading darkMode={darkMode} />;
  }

  return (
    <Router basename="/">
      <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen flex flex-col`}>
        <Toaster position="top-center" />
        <CookieConsent />
        
        {/* Save Decision Modal - Global */}
        {showCloudUpgradeModal && (
          <SaveDecisionModal 
            darkMode={darkMode} 
            onClose={hideCloudUpgrade}
          />
        )}
  
        <Routes>
          {/* Public Resume Routes - No Navbar/Footer */}
          <Route path="/cv/:userName/:userId/:resumeId" element={<PublicResumeViewer />} />
          <Route path="/cv/:resumeId" element={<PublicResumeViewer />} />
          
          {/* Cloud OAuth Callbacks */}
          <Route path="/cloud/callback/:provider" element={<CloudCallback darkMode={darkMode} />} /> 
          <Route path="/cloud/connected" element={<CloudConnected darkMode={darkMode} />} />

          {/* Legacy route for backward compatibility */}
          <Route path="/resume/:resumeId" element={<CV darkMode={darkMode} />} />

          {/* All other routes with Navbar and Footer */}
          <Route path="*" element={
            <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <Routes>
                {/* =============== PUBLIC ROUTES (Always Accessible) =============== */}
                <Route path="/" element={<Home darkMode={darkMode} />} />
                <Route path="/privacy" element={<PrivacyPolicy darkMode={darkMode} />} />
                <Route path="/terms" element={<TermsAndConditions darkMode={darkMode} />} />
                <Route path="/data-deletion" element={<DataDeletion darkMode={darkMode} />} />
                <Route path="/cookies" element={<CookiePolicy darkMode={darkMode} />} />
                <Route path="/contact" element={<Contact darkMode={darkMode} />} />
                <Route path="/feedback" element={<FeedbackPage darkMode={darkMode} />} />
                <Route path="/rc-public" element={<RCPublic darkMode={darkMode} />} />

                {/* =============== CORE FEATURES (Always Available - Local First) =============== */}
                
                {/* Resume Building - Always available with local storage */}
                <Route path="/new-resume" element={<NewResumeBuilder darkMode={darkMode} />} />
                <Route path="/edit-resume/:resumeId" element={<EditResumeBuilder darkMode={darkMode} />} />
                
                {/* Resume Customization - Always available */}
                <Route path="/resume-customizer" element={<ResumeCustomizer darkMode={darkMode} />} />
                <Route path="/resume-preview" element={<ResumePreview darkMode={darkMode} />} />
                
                {/* Cover Letter - Available locally, enhanced with cloud */}
                <Route path="/cover-letter" element={<CoverLetter darkMode={darkMode} />} />
                <Route path="/cover-letter/:id/edit" element={<CoverLetterEditor darkMode={darkMode} />} />
                
                {/* Job Matching - Works with local CVs too */}
                <Route path="/job-matching" element={<JobMatching darkMode={darkMode} />} />

                {/* =============== SAVED CONTENT (Local + Cloud) =============== */}
                
                {/* My Resumes - Shows local AND cloud CVs */}
                <Route path="/my-resumes" element={<ResumeDashboard darkMode={darkMode} />} />
                
                {/* Cover Letter Dashboard - Local + Cloud */}
                <Route path="/cover-letters" element={<CoverLetterDashboard darkMode={darkMode} />} />

                {/* =============== CLOUD SETUP (Optional Upgrade) =============== */}
                <Route path="/cloud-setup" element={<CloudSetup darkMode={darkMode} />} />

                {/* =============== LEGACY REDIRECTS =============== */}
                <Route path="/login" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <h2 className="text-2xl font-bold mb-4">No Login Required!</h2>
                      <p className="mb-4">Our platform works without user accounts.</p>
                      <p className="mb-6">Start building your CV immediately, then optionally connect cloud storage for sync across devices.</p>
                      <button 
                        onClick={() => window.location.href = '/new-resume'}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Start Building Your CV
                      </button>
                    </div>
                  </div>
                } />

                <Route path="/register" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <h2 className="text-2xl font-bold mb-4">No Registration Needed!</h2>
                      <p className="mb-4">Jump straight into building your CV.</p>
                      <p className="mb-6">Your data stays in your own cloud storage when you choose to save.</p>
                      <button 
                        onClick={() => window.location.href = '/new-resume'}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Start Building
                      </button>
                    </div>
                  </div>
                } />

                {/* Settings - Now shows storage management */}
                <Route path="/settings" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <h2 className="text-2xl font-bold mb-4">Storage Settings</h2>
                      <p className="mb-6">Manage your local and cloud storage options</p>
                      <div className="space-y-3">
                        <button 
                          onClick={() => window.location.href = '/my-resumes'}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          View My CVs
                        </button>
                        <button 
                          onClick={() => window.location.href = '/cloud-setup'}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Manage Cloud Storage
                        </button>
                      </div>
                    </div>
                  </div>
                } />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
         
      </div>
    </Router>
  );
}

export default App;