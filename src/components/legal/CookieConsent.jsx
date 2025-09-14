import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Small timeout to avoid immediate popup on first load
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowBanner(false);
  };
  
  const handleDecline = () => {
    // Set a value to remember they declined
    localStorage.setItem('cookie-consent-declined', 'true');
    // You should implement logic to disable non-essential cookies here
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-4 px-4 md:px-6 shadow-lg z-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="pr-4">
            <p className="text-sm md:text-base">
              {t('cookies.message', 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.')}
              <Link to="/cookies" className="underline ml-1 text-blue-300 hover:text-blue-200">
                {t('cookies.learnMore', 'Learn more')}
              </Link>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="text-sm px-4 py-2 border border-gray-400 rounded hover:bg-gray-700 transition-colors"
            >
              {t('cookies.decline', 'Decline')}
            </button>
            <button
              onClick={handleAccept}
              className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              {t('cookies.accept', 'Accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;