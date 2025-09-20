// // src/components/common/CVSelector.jsx - Reusable CV Selection Component

// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { 
//   ChevronDown, 
//   FileText, 
//   Cloud, 
//   HardDrive, 
//   User, 
//   RefreshCw, 
//   Search, 
//   Grid, 
//   List,
//   Calendar
// } from 'lucide-react';
// import useSessionStore from '../../../stores/sessionStore';
// import useAuthStore from '../../../stores/authStore';
// import API_BASE_URL from '../../../config';

// // Enhanced CV Selection Modal
// const CVSelectionModal = ({ 
//   isOpen, 
//   onClose, 
//   availableCVs, 
//   selectedCV, 
//   onSelectCV, 
//   isLoading, 
//   onRefresh,
//   isDarkMode,
//   title = "Select CV",
//   subtitle = "Choose which CV you'd like to work with"
// }) => {
//   const { t } = useTranslation();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

//   if (!isOpen) return null;

//   // Group CVs by source
//   const groupedCVs = availableCVs.reduce((groups, cv) => {
//     const source = cv.source;
//     if (!groups[source]) groups[source] = [];
//     groups[source].push(cv);
//     return groups;
//   }, {});

//   // Filter CVs based on search
//   const filteredGroupedCVs = {};
//   Object.keys(groupedCVs).forEach(source => {
//     const filtered = groupedCVs[source].filter(cv => 
//       (cv.title || cv.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (cv.personal_info?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     if (filtered.length > 0) {
//       filteredGroupedCVs[source] = filtered;
//     }
//   });

//   const getSourceLabel = (source) => {
//     switch (source) {
//       case 'draft': return 'Current Work Session';
//       case 'local': return 'Saved Locally';
//       case 'cloud': return 'Google Drive';
//       case 'api': return 'My Saved CVs';
//       default: return 'Unknown Source';
//     }
//   };

//   const getSourceIcon = (source) => {
//     switch (source) {
//       case 'draft': return <FileText className="w-4 h-4 text-purple-500" />;
//       case 'local': return <HardDrive className="w-4 h-4 text-green-500" />;
//       case 'cloud': return <Cloud className="w-4 h-4 text-blue-500" />;
//       case 'api': return <User className="w-4 h-4 text-orange-500" />;
//       default: return <FileText className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch {
//       return '';
//     }
//   };

//   const getCVPreview = (cv) => {
//     const name = cv.personal_info?.full_name || cv.content?.personal_info?.full_name || 'No name';
//     const title = cv.personal_info?.title || cv.content?.personal_info?.title || '';
//     const email = cv.personal_info?.email || cv.content?.personal_info?.email || '';
    
//     return { name, title, email };
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className={`w-full max-w-4xl max-h-[80vh] rounded-2xl ${
//         isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
//       } shadow-2xl flex flex-col`}>
        
//         {/* Header */}
//         <div className={`flex items-center justify-between p-6 border-b ${
//           isDarkMode ? 'border-gray-700' : 'border-gray-200'
//         }`}>
//           <div>
//             <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               {title}
//             </h2>
//             <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//               {subtitle}. Found {availableCVs.length} CV{availableCVs.length !== 1 ? 's' : ''}.
//             </p>
//           </div>
          
//           <div className="flex items-center gap-2">
//             {/* Refresh button */}
//             <button
//               onClick={onRefresh}
//               disabled={isLoading}
//               className={`p-2 rounded-lg transition-colors ${
//                 isDarkMode 
//                   ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
//                   : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
//               }`}
//               title="Refresh CV list"
//             >
//               <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//             </button>
            
//             {/* Close button */}
//             <button 
//               onClick={onClose}
//               className={`p-2 rounded-lg ${
//                 isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
//               }`}
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Search and Controls */}
//         <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//           <div className="flex items-center gap-3">
//             <div className="flex-1 relative">
//               <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
//                 isDarkMode ? 'text-gray-400' : 'text-gray-500'
//               }`} />
//               <input
//                 type="text"
//                 placeholder="Search by CV title or name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
//                   isDarkMode 
//                     ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
//                     : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//                 } focus:outline-none focus:ring-2 focus:ring-purple-500`}
//               />
//             </div>
            
