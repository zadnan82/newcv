// src/components/auth/CloudProviderButton.jsx
import React from 'react';

const CloudProviderButton = ({ provider, name, icon, onClick, loading, darkMode }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
        darkMode 
          ? 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 hover:border-gray-500'
          : 'bg-white/90 border-gray-300 text-gray-800 hover:bg-white hover:border-gray-400'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">
        {loading ? 'Connecting...' : `Connect ${name}`}
      </span>
    </button>
  );
};

export default CloudProviderButton;