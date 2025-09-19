import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import TemplateRenderer from './components/auth-resume/template-selector/TemplateRenderer'; 
import useResumeStore from './stores/resumeStore'; 
import { ArrowLeft, Download, Share, Eye } from 'lucide-react';
import { decompressCV, hasEncodedCV } from './utils/cvEncoder';

const CV = ({ darkMode = false }) => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPublicView, setIsPublicView] = useState(false);
  const { userName, userId, resumeId } = useParams();
  const { fetchResume } = useResumeStore(); 
  const dataFetchedRef = useRef(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    
    const loadResume = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if this is a public CV with encoded data in hash
        if (hasEncodedCV(location)) {
          const encodedData = location.hash.substring(1);
          const cvData = decompressCV(encodedData);
          
          setResumeData(cvData);
          setIsPublicView(true);
          
          // Set page title
          if (cvData.personal_info?.full_name) {
            document.title = `${cvData.personal_info.full_name} - Resume`;
          } else {
            document.title = `${cvData.title || 'Resume'}`;
          }
          
        } else if (resumeId) {
          // Original authenticated flow for private CVs
          const resumeData = await fetchResume(resumeId);
          
          if (resumeData) {
            setResumeData(resumeData);
            setIsPublicView(false);
            
            if (resumeData.personal_info?.full_name) {
              document.title = `${resumeData.personal_info.full_name} - Resume`;
            }
          } else {
            throw new Error('Failed to load resume');
          }
          
        } else {
          throw new Error('No resume data found');
        }
        
      } catch (err) {
        console.error("Error loading CV:", err);
        setError(err.message || 'Failed to load resume');
      } finally {
        setLoading(false);
        dataFetchedRef.current = true;
      }
    };
    
    loadResume();
  }, []);

  // Handle sharing
  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resumeData.personal_info?.full_name || resumeData.title || 'Resume'}`,
          text: 'Check out this resume',
          url: currentUrl
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert('URL copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy URL');
      }
    }
  };

  // Print function
  const handleDownload = () => {
    window.print();
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent mb-4"></div>
          <p>Loading resume...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center max-w-md p-6 rounded-lg shadow-lg bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }
   
  if (!resumeData) {
    return null;
  }
   
  const finalCustomSettings = {
    accentColor: resumeData.customization?.accent_color || '#1a5276',
    fontFamily: resumeData.customization?.font_family || 'Helvetica, Arial, sans-serif',
    lineSpacing: resumeData.customization?.line_spacing || 1.5,
    headingsUppercase: resumeData.customization?.headings_uppercase || false,
    hideSkillLevel: resumeData.customization?.hide_skill_level || false
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Public CV indicator */}
      {isPublicView && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 print:hidden">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center text-blue-700 text-sm">
              <Eye className="h-4 w-4 mr-2" />
              <span>Public Resume View</span>
            </div>
            <div className="text-blue-600 text-xs">
              {resumeData._meta?.created && (
                <span>Created: {new Date(resumeData._meta.created).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed floating controls */}
      <div className="fixed bottom-6 right-6 flex flex-col md:flex-row gap-3 print:hidden z-50">
        {/* Back button - only for authenticated users */}
        {!isPublicView && (
          <Link 
            to="/my-resumes" 
            className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
        )}
        
        {/* Share button - only for public views */}
        {isPublicView && (
          <button 
            onClick={handleShare}
            className="p-3 bg-green-600 rounded-full shadow-md hover:bg-green-700 transition-colors"
            title="Share this resume"
          >
            <Share className="h-5 w-5 text-white" />
          </button>
        )}
        
        {/* Download/Print button */}
        <button 
          onClick={handleDownload}
          className="p-3 bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-colors"
          title="Print or Download as PDF"
        >
          <Download className="h-5 w-5 text-white" />
        </button>
      </div>
      
      {/* Main content with resume */}
      <main className="flex-grow flex flex-col items-center py-4">
        <div className="bg-white shadow-md w-full mx-auto print:shadow-none print:w-full print:max-w-none">
          <TemplateRenderer
            templateId={resumeData.customization?.template || 'stockholm'}
            formData={resumeData}
            customSettings={finalCustomSettings}
            darkMode={darkMode}
            scale={isMobile ? 0.6 : 1}
            isPdfMode={true}
          />
        </div>
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { 
            size: A4;
            margin: 5px;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CV;