//             {/* View toggle */}
//             <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-1.5 rounded ${viewMode === 'list' 
//                   ? 'bg-purple-500 text-white' 
//                   : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 <List className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-1.5 rounded ${viewMode === 'grid' 
//                   ? 'bg-purple-500 text-white' 
//                   : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 <Grid className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* CVs List */}
//         <div className="flex-1 overflow-y-auto p-4">
//           {isLoading ? (
//             <div className="flex items-center justify-center py-12">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto mb-4"></div>
//                 <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading CVs...</p>
//               </div>
//             </div>
//           ) : Object.keys(filteredGroupedCVs).length === 0 ? (
//             <div className="text-center py-12">
//               <FileText className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
//               <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 {searchTerm ? 'No CVs match your search' : 'No CVs found'}
//               </p>
//               <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
//                 {searchTerm ? 'Try a different search term' : 'Create a CV first to work with it'}
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {Object.entries(filteredGroupedCVs).map(([source, cvs]) => (
//                 <div key={source}>
//                   {/* Source Header */}
//                   <div className="flex items-center gap-2 mb-3">
//                     {getSourceIcon(source)}
//                     <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                       {getSourceLabel(source)}
//                     </h3>
//                     <span className={`text-xs px-2 py-1 rounded-full ${
//                       isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
//                     }`}>
//                       {cvs.length} CV{cvs.length !== 1 ? 's' : ''}
//                     </span>
//                   </div>

//                   {/* CVs Grid/List */}
//                   <div className={viewMode === 'grid' 
//                     ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' 
//                     : 'space-y-2'
//                   }>
//                     {cvs.map((cv, index) => {
//                       const preview = getCVPreview(cv);
//                       const isSelected = selectedCV?.id === cv.id && selectedCV?.source === cv.source;
                      
//                       return (
//                         <button
//                           key={`${cv.source}-${cv.id || index}`}
//                           onClick={() => onSelectCV(cv)}
//                           className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
//                             isSelected
//                               ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
//                               : isDarkMode
//                               ? 'border-gray-700 bg-gray-750 hover:border-gray-600 hover:bg-gray-700'
//                               : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
//                           }`}
//                         >
//                           {/* CV Header */}
//                           <div className="flex items-start justify-between mb-2">
//                             <div className="flex-1 min-w-0">
//                               <h4 className={`font-medium truncate ${
//                                 isDarkMode ? 'text-white' : 'text-gray-900'
//                               }`}>
//                                 {cv.title || cv.name || `CV ${index + 1}`}
//                               </h4>
//                               {preview.name && (
//                                 <p className={`text-sm truncate ${
//                                   isDarkMode ? 'text-gray-300' : 'text-gray-700'
//                                 }`}>
//                                   {preview.name}
//                                 </p>
//                               )}
//                             </div>
//                             {isSelected && (
//                               <div className="ml-2">
//                                 <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
//                                   <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                   </svg>
//                                 </div>
//                               </div>
//                             )}
//                           </div>

//                           {/* CV Details */}
//                           <div className="space-y-1">
//                             {preview.title && (
//                               <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                                 {preview.title}
//                               </p>
//                             )}
                            
//                             <div className="flex items-center justify-between text-xs">
//                               <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
//                                 {source === 'cloud' && cv.modifiedTime && (
//                                   <div className="flex items-center gap-1">
//                                     <Calendar className="w-3 h-3" />
//                                     {formatDate(cv.modifiedTime)}
//                                   </div>
//                                 )}
//                                 {source === 'draft' && 'Current editing session'}
//                                 {source === 'local' && 'Saved on this device'}
//                                 {source === 'api' && `ID: ${cv.id}`}
//                               </span>
                              
//                               {/* Source badge */}
//                               <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
//                                 source === 'cloud' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
//                                 source === 'draft' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
//                                 source === 'local' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
//                                 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
//                               }`}>
//                                 {getSourceIcon(source)}
//                                 <span className="ml-1">
//                                   {source === 'cloud' ? 'Drive' : 
//                                    source === 'draft' ? 'Draft' : 
//                                    source === 'local' ? 'Local' : 'Saved'}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//           <div className="flex items-center justify-between">
//             <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//               {selectedCV ? (
//                 <>
//                   Selected: <strong>{selectedCV.title || selectedCV.name || 'Untitled CV'}</strong>
//                   {' from '}
//                   <strong>{getSourceLabel(selectedCV.source)}</strong>
//                 </>
//               ) : (
//                 'No CV selected'
//               )}
//             </p>
            
//             <div className="flex gap-3">
//               <button
//                 onClick={onClose}
//                 className={`px-4 py-2 rounded-lg transition-colors ${
//                   isDarkMode 
//                     ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
//                     : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                 }`}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={onClose}
//                 disabled={!selectedCV}
//                 className={`px-4 py-2 rounded-lg transition-colors ${
//                   selectedCV
//                     ? 'bg-purple-600 hover:bg-purple-700 text-white'
//                     : 'bg-gray-400 text-gray-600 cursor-not-allowed'
//                 }`}
//               >
//                 Select This CV
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Compact CV Selector for Header
// const CompactCVSelector = ({ 
//   selectedCV, 
//   availableCVs,
//   onOpenModal, 
//   isDarkMode 
// }) => {
//   const getSourceIcon = (source) => {
//     switch (source) {
//       case 'draft': return <FileText className="w-4 h-4 text-purple-500" />;
//       case 'local': return <HardDrive className="w-4 h-4 text-green-500" />;
//       case 'cloud': return <Cloud className="w-4 h-4 text-blue-500" />;
//       case 'api': return <User className="w-4 h-4 text-orange-500" />;
//       default: return <FileText className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getSourceLabel = (source) => {
//     switch (source) {
//       case 'draft': return 'Draft';
//       case 'local': return 'Local';
//       case 'cloud': return 'Drive';
//       case 'api': return 'Saved';
//       default: return 'Unknown';
//     }
//   };

//   if (!selectedCV) {
//     return (
//       <button
//         onClick={onOpenModal}
//         className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
//           isDarkMode 
//             ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
//             : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
//         }`}
//       >
//         <FileText className="w-4 h-4 mr-2" />
//         <span className="text-sm">Select CV ({availableCVs.length} available)</span>
//       </button>
//     );
//   }

//   return (
//     <button
//       onClick={onOpenModal}
//       className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors min-w-0 max-w-xs ${
//         isDarkMode 
//           ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' 
//           : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
//       }`}
//     >
//       <div className="flex items-center min-w-0">
//         {getSourceIcon(selectedCV.source)}
//         <div className="ml-2 min-w-0">
//           <div className="text-sm font-medium truncate">
//             {selectedCV.title || selectedCV.name || 'Untitled CV'}
//           </div>
//           <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//             {getSourceLabel(selectedCV.source)} • {selectedCV.personal_info?.full_name || 'No name'}
//           </div>
//         </div>
//       </div>
//       <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
//     </button>
//   );
// };

// // Main hook for CV loading logic
// const useCVLoader = () => {
//   const { token } = useAuthStore();
//   const { 
//     listGoogleDriveCVs,
//     canSaveToCloud
//   } = useSessionStore();
  
//   // Helper to get Google Drive file content
//   const getGoogleDriveFileContent = async (fileId) => {
//     try {
//       console.log('📁 Getting Google Drive file content for:', fileId);
      
//       const contentResponse = await fetch(`${API_BASE_URL}/google-drive/file/${fileId}/content`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!contentResponse.ok) {
//         console.error('❌ Failed to fetch Google Drive file content:', contentResponse.status);
//         return null;
//       }
      
//       // Try to get response as text first
//       const responseText = await contentResponse.text();
      
//       // Try to parse as JSON
//       try {
//         const jsonData = JSON.parse(responseText);
        
//         // Handle different JSON structures
//         if (jsonData.content && typeof jsonData.content === 'string') {
//           try {
//             return JSON.parse(jsonData.content);
//           } catch (e) {
//             return jsonData.content; // Return as string if can't parse
//           }
//         }
//         return jsonData;
//       } catch (jsonError) {
//         // If not JSON, return as text
//         console.log('⚠️ Response is not JSON, returning as text');
//         return responseText;
//       }
//     } catch (error) {
//       console.error('❌ Error fetching Google Drive file:', error);
//       return null;
//     }
//   };

//   // Main function to load all available CVs
//   const loadAvailableCVs = async () => {
//     const cvs = [];

//     try {
//       console.log('🔍 Loading available CVs from all sources...');

//       // 1. Check for draft from NewResumeBuilder
//       const draftData = localStorage.getItem('cv_draft_for_customization');
//       if (draftData) {
//         try {
//           const parsed = JSON.parse(draftData);
//           console.log('📝 Found draft from CV builder:', parsed.title || 'Untitled');
//           cvs.push({
//             id: 'draft-customization',
//             source: 'draft',
//             title: parsed.title || 'Draft from CV Builder',
//             name: 'Current editing session',
//             content: parsed,
//             personal_info: parsed.personal_info,
//             priority: 1
//           });
//         } catch (error) {
//           console.error('Error parsing draft data:', error);
//         }
//       }

//       // 2. Check for recent local CV
//       const localCV = localStorage.getItem('cv_draft');
//       if (localCV) {
//         try {
//           const parsed = JSON.parse(localCV);
//           console.log('💾 Found local CV:', parsed.title || 'Untitled');
//           cvs.push({
//             id: 'local-draft-' + Date.now(),
//             source: 'local',
//             title: parsed.title || 'Local Draft',
//             name: 'Saved on this device',
//             content: parsed,
//             personal_info: parsed.personal_info,
//             priority: 3
//           });
//         } catch (error) {
//           console.error('Error parsing local CV:', error);
//         }
//       }

//       // 3. Load from Google Drive if connected - FIXED VERSION
//       if (canSaveToCloud()) {
//         try {
//           console.log('☁️ Loading CVs from Google Drive...');
//           const cloudData = await listGoogleDriveCVs();
          
//           if (cloudData && cloudData.length > 0) {
//             console.log(`📁 Found ${cloudData.length} Google Drive files`);
            
//             // Process files in parallel with Promise.all
//             const driveCVs = await Promise.all(
//               cloudData.map(async (file) => {
//                 try {
//                   console.log('📥 Loading Google Drive file:', file.name);
//                   const fileContent = await getGoogleDriveFileContent(file.file_id);
                  
//                   if (!fileContent || fileContent.error) {
//                     console.log(`⚠️ Skipping Google Drive file: ${file.name} - invalid content`);
//                     return null;
//                   }
                  
//                   // Handle different content structures
//                   let actualContent = fileContent;
//                   if (typeof fileContent === 'object' && fileContent.content) {
//                     actualContent = fileContent.content;
//                   } else if (typeof fileContent === 'string') {
//                     try {
//                       actualContent = JSON.parse(fileContent);
//                     } catch (parseError) {
//                       console.log(`⚠️ Google Drive file is not valid JSON: ${file.name}`);
//                       return null;
//                     }
//                   }
                  
//                   return {
//                     id: file.file_id,
//                     source: 'cloud',
//                     title: file.name?.replace('.json', '') || `Google Drive CV`,
//                     name: file.name || 'Untitled',
//                     content: actualContent,
//                     modifiedTime: file.last_modified,
//                     personal_info: actualContent.personal_info,
//                     priority: 2
//                   };
//                 } catch (fileError) {
//                   console.error(`❌ Error loading file ${file.file_id}:`, fileError);
//                   return null;
//                 }
//               })
//             );
            
//             // Filter out null results and add to CVs array
//             const validDriveCVs = driveCVs.filter(cv => cv !== null);
//             console.log(`✅ Successfully loaded ${validDriveCVs.length} CVs from Google Drive`);
//             cvs.push(...validDriveCVs);
//           }
//         } catch (error) {
//           console.error('❌ Error loading from Google Drive:', error);
//         }
//       }

//       // Sort by priority
//       cvs.sort((a, b) => a.priority - b.priority);

//       console.log(`✅ Loaded ${cvs.length} CVs total from all sources`);
      
//       // Debug log
//       console.group('📋 Loaded CVs Summary');
//       cvs.forEach((cv, index) => {
//         console.log(`CV ${index + 1}:`, {
//           source: cv.source,
//           title: cv.title,
//           id: cv.id,
//           hasContent: !!cv.content,
//           contentType: typeof cv.content
//         });
//       });
//       console.groupEnd();

//       return cvs;

//     } catch (error) {
//       console.error('❌ Error loading available CVs:', error);
//       throw error;
//     }
//   };

//   return {
//     loadAvailableCVs,
//     getGoogleDriveFileContent
//   };
// };

// // Main CVSelector component that combines everything
// const CVSelector = ({ 
//   onCVSelected,
//   selectedCV,
//   isDarkMode = false,
//   title = "Select CV",
//   subtitle = "Choose which CV you'd like to work with",
//   showCompactSelector = true,
//   autoLoad = true
// }) => {
//   const [availableCVs, setAvailableCVs] = useState([]);
//   const [isLoadingCVs, setIsLoadingCVs] = useState(false);
//   const [showCVModal, setShowCVModal] = useState(false);
//   const [currentSelectedCV, setCurrentSelectedCV] = useState(selectedCV);
//   const { loadAvailableCVs } = useCVLoader();

//   // Load CVs on component mount
//   useEffect(() => {
//     if (autoLoad) {
//       handleLoadCVs();
//     }
//   }, [autoLoad]);

//   // Update selectedCV when prop changes
//   useEffect(() => {
//     setCurrentSelectedCV(selectedCV);
//   }, [selectedCV]);

//   const handleLoadCVs = async () => {
//     setIsLoadingCVs(true);
//     try {
//       const cvs = await loadAvailableCVs();
//       setAvailableCVs(cvs);
      
//       // Auto-select the highest priority CV if none selected
//       if (cvs.length > 0 && !currentSelectedCV) {
//         const priorityCV = cvs.find(cv => cv.content); // Find first CV with actual content
//         if (priorityCV) {
//           console.log('🎯 Auto-selecting CV:', priorityCV.title);
//           handleSelectCV(priorityCV);
//         }
//       }
//     } catch (error) {
//       console.error('❌ Failed to load CVs:', error);
//     } finally {
//       setIsLoadingCVs(false);
//     }
//   };

//   const handleSelectCV = (cv) => {
//     console.log('✅ Selected CV:', cv.title, 'from', cv.source);
//     setCurrentSelectedCV(cv);
//     setShowCVModal(false);
    
//     // Notify parent component
//     if (onCVSelected) {
//       onCVSelected(cv);
//     }
//   };

//   return (
//     <>
//       {showCompactSelector && (
//         <CompactCVSelector
//           selectedCV={currentSelectedCV}
//           availableCVs={availableCVs}
//           onOpenModal={() => setShowCVModal(true)}
//           isDarkMode={isDarkMode}
//         />
//       )}

//       <CVSelectionModal
//         isOpen={showCVModal}
//         onClose={() => setShowCVModal(false)}
//         availableCVs={availableCVs}
//         selectedCV={currentSelectedCV}
//         onSelectCV={handleSelectCV}
//         isLoading={isLoadingCVs}
//         onRefresh={handleLoadCVs}
//         isDarkMode={isDarkMode}
//         title={title}
//         subtitle={subtitle}
//       />
//     </>
//   );
// };

// export { CVSelector, CVSelectionModal, CompactCVSelector, useCVLoader };
// export default CVSelector;