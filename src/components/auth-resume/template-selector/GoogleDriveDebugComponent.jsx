// // src/components/debug/GoogleDriveDebugComponent.jsx - Debug helper for Google Drive issues

// import React, { useState } from 'react';
// import useSessionStore from '../../stores/sessionStore';
// import API_BASE_URL from '../../config';

// const GoogleDriveDebugComponent = ({ isDarkMode }) => {
//   const [debugInfo, setDebugInfo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const { 
//     sessionToken, 
//     googleDriveConnected, 
//     listGoogleDriveCVs,
//     canSaveToCloud 
//   } = useSessionStore();

//   const runDebugTests = async () => {
//     setIsLoading(true);
//     const results = {
//       timestamp: new Date().toISOString(),
//       sessionToken: !!sessionToken,
//       googleDriveConnected,
//       canSaveToCloud: canSaveToCloud(),
//       tests: {}
//     };

//     try {
//       // Test 1: Check Google Drive status
//       console.log('🔍 Debug Test 1: Checking Google Drive status...');
//       try {
//         const statusResponse = await fetch(`${API_BASE_URL}/google-drive/status`, {
//           headers: { 'Authorization': `Bearer ${sessionToken}` }
//         });
//         const statusData = await statusResponse.json();
//         results.tests.driveStatus = {
//           success: statusResponse.ok,
//           status: statusResponse.status,
//           data: statusData
//         };
//       } catch (error) {
//         results.tests.driveStatus = {
//           success: false,
//           error: error.message
//         };
//       }

//       // Test 2: List Google Drive files
//       console.log('🔍 Debug Test 2: Listing Google Drive files...');
//       try {
//         const listResponse = await fetch(`${API_BASE_URL}/google-drive/files`, {
//           headers: { 'Authorization': `Bearer ${sessionToken}` }
//         });
//         const listData = await listResponse.json();
//         results.tests.listFiles = {
//           success: listResponse.ok,
//           status: listResponse.status,
//           data: listData,
//           fileCount: Array.isArray(listData?.files) ? listData.files.length : 0
//         };
//       } catch (error) {
//         results.tests.listFiles = {
//           success: false,
//           error: error.message
//         };
//       }

//       // Test 3: Use session store method
//       console.log('🔍 Debug Test 3: Using session store listGoogleDriveCVs...');
//       try {
//         const storeCVs = await listGoogleDriveCVs();
//         results.tests.sessionStoreList = {
//           success: true,
//           data: storeCVs,
//           isArray: Array.isArray(storeCVs),
//           count: Array.isArray(storeCVs) ? storeCVs.length : 0
//         };
//       } catch (error) {
//         results.tests.sessionStoreList = {
//           success: false,
//           error: error.message
//         };
//       }

//       // Test 4: Try to fetch content of first file
//       if (results.tests.sessionStoreList?.success && results.tests.sessionStoreList.data?.length > 0) {
//         console.log('🔍 Debug Test 4: Fetching content of first file...');
//         const firstFile = results.tests.sessionStoreList.data[0];
//         try {
//           const contentResponse = await fetch(`${API_BASE_URL}/google-drive/file/${firstFile.file_id}/content`, {
//             headers: { 'Authorization': `Bearer ${sessionToken}` }
//           });
//           const contentText = await contentResponse.text();
          
//           let parsedContent = null;
//           try {
//             parsedContent = JSON.parse(contentText);
//           } catch (e) {
//             parsedContent = 'Not valid JSON';
//           }

//           results.tests.firstFileContent = {
//             success: contentResponse.ok,
//             status: contentResponse.status,
//             fileId: firstFile.file_id,
//             fileName: firstFile.name,
//             contentLength: contentText.length,
//             contentPreview: contentText.substring(0, 200) + '...',
//             parsedContent: parsedContent
//           };
//         } catch (error) {
//           results.tests.firstFileContent = {
//             success: false,
//             error: error.message
//           };
//         }
//       }

//     } catch (error) {
//       results.error = error.message;
//     } finally {
//       setIsLoading(false);
//       setDebugInfo(results);
//       console.log('🔍 Debug results:', results);
//     }
//   };

//   return (
//     <div className={`p-4 border rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
//       <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//         Google Drive Debug Tool
//       </h3>
      
//       <div className="mb-4">
//         <button
//           onClick={runDebugTests}
//           disabled={isLoading}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {isLoading ? 'Running Debug Tests...' : 'Run Debug Tests'}
//         </button>
//       </div>

//       {debugInfo && (
//         <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//           <div>
//             <h4 className="font-semibold">Connection Status:</h4>
//             <ul className="text-sm space-y-1">
//               <li>Session Token: {debugInfo.sessionToken ? '✅ Present' : '❌ Missing'}</li>
//               <li>Google Drive Connected: {debugInfo.googleDriveConnected ? '✅ Yes' : '❌ No'}</li>
//               <li>Can Save to Cloud: {debugInfo.canSaveToCloud ? '✅ Yes' : '❌ No'}</li>
//             </ul>
//           </div>

//           {Object.entries(debugInfo.tests).map(([testName, result]) => (
//             <div key={testName}>
//               <h4 className="font-semibold">{testName}:</h4>
//               <div className="text-sm">
//                 <p>Status: {result.success ? '✅ Success' : '❌ Failed'}</p>
//                 {result.error && <p className="text-red-500">Error: {result.error}</p>}
//                 {result.data && (
//                   <details className="mt-2">
//                     <summary className="cursor-pointer">View Data</summary>
//                     <pre className={`mt-2 p-2 rounded text-xs overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
//                       {JSON.stringify(result.data, null, 2)}
//                     </pre>
//                   </details>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GoogleDriveDebugComponent;