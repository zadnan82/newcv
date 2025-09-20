// // PublicCVView.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import { useTranslation } from 'react-i18next'; 
// import axios from 'axios';
// import TemplateRenderer from '../template-selector/TemplateRenderer';

// const PublicCVView = () => {
//   const { t } = useTranslation();
//   const { resumeId } = useParams();
//   const [searchParams] = useSearchParams();
//   const [resumeData, setResumeData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); 
//   const customSettings = {
//     template: searchParams.get('template') || 'stockholm',
//     accentColor: searchParams.get('color') ? `#${searchParams.get('color')}` : '#6366f1',
//     fontFamily: searchParams.get('font') || 'Helvetica, Arial, sans-serif',
//     lineSpacing: parseFloat(searchParams.get('spacing')) || 1.5,
//     headingsUppercase: searchParams.get('uppercase') === 'true',
//     hideSkillLevel: searchParams.get('hideSkill') === 'true'
//   };
  
//   useEffect(() => {
//     const fetchResumeData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/resume/public/${resumeId}`);
//         setResumeData(response.data);
//       } catch (err) {
//         console.error('Error fetching resume:', err);
//         setError(err.response?.data?.detail || 'Failed to load resume');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (resumeId) {
//       fetchResumeData();
//     }
//   }, [resumeId]);
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
//         {/* Background Elements */}
//         <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//         </div>
        
//         <div className="text-center relative z-10">
//           <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent mb-3"></div>
//           <p className="text-sm">{t('resume.loading')}</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
//         {/* Background Elements */}
//         <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//         </div>
        
//         <div className="text-center relative z-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-sm">
//           <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-medium mb-1 text-gray-800">{t('common.error')}</h2>
//           <p className="text-sm text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (!resumeData) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
//         {/* Background Elements */}
//         <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//         </div>
        
//         <div className="text-center relative z-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-sm">
//           <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-medium mb-1 text-gray-800">{t('resume.not_found.title')}</h2>
//           <p className="text-sm text-gray-600">{t('resume.not_found.message')}</p>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-3 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20">
//       {/* Background Elements */}
//       <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//         <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
//         <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
//         <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//       </div>
      
//       <div className="mb-3 w-full max-w-4xl relative z-10">
//         <h1 className="text-xl font-medium text-gray-800">{resumeData.personal_info?.full_name || t('resume.title')}</h1>
//         <p className="text-sm text-gray-600">{t('resume.shared_view')}</p>
//       </div>
      
//       <div className="w-full max-w-4xl overflow-auto bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md relative z-10">
//         <TemplateRenderer
//           templateId={customSettings.template}
//           formData={resumeData}
//           customSettings={customSettings}
//           darkMode={false} // Always use light mode for shared CVs
//           scale={1} // Full scale
//           isPdfMode={false}
//         />
//       </div>
//     </div>
//   );
// };

// export default PublicCVView;