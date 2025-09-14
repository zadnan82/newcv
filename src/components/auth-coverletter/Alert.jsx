import React from 'react';

const Alert = ({ children, type = 'error', dismissible = false, onDismiss }) => { 
  const alertStyles = {
    success: 'bg-gradient-to-r from-green-50 to-green-100 border-green-400 text-green-700',
    error: 'bg-gradient-to-r from-red-50 to-pink-100 border-red-400 text-red-700',
    warning: 'bg-gradient-to-r from-yellow-50 to-amber-100 border-yellow-400 text-yellow-700',
    info: 'bg-gradient-to-r from-blue-50 to-purple-100 border-purple-400 text-purple-700',
  };
   
  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-purple-500',
  };
  
  return (
    <div 
      className={`p-4 mb-4 rounded-2xl border-l-4 shadow-sm ${alertStyles[type]} transition-all duration-300 hover:shadow-md`} 
      role="alert"
    >
      <div className="flex items-center">
        {type === 'success' && (
          <svg className={`w-5 h-5 mr-2 ${iconColors[type]}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        )}
        
        {type === 'error' && (
          <svg className={`w-5 h-5 mr-2 ${iconColors[type]}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
        )}
        
        {type === 'warning' && (
          <svg className={`w-5 h-5 mr-2 ${iconColors[type]}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
        )}
        
        {type === 'info' && (
          <svg className={`w-5 h-5 mr-2 ${iconColors[type]}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 002 0v-3a1 1 0 00-2 0v3z" clipRule="evenodd"/>
          </svg>
        )}
        
        <span className="font-medium">{children}</span>
        
        {dismissible && (
          <button 
            type="button" 
            className={`ml-auto -mx-1.5 -my-1.5 rounded-full p-1.5 hover:bg-opacity-20 ${
              type === 'error' ? 'hover:bg-red-200' : 
              type === 'success' ? 'hover:bg-green-200' : 
              type === 'warning' ? 'hover:bg-yellow-200' : 
              'hover:bg-purple-200'
            } inline-flex items-center justify-center h-8 w-8 transition-colors`}
            onClick={onDismiss}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;