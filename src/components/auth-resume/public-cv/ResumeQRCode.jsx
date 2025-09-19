// import React from 'react';
// import { QRCodeSVG } from 'qrcode.react';
// import { useTranslation } from 'react-i18next';
// import useAuthStore from '../../../stores/authStore';

// const ResumeQRCode = ({ resumeId, customSettings, isDarkMode, userData }) => {
//   const { t } = useTranslation();
//   const { user } = useAuthStore();  
//   const baseUrl = window.location.origin; 
//   const fullName = userData?.personal_info?.full_name || user?.full_name || 'unnamed';
//   const userId = user?.id || 'unknown'; 
//   const urlFriendlyName = encodeURIComponent(fullName.replace(/\s+/g, '-').toLowerCase()); 
//   const cvUrl = `${baseUrl}/cv/${urlFriendlyName}/${userId}/${resumeId}?` + 
//     `template=${customSettings.template || 'stockholm'}` +
//     `&color=${encodeURIComponent(customSettings.accentColor || '#6366f1')}` +
//     `&font=${encodeURIComponent(customSettings.fontFamily || 'Helvetica, Arial, sans-serif')}` +
//     `&spacing=${customSettings.lineSpacing || 1.5}` +
//     `&uppercase=${customSettings.headingsUppercase || false}` +
//     `&hideSkill=${customSettings.hideSkillLevel || false}`;

//   return (
//     <div className={`p-3 border rounded-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-300'}`}>
//       <h4 className={`text-xs font-medium mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//         {t('resume.qrcode.title')}
//       </h4>
//       <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//         {t('resume.qrcode.description')}
//       </p>
      
//       <div className="flex flex-col items-center">
//         <div className={`p-2 bg-white rounded-md mb-2 ${isDarkMode ? 'shadow-md' : 'shadow-sm'}`}>
//           <QRCodeSVG 
//             value={cvUrl}
//             size={120}
//             bgColor={"#ffffff"}
//             fgColor={"#000000"}
//             level={"L"}
//             includeMargin={false}
//             className="qrCode"
//           />
//         </div>
        
//         <a 
//           href={cvUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className={`text-xs mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
//         >
//           {t('resume.qrcode.open_link')}
//         </a>
        
//         <button
//           onClick={() => {
//             // Create a canvas element
//             const canvas = document.createElement('canvas');
//             const qrCode = document.querySelector('.qrCode');
            
//             if (qrCode) {
//               // If using QRCodeSVG, we need to convert the SVG to canvas
//               const svgData = new XMLSerializer().serializeToString(qrCode);
//               const img = new Image();
              
//               img.onload = () => {
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(img, 0, 0);
                
//                 const dataUrl = canvas.toDataURL('image/png');
//                 const link = document.createElement('a');
//                 link.download = `${urlFriendlyName}-cv-${resumeId}.png`;
//                 link.href = dataUrl;
//                 link.click();
//               };
              
//               img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
//             }
//           }}
//           className={`px-3 py-1.5 rounded-full text-white text-xs font-medium transition-colors ${
//             isDarkMode 
//               ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600' 
//               : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-sm hover:shadow-purple-500/20'
//           }`}
//         >
//           {t('resume.qrcode.download')}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ResumeQRCode;