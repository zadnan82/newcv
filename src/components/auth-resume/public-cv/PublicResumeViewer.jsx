import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import TemplateRenderer from '../template-selector/TemplateRenderer'; 
import logoImg from '../../../assets/logo.png';
import logo2 from '../../../assets/logo2.png'; 
import { decompressCV, hasEncodedCV } from '../../../utils/cvEncoder';
import useSessionStore from '../../../stores/sessionStore';

const PublicResumeViewer = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPublicView, setIsPublicView] = useState(false);
  const { userName, userId, resumeId } = useParams(); 
  const { fetchResume, currentResume, loading: storeLoading, error: storeError } = useSessionStore(); 
  const dataFetchedRef = useRef(false); 
  const location = useLocation();
  
  // Handle both old query params AND new encoded data
  const queryParams = new URLSearchParams(location.search); 
  const defaultSettings = {
    template: queryParams.get('template') || 'stockholm',
    accentColor: queryParams.get('color') || '#6366f1',
    fontFamily: queryParams.get('font') || 'Helvetica, Arial, sans-serif',
    lineSpacing: parseFloat(queryParams.get('spacing')) || 1.5,
    headingsUppercase: queryParams.get('uppercase') === 'true',
    hideSkillLevel: queryParams.get('hideSkill') === 'true'
  };
  
  useEffect(() => {
    if (dataFetchedRef.current) return;
    
    const getResumeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // NEW: Check if this is an encoded public CV first
        if (hasEncodedCV(location)) {
          console.log('📖 Loading encoded public CV...');
          
          const encodedData = location.hash.substring(1);
          const cvData = decompressCV(encodedData);
          
          setResumeData(cvData);
          setIsPublicView(true);
          
          // Set page title
          if (cvData.personal_info?.full_name) {
            document.title = `${cvData.personal_info.full_name} - Resume`;
          }
          
          dataFetchedRef.current = true;
          console.log('✅ Encoded CV loaded successfully');
          return;
        }
        
        // OLD: Fallback to database lookup for legacy URLs
        if (!resumeId) {
          throw new Error('Resume ID is missing');
        }
        
        await fetchResume(resumeId);
        
        if (storeError) {
          throw new Error(storeError);
        }
        
        const storeResume = useSessionStore.getState().currentResume;
        
        if (!storeResume) {
          throw new Error('Resume not found');
        }
        
        console.log("Received resume data from store:", storeResume);
        
        // FIXED: Handle both 'photo' and 'photos' fields for Base64 compatibility
        const photoData = storeResume.photo || storeResume.photos || { photolink: null };
        
        // Transform to match format expected by TemplateRenderer
        const processedData = {
          id: storeResume.id,
          title: storeResume.title || 'Resume',
          personal_info: storeResume.personal_info || {
            full_name: '',
            title: '',
            email: '',
            mobile: '',
            city: '',
            address: '',
            postal_code: '',
            driving_license: '',
            nationality: '',
            place_of_birth: '',
            date_of_birth: '',
            linkedin: '',
            website: '',
            summary: ''
          },
          educations: storeResume.educations || [],
          experiences: storeResume.experiences || [],
          skills: storeResume.skills || [],
          languages: storeResume.languages || [],
          referrals: storeResume.referrals || [],
          custom_sections: storeResume.custom_sections || [],
          extracurriculars: storeResume.extracurriculars || [],
          hobbies: storeResume.hobbies || [],
          courses: storeResume.courses || [],
          internships: storeResume.internships || [],
          // FIXED: Use both 'photo' and 'photos' for backward compatibility
          photo: photoData,
          photos: photoData,
          template: storeResume.customization?.template || defaultSettings.template,
          customization: {
            accent_color: storeResume.customization?.accent_color || defaultSettings.accentColor,
            font_family: storeResume.customization?.font_family || defaultSettings.fontFamily,
            line_spacing: storeResume.customization?.line_spacing || defaultSettings.lineSpacing,
            headings_uppercase: storeResume.customization?.headings_uppercase !== undefined 
              ? storeResume.customization.headings_uppercase 
              : defaultSettings.headingsUppercase,
            hide_skill_level: storeResume.customization?.hide_skill_level !== undefined 
              ? storeResume.customization.hide_skill_level 
              : defaultSettings.hideSkillLevel
          }
        };
        
        // Debug logging for photo data
        console.log('📷 Photo data processing:', {
          original_photo: storeResume.photo,
          original_photos: storeResume.photos,
          processed_photo: photoData,
          has_photolink: !!photoData?.photolink,
          photolink_type: typeof photoData?.photolink,
          photolink_length: photoData?.photolink?.length || 0
        });
        
        setResumeData(processedData);
        setIsPublicView(false);
        dataFetchedRef.current = true;
        
        // Set document title with person's name
        if (processedData.personal_info?.full_name) {
          document.title = `${processedData.personal_info.full_name} - Resume`;
        }
        
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(`${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    getResumeData();
  }, [resumeId, fetchResume, storeError, location.hash]);  

  const Logo = () => {
    return (
      <div className='flex'> 
        <img 
          src={logoImg} 
          alt="Resume Builder Logo" 
          className="h-6 w-auto mr-2" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div class="h-6 w-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white flex items-center justify-center rounded-md font-medium mr-2">
                <span>RB</span>
              </div>
            `;
          }}
        />
        <img 
          src={logo2} 
          alt="Logo" 
          className="h-8 w-auto mr-2" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  };
   
  const isLoading = loading || storeLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent mb-3"></div>
          <p className="text-sm">Loading resume...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10 max-w-md p-4 rounded-lg shadow-md bg-white/80 backdrop-blur-sm">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-base font-medium mb-2">Error</h2>
          <p className="mb-3 text-sm">{error}</p>
          <Link to="/" className="px-3 py-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium rounded-full inline-block hover:shadow-sm hover:shadow-purple-500/20 transition-shadow">
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
    accentColor: resumeData.customization?.accent_color || defaultSettings.accentColor,
    fontFamily: resumeData.customization?.font_family || defaultSettings.fontFamily,
    lineSpacing: resumeData.customization?.line_spacing || defaultSettings.lineSpacing,
    headingsUppercase: resumeData.customization?.headings_uppercase !== undefined ? resumeData.customization.headings_uppercase : defaultSettings.headingsUppercase,
    hideSkillLevel: resumeData.customization?.hide_skill_level !== undefined ? resumeData.customization.hide_skill_level : defaultSettings.hideSkillLevel
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      {/* Professional header with logo and app name */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm py-2 px-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>
          
          <div className="text-xs flex items-center">
            {isPublicView && (
              <div className="flex items-center mr-4 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>Public View</span>
              </div>
            )}
            <span className="text-gray-600 mr-1">Viewing:</span>
            <span className="font-medium text-gray-900">{resumeData.personal_info?.full_name || 'Resume'}</span>
          </div>
          
          <div>
            <Link 
              to="/"
              className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
            >
              Create your own resume
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content with resume */}
      <main className="flex-grow flex flex-col items-center relative z-10">
        <div className="bg-white/90 backdrop-blur-sm shadow-md max-w-4xl w-full my-4 mx-auto">
          <TemplateRenderer
            templateId={resumeData.customization?.template || resumeData.template || 'stockholm'}
            formData={resumeData}
            customSettings={finalCustomSettings}
            darkMode={false}
            scale={1}
            isPdfMode={true}
          />
        </div>
      </main>
      
      {/* Simple footer with branding */}
      <footer className="relative z-10 bg-white/60 backdrop-blur-sm border-t border-gray-200/50 py-2">
        <div className="container mx-auto px-3">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
            <div className="mb-1 sm:mb-0">
              <span>Powered by CVATI</span>
            </div>
            <div className="flex space-x-3">
              <Link to="/about" className="hover:text-gray-700 transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-gray-700 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicResumeViewer;