import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import { FEEDBACK_ENDPOINTS } from '../../config';
import Alert from '../shared/Alert';
import toast from 'react-hot-toast';

const FeedbackDashboard = ({ darkMode }) => {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Fetch feedback data
  const fetchFeedback = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = statusFilter 
        ? `${FEEDBACK_ENDPOINTS.ADMIN_GET_ALL}?status=${statusFilter}`
        : FEEDBACK_ENDPOINTS.ADMIN_GET_ALL;
        
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch feedback');
      }

      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError(error.message);
      toast.error(t('admin.feedback.fetch_error', 'Failed to load feedback'));
    } finally {
      setLoading(false);
    }
  };

  // Load feedback on mount and when status filter changes
  useEffect(() => {
    if (token) {
      fetchFeedback();
    }
  }, [token, statusFilter]);

  // Update feedback status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${FEEDBACK_ENDPOINTS.ADMIN_UPDATE_STATUS(id)}?status=${newStatus}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update status');
      }

      // Update local state
      setFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      // If viewing details, update selected feedback
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus });
      }

      toast.success(t('admin.feedback.status_updated', 'Status updated'));
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('admin.feedback.update_error', 'Failed to update status'));
    }
  };

  // Delete feedback
  const deleteFeedback = async (id) => {
    if (!window.confirm(t('admin.feedback.confirm_delete', 'Are you sure you want to delete this feedback?'))) {
      return;
    }

    try {
      const response = await fetch(FEEDBACK_ENDPOINTS.ADMIN_DELETE(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete feedback');
      }

      // Update local state
      setFeedback(prevFeedback => prevFeedback.filter(item => item.id !== id));
      
      // If viewing details of the deleted feedback, close the details view
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(null);
      }

      toast.success(t('admin.feedback.deleted', 'Feedback deleted'));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error(t('admin.feedback.delete_error', 'Failed to delete feedback'));
    }
  };

  // View feedback details
  const viewDetails = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} ${darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`;
      case 'reviewed':
        return `${baseClasses} ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'}`;
      case 'implemented':
        return `${baseClasses} ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`;
      case 'declined':
        return `${baseClasses} ${darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'}`;
      default:
        return `${baseClasses} ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`;
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{t('admin.feedback.title', 'Feedback Management')}</h1>
        
        {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
        
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('admin.feedback.filter_by_status', 'Filter by Status')}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 border rounded-md ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">{t('admin.feedback.all_status', 'All Status')}</option>
            <option value="pending">{t('admin.feedback.status.pending', 'Pending')}</option>
            <option value="reviewed">{t('admin.feedback.status.reviewed', 'Reviewed')}</option>
            <option value="implemented">{t('admin.feedback.status.implemented', 'Implemented')}</option>
            <option value="declined">{t('admin.feedback.status.declined', 'Declined')}</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Feedback List */}
          <div className={`w-full lg:w-1/2 lg:pr-4 ${selectedFeedback ? 'lg:block hidden' : 'block'}`}>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
                  darkMode ? 'border-purple-300' : 'border-purple-600'
                }`}></div>
              </div>
            ) : feedback.length === 0 ? (
              <div className={`p-4 rounded-md ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <p>{t('admin.feedback.no_feedback', 'No feedback found')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-md shadow-sm cursor-pointer transition ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                    } ${selectedFeedback?.id === item.id ? 'ring-2 ring-purple-500' : ''}`}
                    onClick={() => viewDetails(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= item.rating 
                                  ? 'text-yellow-400' 
                                  : darkMode ? 'text-gray-700' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className={getStatusBadge(item.status)}>
                          {t(`admin.feedback.status.${item.status}`, item.status)}
                        </span>
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm truncate">
                        {item.comment || t('admin.feedback.no_comment', 'No comment provided')}
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Details */}
          <div className={`w-full lg:w-1/2 lg:pl-4 mt-4 lg:mt-0 ${selectedFeedback ? 'block' : 'lg:block hidden'}`}>
            {selectedFeedback ? (
              <div className={`p-6 rounded-lg shadow-md ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold">
                    {t('admin.feedback.feedback_details', 'Feedback Details')}
                  </h2>
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className={`p-1 rounded-full ${
                      darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    aria-label="Close details"
                    title={t('common.close', 'Close')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('admin.feedback.id', 'ID')}:
                      </span>
                      <span className="ml-2">{selectedFeedback.id}</span>
                    </div>
                    <div>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('admin.feedback.date', 'Date')}:
                      </span>
                      <span className="ml-2">{formatDate(selectedFeedback.created_at)}</span>
                    </div>
                  </div>

                  <div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('admin.feedback.email', 'Email')}:
                    </span>
                    <span className="ml-2">{selectedFeedback.email}</span>
                  </div>

                  <div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('admin.feedback.user_id', 'User ID')}:
                    </span>
                    <span className="ml-2">
                      {selectedFeedback.user_id || t('admin.feedback.anonymous', 'Anonymous')}
                    </span>
                  </div>

                  <div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('admin.feedback.rating', 'Rating')}:
                    </span>
                    <div className="inline-flex ml-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= selectedFeedback.rating 
                              ? 'text-yellow-400' 
                              : darkMode ? 'text-gray-700' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('admin.feedback.status', 'Status')}:
                    </span>
                    <span className={`${getStatusBadge(selectedFeedback.status)} ml-2`}>
                      {t(`admin.feedback.status.${selectedFeedback.status}`, selectedFeedback.status)}
                    </span>
                  </div>

                  <div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('admin.feedback.comment', 'Comment')}:
                    </span>
                    <div className={`mt-2 p-3 rounded ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      {selectedFeedback.comment || t('admin.feedback.no_comment', 'No comment provided')}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div>
                      <label className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        {t('admin.feedback.update_status', 'Update Status')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateStatus(selectedFeedback.id, 'pending')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedFeedback.status === 'pending'
                              ? darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                              : darkMode ? 'bg-gray-700 hover:bg-yellow-800 hover:text-yellow-200' : 'bg-gray-100 hover:bg-yellow-100 hover:text-yellow-800'
                          }`}
                        >
                          {t('admin.feedback.status.pending', 'Pending')}
                        </button>
                        <button
                          onClick={() => updateStatus(selectedFeedback.id, 'reviewed')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedFeedback.status === 'reviewed'
                              ? darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                              : darkMode ? 'bg-gray-700 hover:bg-blue-800 hover:text-blue-200' : 'bg-gray-100 hover:bg-blue-100 hover:text-blue-800'
                          }`}
                        >
                          {t('admin.feedback.status.reviewed', 'Reviewed')}
                        </button>
                        <button
                          onClick={() => updateStatus(selectedFeedback.id, 'implemented')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedFeedback.status === 'implemented'
                              ? darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                              : darkMode ? 'bg-gray-700 hover:bg-green-800 hover:text-green-200' : 'bg-gray-100 hover:bg-green-100 hover:text-green-800'
                          }`}
                        >
                          {t('admin.feedback.status.implemented', 'Implemented')}
                        </button>
                        <button
                          onClick={() => updateStatus(selectedFeedback.id, 'declined')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedFeedback.status === 'declined'
                              ? darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
                              : darkMode ? 'bg-gray-700 hover:bg-red-800 hover:text-red-200' : 'bg-gray-100 hover:bg-red-100 hover:text-red-800'
                          }`}
                        >
                          {t('admin.feedback.status.declined', 'Declined')}
                        </button>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => deleteFeedback(selectedFeedback.id)}
                        className={`px-4 py-2 text-sm rounded-md ${
                          darkMode 
                            ? 'bg-red-800 hover:bg-red-700 text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {t('admin.feedback.delete', 'Delete Feedback')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-lg shadow-md flex flex-col items-center justify-center ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <svg
                  className={`w-16 h-16 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className={`mt-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('admin.feedback.select_feedback', 'Select feedback to view details')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;