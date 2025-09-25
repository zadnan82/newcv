// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import useAuthStore from '../../stores/authStore';
// import { FEEDBACK_ENDPOINTS } from '../../config';
// import Alert from '../shared/Alert';
// import toast from 'react-hot-toast';

// const FeedbackForm = ({ darkMode, onClose }) => {
//   const { t } = useTranslation();
//   const { isAuthenticated, user } = useAuthStore();
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ error: '', success: '' });

//   // // Set initial email from authenticated user if available
//   useState(() => {
//     if (isAuthenticated() && user?.email) {
//       setEmail(user.email);
//     }
//   }, [isAuthenticated, user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate input
//     if (rating === 0) {
//       setStatus({ error: t('feedback.rating_required'), success: '' });
//       return;
//     }

//     if (!isAuthenticated() && !email) {
//       setStatus({ error: t('feedback.email_required'), success: '' });
//       return;
//     }

//     setLoading(true);
//     setStatus({ error: '', success: '' });

//     const feedbackData = {
//       rating,
//       comment,
//       email: isAuthenticated() ? user.email : email
//     };

//     try {
//       // Choose endpoint based on authentication status
//       const endpoint = isAuthenticated() 
//         ? FEEDBACK_ENDPOINTS.SUBMIT 
//         : FEEDBACK_ENDPOINTS.SUBMIT_ANONYMOUS;

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(isAuthenticated() && { 'Authorization': `Bearer ${useAuthStore.getState().token}` })
//         },
//         body: JSON.stringify(feedbackData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to submit feedback');
//       }

//       // Success!
//       setStatus({ 
//         error: '', 
//         success: t('feedback.submit_success' ) 
//       });
//       toast.success(t('feedback.submit_success' ));
      
//       // Reset form after short delay
//       setTimeout(() => {
//         setRating(0);
//         setComment('');
//         if (!isAuthenticated()) setEmail('');
        
//         // Close the form if a close handler was provided
//         if (onClose) onClose();
//       }, 2000);
//     } catch (error) {
//       console.error('Feedback submission error:', error);
//       setStatus({ 
//         error: error.message || t('feedback.submit_error' ), 
//         success: '' 
//       });
//       toast.error(t('feedback.submit_error' ));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Star rating component
//   const StarRating = () => {
//     return (
//       <div className="flex space-x-2">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => setRating(star)}
//             className="focus:outline-none"
//           >
//             <svg
//               className={`w-8 h-8 ${
//                 star <= rating 
//                   ? 'text-yellow-400' 
//                   : darkMode ? 'text-gray-600' : 'text-gray-300'
//               } transition-colors duration-150`}
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
//               />
//             </svg>
//           </button>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className={`rounded-lg shadow-lg overflow-hidden border ${
//       darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//     }`}>
//       <div className={`px-6 py-4 ${
//         darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'
//       } text-white`}>
//         <h2 className="text-xl font-bold">{t('feedback.title' )}</h2>
//         <p className="text-sm opacity-90">
//           {t('feedback.subtitle' )}
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="p-6 space-y-4">
//         {status.error && <Alert variant="destructive">{status.error}</Alert>}
//         {status.success && <Alert variant="success">{status.success}</Alert>}

//         <div>
//           <label className={`block text-sm font-medium mb-2 ${
//             darkMode ? 'text-gray-300' : 'text-gray-700'
//           }`}>
//             {t('feedback.rating_label' )} *
//           </label>
//           <StarRating />
//         </div>

//         {!isAuthenticated() && (
//           <div>
//             <label className={`block text-sm font-medium mb-2 ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`} htmlFor="email">
//               {t('feedback.email_label' )} *
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={`w-full px-3 py-2 border rounded-md ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
//                   : 'bg-white border-gray-300 focus:border-purple-500'
//               }`}
//               placeholder={t('feedback.email_placeholder')}
//               required={!isAuthenticated()}
//             />
//           </div>
//         )}

//         <div>
//           <label className={`block text-sm font-medium mb-2 ${
//             darkMode ? 'text-gray-300' : 'text-gray-700'
//           }`} htmlFor="comment">
//             {t('feedback.comment_label')}
//           </label>
//           <textarea
//             id="comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             rows="4"
//             className={`w-full px-3 py-2 border rounded-md resize-none ${
//               darkMode 
//                 ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
//                 : 'bg-white border-gray-300 focus:border-purple-500'
//             }`}
//             placeholder={t('feedback.comment_placeholder' )}
//           />
//         </div>

//         <div className="flex justify-end pt-2">
//           {onClose && (
//             <button
//               type="button"
//               onClick={onClose}
//               className={`mr-3 px-4 py-2 text-sm rounded-md ${
//                 darkMode 
//                   ? 'bg-gray-700 hover:bg-gray-600 text-white' 
//                   : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//               }`}
//             >
//               {t('common.cancel' )}
//             </button>
//           )}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`px-4 py-2 text-sm text-white rounded-md ${
//               loading 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-md hover:shadow-purple-500/20'
//             }`}
//           >
//             {loading 
//               ? t('feedback.submitting' ) 
//               : t('feedback.submit' )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FeedbackForm;