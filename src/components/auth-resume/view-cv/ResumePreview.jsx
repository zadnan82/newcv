import React, { useState, useRef, useEffect } from 'react';
import HTMLResumeViewer from './HTMLResumeViewer';
import { useTranslation } from 'react-i18next';  

const ResumePreview = ({
  formData,
  darkMode = false,
  hasUserStartedFilling = false,
  isMobileView = false,
  isSaving = false,
  setIsSaving = () => {},
  showPlaceholders = false,
  showToast,
  onHTMLResumeRef, // New prop to handle ref
  hideButtons = false // New prop to hide buttons
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const resumeTitle = formData.title || t('resume.untitled', 'Untitled Resume');
  const htmlResumeRef = useRef(null);
  
  // Sample data for when no real data is provided
  const sampleResumeData = {
    title: "Sample Resume",
    personal_info: {
      full_name: "John Smith",
      title: "Software Developer",
      email: "john.smith@example.com",
      mobile: "+1 (123) 456-7890",
      city: "New York",
      address: "123 Main Street",
      postal_code: "10001",
      driving_license: "Yes",
      nationality: "American",
      place_of_birth: "New York",
      date_of_birth: "1990-01-01",
      linkedin: "linkedin.com/in/johnsmith",
      website: "johnsmith.com",
      summary: "Experienced software developer with a passion for creating elegant solutions."
    },
    educations: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Science",
        field_of_study: "Computer Science",
        location: "New York",
        start_date: "2010-09",
        end_date: "2014-06",
        current: false,
        gpa: "3.8"
      }
    ],
    experiences: [
      {
        company: "Tech Solutions Inc.",
        position: "Senior Developer",
        location: "New York",
        description: "Developed and maintained web applications using React and Node.js.",
        start_date: "2018-01",
        end_date: "2023-12",
        current: true
      },
      {
        company: "Digital Innovations",
        position: "Junior Developer",
        location: "Boston",
        description: "Worked on frontend development using HTML, CSS, and JavaScript.",
        start_date: "2014-07",
        end_date: "2017-12",
        current: false
      }
    ],
    skills: [
      { name: "JavaScript", level: "Expert" },
      { name: "React", level: "Advanced" },
      { name: "Node.js", level: "Intermediate" },
      { name: "HTML/CSS", level: "Expert" }
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "Spanish", level: "Intermediate" }
    ],
    referrals: [],
    custom_sections: [],
    extracurriculars: [],
    hobbies: [
      { name: "Photography" },
      { name: "Hiking" }
    ],
    courses: [],
    photo: { photolink: null },
    internships: []
  };
  
  // Make sure we have good data to display
  const currentData = hasUserStartedFilling ? formData : sampleResumeData;

  const showTemporaryMessage = (message, isError = false) => {
    if (isError) {
      setError(message);
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  
  // Pass ref to parent component
  useEffect(() => {
    if (onHTMLResumeRef && htmlResumeRef.current) {
      onHTMLResumeRef(htmlResumeRef.current);
    }
  }, [onHTMLResumeRef, htmlResumeRef.current]);

  const handleHTMLResumeRef = (ref) => {
    htmlResumeRef.current = ref;
    // Also call the parent's ref handler if available
    if (onHTMLResumeRef) {
      onHTMLResumeRef(ref);
    }
  };

  return (
   
     
        <div className={`flex justify-center py-2 md:py-4  ${
        darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'
      }`}>
          <HTMLResumeViewer 
            formData={currentData}
            darkMode={darkMode}
            onRef={handleHTMLResumeRef}
            isPdfExport={false}
            isMobileView={isMobileView}
          />
         {/* Error Message Display */}
      {error && (
        <div className={`fixed bottom-4 right-4 max-w-xs md:max-w-md px-4 py-3 rounded-xl shadow-lg z-50 backdrop-blur-sm ${
          darkMode 
            ? 'bg-red-900/80 border border-red-700 text-red-100' 
            : 'bg-red-100/90 border border-red-400 text-red-700'
        }`}>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Success Message Display */}
      {successMessage && (
        <div className={`fixed bottom-4 right-4 max-w-xs md:max-w-md px-4 py-3 rounded-xl shadow-lg z-50 backdrop-blur-sm ${
          darkMode 
            ? 'bg-green-900/80 border border-green-700 text-green-100' 
            : 'bg-green-100/90 border border-green-400 text-green-700'
        }`}>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
        </div>
 

       
  );
};

export default ResumePreview;