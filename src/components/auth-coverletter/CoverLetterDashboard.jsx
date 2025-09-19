import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCoverLetterStore from '../../stores/coverLetterStore';
import useSessionStore from '../../stores/sessionStore'; // FIXED: Use session store instead of auth store
import toast from 'react-hot-toast';
import { Plus, Edit, Eye, Trash, FileText, Settings, RefreshCw, Star } from 'lucide-react';

const CoverLetterDashboard = ({ darkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); 
  
  // FIXED: Use session store for authentication
  const { sessionToken, googleDriveConnected } = useSessionStore();
  
  const {
    coverLetters,
    fetchCoverLetters,
    deleteCoverLetter,
    toggleFavorite,
    isLoading,
    error,
    clearError,
    formatCoverLetter
  } = useCoverLetterStore();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [previewLetter, setPreviewLetter] = useState(null);
  const [isCardView, setIsCardView] = useState(window.innerWidth < 768);
  
  // Listen for window resize to toggle between table and card view
  useEffect(() => {
    const handleResize = () => {
      setIsCardView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // FIXED: Check session authentication instead of old auth system
  useEffect(() => {
    if (sessionToken && googleDriveConnected) {
      loadCoverLetters();
    } else if (!sessionToken) {
      navigate('/');
      toast.error('Please connect to Google Drive to access your cover letters');
    } else if (!googleDriveConnected) {
      navigate('/cloud-setup');
      toast.info('Connect Google Drive to save and access cover letters');
    }
  }, [sessionToken, googleDriveConnected, navigate]);
  
  // Effect for error handling
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);
  
  // Load cover letters - FIXED for session-based auth
  const loadCoverLetters = async () => {
    try {
      console.log('📋 Loading cover letters from Google Drive...');
      await fetchCoverLetters();
      console.log('✅ Cover letters loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load cover letters:', error);
      toast.error('Failed to load cover letters. Please try again.');
    }
  };
  
  // Handle cover letter deletion - FIXED
  const handleDelete = async (id) => {
    try {
      console.log('🗑️ Deleting cover letter:', id);
      await deleteCoverLetter(id);
      toast.success('Cover letter deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('❌ Delete failed:', error);
      toast.error('Failed to delete cover letter. Please try again.');
    }
  };
  
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // FIXED: Handle preview with proper formatting
  // FIXED: Handle preview with proper formatting
const handlePreview = (letter) => {
  try {
    console.log('👁️ Previewing cover letter:', letter);
    
    // Use the store's format function
    const formattedLetter = formatCoverLetter(letter);
    
    setPreviewLetter({
      ...letter,
      formattedContent: formattedLetter
    });
  } catch (error) {
    console.error('❌ Error formatting letter for preview:', error);
    toast.error('Failed to preview cover letter');
  }
};
  
  // Close preview modal
  const closePreview = () => {
    setPreviewLetter(null);
  };
  
  // Sort and filter cover letters
  const filteredAndSortedCoverLetters = () => {
    let filtered = [...coverLetters];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(letter => 
        (letter.title && letter.title.toLowerCase().includes(term)) ||
        (letter.company_name && letter.company_name.toLowerCase().includes(term)) ||
        (letter.job_title && letter.job_title.toLowerCase().includes(term))
      );
    }
    
    // Apply favorites filter
    if (filterFavorites) {
      filtered = filtered.filter(letter => letter.is_favorite);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];
      
      // Handle dates
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }
      
      // Handle strings
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
      }
      if (typeof valueB === 'string') {
        valueB = valueB.toLowerCase();
      }
      
      // Compare based on sort order
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Delete confirmation modal
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
            className={`px-3 py-1.5 rounded-md text-xs shadow-md transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(id)}
            className="px-3 py-1.5 rounded-md text-xs bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-red-500/20 hover:scale-102"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Preview modal
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
            {letter.title}
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
            {letter.formattedContent}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(letter.formattedContent);
              toast.success('Cover letter copied to clipboard!');
            }}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Copy
          </button>
          
          <button 
            onClick={() => {
              const blob = new Blob([letter.formattedContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Cover_Letter_${letter.job_title || 'Untitled'}.txt`.replace(/\s+/g, '_');
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast.success('Cover letter downloaded successfully!');
            }}
            className="px-3 py-1.5 rounded-md text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-blue-500/20 hover:scale-102"
          >
            Download
          </button>
          
          {/* Note: Edit functionality would need to be implemented */}
          <button
            onClick={() => toast.info('Edit functionality coming soon!')}
            className="px-3 py-1.5 rounded-md text-xs bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-green-500/20 hover:scale-102 ml-auto"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-6">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-12 w-12 mx-auto mb-3 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
        />
      </svg>
      <h3 className="text-lg font-semibold mb-2">
        No Cover Letters Yet
      </h3>
      <p className={`mb-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        You haven't created any cover letters yet. Get started by creating your first AI-generated cover letter.
      </p>
      <Link 
        to="/cover-letter" 
        className="px-4 py-2 rounded-md text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102"
      >
        Create Your First Cover Letter
      </Link>
    </div>
  );

  // Card view for mobile
  const CoverLetterCard = ({ letter }) => (
    <div className={`rounded-xl shadow-md p-3 backdrop-blur-sm border border-white/10 ${
      darkMode ? 'bg-gray-800/80' : 'bg-white/80'
    }`}>
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-sm truncate pr-2">{letter.title || 'Untitled'}</h3>
        
      </div>
      
      <div className={`text-xs mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
        </div>
        <button
          onClick={() => setShowDeleteConfirm(letter.id)}
          className="px-2 py-1 text-xs rounded-md bg-gradient-to-r from-red-600/10 to-red-600/5 hover:from-red-600/20 hover:to-red-600/10 transition-colors"
        >
          <span className={darkMode ? 'text-red-400' : 'text-red-600'}>
            Delete
          </span>
        </button>
      </div>
    </div>
  );

  // Show connection prompt if not connected
  if (!googleDriveConnected) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className={`rounded-xl shadow-md backdrop-blur-sm border border-white/10 py-12 text-center ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 21l4-4 4 4"/>
            </svg>
            <h2 className="text-xl font-bold mb-2">Connect Google Drive</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect your Google Drive to save and access your AI-generated cover letters
            </p>
            <Link
              to="/cloud-setup"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300"
            >
              Connect Google Drive
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              className="p-1.5 ml-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:shadow-md hover:shadow-purple-500/20 transition-all duration-300"
              title="Refresh"
            >
              <RefreshCw size={14} />
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
            {/* Search box */}
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
            
            {/* Favorites filter */}
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
          <div className={`rounded-xl shadow-md backdrop-blur-sm border border-white/10 py-6 ${
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
                        <div className="text-xs font-medium truncate max-w-[120px]">{letter.title || 'Untitled'}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs truncate max-w-[80px]">{letter.company_name || 'N/A'}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-xs truncate max-w-[100px]">{letter.job_title || 'N/A'}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs">{formatDate(letter.updated_at)}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-xs">
                        <div className="flex justify-end space-x-1"> 
                          {/* View button */}
                          <button
                            onClick={() => handlePreview(letter)}
                            className={`p-1 rounded-full ${darkMode ? 'text-blue-400 hover:bg-blue-600/20' : 'text-blue-600 hover:bg-blue-100/50'}`}
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          
                          {/* Delete button */}
                          <button
                            onClick={() => setShowDeleteConfirm(letter.id)}
                            className={`p-1 rounded-full ${darkMode ? 'text-red-400 hover:bg-red-600/20' : 'text-red-600 hover:bg-red-100/50'}`}
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