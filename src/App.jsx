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

// Import the new stores
import useSessionStore from './stores/sessionStore';
import useAuthStore from './stores/authStore'; // Keep for backward compatibility during transition
import CloudSetup from './components/clouds/CloudSetup';
import CloudCallback from './components/clouds/CloudCallback';
import CloudConnectionSuccess from './components/clouds/CloudConnectionSuccess';

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

// Enhanced Route Protection Component for Cloud Storage
const CloudProtectedRoute = ({ children, requiresCloudSetup = true }) => {
  const { isSessionActive, hasConnectedProviders, showCloudSetup, loading } = useSessionStore();

  // Show loading while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If no active session, redirect to home
  if (!isSessionActive) {
    return <Navigate to="/" replace />;
  }

  // If requires cloud setup and no providers connected, show cloud setup
  if (requiresCloudSetup && !hasConnectedProviders()) {
    return <CloudSetup darkMode={localStorage.getItem('theme') === 'dark'} />;
  }

  return children;
};

// Backward Compatibility Route Protection (for old auth system)
const LegacyProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

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

  // Session store for new cloud-based system
  const { 
    isSessionActive, 
    hasConnectedProviders, 
    initialize: initializeSession 
  } = useSessionStore();

  // Auth store for backward compatibility
  const { isAuthenticated } = useAuthStore();

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
   
  // Initialize session on app load
  useEffect(() => {
    initializeSession().catch(console.error);
  }, [initializeSession]);

  // Handle legacy auth system during transition
  useEffect(() => {
    const { token, refreshUserInfo } = useAuthStore.getState();
    if (token) {
      refreshUserInfo();
    }
  }, []);

  // Listen for session expiration
  useEffect(() => {
    const handleSessionExpired = () => {
      // Could show a toast notification here
      console.log('Session expired, please refresh to continue');
    };

    window.addEventListener('sessionExpired', handleSessionExpired);
    return () => window.removeEventListener('sessionExpired', handleSessionExpired);
  }, []);

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

  return (
    <Router basename="/">
      <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen flex flex-col`}>
        <Toaster position="top-center" />
        <CookieConsent />
  
        <Routes>
  {/* Public Resume Routes - No Navbar/Footer */}
  <Route path="/cv/:userName/:userId/:resumeId" element={<PublicResumeViewer />} />
  <Route path="/cv/:resumeId" element={<PublicResumeViewer />} />
  
  {/* Cloud OAuth Callback Route */}
  <Route path="/api/cloud/callback/:provider" element={<CloudCallback darkMode={darkMode} />} />
  
  {/* Cloud Connection Success Route - NEW */}
  <Route path="/cloud/connected" element={<CloudConnectionSuccess darkMode={darkMode} />} />
  
  {/* Legacy protected route for existing resume viewer */}
  <Route path="/resume/:resumeId" element={
    <LegacyProtectedRoute>
      <CV darkMode={darkMode} />
    </LegacyProtectedRoute>
  } />

          {/* All other routes with Navbar and Footer */}
          <Route path="*" element={
            <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home darkMode={darkMode} />} />
                <Route path="/privacy" element={<PrivacyPolicy darkMode={darkMode} />} />
                <Route path="/terms" element={<TermsAndConditions darkMode={darkMode} />} />
                <Route path="/data-deletion" element={<DataDeletion darkMode={darkMode} />} />
                <Route path="/cookies" element={<CookiePolicy darkMode={darkMode} />} />
                <Route path="/contact" element={<Contact darkMode={darkMode} />} />
                <Route path="/feedback" element={<FeedbackPage darkMode={darkMode} />} />
                <Route path="/rc-public" element={<RCPublic darkMode={darkMode} />} />

                {/* Cloud Setup Route */}
                <Route path="/cloud-setup" element={<CloudSetup darkMode={darkMode} />} />

                {/* UPDATED: Cloud-Protected Routes (New System) */}
                <Route path="/new-resume" element={
                  <CloudProtectedRoute requiresCloudSetup={true}>
                    <NewResumeBuilder darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                <Route path="/my-resumes" element={
                  <CloudProtectedRoute requiresCloudSetup={true}>
                    <ResumeDashboard darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                <Route path="/edit-resume/:resumeId" element={
                  <CloudProtectedRoute requiresCloudSetup={true}>
                    <EditResumeBuilder darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                <Route path="/cover-letters" element={
                  <CloudProtectedRoute requiresCloudSetup={true}>
                    <CoverLetterDashboard darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                <Route path="/cover-letter/:id/edit" element={
                  <CloudProtectedRoute requiresCloudSetup={true}>
                    <CoverLetterEditor darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                <Route path="/cover-letter" element={
                  <CloudProtectedRoute requiresCloudSetup={true}>
                    <CoverLetter darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                <Route path="/resume-customizer" element={
                  <CloudProtectedRoute requiresCloudSetup={false}>
                    <ResumeCustomizer darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                <Route path="/resume-preview" element={
                  <CloudProtectedRoute requiresCloudSetup={false}>
                    <ResumePreview darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                <Route path="/job-matching" element={
                  <CloudProtectedRoute requiresCloudSetup={true}>
                    <JobMatching darkMode={darkMode} />
                  </CloudProtectedRoute>
                } />

                {/* LEGACY: Keep old auth-protected routes for transition period */}
                {/* These can be gradually migrated or removed */}
                <Route path="/login" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">Welcome to the New CV Platform!</h2>
                      <p className="mb-4">We've upgraded to a privacy-first system.</p>
                      <p className="mb-6">No more user accounts - your data stays in YOUR cloud storage.</p>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                } />

                <Route path="/register" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">No Registration Required!</h2>
                      <p className="mb-4">Our new system doesn't need user accounts.</p>
                      <p className="mb-6">Just connect your cloud storage and start building.</p>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Start Building Your CV
                      </button>
                    </div>
                  </div>
                } />

                {/* Legacy admin routes - these might need special handling */}
                <Route path="/settings" element={
                  <CloudProtectedRoute requiresCloudSetup={false}>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Cloud Storage Settings</h2>
                        <p className="mb-6">Manage your connected cloud storage providers</p>
                        <button 
                          onClick={() => window.location.href = '/cloud-setup'}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Manage Cloud Storage
                        </button>
                      </div>
                    </div>
                  </CloudProtectedRoute>
                } />

                {/* Catch-all for unknown routes */}
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