// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import useAuthStore from '../../stores/authStore';
// import { FEEDBACK_ENDPOINTS } from '../../config';
// import Alert from '../shared/Alert';
// import toast from 'react-hot-toast';

// const FeedbackPage = ({ darkMode }) => {
//   const { t } = useTranslation();
//   const { isAuthenticated, user } = useAuthStore();
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ error: '', success: '' });
  
//   // Set initial email from authenticated user if available
//   useEffect(() => {
//     if (isAuthenticated() && user?.email) {
//       setEmail(user.email);
//     }
//   }, [isAuthenticated, user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate input
//     if (rating === 0) {
//       setStatus({ error: t('feedback.rating_required', 'Please select a rating'), success: '' });
//       return;
//     }

//     if (!isAuthenticated() && !email) {
//       setStatus({ error: t('feedback.email_required', 'Please provide your email'), success: '' });
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
//         success: t('feedback.submit_success', 'Thank you for your feedback!') 
//       });
//       toast.success(t('feedback.submit_success', 'Thank you for your feedback!'));
      
//       // Reset form after successful submission
//       setRating(0);
//       setComment('');
//       if (!isAuthenticated()) setEmail('');
//     } catch (error) {
//       console.error('Feedback submission error:', error);
//       setStatus({ 
//         error: error.message || t('feedback.submit_error', 'Failed to submit feedback'), 
//         success: '' 
//       });
//       toast.error(t('feedback.submit_error', 'Failed to submit feedback'));
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
//             className="focus:outline-none transform transition-transform hover:scale-110"
//             aria-label={`Rate ${star} stars`}
//           >
//             <svg
//               className={`w-10 h-10 md:w-12 md:h-12 ${
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
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
//       {/* Background Elements - decorative elements similar to cards but more subtle */}
//       <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//         <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
//         <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
//         <div className="absolute -bottom-48 right-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
//       </div>
      
//       <div className="relative z-10 max-w-3xl mx-auto px-4 pt-20 pb-10">
//         <div className={`text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//           <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('feedback.page_title', 'We Value Your Feedback')}</h1>
//           <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//             {t('feedback.page_subtitle', 'Help us improve CVATI by sharing your experience and suggestions')}
//           </p>
//         </div>

//         <div className={`p-6 md:p-8 rounded-xl shadow-lg backdrop-blur-sm border border-white/10 ${
//           darkMode ? 'bg-gray-800/80' : 'bg-white/80'
//         }`}>
//           {status.error && <Alert variant="destructive" className="mb-6">{status.error}</Alert>}
//           {status.success && <Alert variant="success" className="mb-6">{status.success}</Alert>}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="text-center">
//               <label className={`block text-lg font-medium mb-4 ${
//                 darkMode ? 'text-gray-200' : 'text-gray-700'
//               }`}>
//                 {t('feedback.rating_label', 'How would you rate your experience with CVATI?')} *
//               </label>
//               <div className="flex justify-center">
//                 <StarRating />
//               </div>
//             </div>

//             {!isAuthenticated() && (
//               <div>
//                 <label className={`block text-base font-medium mb-2 ${
//                   darkMode ? 'text-gray-200' : 'text-gray-700'
//                 }`} htmlFor="email">
//                   {t('feedback.email_label', 'Your Email')} *
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className={`w-full px-3 py-2 border rounded-md ${
//                     darkMode 
//                       ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
//                       : 'bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500'
//                   }`}
//                   placeholder={t('feedback.email_placeholder', 'your.email@example.com')}
//                   required={!isAuthenticated()}
//                 />
//               </div>
//             )}

//             <div>
//               <label className={`block text-base font-medium mb-2 ${
//                 darkMode ? 'text-gray-200' : 'text-gray-700'
//               }`} htmlFor="comment">
//                 {t('feedback.comment_label', 'What would you like to share with us?')}
//               </label>
//               <textarea
//                 id="comment"
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 rows="5"
//                 className={`w-full px-3 py-2 border rounded-md resize-none ${
//                   darkMode 
//                     ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
//                     : 'bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500'
//                 }`}
//                 placeholder={t('feedback.comment_placeholder', 'Tell us about your experience, suggestions, or any issues you encountered...')}
//               />
//             </div>

//             <div className="flex justify-center pt-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-6 py-3 text-base font-medium text-white rounded-md ${
//                   loading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-md hover:shadow-purple-500/20 transform transition-transform hover:scale-105'
//                 }`}
//               >
//                 {loading 
//                   ? t('feedback.submitting', 'Submitting...') 
//                   : t('feedback.submit', 'Submit Feedback')}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Additional information section */}
//         <div className={`mt-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//           <p className="text-sm">
//             {t('feedback.privacy_note', 'Your feedback helps us improve our service. We may use your feedback for product improvement.')}
//           </p>
//           <p className="text-sm mt-2">
//             {t('feedback.contact_support', 'If you need immediate assistance, please contact our support team.')}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeedbackPage;