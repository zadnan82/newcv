import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import TemplateRenderer from './components/auth-resume/template-selector/TemplateRenderer'; 
import useResumeStore from './stores/resumeStore'; 
import { Printer, ArrowLeft, Download } from 'lucide-react'; // Import icons

const CV = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      try {
        // Use the store's fetchResume function that already handles authentication
        const resumeData = await fetchResume(resumeId);
        
        if (resumeData) {
          setResumeData(resumeData);
          
          if (resumeData.personal_info?.full_name) {
            document.title = `${resumeData.personal_info.full_name} - Resume`;
          }
        } else {
          throw new Error('Failed to load resume');
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || 'Failed to load resume');
      } finally {
        setLoading(false);
        dataFetchedRef.current = true;
      }
    };
    
    loadResume();
  }, [resumeId, fetchResume]);

  // Simple print function
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
    accentColor: resumeData.customization.accent_color,
    fontFamily: resumeData.customization.font_family,
    lineSpacing: resumeData.customization.line_spacing,
    headingsUppercase: resumeData.customization.headings_uppercase,
    hideSkillLevel: resumeData.customization.hide_skill_level
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed floating controls - stacked vertically on mobile, side by side on desktop */}
      <div className="fixed bottom-6 right-6 flex flex-col md:flex-row gap-3 print:hidden z-50">
        <Link 
          to="/my-resumes" 
          className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Link>
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
            templateId={resumeData.template}
            formData={resumeData}
            customSettings={finalCustomSettings}
            darkMode={false}
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