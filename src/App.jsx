import { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
// import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Removed HashRouter
import { useTranslation } from 'react-i18next';
import Home from './Home';  
import CoverLetter from './components/auth-coverletter/CoverLetter';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';  
import Settings from './components/auth/settings'; 
import CVAIEnhancement from './components/auth-resume/view-cv/CVAIEnhancement'; 
import Navbar from './Navbar';
import Footer from './Footer'; 
import ResumePreview from './components/auth-resume/view-cv/ResumePreview';
import ResumeCustomizer from './components/auth-resume/template-selector/ResumeCustomizer';
import { Toaster } from 'react-hot-toast'; 
import SocialCallback from './components/auth/SocialCallback';
import SocialError from './components/auth/SocialError';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsAndConditions from './components/legal/TermsAndConditions';
import DataDeletion from './components/legal/DataDeletion';
import Contact from './components/legal/Contact';
import CookiePolicy from './components/legal/CookiePolicy'; 
import CV from './CV';
import PublicCVView from './components/auth-resume/public-cv/PublicCVView';
import PublicResumeViewer from './components/auth-resume/public-cv/PublicResumeViewer';
import useAuthStore from './stores/authStore';
import ResumeDashboard from './components/auth-resume/ResumeDashboard';
import NewResumeBuilder from './components/auth-resume/view-cv/NewResumeBuilder';
import EditResumeBuilder from './components/auth-resume/view-cv/EditResumeBuilder';
import CoverLetterDashboard from './components/auth-coverletter/CoverLetterDashboard';
import CoverLetterEditor from './components/auth-coverletter/CoverLetterEditor';
import ResetPassword from './components/auth/ResetPassword';
import CookieConsent from './components/legal/CookieConsent';
import AdminDashboard from './components/admin/AdminDashboard';
import CreateAdmin from './components/admin/CreateAdmin'; 
import FeedbackButton from './components/feedback/FeedbackButton'; 
import FeedbackPage from './components/feedback/FeedbackPage'; // Import the new feedback page
import FeedbackDashboard from './components/feedback/FeedbackDashboard';
import RCPublic from './components/customizer-public/RCPublic';
import JobMatching from './components/job-matching/JobMatching';
import JobSearchComponent from './components/job-search/JobSearch';

// ============ START OF HTTPS ENFORCEMENT ============
// Monkey patch fetch to force HTTPS for api.cvati.com
// More aggressive approach to force HTTPS
(() => { 
  
  // Override the entire fetch function
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    let [resource, config] = args;
    
    // Convert URL objects to strings for easier manipulation
    if (resource instanceof Request) {
      // Clone the request to modify it
      const originalRequest = resource;
      const url = new URL(originalRequest.url);
      
      if (url.hostname.includes('api.cvati.com')) {
        url.protocol = 'https:';
        console.log(`Upgraded Request URL to: ${url.toString()}`);
        
        // Create a new Request with the HTTPS URL
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
        // Handle string URLs
        try {
          // Try to parse as URL if it has a protocol
          if (resource.includes('://')) {
            const url = new URL(resource);
            url.protocol = 'https:';
            resource = url.toString();
          } 
          // Handle domain without protocol
          else if (resource.startsWith('api.cvati.com')) {
            resource = 'https://' + resource;
          }
          // Handle just the paths
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
  
  // Also intercept XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === 'string' && url.includes('api.cvati.com')) {
      // Replace protocol with HTTPS
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      // Add protocol if missing
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
  
  // Try to prevent HTTP requests before they happen by intercepting URL objects
  const originalURL = window.URL;
  window.URL = function(...args) {
    const url = new originalURL(...args);
    
    // If we're creating a URL for the API, ensure it uses HTTPS
    if (url.hostname.includes('api.cvati.com') && url.protocol === 'http:') {
      url.protocol = 'https:';
      console.log(`Corrected URL protocol during creation: ${url.toString()}`);
    }
    
    return url;
  };
  window.URL.prototype = originalURL.prototype;
  window.URL.createObjectURL = originalURL.createObjectURL;
  window.URL.revokeObjectURL = originalURL.revokeObjectURL;
   
})();
 

useAuthStore.getState();
 
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
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }); 

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
 
  useEffect(() => {
    // Save preference to local storage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    // Apply dark mode class to html element if needed
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
   
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en';
    // Set direction for RTL languages if needed
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);
   
  useEffect(() => {
    // Check authentication on app load
    const { token, user } = useAuthStore.getState(); 
    
    // Trigger auth change event to update UI
    window.dispatchEvent(new Event('authChange'));
  }, []);
   

  useEffect(() => {
    const { token, refreshUserInfo } = useAuthStore.getState();
    if (token) {
      refreshUserInfo();
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't made an explicit choice
      if (localStorage.getItem('theme') === null) {
        setDarkMode(e.matches);
      }
    };
    
    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <Router basename="/">
      <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen flex flex-col`}>
        <Toaster position="top-center" />
        {/* Place CookieConsent outside of Routes */}
        <CookieConsent />
  
        <Routes>
          {/* Public Resume Routes - No Navbar/Footer */}
          <Route path="/cv/:userName/:userId/:resumeId" element={<PublicResumeViewer />} />
          <Route path="/cv/:resumeId" element={<PublicResumeViewer />} />
          
          <Route path="/resume/:resumeId" element={
                  <ProtectedRoute>
                    <CV darkMode={darkMode} />
                  </ProtectedRoute>
                } />

                
          {/* All other routes with Navbar and Footer */}
          <Route path="*" element={
            <MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <Routes>
                <Route path="/login" element={<Login darkMode={darkMode} />} />
                <Route path="/register" element={<Register darkMode={darkMode} />} />
                <Route path="/reset-password" element={<ResetPassword darkMode={darkMode} />} />
                <Route path="/" element={<Home darkMode={darkMode} />} />  
                <Route path="/oauth-callback" element={<SocialCallback darkMode={darkMode} />} />
                <Route path="/auth/social-error" element={<SocialError />} />
                <Route path="/public-cv-view" element={<PublicCVView />} /> 
                <Route path="/new-resume" element={<NewResumeBuilder darkMode={darkMode} />} />
                <Route path="/rc-public" element={<RCPublic darkMode={darkMode} />} />
                <Route path="/cover-letter" element={<CoverLetter darkMode={darkMode} /> } /> 
                {/* Legal and information pages */}
                <Route path="/privacy" element={<PrivacyPolicy darkMode={darkMode} />} />
                <Route path="/terms" element={<TermsAndConditions darkMode={darkMode} />} />
                <Route path="/data-deletion" element={<DataDeletion darkMode={darkMode} />} />
                <Route path="/cookies" element={<CookiePolicy darkMode={darkMode} />} />
                <Route path="/contact" element={<Contact darkMode={darkMode} />} /> 
                {/* New Feedback Page Route */}
                <Route path="/feedback" element={<FeedbackPage darkMode={darkMode} />} />
                <Route path="/job-matching" element={<JobMatching darkMode={darkMode} />} />

{/*                 
                <Route path="/job-search" element={<JobSearchComponent darkMode={darkMode} />} /> */}

                <Route path="/admin/dashboard" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard darkMode={darkMode} />
                  </ProtectedRoute>
                } />

                <Route path="/admin/create" element={
                  <ProtectedRoute adminOnly={true}>
                    <CreateAdmin darkMode={darkMode} />
                  </ProtectedRoute>
                } />

                {/* New admin feedback dashboard route */}
                <Route path="/admin/feedback" element={
                  <ProtectedRoute adminOnly={true}>
                    <FeedbackDashboard darkMode={darkMode} />
                  </ProtectedRoute>
                } />

                {/* Protected routes */}
                <Route path="/my-resumes" element={
                  <ProtectedRoute>
                    <ResumeDashboard darkMode={darkMode} />
                  </ProtectedRoute>
                } />
                {/* Edit resume builder */}
                <Route path="/edit-resume/:resumeId" element={
                  <ProtectedRoute>
                    <EditResumeBuilder darkMode={darkMode} />
                  </ProtectedRoute>
                } />               
                {/* New Cover Letter Dashboard */}
                <Route path="/cover-letters" element={
                  <ProtectedRoute>
                    <CoverLetterDashboard darkMode={darkMode} />
                  </ProtectedRoute>
                } />
                {/* Edit Cover Letter */}
                <Route path="/cover-letter/:id/edit" element={
                  <ProtectedRoute>
                    <CoverLetterEditor darkMode={darkMode} />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings darkMode={darkMode} />
                  </ProtectedRoute>
                } />
               
                <Route path="/cv-ai-enhancement" element={
                  <ProtectedRoute>
                    <CVAIEnhancement darkMode={darkMode} />
                  </ProtectedRoute>
                } />
                <Route path="/resume-customizer" element={
                  <ProtectedRoute>
                    <ResumeCustomizer darkMode={darkMode} />
                  </ProtectedRoute>
                } />
                <Route path="/resume-preview" element={
                  <ProtectedRoute>
                    <ResumePreview darkMode={darkMode} />
                  </ProtectedRoute>
                } />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;