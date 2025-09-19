import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useNewCoverLetterStore from '../../stores/coverLetterStore';
import useSessionStore from '../../stores/sessionStore';
import toast from 'react-hot-toast';
import { Plus, Edit, Eye, Trash, FileText, Settings, RefreshCw, Star } from 'lucide-react';

const CoverLetterDashboard = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); 
  
  const { sessionToken, googleDriveConnected } = useSessionStore();
  
  const {
    coverLetters,
    fetchCoverLetters,
    deleteCoverLetter,
    toggleFavorite,
    getCoverLetter,
    isLoading,
    error,
    clearError,
    formatCoverLetter
  } = useNewCoverLetterStore();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [previewLetter, setPreviewLetter] = useState(null);
  const [isCardView, setIsCardView] = useState(window.innerWidth < 768);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Listen for window resize to toggle between table and card view
  useEffect(() => {
    const handleResize = () => {
      setIsCardView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // UPDATED: Only load cover letters if both session and Google Drive are connected
  useEffect(() => {
    if (sessionToken && googleDriveConnected) {
      loadCoverLetters();
    }
    // REMOVED: No more redirects - just show appropriate state on page
  }, [sessionToken, googleDriveConnected]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);
  
  // Load cover letters from both local and Google Drive
  const loadCoverLetters = async () => {
    try {
      console.log('📋 Loading cover letters from all sources...');
      
      // Load from Google Drive first
      await fetchCoverLetters();
      
      // TODO: Also load from local storage and merge
      // This will need to be implemented in the store to truly fix the issue
      
      console.log('✅ Cover letters loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load cover letters:', error);
      toast.error('Failed to load cover letters. Please try again.');
    }
  };
  
  const handleDelete = async (id) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log('🗑️ Deleting cover letter:', id);
      
      await deleteCoverLetter(id);
      
      toast.success('Cover letter deleted successfully');
      setShowDeleteConfirm(null);
      
      console.log('✅ Cover letter deleted successfully');
    } catch (error) {
      console.error('❌ Delete failed:', error);
      toast.error('Failed to delete cover letter. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return 'N/A';
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };
  
  const handlePreview = async (letter) => {
    try {
      console.log('👁️ Previewing cover letter:', letter);
      
      if (!letter || !letter.id) {
        toast.error('No cover letter data available');
        return;
      }
      
      let fullLetter = letter;
      
      if (!letter.cover_letter_content && !letter.formattedContent) {
        console.log('📥 Loading full cover letter content...');
        fullLetter = await getCoverLetter(letter.id);
        
        if (!fullLetter) {
          toast.error('Failed to load cover letter content');
          return;
        }
      }
      
      const formattedContent = formatCoverLetter(fullLetter);
      
      setPreviewLetter({
        ...fullLetter,
        formattedContent: formattedContent
      });
      
    } catch (error) {
      console.error('❌ Error loading cover letter for preview:', error);
      toast.error('Failed to preview cover letter');
    }
  };
  
  const closePreview = () => {
    setPreviewLetter(null);
  };
  
  const filteredAndSortedCoverLetters = () => {
    let filtered = [...coverLetters];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(letter => {
        const title = (letter.title || '').toLowerCase();
        const company = (letter.company_name || '').toLowerCase();
        const jobTitle = (letter.job_title || '').toLowerCase();
        
        return title.includes(term) || company.includes(term) || jobTitle.includes(term);
      });
    }
    
    if (filterFavorites) {
      filtered = filtered.filter(letter => letter.is_favorite);
    }
    
    return filtered.sort((a, b) => {
      let valueA = a[sortBy] || '';
      let valueB = b[sortBy] || '';
      
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        valueA = new Date(valueA || 0).getTime();
        valueB = new Date(valueB || 0).getTime();
      }
      
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
      }
      if (typeof valueB === 'string') {
        valueB = valueB.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };
  
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  const DeleteConfirmModal = ({ id, onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex">
      <div className={`relative p-4 max-w-md m-auto flex-col flex rounded-xl shadow-lg backdrop-blur-sm border border-white/10 ${
        darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-800'
      }`}>
        <div>
          <h3 className="text-lg font-bold mb-2">
            Confirm Deletion
          </h3>
          <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Are you sure you want to delete this cover letter? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className={`px-3 py-1.5 rounded-md text-xs shadow-md transition-all duration-300 ${
              isDeleting 
                ? 'opacity-50 cursor-not-allowed'
                : darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(id)}
            disabled={isDeleting}
            className={`px-3 py-1.5 rounded-md text-xs shadow-md transition-all duration-300 ${
              isDeleting
                ? 'opacity-50 cursor-not-allowed bg-gray-500'
                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-md hover:shadow-red-500/20 hover:scale-102'
            } text-white`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  const PreviewModal = ({ letter, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className={`rounded-xl p-4 w-full max-w-3xl max-h-[90vh] shadow-xl overflow-hidden backdrop-blur-sm border border-white/10 ${
          darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-800'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold truncate pr-4">
            {letter.title || 'Untitled Cover Letter'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200/20 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="truncate">
            <span className="font-medium">Company:</span> {letter.company_name || 'N/A'}
          </div>
          <div className="truncate">
            <span className="font-medium">Position:</span> {letter.job_title || 'N/A'}
          </div>
          <div className="truncate">
            <span className="font-medium">Updated:</span> {formatDate(letter.updated_at)}
          </div>
        </div>
        
        <div className="overflow-auto h-[50vh] mb-3">
          <div className={`whitespace-pre-wrap font-serif border p-3 rounded-md shadow-inner text-sm ${
            darkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white/90 border-gray-300 text-gray-800'
          }`}>
            {letter.formattedContent || 'No content available to preview.'}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              if (letter.formattedContent) {
                navigator.clipboard.writeText(letter.formattedContent);
                toast.success('Cover letter copied to clipboard!');
              } else {
                toast.error('No content to copy');
              }
            }}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Copy
          </button>
          
          <button 
            onClick={() => {
              if (letter.formattedContent) {
                const blob = new Blob([letter.formattedContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Cover_Letter_${(letter.job_title || 'Untitled').replace(/\s+/g, '_')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('Cover letter downloaded successfully!');
              } else {
                toast.error('No content to download');
              }
            }}
            className="px-3 py-1.5 rounded-md text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-blue-500/20 hover:scale-102"
          >
            Download
          </button>
          
          <button
            onClick={() => navigate(`/cover-letters/${letter.id}/edit`)}
            className="px-3 py-1.5 rounded-md text-xs bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-green-500/20 hover:scale-102 ml-auto"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  // ADDED: No Session State - similar to resume dashboard
  const NoSessionState = () => (
    <div className="text-center py-12">
      <div className="mb-6">
        <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">No Session Established</h2>
        <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Please sign in to access your cover letters and start building your career toolkit!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 text-lg font-medium"
        >
          Sign In to Get Started
        </Link>
      </div>
      
      <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-start gap-2">
          <div className="text-blue-500 text-xl">💡</div>
          <div>
            <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Tip: Connect Google Drive to sync your cover letters across devices!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ADDED: No Google Drive State
  const NoGoogleDriveState = () => (
    <div className="text-center py-12">
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 21l4-4 4 4"/>
        </svg>
        <h2 className="text-2xl font-bold mb-2">Connect Google Drive</h2>
        <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Connect your Google Drive to save and access your AI-generated cover letters
        </p>
        <Link
          to="/cloud-setup"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 text-lg font-medium"
        >
          Connect Google Drive
        </Link>
      </div>
      
      <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-start gap-2">
          <div className="text-blue-500 text-xl">💡</div>
          <div>
            <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Tip: Google Drive integration allows you to access your cover letters from anywhere!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <h2 className="text-2xl font-bold mb-2">No Cover Letters Found</h2>
      <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Start building your professional cover letters and take the next step in your career!
      </p>
      <Link 
        to="/cover-letter" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300 text-lg font-medium"
      >
        <Plus size={20} />
        Create Your First Cover Letter
      </Link>
      
      <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
        <div className="flex items-start gap-2">
          <div className="text-blue-500 text-xl">💡</div>
          <div>
            <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Tip: Connect Google Drive to sync your cover letters across devices!
            </p>
            <Link
              to="/cloud-setup"
              className={`inline-block mt-2 text-sm underline ${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Connect Google Drive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper function to determine storage source
  const getStorageSource = (letter) => {
    // Check for explicit storage type first
    if (letter.storageType) {
      return letter.storageType === 'local' ? 'local-storage' : 'google-drive';
    }
    
    // Check for local storage indicators
    if (letter.syncedToCloud === false || 
        letter.id?.startsWith('local_cl_') ||
        letter.localStorage_only ||
        letter.local_only) {
      return 'local-storage';
    }
    
    // Check for Google Drive indicators
    if (letter.syncedToCloud === true ||
        letter.file_id ||
        letter.drive_file_id ||
        letter.google_drive_id) {
      return 'google-drive';
    }
    
    // Default based on context - if we're showing this in the dashboard
    // and Google Drive is connected, assume it's from Google Drive
    // unless explicitly marked as local
    if (googleDriveConnected && !letter.id?.includes('local')) {
      return 'google-drive';
    }
    
    return 'local-storage';
  };

  // Storage source indicator component
  const StorageSourceBadge = ({ source, size = 'sm' }) => {
    const isGoogleDrive = source === 'google-drive';
    const sizeClasses = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';
    
    return (
      <span 
        className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${
          isGoogleDrive
            ? darkMode 
              ? 'bg-blue-900/30 text-blue-300 border border-blue-700/30'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
            : darkMode
              ? 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
              : 'bg-gray-100 text-gray-600 border border-gray-300'
        }`}
        title={isGoogleDrive ? 'Stored in Google Drive' : 'Stored in Local Storage'}
      >
        {isGoogleDrive ? (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.5 15.5L10.5 8.5L14.5 15.5H6.5ZM19.2 15.5H15.5L12.5 10.5L15.5 5.5L19.2 15.5ZM4.8 15.5L8.5 10.5L12.5 15.5H4.8Z"/>
          </svg>
        ) : (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.18L19.14 8L12 11.82L4.86 8L12 4.18ZM4 9.68L11 13.32V19.64L4 16V9.68ZM13 19.64V13.32L20 9.68V16L13 19.64Z"/>
          </svg>
        )}
        {isGoogleDrive ? 'Drive' : 'Local'}
      </span>
    );
  };

  const CoverLetterCard = ({ letter }) => (
    <div className={`rounded-xl shadow-md p-3 backdrop-blur-sm border border-white/10 ${
      darkMode ? 'bg-gray-800/80' : 'bg-white/80'
    }`}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1 pr-2">
          <h3 className="font-medium text-sm truncate">{letter.title || 'Untitled'}</h3>
          <div className="mt-1">
            <StorageSourceBadge source={getStorageSource(letter)} size="xs" />
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(letter.id)}
          className={`p-1 rounded-full transition-colors flex-shrink-0 ${
            letter.is_favorite 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-400 hover:text-yellow-500'
          }`}
        >
          <Star size={14} fill={letter.is_favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className={`text-xs mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <div className="truncate">
          <span className="font-medium">Company:</span> {letter.company_name || 'Not specified'}
        </div>
        <div className="truncate">
          <span className="font-medium">Position:</span> {letter.job_title || 'Not specified'}
        </div>
        <div className="truncate">
          <span className="font-medium">Updated:</span> {formatDate(letter.updated_at)}
        </div>
      </div>
      
      <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1">
          <button
            onClick={() => handlePreview(letter)}
            className="px-2 py-1 text-xs rounded-md bg-gradient-to-r from-blue-600/10 to-blue-600/5 hover:from-blue-600/20 hover:to-blue-600/10 transition-colors"
          >
            <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
              View
            </span>
          </button>

          <button
            onClick={() => navigate(`/cover-letters/${letter.id}/edit`)}
            className="px-2 py-1 text-xs rounded-md bg-gradient-to-r from-green-600/10 to-green-600/5 hover:from-green-600/20 hover:to-green-600/10 transition-colors"
          >
            <span className={darkMode ? 'text-green-400' : 'text-green-600'}>
              Edit
            </span>
          </button>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(letter.id)}
          disabled={isDeleting}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            isDeleting
              ? 'opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600/10 to-red-600/5 hover:from-red-600/20 hover:to-red-600/10'
          }`}
        >
          <span className={darkMode ? 'text-red-400' : 'text-red-600'}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </span>
        </button>
      </div>
    </div>
  );

  // UPDATED: Main render logic with proper state handling
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 right-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* UPDATED: Conditional rendering based on session and Google Drive state */}
        {!sessionToken ? (
          <div className={`rounded-xl shadow-md backdrop-blur-sm border border-white/10 ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}>
            <NoSessionState />
          </div>
        ) : !googleDriveConnected ? (
          <div className={`rounded-xl shadow-md backdrop-blur-sm border border-white/10 ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}>
            <NoGoogleDriveState />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-4">
              <h1 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Your AI Cover Letters
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage all your AI-generated cover letters stored in Google Drive
              </p>
            </div>
            
            {/* Action bar */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4">
              <div className="flex items-center">
                <Link 
                  to="/cover-letter" 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102"
                >
                  <Plus size={14} />
                  Generate New Cover Letter
                </Link>
                
                <button
                  onClick={loadCoverLetters}
                  disabled={isLoading}
                  className={`p-1.5 ml-2 rounded-full shadow-sm transition-all duration-300 ${
                    isLoading
                      ? 'opacity-50 cursor-not-allowed bg-gray-500'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md hover:shadow-purple-500/20'
                  } text-white`}
                  title="Refresh"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                </button>
                
                <button 
                  onClick={() => setIsCardView(!isCardView)} 
                  className={`p-1.5 ml-2 rounded-full ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-white/80 text-gray-600 hover:bg-gray-100'
                  } shadow-sm transition-colors`}
                  title={isCardView ? 'Switch to List View' : 'Switch to Card View'}
                >
                  {isCardView ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search cover letters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-8 pr-3 py-1.5 rounded-md w-full sm:w-56 text-xs ${
                      darkMode 
                        ? 'bg-gray-800/90 border border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500' 
                        : 'bg-white/90 border border-gray-300/50 text-gray-800 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3.5 w-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="favorites-filter"
                    checked={filterFavorites}
                    onChange={() => setFilterFavorites(!filterFavorites)}
                    className="h-3.5 w-3.5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <label htmlFor="favorites-filter" className="ml-1.5 text-xs">
                    Show Favorites Only
                  </label>
                </div>
              </div>
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mb-3"></div>
                <p className="text-sm ml-2">Loading cover letters...</p>
              </div>
            )}
            
            {/* Empty state */}
            {!isLoading && coverLetters.length === 0 && (
              <div className={`rounded-xl shadow-md backdrop-blur-sm border border-white/10 ${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              }`}>
                <EmptyState />
              </div>
            )}
            
            {/* Cover letter grid view */}
            {!isLoading && coverLetters.length > 0 && isCardView && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAndSortedCoverLetters().map(letter => (
                  <CoverLetterCard key={letter.id} letter={letter} />
                ))}
              </div>
            )}
            
            {/* Cover letter table view */}
            {!isLoading && coverLetters.length > 0 && !isCardView && (
              <div className={`rounded-xl overflow-hidden shadow-md backdrop-blur-sm border border-white/10 ${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              }`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200/20 dark:divide-gray-700/20">
                    <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}>
                      <tr>
                        <th 
                          scope="col" 
                          className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange('title')}
                        >
                          <div className="flex items-center">
                            Title
                            {sortBy === 'title' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg"
                                className={`ml-1 h-3 w-3 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                          Source
                        </th>
                        <th 
                          scope="col" 
                          className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange('company_name')}
                        >
                          <div className="flex items-center">
                            Company
                            {sortBy === 'company_name' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg"
                                className={`ml-1 h-3 w-3 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                          onClick={() => handleSortChange('job_title')}
                        >
                          <div className="flex items-center">
                            Position
                            {sortBy === 'job_title' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg"
                                className={`ml-1 h-3 w-3 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hidden md:table-cell"
                          onClick={() => handleSortChange('updated_at')}
                        >
                          <div className="flex items-center">
                            Last Updated
                            {sortBy === 'updated_at' && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg"
                                className={`ml-1 h-3 w-3 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${darkMode ? 'divide-y divide-gray-700/20' : 'divide-y divide-gray-200/20'}`}>
                      {filteredAndSortedCoverLetters().map((letter) => (
                        <tr key={letter.id} className={darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/50'}>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-xs font-medium truncate max-w-[120px]">
                                {letter.title || 'Untitled'}
                              </div>
                              {letter.is_favorite && (
                                <Star size={12} className="ml-1 text-yellow-500" fill="currentColor" />
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <StorageSourceBadge source={getStorageSource(letter)} size="xs" />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs truncate max-w-[100px]">
                              {letter.company_name || 'Not specified'}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-xs truncate max-w-[120px]">
                              {letter.job_title || 'Not specified'}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
                            <div className="text-xs">{formatDate(letter.updated_at)}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-right text-xs">
                            <div className="flex justify-end space-x-1"> 
                              <button
                                onClick={() => toggleFavorite(letter.id)}
                                className={`p-1 rounded-full transition-colors ${
                                  letter.is_favorite 
                                    ? 'text-yellow-500 hover:text-yellow-600' 
                                    : darkMode ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                                }`}
                                title={letter.is_favorite ? "Remove from favorites" : "Add to favorites"}
                              >
                                <Star size={14} fill={letter.is_favorite ? 'currentColor' : 'none'} />
                              </button>
                              
                              <button
                                onClick={() => handlePreview(letter)}
                                className={`p-1 rounded-full ${darkMode ? 'text-blue-400 hover:bg-blue-600/20' : 'text-blue-600 hover:bg-blue-100/50'}`}
                                title="View"
                              >
                                <Eye size={14} />
                              </button>

                              <button
                                onClick={() => navigate(`/cover-letters/${letter.id}/edit`)}
                                className={`p-1 rounded-full ${darkMode ? 'text-green-400 hover:bg-green-600/20' : 'text-green-600 hover:bg-green-100/50'}`}
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              
                              <button
                                onClick={() => setShowDeleteConfirm(letter.id)}
                                disabled={isDeleting}
                                className={`p-1 rounded-full transition-colors ${
                                  isDeleting
                                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                                    : darkMode ? 'text-red-400 hover:bg-red-600/20' : 'text-red-600 hover:bg-red-100/50'
                                }`}
                                title="Delete"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* No results after filtering */}
            {!isLoading && coverLetters.length > 0 && filteredAndSortedCoverLetters().length === 0 && (
              <div className={`text-center py-6 rounded-xl shadow-md backdrop-blur-sm border border-white/10 ${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No cover letters match your search criteria
                </p>
              </div>
            )}
            
            {/* Mobile add button */}
            <div className="md:hidden fixed bottom-6 right-6">
              <Link
                to="/cover-letter"
                className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                aria-label="Create New Cover Letter"
              >
                <Plus size={20} />
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          id={showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
      
      {/* Preview modal */}
      {previewLetter && (
        <PreviewModal
          letter={previewLetter}
          onClose={closePreview}
        />
      )}
    </div>
  );
};

export default CoverLetterDashboard;