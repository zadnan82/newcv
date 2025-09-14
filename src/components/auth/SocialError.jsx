import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  

const SocialError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); 
  const [error, setError] = useState('Authentication failed');


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorMessage = searchParams.get('error');
    
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [location]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{t('auth.error.title')}</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('auth.error.return_to_login')}
        </button>
      </div>
    </div>
  );
};

export default SocialError;