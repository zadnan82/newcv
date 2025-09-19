// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import API_BASE_URL from '../../../config';  
// import useAuthStore from '../../../stores/authStore';  

// const PublicToggle = ({ resumeId, isPublic = false, isDarkMode = false, onStatusChange = () => {} }) => {
//   const { t } = useTranslation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentStatus, setCurrentStatus] = useState(isPublic);
//   const [error, setError] = useState(null);
//   const { token } = useAuthStore(); 
  
//   const togglePublicStatus = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       // Make a direct API call to update the resume's public status
//       const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           is_public: !currentStatus
//         })
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to update resume status');
//       }
      
//       // Toggle the status locally
//       setCurrentStatus(!currentStatus);
      
//       // Call the callback to notify parent component
//       onStatusChange(!currentStatus);
      
//     } catch (err) {
//       console.error('Error toggling public status:', err);
//       setError(err.message || 'An error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   return (
//     <div className={`p-3 border rounded-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-300'}`}>
//       <h4 className={`text-xs font-medium mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//         {t('resume.publicStatus.title', 'Resume Privacy')}
//       </h4>
      
//       <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//         {currentStatus 
//           ? t('resume.publicStatus.public_description', 'Your resume is currently public. Anyone with the link can view it.')
//           : t('resume.publicStatus.private_description', 'Your resume is currently private. Only you can view it.')
//         }
//       </p>
      
//       <div className="flex items-center mb-2">
//         <span className={`mr-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//           {t('resume.publicStatus.status', 'Status')}:
//         </span>
//         <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
//           currentStatus 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-yellow-100 text-yellow-800'
//         }`}>
//           {currentStatus ? t('resume.publicStatus.public', 'Public') : t('resume.publicStatus.private', 'Private')}
//         </span>
//       </div>
      
//       {error && (
//         <div className="mb-2 text-xs text-red-500">
//           {error}
//         </div>
//       )}
      
//       <button
//         onClick={togglePublicStatus}
//         disabled={isLoading}
//         className={`w-full py-1.5 px-3 rounded-full text-xs font-medium transition-colors ${
//           isLoading
//             ? (isDarkMode ? 'bg-gray-700 cursor-wait' : 'bg-gray-300 cursor-wait')
//             : currentStatus
//               ? (isDarkMode ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-md' : 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-md hover:shadow-pink-500/20')
//               : (isDarkMode ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-md' : 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-md hover:shadow-blue-500/20')
//         } text-white`}
//       >
//         {isLoading
//           ? t('common.loading', 'Loading...')
//           : currentStatus
//             ? t('resume.publicStatus.make_private', 'Make Resume Private')
//             : t('resume.publicStatus.make_public', 'Make Resume Public')
//         }
//       </button>
//     </div>
//   );
// };

// export default PublicToggle;